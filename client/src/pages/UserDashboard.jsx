import React, { useState, useEffect } from "react";
import api from "../api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import "../styles/admin.css";
import "../styles/modal.css";

export default function UserDashboard() {
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [profileSuccess, setProfileSuccess] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("profile"); // profile / update / password

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  // logout modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!token || !user) {
      toast.error("Please login to access your dashboard");
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/profile");
      setProfile(res.data);
      setName(res.data.name || "");
      setEmail(res.data.email || "");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load profile");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    // simple inline validation
    const errors = {};
    if (!name || name.trim().length === 0) errors.name = "Name is required";
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = "Valid email is required";
    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }

    setProfileErrors({});
    setProfileLoading(true);
    try {
      await api.put("/users/profile", { name, email });
      setProfileSuccess("Profile updated successfully");
      setTimeout(() => setProfileSuccess(""), 2500);
      fetchProfile();
      setActiveTab("profile");
    } catch (err) {
      setProfileErrors({ form: err.response?.data?.message || "Failed to update profile" });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // inline validation
    const errors = {};
    if (!currentPassword) errors.currentPassword = "Current password is required";
    if (!newPassword || newPassword.length < 6) errors.newPassword = "Password must be at least 6 characters";
    if (!/[A-Z]/.test(newPassword)) errors.newPassword = "Password must include at least one uppercase letter";
    if (!/[0-9]/.test(newPassword)) errors.newPassword = "Password must include at least one number";
    if (newPassword !== confirmPassword) errors.confirmPassword = "Passwords do not match";

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordErrors({});
    setPasswordLoading(true);
    try {
      await api.put("/users/profile", { currentPassword, newPassword });
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setActiveTab("profile");
    } catch (err) {
      setPasswordErrors({ form: err.response?.data?.message || "Failed to change password" });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    // show confirmation modal
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const sidebarItem = (active) => ({
    padding: "0.7rem 1rem",
    cursor: "pointer",
    fontWeight: active ? "700" : "500",
    backgroundColor: active ? "rgba(155,89,182,0.12)" : "transparent",
    borderRadius: "8px",
    margin: "0.5rem 0",
  });

  return (
    <div className="admin-container" style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <div className="admin-sidebar" style={{ padding: "1rem" }}>
        <div style={{ marginBottom: "1.25rem", display: "flex", justifyContent: "space-between" }}>
          {sidebarOpen && <h2>Account</h2>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}
          >
            {sidebarOpen ? "<<" : ">>"}
          </button>
        </div>

        <div onClick={() => setActiveTab("profile")} style={sidebarItem(activeTab === "profile")}>
          {sidebarOpen ? "View Profile" : "VP"}
        </div>
        <div onClick={() => setActiveTab("update")} style={sidebarItem(activeTab === "update")}>
          {sidebarOpen ? "Update Profile" : "UP"}
        </div>
        <div onClick={() => setActiveTab("password")} style={sidebarItem(activeTab === "password")}>
          {sidebarOpen ? "Change Password" : "CP"}
        </div>

        <div onClick={handleLogout} style={sidebarItem(false)}>
          {sidebarOpen ? "Logout" : "LO"}
        </div>
      </div>

      <div className="admin-main" style={{ padding: "2rem" }}>
        {activeTab === "profile" && (
          <div className="admin-card" style={{ maxWidth: "700px", margin: "0 auto" }}>
            <h2 className="card-title">Your Profile</h2>
            {profile ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <strong>Name</strong>
                  <div>{profile.name}</div>
                </div>
                <div>
                  <strong>Email</strong>
                  <div>{profile.email}</div>
                </div>
                <div>
                  <strong>Role</strong>
                  <div>{profile.role}</div>
                </div>
                <div>
                  <strong>Status</strong>
                  <div>{profile.status ? "Active" : "Inactive"}</div>
                </div>
                <div>
                  <strong>Created</strong>
                  <div>{profile.created_at}</div>
                </div>
              </div>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        )}

        {activeTab === "update" && (
          <div className="admin-card" style={{ maxWidth: "700px", margin: "0 auto" }}>
            <h2 className="card-title">Update Profile</h2>
            <form className="admin-form" onSubmit={handleUpdateProfile}>
              <input className="admin-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" aria-invalid={!!profileErrors.name} />
              {profileErrors.name && <small className="field-error">{profileErrors.name}</small>}
              <input className="admin-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" aria-invalid={!!profileErrors.email} />
              {profileErrors.email && <small className="field-error">{profileErrors.email}</small>}
              {profileErrors.form && <small className="field-error">{profileErrors.form}</small>}
              {profileSuccess && <small className="inline-success">{profileSuccess}</small>}
              <button className="admin-button" disabled={profileLoading} type="submit">{profileLoading ? "Saving..." : "Save changes"}</button>
            </form>
          </div>
        )}

        {activeTab === "password" && (
          <div className="admin-card" style={{ maxWidth: "700px", margin: "0 auto" }}>
            <h2 className="card-title">Change password</h2>
            <form className="admin-form" onSubmit={handleChangePassword}>
              <input className="admin-input" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current password" aria-invalid={!!passwordErrors.currentPassword} />
              {passwordErrors.currentPassword && <small className="field-error">{passwordErrors.currentPassword}</small>}

              <input className="admin-input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" />
              <small style={{ display: "block", marginBottom: "0.75rem", color: "#666" }}>Password must be at least 6 characters, include an uppercase letter and a number.</small>
              {passwordErrors.newPassword && <small className="field-error">{passwordErrors.newPassword}</small>}

              <input className="admin-input" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" aria-invalid={!!passwordErrors.confirmPassword} />
              {passwordErrors.confirmPassword && <small className="field-error">{passwordErrors.confirmPassword}</small>}

              {passwordErrors.form && <small className="field-error">{passwordErrors.form}</small>}

              <button className="admin-button" disabled={passwordLoading} type="submit">{passwordLoading ? "Saving..." : "Change password"}</button>
            </form>
          </div>
        )}
      {showLogoutModal && (
        <Modal onClose={cancelLogout}>
          <h3>Logout</h3>
          <p>Are you sure you want to logout?</p>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "1rem" }}>
            <button className="admin-button" onClick={confirmLogout}>Logout</button>
            <button className="admin-button cancel-btn" style={{ backgroundColor: "#ccc", color: "#333" }} onClick={cancelLogout}>Cancel</button>
          </div>
        </Modal>
      )}

      </div>
    </div>
  );
}
