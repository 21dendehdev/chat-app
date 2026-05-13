import { useState } from "react";
import axios from "axios";
import BASE_URL from "../config";

function Login({ onLogin }) {

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      const endpoint = isLogin
        ? "/api/auth/login"
        : "/api/auth/register";

      const payload = isLogin
        ? { telephone, password }
        : { name, telephone, password };

      const response = await axios.post(
        `${BASE_URL}${endpoint}`,
        payload
      );

      console.log("SERVER RESPONSE:", response.data);

      // 🔥 SAFETY CHECK (IMPORTANT)
      if (!response.data?.user || !response.data?.token) {
        throw new Error("Invalid server response");
      }

      const userData = {
        id: response.data.user._id,
        name: response.data.user.name,
        telephone: response.data.user.telephone,
        token: response.data.token
      };

      console.log("USER LOGGED IN:", userData);

      onLogin(userData);

    } catch (error) {

      console.log("LOGIN ERROR:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Authentication failed";

      alert(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <form className="login-card" onSubmit={handleSubmit}>

        {/* LOGO */}
        <img src="/logo.png" alt="CampChat" className="login-logo" />

        <h1>CampChat</h1>
        <p className="login-subtitle">
          Communicate with ease, anytime, anywhere.
        </p>

        {/* NAME (REGISTER ONLY) */}
        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        {/* TELEPHONE */}
        <input
          type="text"
          placeholder="Telephone Number"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          required
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* BUTTON */}
        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : isLogin
              ? "Login"
              : "Create Account"}
        </button>

        {/* SWITCH */}
        <p className="switch-auth">
          {isLogin ? "Don't have an account?" : "Already have an account?"}

          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Register" : " Login"}
          </span>
        </p>

      </form>
    </div>
  );
}

export default Login;