import { Request, Response } from "express";
import * as service from "../src/services/index.service";
import { createShortUrl, getRoot } from "../src/controllers/index.controller";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

describe("Index Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns welcome payload", () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest
      .spyOn(service, "getWelcome")
      .mockReturnValue({ message: "Hello from URL Shortener API!" });

    getRoot(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Hello from URL Shortener API!",
    });
  });

  it("creates a short url", async () => {
    const req = {
      body: { url: "https://www.google.com" },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest.spyOn(service, "createShortUrl").mockResolvedValue({
      id: 1,
      url: "https://google.com",
      shortCode: "abc123",
      createdAt: new Date("2021-09-01T12:00:00Z"),
      updatedAt: new Date("2021-09-01T12:00:00Z"),
      accessCount: 0,
    });

    await createShortUrl(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: "1",
      url: "https://google.com",
      shortCode: "abc123",
      createdAt: new Date("2021-09-01T12:00:00Z"),
      updatedAt: new Date("2021-09-01T12:00:00Z"),
    });
  });

  it("returns validation errors for an invalid body", async () => {
    const req = {
      body: { url: "not-a-url" },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await createShortUrl(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ["url must be a valid URL"],
    });
  });
});
