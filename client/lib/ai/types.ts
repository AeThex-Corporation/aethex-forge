import type { FunctionDeclaration } from '@google/genai';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp?: number;
}

export interface PersonaTheme {
  primary: string;
  gradient: string;
  avatar: string;
  button: string;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  systemInstruction: string;
  initialMessage: string;
  tools?: FunctionDeclaration[];
  icon: PersonaIcon;
  theme: PersonaTheme;
  capabilities: string[];
  limitations: string[];
  requiredTier: 'Free' | 'Architect' | 'Council';
  realm?: string;
}

export type PersonaIcon = 
  | 'logo' 
  | 'shield' 
  | 'hammer' 
  | 'building' 
  | 'book' 
  | 'chart' 
  | 'music' 
  | 'scroll' 
  | 'wave' 
  | 'money'
  | 'brain'
  | 'gamepad'
  | 'flask';

export interface ChatSession {
  id: string;
  personaId: string;
  title: string;
  messages: ChatMessage[];
  timestamp: number;
}

export type UserTier = 'Free' | 'Architect' | 'Council';

export const TIER_HIERARCHY: Record<UserTier, number> = {
  'Free': 0,
  'Architect': 1,
  'Council': 2,
};

export const canAccessPersona = (userTier: UserTier, requiredTier: UserTier): boolean => {
  return TIER_HIERARCHY[userTier] >= TIER_HIERARCHY[requiredTier];
};
