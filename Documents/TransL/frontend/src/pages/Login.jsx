import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, signupUser } from "../services/api";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const resetFields = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Email and password are required.");
      return;
    }

    if (isSignup) {
      if (!name.trim()) {
        toast.error("Name is required.");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
    }

    setLoading(true);

    try {
      if (isSignup) {
        await signupUser(name, email, password);

        toast.success("Signup successful! Logging you in...");

        const loginRes = await loginUser(email, password);

        localStorage.setItem("token", loginRes.access_token);

        resetFields();

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        const res = await loginUser(email, password);

        localStorage.setItem("token", res.access_token);

        toast.success("Login successful!");

        resetFields();

        setTimeout(() => {
          navigate("/");
        }, 800);
      }
    } catch (err) {
      console.log(err.response?.data || err.message);

      if (err.response?.data?.detail) {
        toast.error(err.response.data.detail);
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Login failed. Please try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>{isSignup ? "Signup" : "Login"}</h2>

        <p style={styles.subtext}>
          {isSignup
            ? "Create your TransL account"
            : "Login to access your dashboard"}
        </p>

        {isSignup && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        {isSignup && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
          />
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Please wait..." : isSignup ? "Signup" : "Login"}
        </button>

        <p style={styles.toggleText}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            style={styles.toggleLink}
            onClick={() => {
              setIsSignup(!isSignup);
              resetFields();
            }}
          >
            {isSignup ? "Login" : "Signup"}
          </span>
        </p>
      </form>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "radial-gradient(circle at top, #0f131a, #06070a)",
    fontFamily: "system-ui",
    padding: "20px",
  },

  form: {
    width: "420px",
    maxWidth: "100%",
    padding: "32px",
    borderRadius: "18px",
    background: "rgba(20, 25, 34, 0.9)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0px 0px 35px rgba(0,0,0,0.7)",
    backdropFilter: "blur(10px)",
  },

  title: {
    color: "white",
    textAlign: "center",
    marginBottom: "8px",
    fontSize: "26px",
    fontWeight: "800",
  },

  subtext: {
    color: "#9ca3af",
    textAlign: "center",
    fontSize: "13px",
    marginBottom: "22px",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    outline: "none",
    marginBottom: "12px",
    background: "rgba(0,0,0,0.35)",
    color: "white",
    fontSize: "14px",
  },

  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(90deg, #00d1b2, #00ffa6)",
    color: "black",
    fontWeight: "800",
    fontSize: "15px",
    marginTop: "10px",
  },

  toggleText: {
    color: "#cbd5e1",
    marginTop: "16px",
    textAlign: "center",
    fontSize: "14px",
  },

  toggleLink: {
    color: "#00ffa6",
    cursor: "pointer",
    fontWeight: "800",
  },
};