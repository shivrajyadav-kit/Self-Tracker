import { Link } from "react-router-dom";
import "./Tracker.css";

const subjects = [
  {
    name: "Digital Image Processing",
    slug: "digital-image-processing",
  },
  {
    name: "Design and Analysis of Algorithms",
    slug: "design-and-analysis-of-algorithms",
  },
  {
    name: "Web Technology",
    slug: "web-technology",
  },
  {
    name: "Quantum Physics",
    slug: "quantum-physics",
  },
  {
    name: "EITK",
    slug: "eitk",
  },
  {
    name: "DBMS",
    slug: "dbms",
  },
  {
    name: "Data Analysis",
    slug: "data-analysis",
  },
];

function AcademicPage() {
  return (
    <main className="tracker-page academic-page">
      <div className="tracker-container">

        {/* HEADER */}

        <div className="tracker-header">
          <span className="tracker-label">
            07 / TRACKER
          </span>

          <h1>Academic</h1>

          <p>
            Track your academic preparation subject by
            subject and complete all five units.
          </p>
        </div>

        {/* SUBJECTS */}

        <section className="academic-subjects">

          <div className="section-title">
            <div>
              <span>ACADEMIC SUBJECTS</span>
              <h2>Subjects</h2>
            </div>

            <p>
              Select a subject to open its unit tracker.
            </p>
          </div>

          <div className="academic-subject-grid">

            {subjects.map((subject, index) => (
              <Link
                key={subject.slug}
                to={`/academic/${subject.slug}`}
                className="academic-subject-card"
              >
                <div className="academic-card-top">
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="academic-card-arrow">
                    ↗
                  </span>
                </div>

                <h3>{subject.name}</h3>

                <div className="academic-card-bottom">
                  <span>5 Units</span>
                  <span>Open tracker</span>
                </div>
              </Link>
            ))}

          </div>

        </section>

      </div>
    </main>
  );
}

export default AcademicPage;