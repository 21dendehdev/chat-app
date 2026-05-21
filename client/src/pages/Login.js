
//This is the Login component that handles both user login and registration. It uses a form to collect user input and sends it to the backend API for authentication. The component also allows users to switch between login and registration modes.

import { useState } from "react";
import axios from "axios";
import BASE_URL from "../config";

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const handleSubmit = async (e) => {
  e.preventDefault();

  // ❌ VALIDATION CHECK
  if (!validatePhone(telephone)) {
    alert("Please enter a valid mobile number (8–15 digits only)");
    return;
  }

  const endpoint = isLogin
    ? "/api/auth/login"
    : "/api/auth/register";

  const payload = isLogin
    ? { telephone, password }
    : { name, telephone, password };

  try {
    const res = await axios.post(`${BASE_URL}${endpoint}`, payload);

    onLogin({
      id: res.data.user._id,
      name: res.data.user.name,
      telephone: res.data.user.telephone,
      token: res.data.token,
    });

  } catch (error) {
    alert(error.response?.data?.message || "Login failed");
  }
};

    const endpoint = isLogin
      ? "/api/auth/login"
      : "/api/auth/register";

    const payload = isLogin
      ? { telephone, password }
      : { name, telephone, password };

    const res = await axios.post(`${BASE_URL}${endpoint}`, payload);

    onLogin({
      id: res.data.user._id,
      name: res.data.user.name,
      telephone: res.data.user.telephone,
      token: res.data.token,
    });
  };
const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{8,15}$/;
  return phoneRegex.test(phone);
};
  return (
  <div className="auth-container">
    <div className="auth-card">


      <h2 className="auth-title">
      
        {isLogin ? "Login" : "Register"}
      </h2>
  <p className="auth-description"> Communicate anytime, anywhere with ease</p>
      <form onSubmit={handleSubmit} className="auth-form">

        {!isLogin && (
          <input
            className="auth-input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

     <input
  className="login-input"
  placeholder="Mobile Number (e.g. 076123456)"
  value={telephone}
  onChange={(e) => setTelephone(e.target.value)}
/>

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="auth-button">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      <p className="auth-switch" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Create new account" : "Already have an account?"}
      </p>

    </div>
  </div>
);}

export default Login;