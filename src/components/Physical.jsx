import TrackerPage from "./TrackerPage";

const topics = [
  "Morning Routine",
  "Walking",
  "Running",
  "Push Ups",
  "Pull Ups",
  "Squats",
  "Plank",
  "Stretching",
  "Strength Training",
  "Cardio",
  "Sleep",
  "Water Intake",
  "Healthy Diet",
  "Meditation",
];

function Physical() {
  return (
    <TrackerPage
      skillKey="physical"
      number="04"
      title="Physical"
      description="Build fitness, discipline, energy and healthy daily habits."
      topics={topics}
    />
  );
}

export default Physical;