import { useCallback, useEffect, useState } from "react";
import "./Tracker.css";

const SKILLS = [
  {
    key: "dsa",
    name: "DSA",
  },
  {
    key: "webdev",
    name: "Web Development",
  },
  {
    key: "communication",
    name: "Communication",
  },
  {
    key: "physical",
    name: "Physical",
  },
  {
    key: "opensource",
    name: "Open Source",
  },
  {
    key: "aptitude",
    name: "Aptitude",
  },
  {
    key: "projects",
    name: "Projects",
  },
  {
    key: "systemdesign",
    name: "System Design",
  },
];

function getStorageKey(skillKey) {
  return `selfTrack_${skillKey}`;
}

function getDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDate(dateString) {
  const [year, month, day] =
    dateString.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function getDifferenceInDays(firstDate, secondDate) {
  const first = parseDate(firstDate);
  const second = parseDate(secondDate);

  return Math.floor(
    (second.getTime() - first.getTime()) /
      (1000 * 60 * 60 * 24)
  );
}

function getChallengeStatus(challenge) {
  if (!challenge) {
    return {
      percentage: 0,
      remaining: 0,
      streak: 0,
      completedToday: false,
      broken: false,
      complete: false,
    };
  }

  const completedDates =
    Array.isArray(challenge.completedDates)
      ? challenge.completedDates
      : [];

  const today = getDateString();

  const completedToday =
    completedDates.includes(today);

  const completedCount =
    completedDates.length;

  const percentage =
    challenge.duration > 0
      ? Math.min(
          100,
          Math.round(
            (completedCount /
              challenge.duration) *
              100
          )
        )
      : 0;

  const remaining = Math.max(
    challenge.duration - completedCount,
    0
  );

  const complete =
    completedCount >= challenge.duration;

  let broken = false;

  if (
    challenge.lastCompletedDate &&
    !completedToday &&
    !complete
  ) {
    const difference =
      getDifferenceInDays(
        challenge.lastCompletedDate,
        today
      );

    broken = difference > 1;
  }

  let streak = 0;

  if (completedDates.length > 0) {
    const sorted = [...completedDates].sort();

    streak = 1;

    for (
      let i = sorted.length - 1;
      i > 0;
      i--
    ) {
      const difference =
        getDifferenceInDays(
          sorted[i - 1],
          sorted[i]
        );

      if (difference === 1) {
        streak++;
      } else {
        break;
      }
    }
  }

  return {
    percentage,
    remaining,
    streak,
    completedToday,
    broken,
    complete,
  };
}

function loadChallenges() {
  const runningChallenges = [];

  SKILLS.forEach((skill) => {
    try {
      const saved = localStorage.getItem(
        getStorageKey(skill.key)
      );

      if (!saved) {
        return;
      }

      const data = JSON.parse(saved);

      if (!data.challenge) {
        return;
      }

      const status =
        getChallengeStatus(data.challenge);

      runningChallenges.push({
        skill,
        challenge: data.challenge,
        status,
      });
    } catch (error) {
      console.error(
        `Unable to read ${skill.name} challenge`,
        error
      );
    }
  });

  return runningChallenges;
}

function ChallengeDashboard({ onChallengesChange }) {
  const [challenges, setChallenges] = useState([]);

  const refreshChallenges = useCallback(() => {
    const loadedChallenges = loadChallenges();
    setChallenges(loadedChallenges);
    onChallengesChange?.(loadedChallenges);
  }, [onChallengesChange]);

  useEffect(() => {
    refreshChallenges();

    window.addEventListener(
      "selftrack-storage-update",
      refreshChallenges
    );

    window.addEventListener(
      "storage",
      refreshChallenges
    );

    const interval = setInterval(
      refreshChallenges,
      60000
    );

    return () => {
      window.removeEventListener(
        "selftrack-storage-update",
        refreshChallenges
      );

      window.removeEventListener(
        "storage",
        refreshChallenges
      );

      clearInterval(interval);
    };
  }, [refreshChallenges]);

  if (challenges.length === 0) {
    return null;
  }

  return (
    <section className="challenge-dashboard">

      <div className="challenge-dashboard-header">
        <div>
          <span className="tracker-label">
            ACTIVE CHALLENGES
          </span>

          <h2>Daily Challenges</h2>
        </div>

        <span className="challenge-live">
          ● LIVE
        </span>
      </div>

      <div className="challenge-dashboard-grid">

        {challenges.map(
          ({ skill, challenge, status }) => (
            <div
              className="dashboard-challenge-card"
              key={skill.key}
            >
              <div className="dashboard-card-top">
                <div>
                  <span className="dashboard-skill">
                    {skill.name}
                  </span>

                  <h3>{challenge.name}</h3>
                </div>

                <strong>
                  {status.percentage}%
                </strong>
              </div>

              <div className="dashboard-progress">
                <div
                  style={{
                    width: `${status.percentage}%`,
                  }}
                />
              </div>

              <div className="dashboard-card-info">

                <div>
                  <span>Progress</span>

                  <strong>
                    {challenge.completedDates
                      ?.length || 0}{" "}
                    / {challenge.duration}
                  </strong>
                </div>

                <div>
                  <span>Chain</span>

                  <strong>
                    {status.streak} day
                    {status.streak !== 1
                      ? "s"
                      : ""}
                  </strong>
                </div>

                <div>
                  <span>Status</span>

                  <strong>
                    {status.complete
                      ? "Complete"
                      : status.broken
                      ? "Broken"
                      : status.completedToday
                      ? "Done today"
                      : "Pending"}
                  </strong>
                </div>

              </div>

              {status.broken && (
                <div className="dashboard-warning">
                  ⚠ You broke a daily chain:
                  {" "}
                  {challenge.name}
                </div>
              )}

              {!status.completedToday &&
                !status.complete && (
                  <div className="dashboard-pending">
                    Today's challenge is pending
                  </div>
                )}

            </div>
          )
        )}

      </div>

    </section>
  );
}

export default ChallengeDashboard;