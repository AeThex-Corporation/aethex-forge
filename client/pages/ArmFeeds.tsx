import { useParams } from "react-router-dom";
import ArmFeed from "@/components/feed/ArmFeed";
import { ArmType } from "@/components/feed/ArmFeed";

// Map URL paths to arm types
const ARM_MAP: Record<string, ArmType> = {
  labs: "labs",
  gameforge: "gameforge",
  corp: "corp",
  foundation: "foundation",
  devlink: "devlink",
  nexus: "nexus",
  staff: "staff",
};

export function LabsFeed() {
  return <ArmFeed arm="labs" />;
}

export function GameForgeFeed() {
  return <ArmFeed arm="gameforge" />;
}

export function CorpFeed() {
  return <ArmFeed arm="corp" />;
}

export function FoundationFeed() {
  return <ArmFeed arm="foundation" />;
}

export function DevLinkFeed() {
  return <ArmFeed arm="devlink" />;
}

export function NexusFeed() {
  return <ArmFeed arm="nexus" />;
}

export function StaffFeed() {
  return <ArmFeed arm="staff" />;
}
