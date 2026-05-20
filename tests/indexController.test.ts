import { Request, Response } from "express";
import * as service from "../src/services/index.service";
import { getRoot } from "../src/controllers/index.controller";
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
});
