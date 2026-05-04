import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import CreateGroup from '../components/CreateGroup';
import BASE_URL from '../config';

function Chat({ user, onLogout, onUserUpdate }) {
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Track selected chat in ref for socket handlers
  const selectedChatRef = useRef(null);
  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  // Init socket - runs only once
  useEffect(() => {
   const socket = io(process.env.REACT_APP_API_URL, {
  auth: { token: user.token }
});
    socketRef.current = socket;

    socket.emit('register_user', user.id);

    socket.on('online_users', (users) => setOnlineUsers(users));

    socket.on('receive_message', (data) => {
      // Show notification
      if (Notification.permission === 'granted') {
        new Notification(`Message from ${data.senderName}`, {
          body: data.message.substring(0, 50),
          icon: data.senderAvatar || undefined,
          badge: '/favicon.ico'
        });
      }

      // Update messages
      setMessages(prev => [...prev, data]);

      // Auto-open chat with sender
      setSelectedChat({
        type: 'dm',
        id: data.senderId,
        name: data.senderName,
        avatar: data.senderAvatar
      });

      // Clear unread for this sender since we're opening their chat
      setUnreadCounts(prev => ({
        ...prev,
        [data.senderId]: 0
      }));
    });

    socket.on('receive_group_message', (data) => {
      // Show notification
      if (Notification.permission === 'granted') {
        new Notification(`Message in ${data.groupName || 'Group'}`, {
          body: `${data.senderName}: ${data.message.substring(0, 50)}`,
          badge: '/favicon.ico'
        });
      }

      // Add message
      setMessages(prev => [...prev, data]);

      // Increment unread count for group if not currently viewing
      const isViewingGroup = selectedChatRef.current?.type === 'group' && selectedChatRef.current?.id === data.groupId;
      setUnreadCounts(prev => ({
        ...prev,
        [data.groupId]: isViewingGroup ? 0 : (prev[data.groupId] || 0) + 1
      }));
    });

    return () => socket.disconnect();
  }, [user.token]);

  // Load contacts
useEffect(() => {
 

  axios.get(`${API}/api/users`), {
    headers: { Authorization: `Bearer ${user.token}` }
  })
    .then(r => setContacts(r.data.filter(u => u._id !== user.id)))
    .catch(() => {});
}, [user]);

  // Load groups
  useEffect(() => {
    axios.get((`${API}/api/groups/user/${user.id}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(r => {
        setGroups(r.data);
        r.data.forEach(g => socketRef.current?.emit('join_group', g._id));
      })
      .catch(() => {});
  }, [user]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setMessages([]);
    if (chat.id) {
      setUnreadCounts(prev => ({ ...prev, [chat.id]: 0 }));
    }
  };

  const handleGroupCreated = (group) => {
    setGroups(prev => [...prev, group]);
    handleSelectChat({ type: 'group', id: group._id, name: group.name, members: group.members });
  };

  const handleRefreshUsers = () => {
    axios.get((`${API}/api/users', {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(r => setContacts(r.data.filter(u => u._id !== user.id)))
      .catch(() => {});
  };

  const showEmpty = !selectedChat || selectedChat.type === 'create-group' && false;

  return (
    <div className="chat-shell">
      <Sidebar
        user={user}
        contacts={contacts}
        groups={groups}
        onlineUsers={onlineUsers}
        unreadCounts={unreadCounts}
        selectedChat={selectedChat}
        onSelectChat={handleSelectChat}
        onLogout={onLogout}
        onRefreshUsers={handleRefreshUsers}
        onUserUpdate={onUserUpdate}
      />

      <div className="main-area">
        {!selectedChat && (
          <div className="empty-chat">
            <div className="empty-chat-inner">
              <div className="empty-logo-dot" />
              <h2>Welcome to CampChat</h2>
              <p>Select a conversation or start a new one</p>
            </div>
          </div>
        )}

        {selectedChat?.type === 'create-group' && (
          <CreateGroup
            user={user}
            contacts={contacts}
            socket={socketRef.current}
            onGroupCreated={handleGroupCreated}
            onCancel={() => setSelectedChat(null)}
          />
        )}

        {selectedChat && selectedChat.type !== 'create-group' && (
          <ChatWindow
            user={user}
            selectedChat={selectedChat}
            socket={socketRef.current}
            onlineUsers={onlineUsers}
            messages={messages}
            setMessages={setMessages}
          />
        )}
      </div>
    </div>
  );
}

export default Chat;
