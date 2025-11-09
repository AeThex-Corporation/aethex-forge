import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Github, ExternalLink, Users } from "lucide-react";
import DocsHeroSection from "@/components/docs/DocsHeroSection";
import QuickStartSection from "@/components/docs/QuickStartSection";
import ResourceSectionsGrid from "@/components/docs/ResourceSectionsGrid";
import LearningResourcesGrid from "@/components/docs/LearningResourcesGrid";
import RecentUpdatesSection from "@/components/docs/RecentUpdatesSection";
import DocsSupportCTA from "@/components/docs/DocsSupportCTA";

export default function DocsOverview() {
  return (
    <>
      <DocsHeroSection />
      <QuickStartSection />
      <ResourceSectionsGrid />
      <LearningResourcesGrid />
      <RecentUpdatesSection />

      {/* Additional Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Github className="h-5 w-5 mr-2" />
              GitHub Repository
            </CardTitle>
            <CardDescription className="text-gray-400">
              Explore our open-source projects and contribute to the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-800"
            >
              <a
                href="https://github.com/aethex/examples"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on GitHub
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Community Support
            </CardTitle>
            <CardDescription className="text-gray-400">
              Join our community for help, discussions, and collaboration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-800"
            >
              <Link to="/community" className="inline-flex items-center">
                <ExternalLink className="h-4 w-4 mr-2" />
                Join Community
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <DocsSupportCTA />
    </>
  );
}
