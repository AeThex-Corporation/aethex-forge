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
    role: "Founder / Lead Engineer",
    timeframe: "Jul 2025 – Present",
    description:
      "Connecting the Roblox creator community with profiles, collaborations, and opportunities. Built by the aethex.dev team.",
    tags: ["AeThex", "Community", "Roblox", "Web"],
  },
  {
    id: "aethex-exchange",
    title: "AeThex | Exchange",
    role: "Product Lead",
    timeframe: "Jul 2025 – Present",
    description: "Buy, Sell, and Trade digital goods and services within the AeThex ecosystem.",
    tags: ["AeThex", "Marketplace", "Commerce"],
  },
  {
    id: "rodeo-roundup",
    title: "Rodeo RoundUp",
    role: "Product / Engineering",
    timeframe: "Jul 2025 – Present",
    description:
      "A centralized app for discovering and tracking rodeos near you, with events, locations, and reminders.",
    tags: ["Mobile", "Events", "Maps"],
  },
  {
    id: "hells-highway",
    title: "Hell's Highway: A Wrong Turn",
    role: "Game Designer / Engineer",
    timeframe: "Apr 2025 – Present",
    description:
      "Haul cargo across a hostile wasteland while battling road pirates in high‑octane vehicular combat.",
    tags: ["Game", "Combat", "Vehicles"],
  },
  {
    id: "aethex-gameforge",
    title: "AeThex | GameForge",
    role: "Toolkit Engineer",
    timeframe: "Jan 2025 – Present",
    description: "Game development toolkit and pipeline utilities for rapid prototyping and shipping.",
    tags: ["AeThex", "Toolkit", "DevTools"],
  },
  {
    id: "lone-star-bar",
    title: "Lone Star Bar",
    role: "Game Developer",
    timeframe: "Mar 2024 – Present",
    description: "17+ social game on Roblox featuring social mechanics and immersive spaces.",
    tags: ["Roblox", "Social", "Game"],
  },
  {
    id: "crooked-are-we",
    title: "Crooked Are We",
    role: "Producer / Engineer",
    timeframe: "Nov 2022 – Present",
    description: "A narrative‑driven initiative associated with AeThex.",
    tags: ["AeThex", "Narrative", "Production"],
  },
  {
    id: "all-in-one-inspire-2025",
    title: "ALL IN ONE {INSPIRE 2025}",
    role: "Director",
    timeframe: "Aug 2025",
    description:
      "Directed a team of 4 to build and release a polished prototype game in 86 hours for INSPIRE 2025.",
    tags: ["Game Jam", "Leadership", "Prototype"],
  },
  {
    id: "the-prototypes-control",
    title: "The Prototypes Control",
    role: "Contributor",
    timeframe: "2025",
    description: "Roblox DevRel Challenge 2025 entry focused on rapid prototyping and control schemes.",
    tags: ["Roblox", "Prototype", "Challenge"],
  },
];
