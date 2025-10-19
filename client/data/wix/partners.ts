export type Partner = {
  name: string;
  tier?: string | null;
  url?: string | null;
};

export const partners: Partner[] = [
  {
    name: "Wix",
    tier: "Official Agency Partner",
    url: "https://www.wix.com/studio/community/partners/aethex",
  },
];

export default partners;
