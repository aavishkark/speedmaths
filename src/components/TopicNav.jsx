export function TopicNav({ topics, selectedTopicId, onSelectTopic }) {
  return (
    <nav className="topic-nav" aria-label="Math topics">
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
            <span className="topic-count">{topic.facts.length}</span>
          </button>
        );
      })}
    </nav>
  );
}
