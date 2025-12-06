import type { ChatMessage } from './types';
import type { FunctionDeclaration } from '@google/genai';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export const generateTitle = async (userMessage: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE}/api/ai/title`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate title');
    }

    const data = await response.json();
    return data.title || userMessage.slice(0, 30);
  } catch (error) {
    console.error("[AI] Error generating title:", error);
    return userMessage.slice(0, 30) + (userMessage.length > 30 ? '...' : '');
  }
};

export const runChat = async (
  prompt: string, 
  history: ChatMessage[], 
  systemInstruction?: string,
  tools?: FunctionDeclaration[]
): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        history,
        systemInstruction,
        useTools: tools && tools.length > 0,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'AI request failed');
    }

    const data = await response.json();
    return data.response || "I was unable to generate a response. Please try again.";
  } catch (error) {
    console.error("[AI] Chat error:", error);
    throw error;
  }
};

export const streamChat = async (
  prompt: string,
  history: ChatMessage[],
  systemInstruction?: string,
  onChunk?: (chunk: string) => void
): Promise<string> => {
  try {
    const result = await runChat(prompt, history, systemInstruction);
    onChunk?.(result);
    return result;
  } catch (error) {
    console.error("[AI] Stream chat error:", error);
    throw error;
  }
};
