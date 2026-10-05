import TrackerPage from "./TrackerPage";

const topics = [
  "HTML",
  "CSS",
  "JavaScript",
  "DOM",
  "Git & GitHub",
  "React",
  "React Router",
  "State Management",
  "REST API",
  "Node.js",
  "Express.js",
  "Authentication",
  "SQL",
  "MongoDB",
  "Database Design",
  "Testing",
  "Docker",
  "CI/CD",
  "Deployment",
  "Cloud Basics",
];

function WebDev() {
  return (
    <TrackerPage
      skillKey="webdev"
      number="02"
      title="Web Development"
      description="Learn frontend, backend, database, deployment and modern web development."
      topics={topics}
    />
  );
}

export default WebDev;