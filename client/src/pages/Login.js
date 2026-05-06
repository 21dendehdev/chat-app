
import { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const API = process.env.REACT_APP_API_URL;
  const [tab, setTab] = useState('login');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const loginUser = async () => {
    setError(''); setSuccess('');
    if (!loginData.username || !loginData.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const response = await axios.post(`${API}/api/auth/login`, loginData);
      const u = response.data.user;
      onLogin({ id: u.id, username: u.username, avatar: u.avatar, token: response.data.token });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.');
    } finally { setLoading(false); }
  };

  const registerUser = async () => {
    setError(''); setSuccess('');
    if (!registerData.username || !registerData.password) { setError('Please fill in all fields.'); return; }
    if (registerData.password !== registerData.confirm) { setError('Passwords do not match.'); return; }
    if (registerData.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await axios.post(`${API}/api/auth/register`, { username: registerData.username, password: registerData.password });
      setSuccess('Account created! You can now log in.');
      setTab('login');
      setLoginData({ username: registerData.username, password: '' });
      setRegisterData({ username: '', password: '', confirm: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally { setLoading(false); }
  };

  const handleKey = (e, action) => { if (e.key === 'enter') action(); };

  return (
    <div className="auth-shell">
      <div className="auth-card">

        <div className="auth-logo">
          <div className="auth-logo-dot" />
          <div className="auth-logo-text">CampChat</div>
        </div>
        <div className="auth-tagline">Connect with your people</div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => setTab('login')}
          >Login</button>
          <button
            className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => setTab('register')}
          > Create Account</button>
          <div className={`auth-tab-indicator ${tab === 'login' ? 'left' : 'right'}`} />
        </div>

        {tab === 'login' ? (
          <div className="auth-form">
            <div className="input-group">
              <label className="input-label">Name</label>
              <input
                className="auth-input"
                value={loginData.username}
                onChange={e => setLoginData({ ...loginData, username: e.target.value })}
                onKeyDown={e => handleKey(e, loginUser)}
                placeholder="Enter Your Name"
              />
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="input-password-wrap">
                <input
                  className="auth-input"
                  type={showPass ? 'text' : 'password'}
                  value={loginData.password}
                  onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                  onKeyDown={e => handleKey(e, loginUser)}
                  placeholder="Enter Your Password"
                />
                <button className="show-pass-btn" onClick={() => setShowPass(!showPass)}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>
            <button className="auth-btn" onClick={loginUser} disabled={loading}>
              {loading ? <span className="spinner" /> : 'Login'}
            </button>
          </div>
        ) : (
          <div className="auth-form">
            <div className="input-group">
              <label className="input-label">UserName</label>
              <input
                className="auth-input"
                value={registerData.username}
                onChange={e => setRegisterData({ ...registerData, username: e.target.value })}
                placeholder="Choose a username"
              />
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                className="auth-input"
                type="password"
                value={registerData.password}
                onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
                placeholder="Create a password"
              />
            </div>
            <div className="input-group">
              <label className="input-label">Confirm Password</label>
              <input
                className="auth-input"
                type="password"
                value={registerData.confirm}
                onChange={e => setRegisterData({ ...registerData, confirm: e.target.value })}
                onKeyDown={e => handleKey(e, registerUser)}
                placeholder="Confirm your password"
              />
            </div>
            <button className="auth-btn" onClick={registerUser} disabled={loading}>
              {loading ? <span className="spinner" /> : 'Create Account'}
            </button>
          </div>
        )}

        {error && <div className="auth-message error">{error}</div>}
        {success && <div className="auth-message success">{success}</div>}

      </div>
    </div>
  );
}

export default Login;
