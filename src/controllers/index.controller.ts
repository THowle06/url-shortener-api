import { Request, Response, NextFunction } from "express";
import { getWelcome } from "../services/index.service";
import { StatusCodes } from "http-status-codes";

export function getRoot(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = getWelcome();
    return res.status(StatusCodes.OK).json(payload);
  } catch (err) {
    return next(err);
  }
}
