import { memo, type ComponentType } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Loader2, Link as LinkIcon, Unlink, ShieldCheck } from "lucide-react";

export type ProviderKey = "google" | "github" | "discord";

export interface ProviderDescriptor {
  provider: ProviderKey;
  name: string;
  description: string;
  Icon: ComponentType<{ className?: string }>;
  gradient: string;
}

export interface LinkedProviderMeta {
  provider: ProviderKey;
  identityId?: string;
  linkedAt?: string;
  lastSignInAt?: string;
}

interface OAuthConnectionsProps {
  providers: readonly ProviderDescriptor[];
  linkedProviderMap: Record<string, LinkedProviderMeta | undefined>;
  connectionAction: string | null;
  onLink: (provider: ProviderKey) => void;
  onUnlink: (provider: ProviderKey) => void;
}

const formatTimestamp = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
};

const statusCopy = {
  linked: "Linked",
  notLinked: "Not linked yet",
};

const OAuthConnections = memo(function OAuthConnections({
  providers,
  linkedProviderMap,
  connectionAction,
  onLink,
  onUnlink,
}: OAuthConnectionsProps) {
  return (
    <div className="space-y-4" aria-live="polite">
      {providers.map((providerConfig) => {
        const { provider, name, description, Icon, gradient } = providerConfig;
        const linkedMeta = linkedProviderMap[provider];
        const isLinking = connectionAction === `${provider}-link`;
        const isUnlinking = connectionAction === `${provider}-unlink`;

        const linkedBadge = linkedMeta ? (
          <Badge className="bg-emerald-600/90 hover:bg-emerald-600 text-white border-emerald-500">
            <ShieldCheck className="mr-1 h-3.5 w-3.5" />
            {statusCopy.linked}
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="border-border/50 text-muted-foreground"
          >
            {statusCopy.notLinked}
          </Badge>
        );

        return (
          <section
            key={provider}
            className={cn(
              "flex flex-col gap-4 rounded-xl border p-4 md:flex-row md:items-center md:justify-between",
              linkedMeta
                ? "border-emerald-500/40 bg-emerald-500/5"
                : "border-border/50 bg-background/20",
            )}
          >
            <div className="flex flex-1 items-start gap-4">
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-white shadow-lg",
                  `bg-gradient-to-br ${gradient}`,
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
                  <h3 className="text-lg font-semibold text-foreground">
                    {name}
                  </h3>
                  {linkedBadge}
                </div>
                <p className="text-sm text-muted-foreground">{description}</p>
                {linkedMeta && (
                  <div className="grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                    {linkedMeta.linkedAt && (
                      <div>
                        <span className="font-medium text-foreground">
                          Linked:
                        </span>{" "}
                        {formatTimestamp(linkedMeta.linkedAt)}
                      </div>
                    )}
                    {linkedMeta.lastSignInAt && (
                      <div>
                        <span className="font-medium text-foreground">
                          Last sign-in:
                        </span>{" "}
                        {formatTimestamp(linkedMeta.lastSignInAt)}
                      </div>
                    )}
                    {linkedMeta.identityId && (
                      <div className="truncate" title={linkedMeta.identityId}>
                        <span className="font-medium text-foreground">
                          Identity:
                        </span>{" "}
                        {linkedMeta.identityId}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 md:self-center">
              {linkedMeta ? (
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={isUnlinking}
                  onClick={() => onUnlink(provider)}
                  type="button"
                >
                  {isUnlinking ? (
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Unlink className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span>Unlink</span>
                </Button>
              ) : (
                <Button
                  className="flex items-center gap-2 bg-aethex-500 hover:bg-aethex-600"
                  disabled={isLinking}
                  onClick={() => onLink(provider)}
                  type="button"
                >
                  {isLinking ? (
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <LinkIcon className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span>Link {name}</span>
                </Button>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
});

export default OAuthConnections;
