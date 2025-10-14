import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BellRing, Send } from "lucide-react";

const BlogNewsletterSection = () => {
  return (
    <section className="relative overflow-hidden border-t border-border/30 bg-gradient-to-b from-background/40 via-background/60 to-background/40 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.2),_transparent_65%)]" />
      <div className="relative z-10">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-4xl border-border/40 bg-background/80 shadow-xl">
            <CardContent className="space-y-8 p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-border/40 bg-background/60 text-aethex-200">
                <BellRing className="h-5 w-5" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-semibold text-white">
                  Stay in the AeThex signal
                </h2>
                <p className="mx-auto max-w-2xl text-base text-muted-foreground">
                  Subscribe for release notes, engineering write-ups, and
                  community highlights. Expect one curated update every
                  week—only the essentials.
                </p>
              </div>
              <form className="mx-auto flex w-full max-w-xl flex-col gap-4 sm:flex-row">
                <Input
                  type="email"
                  required
                  placeholder="your@email.com"
                  className="h-12 flex-1 rounded-full border-border/50 bg-background/70 px-6 text-sm"
                />
                <Button
                  type="submit"
                  className="h-12 rounded-full bg-gradient-to-r from-aethex-500 to-neon-blue"
                >
                  Subscribe
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
              <p className="text-xs text-muted-foreground">
                By subscribing you agree to receive emails from AeThex.
                Unsubscribe anytime in a single click.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BlogNewsletterSection;
