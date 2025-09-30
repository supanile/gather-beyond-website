import { 
  GatherScore, 
  TokenHealth, 
  SocialSignals, 
  SuperScore, 
  AIRiskAssessment, 
  ProjectActions,
  ScoreLabel,
  RiskLevel 
} from "@/types/gatherDashboard";

// Generate realistic gather scores based on project characteristics
export function generateGatherScore(projectId: number): GatherScore {
  // Use project ID to create consistent but varied scores
  const seed = projectId * 7 + 13;
  const baseScore = 50 + (seed % 40); // 50-90 range
  
  const trust = Math.max(20, Math.min(100, baseScore + (seed % 20) - 10));
  const transparency = Math.max(20, Math.min(100, baseScore + ((seed * 2) % 25) - 12));
  const sentiment = Math.max(20, Math.min(100, baseScore + ((seed * 3) % 30) - 15));
  const community = Math.max(20, Math.min(100, baseScore + ((seed * 5) % 20) - 10));
  const technical = Math.max(20, Math.min(100, baseScore + ((seed * 7) % 25) - 12));
  
  const overall = Math.round((trust + transparency + sentiment + community + technical) / 5);
  
  let label: ScoreLabel;
  if (overall >= 85) label = 'Excellent';
  else if (overall >= 70) label = 'Good';
  else if (overall >= 55) label = 'Moderate';
  else if (overall >= 35) label = 'Risky';
  else label = 'Dangerous';

  return {
    overall,
    trust,
    transparency,
    sentiment,
    community,
    technical,
    label
  };
}

export function generateTokenHealth(projectId: number): TokenHealth {
  const seed = projectId * 11 + 7;
  
  const topHoldersPercentage = 15 + (seed % 40); // 15-55%
  const totalHolders = 1000 + (seed % 50000); // 1K-51K holders
  const liquidity = 100000 + (seed % 2000000); // $100K-$2.1M
  
  const unlockDays = 7 + (seed % 90); // 7-97 days
  const unlockAmount = ["13K", "25K", "100K", "500K", "1M"][seed % 5];
  
  const contractAge = 30 + (seed % 365); // 30-395 days
  
  return {
    topHoldersPercentage,
    totalHolders,
    liquidity,
    liquidityFormatted: formatCurrency(liquidity),
    nextUnlock: {
      date: new Date(Date.now() + unlockDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: unlockAmount,
      daysUntil: unlockDays
    },
    contractAge,
    contractAgeFormatted: formatDays(contractAge)
  };
}

export function generateSocialSignals(projectId: number): SocialSignals {
  const seed = projectId * 13 + 5;
  
  return {
    twitter: {
      value: 1000 + (seed % 10000),
      trend: (seed % 3 === 0) ? 'up' : (seed % 3 === 1) ? 'down' : 'stable',
      percentage: 5 + (seed % 30),
      isStable: (seed % 4) === 0
    },
    google: {
      value: 40 + (seed % 60),
      trend: ((seed * 2) % 3 === 0) ? 'up' : ((seed * 2) % 3 === 1) ? 'down' : 'stable',
      percentage: 10 + ((seed * 2) % 25),
      isStable: ((seed * 2) % 5) === 0
    },
    discord: {
      members: 500 + (seed % 15000),
      growth: 5 + (seed % 25),
      engagement: 60 + (seed % 35)
    },
    telegram: {
      members: 300 + (seed % 12000),
      growth: 3 + (seed % 20),
      engagement: 55 + (seed % 40)
    }
  };
}

export function generateSuperScore(projectId: number): SuperScore {
  const seed = projectId * 17 + 3;
  
  const totalUsers = 1000 + (seed % 20000);
  const missionsCompleted = totalUsers * (5 + (seed % 50)); // 5-55 missions per user avg
  
  const trustActions = [
    "Wallet Verification",
    "Community Engagement", 
    "Project Review",
    "Social Validation",
    "Technical Assessment"
  ];
  
  return {
    average: 60 + (seed % 35),
    totalUsers,
    totalUsersFormatted: formatNumber(totalUsers),
    missionsCompleted,
    missionsCompletedFormatted: formatNumber(missionsCompleted),
    aggregateRate: 25 + (seed % 50),
    trustActions: trustActions.slice(0, 2 + (seed % 3))
  };
}

export function generateAIAssessment(gatherScore: GatherScore): AIRiskAssessment {
  let riskLevel: RiskLevel;
  let summary: string;
  const flags: string[] = [];
  const recommendations: string[] = [];
  
  if (gatherScore.overall >= 80) {
    riskLevel = 'low';
    summary = "Strong fundamentals with excellent community trust and transparent operations. Well-positioned for sustained growth.";
    recommendations.push("Consider for long-term investment");
    recommendations.push("Monitor for scaling opportunities");
  } else if (gatherScore.overall >= 65) {
    riskLevel = 'medium';
    summary = "Solid project with good community backing. Some areas for improvement in transparency or technical implementation.";
    if (gatherScore.transparency < 70) flags.push("Transparency concerns");
    if (gatherScore.technical < 70) flags.push("Technical implementation needs review");
    recommendations.push("Review technical roadmap");
    recommendations.push("Monitor transparency improvements");
  } else if (gatherScore.overall >= 45) {
    riskLevel = 'high';
    summary = "Mixed signals with notable risk factors. Exercise caution and conduct thorough due diligence.";
    if (gatherScore.trust < 60) flags.push("Trust score concerns");
    if (gatherScore.community < 60) flags.push("Weak community engagement");
    recommendations.push("Conduct additional due diligence");
    recommendations.push("Wait for score improvements");
  } else {
    riskLevel = 'critical';
    summary = "Significant risk factors detected. High caution recommended with multiple areas of concern.";
    flags.push("Multiple risk factors");
    flags.push("Low trust score");
    recommendations.push("Avoid until major improvements");
    recommendations.push("Consider alternative projects");
  }
  
  return {
    summary,
    riskLevel,
    flags,
    recommendations
  };
}

export function generateProjectActions(projectId: number): ProjectActions {
  return {
    canVisit: true,
    canJoinCampaign: projectId % 3 !== 0, // ~67% have campaigns
    isBookmarked: projectId % 5 === 0, // ~20% bookmarked
    canCompare: true
  };
}

// Utility formatting functions
function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount}`;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`;
  }
  return num.toString();
}

function formatDays(days: number): string {
  if (days >= 365) {
    const years = Math.floor(days / 365);
    return `${years}y ${days % 365}d`;
  } else if (days >= 30) {
    const months = Math.floor(days / 30);
    return `${months}mo ${days % 30}d`;
  }
  return `${days} days`;
}
