import React, { useState, useRef, useEffect } from 'react';
import type { Persona } from '@/lib/ai/types';
import { SendIcon } from './Icons';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  persona: Persona;
  isLocked?: boolean;
  onUnlock?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading, 
  persona,
  isLocked,
  onUnlock
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading && !isLocked) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-card/50 rounded-xl border border-border">
        <p className="text-muted-foreground text-sm mb-3">
          Upgrade to access {persona.name}
        </p>
        <Button 
          onClick={onUnlock}
          className={persona.theme.button}
        >
          Unlock {persona.requiredTier} Tier
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end gap-2 bg-card/80 backdrop-blur-sm rounded-xl border border-border p-2 focus-within:border-primary/50 transition-colors">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask ${persona.name}...`}
          disabled={isLoading}
          rows={1}
          className="flex-1 bg-transparent border-none outline-none resize-none text-foreground placeholder-muted-foreground text-sm md:text-base min-h-[40px] max-h-[150px] py-2 px-2"
        />
        <Button
          type="submit"
          disabled={!input.trim() || isLoading}
          size="icon"
          className={`flex-shrink-0 ${persona.theme.button} disabled:opacity-50`}
        >
          <SendIcon className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
};
