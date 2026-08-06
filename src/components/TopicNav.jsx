export function TopicNav({ topics, selectedTopicId, onSelectTopic, hasStarred = false }) {
  return (
    <nav className="topic-nav" aria-label="Math topics">
      <div className="topic-nav-track">
        {topics.map((topic) => {
          const isActive = topic.id === selectedTopicId;
          return (
            <button
              className={`topic-tab ${isActive ? "active" : ""}`}
              key={topic.id}
              onClick={() => onSelectTopic(topic.id)}
              style={{ "--topic-accent": topic.accent }}
              type="button"
              aria-current={isActive ? "page" : undefined}
            >
              <span className="topic-name">{topic.shortName}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

