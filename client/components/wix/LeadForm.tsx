import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export default function LeadForm() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    website: "",
    budget: "",
    timeline: "",
    message: "",
    source: "wix",
  });

  const inferred = useMemo(() => {
    const full = (profile?.full_name || "").trim();
    const email = (user?.email || profile?.email || "").trim();
    return { full, email };
  }, [user, profile]);

  useEffect(() => {
    setForm((f) => ({
      ...f,
      name: f.name || inferred.full,
      email: f.email || inferred.email,
    }));
  }, [inferred.full, inferred.email]);

  const update = (k: keyof typeof form) => (e: any) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    if (!form.email) {
      toast({
        title: "Email required",
        description: "Please provide a valid email.",
      });
      return;
    }
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/api/leads`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const ok = r.ok;
      const data = await r.json().catch(() => ({}));
      if (!ok) throw new Error(data?.error || `Request failed (${r.status})`);
      toast({
        title: "Thanks!",
        description: "We’ll follow up shortly with next steps.",
      });
      setForm({ ...form, message: "" });
    } catch (e: any) {
      toast({
        title: "Submission failed",
        description: e?.message || "Try again later.",
        variant: "destructive" as any,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="start" className="container mx-auto px-4 py-12">
      <Card className="border-border/40 bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle>Start a Wix project</CardTitle>
          <CardDescription>
            Tell us a bit about your goals. We’ll get back within 1 business
            day.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={update("name")}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={form.email}
              onChange={update("email")}
              placeholder="you@company.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={form.company}
              onChange={update("company")}
              placeholder="Company Inc."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={form.website}
              onChange={update("website")}
              placeholder="https://example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget">Budget</Label>
            <Input
              id="budget"
              value={form.budget}
              onChange={update("budget")}
              placeholder="e.g. $5k–$10k"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeline">Timeline</Label>
            <Input
              id="timeline"
              value={form.timeline}
              onChange={update("timeline")}
              placeholder="e.g. 4–6 weeks"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="message">Project overview</Label>
            <Textarea
              id="message"
              value={form.message}
              onChange={update("message")}
              placeholder="What are you building? Who is it for? What does success look like?"
            />
          </div>
          <div className="md:col-span-2">
            <Button
              onClick={submit}
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? "Submitting…" : "Submit"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
