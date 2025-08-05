import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Construction, ArrowLeft, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderProps {
  title: string;
  description: string;
}

export default function Placeholder({ title, description }: PlaceholderProps) {
  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-gradient-to-r from-aethex-500/20 to-neon-blue/20 border border-aethex-400/20">
                  <Construction className="h-12 w-12 text-aethex-400" />
                </div>
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl text-gradient">
                  {title}
                </CardTitle>
                <CardDescription className="text-lg">
                  {description}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  This page is currently under development. We're working hard
                  to bring you amazing features and content. Check back soon!
                </p>

                <div className="bg-background/30 rounded-lg p-4 border border-border/30">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>Want to help us prioritize?</strong> Let us know
                    what you'd like to see on this page by contacting our team.
                    Your feedback helps shape our development roadmap.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Link to="/">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Home</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 flex items-center space-x-2"
                >
                  <Link to="/contact">
                    <MessageCircle className="h-4 w-4" />
                    <span>Contact Us</span>
                  </Link>
                </Button>
              </div>

              <div className="text-center pt-4">
                <p className="text-xs text-muted-foreground">
                  In the meantime, explore our{" "}
                  <Link
                    to="/onboarding"
                    className="text-aethex-400 hover:underline"
                  >
                    onboarding process
                  </Link>{" "}
                  or visit our{" "}
                  <Link to="/" className="text-aethex-400 hover:underline">
                    homepage
                  </Link>{" "}
                  to learn more about AeThex.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
