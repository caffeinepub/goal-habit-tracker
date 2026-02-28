import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";



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

  type UserData = {
    subjects : [Subject];
    mockScores : [Nat];
    studySessions : [StudySession];
    questionProgress : [SubjectQuestionProgress];
  };

  var nextSubjectId = 0;
  let userDataStore = Map.empty<Principal, UserData>();

  func getOrCreateUserData(p : Principal) : UserData {
    switch (userDataStore.get(p)) {
      case (null) {
        let newData = {
          subjects = [];
          mockScores = [];
          studySessions = [];
          questionProgress = [];
        };
        userDataStore.add(p, newData);
        newData;
      };
      case (?data) { data };
    };
  };

  public query ({ caller }) func getSubjects() : async [Subject] {
    getOrCreateUserData(caller).subjects;
  };

  public shared ({ caller }) func addSubject(name : Text, description : Text) : async () {
    let newSubject : Subject = {
      id = nextSubjectId;
      name;
      description;
      days = Array.tabulate<Bool>(30, func(_) { false });
      isWeak = false;
    };
    nextSubjectId += 1;

    let userData = getOrCreateUserData(caller);
    let updatedSubjects = userData.subjects.concat([newSubject]);
    userDataStore.add(caller, { userData with subjects = updatedSubjects });
  };

  public shared ({ caller }) func deleteSubject(subjectId : Nat) : async () {
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

  public query ({ caller }) func getMockScores() : async [Nat] {
    getOrCreateUserData(caller).mockScores;
  };

  public shared ({ caller }) func addMockScore(score : Nat) : async () {
    let userData = getOrCreateUserData(caller);
    let updatedScores = userData.mockScores.concat([score]);
    userDataStore.add(caller, { userData with mockScores = updatedScores });
  };

  public shared ({ caller }) func addStudySession(subjectName : Text, hours : Float, date : Text) : async () {
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
    getOrCreateUserData(caller).studySessions;
  };

  public shared ({ caller }) func addQuestions(subjectName : Text, count : Nat) : async () {
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
    getOrCreateUserData(caller).questionProgress;
  };
};

