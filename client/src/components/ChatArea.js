import { useEffect, useState } from 'react';
import { FiSend } from 'react-icons/fi';
import MessageBubble from './MessageBubble';

function ChatArea({ user, receiver, messages, onSend, onTyping, typingStatus }) {
  const [draft, setDraft] = useState('');

  useEffect(() => {
    setDraft('');
  }, [receiver]);

  const handleSend = () => {
    if (!draft.trim()) return;
    onSend(draft);
    setDraft('');
  };

  return (
    <main className="chat">
      <div className="chat-header">
        <h2>{receiver ? receiver.username : 'Chat Window'}</h2>
        <p>{receiver ? `Connected with ${receiver.username}` : 'Choose a user to start chatting.'}</p>
      </div>

      <div className="messages">
        {receiver ? (
          messages.map((item, index) => (
            <MessageBubble
              key={`${item.senderId}-${index}-${item.message}`}
              message={item.message}
              senderName={item.senderName}
              senderAvatar={item.senderAvatar}
              isSent={item.senderId === user.id}
            />
          ))
        ) : (
          <div className="message empty">Select a contact from the middle panel to begin.</div>
        )}
      </div>

      {typingStatus && <p className="typing-indicator">{typingStatus}</p>}

      <div className="input-area">
        <input
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            if (receiver) onTyping();
          }}
          placeholder={receiver ? 'Type message...' : 'Choose a contact first.'}
          disabled={!receiver}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSend();
            }
          }}
        />
        <button onClick={handleSend} disabled={!receiver || !draft.trim()}>
          <FiSend />
        </button>
      </div>
    </main>
  );
}

export default ChatArea;
