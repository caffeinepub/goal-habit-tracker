import Map "mo:core/Map";
import Set "mo:core/Set";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

actor {
  module Keys {
    public func compare(key1 : (Principal, Nat), key2 : (Principal, Nat)) : Order.Order {
      switch (Principal.compare(key1.0, key2.0)) {
        case (#less) { #less };
        case (#greater) { #greater };
        case (#equal) { Nat.compare(key1.1, key2.1) };
      };
    };
  };

  module Goal {
    type Goal = {
      id : Nat;
      title : Text;
      description : Text;
      targetCount : Nat;
    };

    public func compare(goal1 : Goal, goal2 : Goal) : Order.Order {
      Nat.compare(goal1.id, goal2.id);
    };
  };

  module GoalEntry {
    type GoalEntry = {
      goalId : Nat;
      date : Text;
      timestamp : Time.Time;
    };

    public func compare(entry1 : GoalEntry, entry2 : GoalEntry) : Order.Order {
      switch (Nat.compare(entry1.goalId, entry2.goalId)) {
        case (#less) { #less };
        case (#greater) { #greater };
        case (#equal) { Text.compare(entry1.date, entry2.date) };
      };
    };
  };

  type Goal = {
    id : Nat;
    title : Text;
    description : Text;
    targetCount : Nat;
  };

  type GoalEntry = {
    goalId : Nat;
    date : Text;
    timestamp : Time.Time;
  };

  type ProgressEntry = {
    date : Text;
    count : Nat;
  };

  // Storage
  var nextGoalId = 0;

  let goals = Map.empty<(Principal, Nat), Goal>();
  let goalEntries = Set.empty<GoalEntry>();

  // Goal Management
  public shared ({ caller }) func createGoal(title : Text, description : Text, targetCount : Nat) : async Goal {
    let goalId = nextGoalId;
    let goal = {
      id = goalId;
      title;
      description;
      targetCount;
    };

    goals.add((caller, goalId), goal);
    nextGoalId += 1;
    goal;
  };

  public query ({ caller }) func getGoals() : async [Goal] {
    goals.filter(func((key, _)) { key.0 == caller }).values().toArray();
  };

  public shared ({ caller }) func updateGoal(goalId : Nat, title : Text, description : Text, targetCount : Nat) : async () {
    let key = (caller, goalId);

    let updatedGoal = switch (goals.get(key)) {
      case (null) { Runtime.trap("Goal does not exist") };
      case (?_goal) {
        {
          id = goalId;
          title;
          description;
          targetCount;
        };
      };
    };

    goals.add(key, updatedGoal);
  };

  public shared ({ caller }) func deleteGoal(goalId : Nat) : async () {
    let key = (caller, goalId);
    if (not goals.containsKey((caller, goalId))) { Runtime.trap("Goal does not exist") };
    goals.remove(key);

    // Remove related entries
    let entriesToRemove = getEntriesForGoalInternal(caller, goalId);
    for (entry in entriesToRemove) {
      goalEntries.remove(entry);
    };
  };

  // Entry and Completion Tracking
  public shared ({ caller }) func logCompletion(goalId : Nat, date : Text) : async () {
    let entry : GoalEntry = {
      goalId;
      date;
      timestamp = Time.now();
    };

    if (not goals.containsKey((caller, goalId))) { Runtime.trap("Goal does not exist") };

    // Toggle completion
    if (goalEntries.contains(entry)) {
      goalEntries.remove(entry);
    } else {
      goalEntries.add(entry);
    };
  };

  public shared ({ caller }) func isCompleted(goalId : Nat, date : Text) : async Bool {
    let entry : GoalEntry = {
      goalId;
      date;
      timestamp = Time.now();
    };
    goalEntries.contains(entry);
  };

  public query ({ caller }) func getEntriesForGoal(goalId : Nat) : async [Text] {
    getEntriesForGoalInternal(caller, goalId).map(func(entry) { entry.date; }).toArray();
  };

  func getEntriesForGoalInternal(owner : Principal, goalId : Nat) : Iter.Iter<GoalEntry> {
    goalEntries.filter(
      func(entry) {
        switch (goals.get((owner, goalId))) {
          case (null) { false };
          case (?_) {
            entry.goalId == goalId;
          };
        };
      }
    ).values();
  };

  // Progress Computation
  public query ({ caller }) func getCompletionCount(goalId : Nat) : async Nat {
    getEntriesForGoalInternal(caller, goalId).size();
  };

  public query ({ caller }) func getProgressEntries(goalId : Nat) : async [ProgressEntry] {
    // Group entries by date
    let entries = getEntriesForGoalInternal(caller, goalId).toArray();
    let progressMap = Map.empty<Text, Nat>();

    for (entry in entries.values()) {
      let currentCount = switch (progressMap.get(entry.date)) {
        case (null) { 0 };
        case (?count) { count };
      };
      progressMap.add(entry.date, currentCount + 1);
    };

    progressMap.entries().map(func((date, count)) { { date; count } }).toArray();
  };
};
