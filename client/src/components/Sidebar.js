import { useState } from 'react';
import { FaCog } from 'react-icons/fa';
import SettingsPanel from './SettingsPanel';

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

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      <div className={`sidebar ${sidebarOpen ? 'is-open' : ''}`}>

        <div className="sidebar-header">
          <div className="logo-text">ChatApp</div>

          <input
            className="search-input"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="contact-list">
          {filteredContacts.length === 0 && filteredGroups.length === 0 && (
            <div className="empty-state">No contacts yet</div>
          )}

          {filteredContacts.map((c) => (
            <div
              key={c._id}
              className={`contact-item ${selectedChat?.id === c._id ? 'active' : ''}`}
              onClick={() => {
                onSelectChat({ type: 'dm', id: c._id, name: c.username });
                closeSidebar();
              }}
            >
              <div className="contact-name">{c.username}</div>

              {unreadCounts[c._id] > 0 && (
                <div className="unread-badge">{unreadCounts[c._id]}</div>
              )}
            </div>
          ))}

          {filteredGroups.map((g) => (
            <div
              key={g._id}
              className={`contact-item ${selectedChat?.id === g._id ? 'active' : ''}`}
              onClick={() => {
                onSelectChat({ type: 'group', id: g._id, name: g.name });
                closeSidebar();
              }}
            >
              <div className="contact-name">{g.name}</div>

              {unreadCounts[g._id] > 0 && (
                <div className="unread-badge">{unreadCounts[g._id]}</div>
              )}
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="footer-name">{user?.username}</div>

          <button className="icon-btn" onClick={() => setShowSettings(true)}>
            <FaCog />
          </button>

          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>

        {showSettings && (
          <SettingsPanel
            user={user}
            onClose={() => setShowSettings(false)}
          />
        )}

      </div>

      {/* MOBILE BACKDROP */}
      <div
        className={`sidebar-backdrop ${sidebarOpen ? 'is-open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
    </>
  );
}

export default Sidebar;
