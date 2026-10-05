import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ChallengeCard from "./ChallengeCard.jsx";
import "./Tracker.css";

const aptitudeTopics = [
  {
    name: "Quantitative Aptitude",
    slug: "quantitative-aptitude",
    description:
      "Arithmetic and mathematical problem solving commonly useful for coding interviews.",
    units: [
      "Percentages",
      "Ratio & Proportion",
      "Profit, Loss & Discount",
      "Time, Speed & Distance",
      "Time & Work",
    ],
  },
  {
    name: "Number System",
    slug: "number-system",
    description:
      "Build strong fundamentals for numerical and algorithmic problem solving.",
    units: [
      "Divisibility",
      "Factors & Multiples",
      "LCM & HCF",
      "Prime Numbers",
      "Remainders",
    ],
  },
  {
    name: "Probability",
    slug: "probability",
    description:
      "Important mathematical reasoning concepts for technical problem solving.",
    units: [
      "Basic Probability",
      "Conditional Probability",
      "Independent Events",
      "Bayes' Theorem",
      "Expected Value",
    ],
  },
  {
    name: "Permutation & Combination",
    slug: "permutation-combination",
    description:
      "Counting techniques useful for algorithmic and mathematical problems.",
    units: [
      "Fundamental Counting",
      "Permutations",
      "Combinations",
      "Circular Arrangement",
      "Counting Problems",
    ],
  },
  {
    name: "Logical Reasoning",
    slug: "logical-reasoning",
    description:
      "Develop structured thinking and logical problem-solving ability.",
    units: [
      "Series",
      "Puzzles",
      "Syllogisms",
      "Blood Relations",
      "Coding-Decoding",
    ],
  },
  {
    name: "Data Interpretation",
    slug: "data-interpretation",
    description:
      "Practice extracting and analyzing information from structured data.",
    units: [
      "Tables",
      "Bar Graphs",
      "Line Graphs",
      "Pie Charts",
      "Caselets",
    ],
  },
  {
    name: "Algebra",
    slug: "algebra",
    description:
      "Core mathematical concepts useful for analytical problem solving.",
    units: [
      "Linear Equations",
      "Quadratic Equations",
      "Inequalities",
      "Sequences",
      "Functions",
    ],
  },
  {
    name: "Problem Solving",
    slug: "problem-solving",
    description:
      "Interview-oriented aptitude focusing on patterns, logic and efficient solutions.",
    units: [
      "Pattern Recognition",
      "Brute Force Thinking",
      "Optimization",
      "Edge Cases",
      "Complexity Awareness",
    ],
  },
];

function getDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getChallengeStatus(challenge) {
  const completedDates = Array.isArray(challenge?.completedDates)
    ? challenge.completedDates
    : [];
  const completedToday = completedDates.includes(getDateString());
  const completedCount = completedDates.length;
  const isComplete = completedCount >= (challenge?.duration || 0);
  const sortedDates = [...completedDates].sort();
  let currentStreak = sortedDates.length ? 1 : 0;

  for (let index = sortedDates.length - 1; index > 0; index -= 1) {
    const previous = new Date(`${sortedDates[index - 1]}T00:00:00`);
    const current = new Date(`${sortedDates[index]}T00:00:00`);
    const difference = (current - previous) / (1000 * 60 * 60 * 24);

    if (difference !== 1) {
      break;
    }

    currentStreak += 1;
  }

  const lastCompletedDate = challenge?.lastCompletedDate;
  const daysSinceLastCompletion = lastCompletedDate
    ? (new Date(`${getDateString()}T00:00:00`) -
        new Date(`${lastCompletedDate}T00:00:00`)) /
      (1000 * 60 * 60 * 24)
    : 0;

  return {
    alreadyCompletedToday: completedToday,
    isComplete,
    remainingDays: Math.max((challenge?.duration || 0) - completedCount, 0),
    currentStreak,
    chainBroken:
      Boolean(lastCompletedDate) &&
      !completedToday &&
      !isComplete &&
      daysSinceLastCompletion > 1,
  };
}

function loadAptitudeChallenge() {
  try {
    const saved = localStorage.getItem("selfTrack_aptitude");
    const challenge = saved ? JSON.parse(saved).challenge || null : null;

    return {
      challenge,
      chainMessage: getChallengeStatus(challenge).chainBroken
        ? `You broke a daily chain: ${challenge.name}`
        : "",
    };
  } catch (error) {
    console.error("Unable to load Aptitude challenge:", error);
    return { challenge: null, chainMessage: "" };
  }
}

function Aptitude() {
  const [initialChallenge] = useState(loadAptitudeChallenge);
  const [challenge, setChallenge] = useState(initialChallenge.challenge);
  const [showChallengeForm, setShowChallengeForm] = useState(false);
  const [challengeName, setChallengeName] = useState("");
  const [challengeDuration, setChallengeDuration] = useState("30");
  const [chainMessage, setChainMessage] = useState(initialChallenge.chainMessage);
  const challengeStatus = getChallengeStatus(challenge);

  useEffect(() => {
    try {
      localStorage.setItem(
        "selfTrack_aptitude",
        JSON.stringify({ challenge })
      );
      window.dispatchEvent(new CustomEvent("selftrack-storage-update"));
    } catch (error) {
      console.error("Unable to save Aptitude challenge:", error);
    }
  }, [challenge]);

  function handleCreateChallenge(event) {
    event.preventDefault();
    const name = challengeName.trim();
    const duration = Number(challengeDuration);

    if (!name || !Number.isInteger(duration) || duration < 1) {
      return;
    }

    setChallenge({
      name,
      duration,
      startDate: getDateString(),
      completedDates: [],
      lastCompletedDate: null,
    });
    setChallengeName("");
    setChallengeDuration("30");
    setShowChallengeForm(false);
    setChainMessage("");
  }

  function handleCompleteToday() {
    if (!challenge || challengeStatus.isComplete || challengeStatus.alreadyCompletedToday) {
      return;
    }

    const today = getDateString();
    const completedDates = Array.isArray(challenge.completedDates)
      ? challenge.completedDates
      : [];

    setChallenge({
      ...challenge,
      completedDates: [...new Set([...completedDates, today])].sort(),
      lastCompletedDate: today,
    });
    setChainMessage("");
  }

  function handleDeleteChallenge() {
    if (!window.confirm("Delete this challenge? Its challenge progress will be permanently removed.")) {
      return;
    }

    setChallenge(null);
    setChainMessage("");
  }

  return (
    <main className="tracker-page academic-page">
      <div className="tracker-container">

        {/* HEADER */}

        <div className="tracker-header">
          <span className="tracker-label">
            06 / APTITUDE
          </span>

          <h1>Aptitude</h1>

          <p>
            Build the quantitative, logical and problem-solving
            foundation needed for an SDE fresher role.
          </p>
        </div>

        <ChallengeCard
          challenge={challenge}
          status={challengeStatus}
          chainMessage={chainMessage}
          showForm={showChallengeForm}
          challengeName={challengeName}
          challengeDuration={challengeDuration}
          challengePercentage={challenge?.duration
            ? Math.min(
                100,
                Math.round(
                  ((challenge.completedDates?.length || 0) / challenge.duration) * 100
                )
              )
            : 0}
          onOpenForm={() => setShowChallengeForm(true)}
          onCloseForm={() => setShowChallengeForm(false)}
          onNameChange={setChallengeName}
          onDurationChange={setChallengeDuration}
          onCreate={handleCreateChallenge}
          onCompleteToday={handleCompleteToday}
          onDelete={handleDeleteChallenge}
        />

        {/* TOPICS */}

        <section className="academic-subjects">

          <div className="section-title">
            <div>
              <span>GOOGLE SDE FRESHER PREPARATION</span>
              <h2>Aptitude Topics</h2>
            </div>

            <p>
              Select a topic to start your preparation.
            </p>
          </div>

          <div className="academic-subject-grid">

            {aptitudeTopics.map((topic, index) => (
              <Link
                key={topic.slug}
                to={`/aptitude/${topic.slug}`}
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

                <h3>{topic.name}</h3>

                <p className="topic-description">
                  {topic.description}
                </p>

                <div className="academic-card-bottom">
                  <span>{topic.units.length} Units</span>
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

export default Aptitude;