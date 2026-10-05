import TrackerPage from "./TrackerPage";

const topics = [
  "Project Idea",
  "Requirements",
  "UI Design",
  "Frontend",
  "Backend",
  "Database",
  "Authentication",
  "API Integration",
  "Error Handling",
  "Testing",
  "Git & GitHub",
  "Documentation",
  "Deployment",
  "Live Project",
  "Resume Description",
];

function Projects() {
  return (
    <TrackerPage
      skillKey="projects"
      number="07"
      title="Projects"
      description="Build real-world projects and develop a strong portfolio for SDE roles."
      topics={topics}
    />
  );
}

export default Projects;