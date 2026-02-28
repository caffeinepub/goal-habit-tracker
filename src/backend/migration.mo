import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type OldSubject = {
    id : Nat;
    name : Text;
    description : Text;
    days : [Bool];
    isWeak : Bool;
  };

  type OldUserData = {
    subjects : [OldSubject];
    mockScores : [Nat];
  };

  type OldActor = {
    nextSubjectId : Nat;
    userDataStore : Map.Map<Principal, OldUserData>;
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

  type NewUserData = {
    subjects : [OldSubject];
    mockScores : [Nat];
    studySessions : [StudySession];
    questionProgress : [SubjectQuestionProgress];
  };

  type NewActor = {
    nextSubjectId : Nat;
    userDataStore : Map.Map<Principal, NewUserData>;
  };

  public func run(old : OldActor) : NewActor {
    let newUserStore = old.userDataStore.map<Principal, OldUserData, NewUserData>(
      func(_p, oldUserData) {
        {
          oldUserData with
          studySessions = [];
          questionProgress = [];
        };
      }
    );

    {
      old with userDataStore = newUserStore;
    };
  };
};
