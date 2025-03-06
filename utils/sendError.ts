import { VercelResponse } from "@vercel/node";

export function sendError(statusCode: number, message: string, res: VercelResponse) {
  return res.status(statusCode).json({
    error: message,
  })
}