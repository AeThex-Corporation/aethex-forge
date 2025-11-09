import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Rocket, Play } from "lucide-react";
import { useDocsTheme } from "@/contexts/DocsThemeContext";

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
  const { colors, theme } = useDocsTheme();
  const buttonClass =
    theme === "professional"
      ? "bg-black hover:bg-gray-900 text-white"
      : "bg-purple-600 hover:bg-purple-700";
  const outlineButtonClass =
    theme === "professional"
      ? "border-gray-300 text-black hover:bg-gray-100"
      : "border-slate-600 text-white hover:bg-slate-800";

  return (
    <div className="mb-12 text-center">
      <h2 className={`text-3xl font-bold ${colors.headingColor} mb-4`}>
        {title}
      </h2>
      <p className={`text-xl ${colors.textMuted} mb-8 max-w-3xl mx-auto`}>
        {description}
      </p>

      {showButtons && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className={buttonClass}>
            <Link to="/docs/getting-started">
              <Rocket className="h-5 w-5 mr-2" />
              Get Started
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className={outlineButtonClass}
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
