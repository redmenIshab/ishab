import resumeData from "../../resumeData";

export type ProjectVM = { index: string; name: string; tag: string; url: string; action: string };
export type ExperienceVM = { role: string; company: string; period: string };
export type SkillVM = { title: string; meta: string };
export type StatVM = { value: number; suffix: string; label: string };
export type SocialVM = { label: string; url: string };

const nameParts = resumeData.name.trim().split(/\s+/);
export const NAME_FIRST = nameParts[0] ?? resumeData.name;
export const NAME_LAST = nameParts.slice(1).join(" ") || "";
export const EMAIL = resumeData.gmailId;

export const HERO_INTRO =
  "I build full-stack products and lead the teams that ship them — a decade close to the code, from POS systems to healthcare and AI platforms.";

// About lead, split so the middle phrase can be rendered in the accent colour.
export const ABOUT_LEAD_PRE = "Six years in, I still measure success like an engineer — ship, learn, iterate — but I lead people like ";
export const ABOUT_LEAD_HIGHLIGHT = "people, not processes";
export const ABOUT_LEAD_POST =
  ". From CTO of a hospitality startup to shipping healthcare and AI platforms, I care about the craft and the teams behind it.";

const PROJECT_TAGS: Record<string, string> = {
  Krane: "AI · LOGISTICS",
  Venteur: "HEALTHCARE",
  "Memora Health": "AUTOMATION",
  "Restaurant Management and POS System": "HOSPITALITY",
  "Cryptocurrency Wallet and Exchange Platform": "BLOCKCHAIN",
};

export const projects: ProjectVM[] = resumeData.portfolio.map((p, i) => ({
  index: String(i + 1).padStart(2, "0"),
  name: p.name,
  tag: PROJECT_TAGS[p.name] ?? "",
  url: p.webURL,
  action: "OPEN ↗",
}));

export const experience: ExperienceVM[] = resumeData.work.map((w) => ({
  role: w.specialization.trim(),
  company: w.CompanyName,
  period: w.YearOfLeaving ? w.YearOfLeaving.trim() : "NOW",
}));

export const skills: SkillVM[] = resumeData.skills.map((s) => {
  const [rawTitle, ...rest] = s.skillname.split(":");
  const meta = rest.join(":").trim().replace(/\s*,\s*/g, " · ");
  return { title: rawTitle.trim(), meta };
});

export const stats: StatVM[] = [
  { value: 6, suffix: "y+", label: "YEARS SHIPPING" },
  { value: 5, suffix: "", label: "PRODUCTS BUILT" },
  { value: 20, suffix: "+", label: "ENGINEERS LED" },
];

export const socials: SocialVM[] = [
  ...resumeData.socialLinks.map((s) => ({ label: s.name.toUpperCase(), url: s.url })),
  { label: "MEDIUM", url: resumeData.website.startsWith("http") ? resumeData.website : `https://${resumeData.website}` },
];
