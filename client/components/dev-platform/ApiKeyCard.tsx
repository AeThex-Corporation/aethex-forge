import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Key,
  MoreVertical,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Calendar,
  Activity,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ApiKeyCardProps {
  apiKey: {
    id: string;
    name: string;
    key_prefix: string;
    scopes: string[];
    last_used_at?: string | null;
    usage_count: number;
    is_active: boolean;
    created_at: string;
    expires_at?: string | null;
  };
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  onViewStats: (id: string) => void;
}

export function ApiKeyCard({ apiKey, onDelete, onToggleActive, onViewStats }: ApiKeyCardProps) {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey.key_prefix + "***");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isExpired = apiKey.expires_at && new Date(apiKey.expires_at) < new Date();
  const daysUntilExpiry = apiKey.expires_at
    ? Math.ceil((new Date(apiKey.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <Card className="p-5 border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between gap-4">
        {/* Icon and Name */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Key className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-mono font-semibold text-foreground truncate">
                {apiKey.name}
              </h3>
              {!apiKey.is_active && (
                <Badge variant="secondary" className="text-xs">
                  Inactive
                </Badge>
              )}
              {isExpired && (
                <Badge variant="destructive" className="text-xs">
                  Expired
                </Badge>
              )}
            </div>

            {/* API Key Display */}
            <div className="flex items-center gap-2 mb-3">
              <code className="text-sm font-mono text-muted-foreground">
                {showKey ? apiKey.key_prefix : apiKey.key_prefix.substring(0, 12)}
                {"*".repeat(showKey ? 0 : 40)}
              </code>
              <button
                onClick={() => setShowKey(!showKey)}
                className="p-1 hover:bg-muted rounded transition-colors"
                aria-label={showKey ? "Hide key" : "Show key"}
              >
                {showKey ? (
                  <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                ) : (
                  <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </button>
              <button
                onClick={copyToClipboard}
                className="p-1 hover:bg-muted rounded transition-colors"
                aria-label="Copy key"
              >
                {copied ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </button>
            </div>

            {/* Scopes */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {apiKey.scopes.map((scope) => (
                <Badge
                  key={scope}
                  variant="outline"
                  className="text-xs border-primary/30 text-primary"
                >
                  {scope}
                </Badge>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>{apiKey.usage_count.toLocaleString()} requests</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Last used:{" "}
                  {apiKey.last_used_at
                    ? new Date(apiKey.last_used_at).toLocaleDateString()
                    : "Never"}
                </span>
              </div>
            </div>

            {/* Expiration Warning */}
            {daysUntilExpiry !== null && daysUntilExpiry < 30 && daysUntilExpiry > 0 && (
              <div className="mt-2 text-xs text-yellow-500">
                Expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        </div>

        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onViewStats(apiKey.id)}>
              <Activity className="w-4 h-4 mr-2" />
              View Statistics
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onToggleActive(apiKey.id, !apiKey.is_active)}
            >
              {apiKey.is_active ? (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Deactivate Key
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Activate Key
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(apiKey.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Key
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
