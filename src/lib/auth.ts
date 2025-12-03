import bcrypt from "bcryptjs";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "./prisma";

const TOKEN_NAME = "govai_token";
const TOKEN_TTL_DAYS = 7;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return secret;
}

export function signAuthToken(userId: string) {
  return jwt.sign({ userId }, getJwtSecret(), { expiresIn: `${TOKEN_TTL_DAYS}d` });
}

export function setAuthCookie(res: NextApiResponse, token: string) {
  const serialized = cookie.serialize(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: TOKEN_TTL_DAYS * 24 * 60 * 60,
  });
  res.setHeader("Set-Cookie", serialized);
}

export function clearAuthCookie(res: NextApiResponse) {
  const serialized = cookie.serialize(TOKEN_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });
  res.setHeader("Set-Cookie", serialized);
}

export async function getUserFromRequest(req: NextApiRequest) {
  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
  const token = cookies[TOKEN_NAME];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    return user;
  } catch (error) {
    return null;
  }
}

export async function requireUser(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  return user;
}

export async function requireRole(
  req: NextApiRequest,
  res: NextApiResponse,
  allowed: ("user" | "admin")[]
) {
  const user = await getUserFromRequest(req);
  if (!user || !allowed.includes(user.role)) {
    res.status(403).json({ error: "Forbidden" });
    return null;
  }
  return user;
}

export function generateToken(len = 32) {
  return crypto.randomBytes(len).toString("hex");
}
