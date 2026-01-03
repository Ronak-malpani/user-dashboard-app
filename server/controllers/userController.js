import db from "../config/db.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async (req, res) => {
    try{
        const [rows] = await db.promise().query("SELECT * FROM users");
        res.status(200).json(rows);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

export const deleteUser = async (req,res) => {
    const userId = req.params.id;
    const [rows] = await db.promise().query("SELECT * FROM users WHERE id = ?", [userId]);
    if(rows.length === 0) return res.status(404).json({message:"User not found"});
    if(rows[0].role === "ADMIN") return res.status(403).json({message:"Cannot delete another admin"});

    try {
        await db.promise().execute("DELETE FROM users WHERE id = ?", [userId]);
        res.status(200).json({message:"User deleted"});
    } catch(err) {
        res.status(500).json({message: err.message});
    }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email, and password required" });

    const hashed = await bcrypt.hash(password, 10);
    await db.promise().execute(
      "INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)",
      [name, email, hashed, role || "USER"]
    );
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get profile for logged in user
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.promise().query("SELECT id, name, email, role, status, created_at FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // logged-in user
        const { name, email, password, currentPassword, newPassword } = req.body;

        // If no updatable field provided
        if(!name && !email && !password && !newPassword){
            return res.status(400).json({message:"Please provide name, email or password to update"});
        }

        // Handle password update: require currentPassword and verify
        let passwordToSet = null;
        if (password || newPassword) {
            const providedNew = newPassword || password;
            if (!currentPassword) {
                return res.status(400).json({ message: "Current password is required to change password" });
            }

            // fetch current hashed password from DB
            const [rows] = await db.promise().query("SELECT password FROM users WHERE id = ?", [userId]);
            if (rows.length === 0) return res.status(404).json({ message: "User not found" });

            const hashed = rows[0].password;
            const match = await bcrypt.compare(currentPassword, hashed);
            if (!match) return res.status(401).json({ message: "Current password is incorrect" });

            passwordToSet = await bcrypt.hash(providedNew, 10);
        }

        // build update query
        let params = [];
        let sql = "UPDATE users SET ";
        let parts = [];

        if (name) {
            parts.push("name=?");
            params.push(name);
        }
        if (email) {
            parts.push("email=?");
            params.push(email);
        }
        if (passwordToSet) {
            parts.push("password=?");
            params.push(passwordToSet);
        }

        sql += parts.join(", ");
        sql += " WHERE id=?";
        params.push(userId);

        await db.promise().execute(sql, params);

        res.status(200).json({message:"Profile updated successfully"});

    } catch(err) {
        console.log(err);
        res.status(500).json({message:"Something went wrong"});
    }
};

// Update any user by Admin
export const updateUserByAdmin = async (req, res) => {
    try {
        const currentUserRole = req.user.role; // Who is logged in
        const userId = req.params.id;           // User we want to update
        const { name, email, role, status } = req.body;

        // Fetch the user we want to update
        const [rows] = await db.promise().query("SELECT * FROM users WHERE id = ?", [userId]);
        if (rows.length === 0) return res.status(404).json({message:"User not found"});

        const targetUser = rows[0];

        // Only block normal admins from editing other admins
        if(targetUser.role === "ADMIN" && currentUserRole !== "SUPER_ADMIN") {
            return res.status(403).json({message: "Cannot modify another admin"});
        }

        // Only SUPER_ADMIN can assign the SUPER_ADMIN role
        if(role === "SUPER_ADMIN" && currentUserRole !== "SUPER_ADMIN") {
            return res.status(403).json({message: "Only SUPER_ADMIN can assign SUPER_ADMIN role"});
        }

        // Build the SQL update query
        let params = [];
        const parts = [];
        if(name) parts.push("name=?"), params.push(name);
        if(email) parts.push("email=?"), params.push(email);
        if(role) parts.push("role=?"), params.push(role);
        if(status !== undefined) parts.push("status=?"), params.push(status ? 1 : 0);

        if(parts.length === 0) return res.status(400).json({message: "Provide at least one field to update"});

        const sql = "UPDATE users SET " + parts.join(", ") + " WHERE id=?";
        params.push(userId);

        await db.promise().execute(sql, params);

        res.status(200).json({message:"User updated successfully"});

    } catch(err) {
        console.log(err);
        res.status(500).json({message:"Something went wrong"});
    }
};



