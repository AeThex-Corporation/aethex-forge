import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Info,
  Loader2,
  Sparkles,
  XCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  aethexNotificationService,
  aethexRealtimeService,
} from "@/lib/aethex-database-adapter";
import { aethexToast } from "@/lib/aethex-toast";

interface AethexNotification {
  id: string;
  title: string;
  message: string | null;
  type: string | null;
  created_at: string;
  read: boolean | null;
}

const typeIconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
  default: Sparkles,
};

const typeAccentMap: Record<string, string> = {
  success: "text-emerald-300",
  warning: "text-amber-300",
  error: "text-rose-300",
  info: "text-sky-300",
  default: "text-aethex-300",
};

export default function NotificationBell({
  className,
}: {
  className?: string;
}) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AethexNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setNotifications([]);
      return;
    }

    let isActive = true;
    setLoading(true);

    aethexNotificationService
      .getUserNotifications(user.id)
      .then((data) => {
        if (!isActive) return;
        console.debug(
          "[Notifications] Loaded",
          Array.isArray(data) ? data.length : 0,
          "notifications",
        );
        setNotifications(
          Array.isArray(data) ? (data as AethexNotification[]) : [],
        );
      })
      .catch((err) => {
        if (!isActive) return;
        console.warn("[Notifications] Failed to load:", err);
        setNotifications([]);
      })
      .finally(() => {
        if (!isActive) return;
        setLoading(false);
      });

    const subscription = aethexRealtimeService.subscribeToUserNotifications(
      user.id,
      (payload: any) => {
        if (!isActive) return;
        const next = (payload?.new ?? payload) as
          | AethexNotification
          | undefined;
        if (!next?.id) return;

        setNotifications((prev) => {
          // Check if notification already exists
          const exists = prev.some((item) => item.id === next.id);
          if (exists) return prev;

          // Add new notification to the top and keep up to 50 in the list
          return [next, ...prev].slice(0, 50);
        });

        aethexToast.aethex({
          title: next.title || "New notification",
          description: next.message ?? undefined,
        });
      },
    );

    return () => {
      isActive = false;
      subscription?.unsubscribe?.();
    };
  }, [user?.id]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  );

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
    try {
      await aethexNotificationService.markAsRead(id);
    } catch {
      // Non-blocking; keep optimistic state.
    }
  };

  const markAllAsRead = async () => {
    if (!notifications.length) return;
    setMarkingAll(true);
    const ids = notifications.filter((n) => !n.read).map((n) => n.id);
    if (!ids.length) {
      setMarkingAll(false);
      return;
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await Promise.all(
        ids.map((id) => aethexNotificationService.markAsRead(id)),
      );
    } catch {
      // Soft fail silently
    } finally {
      setMarkingAll(false);
    }
  };

  const renderNotification = (notification: AethexNotification) => {
    const typeKey = notification.type?.toLowerCase() ?? "default";
    const Icon = typeIconMap[typeKey] ?? typeIconMap.default;
    const accent = typeAccentMap[typeKey] ?? typeAccentMap.default;

    return (
      <DropdownMenuItem
        key={notification.id}
        onSelect={(event) => {
          event.preventDefault();
          void markAsRead(notification.id);
        }}
        className="focus:bg-background/80"
      >
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-border/40 bg-background/80",
              accent,
            )}
          >
            <Icon className="h-4 w-4" />
          </span>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">
                {notification.title}
              </p>
              {!notification.read && (
                <Badge className="border-emerald-400/40 bg-emerald-500/10 text-[10px] uppercase tracking-wide text-emerald-200">
                  New
                </Badge>
              )}
            </div>
            {notification.message ? (
              <p className="text-xs text-muted-foreground leading-relaxed">
                {notification.message}
              </p>
            ) : null}
            <p className="text-[11px] text-muted-foreground/80">
              {formatDistanceToNow(new Date(notification.created_at), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      </DropdownMenuItem>
    );
  };

  if (!user?.id) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative inline-block">
          <Button
            variant="ghost"
            size="sm"
            className={cn("hover-lift", className)}
          >
            <Bell className="h-4 w-4" />
          </Button>
          {unreadCount > 0 ? (
            <span className="absolute -right-2 -top-2 z-50 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-aethex-500 px-1.5 text-[11px] font-bold text-white shadow-lg border-2 border-background">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 border-border/40 bg-background/95 backdrop-blur"
      >
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">
            Notifications
          </span>
          {unreadCount > 0 ? (
            <span className="text-xs text-muted-foreground">
              {unreadCount} unread
            </span>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 pb-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full border-border/40"
            onClick={markAllAsRead}
            disabled={markingAll || unreadCount === 0}
          >
            {markingAll ? (
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            ) : null}
            Mark all as read
          </Button>
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="max-h-80">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading
              notifications…
            </div>
          ) : notifications.length ? (
            <div className="py-1 space-y-1">
              {notifications.map((notification) =>
                renderNotification(notification),
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No notifications yet. You'll see activity updates here.
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
