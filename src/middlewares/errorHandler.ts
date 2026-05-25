import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export interface AppError extends Error {
  status?: number;
  code?: string;
  details: unknown;
}

type PrismaLikeError = {
  name?: string;
  code?: string;
  message?: string;
};

function isPrismaLikeError(err: unknown): err is PrismaLikeError {
  return typeof err === "object" && err !== null;
}

function mapPrismaCodeToStatus(code?: string): number {
  if (!code) return StatusCodes.INTERNAL_SERVER_ERROR;

  switch (code) {
    case "P1001":
    case "P1002":
      return StatusCodes.SERVICE_UNAVAILABLE;
    case "P2002":
      return StatusCodes.CONFLICT;
    default:
      return StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

function mapPRismaCodeToMessage(code?: string): string {
  if (!code) return "Internal Server Error";

  switch (code) {
    case "P1001":
    case "P1002":
      return "Database is temporarily unavailable";
    case "P2002":
      return "Resource already exists";
    default:
      return "Database request failed";
  }
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const isPrismaError = isPrismaLikeError(err) && typeof err.code === "string";

  if (isPrismaError) {
    const status = mapPrismaCodeToStatus(err.code);
    return res.status(status).json({
      message: mapPRismaCodeToMessage(err.code),
      code: err.code,
    });
  }

  const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;

  return res.status(status).json({
    message: err.message || "Internal Server Error",
  });
};
