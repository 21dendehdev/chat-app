import { useState } from 'react';
import { FaCog } from 'react-icons/fa';
import SettingsPanel from './SettingsPanel';

function getInitials(name = '') {
  return name.slice(0, 2).toUpperCase();
}

function Sidebar({ user, contacts, groups, onlineUsers, unreadCounts, selectedChat, onSelectChat, onLogout, onRefreshUsers, onUserUpdate }) {
  const [tab, setTab] = useState('dms');
  const [search, setSearch] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const filteredContacts = contacts.filter(c =>
    c.username.toLowerCase().includes(search.toLowerCase())
  );

  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const isOnline = (userId) => onlineUsers.includes(userId);

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return 'yesterday';
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Logo" style={{ width: '30px', height: '30px' }} />
        </div>
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input
            className="search-input"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>
      </div>

      <div className="sidebar-tabs">
        <button className={`sidebar-tab ${tab === 'dms' ? 'active' : ''}`} onClick={() => setTab('dms')}>
          Direct
        </button>
        <button className={`sidebar-tab ${tab === 'groups' ? 'active' : ''}`} onClick={() => setTab('groups')}>
          Groups
          {groups.length > 0 && <span className="tab-count">{groups.length}</span>}
        </button>
        {tab === 'dms' && (
          <button className="refresh-btn" onClick={onRefreshUsers} title="Refresh users">
            🔄
          </button>
        )}
      </div>

      <div className="contact-list">
        {tab === 'dms' ? (
          filteredContacts.length === 0 ? (
            <div className="empty-state">No contacts found</div>
          ) : filteredContacts.map(contact => {
            const isSelected = selectedChat?.type === 'dm' && selectedChat?.id === contact._id;
            const unread = unreadCounts?.[contact._id] || 0;
            const online = isOnline(contact._id);
            return (
              <div
                key={contact._id}
                className={`contact-item ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectChat({ type: 'dm', id: contact._id, name: contact.username, avatar: contact.avatar })}
              >
                <div className="avatar-wrap">
                  {contact.avatar ? (
                    <img src={contact.avatar} alt="" className="avatar-img" />
                  ) : (
                    <div className="avatar" style={{ background: stringToColor(contact.username) }}>
                      {getInitials(contact.username)}
                    </div>
                  )}
                  <div className={`status-dot ${online ? 'online' : 'offline'}`} />
                </div>
                <div className="contact-info">
                  <div className="contact-name">{contact.username}</div>
                  <div className="contact-preview">{online ? 'Online' : 'Offline'}</div>
                </div>
                <div className="contact-meta">
                  {contact.lastMessageTime && (
                    <div className="contact-time">{formatTime(contact.lastMessageTime)}</div>
                  )}
                  {unread > 0 && <div className="unread-badge">{unread > 9 ? '9+' : unread}</div>}
                </div>
              </div>
            );
          })
        ) : (
          <>
            {filteredGroups.map(group => {
              const isSelected = selectedChat?.type === 'group' && selectedChat?.id === group._id;
              const unread = unreadCounts?.[group._id] || 0;
              return (
                <div
                  key={group._id}
                  className={`contact-item ${isSelected ? 'active' : ''}`}
                  onClick={() => onSelectChat({ type: 'group', id: group._id, name: group.name, members: group.members })}
                >
                  <div className="avatar-wrap">
                    <div className="avatar group-avatar">
                      {group.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="group-member-count">{group.members?.length || 0}</div>
                  </div>
                  <div className="contact-info">
                    <div className="contact-name">{group.name}</div>
                    <div className="contact-preview">{group.members?.length || 0} members</div>
                  </div>
                  <div className="contact-meta">
                    {unread > 0 && <div className="unread-badge">{unread > 9 ? '9+' : unread}</div>}
                  </div>
                </div>
              );
            })}
            <button className="create-group-btn" onClick={() => onSelectChat({ type: 'create-group' })}>
              <span>＋</span> New Group
            </button>
          </>
        )}
      </div>

      <div className="sidebar-footer">
        <div className="avatar-wrap">
          {user.avatar ? (
            <img src={user.avatar} alt="" className="avatar-img" style={{ width: 36, height: 36 }} />
          ) : (
            <div className="avatar" style={{ width: 36, height: 36, fontSize: 13, background: stringToColor(user.username) }}>
              {getInitials(user.username)}
            </div>
          )}
          <div className="status-dot online" />
        </div>
        <div style={{ flex: 1 }}>
          <div className="footer-name">{user.username}</div>
          <div className="footer-status">● Online</div>
        </div>
        <button className="icon-btn" title="Settings" onClick={() => setShowSettings(true)}>
          <FaCog size={16} />
        </button>
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

function stringToColor(str = '') {
  const colors = [
    'rgba(124,106,255,0.25)', 'rgba(62,207,142,0.2)',
    'rgba(255,107,107,0.2)', 'rgba(250,199,117,0.2)',
    'rgba(133,181,235,0.2)', 'rgba(237,147,177,0.2)'
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export { stringToColor };
export default Sidebar;
