declare const resumeData: {
  name: string;
  role: string;
  gmailId: string;
  website: string;
  aboutme: string;
  roleDescription: string;
  socialLinks: { name: string; url: string; className?: string }[];
  work: {
    CompanyName: string;
    specialization: string;
    MonthOfLeaving?: string;
    YearOfLeaving?: string;
    Achievements: string;
  }[];
  skills: { skillname: string }[];
  portfolio: { name: string; description: string; webURL: string }[];
  [key: string]: unknown;
};
export default resumeData;
