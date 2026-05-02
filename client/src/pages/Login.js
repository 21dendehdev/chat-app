import { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [tab, setTab] = useState('login');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const loginUser = async () => {
    setError(''); setSuccess('');
    if (!loginData.username || !loginData.password) {
      setError('Please fill in all fields.'); return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', loginData);
      const u = response.data.user;
      onLogin({ id: u.id, username: u.username, avatar: u.avatar, token: response.data.token });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  const registerUser = async () => {
    setError(''); setSuccess('');
    if (!registerData.username || !registerData.password) {
      setError('Please fill in all fields.'); return;
    }
    if (registerData.password !== registerData.confirm) {
      setError('Passwords do not match.'); return;
    }
    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        username: registerData.username, password: registerData.password
      });
      setSuccess('Account created! You can now log in.');
      setTab('login');
      setLoginData({ username: registerData.username, password: '' });
      setRegisterData({ username: '', password: '', confirm: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally { setLoading(false); }
  };

  const handleKey = (e, action) => { if (e.key === 'Enter') action(); };

  return (
    <div className="auth-shell">
      <div className="auth-bg">
        <div className="auth-orb orb1" />
        <div className="auth-orb orb2" />
        <div className="auth-orb orb3" />
      </div>

      <div className="auth-card">
        <div className="auth-logo">
          <img src="/logo.png" alt="Logo" style={{ width: '40px', height: '40px' }} />
        </div>

        <p className="auth-tagline">Connect with your community</p>

        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setError(''); setSuccess(''); }}>
            Sign In
          </button>
          <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => { setTab('register'); setError(''); setSuccess(''); }}>
            Create Account
          </button>
          <div className={`auth-tab-indicator ${tab === 'register' ? 'right' : 'left'}`} />
        </div>

        <div className="auth-form">
          {tab === 'login' ? (
            <>
              <div className="input-group">
                <label className="input-label">Username</label>
                <input
                  className="auth-input"
                  value={loginData.username}
                  onChange={e => setLoginData(p => ({ ...p, username: e.target.value }))}
                  onKeyDown={e => handleKey(e, loginUser)}
                  placeholder="your_username"
                  autoFocus
                />
              </div>
              <div className="input-group">
                <label className="input-label">Password</label>
                <div className="input-password-wrap">
                  <input
                    className="auth-input"
                    type={showPass ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={e => setLoginData(p => ({ ...p, password: e.target.value }))}
                    onKeyDown={e => handleKey(e, loginUser)}
                    placeholder="••••••••"
                  />
                  <button className="show-pass-btn" onClick={() => setShowPass(p => !p)}>
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
              </div>
              <button className="auth-btn" onClick={loginUser} disabled={loading}>
                {loading ? <span className="spinner" /> : 'Sign In'}
              </button>
            </>
          ) : (
            <>
              <div className="input-group">
                <label className="input-label">Username</label>
                <input
                  className="auth-input"
                  value={registerData.username}
                  onChange={e => setRegisterData(p => ({ ...p, username: e.target.value }))}
                  placeholder="choose_a_username"
                  autoFocus
                />
              </div>
              <div className="input-group">
                <label className="input-label">Password</label>
                <input
                  className="auth-input"
                  type="password"
                  value={registerData.password}
                  onChange={e => setRegisterData(p => ({ ...p, password: e.target.value }))}
                  placeholder="min. 6 characters"
                />
              </div>
              <div className="input-group">
                <label className="input-label">Confirm Password</label>
                <input
                  className="auth-input"
                  type="password"
                  value={registerData.confirm}
                  onChange={e => setRegisterData(p => ({ ...p, confirm: e.target.value }))}
                  onKeyDown={e => handleKey(e, registerUser)}
                  placeholder="repeat your password"
                />
              </div>
              <button className="auth-btn" onClick={registerUser} disabled={loading}>
                {loading ? <span className="spinner" /> : 'Create Account'}
              </button>
            </>
          )}

          {error && <div className="auth-message error">{error}</div>}
          {success && <div className="auth-message success">{success}</div>}
        </div>
      </div>
    </div>
  );
}

export default Login;
