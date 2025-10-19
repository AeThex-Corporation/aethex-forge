import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type RoadmapTheme = "space" | "fantasy" | "city" | "adventure";

const key = "aethex_roadmap_theme_v1";

export default function ThemeToggle({
  value,
  onChange,
}: {
  value?: RoadmapTheme;
  onChange?: (v: RoadmapTheme) => void;
}) {
  const [theme, setTheme] = useState<RoadmapTheme>(value || "space");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const saved = JSON.parse(raw) as RoadmapTheme;
        setTheme(saved);
        onChange?.(saved);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (v: RoadmapTheme) => {
    setTheme(v);
    onChange?.(v);
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {}
  };

  return (
    <Tabs
      value={theme}
      onValueChange={(v) => set(v as RoadmapTheme)}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="space">Space</TabsTrigger>
        <TabsTrigger value="fantasy">Fantasy</TabsTrigger>
        <TabsTrigger value="city">City</TabsTrigger>
        <TabsTrigger value="adventure">Adventure</TabsTrigger>
      </TabsList>
      <TabsContent value="space" />
      <TabsContent value="fantasy" />
      <TabsContent value="city" />
      <TabsContent value="adventure" />
    </Tabs>
  );
}
