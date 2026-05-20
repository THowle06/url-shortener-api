import express from "express";
import indexRoutes from "./routes/index.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { logger } from "./middlewares/logger.js";

const app = express();

app.use(express.json());
app.use(logger);

// Routes
app.use("/", indexRoutes);

// Global error handler
app.use(errorHandler);

export default app;
