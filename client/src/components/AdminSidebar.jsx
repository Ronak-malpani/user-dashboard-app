import React from "react";
import toast from "react-hot-toast";

export default function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  selectedUser,
  canModify,
  handleToggleStatus,
  handleEdit,
  setShowDeleteModal,
  setShowUpdateModal,
  setShowLogoutModal,
  setDeleteTargetUser,  
  setUpdateRole 
}) {
  return (
    <div style={{ width: sidebarOpen ? "240px" : "70px", background: "#6c5ce7", color: "#fff", padding: "1rem", transition: "0.3s" }}>
      
      <h3 style={{ cursor: "pointer" }} onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? "Admin Panel" : "AP"}
      </h3>

      <div style={{ marginTop: "1rem" }}>
        <div style={btnStyle} onClick={() => setActiveTab("view")}>{sidebarOpen ? "View Users" : "VU"}</div>
        <div style={btnStyle} onClick={() => setActiveTab("add")}>{sidebarOpen ? "Add User" : "AU"}</div>
        <hr />
        <div style={btnStyle} onClick={() => selectedUser ? handleToggleStatus(selectedUser.id, selectedUser.status) : alert("Select a user first")}>{sidebarOpen ? "Toggle Status" : "TS"}</div>
        <div style={btnStyle} onClick={() => !selectedUser ? toast.error("Select a user first") : canModify ? handleEdit(selectedUser) : toast.error("Cannot modify another admin")}> {sidebarOpen ? "Edit" : "ED"} </div>

        <div style={btnStyle} onClick={() => !selectedUser ? toast.error("Select a user first") : canModify ? (setDeleteTargetUser(selectedUser), setShowDeleteModal(true)) : toast.error("Cannot delete another admin") }> {sidebarOpen ? "Delete" : "DL"} </div>

       <div style={btnStyle} onClick={() => !selectedUser ? toast.error("Select a user first") : canModify ? (setUpdateRole(selectedUser.role), setShowUpdateModal(true)) : toast.error("Cannot update role of another admin") }> {sidebarOpen ? "Update Role" : "UR"} </div>

        <div style={btnStyle} onClick={() => setShowLogoutModal(true)}>{sidebarOpen ? "Logout" : "LO"}</div>
      </div>
    </div>
  );
}

const btnStyle = { padding: "0.7rem", cursor: "pointer", marginBottom: "0.5rem", borderRadius: "6px", fontWeight: 500 };
