import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios';
import * as cheerio from 'cheerio';
import { isValidUrl } from '../utils/isValidUrl';
import { sendError } from '../utils/sendError';


export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins (adjust if necessary)
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, POST, GET, OPTIONS'); // Allowed methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With'); // Allowed headers
  // Handle CORS preflight request (OPTIONS)
  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Respond with 200 OK for preflight
  }

  if (req.method !== "POST") return sendError(405, "This endpoint only allows 'POST' requests.", res);

  const body: { url: string | undefined } | undefined = req.body;

  if (!body?.url) return sendError(400, "Request body is missing.", res);

  if (!isValidUrl(body.url)) return sendError(400, "url should be an actual url.", res)

  try {
    const response = await axios.get(body.url);
    const $ = cheerio.load(response.data);

    const title = $('meta[property="og:title"]').attr('content') || $('title').text();
    const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content');
    const image = $('meta[property="og:image"]').attr('content') || $('link[rel="icon"]').attr('href');

    const baseUrl = new URL(body.url);
    const absoluteImageUrl = image ? new URL(image, baseUrl.href).href : null;

    return res.json({
      title: title.trim(),
      description: description?.trim(),
      image: absoluteImageUrl || null,
      webpage_url: baseUrl.hostname,
    })
  } catch (e) {
    console.error("ERRORR", e.message)

    return res.json({
      error: "occured!"
    })
  }



}