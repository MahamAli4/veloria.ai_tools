export type Plan = {
  name: string;
  price: number;
  duration: string;
  features: string[];
  highlighted?: boolean;
};

export type Tool = {
  slug: string;
  name: string;
  mark: string; // letter mark
  gradient: string;
  category: string;
  tagline: string;
  description: string;
  overview: string;
  whatItDoes: string;
  whoFor: string;
  originalPrice: number;
  ourPrice: number;
  duration: string;
  benefits: string[];
  features: string[];
  advantages: string[];
  useCases: string[];
  plans: Plan[];
  faqs: { q: string; a: string }[];
  imageUrl?: string;
  logoUrl?: string;
  categories?: string[];
  currency?: string;
  postLink?: string;
};

export const tools: Tool[] = [
  {
    slug: "chatgpt-plus",
    name: "ChatGPT Plus",
    mark: "G",
    gradient: "linear-gradient(135deg,#10a37f,#4ac6a3)",
    category: "Conversational AI",
    tagline: "The world's most capable assistant, unlocked.",
    description: "Priority access to the most advanced GPT models with faster responses and premium tools.",
    overview:
      "ChatGPT Plus gives you priority access to OpenAI's most advanced reasoning models, image generation, data analysis, and custom GPTs — all in one elegant workspace.",
    whatItDoes:
      "Answers complex questions, writes and edits content, analyzes files and data, generates images, and automates repetitive knowledge work with human-like fluency.",
    whoFor: "Founders, writers, students, marketers, developers, and anyone who wants a thinking partner on demand.",
    originalPrice: 20,
    ourPrice: 9,
    duration: "per month",
    benefits: ["Priority model access", "Faster response speeds", "Advanced data analysis", "Image generation included"],
    features: ["GPT-4 class reasoning", "Custom GPTs", "File & image uploads", "Voice conversations", "Web browsing"],
    advantages: ["5x faster than free tier", "Early access to new features", "Higher message limits"],
    useCases: ["Drafting long-form content", "Debugging code", "Research synthesis", "Brainstorming campaigns"],
    plans: [
      { name: "Monthly", price: 9, duration: "1 month", features: ["Full Plus access", "Priority speed", "All models"] },
      { name: "Quarterly", price: 24, duration: "3 months", features: ["Everything in Monthly", "Save 11%", "Priority support"], highlighted: true },
      { name: "Yearly", price: 79, duration: "12 months", features: ["Everything in Quarterly", "Save 27%", "Dedicated onboarding"] },
    ],
    faqs: [
      { q: "Is this an original account?", a: "Yes — every subscription is a genuine, upgraded account with full warranty for the duration." },
      { q: "How fast is delivery?", a: "Most orders are delivered within minutes, and always within a few hours." },
    ],
  },
  {
    slug: "lovable",
    name: "Lovable",
    mark: "L",
    gradient: "linear-gradient(135deg,#ff6d5a,#ff9a8b)",
    category: "AI App Builder",
    tagline: "Build full-stack apps by simply chatting.",
    description: "Ship production-ready web apps from natural language with an AI engineering team at your side.",
    overview:
      "Lovable turns plain-English ideas into real, deployable full-stack applications — frontend, backend, database, and auth — without touching a terminal.",
    whatItDoes: "Generates, edits, and deploys complete web applications from conversation, with live preview and instant iteration.",
    whoFor: "Founders, product teams, designers, and indie hackers who want to build fast without a full dev team.",
    originalPrice: 25,
    ourPrice: 12,
    duration: "per month",
    benefits: ["Ship apps in minutes", "No setup required", "Built-in database & auth", "One-click deploy"],
    features: ["Natural language building", "Live preview", "Cloud backend", "Version history", "Custom domains"],
    advantages: ["10x faster prototyping", "Real production code", "No lock-in"],
    useCases: ["MVPs", "Internal tools", "Landing pages", "SaaS dashboards"],
    plans: [
      { name: "Starter", price: 12, duration: "1 month", features: ["Core builder", "Cloud backend", "Community support"] },
      { name: "Pro", price: 30, duration: "3 months", features: ["Everything in Starter", "More credits", "Priority builds"], highlighted: true },
      { name: "Scale", price: 99, duration: "12 months", features: ["Everything in Pro", "Team seats", "Premium support"] },
    ],
    faqs: [
      { q: "Do I own the code?", a: "Absolutely — you get full ownership and export at any time." },
      { q: "Is delivery instant?", a: "Yes, credentials are shared shortly after purchase." },
    ],
  },
  {
    slug: "google-ai-pro",
    name: "Google AI Pro",
    mark: "◆",
    gradient: "linear-gradient(135deg,#4285f4,#9b72cb)",
    category: "Productivity AI",
    tagline: "Gemini across everything you already use.",
    description: "Advanced Gemini models woven into Gmail, Docs, and Sheets with 2TB of storage.",
    overview:
      "Google AI Pro brings the most advanced Gemini models into your entire Workspace with expanded storage and creative tools.",
    whatItDoes: "Assists in Gmail, Docs, Sheets and Meet, generates media, and answers with real-time knowledge.",
    whoFor: "Professionals and teams living inside Google Workspace who want AI everywhere.",
    originalPrice: 20,
    ourPrice: 10,
    duration: "per month",
    benefits: ["Gemini in Workspace", "2TB storage", "Advanced media tools", "Deep research"],
    features: ["Gemini Advanced", "Docs & Gmail help", "NotebookLM Plus", "Video generation", "Priority access"],
    advantages: ["Seamless integration", "Massive storage", "Latest models"],
    useCases: ["Email drafting", "Spreadsheet analysis", "Research reports", "Content creation"],
    plans: [
      { name: "Monthly", price: 10, duration: "1 month", features: ["Full Pro access", "2TB storage"] },
      { name: "Quarterly", price: 27, duration: "3 months", features: ["Everything in Monthly", "Save 10%"], highlighted: true },
      { name: "Yearly", price: 89, duration: "12 months", features: ["Everything in Quarterly", "Save 26%"] },
    ],
    faqs: [
      { q: "Does it work on my account?", a: "We upgrade your existing Google account so nothing changes for you." },
      { q: "Is the storage included?", a: "Yes, the full 2TB is part of the plan." },
    ],
  },
  {
    slug: "claude-pro",
    name: "Claude Pro",
    mark: "✳",
    gradient: "linear-gradient(135deg,#d97757,#e8a87c)",
    category: "Conversational AI",
    tagline: "Thoughtful, long-context reasoning.",
    description: "Anthropic's most capable model with massive context and superb writing quality.",
    overview:
      "Claude Pro delivers nuanced, safe, and remarkably well-written responses with an industry-leading context window.",
    whatItDoes: "Reads long documents, writes with taste, codes reliably, and reasons through complex problems.",
    whoFor: "Writers, researchers, lawyers, and developers who value depth and long context.",
    originalPrice: 20,
    ourPrice: 11,
    duration: "per month",
    benefits: ["200K+ context", "Superb writing", "File analysis", "Priority access"],
    features: ["Claude flagship model", "Projects", "Artifacts", "Long document upload", "Higher limits"],
    advantages: ["Best-in-class writing", "Huge context", "Reliable coding"],
    useCases: ["Long document review", "Essay writing", "Codebase Q&A", "Policy drafting"],
    plans: [
      { name: "Monthly", price: 11, duration: "1 month", features: ["Full Pro access", "Priority speed"] },
      { name: "Quarterly", price: 29, duration: "3 months", features: ["Everything in Monthly", "Save 12%"], highlighted: true },
      { name: "Yearly", price: 95, duration: "12 months", features: ["Everything in Quarterly", "Save 28%"] },
    ],
    faqs: [
      { q: "Which model is included?", a: "You get access to Anthropic's latest flagship Claude model." },
      { q: "Any usage limits?", a: "Generous Pro-tier limits far above the free plan." },
    ],
  },
  {
    slug: "perplexity-pro",
    name: "Perplexity Pro",
    mark: "P",
    gradient: "linear-gradient(135deg,#20808d,#4bb3bf)",
    category: "AI Search",
    tagline: "Answers with sources, instantly.",
    description: "Research-grade AI search with citations and access to multiple frontier models.",
    overview:
      "Perplexity Pro is an answer engine that searches the live web and cites every source, powered by your choice of top models.",
    whatItDoes: "Delivers cited answers, runs deep research, and analyzes files with real-time web access.",
    whoFor: "Analysts, journalists, students, and curious minds who need trustworthy answers fast.",
    originalPrice: 20,
    ourPrice: 10,
    duration: "per month",
    benefits: ["Cited answers", "Multiple frontier models", "Pro search", "File uploads"],
    features: ["Pro Search", "Model switching", "Focus modes", "Collections", "API credits"],
    advantages: ["Always sourced", "Live web data", "Choose your model"],
    useCases: ["Market research", "Fact checking", "Study help", "Competitive analysis"],
    plans: [
      { name: "Monthly", price: 10, duration: "1 month", features: ["Full Pro access", "All models"] },
      { name: "Quarterly", price: 26, duration: "3 months", features: ["Everything in Monthly", "Save 13%"], highlighted: true },
      { name: "Yearly", price: 85, duration: "12 months", features: ["Everything in Quarterly", "Save 29%"] },
    ],
    faqs: [
      { q: "Does it cite sources?", a: "Every Pro answer includes linked, verifiable citations." },
      { q: "Can I switch models?", a: "Yes, you can choose among several frontier models." },
    ],
  },
  {
    slug: "cursor-ai",
    name: "Cursor AI",
    mark: "»",
    gradient: "linear-gradient(135deg,#202124,#5b5f97)",
    category: "AI Coding",
    tagline: "The AI-first code editor.",
    description: "An editor built around AI that understands your whole codebase.",
    overview:
      "Cursor is a fast, AI-native code editor that autocompletes, refactors, and reasons across your entire project.",
    whatItDoes: "Writes and edits code with full-repo context, chats about your codebase, and applies multi-file changes.",
    whoFor: "Developers and engineering teams who want to ship faster with AI pair programming.",
    originalPrice: 20,
    ourPrice: 12,
    duration: "per month",
    benefits: ["Codebase-aware AI", "Multi-file edits", "Fast autocomplete", "Frontier models"],
    features: ["Agent mode", "Tab completion", "Codebase chat", "Model choice", "Privacy mode"],
    advantages: ["Understands whole repo", "Blazing fast", "Model flexibility"],
    useCases: ["Refactoring", "Bug fixing", "New features", "Learning codebases"],
    plans: [
      { name: "Monthly", price: 12, duration: "1 month", features: ["Full Pro access", "Frontier models"] },
      { name: "Quarterly", price: 31, duration: "3 months", features: ["Everything in Monthly", "Save 14%"], highlighted: true },
      { name: "Yearly", price: 99, duration: "12 months", features: ["Everything in Quarterly", "Save 31%"] },
    ],
    faqs: [
      { q: "Is it a real Pro account?", a: "Yes, a genuine Cursor Pro upgrade with full features." },
      { q: "Which models are included?", a: "Access to the current frontier models available in Cursor Pro." },
    ],
  },
  {
    slug: "linkedin-premium",
    name: "LinkedIn Premium",
    mark: "in",
    gradient: "linear-gradient(135deg,#0a66c2,#3d8bd4)",
    category: "Career & Networking",
    tagline: "Stand out and get hired faster.",
    description: "Premium insights, InMail, and AI-powered career tools.",
    overview:
      "LinkedIn Premium unlocks who's viewed you, InMail messaging, salary insights, and AI writing help for your profile.",
    whatItDoes: "Boosts visibility, opens direct messaging, and provides learning and hiring intelligence.",
    whoFor: "Job seekers, recruiters, founders, and sales professionals building their network.",
    originalPrice: 40,
    ourPrice: 15,
    duration: "per month",
    benefits: ["InMail credits", "Who viewed you", "LinkedIn Learning", "AI profile help"],
    features: ["Unlimited profiles", "Salary insights", "Applicant insights", "Featured applicant", "Courses"],
    advantages: ["More recruiter reach", "Learning library", "Data-driven applications"],
    useCases: ["Job hunting", "Lead generation", "Upskilling", "Personal branding"],
    plans: [
      { name: "Monthly", price: 15, duration: "1 month", features: ["Career features", "InMail credits"] },
      { name: "Quarterly", price: 40, duration: "3 months", features: ["Everything in Monthly", "Save 11%"], highlighted: true },
      { name: "Yearly", price: 129, duration: "12 months", features: ["Everything in Quarterly", "Save 28%"] },
    ],
    faqs: [
      { q: "Which tier is this?", a: "Career-tier premium; Business/Sales tiers available on request." },
      { q: "Will my connections change?", a: "No, we only upgrade your existing account." },
    ],
  },
  {
    slug: "canva-pro",
    name: "Canva Pro",
    mark: "C",
    gradient: "linear-gradient(135deg,#7d2ae8,#00c4cc)",
    category: "Design & Creative",
    tagline: "Design anything, powered by AI.",
    description: "Premium templates, brand kits, and Magic Studio AI tools.",
    overview:
      "Canva Pro unlocks the full library plus Magic Studio — AI design, background removal, and one-click resizing.",
    whatItDoes: "Creates on-brand graphics, videos, and docs with premium assets and AI generation.",
    whoFor: "Marketers, creators, small businesses, and teams producing content at scale.",
    originalPrice: 15,
    ourPrice: 7,
    duration: "per month",
    benefits: ["100M+ premium assets", "Magic Studio AI", "Brand kit", "Background remover"],
    features: ["Magic Design", "Resize", "Background remover", "Premium templates", "1TB storage"],
    advantages: ["Huge asset library", "AI shortcuts", "Team collaboration"],
    useCases: ["Social media", "Presentations", "Marketing assets", "Short videos"],
    plans: [
      { name: "Monthly", price: 7, duration: "1 month", features: ["Full Pro access", "Magic Studio"] },
      { name: "Quarterly", price: 18, duration: "3 months", features: ["Everything in Monthly", "Save 14%"], highlighted: true },
      { name: "Yearly", price: 59, duration: "12 months", features: ["Everything in Quarterly", "Save 30%"] },
    ],
    faqs: [
      { q: "Is it a team plan?", a: "Individual Pro by default; team seats available on request." },
      { q: "Do I keep my designs?", a: "Yes, all your designs stay in your account." },
    ],
  },
  {
    slug: "notion-ai",
    name: "Notion AI",
    mark: "N",
    gradient: "linear-gradient(135deg,#202124,#8b8d98)",
    category: "Productivity AI",
    tagline: "Your workspace that thinks with you.",
    description: "AI writing, search, and automation built into your Notion.",
    overview:
      "Notion AI adds writing assistance, connected search, and Q&A across your entire workspace and connected apps.",
    whatItDoes: "Drafts, summarizes, translates, and answers questions using your own knowledge base.",
    whoFor: "Teams, students, and knowledge workers organizing their work in Notion.",
    originalPrice: 10,
    ourPrice: 6,
    duration: "per month",
    benefits: ["AI writing", "Workspace Q&A", "Auto-fill databases", "Connected search"],
    features: ["AI blocks", "Summaries", "Translation", "Q&A", "Autofill"],
    advantages: ["Context-aware", "In your workflow", "Fast drafting"],
    useCases: ["Meeting notes", "Docs", "Project management", "Knowledge base"],
    plans: [
      { name: "Monthly", price: 6, duration: "1 month", features: ["AI add-on", "Unlimited blocks"] },
      { name: "Quarterly", price: 16, duration: "3 months", features: ["Everything in Monthly", "Save 11%"], highlighted: true },
      { name: "Yearly", price: 55, duration: "12 months", features: ["Everything in Quarterly", "Save 24%"] },
    ],
    faqs: [
      { q: "Does it read my pages?", a: "Yes, it can answer using your connected workspace content." },
      { q: "Is my data safe?", a: "Your content stays within your workspace permissions." },
    ],
  },
  {
    slug: "github-copilot",
    name: "GitHub Copilot",
    mark: "◉",
    gradient: "linear-gradient(135deg,#24292e,#6e7681)",
    category: "AI Coding",
    tagline: "Your AI pair programmer.",
    description: "Context-aware code completion and chat in your favorite IDE.",
    overview:
      "GitHub Copilot suggests whole lines and functions in real time and answers coding questions right in your editor.",
    whatItDoes: "Autocompletes code, explains snippets, writes tests, and chats about your project.",
    whoFor: "Developers of every level who want to code faster with fewer context switches.",
    originalPrice: 10,
    ourPrice: 6,
    duration: "per month",
    benefits: ["Inline suggestions", "Copilot Chat", "Multi-IDE", "Test generation"],
    features: ["Code completion", "Chat", "CLI help", "PR summaries", "Model choice"],
    advantages: ["Deep IDE integration", "Fast", "Multi-language"],
    useCases: ["Writing code", "Learning APIs", "Tests", "Documentation"],
    plans: [
      { name: "Monthly", price: 6, duration: "1 month", features: ["Full access", "Chat included"] },
      { name: "Quarterly", price: 16, duration: "3 months", features: ["Everything in Monthly", "Save 11%"], highlighted: true },
      { name: "Yearly", price: 55, duration: "12 months", features: ["Everything in Quarterly", "Save 24%"] },
    ],
    faqs: [
      { q: "Which IDEs work?", a: "VS Code, JetBrains, Neovim, Visual Studio and more." },
      { q: "Is it the individual plan?", a: "Yes, Copilot Individual with full features." },
    ],
  },
  {
    slug: "grammarly-premium",
    name: "Grammarly Premium",
    mark: "G",
    gradient: "linear-gradient(135deg,#15c39a,#11a37f)",
    category: "Writing AI",
    tagline: "Write with clarity and confidence.",
    description: "Advanced tone, clarity, and generative writing everywhere you type.",
    overview:
      "Grammarly Premium goes beyond grammar with tone detection, full-sentence rewrites, and generative AI across the web.",
    whatItDoes: "Corrects, rewrites, and elevates your writing in real time with brand and tone controls.",
    whoFor: "Professionals, students, and teams who write emails, docs, and content daily.",
    originalPrice: 30,
    ourPrice: 10,
    duration: "per month",
    benefits: ["Advanced suggestions", "Tone & clarity", "Generative AI", "Works everywhere"],
    features: ["Full rewrites", "Tone detection", "Plagiarism checker", "Style guide", "Snippets"],
    advantages: ["Cross-app coverage", "Real-time help", "Professional polish"],
    useCases: ["Emails", "Reports", "Essays", "Social posts"],
    plans: [
      { name: "Monthly", price: 10, duration: "1 month", features: ["Premium features", "Generative AI"] },
      { name: "Quarterly", price: 26, duration: "3 months", features: ["Everything in Monthly", "Save 13%"], highlighted: true },
      { name: "Yearly", price: 85, duration: "12 months", features: ["Everything in Quarterly", "Save 29%"] },
    ],
    faqs: [
      { q: "Does it work in my browser?", a: "Yes, plus desktop apps and Microsoft Office." },
      { q: "Is generative AI included?", a: "Yes, with a generous monthly prompt allowance." },
    ],
  },
  {
    slug: "adobe-creative-cloud",
    name: "Adobe Creative Cloud",
    mark: "A",
    gradient: "linear-gradient(135deg,#ff3366,#ff0000)",
    category: "Design & Creative",
    tagline: "The full creative suite, with Firefly AI.",
    description: "Photoshop, Illustrator, Premiere and more with generative AI built in.",
    overview:
      "Adobe Creative Cloud bundles the industry-standard creative apps plus Firefly generative AI and 100GB of storage.",
    whatItDoes: "Powers photo, vector, video, and design work with pro tools and generative AI.",
    whoFor: "Designers, photographers, editors, and creative teams who need the pro standard.",
    originalPrice: 60,
    ourPrice: 22,
    duration: "per month",
    benefits: ["20+ pro apps", "Firefly AI", "100GB cloud", "Fonts & assets"],
    features: ["Photoshop", "Illustrator", "Premiere Pro", "Firefly", "Adobe Fonts"],
    advantages: ["Industry standard", "Generative AI", "Cross-device"],
    useCases: ["Photo editing", "Branding", "Video editing", "Illustration"],
    plans: [
      { name: "Monthly", price: 22, duration: "1 month", features: ["All apps", "Firefly AI"] },
      { name: "Quarterly", price: 59, duration: "3 months", features: ["Everything in Monthly", "Save 11%"], highlighted: true },
      { name: "Yearly", price: 199, duration: "12 months", features: ["Everything in Quarterly", "Save 25%"] },
    ],
    faqs: [
      { q: "Is it all apps?", a: "Yes, the complete All Apps plan is included." },
      { q: "How much storage?", a: "100GB of cloud storage comes with the plan." },
    ],
  },
];

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);

export const testimonials = [
  { name: "Sarah Chen", role: "Product Designer", quote: "They guided me step-by-step on how to get ChatGPT Plus for much less. So clear and honest." },
  { name: "Marcus Reid", role: "Startup Founder", quote: "Their guidance helps me subscribe to every tool the affordable way. Honest advice, real support." },
  { name: "Priya Nair", role: "Content Strategist", quote: "With their tips I saved big on Canva, Grammarly and Notion AI subscriptions. Highly recommend." },
  { name: "Diego Alvarez", role: "Software Engineer", quote: "They showed me how to get Cursor and Copilot for less. Support answered all my questions at 2am." },
  { name: "Lena Ford", role: "Marketing Lead", quote: "Honest, friendly guidance that helped me get my subscriptions affordably. Everything was easy." },
  { name: "Tom Becker", role: "Freelance Writer", quote: "Their guidance helped me get Perplexity Pro for less — it changed my research workflow." },
];

export const faqs = [
  { q: "Are these original, genuine accounts?", a: "Yes. Every subscription is a real, upgraded account with full features and a warranty for the entire duration." },
  { q: "How fast will I receive my subscription?", a: "Most orders are delivered within minutes and always within a few hours of purchase." },
  { q: "Why are the prices so much lower?", a: "We source subscriptions at scale and pass the savings on to you — no gimmicks, just better pricing." },
  { q: "What payment methods do you accept?", a: "All major cards and popular digital wallets through a secure, encrypted checkout." },
  { q: "Is there a refund policy?", a: "Yes. If we can't deliver a working subscription, you're fully refunded — no questions asked." },
  { q: "Do you offer support?", a: "Our team is available 24/7 to help with setup, renewals, and anything else." },
];
