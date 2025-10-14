import { Button } from "@/components/ui/button";
import type { BlogCategory } from "./types";

interface BlogCategoryChipsProps {
  categories: BlogCategory[];
  selected: string;
  onSelect: (id: string) => void;
}

const BlogCategoryChips = ({
  categories,
  selected,
  onSelect,
}: BlogCategoryChipsProps) => {
  if (!categories.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category, index) => (
        <Button
          key={category.id}
          variant={selected === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(category.id)}
          className={`rounded-full px-5 ${
            selected === category.id
              ? "bg-gradient-to-r from-aethex-500 to-neon-blue text-white shadow-lg"
              : "border-border/50 text-muted-foreground hover:text-foreground"
          }`}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          {category.name}
          <span className="ml-2 rounded-full bg-background/70 px-2 py-0.5 text-[0.65rem]">
            {category.count}
          </span>
        </Button>
      ))}
    </div>
  );
};

export default BlogCategoryChips;
