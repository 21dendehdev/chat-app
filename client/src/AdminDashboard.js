import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import BASE_URL from './config';

function fmt(seconds) {
  if (!seconds || seconds === 0) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function timeAgo(date) {
  if (!date) return 'Never';
  const diff = Date.now() - new Date(date);
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
  return new Date(date).toLocaleDateString();
}

function getInitials(name = '') { return name.slice(0, 2).toUpperCase(); }

function AdminDashboard({ user, onExitAdmin }) {
  const [tab, setTab]           = useState('overview');
  const [stats, setStats]       = useState(null);
  const [users, setUsers]       = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [search, setSearch]     = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast]       = useState('');

  const headers = { Authorization: `Bearer ${user.token}` };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const loadStats = useCallback(async () => {
    try {
      const r = await axios.get(`${BASE_URL}/api/admin/stats`, { headers });
      setStats(r.data);
    } catch {}
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${BASE_URL}/api/admin/users`, { headers });
      setUsers(r.data);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { loadStats(); loadUsers(); }, []);

  const viewMessages = async (u) => {
    setSelectedUser(u);
    setTab('messages');
    setLoading(true);
    try {
      const r = await axios.get(`${BASE_URL}/api/admin/messages/${u._id}`, { headers });
      setMessages(r.data);
    } catch {}
    setLoading(false);
  };

  const viewSessions = async (u) => {
    setSelectedUser(u);
    setTab('sessions');
    setLoading(true);
    try {
      const r = await axios.get(`${BASE_URL}/api/admin/sessions/${u._id}`, { headers });
      setSessions(r.data);
    } catch {}
    setLoading(false);
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`${BASE_URL}/api/admin/users/${userId}`, { headers });
      setUsers(prev => prev.filter(u => u._id !== userId));
      setDeleteConfirm(null);
      showToast('User deleted successfully');
      loadStats();
    } catch (err) {
      showToast(err.response?.data?.error || 'Delete failed');
    }
  };

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-shell">
      {/* Toast */}
      {toast && <div className="admin-toast">{toast}</div>}

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <div className="confirm-icon">⚠</div>
            <h3>Delete User</h3>
            <p>Are you sure you want to delete <strong>{deleteConfirm.username}</strong>? This cannot be undone.</p>
            <div className="confirm-actions">
              <button className="confirm-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="confirm-delete" onClick={() => deleteUser(deleteConfirm._id)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-dot" />
          <div>
            <div className="admin-brand-name">CampChat</div>
            <div className="admin-brand-sub">Admin Panel</div>
          </div>
        </div>

        <nav className="admin-nav">
          {[
            { id: 'overview', icon: '◈', label: 'Overview' },
            { id: 'users',    icon: '◉', label: 'Users' },
            { id: 'messages', icon: '◎', label: 'Messages' },
            { id: 'sessions', icon: '◷', label: 'Sessions' },
          ].map(item => (
            <button
              key={item.id}
              className={`admin-nav-item ${tab === item.id ? 'active' : ''}`}
              onClick={() => setTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-chip">
            <div className="admin-avatar">{getInitials(user.username)}</div>
            <div>
              <div className="admin-user-name">{user.username}</div>
              <div className="admin-user-role">Administrator</div>
            </div>
          </div>
          <button className="admin-exit-btn" onClick={onExitAdmin}>← Exit</button>
        </div>
      </div>

      {/* Main */}
      <div className="admin-main">

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h1 className="admin-title">Overview</h1>
              <button className="admin-refresh-btn" onClick={() => { loadStats(); loadUsers(); }}>↻ Refresh</button>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon blue">◉</div>
                <div className="stat-value">{stats?.totalUsers ?? '—'}</div>
                <div className="stat-label">Total Users</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green">●</div>
                <div className="stat-value">{stats?.onlineUsers ?? '—'}</div>
                <div className="stat-label">Online Now</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple">◎</div>
                <div className="stat-value">{stats?.totalMessages ?? '—'}</div>
                <div className="stat-label">Total Messages</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon amber">★</div>
                <div className="stat-value">{stats?.newToday ?? '—'}</div>
                <div className="stat-label">New Today</div>
              </div>
            </div>

            <div className="admin-section-header" style={{ marginTop: 36 }}>
              <h2 className="admin-subtitle">Recent Users</h2>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Time Spent</th>
                    <th>Contacts</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 8).map(u => (
                    <tr key={u._id}>
                      <td>
                        <div className="table-user-cell">
                          {u.avatar
                            ? <img src={u.avatar} alt="" className="table-avatar-img" />
                            : <div className="table-avatar">{getInitials(u.username)}</div>}
                          <span>{u.username}</span>
                        </div>
                      </td>
                      <td><span className={`status-pill ${u.isOnline ? 'online' : 'offline'}`}>{u.isOnline ? 'Online' : 'Offline'}</span></td>
                      <td className="muted">{timeAgo(u.lastLoginAt)}</td>
                      <td className="muted">{fmt(u.totalTimeSpent)}</td>
                      <td className="muted">{u.contactCount}</td>
                      <td>
                        <div className="table-actions">
                          <button className="tbl-btn" onClick={() => viewMessages(u)}>Messages</button>
                          <button className="tbl-btn danger" onClick={() => setDeleteConfirm(u)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {tab === 'users' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h1 className="admin-title">All Users</h1>
              <div className="admin-search-wrap">
                <span className="admin-search-icon">⌕</span>
                <input className="admin-search" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Last Login</th>
                    <th>Time Spent</th>
                    <th>Sessions</th>
                    <th>Contacts</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={8} className="table-loading">Loading...</td></tr>
                  ) : filtered.map(u => (
                    <tr key={u._id}>
                      <td>
                        <div className="table-user-cell">
                          {u.avatar
                            ? <img src={u.avatar} alt="" className="table-avatar-img" />
                            : <div className="table-avatar">{getInitials(u.username)}</div>}
                          <div>
                            <div>{u.username}</div>
                            {u.bio && <div className="table-bio">{u.bio}</div>}
                          </div>
                        </div>
                      </td>
                      <td><span className={`status-pill ${u.isOnline ? 'online' : 'offline'}`}>{u.isOnline ? 'Online' : 'Offline'}</span></td>
                      <td className="muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="muted">{timeAgo(u.lastLoginAt)}</td>
                      <td className="muted">{fmt(u.totalTimeSpent)}</td>
                      <td className="muted">{u.sessionCount}</td>
                      <td className="muted">{u.contactCount}</td>
                      <td>
                        <div className="table-actions">
                          <button className="tbl-btn" onClick={() => viewMessages(u)}>📨 Msgs</button>
                          <button className="tbl-btn" onClick={() => viewSessions(u)}>⏱ Sessions</button>
                          <button className="tbl-btn danger" onClick={() => setDeleteConfirm(u)}>🗑 Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── MESSAGES ── */}
        {tab === 'messages' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <div>
                <h1 className="admin-title">
                  {selectedUser ? `Messages — ${selectedUser.username}` : 'Messages'}
                </h1>
                {selectedUser && <p className="admin-subtitle-text">Showing last 100 messages sent or received</p>}
              </div>
              {!selectedUser && <p className="muted" style={{ alignSelf: 'center' }}>Select a user from the Users tab to view their messages</p>}
            </div>

            {selectedUser && (
              <div className="messages-admin-list">
                {loading ? (
                  <div className="admin-loading">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="admin-empty">No messages found for this user</div>
                ) : messages.map((msg, i) => (
                  <div key={i} className={`admin-msg-row ${msg.senderId === selectedUser._id ? 'sent' : 'received'}`}>
                    <div className="admin-msg-meta">
                      <span className="admin-msg-sender">{msg.senderName || msg.senderId}</span>
                      <span className="admin-msg-arrow">{msg.senderId === selectedUser._id ? '→' : '←'}</span>
                      <span className="admin-msg-receiver">{msg.receiverId || msg.groupId || 'Group'}</span>
                      <span className="admin-msg-time">{new Date(msg.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="admin-msg-bubble">{msg.message}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SESSIONS ── */}
        {tab === 'sessions' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <div>
                <h1 className="admin-title">
                  {selectedUser ? `Sessions — ${selectedUser.username}` : 'Sessions'}
                </h1>
                {sessions && (
                  <p className="admin-subtitle-text">
                    Total time spent: <strong>{fmt(sessions.totalTimeSpent)}</strong>
                  </p>
                )}
              </div>
              {!selectedUser && <p className="muted" style={{ alignSelf: 'center' }}>Select a user from the Users tab to view their sessions</p>}
            </div>

            {sessions && (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Login Time</th>
                      <th>Logout Time</th>
                      <th>Duration</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={5} className="table-loading">Loading...</td></tr>
                    ) : [...sessions.sessions].reverse().map((s, i) => (
                      <tr key={i}>
                        <td className="muted">{sessions.sessions.length - i}</td>
                        <td>{new Date(s.loginTime).toLocaleString()}</td>
                        <td className="muted">{s.logoutTime ? new Date(s.logoutTime).toLocaleString() : '—'}</td>
                        <td>{fmt(s.duration)}</td>
                        <td>
                          <span className={`status-pill ${!s.logoutTime ? 'online' : 'offline'}`}>
                            {!s.logoutTime ? 'Active' : 'Ended'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;
