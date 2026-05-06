
import { useState } from 'react';
import { FaCog } from 'react-icons/fa';
import SettingsPanel from './SettingsPanel';

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function Sidebar({
  user,
  contacts = [],
  groups = [],
  onlineUsers = [],
  unreadCounts = {},
  selectedChat,
  onSelectChat,
  onLogout,
  sidebarOpen,
  setSidebarOpen,
  onRefreshUsers,
  onUserUpdate
}) {
  const [search, setSearch] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const filteredContacts = contacts.filter(c =>
    c.username?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredGroups = groups.filter(g =>
    g.name?.toLowerCase().includes(search.toLowerCase())
  );

  const isOnline = (id) => onlineUsers.includes(id);

  return (
    <div className={`sidebar ${sidebarOpen ? 'is-open' : ''}`}>

      <div className="sidebar-header">
        <div className="logo-text">CampChat</div>
        <input
          className="search-input"
          placeholder="🔍  Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="contact-list">
        {filteredContacts.length === 0 && filteredGroups.length === 0 && (
          <div className="empty-state">
            <div style={{fontSize: 32, marginBottom: 8}}>💬</div>
            No contacts yet
          </div>
        )}

        {filteredContacts.map((c) => (
          <div
            key={c._id}
            className={`contact-item ${selectedChat?.id === c._id ? 'active' : ''}`}
            onClick={() => onSelectChat({ type: 'dm', id: c._id, name: c.username })}
          >
            <div className="contact-avatar-circle">
              {getInitials(c.username)}
              {isOnline(c._id) && <span className="online-dot" />}
            </div>
            <div className="contact-info">
              <div className="contact-name">{c.username}</div>
              <div className="contact-sub">{isOnline(c._id) ? '🟢 Online' : 'Offline'}</div>
            </div>
            {unreadCounts[c._id] > 0 && (
              <div className="unread-badge">{unreadCounts[c._id]}</div>
            )}
          </div>
        ))}

        {filteredGroups.length > 0 && (
          <div style={{padding: '8px 12px 4px', fontSize: 11, color: 'var(--text3)', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase'}}>
            Groups
          </div>
        )}

        {filteredGroups.map((g) => (
          <div
            key={g._id}
            className={`contact-item ${selectedChat?.id === g._id ? 'active' : ''}`}
            onClick={() => onSelectChat({ type: 'group', id: g._id, name: g.name })}
          >
            <div className="contact-avatar-circle" style={{background: 'linear-gradient(135deg, #e85a1a, #ff8c5a)'}}>
              #
            </div>
            <div className="contact-info">
              <div className="contact-name">{g.name}</div>
              <div className="contact-sub">Group</div>
            </div>
            {unreadCounts[g._id] > 0 && (
              <div className="unread-badge">{unreadCounts[g._id]}</div>
            )}
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="contact-avatar-circle" style={{width: 32, height: 32, fontSize: 12, flexShrink: 0}}>
          {getInitials(user?.username)}
        </div>
        <div className="footer-name">{user?.username}</div>
        <button className="icon-btn" onClick={() => setShowSettings(true)} title="Settings">
          <FaCog size={14} />
        </button>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>

      {showSettings && (
        <SettingsPanel
          user={user}
          onClose={() => setShowSettings(false)}
          onUserUpdate={onUserUpdate}
          onLogout={onLogout}
        />
      )}
    </div>
  );
}

export default Sidebar;
