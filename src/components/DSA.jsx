import TrackerPage from "./TrackerPage";

const topics = [
  "Time & Space Complexity",
  "Arrays",
  "Strings",
  "Linked List",
  "Stack",
  "Queue",
  "Hashing",
  "Recursion",
  "Binary Search",
  "Sorting",
  "Trees",
  "Binary Search Tree",
  "Heap / Priority Queue",
  "Graphs",
  "Greedy",
  "Backtracking",
  "Dynamic Programming",
  "Bit Manipulation",
];

function DSA() {
  return (
    <TrackerPage
      skillKey="dsa"
      number="01"
      title="Data Structures & Algorithms"
      description="Build strong problem-solving skills and prepare for coding interviews."
      topics={topics}
    />
  );
}

export default DSA;