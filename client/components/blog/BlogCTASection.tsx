import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Zap, Building2, ArrowRight } from "lucide-react";

interface BlogCTAProps {
  variant?: "nexus" | "corp" | "both";
}

export const BlogCTANexus = () => {
  return (
    <Card className="border-border/40 bg-gradient-to-r from-purple-900/20 to-blue-900/20 shadow-lg">
      <CardContent className="p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-aethex-400" />
              <p className="text-xs uppercase tracking-[0.4em] text-aethex-400">
                Monetization
              </p>
            </div>
            <h3 className="text-2xl font-semibold text-white">
              Ready to launch your creative business?
            </h3>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Join NEXUS, our creator marketplace where artists, developers, and
              designers connect with opportunities. Start earning from your
              talent today with our 20% commission model and secure payment
              infrastructure.
            </p>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-aethex-500 to-neon-blue whitespace-nowrap"
          >
            <Link to="/nexus">
              Explore NEXUS
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const BlogCTACorp = () => {
  return (
    <Card className="border-border/40 bg-gradient-to-r from-orange-900/20 to-red-900/20 shadow-lg">
      <CardContent className="p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-orange-400" />
              <p className="text-xs uppercase tracking-[0.4em] text-orange-400">
                Enterprise
              </p>
            </div>
            <h3 className="text-2xl font-semibold text-white">
              Building for enterprise?
            </h3>
            <p className="max-w-2xl text-sm text-muted-foreground">
              CORP connects businesses with specialized teams for custom
              development, consulting, and enterprise solutions. Get access to
              vetted contractors and streamlined project management.
            </p>
          </div>
          <Button
            asChild
            className="whitespace-nowrap border-border/60"
            variant="outline"
          >
            <Link to="/corp">
              Learn about CORP
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const BlogCTASection = ({ variant = "both" }: BlogCTAProps) => {
  return (
    <section className="border-t border-border/30 bg-background/70 py-16">
      <div className="container mx-auto space-y-4 px-4">
        {(variant === "nexus" || variant === "both") && <BlogCTANexus />}
        {(variant === "corp" || variant === "both") && <BlogCTACorp />}
      </div>
    </section>
  );
};

export default BlogCTASection;
