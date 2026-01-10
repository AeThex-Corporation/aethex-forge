import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Copy, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateKey: (data: {
    name: string;
    scopes: string[];
    expiresInDays?: number;
  }) => Promise<{ full_key?: string; error?: string }>;
}

export function CreateApiKeyDialog({
  open,
  onOpenChange,
  onCreateKey,
}: CreateApiKeyDialogProps) {
  const [name, setName] = useState("");
  const [scopes, setScopes] = useState<string[]>(["read"]);
  const [expiresInDays, setExpiresInDays] = useState<number | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter a name for your API key");
      return;
    }

    if (scopes.length === 0) {
      setError("Please select at least one scope");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await onCreateKey({
        name: name.trim(),
        scopes,
        expiresInDays,
      });

      if (result.error) {
        setError(result.error);
      } else if (result.full_key) {
        setCreatedKey(result.full_key);
      }
    } catch (err) {
      setError("Failed to create API key. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName("");
    setScopes(["read"]);
    setExpiresInDays(undefined);
    setError("");
    setCreatedKey(null);
    setCopied(false);
    onOpenChange(false);
  };

  const copyToClipboard = () => {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleScope = (scope: string) => {
    setScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {!createdKey ? (
          <>
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Generate a new API key to access the AeThex platform programmatically.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input */}
              <div className="space-y-2">
                <Label htmlFor="key-name">Key Name</Label>
                <Input
                  id="key-name"
                  placeholder="My Production Key"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  A friendly name to help you identify this key
                </p>
              </div>

              {/* Scopes */}
              <div className="space-y-3">
                <Label>Permissions</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="scope-read"
                      checked={scopes.includes("read")}
                      onCheckedChange={() => toggleScope("read")}
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor="scope-read"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Read
                      <span className="text-xs text-muted-foreground ml-2">
                        (View data)
                      </span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="scope-write"
                      checked={scopes.includes("write")}
                      onCheckedChange={() => toggleScope("write")}
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor="scope-write"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Write
                      <span className="text-xs text-muted-foreground ml-2">
                        (Create & modify data)
                      </span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="scope-admin"
                      checked={scopes.includes("admin")}
                      onCheckedChange={() => toggleScope("admin")}
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor="scope-admin"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Admin
                      <span className="text-xs text-muted-foreground ml-2">
                        (Full access)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Expiration */}
              <div className="space-y-2">
                <Label htmlFor="expiration">Expiration (Optional)</Label>
                <Select
                  value={expiresInDays?.toString() || "never"}
                  onValueChange={(value) =>
                    setExpiresInDays(value === "never" ? undefined : parseInt(value))
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="expiration">
                    <SelectValue placeholder="Never expires" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never expires</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Key"}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>API Key Created Successfully</DialogTitle>
              <DialogDescription>
                Make sure to copy your API key now. You won't be able to see it again!
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Success Message */}
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-500">
                      Your API key has been created
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Copy it now and store it securely. For security reasons, we can't
                      show it again.
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Display */}
              <div className="space-y-2">
                <Label>Your API Key</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-3 rounded-lg bg-muted font-mono text-sm break-all">
                    {createdKey}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                    className={cn(
                      "shrink-0",
                      copied && "bg-green-500/10 border-green-500/30"
                    )}
                  >
                    {copied ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                <div className="text-xs text-yellow-600 dark:text-yellow-500">
                  <p className="font-medium">Important Security Notice</p>
                  <ul className="mt-1 space-y-1 list-disc list-inside">
                    <li>Never commit this key to version control</li>
                    <li>Store it securely (e.g., environment variables)</li>
                    <li>Regenerate the key if you suspect it's compromised</li>
                  </ul>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleClose} className="w-full">
                {copied ? "Done - Key Copied!" : "I've Saved My Key"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
