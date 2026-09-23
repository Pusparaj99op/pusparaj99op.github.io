import { Icons } from "@/components/tree/icons";
import { HomeIcon } from "lucide-react";
import { ReactLight } from "@/components/tree/ui/svgs/reactLight";
import { NextjsIconDark } from "@/components/tree/ui/svgs/nextjsIconDark";
import { Typescript } from "@/components/tree/ui/svgs/typescript";
import { Nodejs } from "@/components/tree/ui/svgs/nodejs";
import { Python } from "@/components/tree/ui/svgs/python";
import { Postgresql } from "@/components/tree/ui/svgs/postgresql";
import { Docker } from "@/components/tree/ui/svgs/docker";
import { projects, getProjectCover } from "@/data/projects";

type SkillIcon = typeof ReactLight;

const SKILLS: { name: string; icon?: SkillIcon }[] = [
  { name: "React", icon: ReactLight },
  { name: "Next.js", icon: NextjsIconDark },
  { name: "TypeScript", icon: Typescript },
  { name: "Node.js", icon: Nodejs },
  { name: "Python", icon: Python },
  { name: "PostgreSQL", icon: Postgresql },
  { name: "Docker", icon: Docker },
  { name: "MongoDB" },
  { name: "Redis" },
  { name: "Prisma" },
  { name: "GSAP" },
  { name: "Three.js" },
  { name: "Framer Motion" },
  { name: "Tailwind CSS" },
  { name: "Figma" },
  { name: "Dhan API" },
  { name: "Binance API" },
  { name: "MetaTrader 5" },
];

export const DATA = {
  name: "Pranay Krupakar Gajbhiye",
  initials: "PG",
  url: "https://pranaygajbhiye.me",
  location: "Nagpur, India",
  locationLink: "https://www.google.com/maps/place/Nagpur",
  description:
    "Full Stack Developer & Quantitative Trader. Founder of BlackObsidian (AMC) and Zorvain Street.",
  summary:
    "I build algorithmic trading systems, premium digital products, and scalable web experiences. I founded [Zorvain Street](https://zorvainsteet-com.vercel.app/), an algorithmic trading company building autonomous systems for Nifty 50, XAUUSD, and crypto derivatives, and BlackObsidian, an asset management company focused on systematic portfolio strategies. I'm pursuing a [B.Tech in Computer Science](#education), I'm NISM Series 8 certified, and I secured AIR 7616 in JEE Advanced 2024.",
  avatarUrl: "/tree/pranay.webp",
  skills: SKILLS,
  navbar: [{ href: "/", icon: HomeIcon, label: "Main site" }],
  contact: {
    email: "pranaygajbhiyeofficial@gmail.com",
    tel: "",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/Pusparaj99op",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/pranaygajbhiye/",
        icon: Icons.linkedin,
        navbar: true,
      },
      X: {
        name: "X",
        url: "https://x.com/pranaygajbhiye",
        icon: Icons.x,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:pranaygajbhiyeofficial@gmail.com",
        icon: Icons.email,
        navbar: true,
      },
    },
  },

  work: [
    {
      company: "Zorvain Street",
      href: "https://zorvainsteet-com.vercel.app/",
      badges: [],
      location: "Nagpur, India",
      title: "Founder",
      logoUrl: "/tree/logos/zorvainstreet.png",
      start: "2024",
      end: "Present",
      description:
        "Founded an algorithmic trading company building autonomous systems for Nifty 50, XAUUSD, and crypto derivatives.",
    },
    {
      company: "BlackObsidian (AMC)",
      href: "",
      badges: [],
      location: "Nagpur, India",
      title: "Founder",
      logoUrl: "/tree/logos/blackobsidian.svg",
      start: "2024",
      end: "Present",
      description:
        "Established an asset management company focused on systematic portfolio strategies and quantitative investing.",
    },
    {
      company: "Devnovate",
      href: "",
      badges: [],
      location: "UAE (Remote)",
      title: "International UAE Team Manager",
      logoUrl: "/tree/logos/devnovate.png",
      start: "2024",
      end: "Present",
      description:
        "Led the UAE international team for Devnovate, coordinating cross-border hackathon and innovation initiatives.",
    },
  ],
  education: [
    {
      school: "B.Tech Computer Science Engineering",
      href: "#education",
      degree: "Algorithms, systems design, and quantitative computing",
      logoUrl: "",
      start: "2024",
      end: "Present",
    },
  ],
  projects: projects.map((project) => ({
    title: project.title,
    href: `/projects/${project.slug}/`,
    dates: project.year,
    active: true,
    description: project.description,
    technologies: project.stack,
    links: [
      {
        type: "Source",
        href: project.github,
        icon: <Icons.github className="size-3" />,
      },
      ...(project.live
        ? [
            {
              type: "Website",
              href: project.live,
              icon: <Icons.globe className="size-3" />,
            },
          ]
        : []),
    ],
    image: getProjectCover(project),
    video: "",
  })),
  hackathons: [
    {
      title: "AIR 7616 — JEE Advanced 2024",
      dates: "2024",
      location: "India",
      description:
        "Ranked All India Rank 7616 in JEE Advanced 2024, one of India's most competitive engineering entrance exams.",
      image: "/tree/milestones/jee.svg",
      links: [],
    },
    {
      title: "NISM Series 8 Certified",
      dates: "2024",
      location: "National Institute of Securities Markets",
      description:
        "Certified in equity derivatives, validating deep knowledge of Indian derivatives markets.",
      image: "/tree/milestones/nism.svg",
      links: [],
    },
    {
      title: "FIDE Rated Chess Player",
      dates: "",
      location: "",
      description: "Holds an official FIDE chess rating.",
      image: "/tree/milestones/fide.svg",
      links: [],
    },
    {
      title: "65+ Open-source Repositories",
      dates: "",
      location: "GitHub",
      description:
        "Trading systems, quant models, and web experiments published on GitHub.",
      image: "/tree/milestones/github.svg",
      links: [
        {
          title: "GitHub",
          icon: <Icons.github className="h-4 w-4" />,
          href: "https://github.com/Pusparaj99op",
        },
      ],
    },
  ],
};
