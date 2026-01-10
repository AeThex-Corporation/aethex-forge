import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbsProps {
  className?: string;
  items?: Array<{ label: string; href?: string }>;
}

export function Breadcrumbs({ className, items }: BreadcrumbsProps) {
  const location = useLocation();

  // Auto-generate breadcrumbs from URL if not provided
  const generatedItems = React.useMemo(() => {
    if (items) return items;

    const pathParts = location.pathname.split("/").filter(Boolean);
    const breadcrumbs: Array<{ label: string; href?: string }> = [
      { label: "Home", href: "/" },
    ];

    let currentPath = "";
    pathParts.forEach((part, index) => {
      currentPath += `/${part}`;
      const label = part
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      breadcrumbs.push({
        label,
        href: index < pathParts.length - 1 ? currentPath : undefined,
      });
    });

    return breadcrumbs;
  }, [items, location.pathname]);

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-1 text-sm", className)}
    >
      <ol className="flex items-center space-x-1">
        {generatedItems.map((item, index) => (
          <li key={index} className="flex items-center space-x-1">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            {item.href ? (
              <Link
                to={item.href}
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                {index === 0 && <Home className="h-4 w-4 mr-1" />}
                {item.label}
              </Link>
            ) : (
              <span className="flex items-center text-foreground font-medium">
                {index === 0 && <Home className="h-4 w-4 mr-1" />}
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
