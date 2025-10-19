import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function BannerSettings() {
  const [text, setText] = useState("ROBLOX AUTH SOON");
  const [enabled, setEnabled] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/site-settings?key=home_banner")
      .then((r) => (r.ok ? r.json() : null))
      .then((v) => {
        if (v && typeof v === "object") {
          setText(String((v as any).text || "ROBLOX AUTH SOON"));
          setEnabled((v as any).enabled !== false);
        }
      })
      .catch(() => void 0);
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const resp = await fetch("/api/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "home_banner", value: { text, enabled } }),
      });
      if (!resp.ok) throw new Error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-2 md:grid-cols-4">
        <label className="text-sm text-muted-foreground md:col-span-1">Enabled</label>
        <div className="md:col-span-3">
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>
      </div>
      <div className="grid gap-2 md:grid-cols-4">
        <label className="text-sm text-muted-foreground md:col-span-1">Banner text</label>
        <div className="md:col-span-3">
          <input
            className="w-full bg-background/50 border border-border/40 rounded px-2 py-1 text-sm"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Banner message"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button size="sm" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save banner"}
        </Button>
      </div>
    </div>
  );
}
