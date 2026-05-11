
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

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

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

    const socket = io(process.env.REACT_APP_API_URL, {
      auth: {
        token: user.token,
      },
    });

    socketRef.current = socket;

    socket.emit("register_user", user.id);

    socket.on("online_users", setOnlineUsers);

    /*
     -----------------------------------
     DIRECT MESSAGE RECEIVING
     -----------------------------------
    */

    socket.on("receive_message", (data) => {

      if (Notification.permission === "granted") {
        new Notification(`Message from ${data.senderName}`, {
          body: data.message.substring(0, 50),
          icon: data.senderAvatar || undefined,
        });
      }

      setMessages((prev) => [...prev, data]);

      setUnreadCounts((prev) => ({
        ...prev,
        [data.senderId]:
          selectedChatRef.current?.id === data.senderId
            ? 0
            : (prev[data.senderId] || 0) + 1,
      }));
    });

    /*
     -----------------------------------
     GROUP MESSAGE RECEIVING
     -----------------------------------
    */

    socket.on("receive_group_message", (data) => {

      if (Notification.permission === "granted") {
        new Notification(
          `Message in ${data.groupName || "Group"}`,
          {
            body: `${data.senderName}: ${data.message.substring(0, 50)}`,
          }
        );
      }

      setMessages((prev) => [...prev, data]);

      const isViewing =
        selectedChatRef.current?.type === "group" &&
        selectedChatRef.current?.id === data.groupId;

      setUnreadCounts((prev) => ({
        ...prev,
        [data.groupId]:
          isViewing
            ? 0
            : (prev[data.groupId] || 0) + 1,
      }));
    });

    return () => socket.disconnect();

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
            Authorization: `Bearer ${user.token}`
          }
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

      response.data.forEach((group) => {
        socketRef.current?.emit(
          "join_group",
          group._id
        );
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
    fetchContacts();
    fetchGroups();
  }, []);

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
  }
  return (

    <div className="chat-page">

      {/* -------------------------
          MAIN CONTENT
      ------------------------- */}

      <div className="page-content">

        {/* CHAT SCREEN */}

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

        {/* CONTACTS SCREEN */}

        {activeTab === "contacts" && (

          <ContactsPanel
            contacts={contacts}
            groups={groups}
            onlineUsers={onlineUsers}
            unreadCounts={unreadCounts}
            selectedChat={selectedChat}
            onSelectChat={handleSelectChat}
            onRefreshUsers={fetchContacts}
          />

        )}


        {/* SETTINGS SCREEN */}

        {activeTab === "settings" && (

          <SettingsPanel
            user={user}
            onLogout={onLogout}
            onUserUpdate={onUserUpdate}
          />

        )}

      </div>

      {/* -------------------------
          BOTTOM NAVIGATION
      ------------------------- */}

      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

    </div>
  );
}

export default Chat;
