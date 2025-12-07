import { useState, useEffect } from "react";
import { Shield, Mail, Wrench, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import AeThexOSLogo from "@/components/AeThexOSLogo";

export default function MaintenancePage() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [dots, setDots] = useState("");

  const messages = [
    "Upgrading quantum processors...",
    "Optimizing neural networks...",
    "Synchronizing data streams...",
    "Calibrating system modules...",
    "Enhancing user experience...",
  ];

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 2500);

    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);

    return () => {
      clearInterval(messageInterval);
      clearInterval(dotsInterval);
    };
  }, [messages.length]);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-blue-400 animate-float font-mono"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
              fontSize: `${10 + Math.random() * 6}px`,
            }}
          >
            {["01", "10", "//", "{ }", "< >", "=>"][Math.floor(Math.random() * 6)]}
          </div>
        ))}
      </div>

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-xl w-full text-center space-y-8">
          <div className="space-y-6">
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-20 blur-xl rounded-full animate-pulse" />
              <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/40 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/10">
                <AeThexOSLogo size="lg" variant="default" animate />
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                System Maintenance
              </h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                We're upgrading AeThex to deliver a better experience.
              </p>
            </div>

            <div className="flex justify-center gap-3 flex-wrap">
              <Badge variant="outline" className="border-blue-500/50 text-blue-400 animate-pulse">
                <Wrench className="h-3 w-3 mr-1" />
                Maintenance Mode
              </Badge>
              <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                <Clock className="h-3 w-3 mr-1" />
                Back Soon
              </Badge>
            </div>
          </div>

          <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-full animate-pulse"
                      style={{
                        height: `${12 + i * 4}px`,
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground font-mono">
                  {messages[currentMessage]}{dots}
                </span>
              </div>

              <div className="h-px bg-border" />

              <div className="grid grid-cols-3 gap-4 text-center text-xs">
                <div className="space-y-1">
                  <div className="text-muted-foreground">STATUS</div>
                  <div className="text-blue-400 font-semibold flex items-center justify-center gap-1">
                    <Zap className="h-3 w-3" />
                    ACTIVE
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">SYSTEM</div>
                  <div className="text-foreground font-semibold">AeThex v2.0</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">ETA</div>
                  <div className="text-cyan-400 font-semibold">~30 min</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/30 border-border/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-muted-foreground">Questions?</span>
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a 
                  href="mailto:support@aethex.dev" 
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  support@aethex.dev
                </a>
              </div>
            </CardContent>
          </Card>

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground hover:text-foreground hover:bg-blue-500/10"
          >
            <a href="/login">Staff Login</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
