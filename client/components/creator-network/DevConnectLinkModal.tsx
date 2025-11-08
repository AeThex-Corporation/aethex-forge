import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { linkDevConnectAccount } from "@/api/devconnect-links";
import { useAethexToast } from "@/hooks/use-aethex-toast";

export interface DevConnectLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DevConnectLinkModal({
  open,
  onOpenChange,
  onSuccess,
}: DevConnectLinkModalProps) {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useAethexToast();

  const handleLink = async () => {
    if (!username.trim()) {
      toast("Please enter your DevConnect username", "error");
      return;
    }

    setIsLoading(true);
    try {
      await linkDevConnectAccount({
        devconnect_username: username.trim(),
        devconnect_profile_url: `https://devconnect.sbs/${username.trim()}`,
      });
      toast("DevConnect account linked successfully!", "success");
      setUsername("");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Failed to link DevConnect account",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Link Your DevConnect Account</AlertDialogTitle>
          <AlertDialogDescription>
            Enter your DevConnect username to link your profile. This allows you
            to showcase your presence on both platforms.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">DevConnect Username</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">devconnect.sbs/</span>
              <Input
                placeholder="your-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500">
              Your username will be used to create a link to your DevConnect
              profile
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <Button
            onClick={handleLink}
            disabled={isLoading || !username.trim()}
            className="gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Link Account
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
