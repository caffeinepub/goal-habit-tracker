import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";


// Persistent state with upgrade migration.

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Data types
  public type Subject = {
    id : Nat;
    name : Text;
    description : Text;
    days : [Bool];
    isWeak : Bool;
  };

  public type MockTestScore = {
    subject : Text;
    score : Nat;
    totalMarks : Nat;
    date : Text;
  };

  public type StudySession = {
    subjectName : Text;
    hours : Float;
    date : Text;
  };

  public type SubjectQuestionProgress = {
    subjectName : Text;
    count : Nat;
  };

  public type MonthlyLogEntry = {
    date : Text;
    count : Nat;
  };

  type Section = {
    #studyplan;
    #questions;
    #dailyroutine;
  };

  type SectionTimeLog = {
    section : Section;
    date : Text;
    elapsedSeconds : Nat;
  };

  type SectionPlanCycle = {
    section : Section;
    startDate : Text;
    endDate : Text;
    summary : Nat;
  };

  public type UserData = {
    subjects : [Subject];
    mockScores : [MockTestScore];
    studySessions : [StudySession];
    questionProgress : [SubjectQuestionProgress];
    monthlyLogs : [MonthlyLogEntry];
    sectionTimes : [SectionTimeLog];
    planCycles : [SectionPlanCycle];
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

  public type Question = {
    id : Nat;
    subject : Text;
    questionText : Text;
    questionType : Text;
    options : [Text];
    correctAnswer : Text;
    difficulty : Text;
    createdAt : Text;
  };

  public type ExamSession = {
    id : Nat;
    subject : Text;
    totalQuestions : Nat;
    correctAnswers : Nat;
    timeTakenSeconds : Nat;
    difficulty : Text;
    completedAt : Text;
  };

  public type NotebookEntry = {
    id : Nat;
    subject : Text;
    title : Text;
    content : Text;
    createdAt : Text;
    updatedAt : Text;
  };

  public type NotepadEntry = {
    id : Nat;
    subject : Text;
    content : Text;
    createdAt : Text;
    updatedAt : Text;
  };

  public type UserEntries = {
    nextQuestionId : Nat;
    nextExamSessionId : Nat;
    nextNotebookEntryId : Nat;
    nextNotepadEntryId : Nat;
    questions : [Question];
    examSessions : [ExamSession];
    notebookEntries : [NotebookEntry];
    notepadEntries : [NotepadEntry];
  };

  public type FileMetadata = {
    id : Nat;
    fileName : Text;
    mimeType : Text;
    sizeBytes : Nat;
    blobUrl : Text;
    uploadedAt : Text;
  };

  public type FileMetadataStore = {
    nextFileId : Nat;
    files : [FileMetadata];
  };

  // Persistent stores
  let nextSubjectIdStore = Map.empty<Principal, Nat>();
  let userDataStore = Map.empty<Principal, UserData>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let userTargetsStore = Map.empty<Principal, UserTargets>();
  let userEntriesStore = Map.empty<Principal, UserEntries>();
  let fileMetadataStore = Map.empty<Principal, FileMetadataStore>();
  let customSubjectsStore = Map.empty<Principal, [Text]>();

  // Authentication helper functions
  func ensureUserRegistered(caller : Principal) {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot access this resource");
    };
    let currentRole = AccessControl.getUserRole(accessControlState, caller);
    switch (currentRole) {
      case (#guest) {
        AccessControl.assignRole(accessControlState, caller, caller, #user);
      };
      case (#user or #admin) {};
    };
  };

  func requireUserPermission(caller : Principal) {
    ensureUserRegistered(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
  };

  func getOrCreateUserEntries(p : Principal) : UserEntries {
    switch (userEntriesStore.get(p)) {
      case (null) {
        let newEntries = {
          nextQuestionId = 1;
          nextExamSessionId = 1;
          nextNotebookEntryId = 1;
          nextNotepadEntryId = 1;
          questions = [];
          examSessions = [];
          notebookEntries = [];
          notepadEntries = [];
        };
        userEntriesStore.add(p, newEntries);
        newEntries;
      };
      case (?entries) { entries };
    };
  };

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
          sectionTimes = [];
          planCycles = [];
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

  // User Profile & Target Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    requireUserPermission(caller);
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    requireUserPermission(caller);
    if (not Principal.equal(caller, user) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    requireUserPermission(caller);
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getTargets() : async UserTargets {
    requireUserPermission(caller);
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
    requireUserPermission(caller);
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
    requireUserPermission(caller);
    getOrCreateUserData(caller).subjects;
  };

  public shared ({ caller }) func addSubject(name : Text, description : Text) : async () {
    requireUserPermission(caller);
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
    requireUserPermission(caller);
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
    requireUserPermission(caller);
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

  // Custom Subjects Functions
  public shared ({ caller }) func setCustomSubjects(subjects : [Text]) : async () {
    requireUserPermission(caller);
    customSubjectsStore.add(caller, subjects);
  };

  public query ({ caller }) func getCustomSubjects() : async [Text] {
    requireUserPermission(caller);
    switch (customSubjectsStore.get(caller)) {
      case (null) { [] };
      case (?subjects) { subjects };
    };
  };

  // Mock Test Scores Functions
  public query ({ caller }) func getMockScores() : async [MockTestScore] {
    requireUserPermission(caller);
    getOrCreateUserData(caller).mockScores;
  };

  public shared ({ caller }) func addMockScore(subject : Text, score : Nat, totalMarks : Nat, date : Text) : async () {
    requireUserPermission(caller);
    let userData = getOrCreateUserData(caller);

    let newScore : MockTestScore = {
      subject;
      score;
      totalMarks;
      date;
    };

    let updatedScores = userData.mockScores.concat([newScore]);
    userDataStore.add(caller, { userData with mockScores = updatedScores });
  };

  // Study Sessions Functions
  public shared ({ caller }) func addStudySession(subjectName : Text, hours : Float, date : Text) : async () {
    requireUserPermission(caller);
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
    requireUserPermission(caller);
    getOrCreateUserData(caller).studySessions;
  };

  public shared ({ caller }) func setStudySession(subjectName : Text, hours : Float, date : Text) : async () {
    requireUserPermission(caller);
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

  public shared ({ caller }) func addQuestions(subjectName : Text, count : Nat) : async () {
    requireUserPermission(caller);
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
    requireUserPermission(caller);
    getOrCreateUserData(caller).questionProgress;
  };

  public shared ({ caller }) func setQuestionCount(subjectName : Text, count : Nat) : async () {
    requireUserPermission(caller);
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

  public shared ({ caller }) func saveMonthlyLog(date : Text, count : Nat) : async () {
    requireUserPermission(caller);
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
    requireUserPermission(caller);
    getOrCreateUserData(caller).monthlyLogs;
  };

  // Section Time Logs
  public shared ({ caller }) func saveSectionTimeLog(section : Section, date : Text, elapsedSeconds : Nat) : async () {
    requireUserPermission(caller);
    let userData = getOrCreateUserData(caller);

    let filteredLogs = userData.sectionTimes.filter(
      func(log) {
        not (log.section == section and log.date == date);
      }
    );

    let newLog : SectionTimeLog = {
      section;
      date;
      elapsedSeconds;
    };

    let updatedLogs = filteredLogs.concat([newLog]);
    userDataStore.add(caller, { userData with sectionTimes = updatedLogs });
  };

  public query ({ caller }) func getSectionTimeLogs() : async [SectionTimeLog] {
    requireUserPermission(caller);
    getOrCreateUserData(caller).sectionTimes;
  };

  // Plan Cycle Archives
  public shared ({ caller }) func savePlanCycle(section : Section, startDate : Text, endDate : Text, summary : Nat) : async () {
    requireUserPermission(caller);
    let userData = getOrCreateUserData(caller);

    let filteredCycles = userData.planCycles.filter(
      func(cycle) {
        not (cycle.section == section and cycle.startDate == startDate and cycle.endDate == endDate);
      }
    );

    let newCycle : SectionPlanCycle = {
      section;
      startDate;
      endDate;
      summary;
    };

    let updatedCycles = filteredCycles.concat([newCycle]);
    userDataStore.add(caller, { userData with planCycles = updatedCycles });
  };

  public query ({ caller }) func getPlanCycles() : async [SectionPlanCycle] {
    requireUserPermission(caller);
    getOrCreateUserData(caller).planCycles;
  };

  // Question and Exam Functions
  public shared ({ caller }) func addQuestion(
    subject : Text,
    questionText : Text,
    questionType : Text,
    options : [Text],
    correctAnswer : Text,
    difficulty : Text,
    createdAt : Text,
  ) : async () {
    requireUserPermission(caller);
    let entries = getOrCreateUserEntries(caller);

    let newQuestion : Question = {
      id = entries.nextQuestionId;
      subject;
      questionText;
      questionType;
      options;
      correctAnswer;
      difficulty;
      createdAt;
    };

    let updatedQuestions = entries.questions.concat([newQuestion]);
    let updatedEntries = {
      entries with
      nextQuestionId = entries.nextQuestionId + 1;
      questions = updatedQuestions;
    };

    userEntriesStore.add(caller, updatedEntries);
  };

  public query ({ caller }) func getQuestions() : async [Question] {
    requireUserPermission(caller);
    getOrCreateUserEntries(caller).questions;
  };

  public query ({ caller }) func getQuestionsBySubject(subject : Text) : async [Question] {
    requireUserPermission(caller);
    let entries = getOrCreateUserEntries(caller);
    entries.questions.filter(func(q) { q.subject == subject });
  };

  public shared ({ caller }) func deleteQuestion(id : Nat) : async () {
    requireUserPermission(caller);
    let entries = getOrCreateUserEntries(caller);

    let updatedQuestions = entries.questions.filter(func(q) { q.id != id });

    if (entries.questions.size() == updatedQuestions.size()) {
      Runtime.trap("Question not found");
    };

    userEntriesStore.add(caller, { entries with questions = updatedQuestions });
  };

  public shared ({ caller }) func saveExamSession(
    subject : Text,
    totalQuestions : Nat,
    correctAnswers : Nat,
    timeTakenSeconds : Nat,
    difficulty : Text,
    completedAt : Text,
  ) : async () {
    requireUserPermission(caller);
    let entries = getOrCreateUserEntries(caller);

    let newSession : ExamSession = {
      id = entries.nextExamSessionId;
      subject;
      totalQuestions;
      correctAnswers;
      timeTakenSeconds;
      difficulty;
      completedAt;
    };

    let updatedSessions = entries.examSessions.concat([newSession]);
    let updatedEntries = {
      entries with
      nextExamSessionId = entries.nextExamSessionId + 1;
      examSessions = updatedSessions;
    };

    userEntriesStore.add(caller, updatedEntries);
  };

  public query ({ caller }) func getExamSessions() : async [ExamSession] {
    requireUserPermission(caller);
    getOrCreateUserEntries(caller).examSessions;
  };

  // Notebook and Notepad Functions
  public shared ({ caller }) func addNotebookEntry(
    subject : Text,
    title : Text,
    content : Text,
    createdAt : Text,
  ) : async () {
    requireUserPermission(caller);
    let entries = getOrCreateUserEntries(caller);

    let newEntry : NotebookEntry = {
      id = entries.nextNotebookEntryId;
      subject;
      title;
      content;
      createdAt;
      updatedAt = createdAt;
    };

    let updatedEntriesList = entries.notebookEntries.concat([newEntry]);
    let updatedEntries = {
      entries with
      nextNotebookEntryId = entries.nextNotebookEntryId + 1;
      notebookEntries = updatedEntriesList;
    };

    userEntriesStore.add(caller, updatedEntries);
  };

  public shared ({ caller }) func updateNotebookEntry(id : Nat, title : Text, content : Text, updatedAt : Text) : async () {
    requireUserPermission(caller);
    let entries = getOrCreateUserEntries(caller);

    let updatedEntriesList = entries.notebookEntries.map(
      func(entry) {
        if (entry.id == id) {
          { entry with title; content; updatedAt };
        } else { entry };
      }
    );

    userEntriesStore.add(caller, { entries with notebookEntries = updatedEntriesList });
  };

  public shared ({ caller }) func deleteNotebookEntry(id : Nat) : async () {
    requireUserPermission(caller);
    let entries = getOrCreateUserEntries(caller);

    let updatedEntriesList = entries.notebookEntries.filter(func(e) { e.id != id });

    if (entries.notebookEntries.size() == updatedEntriesList.size()) {
      Runtime.trap("Notebook entry not found");
    };

    userEntriesStore.add(caller, { entries with notebookEntries = updatedEntriesList });
  };

  public query ({ caller }) func getNotebookEntries() : async [NotebookEntry] {
    requireUserPermission(caller);
    getOrCreateUserEntries(caller).notebookEntries;
  };

  public shared ({ caller }) func addNotepadEntry(subject : Text, content : Text, createdAt : Text) : async () {
    requireUserPermission(caller);
    let entries = getOrCreateUserEntries(caller);

    let newEntry : NotepadEntry = {
      id = entries.nextNotepadEntryId;
      subject;
      content;
      createdAt;
      updatedAt = createdAt;
    };

    let updatedEntriesList = entries.notepadEntries.concat([newEntry]);
    let updatedEntries = {
      entries with
      nextNotepadEntryId = entries.nextNotepadEntryId + 1;
      notepadEntries = updatedEntriesList;
    };

    userEntriesStore.add(caller, updatedEntries);
  };

  public shared ({ caller }) func updateNotepadEntry(id : Nat, content : Text, updatedAt : Text) : async () {
    requireUserPermission(caller);
    let entries = getOrCreateUserEntries(caller);

    let updatedEntriesList = entries.notepadEntries.map(
      func(entry) {
        if (entry.id == id) {
          { entry with content; updatedAt };
        } else { entry };
      }
    );

    userEntriesStore.add(caller, { entries with notepadEntries = updatedEntriesList });
  };

  public shared ({ caller }) func deleteNotepadEntry(id : Nat) : async () {
    requireUserPermission(caller);
    let entries = getOrCreateUserEntries(caller);

    let updatedEntriesList = entries.notepadEntries.filter(func(e) { e.id != id });

    if (entries.notepadEntries.size() == updatedEntriesList.size()) {
      Runtime.trap("Notepad entry not found");
    };

    userEntriesStore.add(caller, { entries with notepadEntries = updatedEntriesList });
  };

  public query ({ caller }) func getNotepadEntries() : async [NotepadEntry] {
    requireUserPermission(caller);
    getOrCreateUserEntries(caller).notepadEntries;
  };

  // File Metadata Functions
  public shared ({ caller }) func saveFileMetadata(
    fileName : Text,
    mimeType : Text,
    sizeBytes : Nat,
    blobUrl : Text,
    uploadedAt : Text,
  ) : async Nat {
    requireUserPermission(caller);

    let currentStore = switch (fileMetadataStore.get(caller)) {
      case (null) { { nextFileId = 1; files = [] } };
      case (?store) { store };
    };

    let newFile : FileMetadata = {
      id = currentStore.nextFileId;
      fileName;
      mimeType;
      sizeBytes;
      blobUrl;
      uploadedAt;
    };

    let updatedFiles = currentStore.files.concat([newFile]);
    let updatedStore = {
      nextFileId = currentStore.nextFileId + 1;
      files = updatedFiles;
    };

    fileMetadataStore.add(caller, updatedStore);

    newFile.id;
  };

  public query ({ caller }) func getAllFileMetadata() : async [FileMetadata] {
    requireUserPermission(caller);
    switch (fileMetadataStore.get(caller)) {
      case (null) { [] };
      case (?store) { store.files };
    };
  };

  public shared ({ caller }) func deleteFileMetadata(fileId : Nat) : async () {
    requireUserPermission(caller);

    let currentStore = switch (fileMetadataStore.get(caller)) {
      case (null) { Runtime.trap("No files found for user") };
      case (?store) { store };
    };

    let filteredFiles = currentStore.files.filter(func(f) { f.id != fileId });

    if (filteredFiles.size() == currentStore.files.size()) {
      Runtime.trap("File not found");
    };

    let updatedStore = {
      nextFileId = currentStore.nextFileId;
      files = filteredFiles;
    };

    fileMetadataStore.add(caller, updatedStore);
  };
};
