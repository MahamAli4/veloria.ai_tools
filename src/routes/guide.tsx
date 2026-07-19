import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, X, ExternalLink, Sparkles, SearchCode, FileText, Palette, Video, Info, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const title = "AI Tools Guide & Directory | Veloria.AI";
const description = "Learn which AI and digital tools are best for SEO, writing, design, and video production, and how to use them.";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/guide" },
    ],
    links: [{ rel: "canonical", href: "/guide" }],
  }),
  component: GuidePage,
});

type ToolInfo = {
  name: string;
  category: string;
  tag: "seo" | "writing" | "design" | "video";
  tagline: string;
  description: string;
  howToUse: string[];
  gradient: string;
  badge?: string;
};

const toolsList: ToolInfo[] = [
  // --- SEO & Search Tools ---
  {
    name: "Semrush",
    category: "SEO & Analytics",
    tag: "seo",
    tagline: "All-in-one market intelligence and SEO audit suite.",
    description: "Semrush is the industry standard for organic keyword tracking, backlink profiling, competitor traffic analysis, and full-site technical SEO audits.",
    howToUse: [
      "Enter a competitor's domain in the 'Domain Overview' to view their top traffic channels and ranking keywords.",
      "Use the 'Keyword Magic Tool' to find high-volume, low-competition keywords for your niche.",
      "Set up a 'Site Audit' project to crawl your website and identify technical health errors like broken links or redirect loops."
    ],
    gradient: "from-orange-500 to-red-600"
  },
  {
    name: "Moz Pro",
    category: "SEO & Analytics",
    tag: "seo",
    tagline: "Smarter SEO insights and keyword research.",
    description: "Moz Pro helps you track your page rankings, perform competitor site audits, explore high-quality link-building targets, and analyze page optimization factors.",
    howToUse: [
      "Run your URL through the 'Site Crawl' tool to uncover duplicate content and unindexed pages.",
      "Check any website's 'Spam Score' and link authority using the 'Link Explorer' tool before building backlinks.",
      "Input target pages into 'Page Optimizer' to get concrete suggestions for improving meta titles and heading structures."
    ],
    gradient: "from-blue-500 to-indigo-600"
  },
  {
    name: "Ubersuggest",
    category: "SEO & Analytics",
    tag: "seo",
    tagline: "Easy keyword suggestions and site audits.",
    description: "Ubersuggest is a clean, beginner-friendly SEO suite by Neil Patel that excels at generating copy/content ideas, tracking rankings, and reverse-engineering competitor pages.",
    howToUse: [
      "Paste a keyword to view its exact monthly search volume, SEO difficulty, and average CPC cost.",
      "Look at the 'Content Ideas' tab to see articles that got the most social media shares for your keyword.",
      "Review the 'SEO Analyzer' report to get a prioritized checklist of speed and schema improvements for your site."
    ],
    gradient: "from-red-500 to-orange-600"
  },
  {
    name: "SimilarWeb",
    category: "SEO & Analytics",
    tag: "seo",
    tagline: "Detailed competitor traffic analysis.",
    description: "SimilarWeb gives you an inside look at any website's traffic numbers, visitor demographics, bounce rates, and referrer sources (where their traffic comes from).",
    howToUse: [
      "Search a competitor's domain to see their estimated monthly visitor counts and average visit durations.",
      "Inspect the 'Marketing Channels' graph to check if they rely on organic SEO, paid ads, or social media.",
      "Explore the 'Geographic Distribution' to see which countries their target customers reside in."
    ],
    gradient: "from-cyan-500 to-blue-600"
  },
  {
    name: "SEO Optimer",
    category: "SEO & Analytics",
    tag: "seo",
    tagline: "Instant website audit and SEO grading.",
    description: "SEO Optimer is a fast diagnostic utility that reviews your website's on-page SEO elements, speed indicators, security level, and mobile responsiveness.",
    howToUse: [
      "Paste your website link in the search box to generate a detailed PDF audit report.",
      "Review the letter grades (A+ to F) for usability, speed, security, and social factors.",
      "Work through the automatically generated task checklist to fix identified title, image alt, or hosting errors."
    ],
    gradient: "from-emerald-500 to-teal-600"
  },
  {
    name: "Helium 10",
    category: "Amazon SEO & Product Research",
    tag: "seo",
    tagline: "Unlock sales data for Amazon store optimization.",
    description: "Helium 10 is the ultimate software suite for Amazon sellers, specializing in listing optimization, PPC advertising, keyword tracking, and product search.",
    howToUse: [
      "Use 'Black Box' to scan millions of Amazon products based on revenue and category to spot profitable niches.",
      "Paste competitor ASINs into 'Cerebro' to view all the hidden keywords they rank for organically.",
      "Use 'Scribbles' to ensure your listing title, bullets, and descriptions contain your high-volume search terms."
    ],
    gradient: "from-sky-500 to-blue-700"
  },
  {
    name: "Sell The Trend",
    category: "E-Commerce Research",
    tag: "seo",
    tagline: "Discover trending dropshipping items instantly.",
    description: "Sell The Trend uses predictive algorithms to analyze sales across Shopify, AliExpress, and social media platforms to locate winning e-commerce products.",
    howToUse: [
      "Explore the 'NEXUS' database to view the highest-trending items currently being bought on TikTok and Facebook Ads.",
      "Check the 'Shop Explorer' tab to spy on successful Shopify stores and inspect their best-selling products.",
      "Export winning products directly to your online store with pre-written description suggestions."
    ],
    gradient: "from-purple-500 to-pink-600"
  },
  {
    name: "SEO Site Checkup",
    category: "SEO & Analytics",
    tag: "seo",
    tagline: "Quick, readable SEO scores and guides.",
    description: "SEO Site Checkup provides easy-to-read SEO analytics, listing detailed checkups for speed, loading times, security parameters, and indexability rules.",
    howToUse: [
      "Input your website domain to run a comprehensive multi-point health checkup.",
      "Observe the final score (out of 100) and click on failed tests for explanation guides.",
      "Use the 'Competitor Comparison' tab to compare your scores directly against up to three other sites."
    ],
    gradient: "from-teal-500 to-indigo-600"
  },
  {
    name: "Links Indexer",
    category: "SEO & Analytics",
    tag: "seo",
    tagline: "Force Google to index your backlinks faster.",
    description: "Links Indexer submits your built links, blogs, and guest posts to dedicated indexing bots to make sure search engines register them quickly.",
    howToUse: [
      "Collect all the URLs where you have published backlinks or guest posts.",
      "Log into the indexer dashboard and paste your link list into the bulk submission box.",
      "Monitor the indexing dashboard over the next 3-7 days to see Google verification ratios."
    ],
    gradient: "from-amber-500 to-orange-600"
  },
  {
    name: "AnswerThePublic",
    category: "SEO & Analytics",
    tag: "seo",
    tagline: "See what questions people ask on Google.",
    description: "AnswerThePublic gathers search auto-complete query clouds and structures them into categories (who, what, where, why) to help you design keyword-focused blogs.",
    howToUse: [
      "Enter a broad topic (like 'vegan diet' or 'AI writing') and select your target language/country.",
      "Study the circular query cloud to see the exact questions users search for online.",
      "Use these questions as headings in your articles to optimize for Google's 'People Also Ask' box."
    ],
    gradient: "from-orange-600 to-yellow-500"
  },
  {
    name: "BuzzStream",
    category: "SEO & Analytics",
    tag: "seo",
    tagline: "Outreach CRM for link building and PR.",
    description: "BuzzStream streamlines email outreach campaigns, helping you search contact details, track relationships, and pitch editors for backlinks.",
    howToUse: [
      "Import a list of target blogs or search for niche sites using the BuzzStream browser extension.",
      "Let the platform automatically find contact emails, social profiles, and domain metrics.",
      "Send personalized, templated pitches to pitch your guest posts and track response rates."
    ],
    gradient: "from-violet-500 to-indigo-600"
  },
  {
    name: "Woorank",
    category: "SEO & Analytics",
    tag: "seo",
    tagline: "Digital marketing scorecards and checklists.",
    description: "Woorank audits your website's marketing score, reviewing keywords, server speeds, mobile layouts, and social media signals in one report.",
    howToUse: [
      "Analyze your site to check your overall digital marketing performance score.",
      "Check the 'Mobile' tab to see if your site loads quickly and displays correctly on smartphones.",
      "Utilize the structured marketing checklist to track task progress with your team."
    ],
    gradient: "from-green-500 to-emerald-600"
  },

  // --- AI Content & Writing Suite ---
  {
    name: "ChatGPT 5 Plus",
    category: "Conversational AI",
    tag: "writing",
    tagline: "Advanced thinking, coding, and writing copilot.",
    description: "ChatGPT Plus grants priority access to OpenAI's flagship models, enabling complex data analysis, programming assistance, and high-fidelity text generation.",
    howToUse: [
      "Provide ChatGPT with context: assign it a role (e.g. 'Expert Copywriter'), outline constraints, and specify the output style.",
      "Upload files (PDFs, CSVs, images) to perform instant data analysis, summarization, or coding feedback.",
      "Create or use Custom GPTs in the GPT Store to automate repetitive tasks like writing newsletters or social media templates."
    ],
    gradient: "from-emerald-600 to-teal-500"
  },
  {
    name: "Grok AI",
    category: "Conversational AI",
    tag: "writing",
    tagline: "Real-time search and unfiltered reasoning.",
    badge: "Bonus",
    description: "Developed by xAI, Grok accesses real-time data from social networks and web indexes to answer questions with contemporary news context.",
    howToUse: [
      "Ask Grok about breaking news or trending topics to get consolidated real-time updates.",
      "Switch between 'Fun Mode' for engaging, witty replies or 'Regular Mode' for standard reporting.",
      "Use its reasoning abilities to dissect social trends and find content ideas before they hit search engines."
    ],
    gradient: "from-gray-700 to-black"
  },
  {
    name: "Grammarly",
    category: "AI Writing Assistant",
    tag: "writing",
    tagline: "Flawless grammar, tone, and clarity correction.",
    description: "Grammarly is an active writing coach that checks spelling, punctuation, sentence structures, tone delivery, and flags plagiarism across your documents.",
    howToUse: [
      "Install the Grammarly extension for Chrome or Word to receive real-time corrections as you type.",
      "Set your writing goals (Audience, Formality, Domain, Tone) in the sidebar to custom-tailor suggestion rules.",
      "Review flagged red (grammar) and blue (clarity) lines to rewrite long, confusing sentences instantly."
    ],
    gradient: "from-emerald-500 to-green-600"
  },
  {
    name: "Notegpt",
    category: "AI Productivity",
    tag: "writing",
    tagline: "Instantly summarize YouTube videos and articles.",
    description: "Notegpt saves hours by transcribing, summarizing, and highlighting key takeaways from long videos, podcasts, and articles using AI.",
    howToUse: [
      "Paste any YouTube video URL into the NoteGPT search bar.",
      "Observe the generated interactive transcript mapped to video timestamps.",
      "Read the AI-generated bullet points summary to understand the entire video in 30 seconds."
    ],
    gradient: "from-blue-600 to-cyan-500"
  },
  {
    name: "Quillbot",
    category: "AI Writing Assistant",
    tag: "writing",
    tagline: "Premium paraphraser and text rewriter.",
    description: "Quillbot is a specialized rewriting editor that rephrases sentences, expands drafts, summarizes long essays, and checks text for plagiarism.",
    howToUse: [
      "Paste your text into the editor and choose a mode (Standard, Fluency, Formal, Creative).",
      "Slide the 'Synonyms' slider to control how much of the vocabulary is changed.",
      "Click on individual words in the output text to see a list of drop-down synonyms and pick custom choices."
    ],
    gradient: "from-green-600 to-lime-500"
  },
  {
    name: "You.com",
    category: "AI Search Engine",
    tag: "writing",
    tagline: "Conversational search and writing suite.",
    description: "You.com is a search engine built around chat, enabling you to search, write articles, generate code, and paint pictures in a private setting.",
    howToUse: [
      "Type queries in search to get detailed answers complete with inline website citations.",
      "Use 'YouWrite' to draft blogs, essays, or emails by setting tone, format, and keywords.",
      "Toggle private mode to search the web without storing personal cookies or location traces."
    ],
    gradient: "from-indigo-600 to-pink-600"
  },
  {
    name: "Perplexity AI",
    category: "AI Search Engine",
    tag: "writing",
    tagline: "Conversational answer engine with direct citations.",
    description: "Perplexity answers questions by running real-time web searches and compiling synthesized answers, providing clear source citations for every claim.",
    howToUse: [
      "Ask a complex question and select a focus (e.g. Academic, Writing, or YouTube).",
      "Read the generated summary and click the footnote numbers to verify the source websites.",
      "Use the 'Pro' switch to enable advanced models (like Claude 3.5 or GPT-4o) for deeper research questions."
    ],
    gradient: "from-teal-600 to-emerald-700"
  },
  {
    name: "Linguix AI",
    category: "AI Writing Assistant",
    tag: "writing",
    tagline: "Polished business writing and templates.",
    description: "Linguix is an AI writing assistant tailored for marketing teams, providing text checks, paraphrasing shortcuts, and team snippet templates.",
    howToUse: [
      "Highlight any text on a web page to rewrite, expand, or correct it using the Linguix popup widget.",
      "Create reusable text shortcuts (snippets) for client emails to speed up support communication.",
      "Check the writing quality score in the browser extension to improve vocabulary variety."
    ],
    gradient: "from-indigo-500 to-blue-600"
  },
  {
    name: "Wordtune",
    category: "AI Writing Assistant",
    tag: "writing",
    badge: "Bonus",
    description: "Wordtune specializes in sentence rewriting, helping you adjust the tone (Casual or Formal) and length (Shorten or Expand) of your writing.",
    howToUse: [
      "Highlight a sentence in your email, blog draft, or document.",
      "Click the Wordtune icon to see a list of alternative rewrites for the same idea.",
      "Select the option that best fits your desired style to replace the highlighted text."
    ],
    gradient: "from-purple-600 to-indigo-600"
  },
  {
    name: "Closer Copy",
    category: "AI Writing Assistant",
    tag: "writing",
    tagline: "AI copywriting for sales pages and ads.",
    description: "Closer Copy is trained specifically on marketing, landing pages, email copy, and Facebook/Google ads to help you write high-converting copy.",
    howToUse: [
      "Open a project and select a framework template (e.g., 'Facebook Ad' or 'AIDA Sales Letter').",
      "Fill in your product name, target audience, and main benefits in the prompt boxes.",
      "Click 'Write' to generate multiple marketing copies optimized for sales conversion."
    ],
    gradient: "from-orange-500 to-red-600"
  },
  {
    name: "Hix AI",
    category: "AI Writing Assistant",
    tag: "writing",
    tagline: "All-in-one desktop AI writing extension.",
    description: "Hix AI is a powerful extension that lets you translate text, write emails, rewrite paragraphs, and summarize documents directly inside your browser tabs.",
    howToUse: [
      "Press your hotkey to open the Hix AI sidebar on any website.",
      "Use 'Hix Mail' inside Gmail to write professional replies automatically based on previous emails.",
      "Generate SEO-optimized articles inside the Hix editor by adding target keywords."
    ],
    gradient: "from-sky-500 to-indigo-600"
  },
  {
    name: "Cramly AI",
    category: "AI Productivity",
    tag: "writing",
    tagline: "Writing assistant for academic essays.",
    description: "Cramly AI helps students and researchers brainstorm topics, create outlines, cite references, and write essays while avoiding plagiarism.",
    howToUse: [
      "Select a template (e.g. 'Paragraph Generator' or 'Essay Outline').",
      "Input your essay topic or question prompt and select your length requirements.",
      "Use the outline to structure your paper, and check suggestions to ensure proper research flow."
    ],
    gradient: "from-pink-500 to-rose-600"
  },
  {
    name: "Scite AI",
    category: "AI Productivity",
    tag: "writing",
    tagline: "Smart citation checker for scientific research.",
    description: "Scite allows you to see how scientific research papers have been cited by others, classifying citations as supporting, disputing, or mentioning.",
    howToUse: [
      "Search for an academic claim or paper title in Scite.",
      "Check the 'Smart Citation' metrics to see if other studies support or dispute the findings.",
      "Read the exact text snippets from referencing papers to understand research consensus."
    ],
    gradient: "from-teal-600 to-indigo-700"
  },
  {
    name: "Jenni AI",
    category: "AI Productivity",
    tag: "writing",
    tagline: "Write research papers with auto-citations.",
    description: "Jenni AI helps you write essays, literature reviews, and research papers with autocomplete suggestions and automatic citation library formatting.",
    howToUse: [
      "Start typing your thesis statement or paragraph intro in the editor.",
      "Press the right arrow key to accept Jenni's context-aware sentence completions.",
      "Click the 'Cite' button to search for and insert citations in APA, MLA, or Harvard formats instantly."
    ],
    gradient: "from-blue-600 to-purple-600"
  },

  // --- Professional Design & Creative Tools ---
  {
    name: "Canva Pro",
    category: "Graphic Design",
    tag: "design",
    tagline: "Premium templates, vectors, and brand kits.",
    description: "Canva Pro is a drag-and-drop graphic design suite giving access to millions of premium templates, stock photos, elements, fonts, and AI design tools.",
    howToUse: [
      "Select a canvas dimension or search templates (e.g., 'Instagram Post' or 'Logo Design').",
      "Drag and drop premium graphics, illustrations, and stock images onto your canvas.",
      "Use the 'Brand Kit' to apply your brand colors and fonts in one click, and export as print-ready PDF, PNG, or MP4."
    ],
    gradient: "from-cyan-500 to-purple-600"
  },
  {
    name: "Leonardo AI",
    category: "AI Art & Creative",
    tag: "design",
    tagline: "Photorealistic AI image generation and editing.",
    badge: "Bonus",
    description: "Leonardo AI offers advanced image generation models, allowing you to create game assets, concept art, photorealistic portraits, and textures.",
    howToUse: [
      "Select a fine-tuned model (like Leonardo Vision or Absolute Reality) in the dashboard.",
      "Write a detailed descriptive prompt, and add negative prompts to exclude elements (like 'blurry').",
      "Adjust dimensions and generation counts, and click generate to create high-resolution images."
    ],
    gradient: "from-purple-700 to-pink-600"
  },
  {
    name: "Placeit",
    category: "Mockup & Branding",
    tag: "design",
    tagline: "Generate realistic mockups and logos in seconds.",
    description: "Placeit is a library of mockups, designs, logos, and videos. It lets you place your branding onto clothing, devices, and print materials.",
    howToUse: [
      "Browse or search for a mockup template (e.g., 'iPhone Mockup' or 'T-Shirt Mockup').",
      "Click 'Upload Image' to upload your design or screenshot.",
      "Observe the system rendering your design onto the mockup object, adjusted for perspective and shadow automatically."
    ],
    gradient: "from-blue-600 to-emerald-500"
  },
  {
    name: "Vista Create",
    category: "Graphic Design",
    tag: "design",
    tagline: "Custom templates and social media designs.",
    description: "Vista Create (formerly Crello) offers thousands of customizable templates and design layouts, specifically tailored for social media visual assets.",
    howToUse: [
      "Choose a format template (like 'Facebook Cover' or 'Pinterest Pin').",
      "Add animate graphics, backgrounds, and premium text styles from the sidebar.",
      "Export your completed work as PNG, JPG, or high-quality video files."
    ],
    gradient: "from-amber-500 to-rose-600"
  },
  {
    name: "Picsart",
    category: "Graphic Design",
    tag: "design",
    tagline: "Creative photo editor and AI collage maker.",
    badge: "Bonus",
    description: "Picsart is a mobile-first creative editor featuring AI background removers, image enhancers, artistic filters, and text layouts.",
    howToUse: [
      "Upload your photo to the Picsart editor space.",
      "Apply 'AI background removal' to cleanly isolate your subject.",
      "Add text layers, stickers, and apply filters to create professional marketing posters."
    ],
    gradient: "from-pink-500 to-fuchsia-600"
  },
  {
    name: "PhotoRoom",
    category: "Product Photography",
    tag: "design",
    tagline: "Studio-quality product photography with AI.",
    badge: "Bonus",
    description: "PhotoRoom is an AI-driven product photographer app. It isolates products and places them in studio-grade backgrounds with natural shadows.",
    howToUse: [
      "Upload a smartphone photo of your product.",
      "Wait for the AI to instantly strip the background with pixel-perfect accuracy.",
      "Select a background template (e.g., wood surface, marble slab, solid color) and adjust dynamic shadows."
    ],
    gradient: "from-sky-500 to-indigo-600"
  },
  {
    name: "PicMonkey",
    category: "Graphic Design",
    tag: "design",
    tagline: "Creative photo edits and social banners.",
    description: "PicMonkey is a design suite that excels at portrait touch-ups, banner designing, collage building, and image filters.",
    howToUse: [
      "Upload a portrait image and select 'Touch Up' tools for skin smoothing or teeth whitening.",
      "Add typography layers using their curated premium font library.",
      "Use graphics overlay tools to create custom badges, icons, and frames."
    ],
    gradient: "from-orange-500 to-pink-500"
  },
  {
    name: "Fotojet",
    category: "Graphic Design",
    tag: "design",
    tagline: "Quick, online collage maker and poster designer.",
    description: "Fotojet is an online graphic designer, photo collage maker, and photo editor that works directly in your web browser.",
    howToUse: [
      "Click 'Collage' and select a template layout grid.",
      "Upload your photos and drag-and-drop them into the corresponding grid cells.",
      "Add custom text labels, apply filters, and download or share your collage."
    ],
    gradient: "from-emerald-500 to-cyan-500"
  },
  {
    name: "Icons8",
    category: "Mockup & Branding",
    tag: "design",
    tagline: "All-in-one directory for design assets.",
    description: "Icons8 provides professional designers with custom icons, illustrations, photos, music tracks, and AI tools like face swappers.",
    howToUse: [
      "Search for an asset category or style (e.g. 'iOS style settings icon' or 'isometric tech illustration').",
      "Customize colors online using the Icons8 color picker tool.",
      "Download in SVG or PNG formats to use in your Figma, Adobe, or Canva designs."
    ],
    gradient: "from-blue-500 to-indigo-500"
  },
  {
    name: "Artistly",
    category: "AI Art & Creative",
    tag: "design",
    tagline: "Smart AI image generation for advertisements.",
    description: "Artistly is custom-tuned to generate high-converting advertising banners, social media marketing images, and product display art.",
    howToUse: [
      "Input a text prompt detailing the subject, lighting, and advertising layout you want.",
      "Select the style filter (e.g., Photographic, 3D Render, or vector illustration).",
      "Generate the banner, refine details, and add custom copy overlays."
    ],
    gradient: "from-pink-500 to-violet-600"
  },
  {
    name: "Slidebean",
    category: "Presentation & Design",
    tag: "design",
    tagline: "AI pitch decks and presentation layouts.",
    description: "Slidebean helps startups create professional pitch decks by separating presentation content writing from visual layout design.",
    howToUse: [
      "Type the outline and content of your slides in the 'Outline' view.",
      "Switch to the 'Design' view and click the AI design engine.",
      "Let Slidebean organize column alignments, images, and text fonts automatically based on your brand rules."
    ],
    gradient: "from-red-500 to-amber-600"
  },
  {
    name: "Beautiful AI",
    category: "Presentation & Design",
    tag: "design",
    tagline: "Smart presentations that design themselves.",
    description: "Beautiful AI uses layout templates with built-in design rules. When you add content, the slides automatically scale and align to keep design standards.",
    howToUse: [
      "Select a slide template layout (e.g. comparisons, timelines, charts).",
      "Add your text and upload images to see the boxes auto-resize dynamically.",
      "Apply brand colors to instantly update the color palette of the entire presentation deck."
    ],
    gradient: "from-cyan-600 to-teal-500"
  },

  // --- Video Production & Editing ---
  {
    name: "CapCut",
    category: "Video Production",
    tag: "video",
    tagline: "Professional video editing with filters and auto-captions.",
    description: "CapCut is a highly popular video editor packed with transitions, overlays, audio libraries, keyframe animations, and automated speech-to-text captions.",
    howToUse: [
      "Import your video clips, drag them to the timeline track, and slice unwanted segments.",
      "Go to 'Text' -> 'Auto Captions' to generate synchronized subtitles for voiceovers in seconds.",
      "Add trending filters, transitions, and audio tracks, then export in up to 4K resolution."
    ],
    gradient: "from-black to-slate-800"
  },
  {
    name: "VidIQ Boost",
    category: "Video Production",
    tag: "video",
    tagline: "Optimize and boost your YouTube videos.",
    badge: "Bonus",
    description: "VidIQ is a YouTube SEO utility that highlights keyword volumes, search trends, competitor tags, and provides title ideas using AI.",
    howToUse: [
      "Use the 'Keyword Research' search to check keyword search volume vs competition scores.",
      "Check the 'Competitor' tracking tab to spy on trending videos in your specific niche.",
      "Optimize your video uploads by applying suggested high-volume SEO tags and title outlines."
    ],
    gradient: "from-blue-600 to-violet-600"
  },
  {
    name: "Storybase",
    category: "Video Production",
    tag: "video",
    tagline: "Outline video content matching search intents.",
    description: "Storybase maps out exact search queries, demographics, and questions users search online to help you structure viral video scripts.",
    howToUse: [
      "Search a primary topic term (e.g. 'earn money online' or 'AI editing').",
      "Filter the results by 'Questions' and 'Phrases' to list exact search queries.",
      "Structure your video script to answer these search queries directly to gain SEO traction."
    ],
    gradient: "from-emerald-500 to-sky-600"
  },
  {
    name: "Epidemic Sound",
    category: "Video Production",
    tag: "video",
    tagline: "Royalty-free music database for creators.",
    description: "Epidemic Sound provides thousands of copyright-cleared music tracks and sound effects, protecting content creators from copyright claims.",
    howToUse: [
      "Search the music library by genre, mood, tempo, or primary instrument.",
      "Connect your social channels (YouTube, TikTok, Instagram) in the account dashboard.",
      "Download files and add them to your edits; the connected channels will be automatically whitelisted from copyright flags."
    ],
    gradient: "from-rose-500 to-pink-600"
  }
];

export function GuidePage() {
  const [activeTab, setActiveTab] = useState<"all" | "seo" | "writing" | "design" | "video">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTool, setSelectedTool] = useState<ToolInfo | null>(null);

  const filteredTools = toolsList.filter((tool) => {
    const matchesTab = activeTab === "all" || tool.tag === activeTab;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-24 md:py-32">
      {/* soft ambient glow background elements */}
      <div className="pointer-events-none absolute -left-24 top-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <BookOpen size={12} /> Tools Directory & Guide
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            AI & Digital Tools Playbook
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Explore our curated directory of premium digital platforms. Discover which tools are best suited for your workflows and learn exactly how to use them to accelerate your content, design, SEO, and video creation.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row">
          {/* Tab buttons */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {(["all", "seo", "writing", "design", "video"] as const).map((tab) => {
              const labels = {
                all: "All Playbooks",
                seo: "SEO & Search",
                writing: "Content & Writing",
                design: "Design & Creative",
                video: "Video Production"
              };
              const icons = {
                all: Sparkles,
                seo: SearchCode,
                writing: FileText,
                design: Palette,
                video: Video
              };
              const Icon = icons[tab];
              const isActive = activeTab === tab;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-[0_4px_16px_-4px_rgba(109,110,176,0.6)]"
                      : "border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                  }`}
                >
                  <Icon size={12} />
                  {labels[tab]}
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tools by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-white/15 bg-white/5 py-2 pl-9 pr-4 text-xs text-foreground placeholder-muted-foreground focus:border-primary/50 focus:bg-white/10 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Tools grid */}
        {filteredTools.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <div
                key={tool.name}
                onClick={() => setSelectedTool(tool)}
                className="acrylic-card group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className={`acrylic-mark bg-gradient-to-br ${tool.gradient}`}>
                      {tool.name.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate font-display text-[15px] font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                        {tool.name}
                      </div>
                      <div className="truncate text-[11px] uppercase tracking-wide text-muted-foreground">
                        {tool.category}
                      </div>
                    </div>
                    {tool.badge && (
                      <span className="acrylic-badge ml-auto bg-primary/20 text-primary border-primary/30">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-4 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {tool.tagline}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-3 text-[11px] font-semibold text-primary">
                  <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <Info size={12} /> Playbook & Guide
                  </span>
                  <span className="rounded bg-white/5 px-2 py-0.5 text-white/50 text-[10px]">Read Playbook</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-20 text-center text-muted-foreground">
            <p className="text-base">No tools found matching your search filters.</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveTab("all"); }}
              className="mt-4 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-foreground hover:bg-white/10"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Modal Popup with AnimatePresence */}
      <AnimatePresence>
        {selectedTool && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* dark backdrop blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTool(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md"
            />

            {/* modal container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/20 bg-background/95 p-6 shadow-2xl md:p-8"
            >
              {/* modal close button */}
              <button
                onClick={() => setSelectedTool(null)}
                className="absolute right-4 top-4 rounded-xl border border-white/10 bg-white/5 p-2 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>

              {/* modal content */}
              <div>
                <div className="flex items-center gap-4">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-bold text-white bg-gradient-to-br ${selectedTool.gradient}`}>
                    {selectedTool.name.charAt(0)}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {selectedTool.name}
                    </h3>
                    <p className="text-xs uppercase tracking-wide text-primary font-semibold">
                      {selectedTool.category}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/15 pt-5 space-y-5">
                  {/* description section */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      What is it used for?
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                      {selectedTool.description}
                    </p>
                  </div>

                  {/* how to use section */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      How to use it? (Step-by-Step Playbook)
                    </h4>
                    <ul className="mt-3 space-y-3.5">
                      {selectedTool.howToUse.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                            {idx + 1}
                          </span>
                          <span className="text-xs leading-relaxed text-foreground/80">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* cta link */}
                <div className="mt-8 flex justify-end gap-3 border-t border-white/10 pt-5">
                  <button
                    onClick={() => setSelectedTool(null)}
                    className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all"
                  >
                    Close Playbook
                  </button>
                  <a
                    href="/#tools"
                    onClick={() => setSelectedTool(null)}
                    className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-semibold text-white shadow-lg transition-transform hover:scale-[1.02]"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    Get Subscription <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
