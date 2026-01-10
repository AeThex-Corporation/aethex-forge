import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Star, GitFork } from "lucide-react";
import { Link } from "react-router-dom";

interface TemplateCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  language: string;
  stars?: number;
  downloads?: number;
  author: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
}

const difficultyColors = {
  beginner: "bg-green-500/10 text-green-500 border-green-500/20",
  intermediate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  advanced: "bg-red-500/10 text-red-500 border-red-500/20",
};

export function TemplateCard({
  id,
  name,
  description,
  category,
  language,
  stars = 0,
  downloads = 0,
  author,
  difficulty,
  tags,
  githubUrl,
  demoUrl,
}: TemplateCardProps) {
  return (
    <Card className="p-6 hover:border-primary/50 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Link to={`/dev-platform/templates/${id}`}>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
              {name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Badge variant="outline" className="text-xs">
          {category}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {language}
        </Badge>
        <Badge variant="outline" className={`text-xs ${difficultyColors[difficulty]}`}>
          {difficulty}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
          >
            {tag}
          </span>
        ))}
        {tags.length > 4 && (
          <span className="text-xs px-2 py-0.5 text-muted-foreground">
            +{tags.length - 4} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            {stars}
          </span>
          <span className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            {downloads}
          </span>
          <span className="text-xs">by {author}</span>
        </div>

        <div className="flex items-center gap-2">
          {demoUrl && (
            <Button variant="ghost" size="sm" asChild>
              <a href={demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          )}
          {githubUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                <GitFork className="w-4 h-4 mr-2" />
                Clone
              </a>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
