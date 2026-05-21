import { useState, useEffect, useRef } from "react";

function ChatPanel({
  user,
  selectedChat,
  socket,
  messages,
  setMessages
}) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const sentMessageIds = useRef(new Set()); // track local temp IDs to avoid duplicates

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for incoming messages (only from others)
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      console.log("Message received:", data);
      
      // Check if message is for current chat
      if (selectedChat && data.senderId === selectedChat.id) {
        // Avoid duplicate if we already optimistically added it
        const tempKey = `${data.senderId}_${data.message}_${data.timestamp}`;
        if (!sentMessageIds.current.has(tempKey)) {
          setMessages((prev) => [...prev, data]);
          sentMessageIds.current.add(tempKey);
          // Clean up after 1 second
          setTimeout(() => sentMessageIds.current.delete(tempKey), 1000);
        } else {
          console.log("Duplicate received message ignored");
        }
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, selectedChat, setMessages]);

  // Send message handler – prevents double sends
  const handleSendMessage = async () => {
    if (!text.trim()) return;
    if (!selectedChat) return;
    if (isSending) return; // already sending

    setIsSending(true);

    const messageData = {
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar || "",
      receiverId: selectedChat.id,
      message: text,
      timestamp: new Date(),
      type: selectedChat.type || "dm"
    };

    // Create a temporary unique key for deduplication
    const tempKey = `${messageData.senderId}_${messageData.message}_${messageData.timestamp.getTime()}`;
    sentMessageIds.current.add(tempKey);

    console.log("Sending message:", messageData);

    // 1. Optimistically add to UI
    setMessages((prev) => [...prev, messageData]);
    setText("");

    // 2. Emit to socket (server will save to DB)
    if (socket && socket.connected) {
      socket.emit("send_message", messageData);
      console.log("✅ Message emitted to socket");
    } else {
      console.log("❌ Socket not connected!");
      // Optionally show error to user
    }

    // 3. Clean up temp key after a short delay
    setTimeout(() => {
      sentMessageIds.current.delete(tempKey);
    }, 2000);

    // Re-enable send button after a short delay (server processing is async)
    setTimeout(() => {
      setIsSending(false);
    }, 500);
  };

  // If no chat is selected, show placeholder
  if (!selectedChat) {
    return (
      <div className="chat-panel">
        <div className="chat-header">
          <div className="chat-brand">
            <img
              src="/logo.png"
              alt="CampChat Logo"
              className="chat-logo"
            />
            <h2>CampChat</h2>
          </div>
        </div>
        <div className="messages-area">
          <div className="empty-state">
            Select a contact to start chatting
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-panel">
      <h1>Messages</h1>

      {/* HEADER */}
      <div className="chat-header">
        <div className="chat-user-info">
          <div className="chat-avatar">
            {selectedChat.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3>{selectedChat.name}</h3>
            <p className="chat-status">Online</p>
          </div>
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div className="messages-area">
        {messages.length === 0 ? (
          <div className="empty-state">
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMine = msg.senderId === user.id;
            // Use a stable key: _id if exists, else index + timestamp
            const key = msg._id || `${msg.senderId}_${msg.timestamp}_${index}`;
            return (
              <div
                key={key}
                className={`message-row ${isMine ? "mine" : "theirs"}`}
              >
                <div className="message-bubble">
                  <p>{msg.message}</p>
                  <span className="message-time">
                    {new Date(msg.timestamp || msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !isSending) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={isSending}
        />
        <button 
          onClick={handleSendMessage} 
          disabled={!text.trim() || isSending}
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default ChatPanel;