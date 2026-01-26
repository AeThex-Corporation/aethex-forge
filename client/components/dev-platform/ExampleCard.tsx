import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Copy, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface ExampleCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  language: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  lines: number;
}

const difficultyColors = {
  beginner: "bg-green-500/10 text-green-500 border-green-500/20",
  intermediate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  advanced: "bg-red-500/10 text-red-500 border-red-500/20",
};

export function ExampleCard({
  id,
  title,
  description,
  category,
  language,
  difficulty,
  tags,
  lines,
}: ExampleCardProps) {
  return (
    <Card className="p-5 hover:border-primary/50 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <Link to={`/dev-platform/examples/${id}`} className="flex-1">
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </h3>
        </Link>
        <Code className="w-5 h-5 text-primary shrink-0" />
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {description}
      </p>

      <div className="flex items-center gap-2 mb-3">
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
        {tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
          >
            {tag}
          </span>
        ))}
        {tags.length > 3 && (
          <span className="text-xs px-2 py-0.5 text-muted-foreground">
            +{tags.length - 3}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-xs text-muted-foreground">{lines} lines</span>
        <Link to={`/dev-platform/examples/${id}`}>
          <Button size="sm" variant="ghost">
            View Code
            <ExternalLink className="w-3 h-3 ml-2" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
