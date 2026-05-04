import { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../config';

function getInitials(name = '') { return name.slice(0, 2).toUpperCase(); }

function CreateGroup({ user, contacts, socket, onGroupCreated, onCancel }) {
  const [groupName, setGroupName] = useState('');
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggle = (contact) => {
    setSelected(prev =>
      prev.find(c => c._id === contact._id)
        ? prev.filter(c => c._id !== contact._id)
        : [...prev, contact]
    );
  };

  const createGroup = async () => {
    if (!groupName.trim()) { setError('Please enter a group name.'); return; }
    if (selected.length < 1) { setError('Add at least one member.'); return; }

const API = process.env.REACT_APP_API_URL;
    setLoading(true); setError('');
    try {
      const members = [...selected.map(c => c._id), user.id];
      const res = await axios.post('${API}/api/groups', {
        name: groupName.trim(), members, createdBy: user.id
      }, { headers: { Authorization: `Bearer ${user.token}` } });

      if (socket) socket.emit('join_group', res.data._id);
      onGroupCreated(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create group.');
    } finally { setLoading(false); }
  };

  return (
    <div className="create-group-panel">
      <div className="panel-header">
        <button className="back-btn" onClick={onCancel}>← Back</button>
        <h2 className="panel-title">New Group</h2>
      </div>

      <div className="panel-body">
        <div className="input-group">
          <label className="input-label">Group Name</label>
          <input
            className="auth-input"
            placeholder="e.g. Project Team"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
          />
        </div>

        <div className="section-label">Add Members</div>

        <div className="member-select-list">
          {contacts.map(contact => {
            const isSelected = selected.find(c => c._id === contact._id);
            return (
              <div
                key={contact._id}
                className={`member-item ${isSelected ? 'selected' : ''}`}
                onClick={() => toggle(contact)}
              >
                <div className="avatar" style={{ width: 38, height: 38, fontSize: 13, background: 'rgba(124,106,255,0.2)', color: '#a99fff' }}>
                  {getInitials(contact.username)}
                </div>
                <span className="member-name">{contact.username}</span>
                <div className={`check-box ${isSelected ? 'checked' : ''}`}>
                  {isSelected && '✓'}
                </div>
              </div>
            );
          })}
        </div>

        {selected.length > 0 && (
          <div className="selected-pills">
            {selected.map(c => (
              <div key={c._id} className="selected-pill">
                {c.username}
                <button onClick={() => toggle(c)}>✕</button>
              </div>
            ))}
          </div>
        )}

        {error && <div className="auth-message error">{error}</div>}

        <button className="auth-btn" onClick={createGroup} disabled={loading}>
          {loading ? <span className="spinner" /> : `Create Group${selected.length > 0 ? ` (${selected.length + 1})` : ''}`}
        </button>
      </div>
    </div>
  );
}

export default CreateGroup;
