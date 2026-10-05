import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Tracker.css";

const aptitudeData = {
  "quantitative-aptitude": {
    title: "Quantitative Aptitude",
    description:
      "Build strong mathematical problem-solving skills for SDE interview preparation.",
    sections: [
      "Percentages",
      "Ratio & Proportion",
      "Profit, Loss & Discount",
      "Average",
      "Time, Speed & Distance",
      "Time & Work",
      "Simple & Compound Interest",
    ],
  },

  "number-system": {
    title: "Number System",
    description:
      "Master number-based concepts that improve mathematical and algorithmic thinking.",
    sections: [
      "Natural Numbers & Integers",
      "Factors & Multiples",
      "LCM & HCF",
      "Prime Numbers",
      "Divisibility Rules",
      "Remainders",
      "Last Digit Problems",
    ],
  },

  probability: {
    title: "Probability",
    description:
      "Learn probability concepts and apply them to problem-solving questions.",
    sections: [
      "Basic Probability",
      "Sample Space",
      "Independent Events",
      "Dependent Events",
      "Conditional Probability",
      "Bayes' Theorem",
      "Expected Value",
    ],
  },

  "permutation-combination": {
    title: "Permutation & Combination",
    description:
      "Develop counting skills useful for algorithmic and mathematical problems.",
    sections: [
      "Fundamental Counting Principle",
      "Factorials",
      "Permutations",
      "Combinations",
      "Circular Arrangements",
      "Repetition",
      "Counting Problems",
    ],
  },

  "logical-reasoning": {
    title: "Logical Reasoning",
    description:
      "Improve structured thinking and logical problem-solving ability.",
    sections: [
      "Number Series",
      "Letter Series",
      "Coding-Decoding",
      "Blood Relations",
      "Direction Sense",
      "Syllogisms",
      "Logical Puzzles",
      "Statement & Conclusions",
    ],
  },

  "data-interpretation": {
    title: "Data Interpretation",
    description:
      "Learn to quickly understand and analyze numerical data.",
    sections: [
      "Tables",
      "Bar Graphs",
      "Line Graphs",
      "Pie Charts",
      "Mixed Graphs",
      "Caselet DI",
      "Percentage-Based DI",
    ],
  },

  algebra: {
    title: "Algebra",
    description:
      "Build algebraic fundamentals for analytical problem solving.",
    sections: [
      "Linear Equations",
      "Quadratic Equations",
      "Inequalities",
      "Algebraic Identities",
      "Sequences",
      "Arithmetic Progression",
      "Functions",
    ],
  },

  "problem-solving": {
    title: "Problem Solving",
    description:
      "Develop the structured thinking required to solve technical interview problems.",
    sections: [
      "Pattern Recognition",
      "Problem Decomposition",
      "Brute Force Approach",
      "Optimization",
      "Edge Cases",
      "Time Complexity",
      "Space Complexity",
      "Dry Run & Debugging",
    ],
  },
};

function AptitudeTopicPage() {
  const { topic } = useParams();

  const data = aptitudeData[topic];

  const storageKey = `aptitude-progress-${topic}`;

  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem(storageKey);

    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [progress, storageKey]);

  if (!data) {
    return (
      <main className="tracker-page">
        <div className="tracker-container">
          <h1>Topic Not Found</h1>
          <p>
            The aptitude topic you are looking for does not exist.
          </p>
        </div>
      </main>
    );
  }

  const toggleCheck = (section, type) => {
    setProgress((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [type]: !prev[section]?.[type],
      },
    }));
  };

  const completedCount = data.sections.filter(
    (section) =>
      progress[section]?.learn &&
      progress[section]?.practice &&
      progress[section]?.revise &&
      progress[section]?.done
  ).length;

  return (
    <main className="tracker-page aptitude-topic-page">
      <div className="tracker-container">

        {/* HEADER */}

        <div className="tracker-header">
          <span className="tracker-label">
            06 / APTITUDE
          </span>

          <h1>{data.title}</h1>

          <p>{data.description}</p>
        </div>

        {/* PROGRESS */}

        <div className="aptitude-progress">
          <div>
            <span>PROGRESS</span>
            <strong>
              {completedCount} / {data.sections.length}
            </strong>
          </div>

          <div className="progress-bar">
            <div
              style={{
                width: `${
                  (completedCount / data.sections.length) * 100
                }%`,
              }}
            />
          </div>
        </div>

        {/* TRACKER TABLE */}

        <section className="aptitude-tracker">

          <div className="aptitude-table">

            {/* TABLE HEADER */}

            <div className="aptitude-row aptitude-header-row">
              <div className="aptitude-topic-column">
                TOPIC
              </div>

              <div>LEARN</div>
              <div>PRACTICE</div>
              <div>REVISE</div>
              <div>DONE</div>
            </div>

            {/* TOPIC ROWS */}

            {data.sections.map((section, index) => (
              <div
                className="aptitude-row"
                key={section}
              >
                <div className="aptitude-topic-column">
                  <span className="aptitude-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span>{section}</span>
                </div>

                <div>
                  <input
                    type="checkbox"
                    checked={
                      progress[section]?.learn || false
                    }
                    onChange={() =>
                      toggleCheck(section, "learn")
                    }
                  />
                </div>

                <div>
                  <input
                    type="checkbox"
                    checked={
                      progress[section]?.practice || false
                    }
                    onChange={() =>
                      toggleCheck(section, "practice")
                    }
                  />
                </div>

                <div>
                  <input
                    type="checkbox"
                    checked={
                      progress[section]?.revise || false
                    }
                    onChange={() =>
                      toggleCheck(section, "revise")
                    }
                  />
                </div>

                <div>
                  <input
                    type="checkbox"
                    checked={
                      progress[section]?.done || false
                    }
                    onChange={() =>
                      toggleCheck(section, "done")
                    }
                  />
                </div>
              </div>
            ))}

          </div>

        </section>

      </div>
    </main>
  );
}

export default AptitudeTopicPage;
