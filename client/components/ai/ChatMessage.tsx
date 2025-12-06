import React from 'react';
import type { ChatMessage as ChatMessageType, Persona } from '@/lib/ai/types';
import { getPersonaIcon, UserIcon } from './Icons';

interface ChatMessageProps {
  message: ChatMessageType;
  persona: Persona;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, persona }) => {
  const isUser = message.role === 'user';
  const Icon = getPersonaIcon(persona.icon);

  const formatInlineCode = (text: string, keyPrefix: string, isUserMsg: boolean) => {
    const codeRegex = /`([^`]+)`/g;
    const parts = text.split(codeRegex);

    return parts.map((part, i) => {
      if (i % 2 === 1) {
        const codeClass = isUserMsg 
          ? "bg-black/20 text-white px-1.5 py-0.5 rounded text-sm font-mono"
          : "bg-gray-900/50 text-cyan-300 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-700/50";
        return <code key={`${keyPrefix}-code-${i}`} className={codeClass}>{part}</code>;
      }

      const boldRegex = /\*\*(.*?)\*\*/g;
      const boldParts = part.split(boldRegex);
      
      return boldParts.map((bPart, bI) => {
        if (bI % 2 === 1) {
          return <strong key={`${keyPrefix}-bold-${i}-${bI}`} className="font-bold">{bPart}</strong>;
        }
        
        const italicRegex = /\*([^\*]+)\*/g;
        const italicParts = bPart.split(italicRegex);

        return italicParts.map((iPart, iI) => {
          if (iI % 2 === 1) {
            return <em key={`${keyPrefix}-italic-${i}-${bI}-${iI}`} className="italic opacity-90">{iPart}</em>;
          }
          return <span key={`${keyPrefix}-text-${i}-${bI}-${iI}`}>{iPart}</span>;
        });
      });
    });
  };

  const formatContent = (content: string, isUserMsg: boolean) => {
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const parts = content.split(codeBlockRegex);

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const preClass = isUserMsg
          ? "bg-black/20 p-3 rounded-md overflow-x-auto my-2 text-white/90"
          : "bg-gray-950 p-3 rounded-md overflow-x-auto my-2 border border-gray-800";
        const codeClass = isUserMsg
          ? "text-sm font-mono"
          : `text-sm font-mono ${persona.theme.primary}`;
        
        return (
          <pre key={index} className={preClass}>
            <code className={codeClass}>{part.trim()}</code>
          </pre>
        );
      }

      const lines = part.split('\n');
      return (
        <div key={index} className="whitespace-pre-wrap leading-relaxed">
          {lines.map((line, lineIdx) => {
            const listMatch = line.match(/^(\s*)([-*]|\d+\.)\s+(.+)/);
            
            if (listMatch) {
              const [, , marker, text] = listMatch;
              const isOrdered = /^\d+\./.test(marker);
              return (
                <div key={lineIdx} className="flex items-start gap-2 ml-2 mb-1">
                  <span className={`mt-1 text-xs opacity-70 flex-shrink-0 ${isOrdered ? '' : 'text-[8px] pt-1'}`}>
                    {isOrdered ? marker : '●'}
                  </span>
                  <span className="flex-1 min-w-0 break-words">
                    {formatInlineCode(text, `${index}-${lineIdx}`, isUserMsg)}
                  </span>
                </div>
              );
            }
            
            if (line.trim() === '') {
              return <div key={lineIdx} className="h-2" />;
            }

            return (
              <div key={lineIdx} className="break-words min-w-0">
                {formatInlineCode(line, `${index}-${lineIdx}`, isUserMsg)}
              </div>
            );
          })}
        </div>
      );
    });
  };

  if (isUser) {
    return (
      <div className="flex justify-end items-start gap-3">
        <div className="bg-primary/90 rounded-2xl rounded-tr-none p-3 md:p-4 max-w-[80%] shadow-lg">
          <div className="text-primary-foreground text-sm md:text-base">
            {formatContent(message.content, true)}
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 border border-border">
          <UserIcon className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start items-start gap-3">
      <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${persona.theme.avatar} flex items-center justify-center flex-shrink-0 shadow-lg`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="bg-card rounded-2xl rounded-tl-none p-3 md:p-4 max-w-[80%] shadow-lg border border-border">
        <div className="text-card-foreground text-sm md:text-base">
          {formatContent(message.content, false)}
        </div>
      </div>
    </div>
  );
};
