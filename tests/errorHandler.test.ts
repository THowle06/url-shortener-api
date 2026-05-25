import type { Request, Response, NextFunction } from "express";
import { errorHandler } from "../src/middlewares/errorHandler";
import { describe, expect, it, jest } from "@jest/globals";

describe("errorHandler", () => {
  it("returns 503 for prisma database unreachable error (P1001)", () => {
    const err = {
      name: "PrismClientKnownRequestError",
      code: "P1001",
      message: "Can't reach database server",
    } as Error & { code: string };

    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    errorHandler(err as any, req, res, next);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({
      message: "Database is temporarily unavailable",
      code: "P1001",
    });
  });

  it("returns 500 for unknown errors", () => {
    const err = new Error("Boom");

    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    errorHandler(err as any, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Boom",
    });
  });
});
