import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createReview, getReviews } from "../controllers/reviewController";

const router = Router();

router.post("/create", authMiddleware, createReview);

router.get("/get/:bookId", authMiddleware, getReviews);

export default router;
