import { useState } from 'react';
import axios from 'axios';
import Auth from "./pages/Auth";

function Login({ onLogin }) {
  const API = process.env.REACT_APP_API_URL;
  console.log("API URL:", process.env.REACT_APP_API_URL);

  const [tab, setTab] = useState('login');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const loginUser = async () => {
    setError('');
    setSuccess('');

    if (!loginData.username || !loginData.password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API}/api/auth/login`, loginData);
      const u = response.data.user;

      onLogin({
        id: u.id,
        username: u.username,
        avatar: u.avatar,
        token: response.data.token
      });

    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async () => {
    setError('');
    setSuccess('');

    if (!registerData.username || !registerData.password) {
      setError('Please fill in all fields.');
      return;
    }

    if (registerData.password !== registerData.confirm) {
      setError('Passwords do not match.');
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API}/api/auth/register`, {
        username: registerData.username,
        password: registerData.password
      });

      setSuccess('Account created! You can now log in.');
      setTab('login');
      setLoginData({ username: registerData.username, password: '' });
      setRegisterData({ username: '', password: '', confirm: '' });

    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e, action) => {
    if (e.key === 'Enter') action();
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">

        <div className="auth-tabs">
          <button onClick={() => setTab('login')}>Login</button>
          <button onClick={() => setTab('register')}>Register</button>
        </div>

        {tab === 'login' ? (
          <>
            <input
              value={loginData.username}
              onChange={e => setLoginData({ ...loginData, username: e.target.value })}
              onKeyDown={e => handleKey(e, loginUser)}
              placeholder="Username"
            />

            <input
              type={showPass ? 'text' : 'password'}
              value={loginData.password}
              onChange={e => setLoginData({ ...loginData, password: e.target.value })}
              onKeyDown={e => handleKey(e, loginUser)}
              placeholder="Password"
            />

            <button onClick={loginUser} disabled={loading}>
              {loading ? 'Loading...' : 'Login'}
            </button>
          </>
        ) : (
          <>
            <input
              value={registerData.username}
              onChange={e => setRegisterData({ ...registerData, username: e.target.value })}
              placeholder="Username"
            />

            <input
              type="password"
              value={registerData.password}
              onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
              placeholder="Password"
            />

            <input
              type="password"
              value={registerData.confirm}
              onChange={e => setRegisterData({ ...registerData, confirm: e.target.value })}
              onKeyDown={e => handleKey(e, registerUser)}
              placeholder="Confirm Password"
            />

            <button onClick={registerUser} disabled={loading}>
              {loading ? 'Loading...' : 'Register'}
            </button>
          </>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </div>
    </div>
  );
}

export default Login;
