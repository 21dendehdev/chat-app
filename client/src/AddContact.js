import { useState } from 'react';
import axios from 'axios';
import BASE_URL from './config';

function AddContact({ user, onContactAdded, onClose }) {
  const [mode, setMode]       = useState('search'); // 'search' | 'link'
  const [query, setQuery]     = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [myLink, setMyLink]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const headers = { Authorization: `Bearer ${user.token}` };

  const addByUsername = async () => {
    if (!query.trim()) { setError('Enter a username'); return; }
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await axios.post(`${BASE_URL}/api/contacts/add`, {
        userId: user.id, targetUsername: query.trim()
      }, { headers });
      setSuccess(`${res.data.contact.username} added to your contacts!`);
      onContactAdded(res.data.contact);
      setQuery('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add contact');
    } finally { setLoading(false); }
  };

  const generateLink = async () => {
    setLoading(true); setError('');
    try {
      const res = await axios.post(`${BASE_URL}/api/contacts/generate-link`, { userId: user.id }, { headers });
      setMyLink(res.data.link);
    } catch { setError('Failed to generate link'); }
    setLoading(false);
  };

  const acceptLink = async () => {
    if (!inviteCode.trim()) { setError('Paste the invite link or code'); return; }
    setLoading(true); setError(''); setSuccess('');
    try {
      // Support full link or just the code
      let code = inviteCode.trim();
      if (code.includes('/add-contact/')) code = code.split('/add-contact/')[1];

      const res = await axios.post(`${BASE_URL}/api/contacts/accept-link`, {
        userId: user.id, code
      }, { headers });
      setSuccess(res.data.message);
      onContactAdded(res.data.contact);
      setInviteCode('');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid invite link');
    } finally { setLoading(false); }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(myLink);
    setSuccess('Link copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  return (
    <div className="profile-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="profile-modal" style={{ maxWidth: 440 }}>
        <div className="profile-modal-header">
          <div>
            <h2 className="profile-modal-title">Add Contact</h2>
            <p className="profile-modal-sub">Find people to chat with</p>
          </div>
          <button className="profile-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="profile-modal-body">
          {/* Mode tabs */}
          <div className="auth-tabs" style={{ marginBottom: 24 }}>
            <button className={`auth-tab ${mode==='search'?'active':''}`} onClick={() => { setMode('search'); setError(''); setSuccess(''); }}>
              Search Username
            </button>
            <button className={`auth-tab ${mode==='link'?'active':''}`} onClick={() => { setMode('link'); setError(''); setSuccess(''); }}>
              Invite Link
            </button>
            <div className={`auth-tab-indicator ${mode==='link'?'right':'left'}`} />
          </div>

          {mode === 'search' && (
            <>
              <div className="input-group">
                <label className="input-label">Search by username</label>
                <div className="input-with-prefix">
                  <span className="input-prefix">@</span>
                  <input
                    className="auth-input prefixed"
                    placeholder="their_username"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addByUsername()}
                    autoFocus
                  />
                </div>
              </div>
              <button className="auth-btn" onClick={addByUsername} disabled={loading}>
                {loading ? <span className="spinner" /> : 'Add Contact'}
              </button>
            </>
          )}

          {mode === 'link' && (
            <>
              <div className="add-contact-link-section">
                <div className="input-group">
                  <label className="input-label">Your invite link</label>
                  {myLink ? (
                    <div className="generated-link-box">
                      <span className="generated-link-text">{myLink}</span>
                      <button className="copy-link-btn" onClick={copyLink}>Copy</button>
                    </div>
                  ) : (
                    <button className="auth-btn secondary-btn" onClick={generateLink} disabled={loading}>
                      {loading ? <span className="spinner" /> : 'Generate My Link'}
                    </button>
                  )}
                  <p className="avatar-hint">Share this link with someone to let them add you</p>
                </div>

                <div className="profile-divider" />

                <div className="input-group">
                  <label className="input-label">Paste someone's invite link</label>
                  <input
                    className="auth-input"
                    placeholder="https://campchat.../add-contact/..."
                    value={inviteCode}
                    onChange={e => setInviteCode(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && acceptLink()}
                  />
                </div>
                <button className="auth-btn" onClick={acceptLink} disabled={loading}>
                  {loading ? <span className="spinner" /> : 'Accept Invite'}
                </button>
              </div>
            </>
          )}

          {error   && <div className="auth-message error">{error}</div>}
          {success && <div className="auth-message success">✓ {success}</div>}
        </div>
      </div>
    </div>
  );
}

export default AddContact;
