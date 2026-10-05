import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Tracker.css";

const subjects = {
  "digital-image-processing": "Digital Image Processing",
  "design-and-analysis-of-algorithms":
    "Design and Analysis of Algorithms",
  "web-technology": "Web Technology",
  "quantum-physics": "Quantum Physics",
  eitk: "EITK",
  dbms: "DBMS",
  "data-analysis": "Data Analysis",
};

const units = [
  "Unit 1",
  "Unit 2",
  "Unit 3",
  "Unit 4",
  "Unit 5",
];

function createInitialState() {
  return {
    units: units.map((unit) => ({
      unit,
      completed: false,
      revised: false,
    })),
  };
}

function getStorageKey(subject) {
  return `selfTrack_academic_${subject}`;
}

function loadSubjectData(subject) {
  try {
    const saved = localStorage.getItem(
      getStorageKey(subject)
    );

    if (!saved) {
      return createInitialState();
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed.units)) {
      return createInitialState();
    }

    return {
      units: units.map((unit, index) => ({
        unit,
        completed: Boolean(
          parsed.units[index]?.completed
        ),
        revised: Boolean(
          parsed.units[index]?.revised
        ),
      })),
    };
  } catch (error) {
    console.error(
      "Unable to load academic subject data:",
      error
    );

    return createInitialState();
  }
}

function AcademicSubjectPage() {
  const { subject } = useParams();

  const subjectName =
    subjects[subject] || "Academic Subject";

  const [data, setData] = useState(() =>
    loadSubjectData(subject)
  );

  useEffect(() => {
    setData(loadSubjectData(subject));
  }, [subject]);

  useEffect(() => {
    localStorage.setItem(
      getStorageKey(subject),
      JSON.stringify(data)
    );
  }, [subject, data]);

  const completedUnits = data.units.filter(
    (unit) => unit.completed
  ).length;

  const revisedUnits = data.units.filter(
    (unit) => unit.revised
  ).length;

  const percentage = useMemo(() => {
    if (!data.units.length) {
      return 0;
    }

    return Math.round(
      (completedUnits / data.units.length) * 100
    );
  }, [completedUnits, data.units.length]);

  function handleUnitChange(index, field) {
    setData((previousData) => {
      const updatedUnits = [...previousData.units];

      updatedUnits[index] = {
        ...updatedUnits[index],
        [field]: !updatedUnits[index][field],
      };

      return {
        ...previousData,
        units: updatedUnits,
      };
    });
  }

  return (
    <main className="tracker-page academic-page">
      <div className="tracker-container">

        {/* BACK */}

        <Link
          to="/academic"
          className="academic-back"
        >
          ← Back to Academic
        </Link>

        {/* HEADER */}

        <div className="tracker-header academic-subject-header">
          <span className="tracker-label">
            07 / ACADEMIC
          </span>

          <h1>{subjectName}</h1>

          <p>
            Track completion and revision for all five
            units of this subject.
          </p>
        </div>

        {/* PROGRESS */}

        <section className="progress-section">

          <div className="progress-heading">
            <div>
              <span className="progress-label">
                Subject Progress
              </span>

              <strong>{percentage}%</strong>
            </div>

            <span className="progress-count">
              {completedUnits} / {data.units.length} units
              completed
            </span>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>

        </section>

        {/* STATS */}

        <div className="tracker-stats">

          <div>
            <span>Total Units</span>
            <strong>{data.units.length}</strong>
          </div>

          <div>
            <span>Completed</span>
            <strong>{completedUnits}</strong>
          </div>

          <div>
            <span>Revised</span>
            <strong>{revisedUnits}</strong>
          </div>

        </div>

        {/* UNIT TRACKER */}

        <section className="tracker-table-section">

          <div className="section-title">
            <div>
              <span>UNIT TRACKER</span>
              <h2>Units</h2>
            </div>

            <p>
              Mark each unit when completed and revised.
            </p>
          </div>

          <div className="tracker-table academic-unit-table">

            <div className="academic-unit-row academic-unit-heading">
              <span>#</span>
              <span>Unit</span>
              <span>Completed</span>
              <span>Revised</span>
            </div>

            {data.units.map((unit, index) => (
              <div
                className={`academic-unit-row ${
                  unit.completed
                    ? "task-completed"
                    : ""
                }`}
                key={unit.unit}
              >

                <span className="topic-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="topic-name">
                  {unit.unit}
                </span>

                <input
                  type="checkbox"
                  checked={unit.completed}
                  onChange={() =>
                    handleUnitChange(
                      index,
                      "completed"
                    )
                  }
                  aria-label={`${unit.unit} completed`}
                />

                <input
                  type="checkbox"
                  checked={unit.revised}
                  onChange={() =>
                    handleUnitChange(
                      index,
                      "revised"
                    )
                  }
                  aria-label={`${unit.unit} revised`}
                />

              </div>
            ))}

          </div>

        </section>

      </div>
    </main>
  );
}

export default AcademicSubjectPage;