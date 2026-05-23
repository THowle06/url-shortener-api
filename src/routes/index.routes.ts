import { Router } from "express";
import { createShortUrl, getRoot } from "../controllers/index.controller";

const router = Router();

router.get("/", getRoot);
router.post("/shorten", createShortUrl);

export default router;
