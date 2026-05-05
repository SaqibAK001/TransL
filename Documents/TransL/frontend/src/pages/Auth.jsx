import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { loginUser, signupUser } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(email, password);
      localStorage.setItem("token", res.access_token);
      navigate("/match");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    }

    setLoading(false);
  };

  const handleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      await signupUser(name, email, password);
      const res = await loginUser(email, password);

      localStorage.setItem("token", res.access_token);
      navigate("/match");
    } catch (err) {
      setError(err.response?.data?.detail || "Signup failed");
    }

    setLoading(false);
  };

  return (
    <div className="page">
      <Navbar />

      <div className="auth-wrap">
        <div className="auth-card">
          <span className="auth-logo">
            Trans<span>L</span>
          </span>

          <div className="auth-tabs">
            <button
              className={tab === "login" ? "auth-tab active" : "auth-tab"}
              onClick={() => setTab("login")}
            >
              Log in
            </button>
            <button
              className={tab === "signup" ? "auth-tab active" : "auth-tab"}
              onClick={() => setTab("signup")}
            >
              Create account
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          {tab === "login" && (
            <>
              <div className="auth-title">Welcome back</div>
              <p className="auth-sub">Log in to your TransL account</p>

              <div className="auth-field">
                <label>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="auth-field">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                className="auth-submit"
                disabled={loading}
                onClick={handleLogin}
              >
                {loading ? "Logging in..." : "Log in →"}
              </button>
            </>
          )}

          {tab === "signup" && (
            <>
              <div className="auth-title">Get started free</div>
              <p className="auth-sub">Create your TransL account</p>

              <div className="auth-field">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="auth-field">
                <label>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="auth-field">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                className="auth-submit"
                disabled={loading}
                onClick={handleSignup}
              >
                {loading ? "Creating..." : "Create account →"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}