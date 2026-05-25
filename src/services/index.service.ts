import { randomBytes } from "crypto";
import { prisma } from "../lib/prisma";

export function getWelcome() {
  return { message: "Hello from URL Shortener API!" };
}

const alpabet =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateShortCode(length = 6): string {
  const bytes = randomBytes(length);
  let shortCode = "";

  for (let index = 0; index < length; index += 1) {
    shortCode += alpabet[bytes[index] % alpabet.length];
  }

  return shortCode;
}

async function generateUniqueShortCode(): Promise<string> {
  for (let attempts = 0; attempts < 10; attempts += 1) {
    const candidate = generateShortCode();

    const existing = await prisma.url.findUnique({
      where: { shortCode: candidate },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }
  }

  throw new Error("Unable to generate a unique short code");
}

export async function createShortUrl(url: string) {
  const shortCode = await generateUniqueShortCode();

  return prisma.url.create({
    data: {
      url,
      shortCode,
    },
  });
}

export async function getShortUrlByCode(shortCode: string) {
  return prisma.url.findUnique({
    where: { shortCode },
  });
}
