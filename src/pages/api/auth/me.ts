import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromRequest } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ user: null });
  return res.status(200).json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
}
