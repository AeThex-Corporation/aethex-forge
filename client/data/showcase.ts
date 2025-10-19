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

export const SHOWCASE: ShowcaseProject[] = [
  {
    id: "aethex-dev-connect",
    title: "AeThex | Dev-Connect",
    role: "AeThex Studio",
    timeframe: "Jul 2025 – Present",
    description:
      "Connecting the Roblox creator community with profiles, collaboration tools, and opportunity matching — built and maintained by the AeThex Studio team.",
    tags: ["AeThex", "Community", "Roblox", "Web"],
  },
  {
    id: "aethex-exchange",
    title: "AeThex | Exchange",
    role: "AeThex Studio",
    timeframe: "Jul 2025 – Present",
    description:
      "Studio-run marketplace for buying, selling, and trading digital goods and services across the AeThex ecosystem.",
    tags: ["AeThex", "Marketplace", "Commerce"],
  },
  {
    id: "rodeo-roundup",
    title: "Rodeo RoundUp",
    role: "AeThex Studio",
    timeframe: "Jul 2025 – Present",
    description:
      "A studio-built app for discovering and tracking rodeos nearby with structured event data, maps, and alerts.",
    tags: ["Mobile", "Events", "Maps"],
  },
  {
    id: "hells-highway",
    title: "Hell's Highway: A Wrong Turn",
    role: "AeThex Studio",
    timeframe: "Apr 2025 – Present",
    description:
      "A studio IP: haul cargo across a hostile wasteland and battle road pirates in high‑octane vehicular combat.",
    tags: ["Game", "Combat", "Vehicles"],
  },
  {
    id: "aethex-gameforge",
    title: "AeThex | GameForge",
    role: "AeThex Labs",
    timeframe: "Jan 2025 – Present",
    description:
      "Our internal game development toolkit and build pipeline utilities for rapid prototyping and shipping.",
    tags: ["AeThex", "Toolkit", "DevTools"],
  },
  {
    id: "lone-star-bar",
    title: "Lone Star Bar",
    role: "AeThex Studio",
    timeframe: "Mar 2024 – Present",
    description:
      "A 17+ social game on Roblox from AeThex Studio, focusing on immersive spaces and social mechanics.",
    tags: ["Roblox", "Social", "Game"],
    links: [
      {
        label: "Roblox",
        href: "https://www.roblox.com/game-details-web-subsite/games/16734634422/Lone-Star-Bar",
      },
    ],
  },
  {
    id: "crooked-are-we",
    title: "Crooked Are We",
    role: "AeThex Studio",
    timeframe: "Nov 2022 – Present",
    description: "A narrative‑driven initiative produced by AeThex Studio.",
    tags: ["AeThex", "Narrative", "Production"],
    links: [
      { label: "Show project", href: "https://aethex.co/crooked-are-we" },
    ],
  },
  {
    id: "all-in-one-inspire-2025",
    title: "ALL IN ONE {INSPIRE 2025}",
    role: "AeThex Studio",
    timeframe: "Aug 2025",
    description:
      "Our team directed and shipped a polished prototype game in 86 hours for INSPIRE 2025.",
    tags: ["Game Jam", "Leadership", "Prototype"],
  },
  {
    id: "the-prototypes-control",
    title: "The Prototypes Control",
    role: "AeThex Studio",
    timeframe: "2025",
    description:
      "Roblox DevRel Challenge 2025 entry by AeThex Studio focused on rapid prototyping and control schemes.",
    tags: ["Roblox", "Prototype", "Challenge"],
    links: [
      {
        label: "Roblox",
        href: "https://www.roblox.com/game-details-web-subsite/games/71588594039558/The-Prototypes-Control",
      },
    ],
  },
];
