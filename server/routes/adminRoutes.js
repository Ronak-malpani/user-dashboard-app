import express from "express";
import { VerifyToken } from "../middleware/verifyToken.js";
import { VerifyRole } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  createUser,
  updateUserByAdmin,
  deleteUser
} from "../controllers/userController.js";

const router = express.Router();

router.get("/users", VerifyToken, VerifyRole(["ADMIN", "SUPER_ADMIN"]), getAllUsers);
router.post("/users", VerifyToken, VerifyRole(["ADMIN", "SUPER_ADMIN"]), createUser);
router.put("/users/:id", VerifyToken, VerifyRole(["ADMIN", "SUPER_ADMIN"]), updateUserByAdmin);
router.delete("/users/:id", VerifyToken, VerifyRole(["ADMIN", "SUPER_ADMIN"]), deleteUser);

export default router;
