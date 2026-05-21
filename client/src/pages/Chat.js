import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

import BASE_URL from "../config";

import BottomNav from "../components/BottomNav";
import ContactsPanel from "../components/ContactsPanel";
import ChatPanel from "../components/ChatPanel";
import SettingsPanel from "../components/SettingsPanel";

function Chat({ user, onLogout, onUserUpdate }) {

  const [activeTab, setActiveTab] = useState("chats");
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});

  const socketRef = useRef(null);
  const selectedChatRef = useRef(null);
  console.log("Chat component rendered with user:", user);

  // Update ref when selectedChat changes
  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  // Debug user object
  useEffect(() => {
    console.log("Current user:", user);
    console.log("User ID:", user?.id);
    console.log("User name:", user?.name);
  }, [user]);

  /*
  -----------------------------------
  NOTIFICATION PERMISSION
  -----------------------------------
  */
  useEffect(() => {
    if (
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }
  }, []);

  /*
  -----------------------------------
  SOCKET CONNECTION
  -----------------------------------
  */
  useEffect(() => {
    if (!user?.id) return;

    console.log("🟢 Connecting to socket...");
    
    const socket = io(BASE_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      auth: {
        token: user.token,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected successfully with ID:", socket.id);
      socket.emit("register_user", user.id);
    });

    socket.on("connect_error", (error) => {
      console.log("❌ Socket connection error:", error.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    socket.on("online_users", (users) => {
      console.log("👥 Online users:", users);
      setOnlineUsers(users);
    });

    socket.on("receive_message", (data) => {
      console.log("📨 New message received:", data);

      // Show notification if tab is not active
      if (Notification.permission === "granted" && document.hidden) {
        new Notification(`Message from ${data.senderName}`, {
          body: data.message.substring(0, 50),
          icon: data.senderAvatar || undefined,
        });
      }

      // Add message to state
      setMessages((prev) => [...prev, data]);

      // Update unread counts
      setUnreadCounts((prev) => ({
        ...prev,
        [data.senderId]:
          selectedChatRef.current?.id === data.senderId
            ? 0
            : (prev[data.senderId] || 0) + 1,
      }));
    });

    socket.on("receive_group_message", (data) => {
      console.log("📨 New group message:", data);

      if (Notification.permission === "granted" && document.hidden) {
        new Notification(`Message in ${data.groupName || "Group"}`, {
          body: `${data.senderName}: ${data.message.substring(0, 50)}`,
        });
      }

      setMessages((prev) => [...prev, data]);

      const isViewing =
        selectedChatRef.current?.type === "group" &&
        selectedChatRef.current?.id === data.groupId;

      setUnreadCounts((prev) => ({
        ...prev,
        [data.groupId]:
          isViewing ? 0 : (prev[data.groupId] || 0) + 1,
      }));
    });

    // Cleanup
    return () => {
      socket.disconnect();
    };
  }, [user]);

  /*
  -----------------------------------
  FETCH CONTACTS
  -----------------------------------
  */
  const fetchContacts = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/users`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const filteredUsers = response.data.filter(
        (u) => u._id !== user.id
      );

      setContacts(filteredUsers);

    } catch (error) {
      console.log("Failed to fetch contacts", error);
    }
  };

  /*
  -----------------------------------
  FETCH GROUPS
  -----------------------------------
  */
  const fetchGroups = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/groups/user/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setGroups(response.data);

      // Join group rooms
      response.data.forEach((group) => {
        socketRef.current?.emit("join_group", group._id);
      });

    } catch (error) {
      console.log("Failed to fetch groups", error);
    }
  };

  /*
  -----------------------------------
  INITIAL FETCH
  -----------------------------------
  */
  useEffect(() => {
    if (user?.id) {
      fetchContacts();
      fetchGroups();
    }
  }, [user]);

  /*
  -----------------------------------
  SELECT CHAT
  -----------------------------------
  */
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setMessages([]);

    if (chat?.id) {
      setUnreadCounts((prev) => ({
        ...prev,
        [chat.id]: 0,
      }));
    }

    setActiveTab("chats");
  };

  return (
    <div className="chat-page">

      <div className="page-content">

        {activeTab === "chats" && (
          <ChatPanel
            user={user}
            selectedChat={selectedChat}
            socket={socketRef.current}
            onlineUsers={onlineUsers}
            messages={messages}
            setMessages={setMessages}
          />
        )}

        {activeTab === "contacts" && (
          <ContactsPanel
            onlineUsers={onlineUsers}
            unreadCounts={unreadCounts}
            onSelectChat={handleSelectChat}
            currentUser={user}
          />
        )}

        {activeTab === "settings" && (
          <SettingsPanel
            user={user}
            onLogout={onLogout}
            onUserUpdate={onUserUpdate}
          />
        )}

      </div>

      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

    </div>
  );
}

export default Chat;