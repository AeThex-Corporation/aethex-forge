import React from 'react';
import type { Persona, UserTier } from '@/lib/ai/types';
import { canAccessPersona } from '@/lib/ai/types';
import { PERSONAS, getPersonasByRealm } from '@/lib/ai/personas';
import { getPersonaIcon, ChevronDownIcon } from './Icons';
import { Lock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PersonaSelectorProps {
  currentPersona: Persona;
  onSelectPersona: (persona: Persona) => void;
  userTier: UserTier;
  currentRealm?: string;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  currentPersona,
  onSelectPersona,
  userTier,
  currentRealm
}) => {
  const CurrentIcon = getPersonaIcon(currentPersona.icon);

  const realmPersonas = currentRealm ? getPersonasByRealm(currentRealm) : [];
  const otherPersonas = PERSONAS.filter(p => !currentRealm || p.realm !== currentRealm);

  const renderPersonaItem = (persona: Persona) => {
    const Icon = getPersonaIcon(persona.icon);
    const hasAccess = canAccessPersona(userTier, persona.requiredTier);
    const isSelected = persona.id === currentPersona.id;

    return (
      <DropdownMenuItem
        key={persona.id}
        onClick={() => hasAccess && onSelectPersona(persona)}
        disabled={!hasAccess}
        className={`flex items-center gap-3 p-3 cursor-pointer ${
          isSelected ? 'bg-primary/10' : ''
        } ${!hasAccess ? 'opacity-50' : ''}`}
      >
        <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${persona.theme.avatar} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm truncate">{persona.name}</span>
            {!hasAccess && <Lock className="w-3 h-3 text-muted-foreground" />}
          </div>
          <p className="text-xs text-muted-foreground truncate">{persona.description}</p>
        </div>
        {persona.requiredTier !== 'Free' && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${
            persona.requiredTier === 'Council' 
              ? 'bg-purple-500/20 text-purple-400' 
              : 'bg-blue-500/20 text-blue-400'
          }`}>
            {persona.requiredTier}
          </span>
        )}
      </DropdownMenuItem>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors w-full">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${currentPersona.theme.avatar} flex items-center justify-center shadow-lg`}>
            <CurrentIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <h3 className={`font-semibold text-sm bg-gradient-to-r ${currentPersona.theme.gradient} bg-clip-text text-transparent`}>
              {currentPersona.name}
            </h3>
            <p className="text-xs text-muted-foreground truncate">{currentPersona.description}</p>
          </div>
          <ChevronDownIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72 max-h-[400px] overflow-y-auto">
        {realmPersonas.length > 0 && (
          <>
            <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
              Suggested for this realm
            </DropdownMenuLabel>
            {realmPersonas.map(renderPersonaItem)}
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
          All Agents
        </DropdownMenuLabel>
        {otherPersonas.map(renderPersonaItem)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
