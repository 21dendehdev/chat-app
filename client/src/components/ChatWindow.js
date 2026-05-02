import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function getInitials(name = '') { return name.slice(0, 2).toUpperCase(); }

function ChatWindow({ user, selectedChat, socket, onlineUsers, messages, setMessages }) {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);
  const textareaRef = useRef(null);

  const isOnline = (id) => onlineUsers.includes(id);

  // Load message history
  useEffect(() => {
    if (!selectedChat || selectedChat.type === 'create-group') return;
    setMessages([]);
    setLoading(true);

    const url = selectedChat.type === 'dm'
      ? `http://localhost:5000/api/messages/${user.id}/${selectedChat.id}`
      : `http://localhost:5000/api/messages/group/${selectedChat.id}`;

    axios.get(url, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(r => setMessages(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedChat, user]);

  // Socket listeners for typing only
  useEffect(() => {
    if (!socket) return;

    const handleTyping = ({ senderId, senderName, groupId }) => {
      const relevant = selectedChat?.type === 'dm'
        ? senderId === selectedChat.id
        : groupId === selectedChat?.id;
      if (relevant) {
        setIsTyping(true);
        setTypingUser(senderName || '');
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setIsTyping(false), 2500);
      }
    };

    socket.on('typing', handleTyping);

    return () => {
      socket.off('typing', handleTyping);
    };
  }, [socket, selectedChat]);

  useEffect(() => {
    if (!socket) return;

    const handleDeletedMessage = ({ messageId, senderId, receiverId, groupId }) => {
      const isRelevantDM = selectedChat?.type === 'dm' && [senderId, receiverId].includes(selectedChat.id);
      const isRelevantGroup = selectedChat?.type === 'group' && selectedChat.id === groupId;
      if (isRelevantDM || isRelevantGroup) {
        setMessages(prev => prev.filter(msg => msg._id !== messageId));
      }
    };

    socket.on('message_deleted', handleDeletedMessage);

    return () => {
      socket.off('message_deleted', handleDeletedMessage);
    };
  }, [socket, selectedChat]);

  useEffect(() => {
    setSelectedMessages([]);
  }, [selectedChat?.id, selectedChat?.type]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleTyping = () => {
    if (!socket || !selectedChat) return;
    if (selectedChat.type === 'dm') {
      socket.emit('typing', { senderId: user.id, senderName: user.username, receiverId: selectedChat.id });
    } else {
      socket.emit('group_typing', { senderId: user.id, senderName: user.username, groupId: selectedChat.id });
    }
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text || !socket || !selectedChat) return;

    const msgData = {
      senderId: user.id,
      senderName: user.username,
      senderAvatar: user.avatar || '',
      message: text,
      timestamp: new Date().toISOString(),
      _id: Date.now().toString(),
    };

    if (selectedChat.type === 'dm') {
      msgData.receiverId = selectedChat.id;
      socket.emit('send_message', msgData);
    } else {
      msgData.groupId = selectedChat.id;
      msgData.groupName = selectedChat.name;
      socket.emit('send_group_message', msgData);
    }

    setMessages(prev => [...prev, msgData]);
    setInput('');
    if (textareaRef.current) { textareaRef.current.style.height = 'auto'; }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
    handleTyping();
  };

  const handleDeleteMessage = async (messageId) => {
    if (!socket || !messageId) return;
    try {
      setMessages(prev => prev.filter(msg => msg._id !== messageId));
      setSelectedMessages(prev => prev.filter(id => id !== messageId));
      socket.emit('delete_message', { messageId, requesterId: user.id });
    } catch (err) {
      console.error('Delete message failed', err);
    }
  };

  const toggleMessageSelection = (messageId) => {
    setSelectedMessages(prev =>
      prev.includes(messageId)
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const handleDeleteSelected = () => {
    const toDelete = [...selectedMessages];
    toDelete.forEach(messageId => handleDeleteMessage(messageId));
    setSelectedMessages([]);
  };

  const groupMessagesByDate = (msgs) => {
    const groups = [];
    let currentDate = null;
    let currentGroup = null;
    msgs.forEach(msg => {
      const dateStr = new Date(msg.timestamp).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      const label = dateStr === today ? 'Today' : dateStr;
      if (label !== currentDate) {
        currentDate = label;
        currentGroup = { date: label, messages: [] };
        groups.push(currentGroup);
      }
      currentGroup.messages.push(msg);
    });
    return groups;
  };

  if (!selectedChat || selectedChat.type === 'create-group') return null;

  const grouped = groupMessagesByDate(messages);

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-header">
        <div className="avatar-wrap">
          <div className="avatar" style={{ width: 40, height: 40, fontSize: 14, background: 'rgba(124,106,255,0.2)', color: '#a99fff' }}>
            {getInitials(selectedChat.name)}
          </div>
          {selectedChat.type === 'dm' && (
            <div className={`status-dot ${isOnline(selectedChat.id) ? 'online' : 'offline'}`} />
          )}
        </div>
        <div className="chat-header-info">
          <div className="chat-header-name">
            {selectedChat.name}
            {selectedChat.type === 'dm' && isOnline(selectedChat.id) && (
              <span className="online-pill">Online</span>
            )}
            {selectedChat.type === 'group' && (
              <span className="group-pill">Group</span>
            )}
          </div>
          <div className="chat-header-sub">
            {selectedChat.type === 'dm'
              ? isOnline(selectedChat.id) ? 'Active now' : 'Offline'
              : `${selectedChat.members?.length || 0} members`
            }
          </div>
        </div>
        <div className="header-actions">
          {selectedMessages.length > 0 ? (
            <>
              <span className="selection-count">{selectedMessages.length} selected</span>
              <button className="delete-selected-btn" onClick={handleDeleteSelected}>Delete</button>
              <button className="cancel-select-btn" onClick={() => setSelectedMessages([])}>Cancel</button>
            </>
          ) : (
            <>
              <button className="icon-btn">📞</button>
              <button className="icon-btn">🔍</button>
              <button className="icon-btn">⋯</button>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="messages-area">
        {loading ? (
          <div className="messages-loading">
            <div className="loading-dots"><span/><span/><span/></div>
          </div>
        ) : grouped.map((group, gi) => (
          <div key={gi}>
            <div className="date-divider"><span>{group.date}</span></div>
            {group.messages.map((msg, mi) => {
              const isOwn = msg.senderId === user.id;
              const prevMsg = group.messages[mi - 1];
              const nextMsg = group.messages[mi + 1];
              const sameAsPrev = prevMsg?.senderId === msg.senderId;
              const sameAsNext = nextMsg?.senderId === msg.senderId;
              const showAvatar = !isOwn && !sameAsNext;
              const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div key={msg._id || mi} className={`msg-row ${isOwn ? 'out' : 'in'} ${selectedMessages.includes(msg._id) ? 'selected' : ''}`}>
                  <button
                    className={`message-select-btn ${selectedMessages.includes(msg._id) ? 'selected' : ''}`}
                    onClick={() => toggleMessageSelection(msg._id)}
                    title="Select message"
                  >
                    {selectedMessages.includes(msg._id) ? '✓' : '○'}
                  </button>
                  {!isOwn && (
                    <div className={`msg-avatar ${showAvatar ? '' : 'invisible'}`}
                      style={{ background: 'rgba(124,106,255,0.2)', color: '#a99fff' }}>
                      {showAvatar ? getInitials(msg.senderName) : ''}
                    </div>
                  )}
                  <div className="msg-group">
                    {!isOwn && !sameAsPrev && selectedChat.type === 'group' && (
                      <div className="msg-sender-name">{msg.senderName}</div>
                    )}
                    <div className={`bubble ${isOwn ? 'out' : 'in'} ${sameAsPrev ? 'no-top-r' : ''} ${sameAsNext ? 'no-bot-r' : ''}`}>
                      {msg.message}
                    </div>
                    {(!sameAsNext || mi === group.messages.length - 1) && (
                      <div className="bubble-meta">
                        <span>{time}</span>
                        {isOwn && <span className="tick read">✓✓</span>}
                        <button
                          className="delete-msg-btn"
                          onClick={() => handleDeleteMessage(msg._id)}
                          title="Delete message"
                        >
                          🗑
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

        {isTyping && (
          <div className="msg-row in">
            <div className="msg-avatar" style={{ background: 'rgba(124,106,255,0.2)', color: '#a99fff' }}>
              {getInitials(selectedChat.name)}
            </div>
            <div className="typing-bubble">
              <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
              {typingUser && <span className="typing-name">{typingUser} is typing</span>}
            </div>
          </div>
        )}
        <div ref={bottomRef} />

      {/* Input */}
      <div className="input-area">
        <div className="input-row">
          <textarea
            ref={textareaRef}
            className="msg-input"
            placeholder={`Message ${selectedChat.name}...`}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <div className="input-actions">
            <button className="attach-btn">📎</button>
            <button className="attach-btn">😊</button>
            <button className="send-btn" onClick={sendMessage} disabled={!input.trim()}>➤</button>
          </div>
        </div>
        <div className="input-hint">Enter to send · Shift+Enter for new line</div>
      </div>
    </div>
  );
}

export default ChatWindow;
