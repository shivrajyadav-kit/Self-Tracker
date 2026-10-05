import TrackerPage from "./TrackerPage";

const topics = [
  "Client Server Architecture",
  "HTTP & HTTPS",
  "DNS",
  "REST API",
  "API Design",
  "Database Design",
  "SQL vs NoSQL",
  "Indexing",
  "Caching",
  "Load Balancing",
  "Scalability",
  "Authentication",
  "Authorization",
  "Message Queues",
  "CDN",
  "Microservices",
  "Monolith Architecture",
  "Rate Limiting",
  "Basic System Design Problems",
];

function SystemDesign() {
  return (
    <TrackerPage
      skillKey="systemdesign"
      number="08"
      title="System Design"
      description="Understand scalable systems and prepare for system design interviews."
      topics={topics}
    />
  );
}

export default SystemDesign;