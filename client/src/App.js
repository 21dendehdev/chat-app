import { useState, useEffect } from 'react';
//import Login from "./pages/Login";
import Chat from "./pages/Chat";
import ChatWindow from './pages/Chat';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const API = process.env.REACT_APP_API_URL; // FIXED (no VITE)

  useEffect(() => {
    const saved = localStorage.getItem('campchat_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('campchat_user', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    if (user) {
      try {
        await fetch(`${API}/api/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id })
        });
      } catch (err) {
        console.log(err);
      }
    }

    setUser(null);
    setSelectedChat(null);
    localStorage.removeItem('campchat_user');
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="app-shell">

      {/* SIDEBAR BACKDROP (MOBILE) */}
      <div
        className={`sidebar-backdrop ${sidebarOpen ? 'is-open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className="chat-shell">

        {/* SIDEBAR */}
        <Sidebar
          user={user}
          selectedChat={selectedChat}
          onSelectChat={(chat) => {
            setSelectedChat(chat);
            setSidebarOpen(false); // close on mobile
          }}
          onLogout={handleLogout}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* MAIN AREA */}
        <div className="main-area">

          {/* MOBILE TOP BAR BUTTON */}
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          {selectedChat ? (
            <ChatWindow user={user} selectedChat={selectedChat} />
          ) : (
            <div className="empty-chat">
              <div className="empty-chat-inner">
                <h2>Welcome 👋</h2>
                <p>Select a chat to start messaging</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;
