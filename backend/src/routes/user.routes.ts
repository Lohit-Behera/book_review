import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  userRegister,
  userLogin,
  userLogout,
  userDetails,
  getUserInfo,
  userUpdate,
  updatePassword,
  makeUserAdmin,
} from "../controllers/userController";

const router = Router();

// Public routes
router.post("/register", userRegister);
router.post("/login", userLogin);

// Protected routes
router.get("/logout", authMiddleware, userLogout);
router.get("/details", authMiddleware, userDetails);
router.get("/profile/:userId", authMiddleware, getUserInfo);
router.patch("/update", authMiddleware, userUpdate);
router.patch("/update/password", authMiddleware, updatePassword);
router.patch("/admin", authMiddleware, makeUserAdmin);

export default router;
