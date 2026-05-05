import { useState } from 'react';
import { FaCog } from 'react-icons/fa';
import SettingsPanel from './SettingsPanel';

function Sidebar({
  user,
  selectedChat,
  onSelectChat,
  onLogout,
  sidebarOpen,
  setSidebarOpen
}) {
  const [search, setSearch] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // 🔥 FIX: prevent crash if undefined
  const contacts = [];
  const groups = [];
  const onlineUsers = [];
  const unreadCounts = {};

  const filteredContacts = contacts.filter(c =>
    c.username?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredGroups = groups.filter(g =>
    g.name?.toLowerCase().includes(search.toLowerCase())
  );

  const isOnline = (id) => onlineUsers.includes(id);

  return (
    <div className={`sidebar ${sidebarOpen ? 'is-open' : ''}`}>

      {/* HEADER */}
      <div className="sidebar-header">
        <div className="logo-text">ChatApp</div>

        <input
          className="search-input"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* CONTACTS */}
      <div className="contact-list">

        {filteredContacts.length === 0 && (
          <div className="empty-state">No contacts yet</div>
        )}

        {filteredContacts.map((c) => (
          <div
            key={c._id}
            className={`contact-item ${
              selectedChat?.id === c._id ? 'active' : ''
            }`}
            onClick={() =>
              onSelectChat({
                type: 'dm',
                id: c._id,
                name: c.username
              })
            }
          >
            <div className="contact-name">{c.username}</div>
          </div>
        ))}

        {/* GROUPS */}
        {filteredGroups.map((g) => (
          <div
            key={g._id}
            className="contact-item"
            onClick={() =>
              onSelectChat({
                type: 'group',
                id: g._id,
                name: g.name
              })
            }
          >
            {g.name}
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="sidebar-footer">
        <div>{user?.username}</div>

        <button onClick={() => setShowSettings(true)}>
          <FaCog />
        </button>

        <button onClick={onLogout}>Logout</button>
      </div>

      {/* SETTINGS */}
      {showSettings && (
        <SettingsPanel
          user={user}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default Sidebar;
