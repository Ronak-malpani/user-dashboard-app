import React, { useState, useEffect,useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import toast from "react-hot-toast";
import "../styles/admin.css";
import "../styles/modal.css";
import Modal from "../components/Modal";
import AdminSidebar from "../components/AdminSidebar";
import { Pagination } from "../components/Pagination";


export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [status, setStatus] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("view");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetUser, setDeleteTargetUser] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateRole, setUpdateRole] = useState("USER");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;


  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, statusFilter]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get("/admin/users");
      const latestUsers = res.data.users || res.data || [];
      setUsers(latestUsers);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch users!");
    }
  }, []);

  
  useEffect(() => {
    if (selectedUser && users.length > 0) {
      const updatedUser = users.find((u) => u.id === selectedUser.id);
      if (updatedUser) setSelectedUser(updatedUser);
    }
    
  }, [users]);

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (
      !token ||
      !user ||
      !(user.role === "ADMIN" || user.role === "SUPER_ADMIN")
    ) {
      toast.error("Unauthorized. Please login as an admin.");
      navigate("/login");
      return;
    }
    fetchUsers();
  }, [navigate, fetchUsers]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User deleted successfully!");
      fetchUsers();
      setSelectedUser(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user!");
    }
  };

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");


    const handleRoleChange = async (id, newRole) => {
    if (!selectedUser) return toast.error("No user selected");

    if (selectedUser.role === "ADMIN" && currentUser.role !== "SUPER_ADMIN") {
      toast.error("You cannot change another admin's role!");
      setShowUpdateModal(false);
      return;
    }

    try {
      await api.put(`/admin/users/${id}`, { role: newRole });
      toast.success("User role updated successfully!");
      await fetchUsers();       
      setSelectedUser(prev => ({ ...prev, role: newRole }));  
      setShowUpdateModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role!");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await api.put(`/admin/users/${id}`, { status: !currentStatus });
      toast.success("User status updated successfully!");
      fetchUsers();
      setSelectedUser(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status!");
    }
  };

  const handleEdit = (user) => {

  if (user.role === "SUPER_ADMIN" && currentUser.role !== "SUPER_ADMIN") {
    toast.error("You cannot edit a Super Admin");
    return;
  }
    setEditingUserId(user.id);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setStatus(user.status);
    setPassword("");
    setActiveTab("add");
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setName("");
    setEmail("");
    setPassword("");
    setRole("USER");
    setStatus(true);
    setActiveTab("view");
  };

      const handleSubmit = async (e) => {
      e.preventDefault();

      if (!name || !email || (!editingUserId && !password)) {
        return toast.error("All fields are required!");
      }

      if (currentUser.role !== "SUPER_ADMIN" && role === "SUPER_ADMIN") {
        toast.error("Only Super Admin can create another Super Admin");
        return;
      }

      setLoading(true);
      try {
        if (editingUserId) {
          await api.put(`/admin/users/${editingUserId}`, { name, email, role, status });
        } else {
          await api.post("/admin/users", { name, email, password, role });
        }

        toast.success(editingUserId ? "User updated successfully!" : "User added successfully!");
        handleCancelEdit();
        fetchUsers();
      } catch (err) {
        toast.error(err.response?.data?.message || "Operation failed!");
      } finally {
        setLoading(false);
      }
    };


  const containerStyle = { display: "flex", minHeight: "100vh", background: "#f0f2f5" };

  const mainStyle = { flex: 1, padding: "2rem" };
  const cardStyle = { backgroundColor: "#fff", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "1.25rem", maxWidth: "100%" };
  const inputStyle = { width: "100%", height: "45px", padding: "0 1rem", marginBottom: "1rem", borderRadius: "10px", border: "1px solid #ccc", outline: "none", fontSize: "1rem" };
  const buttonStyle = { width: "100%", height: "45px", backgroundColor: "#9b59b6", color: "#fff", border: "none", borderRadius: "10px", cursor: loading ? "not-allowed" : "pointer", fontWeight: "bold", fontSize: "1rem", marginBottom: "1rem" };
  const tableStyle = { width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", borderRadius: "6px", boxShadow: "0 2px 6px rgba(0,0,0,0.04)", border: "1px solid #eaeaea" };
  const thTdStyle = { padding: "12px", borderBottom: "1px solid #eee", textAlign: "left", fontSize: "0.95rem" };
  const canModify = !!selectedUser && (selectedUser.role !== "ADMIN" || currentUser.role === "SUPER_ADMIN");

  
  const filteredUsers = users
  .filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )
  .filter((u) => (roleFilter ? u.role === roleFilter : true))
  .filter((u) =>
    statusFilter !== ""
      ? u.status === (statusFilter === "Active")
      : true
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <div className="admin-container" style={containerStyle}>
      <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedUser={selectedUser}
          canModify={canModify}
          handleToggleStatus={handleToggleStatus}
          handleEdit={handleEdit}
          setShowDeleteModal={setShowDeleteModal}
          setShowUpdateModal={setShowUpdateModal}
          setShowLogoutModal={setShowLogoutModal}
          setDeleteTargetUser={setDeleteTargetUser}  
          setUpdateRole={setUpdateRole}
        />

      <div className="admin-main" style={mainStyle}>
        {activeTab === "add" && (
          <div className="admin-card" style={cardStyle}>
            <h2 className="card-title">{editingUserId ? "Edit User" : "Add User"}</h2>
            <form className="admin-form" onSubmit={handleSubmit}>
              <input className="admin-input" type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
              <input className="admin-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
              {!editingUserId && <input className="admin-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />}
              <select className="admin-input" value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}><option value="USER">User</option><option value="ADMIN">Admin</option><option value="SUPER_ADMIN">Super Admin</option></select>
              {editingUserId && <select className="admin-input" value={status ? "1" : "0"} onChange={(e) => setStatus(e.target.value === "1")} style={inputStyle}><option value="1">Active</option><option value="0">Inactive</option></select>}
              <button className="admin-button" type="submit" disabled={loading} style={buttonStyle}>{loading ? "Processing..." : editingUserId ? "Update User" : "Add User"}</button>
              {editingUserId && <button className="admin-button" type="button" onClick={handleCancelEdit} style={{ ...buttonStyle, backgroundColor: "#ccc", color: "#333" }}>Cancel</button>}
            </form>
          </div>
        )}

        {activeTab === "view" && (
          <div className="admin-card" style={cardStyle}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                <input
                  type="text"
                  placeholder="Search name or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={inputStyle}
                />

                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={inputStyle}>
                  <option value="">All Roles</option>
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>

                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={inputStyle}>
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

            <h2 className="card-title">All Users</h2>
            <div className="admin-table-wrapper">
              <table className="admin-table" style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thTdStyle}>ID</th>
                    <th style={thTdStyle}>Name</th>
                    <th style={thTdStyle}>Email</th>
                    <th style={thTdStyle}>Role</th>
                    <th style={thTdStyle}>Status</th>
                    <th style={thTdStyle}>Created At</th>
                    <th style={thTdStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }}>No users found</td>
                    </tr>
                  ) : (
                    paginatedUsers.map((u) => {
                      const canModify = u.role !== "ADMIN" || currentUser.role === "SUPER_ADMIN"; // per row
                      return (
                        <tr
                          key={u.id}
                          onClick={() => setSelectedUser(u)}
                          style={{
                            backgroundColor: selectedUser?.id === u.id ? "rgba(155,89,182,0.08)" : "transparent",
                            cursor: "pointer"
                          }}
                        >
                          <td style={thTdStyle}>{u.id}</td>
                          <td style={thTdStyle}>{u.name}</td>
                          <td style={thTdStyle}>{u.email}</td>
                          <td style={thTdStyle}>{u.role}</td>
                          <td style={thTdStyle}>{u.status ? "Active" : "Inactive"}</td>
                          <td style={thTdStyle}>{u.created_at}</td>
                          <td style={thTdStyle}>
                            {selectedUser?.id === u.id
                              ? canModify
                                ? <strong>Selected</strong>
                                : <small style={{ color: "red" }}>Admin (cannot modify)</small>
                              : "Tap to select"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>

                              </table>
                              <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}>
                              {totalPages > 1 && (
                                <Pagination
                                  currentPage={currentPage}
                                  totalPages={totalPages}
                                  onPageChange={setCurrentPage}
                                />
                              )}
                            </div>

            </div>
          </div>
        )}

        {showDeleteModal && (
          <Modal onClose={() => setShowDeleteModal(false)}>
            <h3>Delete user</h3>
            <p>Are you sure you want to delete <strong>{deleteTargetUser?.name}</strong>?</p>
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "1rem" }}>
              <button className="admin-button" onClick={async () => { await handleDelete(deleteTargetUser.id); setShowDeleteModal(false); setDeleteTargetUser(null); }}>Delete</button>
              <button className="admin-button cancel-btn" style={{ backgroundColor: "#ccc", color: "#333" }} onClick={() => { setShowDeleteModal(false); setDeleteTargetUser(null); }}>Cancel</button>
            </div>
          </Modal>
        )}

        {showUpdateModal && (
          <Modal onClose={() => setShowUpdateModal(false)}>
            <h3>Update role</h3>
            <p style={{ textAlign: "center" }}>Update role for <strong>{selectedUser?.name}</strong></p>
            <select className="admin-input" value={updateRole} onChange={(e) => setUpdateRole(e.target.value)}>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "1rem" }}>
              <button className="admin-button" onClick={async () => { await handleRoleChange(selectedUser.id, updateRole); setShowUpdateModal(false); }}>Update</button>
              <button className="admin-button cancel-btn" style={{ backgroundColor: "#ccc", color: "#333" }} onClick={() => setShowUpdateModal(false)}>Cancel</button>
            </div>
          </Modal>
        )}

        {showLogoutModal && (
          <Modal onClose={() => setShowLogoutModal(false)}>
            <h3>Logout</h3>
            <p style={{ textAlign: "center" }}>Are you sure you want to logout?</p>
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "1rem" }}>
              <button className="admin-button" onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); toast.success('Logged out successfully'); setShowLogoutModal(false); navigate('/login'); }}>Logout</button>
              <button className="admin-button cancel-btn" style={{ backgroundColor: "#ccc", color: "#333" }} onClick={() => setShowLogoutModal(false)}>Cancel</button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

