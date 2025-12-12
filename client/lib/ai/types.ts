import type { FunctionDeclaration } from '@google/genai';
import type { SubscriptionTier } from '../database.types';

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
  requiredTier: UserTier;
  unlockBadgeSlug?: string;
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

export type UserTier = 'Free' | 'Pro' | 'Council';

export const TIER_HIERARCHY: Record<UserTier, number> = {
  'Free': 0,
  'Pro': 1,
  'Council': 2,
};

export const dbTierToUserTier = (dbTier: SubscriptionTier | null | undefined): UserTier => {
  if (!dbTier) return 'Free';
  switch (dbTier) {
    case 'council': return 'Council';
    case 'pro': return 'Pro';
    default: return 'Free';
  }
};

export const userTierToDbTier = (userTier: UserTier): SubscriptionTier => {
  switch (userTier) {
    case 'Council': return 'council';
    case 'Pro': return 'pro';
    default: return 'free';
  }
};

export interface UserBadgeInfo {
  slug: string;
  name: string;
  earnedAt: string;
}

export interface PersonaAccessContext {
  tier: UserTier;
  badges: UserBadgeInfo[];
}

export const canAccessPersona = (
  userTier: UserTier, 
  requiredTier: UserTier,
  userBadges?: UserBadgeInfo[],
  unlockBadgeSlug?: string
): boolean => {
  if (TIER_HIERARCHY[userTier] >= TIER_HIERARCHY[requiredTier]) {
    return true;
  }
  
  if (unlockBadgeSlug && userBadges) {
    return userBadges.some(badge => badge.slug === unlockBadgeSlug);
  }
  
  return false;
};

export const getPersonaAccessReason = (
  userTier: UserTier,
  requiredTier: UserTier,
  userBadges?: UserBadgeInfo[],
  unlockBadgeSlug?: string
): { hasAccess: boolean; reason: 'tier' | 'badge' | 'none'; badgeName?: string } => {
  if (TIER_HIERARCHY[userTier] >= TIER_HIERARCHY[requiredTier]) {
    return { hasAccess: true, reason: 'tier' };
  }
  
  if (unlockBadgeSlug && userBadges) {
    const badge = userBadges.find(b => b.slug === unlockBadgeSlug);
    if (badge) {
      return { hasAccess: true, reason: 'badge', badgeName: badge.name };
    }
  }
  
  return { hasAccess: false, reason: 'none' };
};
