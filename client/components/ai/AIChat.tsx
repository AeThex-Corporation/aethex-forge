import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChatMessage as ChatMessageType, Persona, ChatSession, UserTier, UserBadgeInfo } from '@/lib/ai/types';
import { canAccessPersona } from '@/lib/ai/types';
import { PERSONAS, getDefaultPersona } from '@/lib/ai/personas';
import { runChat, generateTitle } from '@/lib/ai/gemini-service';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { PersonaSelector } from './PersonaSelector';
import { getPersonaIcon, CloseIcon, TrashIcon, SparklesIcon, ChatIcon } from './Icons';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { aethexBadgeService } from '@/lib/aethex-database-adapter';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  initialPersonaId?: string;
  currentRealm?: string;
}

const STORAGE_KEY = 'aethex-ai-sessions';

const getUserTier = (roles: string[]): UserTier => {
  if (roles.includes('council') || roles.includes('admin') || roles.includes('owner')) {
    return 'Council';
  }
  if (roles.includes('architect') || roles.includes('staff') || roles.includes('premium') || roles.includes('pro')) {
    return 'Pro';
  }
  return 'Free';
};

export const AIChat: React.FC<AIChatProps> = ({ 
  isOpen, 
  onClose, 
  initialPersonaId,
  currentRealm 
}) => {
  const { user, roles } = useAuth();
  const userTier = getUserTier(roles);
  
  const [currentPersona, setCurrentPersona] = useState<Persona>(() => {
    if (initialPersonaId) {
      return PERSONAS.find(p => p.id === initialPersonaId) || getDefaultPersona();
    }
    return getDefaultPersona();
  });
  
  const [messages, setMessages] = useState<ChatMessageType[]>([
    { role: 'model', content: currentPersona.initialMessage, timestamp: Date.now() }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [userBadges, setUserBadges] = useState<UserBadgeInfo[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasAccess = canAccessPersona(userTier, currentPersona.requiredTier, userBadges, currentPersona.unlockBadgeSlug);

  // Fetch user badges
  useEffect(() => {
    const fetchBadges = async () => {
      if (!user?.id) {
        setUserBadges([]);
        return;
      }
      try {
        const badges = await aethexBadgeService.getUserBadges(user.id);
        const badgeInfos: UserBadgeInfo[] = badges
          .filter(ub => ub.badge?.slug)
          .map(ub => ({
            slug: ub.badge!.slug,
            name: ub.badge!.name,
            earnedAt: ub.earned_at,
          }));
        setUserBadges(badgeInfos);
      } catch (err) {
        console.warn('[AIChat] Failed to fetch user badges:', err);
        setUserBadges([]);
      }
    };
    fetchBadges();
  }, [user?.id]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSessions(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, 20)));
    }
  }, [sessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handlePersonaChange = useCallback((persona: Persona) => {
    setCurrentPersona(persona);
    setMessages([
      { role: 'model', content: persona.initialMessage, timestamp: Date.now() }
    ]);
    setCurrentSessionId(null);
  }, []);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading || !hasAccess) return;

    const userMessage: ChatMessageType = { 
      role: 'user', 
      content, 
      timestamp: Date.now() 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const history = messages.filter(m => m.role !== 'model' || messages.indexOf(m) > 0);
      
      let response: string;
      try {
        response = await runChat(
          content,
          history,
          currentPersona.systemInstruction,
          currentPersona.tools
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        if (errorMessage.includes('AI service not configured') || errorMessage.includes('not configured')) {
          response = "The AI service is currently being set up. Please check back soon, or contact the administrator to configure the Gemini API key.";
        } else {
          throw err;
        }
      }

      const modelMessage: ChatMessageType = { 
        role: 'model', 
        content: response, 
        timestamp: Date.now() 
      };
      
      setMessages(prev => [...prev, modelMessage]);

      if (!currentSessionId && messages.length === 1) {
        const title = await generateTitle(content);
        const newSession: ChatSession = {
          id: crypto.randomUUID(),
          personaId: currentPersona.id,
          title,
          messages: [...messages, userMessage, modelMessage],
          timestamp: Date.now()
        };
        setSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(newSession.id);
      } else if (currentSessionId) {
        setSessions(prev => prev.map(s => 
          s.id === currentSessionId 
            ? { ...s, messages: [...messages, userMessage, modelMessage], timestamp: Date.now() }
            : s
        ));
      }
    } catch (error) {
      console.error('[AIChat] Error:', error);
      const errorMessage: ChatMessageType = {
        role: 'model',
        content: "I encountered an error processing your request. Please try again.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, hasAccess, currentPersona, currentSessionId]);

  const handleClearChat = useCallback(() => {
    setMessages([
      { role: 'model', content: currentPersona.initialMessage, timestamp: Date.now() }
    ]);
    setCurrentSessionId(null);
  }, [currentPersona]);

  const Icon = getPersonaIcon(currentPersona.icon);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100vw-2rem)] md:w-[450px] h-[600px] max-h-[80vh] bg-background border border-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            <div className={`flex items-center justify-between p-4 border-b border-border bg-gradient-to-r ${currentPersona.theme.gradient} bg-opacity-10`}>
              <PersonaSelector
                currentPersona={currentPersona}
                onSelectPersona={handlePersonaChange}
                userTier={userTier}
                currentRealm={currentRealm}
                userBadges={userBadges}
              />
              <div className="flex items-center gap-2">
                {messages.length > 1 && !isLoading && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearChat}
                    className="text-muted-foreground hover:text-destructive"
                    title="Clear chat"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <CloseIcon className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 pb-4">
                {messages.map((msg, index) => (
                  <ChatMessage key={index} message={msg} persona={currentPersona} />
                ))}
                {isLoading && (
                  <div className="flex justify-start items-start gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${currentPersona.theme.avatar} flex items-center justify-center flex-shrink-0 shadow-lg opacity-80`}>
                      <div className="w-2 h-2 bg-white/50 rounded-full animate-ping" />
                    </div>
                    <div className="bg-card rounded-2xl rounded-tl-none p-4 border border-border">
                      <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s] bg-muted-foreground"></div>
                        <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s] bg-muted-foreground"></div>
                        <div className="w-2 h-2 rounded-full animate-bounce bg-muted-foreground"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border bg-card/50">
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                persona={currentPersona}
                isLocked={!hasAccess}
              />
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                {user ? `Signed in as ${user.email}` : 'Sign in for personalized experience'} · {userTier} Tier
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const AIChatButton: React.FC<{ currentRealm?: string }> = ({ currentRealm }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 shadow-lg flex items-center justify-center z-30 hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <SparklesIcon className="w-6 h-6 text-white" />
      </motion.button>
      <AIChat 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        currentRealm={currentRealm}
      />
    </>
  );
};

export default AIChat;
