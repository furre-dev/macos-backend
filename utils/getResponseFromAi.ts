import OpenAI from "openai";
import { Message } from "./types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function getResponseFromAi(messages: Message[]) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: messages,
    store: true,
  });

  const response = completion.choices[0].message

  return response.content;
}


