export interface ShowcaseLink {
  label: string;
  href: string;
}

export interface ShowcaseContributor {
  name: string;
  title?: string;
  avatar?: string;
}

export interface ShowcaseProject {
  id: string;
  title: string;
  role?: string;
  orgUnit?: "Studio" | "Labs" | "Platform" | "Community";
  timeframe?: string;
  description?: string;
  tags?: string[];
  links?: ShowcaseLink[];
  contributors?: ShowcaseContributor[];
  image?: string;
}

export const SHOWCASE: ShowcaseProject[] = [
  {
    id: "aethex-dev-connect",
    title: "AeThex | Dev-Connect",
    role: "AeThex",
    orgUnit: "Platform",
    timeframe: "Jul 2025 – Present",
    description:
      "Connecting the Roblox creator community with profiles, collaboration tools, and opportunity matching. Operated by AeThex Platform.",
    tags: ["Platform", "Community", "Roblox", "Web"],
    contributors: [
      { name: "AeThex Platform Team", avatar: "/placeholder.svg" },
    ],
  },
  {
    id: "aethex-exchange",
    title: "AeThex | Exchange",
    role: "AeThex",
    orgUnit: "Platform",
    timeframe: "Jul 2025 – Present",
    description:
      "Marketplace for buying, selling, and trading digital goods and services across the AeThex ecosystem.",
    tags: ["Platform", "Marketplace", "Commerce"],
    contributors: [{ name: "AeThex Commerce", avatar: "/placeholder.svg" }],
  },
  {
    id: "rodeo-roundup",
    title: "Rodeo RoundUp",
    role: "AeThex",
    orgUnit: "Studio",
    timeframe: "Jul 2025 – Present",
    description:
      "App for discovering and tracking rodeos nearby with structured event data, maps, and alerts.",
    tags: ["Studio", "Mobile", "Events", "Maps"],
    contributors: [{ name: "Studio Build Team", avatar: "/placeholder.svg" }],
  },
  {
    id: "hells-highway",
    title: "Hell's Highway: A Wrong Turn",
    role: "AeThex",
    orgUnit: "Studio",
    timeframe: "Apr 2025 – Present",
    description:
      "Studio IP: haul cargo across a hostile wasteland and battle road pirates in high‑octane vehicular combat.",
    tags: ["Studio", "Game", "Combat", "Vehicles"],
    contributors: [
      { name: "Design Guild", avatar: "/placeholder.svg" },
      { name: "Engineering", avatar: "/placeholder.svg" },
    ],
  },
  {
    id: "aethex-gameforge",
    title: "AeThex | GameForge",
    role: "AeThex",
    orgUnit: "Labs",
    timeframe: "Jan 2025 – Present",
    description:
      "Internal game development toolkit and build pipeline utilities for rapid prototyping and shipping.",
    tags: ["Labs", "Toolkit", "DevTools"],
    contributors: [{ name: "Labs Automation", avatar: "/placeholder.svg" }],
  },
  {
    id: "lone-star-bar",
    title: "Lone Star Bar",
    role: "AeThex",
    orgUnit: "Studio",
    timeframe: "Mar 2024 – Present",
    description:
      "17+ social game on Roblox focusing on immersive spaces and social mechanics.",
    tags: ["Studio", "Roblox", "Social", "Game"],
    contributors: [{ name: "Social Experiences", avatar: "/placeholder.svg" }],
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
    role: "AeThex",
    orgUnit: "Studio",
    timeframe: "Nov 2022 – Present",
    description: "Narrative‑driven initiative produced by AeThex Studio.",
    tags: ["Studio", "Narrative", "Production"],
    contributors: [{ name: "Story Group", avatar: "/placeholder.svg" }],
    links: [
      { label: "Show project", href: "https://aethex.co/crooked-are-we" },
    ],
  },
  {
    id: "all-in-one-inspire-2025",
    title: "ALL IN ONE {INSPIRE 2025}",
    role: "AeThex",
    orgUnit: "Studio",
    timeframe: "Aug 2025",
    description:
      "Studio directed and shipped a polished prototype game in 86 hours for INSPIRE 2025.",
    tags: ["Studio", "Game Jam", "Leadership", "Prototype"],
    contributors: [{ name: "Strike Team", avatar: "/placeholder.svg" }],
  },
  {
    id: "the-prototypes-control",
    title: "The Prototypes Control",
    role: "AeThex",
    orgUnit: "Studio",
    timeframe: "2025",
    description:
      "Roblox DevRel Challenge 2025 entry focused on rapid prototyping and control schemes.",
    tags: ["Studio", "Roblox", "Prototype", "Challenge"],
    contributors: [{ name: "Prototype Unit", avatar: "/placeholder.svg" }],
    links: [
      {
        label: "Roblox",
        href: "https://www.roblox.com/game-details-web-subsite/games/71588594039558/The-Prototypes-Control",
      },
    ],
  },
];
