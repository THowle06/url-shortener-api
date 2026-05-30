import { Request, Response, NextFunction } from "express";
import {
  createShortUrl as createShortUrlService,
  getShortUrlByCode as getShortUrlByCodeService,
  updateShortUrlByCode as updateShortUrlByCodeService,
  deleteShortUrlByCode as deleteShortUrlByCodeService,
  getWelcome,
  deleteShortUrlByCode,
} from "../services/index.service";
import { StatusCodes } from "http-status-codes";

function validateShortenBody(body: unknown): string[] {
  const errors: string[] = [];

  if (!body || typeof body !== "object") {
    return ["Request body must be a JSON object"];
  }

  const url = (body as { url?: unknown }).url;

  if (typeof url !== "string" || url.trim().length === 0) {
    errors.push("url is required");
    return errors;
  }

  try {
    new URL(url);
  } catch {
    errors.push("url must be a valid URL");
  }

  return errors;
}

export function getRoot(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = getWelcome();
    return res.status(StatusCodes.OK).json(payload);
  } catch (err) {
    return next(err);
  }
}

export async function createShortUrl(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const errors = validateShortenBody(req.body);

    if (errors.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors });
    }

    const record = await createShortUrlService(req.body.url);

    return res.status(StatusCodes.CREATED).json({
      id: record.id.toString(),
      url: record.url,
      shortCode: record.shortCode,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  } catch (err) {
    return next(err);
  }
}

export async function getOriginalUrl(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { shortCode } = req.params;

    if (typeof shortCode !== "string" || shortCode.trim().length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "shortCode is required",
      });
    }

    const record = await getShortUrlByCodeService(shortCode);

    if (!record) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Short URL not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      id: record.id.toString(),
      url: record.url,
      shortCode: record.shortCode,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  } catch (err) {
    return next(err);
  }
}

export async function updateShortUrl(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { shortCode } = req.params;
    const errors = validateShortenBody(req.body);

    if (typeof shortCode !== "string" || shortCode.trim().length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "shortCode is required",
      });
    }

    if (errors.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors });
    }

    const existing = await getShortUrlByCodeService(shortCode);

    if (!existing) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Short URL not found",
      });
    }

    const updated = await updateShortUrlByCodeService(shortCode, req.body.url);

    return res.status(StatusCodes.OK).json({
      id: updated.id.toString(),
      url: updated.url,
      shortCode: updated.shortCode,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  } catch (err) {
    return next(err);
  }
}

export async function deleteShortUrl(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { shortCode } = req.params;

    if (typeof shortCode !== "string" || shortCode.trim().length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "shortCode is required",
      });
    }

    const existing = await getShortUrlByCodeService(shortCode);

    if (!existing) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Short URL not found",
      });
    }

    await deleteShortUrlByCodeService(shortCode);

    return res.status(StatusCodes.NO_CONTENT).send();
  } catch (err) {
    return next(err);
  }
}
