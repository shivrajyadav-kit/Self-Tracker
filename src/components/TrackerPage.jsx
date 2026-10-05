import { useEffect, useMemo, useState } from "react";
import ChallengeCard from "./ChallengeCard";
import "./Tracker.css";

const STORAGE_PREFIX = "selfTrack";

function getStorageKey(skillKey) {
  return `${STORAGE_PREFIX}_${skillKey}`;
}

function createInitialState(topics) {
  return {
    tasks: topics.map((topic) => ({
      topic,
      learn: false,
      practice: false,
      revise: false,
      done: false,
    })),
    challenge: null,
  };
}

function loadSkillData(skillKey, topics) {
  try {
    const saved = localStorage.getItem(getStorageKey(skillKey));

    if (!saved) {
      return createInitialState(topics);
    }

    const parsed = JSON.parse(saved);

    const savedTasks = Array.isArray(parsed.tasks)
      ? parsed.tasks
      : [];

    const tasks = topics.map((topic, index) => {
      const oldTask = savedTasks[index];

      return {
        topic,
        learn: Boolean(oldTask?.learn),
        practice: Boolean(oldTask?.practice),
        revise: Boolean(oldTask?.revise),
        done: Boolean(oldTask?.done),
      };
    });

    return {
      tasks,
      challenge: parsed.challenge || null,
    };
  } catch (error) {
    console.error("Unable to load tracker data:", error);

    return createInitialState(topics);
  }
}

function saveSkillData(skillKey, data) {
  try {
    localStorage.setItem(
      getStorageKey(skillKey),
      JSON.stringify(data)
    );
  } catch (error) {
    console.error("Unable to save tracker data:", error);
  }
}

function getCompletionPercentage(tasks) {
  if (!tasks.length) {
    return 0;
  }

  const completed = tasks.filter((task) => task.done).length;

  return Math.round((completed / tasks.length) * 100);
}

function getChallengePercentage(challenge) {
  if (!challenge || !challenge.duration) {
    return 0;
  }

  const completedDays = Array.isArray(challenge.completedDates)
    ? challenge.completedDates.length
    : 0;

  return Math.min(
    100,
    Math.round((completedDays / challenge.duration) * 100)
  );
}

function getDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function getDifferenceInDays(firstDate, secondDate) {
  const first = parseDate(firstDate);
  const second = parseDate(secondDate);

  const difference = second.getTime() - first.getTime();

  return Math.floor(difference / (1000 * 60 * 60 * 24));
}

function getChallengeStatus(challenge) {
  if (!challenge) {
    return {
      chainBroken: false,
      alreadyCompletedToday: false,
      isComplete: false,
      remainingDays: 0,
      currentStreak: 0,
    };
  }

  const today = getDateString();

  const completedDates = Array.isArray(challenge.completedDates)
    ? challenge.completedDates
    : [];

  const alreadyCompletedToday = completedDates.includes(today);

  const completedDays = completedDates.length;

  const remainingDays = Math.max(
    challenge.duration - completedDays,
    0
  );

  const isComplete =
    completedDays >= challenge.duration;

  let chainBroken = false;

  if (
    challenge.lastCompletedDate &&
    !isComplete &&
    !alreadyCompletedToday
  ) {
    const daysSinceLastCompletion = getDifferenceInDays(
      challenge.lastCompletedDate,
      today
    );

    if (daysSinceLastCompletion > 1) {
      chainBroken = true;
    }
  }

  let currentStreak = 0;

  if (completedDates.length > 0) {
    const sortedDates = [...completedDates].sort();

    currentStreak = 1;

    for (let i = sortedDates.length - 1; i > 0; i--) {
      const difference = getDifferenceInDays(
        sortedDates[i - 1],
        sortedDates[i]
      );

      if (difference === 1) {
        currentStreak += 1;
      } else {
        break;
      }
    }
  }

  return {
    chainBroken,
    alreadyCompletedToday,
    isComplete,
    remainingDays,
    currentStreak,
  };
}

function TrackerPage({
  skillKey,
  number,
  title,
  description,
  topics,
}) {
  const [data, setData] = useState(() =>
    loadSkillData(skillKey, topics)
  );

  const [showChallengeForm, setShowChallengeForm] =
    useState(false);

  const [challengeName, setChallengeName] = useState("");

  const [challengeDuration, setChallengeDuration] =
    useState("30");

  const [chainMessage, setChainMessage] = useState("");

  useEffect(() => {
    const loadedData = loadSkillData(skillKey, topics);

    setData(loadedData);

    const status = getChallengeStatus(loadedData.challenge);

    if (status.chainBroken) {
      setChainMessage(
        `You broke a daily chain: ${loadedData.challenge.name}`
      );
    }
  }, [skillKey, topics]);

 useEffect(() => {
  saveSkillData(skillKey, data);

  window.dispatchEvent(
    new CustomEvent("selftrack-storage-update")
  );
}, [skillKey, data]);

  const completionPercentage = useMemo(
    () => getCompletionPercentage(data.tasks),
    [data.tasks]
  );

  const completedTasks = data.tasks.filter(
    (task) => task.done
  ).length;

  const remainingTasks =
    data.tasks.length - completedTasks;

  const challengeStatus = getChallengeStatus(
    data.challenge
  );

  function handleTaskChange(index, field) {
    setData((previousData) => {
      const updatedTasks = [...previousData.tasks];

      updatedTasks[index] = {
        ...updatedTasks[index],
        [field]: !updatedTasks[index][field],
      };

      return {
        ...previousData,
        tasks: updatedTasks,
      };
    });
  }

  function handleCreateChallenge(event) {
    event.preventDefault();

    const name = challengeName.trim();

    const duration = Number(challengeDuration);

    if (!name) {
      return;
    }

    if (!Number.isInteger(duration) || duration < 1) {
      return;
    }

    const today = getDateString();

    const newChallenge = {
      name,
      duration,
      startDate: today,
      completedDates: [],
      lastCompletedDate: null,
    };

    setData((previousData) => ({
      ...previousData,
      challenge: newChallenge,
    }));

    setChallengeName("");
    setChallengeDuration("30");
    setShowChallengeForm(false);
    setChainMessage("");
  }

  function handleCompleteToday() {
    if (!data.challenge) {
      return;
    }

    const today = getDateString();

    const status = getChallengeStatus(data.challenge);

    if (status.isComplete || status.alreadyCompletedToday) {
      return;
    }

    const previousDates = Array.isArray(
      data.challenge.completedDates
    )
      ? data.challenge.completedDates
      : [];

    const updatedDates = [
      ...new Set([...previousDates, today]),
    ].sort();

    setData((previousData) => ({
      ...previousData,
      challenge: {
        ...previousData.challenge,
        completedDates: updatedDates,
        lastCompletedDate: today,
      },
    }));

    setChainMessage("");
  }

  function handleDeleteChallenge() {
    const confirmed = window.confirm(
      "Delete this challenge? Its challenge progress will be permanently removed."
    );

    if (!confirmed) {
      return;
    }

    setData((previousData) => ({
      ...previousData,
      challenge: null,
    }));

    setChainMessage("");
  }

  return (
    <main className="tracker-page">
      <div className="tracker-container">

        {/* HEADER */}

        <div className="tracker-header">
          <span className="tracker-label">
            {number} / TRACKER
          </span>

          <h1>{title}</h1>

          <p>{description}</p>
        </div>

        {/* OVERALL PROGRESS */}

        <section className="progress-section">

          <div className="progress-heading">
            <div>
              <span className="progress-label">
                Overall Progress
              </span>

              <strong>{completionPercentage}%</strong>
            </div>

            <span className="progress-count">
              {completedTasks} / {data.tasks.length} completed
            </span>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${completionPercentage}%`,
              }}
            />
          </div>

        </section>

        {/* STATISTICS */}

        <div className="tracker-stats">

          <div>
            <span>Total</span>
            <strong>{data.tasks.length}</strong>
          </div>

          <div>
            <span>Completed</span>
            <strong>{completedTasks}</strong>
          </div>

          <div>
            <span>Remaining</span>
            <strong>{remainingTasks}</strong>
          </div>

        </div>

        {/* DAILY CHALLENGE */}

        <ChallengeCard
          challenge={data.challenge}
          status={challengeStatus}
          chainMessage={chainMessage}
          showForm={showChallengeForm}
          challengeName={challengeName}
          challengeDuration={challengeDuration}
          challengePercentage={getChallengePercentage(
            data.challenge
          )}
          onOpenForm={() => setShowChallengeForm(true)}
          onCloseForm={() => setShowChallengeForm(false)}
          onNameChange={setChallengeName}
          onDurationChange={setChallengeDuration}
          onCreate={handleCreateChallenge}
          onCompleteToday={handleCompleteToday}
          onDelete={handleDeleteChallenge}
        />

        {/* TOPIC TABLE */}

        <section className="tracker-table-section">

          <div className="section-title">
            <div>
              <span>LEARNING TRACKER</span>
              <h2>Topics</h2>
            </div>

            <p>
              Track learning, practice, revision and completion.
            </p>
          </div>

          <div className="tracker-table">

            <div className="tracker-row tracker-heading">
              <span>#</span>
              <span>Topic</span>
              <span>Learn</span>
              <span>Practice</span>
              <span>Revise</span>
              <span>Done</span>
            </div>

            {data.tasks.map((task, index) => (
              <div
                className={`tracker-row ${
                  task.done ? "task-completed" : ""
                }`}
                key={task.topic}
              >
                <span className="topic-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="topic-name">
                  {task.topic}
                </span>

                <input
                  type="checkbox"
                  checked={task.learn}
                  onChange={() =>
                    handleTaskChange(index, "learn")
                  }
                  aria-label={`${task.topic} learn`}
                />

                <input
                  type="checkbox"
                  checked={task.practice}
                  onChange={() =>
                    handleTaskChange(index, "practice")
                  }
                  aria-label={`${task.topic} practice`}
                />

                <input
                  type="checkbox"
                  checked={task.revise}
                  onChange={() =>
                    handleTaskChange(index, "revise")
                  }
                  aria-label={`${task.topic} revise`}
                />

                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() =>
                    handleTaskChange(index, "done")
                  }
                  aria-label={`${task.topic} completed`}
                />
              </div>
            ))}

          </div>

        </section>

      </div>
    </main>
  );
}

export default TrackerPage;