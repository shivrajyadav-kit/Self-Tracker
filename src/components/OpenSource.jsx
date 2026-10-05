import TrackerPage from "./TrackerPage";

const topics = [
  "Git Basics",
  "GitHub",
  "Branches",
  "Pull Requests",
  "Issues",
  "Code Review",
  "Open Source Projects",
  "Read Documentation",
  "Find Good First Issue",
  "Fork Repository",
  "Create Contribution",
  "Write Clean Code",
  "Community Interaction",
  "Open Source Contribution",
];

function OpenSource() {
  return (
    <TrackerPage
      skillKey="opensource"
      number="05"
      title="Open Source"
      description="Learn open source workflows and build a public contribution profile."
      topics={topics}
    />
  );
}

export default OpenSource;