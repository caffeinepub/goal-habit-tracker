import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";


actor {
  type Subject = {
    id : Nat;
    name : Text;
    description : Text;
    days : [Bool];
    isWeak : Bool;
  };

  type StudySession = {
    subjectName : Text;
    hours : Float;
    date : Text;
  };

  type SubjectQuestionProgress = {
    subjectName : Text;
    count : Nat;
  };

  type MonthlyLogEntry = {
    date : Text;
    count : Nat;
  };

  type UserData = {
    subjects : [Subject];
    mockScores : [Nat];
    studySessions : [StudySession];
    questionProgress : [SubjectQuestionProgress];
    monthlyLogs : [MonthlyLogEntry];
  };

  public type UserProfile = {
    name : Text;
  };

  public type SubjectTarget = {
    name : Text;
    target : Nat;
  };

  public type UserTargets = {
    totalQuestionsGoal : Nat;
    dailyStudyHoursTarget : Float;
    subjectTargets : [SubjectTarget];
    planTotalDays : Nat;
  };

  let nextSubjectIdStore = Map.empty<Principal, Nat>();
  let userDataStore = Map.empty<Principal, UserData>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let userTargetsStore = Map.empty<Principal, UserTargets>();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Helper function to get or create user data
  func getOrCreateUserData(p : Principal) : UserData {
    switch (userDataStore.get(p)) {
      case (null) {
        let newData = {
          subjects = [];
          mockScores = [];
          studySessions = [];
          questionProgress = [];
          monthlyLogs = [];
        };
        userDataStore.add(p, newData);
        newData;
      };
      case (?data) { data };
    };
  };

  func getAndIncrementSubjectId(p : Principal) : Nat {
    let currentId = switch (nextSubjectIdStore.get(p)) {
      case (null) { 0 };
      case (?id) { id };
    };
    nextSubjectIdStore.add(p, currentId + 1);
    currentId;
  };

  // Get or default targets for a user
  func defaultTargets() : UserTargets = {
    totalQuestionsGoal = 9000;
    dailyStudyHoursTarget = 15.0;
    planTotalDays = 30;
    subjectTargets = [
      { name = "Maths"; target = 2000 },
      { name = "English"; target = 2000 },
      { name = "Reasoning"; target = 2000 },
      { name = "General Knowledge"; target = 1500 },
      { name = "Current Affairs"; target = 1000 },
      { name = "Computer"; target = 500 },
    ];
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Target Functions
  public query ({ caller }) func getTargets() : async UserTargets {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view targets");
    };
    switch (userTargetsStore.get(caller)) {
      case (null) { defaultTargets() };
      case (?targets) { targets };
    };
  };

  public shared ({ caller }) func setTargets(
    totalQuestionsGoal : Nat,
    dailyStudyHoursTarget : Float,
    subjectTargets : [SubjectTarget],
    planTotalDays : Nat,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set targets");
    };
    let newTargets : UserTargets = {
      totalQuestionsGoal;
      dailyStudyHoursTarget;
      subjectTargets;
      planTotalDays;
    };
    userTargetsStore.add(caller, newTargets);
  };

  // Subject Functions
  public query ({ caller }) func getSubjects() : async [Subject] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view subjects");
    };
    getOrCreateUserData(caller).subjects;
  };

  public shared ({ caller }) func addSubject(name : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add subjects");
    };
    let newSubject : Subject = {
      id = getAndIncrementSubjectId(caller);
      name;
      description;
      days = Array.tabulate<Bool>(30, func(_) { false });
      isWeak = false;
    };

    let userData = getOrCreateUserData(caller);
    let updatedSubjects = userData.subjects.concat([newSubject]);
    userDataStore.add(caller, { userData with subjects = updatedSubjects });
  };

  public shared ({ caller }) func deleteSubject(subjectId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete subjects");
    };
    let userData = getOrCreateUserData(caller);

    let updatedSubjects = userData.subjects.filter(
      func(subject) {
        subject.id != subjectId;
      }
    );

    if (updatedSubjects.size() == userData.subjects.size()) {
      Runtime.trap("Subject not found");
    };

    userDataStore.add(caller, { userData with subjects = updatedSubjects });
  };

  public shared ({ caller }) func toggleDay(subjectId : Nat, dayIndex : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can toggle days");
    };
    let userData = getOrCreateUserData(caller);

    let subjectIndex = switch (userData.subjects.findIndex(func(s) { s.id == subjectId })) {
      case (null) { Runtime.trap("Subject not found") };
      case (?idx) { idx };
    };

    let toggledSubjects = Array.tabulate(
      userData.subjects.size(),
      func(i) {
        if (i == subjectIndex) {
          let toggledDays = Array.tabulate(
            userData.subjects[i].days.size(),
            func(j) {
              if (j == dayIndex) { not userData.subjects[i].days[j] } else {
                userData.subjects[i].days[j];
              };
            },
          );
          { userData.subjects[i] with days = toggledDays };
        } else { userData.subjects[i] };
      },
    );

    userDataStore.add(caller, { userData with subjects = toggledSubjects });
  };

  // Mock Score Functions
  public query ({ caller }) func getMockScores() : async [Nat] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view mock scores");
    };
    getOrCreateUserData(caller).mockScores;
  };

  public shared ({ caller }) func addMockScore(score : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add mock scores");
    };
    let userData = getOrCreateUserData(caller);
    let updatedScores = userData.mockScores.concat([score]);
    userDataStore.add(caller, { userData with mockScores = updatedScores });
  };

  // Study Session Functions
  public shared ({ caller }) func addStudySession(subjectName : Text, hours : Float, date : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add study sessions");
    };
    let userData = getOrCreateUserData(caller);

    let newSession : StudySession = {
      subjectName;
      hours;
      date;
    };

    let updatedSessions = userData.studySessions.concat([newSession]);
    userDataStore.add(caller, { userData with studySessions = updatedSessions });
  };

  public query ({ caller }) func getStudySessions() : async [StudySession] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view study sessions");
    };
    getOrCreateUserData(caller).studySessions;
  };

  public shared ({ caller }) func setStudySession(subjectName : Text, hours : Float, date : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set study sessions");
    };
    let userData = getOrCreateUserData(caller);

    let filteredSessions = userData.studySessions.filter(
      func(session) {
        not (session.subjectName == subjectName and session.date == date);
      }
    );

    let updatedSessions = filteredSessions.concat([
      {
        subjectName;
        hours;
        date;
      }
    ]);

    userDataStore.add(caller, { userData with studySessions = updatedSessions });
  };

  // Question Progress Functions
  public shared ({ caller }) func addQuestions(subjectName : Text, count : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add questions");
    };
    let userData = getOrCreateUserData(caller);

    let currentProgress = userData.questionProgress.filter(
      func(progress) {
        progress.subjectName == subjectName;
      }
    );

    let newCount = if (currentProgress.size() > 0) {
      currentProgress[currentProgress.size() - 1].count + count;
    } else { count };

    let filteredProgress = userData.questionProgress.filter(
      func(progress) {
        progress.subjectName != subjectName;
      }
    );

    let updatedProgress = filteredProgress.concat([
      {
        subjectName;
        count = newCount;
      }
    ]);

    userDataStore.add(caller, { userData with questionProgress = updatedProgress });
  };

  public query ({ caller }) func getQuestionProgress() : async [SubjectQuestionProgress] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view question progress");
    };
    getOrCreateUserData(caller).questionProgress;
  };

  public shared ({ caller }) func setQuestionCount(subjectName : Text, count : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set question count");
    };
    let userData = getOrCreateUserData(caller);

    let filteredProgress = userData.questionProgress.filter(
      func(progress) {
        progress.subjectName != subjectName;
      }
    );

    let updatedProgress = filteredProgress.concat([
      {
        subjectName;
        count;
      }
    ]);

    userDataStore.add(caller, { userData with questionProgress = updatedProgress });
  };

  // Monthly Log Functions
  public shared ({ caller }) func saveMonthlyLog(date : Text, count : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save monthly logs");
    };
    let userData = getOrCreateUserData(caller);

    let filteredLogs = userData.monthlyLogs.filter(
      func(log) {
        log.date != date;
      }
    );

    let updatedLogs = filteredLogs.concat([
      {
        date;
        count;
      }
    ]);

    userDataStore.add(caller, { userData with monthlyLogs = updatedLogs });
  };

  public query ({ caller }) func getMonthlyLogs() : async [MonthlyLogEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view monthly logs");
    };
    getOrCreateUserData(caller).monthlyLogs;
  };
};
