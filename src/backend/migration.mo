import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Set "mo:core/Set";

module {
  // Old types from the previous version
  type Goal = {
    id : Nat;
    title : Text;
    description : Text;
    targetCount : Nat;
  };

  type GoalEntry = {
    goalId : Nat;
    date : Text;
    timestamp : Int;
  };

  type OldActor = {
    nextGoalId : Nat;
    goals : Map.Map<(Principal, Nat), Goal>;
    goalEntries : Set.Set<GoalEntry>;
  };

  // New types for the current version
  type Subject = {
    id : Nat;
    name : Text;
    description : Text;
    days : [Bool];
    isWeak : Bool;
  };

  type UserData = {
    subjects : [Subject];
    mockScores : [Nat];
  };

  type NewActor = {
    userDataStore : Map.Map<Principal, UserData>;
    nextSubjectId : Nat;
  };

  func dropOldState({ nextGoalId : Nat; goals : Map.Map<(Principal, Nat), Goal>; goalEntries : Set.Set<GoalEntry> }) : () {};

  public func run(old : OldActor) : NewActor {
    dropOldState(old);
    {
      userDataStore = Map.empty<Principal, UserData>();
      nextSubjectId = 0;
    };
  };
};
