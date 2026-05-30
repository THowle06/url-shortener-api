import { Router } from "express";
import {
  createShortUrl,
  getOriginalUrl,
  updateShortUrl,
  getRoot,
  deleteShortUrl,
} from "../controllers/index.controller";

const router = Router();

router.get("/", getRoot);
router.post("/shorten", createShortUrl);
router.get("/shorten/:shortCode", getOriginalUrl);
router.put("/shorten/:shortCode", updateShortUrl);
router.delete("/shorten/:shortCode", deleteShortUrl);

export default router;
