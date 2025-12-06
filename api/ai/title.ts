import type { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.AI_INTEGRATIONS_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";

const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!ai) {
    return res.status(503).json({ 
      error: "AI service not configured",
      message: "Please ensure the Gemini API key is set up." 
    });
  }

  try {
    const { message } = req.body as { message: string };

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a short, concise, and descriptive title (max 5 words) for a chat conversation that starts with this message: "${message}". Do not use quotes.`,
    });

    const title = response.text?.trim() || message.slice(0, 30);
    return res.json({ title });
  } catch (error) {
    console.error("[AI] Title generation error:", error);
    const fallbackTitle = (req.body?.message || "").slice(0, 30) + "...";
    return res.json({ title: fallbackTitle });
  }
}
