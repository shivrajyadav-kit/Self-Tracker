import { Link } from "react-router-dom";
import { useState } from "react";
import "./Hero.css";
import ChallengeDashboard from "./ChallengeDashboard.jsx";

function Hero() {
  const [challenges, setChallenges] = useState([]);

  const sections = [
    {
      title: "DSA",
      description: "Data Structures • Algorithms",
      path: "/dsa",
      theme: "dsa",
    },
    {
      title: "Web Dev",
      description: "Frontend • Backend • Database • DevOps",
      path: "/webdev",
      theme: "webdev",
    },
    {
      title: "Communication",
      description: "Communication Skills • Interview",
      path: "/communication",
      theme: "communication",
    },
    {
      title: "Physical",
      description: "Exercise • Fitness • Daily Discipline",
      path: "/physical",
      theme: "physical",
    },
    {
      title: "Open Source",
      description: "Learn • Build • Contribute",
      path: "/opensource",
      theme: "opensource",
    },
    {
      title: "Aptitude",
      description: "Quantitative • Logical • Reasoning",
      path: "/aptitude",
      theme: "aptitude",
    },
    {
      title: "Academic",
      description: "University • Units • Semester Preparation",
      path: "/aptitude",
      theme: "academic",
    },
    {
      title: "Projects",
      description: "Build • Deploy • Showcase",
      path: "/projects",
      theme: "projects",
    },
    {
      title: "System Design",
      description: "Architecture • Scalability • Systems",
      path: "/system-design",
      theme: "system-design",
    },
  ];

  return (
    <main className="hero">
      <div className="hero-container">

        <div className="hero-heading">
          <img
            className="hero-brand-logo"
            src="/self-tracker-logo.png"
            alt="Self Tracker: Elevate Your Progress"
          />
          <p className="hero-label">PERSONAL TRACKER</p>

          <h1 className="hero-title">
            Build.
            <span> Track.</span>
            <br />
            Improve.
          </h1>

          <p className="hero-description">
            Everything you need to track your learning,
            health, skills and career preparation in one place.
          </p>
        </div>

        <div className="section-grid">
          {sections.map((section, index) => (
            <Link
              to={section.path}
              className={`section-card section-${section.theme}`}
              key={section.path}
            >
              <div className="card-top">
                <span className="card-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="card-arrow">↗</span>
              </div>

              {challenges
                .filter(({ skill }) =>
                  skill.key ===
                  (section.theme === "system-design"
                    ? "systemdesign"
                    : section.theme)
                )
                .map(({ skill, challenge, status }) => (
                  <span
                    className="home-challenge-ring"
                    key={skill.key}
                    style={{ "--challenge-progress": `${status.percentage}%` }}
                    title={`${challenge.name}: ${status.percentage}% complete`}
                    aria-label={`${challenge.name}: ${status.percentage}% complete`}
                  >
                    {status.percentage}%
                  </span>
                ))}

              <div className="card-content">
                <h2>{section.title}</h2>

                <p>{section.description}</p>
              </div>

              <div className="card-bottom">
                <span>Open tracker</span>
                <span className="card-line"></span>
              </div>
            </Link>
          ))}
        </div>

        <ChallengeDashboard onChallengesChange={setChallenges} />
      </div>
    </main>
  );
}

export default Hero;