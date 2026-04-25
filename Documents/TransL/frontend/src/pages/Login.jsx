import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, signupUser } from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        if (password !== confirmPassword) {
          setLoading(false);
          setError("Passwords do not match");
          return;
        }

        await signupUser(name, email, password);

        // auto login after signup
        const loginRes = await loginUser(email, password);

        localStorage.setItem("token", loginRes.access_token);
        navigate("/dashboard");
      } else {
        const res = await loginUser(email, password);

        localStorage.setItem("token", res.access_token);
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Request failed.");
      }
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0b0b0b",
        fontFamily: "Arial",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "380px",
          padding: "30px",
          borderRadius: "14px",
          background: "#1a1a1a",
          boxShadow: "0px 0px 30px rgba(0,0,0,0.7)",
        }}
      >
        <h2 style={{ color: "white", textAlign: "center", marginBottom: "20px" }}>
          {isSignup ? "Signup" : "Login"}
        </h2>

        {error && (
          <div
            style={{
              background: "#2a0000",
              color: "white",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {isSignup && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        {isSignup && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
          />
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            background: "#00d1b2",
            color: "black",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          {loading ? "Please wait..." : isSignup ? "Signup" : "Login"}
        </button>

        <p style={{ color: "white", marginTop: "15px", textAlign: "center" }}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            style={{ color: "#00d1b2", cursor: "pointer", fontWeight: "bold" }}
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
            }}
          >
            {isSignup ? "Login" : "Signup"}
          </span>
        </p>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  outline: "none",
  marginBottom: "12px",
  background: "#2a2a2a",
  color: "white",
};