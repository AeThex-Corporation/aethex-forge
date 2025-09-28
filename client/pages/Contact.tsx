import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { aethexToast } from "@/lib/aethex-toast";
import { Mail, Phone, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      aethexToast.error({
        title: "Missing info",
        description: "Please fill out all fields.",
      });
      return;
    }
    setIsSending(true);
    try {
      // In production, send to your backend or a function endpoint
      aethexToast.success({
        title: "Message sent",
        description: "We’ll get back to you within 1–2 business days.",
      });
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      aethexToast.error({
        title: "Failed to send",
        description: err?.message || "Try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-12">
        <div className="container mx-auto px-4 max-w-5xl space-y-10">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-gradient-purple">
                Contact Us
              </h1>
              <p className="text-muted-foreground">
                Have a project or question? We typically respond within 1–2
                business days.
              </p>
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4" /> support@aethex.biz
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4" /> (530) 784-1287
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare className="h-4 w-4" /> Community hub
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Send a message</CardTitle>
                <CardDescription>
                  Tell us about your goals and timeline.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={submit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="What can we help you build?"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isSending}
                      className="hover-lift"
                    >
                      {isSending ? "Sending..." : "Send"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
