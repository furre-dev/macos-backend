import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { Message } from "../utils/types"
import { sendError } from '../utils/sendError';
import { getResponseFromAi } from '../utils/getResponseFromAi';
import systemPrompt from "../utils/systemPrompt"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins or specify one for security
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, POST, GET, OPTIONS'); // Allow specific methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With'); // Allow specific headers
  if (req.method !== "POST") return sendError(405, "This endpoint only allows 'POST' requests.", res)

  const body: { messages: Message[] } | undefined = req.body;

  if (!body) return sendError(400, "Request body is missing.", res);

  const messages: Message[] = [
    { role: "system", content: systemPrompt },
    ...(body?.messages || [])
  ];

  const response = await getResponseFromAi(messages);

  return res.json({
    response: response,
  })
}