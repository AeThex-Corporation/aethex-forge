import React from 'react';
import { 
  Shield, 
  Hammer, 
  Building2, 
  BookOpen, 
  BarChart3, 
  Music, 
  ScrollText, 
  Waves, 
  DollarSign,
  Brain,
  Gamepad2,
  FlaskConical,
  User,
  Send,
  Trash2,
  X,
  MessageSquare,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import type { PersonaIcon } from '@/lib/ai/types';

interface IconProps {
  className?: string;
}

export const AethexLogo: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const getPersonaIcon = (iconName: PersonaIcon): React.FC<IconProps> => {
  switch (iconName) {
    case 'logo': return AethexLogo;
    case 'shield': return Shield;
    case 'hammer': return Hammer;
    case 'building': return Building2;
    case 'book': return BookOpen;
    case 'chart': return BarChart3;
    case 'music': return Music;
    case 'scroll': return ScrollText;
    case 'wave': return Waves;
    case 'money': return DollarSign;
    case 'brain': return Brain;
    case 'gamepad': return Gamepad2;
    case 'flask': return FlaskConical;
    default: return AethexLogo;
  }
};

export { 
  User as UserIcon,
  Send as SendIcon,
  Trash2 as TrashIcon,
  X as CloseIcon,
  MessageSquare as ChatIcon,
  ChevronDown as ChevronDownIcon,
  Sparkles as SparklesIcon
};
