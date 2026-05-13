import { useState } from "react";

function ChatPanel({
  user,
  selectedChat,
  socket,
  messages,
  setMessages
}) {

  const [text, setText] = useState("");

  /*
   -----------------------------------
   SEND MESSAGE
   -----------------------------------
  */

  const handleSendMessage = () => {

    if (!text.trim()) return;

    if (!selectedChat) return;

    const messageData = {

      senderId: user.id,

      senderName: user.username,

      receiverId: selectedChat.id,

      message: text,

      createdAt: new Date(),
    };

    /*
     -----------------------------------
     EMIT SOCKET MESSAGE
     -----------------------------------
    */

    socket.emit(
      "send_message",
      messageData
    );

    /*
     -----------------------------------
     UPDATE LOCAL UI
     -----------------------------------
    */

    setMessages((prev) => [
      ...prev,
      messageData
    ]);

    setText("");
  };

  return (

    <div className="chat-panel">

      {/* HEADER */}

      <div className="chat-header">

        {selectedChat ? (

          <>
            <div className="chat-avatar">
              {selectedChat.name?.charAt(0)}
            </div>

            <div>
              <h3>{selectedChat.name}</h3>

              <p className="chat-status">
                Online
              </p>
            </div>
          </>

        ) : (

          <div className="chat-brand">

            <img
              src="/logo.png"
              alt="CampChat Logo"
              className="chat-logo"
            />

            <h2>CampChat</h2>

          </div>

        )}

      </div>

      {/* MESSAGES AREA */}

      <div className="messages-area">

        {messages.length === 0 ? (

          <div className="empty-state">
            No messages yet
          </div>

        ) : (

          messages.map((msg, index) => {

            const isMine =
              msg.senderId === user.id;

            return (

              <div
                key={index}
                className={`message-row ${
                  isMine
                    ? "mine"
                    : "theirs"
                }`}
              >

                <div className="message-bubble">

                  <p>{msg.message}</p>

                  <span className="message-time">

                    {new Date(
                      msg.createdAt
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}

                  </span>

                </div>

              </div>
            );
          })

        )}

      </div>

      {/* INPUT */}

      <div className="chat-input">

        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }

          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />

        <button
          onClick={handleSendMessage}
        >
          Send
        </button>

      </div>

    </div>
  );
}

export default ChatPanel;