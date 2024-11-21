import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import {
  createBook,
  getBook,
  getAllBooks,
} from "../controllers/bookController";

const router = Router();
// public routes

// protected routes
router.get("/get/:bookId", authMiddleware, getBook);

router.get("/all", authMiddleware, getAllBooks);

// admin routes
router.post("/create", authMiddleware, adminMiddleware, createBook);

export default router;
