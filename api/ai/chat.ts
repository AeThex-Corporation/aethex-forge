import type { Request, Response } from "express";
import { GoogleGenAI, Chat, FunctionDeclaration, Type } from "@google/genai";

const GEMINI_API_KEY = process.env.AI_INTEGRATIONS_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";

const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

interface ChatMessage {
  role: "user" | "model";
  content: string;
}

interface ChatRequest {
  prompt: string;
  history: ChatMessage[];
  systemInstruction?: string;
  personaId?: string;
  useTools?: boolean;
}

const AETHEX_TOOLS: FunctionDeclaration[] = [
  {
    name: "get_account_balance",
    description: "Retrieves the current AETH balance for a given wallet address.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        address: {
          type: Type.STRING,
          description: "The 42-character hexadecimal Aethex wallet address.",
        },
      },
      required: ["address"],
    },
  },
  {
    name: "get_transaction_details",
    description: "Fetches detailed information about a specific transaction.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        tx_hash: {
          type: Type.STRING,
          description: "The 66-character hexadecimal transaction hash.",
        },
      },
      required: ["tx_hash"],
    },
  },
  {
    name: "check_domain_availability",
    description: "Checks if a .aethex domain name is available for registration.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        domain: {
          type: Type.STRING,
          description: "The domain name to check (without .aethex suffix)",
        },
      },
      required: ["domain"],
    },
  },
];

const executeTool = (name: string, args: Record<string, unknown>): Record<string, unknown> => {
  console.log(`[AI Tool] Executing: ${name}`, args);

  switch (name) {
    case "get_account_balance": {
      const balance = (Math.random() * 1000000).toFixed(2);
      return {
        balance: `${balance} AETH`,
        address: args.address,
        lastUpdated: new Date().toISOString(),
      };
    }
    case "get_transaction_details": {
      const txHash = args.tx_hash as string;
      return {
        hash: txHash,
        from: txHash?.slice(0, 10) + "...",
        to: "0x" + [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join(""),
        value: `${(Math.random() * 100).toFixed(2)} AETH`,
        status: Math.random() > 0.1 ? "Success" : "Failed",
        blockNumber: Math.floor(Math.random() * 1000000),
        timestamp: new Date().toISOString(),
      };
    }
    case "check_domain_availability": {
      const domain = args.domain as string;
      const isAvailable = Math.random() > 0.3;
      return {
        domain: `${domain}.aethex`,
        available: isAvailable,
        price: isAvailable ? `${(50 + Math.random() * 50).toFixed(2)} AETH` : null,
        owner: isAvailable ? null : "0x" + [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join(""),
      };
    }
    default:
      return { error: `Tool ${name} not found.` };
  }
};

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
    const { prompt, history, systemInstruction, useTools } = req.body as ChatRequest;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const tools = useTools ? AETHEX_TOOLS : undefined;

    const chat: Chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        tools: tools && tools.length > 0 ? [{ functionDeclarations: tools }] : undefined,
        systemInstruction: systemInstruction,
      },
      history: (history || []).map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
    });

    let response = await chat.sendMessage({ message: prompt });
    let text = response.text;

    if (response.functionCalls && response.functionCalls.length > 0) {
      const functionCalls = response.functionCalls;
      console.log("[AI] Model requested function calls:", functionCalls);

      const functionResponseParts = functionCalls.map((fc) => {
        const result = executeTool(fc.name, fc.args as Record<string, unknown>);
        return {
          functionResponse: {
            name: fc.name,
            response: { result },
          },
        };
      });

      console.log("[AI] Sending tool responses back to model");
      const result2 = await chat.sendMessage({ message: functionResponseParts });
      text = result2.text;
    }

    if (!text) {
      return res.json({ response: "I was unable to generate a response. Please try again." });
    }

    return res.json({ response: text });
  } catch (error) {
    console.error("[AI] Chat error:", error);
    return res.status(500).json({ 
      error: "AI request failed",
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
}
