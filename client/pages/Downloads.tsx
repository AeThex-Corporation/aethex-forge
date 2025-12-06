import { useState } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, Apple, Terminal, Smartphone, Clock, CheckCircle2, Download, ExternalLink } from "lucide-react";

const CURRENT_VERSION = "0.1.0";
const RELEASE_DATE = "December 2024";

interface PlatformDownload {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  fileName: string;
  fileSize: string;
  available: boolean;
  requirements: string[];
}

const platforms: PlatformDownload[] = [
  {
    id: "windows",
    name: "Windows",
    icon: <Monitor className="h-8 w-8" />,
    description: "Windows 10 or later (64-bit)",
    fileName: `AeThex-Desktop-Terminal-${CURRENT_VERSION}-win-x64.exe`,
    fileSize: "~120 MB",
    available: true,
    requirements: ["Windows 10 or later", "64-bit processor", "4 GB RAM minimum"],
  },
  {
    id: "macos",
    name: "macOS",
    icon: <Apple className="h-8 w-8" />,
    description: "macOS 10.15 (Catalina) or later",
    fileName: `AeThex-Desktop-Terminal-${CURRENT_VERSION}-mac-universal.dmg`,
    fileSize: "~130 MB",
    available: true,
    requirements: ["macOS 10.15 or later", "Apple Silicon or Intel", "4 GB RAM minimum"],
  },
  {
    id: "linux",
    name: "Linux",
    icon: <Terminal className="h-8 w-8" />,
    description: "Ubuntu 20.04+, Debian 10+, Fedora 32+",
    fileName: `AeThex-Desktop-Terminal-${CURRENT_VERSION}-x64.AppImage`,
    fileSize: "~115 MB",
    available: true,
    requirements: ["64-bit Linux distribution", "GTK 3.0+", "4 GB RAM minimum"],
  },
];

const features = [
  "File watcher overlay for real-time project monitoring",
  "Quick access to all AeThex realms from your desktop",
  "Discord integration with status sync",
  "Offline mode for viewing cached content",
  "Native notifications for opportunities and messages",
  "Secure local credential storage",
];

export default function Downloads() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const handleDownload = (platform: PlatformDownload) => {
    setSelectedPlatform(platform.id);
    const releaseUrl = `https://github.com/aethex/aethex-forge/releases/latest`;
    window.open(releaseUrl, "_blank");
  };

  return (
    <Layout>
      <SEO
        pageTitle="Downloads | AeThex"
        description="Download the AeThex Desktop Terminal for Windows, macOS, and Linux. Access all AeThex features from your desktop."
      />

      <div className="min-h-screen bg-aethex-gradient py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-purple-500/50 text-purple-400">
              Version {CURRENT_VERSION}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Download AeThex Desktop
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The AeThex Desktop Terminal brings the full power of the platform to your computer. 
              Access realms, manage projects, and stay connected with your community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {platforms.map((platform) => (
              <Card
                key={platform.id}
                className={`bg-card/50 backdrop-blur-sm border transition-all duration-300 hover:border-purple-500/50 ${
                  selectedPlatform === platform.id ? "border-purple-500 ring-2 ring-purple-500/20" : "border-border/50"
                }`}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 text-purple-400">
                    {platform.icon}
                  </div>
                  <CardTitle className="text-xl">{platform.name}</CardTitle>
                  <CardDescription>{platform.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p className="font-mono text-xs truncate">{platform.fileName}</p>
                    <p>Size: {platform.fileSize}</p>
                  </div>

                  {platform.available ? (
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      onClick={() => handleDownload(platform)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download for {platform.name}
                    </Button>
                  ) : (
                    <Button className="w-full" variant="secondary" disabled>
                      <Clock className="h-4 w-4 mr-2" />
                      Coming Soon
                    </Button>
                  )}

                  <div className="pt-4 border-t border-border/30">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Requirements:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {platform.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500 shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-card/50 backdrop-blur-sm border border-border/50 mb-12">
            <CardHeader>
              <CardTitle>Desktop Features</CardTitle>
              <CardDescription>Everything you need to be productive on your desktop</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/20 border border-purple-500/20 mb-12">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 rounded-full bg-purple-500/10 border border-purple-500/20">
                <Smartphone className="h-8 w-8 text-purple-400" />
              </div>
              <CardTitle>Mobile Apps</CardTitle>
              <CardDescription>iOS and Android apps are coming soon</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Stay connected on the go. Our mobile apps will bring notifications, messaging, 
                and quick actions to your pocket.
              </p>
              <div className="flex justify-center gap-4">
                <Badge variant="outline" className="border-slate-600">
                  <Apple className="h-3 w-3 mr-1" />
                  iOS - Coming Q2 2025
                </Badge>
                <Badge variant="outline" className="border-slate-600">
                  <Smartphone className="h-3 w-3 mr-1" />
                  Android - Coming Q2 2025
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Released {RELEASE_DATE} • <a href="/changelog" className="text-purple-400 hover:underline">View changelog</a>
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://github.com/aethex/aethex-forge/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                All releases
              </a>
              <a
                href="/roadmap"
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                View roadmap
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
