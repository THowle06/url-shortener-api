import { NextFunction, Request, Response } from "express";
import { appendFileSync, mkdirSync } from "fs";
import { join } from "path";

const colors = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  gray: "\x1b[90m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
};

const logsDir = join(process.cwd(), "logs");

mkdirSync(logsDir, { recursive: true });

function pad(value: string, width: number) {
  return value.padEnd(width);
}

function colorForStatus(statusCode: number) {
  if (statusCode >= 500) return colors.red;
  if (statusCode >= 400) return colors.yellow;
  if (statusCode >= 300) return colors.cyan;
  return colors.green;
}

function colorForMethod(method: string) {
  switch (method) {
    case "GET":
      return colors.blue;
    case "POST":
      return colors.green;
    case "PUT":
      return colors.yellow;
    case "PATCH":
      return colors.cyan;
    case "DELETE":
      return colors.red;
    default:
      return colors.magenta;
  }
}

export function logger(req: Request, res: Response, next: NextFunction) {
  const startedAt = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    const now = new Date();

    const timestamp = pad(now.toISOString(), 24);
    const method = pad(req.method, 6);
    const path = pad(req.originalUrl, 24);
    const status = pad(String(res.statusCode), 3);
    const time = pad(`${durationMs.toFixed(2)}ms`, 8);
    const ip = pad(req.ip ?? "-", 15);

    console.log(
      `${colors.dim}${timestamp}${colors.reset} ` +
        `${colorForMethod(req.method)}${method}${colors.reset} ` +
        `${colors.cyan}${path}${colors.reset} ` +
        `${colorForStatus(res.statusCode)}${status}${colors.reset} ` +
        `${colors.dim}${time}${colors.reset} ` +
        `${colors.gray}${ip}${colors.reset}`,
    );

    const logLine = `${timestamp} ${method} ${path} ${status} ${time} ${ip}\n`;
    const dateStr = now.toISOString().split("T")[0];
    const logFile = join(logsDir, `${dateStr}.log`);

    try {
      appendFileSync(logFile, logLine, "utf-8");
    } catch (err) {
      console.error("Failed to write to log file:", err);
    }
  });

  next();
}
