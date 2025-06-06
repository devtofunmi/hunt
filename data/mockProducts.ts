export type Product = {
    id: number;
    name: string;
    description: string;
    tags: string[];
    logo: string;
    upvotes: number;
    saved: boolean;
  };
  
  export const mockProducts: Product[] = [
    {
      id: 1,
      name: "Completely AI Agent",
      description: "Instantly find, analyze, and track your competitors with AI.",
      tags: ["Marketing", "AI", "Business Intelligence"],
      logo: "https://logo.clearbit.com/openai.com",
      upvotes: 2,
      saved: false,
    },
    {
      id: 2,
      name: "Hirenga",
      description: "Tired of messy hiring? Let AI organize it for you.",
      tags: ["Hiring", "Productivity", "AI"],
      logo: "https://logo.clearbit.com/lever.co",
      upvotes: 1,
      saved: false,
    },
    {
      id: 3,
      name: "Notclass",
      description: "Turn YouTube videos into Courses with AI.",
      tags: ["Education", "YouTube", "Online Learning"],
      logo: "https://logo.clearbit.com/udemy.com",
      upvotes: 1,
      saved: false,
    },
    {
      id: 4,
      name: "Smart Keys for Mac",
      description: "AI shortcuts for fixing grammar, translating and coding.",
      tags: ["Writing", "Languages", "DevTools"],
      logo: "https://logo.clearbit.com/grammarly.com",
      upvotes: 2,
      saved: false,
    },
    {
      id: 5,
      name: "Launchly",
      description: "Launch and monitor your side projects easily.",
      tags: ["Startups", "Launch", "Analytics"],
      logo: "https://logo.clearbit.com/producthunt.com",
      upvotes: 0,
      saved: false,
    },
    {
      id: 6,
      name: "TaskFlow AI",
      description: "Automate your task lists intelligently with AI suggestions.",
      tags: ["Productivity", "Task Management"],
      logo: "https://logo.clearbit.com/asana.com",
      upvotes: 3,
      saved: false,
    },
    {
      id: 7,
      name: "CodeGenius",
      description: "Let AI review and optimize your code instantly.",
      tags: ["Developer Tools", "AI", "Code Review"],
      logo: "https://logo.clearbit.com/github.com",
      upvotes: 5,
      saved: false,
    },
    {
      id: 8,
      name: "WriteBoost",
      description: "Supercharge your writing with AI suggestions and grammar fixes.",
      tags: ["Writing", "Productivity", "AI"],
      logo: "https://logo.clearbit.com/grammarly.com",
      upvotes: 4,
      saved: false,
    },
    {
      id: 9,
      name: "MarketSpy",
      description: "Track market trends and competitor moves automatically.",
      tags: ["Marketing", "Analytics", "AI"],
      logo: "https://logo.clearbit.com/semrush.com",
      upvotes: 2,
      saved: false,
    },
    {
      id: 10,
      name: "Meetly",
      description: "Organize your meetings smartly with AI-powered scheduling.",
      tags: ["Productivity", "Meetings", "AI"],
      logo: "https://logo.clearbit.com/zoom.us",
      upvotes: 3,
      saved: false,
    },
    {
      id: 11,
      name: "DesignWave",
      description: "AI-assisted UI/UX design suggestions for your projects.",
      tags: ["Design", "AI", "UI/UX"],
      logo: "https://logo.clearbit.com/figma.com",
      upvotes: 7,
      saved: false,
    },
    {
      id: 12,
      name: "SonicLaunch",
      description: "Launch your startup with ready-made tools and templates.",
      tags: ["Startups", "Launch", "Tools"],
      logo: "https://logo.clearbit.com/producthunt.com",
      upvotes: 1,
      saved: false,
    },
    {
      id: 13,
      name: "FocusMind",
      description: "Stay focused with AI-driven productivity boosters.",
      tags: ["Focus", "Mindfulness", "Productivity"],
      logo: "https://logo.clearbit.com/headspace.com",
      upvotes: 6,
      saved: false,
    },
    {
      id: 14,
      name: "IdeaForge",
      description: "Generate startup ideas using AI and market data.",
      tags: ["Ideas", "Startups", "AI"],
      logo: "https://logo.clearbit.com/ideaforge.com",
      upvotes: 2,
      saved: false,
    },
    {
      id: 15,
      name: "Pixely",
      description: "Free stock photos and AI-generated illustrations.",
      tags: ["Design", "Photos", "Illustrations"],
      logo: "https://logo.clearbit.com/unsplash.com",
      upvotes: 8,
      saved: false,
    },
    {
      id: 16,
      name: "AppTrackr",
      description: "Monitor your app's growth and retention effortlessly.",
      tags: ["Analytics", "Apps", "Tracking"],
      logo: "https://logo.clearbit.com/firebase.google.com",
      upvotes: 5,
      saved: false,
    },
    {
      id: 17,
      name: "LaunchMetrics",
      description: "Analyze your launch campaign metrics in one dashboard.",
      tags: ["Marketing", "Launch", "Analytics"],
      logo: "https://logo.clearbit.com/launchmetrics.com",
      upvotes: 3,
      saved: false,
    },
    {
      id: 18,
      name: "Synthesia",
      description: "Create professional AI videos without cameras or actors.",
      tags: ["Video", "AI", "Marketing"],
      logo: "https://logo.clearbit.com/synthesia.io",
      upvotes: 7,
      saved: false,
    },
    {
      id: 19,
      name: "SmartSurvey",
      description: "Build smarter surveys with predictive insights.",
      tags: ["Surveys", "Market Research", "AI"],
      logo: "https://logo.clearbit.com/surveymonkey.com",
      upvotes: 4,
      saved: false,
    },
    {
      id: 20,
      name: "CourseCraft",
      description: "Launch your own online course with AI support.",
      tags: ["Courses", "Education", "Online Learning"],
      logo: "https://logo.clearbit.com/teachable.com",
      upvotes: 2,
      saved: false,
    },
    {
      id: 21,
      name: "StartupDeck",
      description: "Create professional pitch decks quickly.",
      tags: ["Startups", "Pitch Decks", "Business"],
      logo: "https://logo.clearbit.com/canva.com",
      upvotes: 5,
      saved: false,
    },
    {
      id: 22,
      name: "MemoAI",
      description: "AI tool to summarize meetings and generate action items.",
      tags: ["Productivity", "Meetings", "AI"],
      logo: "https://logo.clearbit.com/notion.so",
      upvotes: 6,
      saved: false,
    },
    {
      id: 23,
      name: "ViralVision",
      description: "Predict your next viral social media post with AI.",
      tags: ["Marketing", "Social Media", "AI"],
      logo: "https://logo.clearbit.com/hootsuite.com",
      upvotes: 7,
      saved: false,
    },
    {
      id: 24,
      name: "DocuBot",
      description: "Automate documentation writing for your projects.",
      tags: ["Developer Tools", "Writing", "Productivity"],
      logo: "https://logo.clearbit.com/readme.com",
      upvotes: 4,
      saved: false,
    },
    {
      id: 25,
      name: "SprintMaster",
      description: "Plan, track, and improve agile sprints with AI assistance.",
      tags: ["Project Management", "Agile", "AI"],
      logo: "https://logo.clearbit.com/jira.com",
      upvotes: 5,
      saved: false,
    },
    {
      id: 26,
      name: "FlowchartsAI",
      description: "Generate flowcharts automatically from ideas and text.",
      tags: ["Diagrams", "Developer Tools", "Productivity"],
      logo: "https://logo.clearbit.com/lucidchart.com",
      upvotes: 2,
      saved: false,
    },
    {
      id: 27,
      name: "TrendWise",
      description: "Identify and follow trends before they become mainstream.",
      tags: ["Trends", "Analytics", "Business Intelligence"],
      logo: "https://logo.clearbit.com/trendhunter.com",
      upvotes: 6,
      saved: false,
    },
    {
      id: 28,
      name: "BugSniper",
      description: "Catch and fix bugs automatically using AI suggestions.",
      tags: ["Developer Tools", "Testing", "AI"],
      logo: "https://logo.clearbit.com/sentry.io",
      upvotes: 5,
      saved: false,
    },
    {
      id: 29,
      name: "NexaDocs",
      description: "All-in-one documentation and collaboration platform.",
      tags: ["Docs", "Collaboration", "Productivity"],
      logo: "https://logo.clearbit.com/confluence.atlassian.com",
      upvotes: 4,
      saved: false,
    },
    {
      id: 30,
      name: "Creatify",
      description: "Generate marketing content ideas using AI.",
      tags: ["Marketing", "Content Creation", "AI"],
      logo: "https://logo.clearbit.com/copy.ai",
      upvotes: 8,
      saved: false,
    },
  ];
  
  