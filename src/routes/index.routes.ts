import { Router } from "express";
import { getRoot } from "../controllers/index.controller";

const router = Router();

router.get("/", getRoot);

export default router;
