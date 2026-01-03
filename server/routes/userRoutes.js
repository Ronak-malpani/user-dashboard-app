import express from "express";
import { VerifyToken } from "../middleware/verifyToken.js";
import { VerifyRole } from "../middleware/authMiddleware.js";
import { updateUserProfile, getProfile  } from "../controllers/userController.js";

const router = express.Router();

// Get own profile
router.get("/profile", VerifyToken, getProfile);

// Update own profile
router.put("/profile", VerifyToken, VerifyRole(["USER", "ADMIN"]), updateUserProfile);

export default router;
