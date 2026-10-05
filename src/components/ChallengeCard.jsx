function ChallengeCard({
  challenge,
  status,
  chainMessage,
  showForm,
  challengeName,
  challengeDuration,
  challengePercentage,
  onOpenForm,
  onCloseForm,
  onNameChange,
  onDurationChange,
  onCreate,
  onCompleteToday,
  onDelete,
}) {
  if (!challenge) {
    return (
      <section className="challenge-card challenge-empty">

        <div className="challenge-empty-content">
          <span className="challenge-label">
            DAILY CHALLENGE
          </span>

          <h2>Create your daily challenge</h2>

          <p>
            Choose a challenge for this skill and complete
            it every day to build a continuous chain.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            className="challenge-button"
            onClick={onOpenForm}
          >
            + Create Challenge
          </button>
        )}

        {showForm && (
          <form
            className="challenge-form"
            onSubmit={onCreate}
          >
            <div className="form-field">
              <label htmlFor="challenge-name">
                Challenge Name
              </label>

              <input
                id="challenge-name"
                type="text"
                value={challengeName}
                onChange={(event) =>
                  onNameChange(event.target.value)
                }
                placeholder="Example: DSA Daily Practice"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="challenge-duration">
                Challenge Duration
              </label>

              <input
                id="challenge-duration"
                type="number"
                min="1"
                max="3650"
                value={challengeDuration}
                onChange={(event) =>
                  onDurationChange(event.target.value)
                }
                required
              />

              <small>
                Number of successful days
              </small>
            </div>

            <div className="challenge-form-actions">
              <button
                type="submit"
                className="challenge-button"
              >
                Start Challenge
              </button>

              <button
                type="button"
                className="challenge-cancel"
                onClick={onCloseForm}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

      </section>
    );
  }

  return (
    <section className="challenge-card">

      <div className="challenge-top">

        <div>
          <span className="challenge-label">
            DAILY CHALLENGE
          </span>

          <h2>{challenge.name}</h2>
        </div>

        <div className="challenge-percentage">
          {challengePercentage}%
        </div>

      </div>

      {chainMessage && (
        <div className="chain-warning">
          ⚠️ {chainMessage}
        </div>
      )}

      {status.isComplete ? (
        <div className="challenge-complete">
          <strong>🎉 Challenge completed!</strong>

          <p>
            You completed all {challenge.duration} days.
          </p>
        </div>
      ) : (
        <>
          <div className="challenge-progress">

            <div className="challenge-progress-info">
              <span>
                {challenge.completedDates.length} /{" "}
                {challenge.duration} days
              </span>

              <span>
                {status.remainingDays} days remaining
              </span>
            </div>

            <div className="progress-bar challenge-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${challengePercentage}%`,
                }}
              />
            </div>

          </div>

          <div className="challenge-info-grid">

            <div>
              <span>Current Chain</span>
              <strong>
                {status.currentStreak} day
                {status.currentStreak !== 1 ? "s" : ""}
              </strong>
            </div>

            <div>
              <span>Today</span>

              <strong>
                {status.alreadyCompletedToday
                  ? "Completed"
                  : "Pending"}
              </strong>
            </div>

            <div>
              <span>Remaining</span>

              <strong>
                {status.remainingDays}
              </strong>
            </div>

          </div>

          <button
            type="button"
            className="challenge-complete-button"
            onClick={onCompleteToday}
            disabled={status.alreadyCompletedToday}
          >
            {status.alreadyCompletedToday
              ? "✓ Completed Today"
              : "✓ Complete Today"}
          </button>
        </>
      )}

      <button
        type="button"
        className="challenge-delete"
        onClick={onDelete}
      >
        Delete Challenge
      </button>

    </section>
  );
}

export default ChallengeCard;