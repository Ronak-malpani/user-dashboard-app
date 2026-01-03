// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    return setErrorMsg("Both fields are required!");
  }

  setErrorMsg("");
  setSuccessMsg("");
  setLoading(true);

  try {
    const res = await api.post("/auth/login", { email, password });

    // store token and user correctly
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    // immediate role-based navigation
    const role = res.data.user.role;
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      navigate("/admin");
    } else {
      navigate("/user");
    }

  } catch (err) {
    setErrorMsg(err.response?.data?.message || "Login failed!");
  } finally {
    setLoading(false);
  }
};


  // Shared Styles
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "1rem",
    background: "linear-gradient(135deg, #71b7e6, #9b59b6)",
  };

  const formStyle = {
    backgroundColor: "#fff",
    padding: "3rem 3.5rem",
    borderRadius: "15px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "420px",
  };

  const fieldStyle = {
    width: "100%",
    height: "52px",
    padding: "0 1rem",
    marginBottom: "1rem",
    borderRadius: "10px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "1rem",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    width: "100%",
    height: "52px",
    backgroundColor: "#9b59b6",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: loading ? "not-allowed" : "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
    marginBottom: "1rem",
  };

  const messageStyle = {
    textAlign: "center",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "1rem",
    fontWeight: "600",
  };

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={handleSubmit}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          Login
        </h2>

        {errorMsg && (
          <div style={{ ...messageStyle, background: "#fdecea", color: "#c0392b" }}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ ...messageStyle, background: "#e8f8f5", color: "#1e8449" }}>
            {successMsg}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={fieldStyle}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={fieldStyle}
          required
        />

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Signing in..." : "Login"}
        </button>

        <p style={{ textAlign: "center", color: "#555" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#9b59b6", fontWeight: "bold" }}>
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
