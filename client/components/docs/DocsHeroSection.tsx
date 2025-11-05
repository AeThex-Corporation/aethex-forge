import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Rocket, Play } from "lucide-react";

interface DocsHeroSectionProps {
  title?: string;
  description?: string;
  showButtons?: boolean;
}

export default function DocsHeroSection({
  title = "Welcome to AeThex Documentation",
  description = "Everything you need to build, deploy, and scale amazing projects with AeThex. Get started with our guides, explore our APIs, and learn from comprehensive tutorials.",
  showButtons = true,
}: DocsHeroSectionProps) {
  return (
    <div className="mb-12 text-center">
      <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
      <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
        {description}
      </p>

      {showButtons && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Link to="/docs/getting-started">
              <Rocket className="h-5 w-5 mr-2" />
              Get Started
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-slate-600 text-white hover:bg-slate-800"
          >
            <Link to="/docs/tutorials">
              <Play className="h-5 w-5 mr-2" />
              Watch Tutorials
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
