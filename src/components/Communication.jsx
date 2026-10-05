import TrackerPage from "./TrackerPage";

const topics = [
  "English Grammar",
  "Vocabulary",
  "Reading",
  "Writing",
  "Speaking",
  "Listening",
  "Presentation Skills",
  "Technical Communication",
  "Group Discussion",
  "Interview Introduction",
  "HR Questions",
  "Technical Explanation",
  "Resume Discussion",
  "Mock Interview",
];

function Communication() {
  return (
    <TrackerPage
      skillKey="communication"
      number="03"
      title="Communication"
      description="Improve communication, speaking confidence and interview skills."
      topics={topics}
    />
  );
}

export default Communication;