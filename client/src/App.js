import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Chat from './pages/Chat';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const saved = localStorage.getItem('campchat_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
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
      } catch (err) { console.log(err); }
    }
    setUser(null);
    localStorage.removeItem('campchat_user');
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('campchat_user', JSON.stringify(updatedUser));
  };

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <Chat
      user={user}
      onLogout={handleLogout}
      onUserUpdate={handleUserUpdate}
    />
  );
}

export default App;
