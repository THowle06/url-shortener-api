import { Router } from "express";
import {
  createShortUrl,
  getOriginalUrl,
  updateShortUrl,
  getRoot,
} from "../controllers/index.controller";

const router = Router();

router.get("/", getRoot);
router.post("/shorten", createShortUrl);
router.get("/shorten/:shortCode", getOriginalUrl);
router.put("/shorten/:shortCode", updateShortUrl);

export default router;
