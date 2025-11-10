import {
  TwitterTrend,
  TrendsData,
  TrendWithStats,
  TrendsMetrics,
} from "@/types/trends";

// Mock trending topics with realistic data
const mockHashtags = [
  "#GiftAGamer",
  "#AskCuppyAnything",
  "#givethanks",
  "#StreamLifeGoesOn",
  "#TransDayOfRemembrance",
  "#BlackFriday",
  "#TechTrends",
  "#CryptoNews",
  "#AI2024",
  "#WebDev",
  "#ReactJS",
  "#NextJS",
  "#TypeScript",
  "#TailwindCSS",
  "#CyberMonday",
  "#SmallBizSaturday",
  "#GivingTuesday",
  "#HolidayShopping",
  "#TechLife",
  "#CodeNewbie",
  "#100DaysOfCode",
  "#DevCommunity",
  "#Programming",
  "#JavaScript",
  "#Python",
  "#MachineLearning",
  "#DataScience",
  "#CloudComputing",
  "#Cybersecurity",
  "#BlockchainTech",
  "#NFTCommunity",
  "#DeFi",
  "#Web3",
  "#MetaverseLife",
  "#GamingNews",
  "#Esports",
  "#StreamerLife",
  "#TwitchTV",
  "#YouTubeGaming",
  "#MobileGaming",
  "#PCGaming",
  "#PlayStation",
  "#Xbox",
  "#NintendoSwitch",
  "#Gaming2024",
  "#IndieGames",
  "#GameDev",
  "#UnrealEngine",
  "#Unity3D",
  "#DigitalArt",
  "#GraphicDesign",
  "#UIDesign",
  "#UXDesign",
  "#ProductDesign",
  "#BrandingDesign",
  "#CreativeAgency",
  "#ContentCreator",
  "#SocialMediaMarketing",
  "#InfluencerLife",
  "#DigitalMarketing",
  "#SEO",
  "#ContentStrategy",
  "#EmailMarketing",
  "#GrowthHacking",
  "#StartupLife",
  "#Entrepreneurship",
  "#BusinessTips",
  "#Leadership",
  "#Innovation",
  "#FutureOfWork",
  "#RemoteWork",
  "#WorkFromHome",
  "#Productivity",
  "#TimeManagement",
  "#SelfImprovement",
  "#PersonalGrowth",
  "#Motivation",
  "#SuccessMindset",
  "#HealthTech",
  "#FitnessJourney",
  "#WellnessWednesday",
  "#MentalHealthMatters",
  "#SelfCare",
  "#Mindfulness",
  "#Meditation",
  "#YogaLife",
  "#PlantBased",
  "#Sustainability",
  "#ClimateAction",
  "#GreenLiving",
  "#EcoFriendly",
  "#RenewableEnergy",
  "#ElectricVehicles",
  "#CleanTech",
  "#SmartCity",
  "#IoT",
  "#5GTechnology",
  "#QuantumComputing",
  "#EdgeComputing",
  "#DevOps",
  "#Kubernetes",
  "#Docker",
  "#Serverless",
  "#APIDesign",
  "#MicroServices",
  "#FullStackDev",
  "#ArtificialIntelligence",
  "#MachineLearning",
  "#DeepLearning",
  "#NeuralNetworks",
  "#ComputerVision",
  "#NaturalLanguageProcessing",
  "#Robotics",
  "#AutomationTech",
  "#DigitalTransformation",
  "#TechInnovation",
  "#SoftwareDevelopment",
  "#WebDevelopment",
  "#MobileDev",
  "#AppDevelopment",
  "#FrontendDev",
  "#BackendDev",
  "#DatabaseDesign",
  "#SystemArchitecture",
  "#TechStack",
  "#OpenSource",
  "#GitHubTrends",
  "#CodeReview",
  "#TechCommunity",
  "#DeveloperLife",
  "#TechCareer",
  "#DigitalNomad",
  "#TechStartup",
  "#VentureCapital",
  "#AngelInvestor",
  "#TechFunding",
  "#IPO2024",
  "#StockMarket",
  "#CryptoTrading",
  "#BlockchainDev",
  "#SmartContracts",
  "#DApps",
  "#Web3Dev",
  "#DigitalAssets",
  "#TechPolicy",
  "#DataPrivacy",
  "#GDPR",
  "#TechRegulation",
  "#DigitalRights"
];

const mockTopics = [
  "Carrefour",
  "Mourão",
  "Taysom Hill",
  "Geraldo",
  "Apple Event",
  "Tesla",
  "OpenAI",
  "Microsoft",
  "Google",
  "Netflix",
  "Amazon",
  "Twitter",
  "Meta",
  "SpaceX",
  "Bitcoin",
  "Ethereum",
  "Nvidia",
  "Samsung",
  "Sony",
  "Adobe",
  "Salesforce",
  "Oracle",
  "IBM",
  "Intel",
  "AMD",
  "Qualcomm",
  "PayPal",
  "Stripe",
  "Square",
  "Coinbase",
  "Binance",
  "Shopify",
  "WordPress",
  "Wix",
  "Squarespace",
  "Figma",
  "Canva",
  "Notion",
  "Slack",
  "Zoom",
  "Discord",
  "Reddit",
  "Pinterest",
  "Snapchat",
  "TikTok",
  "Instagram",
  "YouTube",
  "LinkedIn",
  "GitHub",
  "GitLab",
  "Bitbucket",
  "Stack Overflow",
  "Medium",
  "Substack",
  "Patreon",
  "OnlyFans",
  "Spotify",
  "Apple Music",
  "Disney+",
  "HBO Max",
  "Paramount+",
  "Hulu",
  "Prime Video",
  "Twitch",
  "Steam",
  "Epic Games",
  "Roblox",
  "Minecraft",
  "Fortnite",
  "Call of Duty",
  "League of Legends",
  "Valorant",
  "Apex Legends",
  "Overwatch",
  "Genshin Impact",
  "FIFA",
  "NBA 2K",
  "Madden NFL",
  "Grand Theft Auto",
  "Red Dead Redemption",
  "Cyberpunk",
  "The Last of Us",
  "God of War",
  "Zelda",
  "Mario",
  "Pokemon",
  "ChatGPT",
  "Gemini",
  "Claude AI",
  "Midjourney",
  "DALL-E",
  "Stable Diffusion",
  "Anthropic",
  "DeepMind",
  "Hugging Face",
  "LangChain",
  "Vector Database",
  "RAG Systems",
  "LLM Training",
  "Prompt Engineering",
  "ChatGPT-4",
  "GPT-5",
  "Bard AI",
  "Bing Chat",
  "Character AI",
  "Replika",
  "Jasper AI",
  "Copy.ai",
  "Grammarly",
  "Notion AI",
  "GitHub Copilot",
  "TabNine",
  "Replit",
  "CodePen",
  "JSFiddle",
  "Observable",
  "Jupyter",
  "Colab",
  "Kaggle",
  "DataCamp",
  "Coursera",
  "Udemy",
  "edX",
  "Pluralsight",
  "Frontend Masters",
  "Egghead",
  "Codecademy",
  "FreeCodeCamp",
  "The Odin Project",
  "Mozilla Developer",
  "W3Schools",
  "CSS-Tricks",
  "Smashing Magazine",
  "A List Apart",
  "Dev.to",
  "Hashnode",
  "CodeNewbie",
  "Indie Hackers",
  "Product Hunt",
  "Hacker News",
  "TechCrunch",
  "The Verge",
  "Ars Technica",
  "Wired",
  "MIT Technology Review",
  "IEEE Spectrum",
  "ACM",
  "ArXiv",
  "Nature Tech",
  "Science Magazine"
];

const generateHistoricalData = (baseVolume: number, days: number = 30) => {
  const data = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const volatility = 0.3; // 30% volatility
    const randomFactor = 1 + (Math.random() - 0.5) * volatility;
    const volume = Math.max(0, Math.floor(baseVolume * randomFactor));

    data.push({
      timestamp: date.toISOString(),
      volume,
    });
  }

  return data;
};

const calculateMomentumScore = (historical: Array<{ volume: number }>) => {
  if (historical.length < 7) return 0;

  const recent = historical.slice(-7);
  const older = historical.slice(-14, -7);

  const recentAvg =
    recent.reduce((sum, d) => sum + d.volume, 0) / recent.length;
  const olderAvg = older.reduce((sum, d) => sum + d.volume, 0) / older.length;

  if (olderAvg === 0) return 0;
  return ((recentAvg - olderAvg) / olderAvg) * 100;
};

const calculateVolumeChange = (
  current: number,
  historical: Array<{ timestamp: string; volume: number }>,
  days: number
) => {
  if (historical.length < days) return 0;

  const pastData = historical[historical.length - days - 1];
  if (!pastData || pastData.volume === 0) return 0;

  return ((current - pastData.volume) / pastData.volume) * 100;
};

export const generateMockTrendsData = (): TrendsData => {
  const trends: TwitterTrend[] = [];
  const usedNames = new Set<string>();

  // Helper function to get unique name
  const getUniqueName = (source: string[]) => {
    let attempts = 0;
    while (attempts < 50) {
      const name = source[Math.floor(Math.random() * source.length)];
      if (!usedNames.has(name)) {
        usedNames.add(name);
        return name;
      }
      attempts++;
    }
    // Fallback: generate with timestamp
    const name = source[Math.floor(Math.random() * source.length)] + "_" + Date.now();
    usedNames.add(name);
    return name;
  };

  // Generate Top 20 - High volume hashtag trends
  for (let i = 0; i < 20; i++) {
    const name = getUniqueName(mockHashtags);
    trends.push({
      name,
      url: `http://twitter.com/search?q=${encodeURIComponent(name)}`,
      promoted_content: Math.random() > 0.95 ? "Promoted" : null,
      query: encodeURIComponent(name),
      tweet_volume: Math.floor(Math.random() * 900000) + 100000, // 100K-1M
    });
  }

  // Generate Top 21-50 - Medium volume trends
  for (let i = 0; i < 30; i++) {
    const name = getUniqueName([...mockTopics, ...mockHashtags]);
    trends.push({
      name,
      url: `http://twitter.com/search?q=${encodeURIComponent(name)}`,
      promoted_content: Math.random() > 0.98 ? "Promoted" : null,
      query: encodeURIComponent(name),
      tweet_volume: Math.floor(Math.random() * 80000) + 20000, // 20K-100K
    });
  }

  // Generate Top 51-100 - Lower volume trends
  for (let i = 0; i < 50; i++) {
    const name = getUniqueName([...mockTopics, ...mockHashtags]);
    trends.push({
      name,
      url: `http://twitter.com/search?q=${encodeURIComponent(name)}`,
      promoted_content: null,
      query: encodeURIComponent(name),
      tweet_volume: Math.floor(Math.random() * 18000) + 2000, // 2K-20K
    });
  }

  return {
    trends: trends.slice(0, 100), // Generate 100 trends
    as_of: new Date().toISOString(),
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    locations: [{ name: "Worldwide", woeid: 1 }],
  };
};

export const processTrendsData = (data: TrendsData): TrendsMetrics => {
  const trendsWithVolume = data.trends.filter(
    (trend) => trend.tweet_volume !== null
  );
  const totalVolume = trendsWithVolume.reduce(
    (sum, trend) => sum + (trend.tweet_volume || 0),
    0
  );

  const processedTrends: TrendWithStats[] = data.trends.map((trend, index) => {
    const volume = trend.tweet_volume || 0;
    const historical = generateHistoricalData(volume);
    const momentum = calculateMomentumScore(historical);

    // Generate more realistic volume changes for stock-like visualization
    let volumeChange24h: number;
    const rand = Math.random();
    if (rand < 0.15) {
      // 15% chance for strong positive (>10%)
      volumeChange24h = 10 + Math.random() * 40; // 10% to 50%
    } else if (rand < 0.35) {
      // 20% chance for positive (1% to 10%)
      volumeChange24h = 1 + Math.random() * 9; // 1% to 10%
    } else if (rand < 0.65) {
      // 30% chance for stable (-1% to 1%)
      volumeChange24h = -1 + Math.random() * 2; // -1% to 1%
    } else if (rand < 0.85) {
      // 20% chance for negative (-10% to -1%)
      volumeChange24h = -10 + Math.random() * 9; // -10% to -1%
    } else {
      // 15% chance for strong negative (<-10%)
      volumeChange24h = -50 + Math.random() * 40; // -50% to -10%
    }

    let category: "high" | "medium" | "low" | "null" = "null";
    if (volume > 100000) category = "high";
    else if (volume > 50000) category = "medium";
    else if (volume > 0) category = "low";

    return {
      ...trend,
      id: `trend-${index}`,
      volume_change_24h: volumeChange24h,
      volume_change_7d: calculateVolumeChange(volume, historical, 7),
      volume_change_30d: calculateVolumeChange(volume, historical, 30),
      momentum_score: momentum,
      rank: index + 1,
      percentage: totalVolume > 0 ? (volume / totalVolume) * 100 : 0,
      category,
      historical_data: historical,
    };
  });

  // Sort by volume descending
  processedTrends.sort((a, b) => (b.tweet_volume || 0) - (a.tweet_volume || 0));

  // Update ranks after sorting
  processedTrends.forEach((trend, index) => {
    trend.rank = index + 1;
  });

  const top_gainers = processedTrends
    .filter((t) => t.volume_change_24h && t.volume_change_24h > 0)
    .sort((a, b) => (b.volume_change_24h || 0) - (a.volume_change_24h || 0))
    .slice(0, 10);

  const top_losers = processedTrends
    .filter((t) => t.volume_change_24h && t.volume_change_24h < 0)
    .sort((a, b) => (a.volume_change_24h || 0) - (b.volume_change_24h || 0))
    .slice(0, 10);

  const trending_up = processedTrends
    .filter((t) => t.momentum_score > 10)
    .sort((a, b) => b.momentum_score - a.momentum_score)
    .slice(0, 10);

  const trending_down = processedTrends
    .filter((t) => t.momentum_score < -10)
    .sort((a, b) => a.momentum_score - b.momentum_score)
    .slice(0, 10);

  return {
    total_volume: totalVolume,
    top_gainers,
    top_losers,
    trending_up,
    trending_down,
  };
};

export const formatTweetVolume = (volume: number | null): string => {
  if (volume === null) return "N/A";
  if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
  if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
  return volume.toString();
};

export const formatPercentageChange = (change: number): string => {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
};
