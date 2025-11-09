import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Users } from "lucide-react";
import { useDocsTheme } from "@/contexts/DocsThemeContext";

interface DocsSupportCTAProps {
  title?: string;
  description?: string;
}

export default function DocsSupportCTA({
  title = "Need help getting started?",
  description = "Our documentation team updates these guides weekly. If you're looking for tailored onboarding, architecture reviews, or migration support, reach out and we'll connect you with the right experts.",
}: DocsSupportCTAProps) {
  const { colors, theme } = useDocsTheme();
  const ctaBg =
    theme === "professional"
      ? "border-gray-300 bg-gray-100"
      : "border-purple-500/40 bg-purple-900/20";
  const primaryButtonClass =
    theme === "professional"
      ? "bg-black hover:bg-gray-900 text-white"
      : "bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90";
  const secondaryButtonClass =
    theme === "professional"
      ? "border-gray-300 text-black hover:bg-gray-50"
      : "border-purple-400/60 text-purple-200";

  return (
    <div className={`mt-12 rounded-2xl border ${ctaBg} p-8 text-center`}>
      <h3 className={`text-3xl font-semibold ${colors.headingColor} mb-4`}>
        {title}
      </h3>
      <p className={`${colors.textMuted} max-w-3xl mx-auto mb-6`}>
        {description}
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button asChild size="lg" className={primaryButtonClass}>
          <Link to="/support" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Contact support
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className={secondaryButtonClass}
        >
          <Link to="/community" className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Join the community
          </Link>
        </Button>
      </div>
    </div>
  );
}
