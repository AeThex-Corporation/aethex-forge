export interface BlogPost {
  id?: string | number;
  slug: string;
  title: string;
  excerpt?: string | null;
  author?: string | null;
  date?: string | null;
  readTime?: string | null;
  category?: string | null;
  image?: string | null;
  likes?: number | null;
  comments?: number | null;
  trending?: boolean;
  body?: string | null;
}

export interface BlogCategory {
  id: string;
  name: string;
  count: number;
}
