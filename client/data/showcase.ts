export interface ShowcaseLink {
  label: string;
  href: string;
}

export interface ShowcaseProject {
  id: string;
  title: string;
  role?: string;
  timeframe?: string;
  description?: string;
  tags?: string[];
  links?: ShowcaseLink[];
  image?: string;
}

export const SHOWCASE: ShowcaseProject[] = [];
