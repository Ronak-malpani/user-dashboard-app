// src/pages/Signup.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import toast from "react-hot-toast";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return toast.error("All fields are required!");
    }

    setLoading(true);
    setSuccessMsg("");

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      setSuccessMsg(res.data.message || "User registered successfully!");

      setName("");
      setEmail("");
      setPassword("");
      setRole("USER");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

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

  const inputStyle = {
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

  const successStyle = {
    backgroundColor: "#e8f8f5",
    color: "#1e8449",
    padding: "12px",
    borderRadius: "8px",
    textAlign: "center",
    marginBottom: "1rem",
    fontWeight: "600",
    border: "1px solid #a3e4d7",
  };

  const linkStyle = {
    color: "#9b59b6",
    textDecoration: "none",
    fontWeight: "bold",
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          Create Account
        </h2>

        {successMsg && <div style={successStyle}>{successMsg}</div>}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          required
          pattern="^(?=.*[0-9])(?=.*[A-Z]).{6,}$"
          title="Password must be at least 6 characters, include a number, and one uppercase letter"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={inputStyle}
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Registering..." : "Signup"}
        </button>

        <p style={{ textAlign: "center", color: "#555" }}>
          Already have an account?{" "}
          <Link to="/login" style={linkStyle}>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
