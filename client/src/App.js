import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Chat from './pages/Chat';
import AdminDashboard from './AdminDashboard';
import './App.css';

function App() {
  const [user, setUser]         = useState(null);
  const [viewAdmin, setViewAdmin] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('campchat_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('campchat_user', JSON.stringify(userData));
    // Auto-open admin dashboard if admin
    if (userData.isAdmin) setViewAdmin(true);
  };

  const handleLogout = async () => {
    if (user) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id })
        });
      } catch {}
    }
    setUser(null);
    setViewAdmin(false);
    localStorage.removeItem('campchat_user');
  };

  const handleUserUpdate = (updated) => {
    setUser(updated);
    localStorage.setItem('campchat_user', JSON.stringify(updated));
  };

  if (!user) return <Login onLogin={handleLogin} />;

  // Admin can toggle between dashboard and chat
  if (user.isAdmin && viewAdmin) {
    return (
      <AdminDashboard
        user={user}
        onExitAdmin={() => setViewAdmin(false)}
      />
    );
  }

  return (
    <Chat
      user={user}
      onLogout={handleLogout}
      onUserUpdate={handleUserUpdate}
      onOpenAdmin={user.isAdmin ? () => setViewAdmin(true) : null}
    />
  );
}

export default App;
