import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function WixHero() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <Card className="border-border/40 bg-card/60 backdrop-blur">
        <CardContent className="p-6 md:p-10">
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-aethex-400/50 text-aethex-300"
              >
                Official Wix Agency Partner
              </Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Wix & Wix Studio Sites — designed, built, and scaled by AeThex
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-3xl">
              We ship fast, accessible, and SEO-ready sites using Wix Studio.
              From launch microsites to full eCommerce, your team gets a site
              you can actually edit.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="#start">Start a project</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/wix/case-studies">View case studies</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/wix/faq">FAQ</Link>
              </Button>
              <Button asChild variant="outline">
                <a
                  href="https://www.wix.com/studio/community/partners/aethex"
                  target="_blank"
                  rel="noreferrer"
                >
                  Wix Partner Profile
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
