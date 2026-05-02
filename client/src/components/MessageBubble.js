function MessageBubble({ message, senderName, senderAvatar, isSent }) {
  return (
    <div className={`message ${isSent ? 'me' : 'other'}`}>
      <div className="bubble-meta">
        {senderAvatar ? (
          <img src={senderAvatar} alt={senderName} className="message-avatar" />
        ) : (
          <span className="message-initials">{senderName.slice(0, 2).toUpperCase()}</span>
        )}
        <span className="bubble-header">{senderName}</span>
      </div>
      <div>{message}</div>
    </div>
  );
}

export default MessageBubble;
