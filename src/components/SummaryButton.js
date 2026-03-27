import React from 'react';

const SummaryButton = ({ onClick, loading, disabled }) => {
  const title = disabled
    ? 'No pending todos to summarize'
    : 'Generate AI summary and send to Slack';

  return (
    <button
      id="summarize-btn"
      className="btn-summary"
      onClick={onClick}
      disabled={loading || disabled}
      title={title}
      aria-label="Summarize and send to Slack"
    >
      {loading ? (
        <>
          <span className="loading-spinner spinner-purple" />
          Generating summary…
        </>
      ) : (
        <>🤖 Summarise &amp; Send to Slack</>
      )}
    </button>
  );
};

export default SummaryButton;
