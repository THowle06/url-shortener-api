import { Router } from "express";
import {
  createShortUrl,
  getOriginalUrl,
  getRoot,
} from "../controllers/index.controller";

const router = Router();

router.get("/", getRoot);
router.post("/shorten", createShortUrl);
router.get("/shorten/:shortCode", getOriginalUrl);

export default router;
