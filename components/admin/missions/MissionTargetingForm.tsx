import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Target,
  Send,
  X,
  TrendingUp,
  Activity,
  Eye,
  Zap,
  Building,
  CalendarIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Define interfaces
interface BehaviorFilters {
  xpLevel: { enabled: boolean; min: number; max: number };
  missionStreak: { enabled: boolean; value: number };
  lastActive: { enabled: boolean; value: string };
  failedMissions: { enabled: boolean; value: number };
  trustScore: { enabled: boolean; value: number[] };
  connectedWallet: { enabled: boolean; value: boolean };
  joinedViaPartner: { enabled: boolean; value: string };
  referredUsers: { enabled: boolean; value: number };
  agentHealth: { enabled: boolean; value: number[] };
  memoryProofSubmitted: { enabled: boolean; value: boolean };
  taggedInterests: { enabled: boolean; value: string[] };
}

interface DemographicFilters {
  location: string[];
  language: string[];
  ageRange: string;
  gender: string;
}

interface DeliveryOptions {
  channel: string;
  scope: string;
  schedule: string;
  scheduledDate: string;
}

interface MissionTargetingData {
  audienceType: "global" | "custom";
  behaviorFilters: BehaviorFilters;
  demographicFilters: DemographicFilters;
  deliveryOptions: DeliveryOptions;
}

interface UserSegment {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  description: string;
  estimatedCount: number;
  percentage: number;
  conditions: string[];
}

interface AudienceEstimate {
  totalReach: number;
  segments: UserSegment[];
  channels: {
    discord: number;
    telegram: number;
    groups: number;
  };
}

// Enhanced mock base user data for calculations
const BASE_USER_DATA = {
  total: 15420,
  bySegment: {
    builder: 4850,
    degen: 4320,
    explorer: 3680,
    grinder: 1890,
    lurker: 680,
  },
  byChannel: {
    discord: 8900,
    telegram: 5200,
    line: 1320,
  },
  // Additional data for enhanced calculations
  behavioral: {
    highXP: 6200, // XP > 50
    connectedWallet: 6476, // 42% have wallets
    activeRecently: 2313, // Active today/3 days
    highReferrals: 1542, // 3+ referrals
    memoryProofSubmitted: 4626, // 30% submitted
    highTrustScore: 7710, // Trust > 70
    highMissionStreak: 3084, // Streak > 10
    manyFailedMissions: 2313, // Failed > 3
    taggedDegen: 2313, // Tagged with degen interests
    recentlyJoined: 4626, // Joined < 30 days
    inactive7Plus: 1542, // Inactive 7+ days
  },
};

// Interest tags for degen classification
const DEGEN_INTEREST_TAGS = [
  "trading",
  "airdrops",
  "defi",
  "farming",
  "memecoin",
  "alpha",
  "ido",
  "nft-flipping",
  "arbitrage",
  "leverage",
];

interface MissionTargetingFormProps {
  onTargetingChange?: (targeting: MissionTargetingData) => void;
  initialData?: MissionTargetingData | null;
}

const MissionTargetingForm: React.FC<MissionTargetingFormProps> = ({
  onTargetingChange,
  initialData,
}) => {
  // Enhanced default behavior filters
  const defaultBehaviorFilters: BehaviorFilters = {
    xpLevel: { enabled: false, min: 0, max: 100 },
    missionStreak: { enabled: false, value: 0 },
    lastActive: { enabled: false, value: "today" },
    failedMissions: { enabled: false, value: 0 },
    trustScore: { enabled: false, value: [50] },
    connectedWallet: { enabled: false, value: false },
    joinedViaPartner: { enabled: false, value: "" },
    referredUsers: { enabled: false, value: 0 },
    agentHealth: { enabled: false, value: [50] },
    memoryProofSubmitted: { enabled: false, value: false },
    taggedInterests: { enabled: false, value: [] },
  };

  const defaultDemographicFilters: DemographicFilters = {
    location: [],
    language: [],
    ageRange: "",
    gender: "",
  };

  const defaultDeliveryOptions: DeliveryOptions = {
    channel: "discord",
    scope: "group",
    schedule: "immediate",
    scheduledDate: "",
  };

  // Targeting state
  const [audienceType, setAudienceType] = useState<"global" | "custom">(
    initialData?.audienceType || "global"
  );

  const [behaviorFilters, setBehaviorFilters] = useState<BehaviorFilters>(
    initialData?.behaviorFilters || defaultBehaviorFilters
  );

  const [demographicFilters, setDemographicFilters] =
    useState<DemographicFilters>(
      initialData?.demographicFilters || defaultDemographicFilters
    );

  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOptions>(
    initialData?.deliveryOptions || defaultDeliveryOptions
  );

  // Enhanced segment classification logic following your requirements
  const classifyUserSegments = (filters: BehaviorFilters): UserSegment[] => {
    // Calculate base filtering multipliers
    let totalFilteredUsers = BASE_USER_DATA.total;

    // Apply behavioral filters to reduce total pool
    if (filters.xpLevel.enabled) {
      const xpRange = (filters.xpLevel.max - filters.xpLevel.min) / 100;
      totalFilteredUsers *= Math.max(0.1, xpRange);
    }

    if (filters.trustScore.enabled) {
      const trustMultiplier = 0.3 + (filters.trustScore.value[0] / 100) * 0.7;
      totalFilteredUsers *= trustMultiplier;
    }

    if (filters.lastActive.enabled) {
      const activeMultipliers = {
        today: 0.15,
        "3days": 0.35,
        "7days": 0.65,
        inactive: 0.1,
      };
      totalFilteredUsers *=
        activeMultipliers[
          filters.lastActive.value as keyof typeof activeMultipliers
        ] || 1;
    }

    if (filters.connectedWallet.enabled) {
      totalFilteredUsers *= filters.connectedWallet.value ? 0.42 : 0.58;
    }

    if (filters.referredUsers.enabled && filters.referredUsers.value > 0) {
      const referralMultiplier = Math.min(
        0.1 + (filters.referredUsers.value / 10) * 0.9,
        1
      );
      totalFilteredUsers *= referralMultiplier;
    }

    // Apply demographic filters
    if (demographicFilters.location.length > 0) {
      const locationMultiplier = Math.min(
        demographicFilters.location.length * 0.08,
        0.8
      );
      totalFilteredUsers *= locationMultiplier;
    }

    if (demographicFilters.language.length > 0) {
      const langMultiplier = Math.min(
        demographicFilters.language.length * 0.12,
        0.9
      );
      totalFilteredUsers *= langMultiplier;
    }

    // Enhanced segment logic based on your requirements
    const calculateSegmentScore = {
      explorer: () => {
        let score = 0;
        const conditions: string[] = [];

        // Low XP condition
        if (!filters.xpLevel.enabled || filters.xpLevel.max <= 30) {
          score += 0.4;
          conditions.push("Low XP (≤30)");
        }

        // Recently joined (assume based on low XP or not filtered)
        if (!filters.xpLevel.enabled || filters.xpLevel.max <= 20) {
          score += 0.3;
          conditions.push("Recently joined");
        }

        // No wallet yet
        if (
          !filters.connectedWallet.enabled ||
          !filters.connectedWallet.value
        ) {
          score += 0.2;
          conditions.push("No wallet connected");
        }

        // Some activity (recently active)
        if (
          filters.lastActive.enabled &&
          ["today", "3days"].includes(filters.lastActive.value)
        ) {
          score += 0.15;
          conditions.push("Recently active");
        }

        return { score: Math.min(score, 0.45), conditions };
      },

      builder: () => {
        let score = 0;
        const conditions: string[] = [];

        // High XP
        if (filters.xpLevel.enabled && filters.xpLevel.min >= 50) {
          score += 0.35;
          conditions.push("High XP (≥50)");
        }

        // High mission streak
        if (
          filters.missionStreak.enabled &&
          filters.missionStreak.value >= 10
        ) {
          score += 0.25;
          conditions.push("High mission streak (≥10)");
        }

        // Wallet connected
        if (filters.connectedWallet.enabled && filters.connectedWallet.value) {
          score += 0.2;
          conditions.push("Wallet connected");
        }

        // Memory proof submitted
        if (
          filters.memoryProofSubmitted.enabled &&
          filters.memoryProofSubmitted.value
        ) {
          score += 0.15;
          conditions.push("Memory proof submitted");
        }

        // High trust score
        if (filters.trustScore.enabled && filters.trustScore.value[0] >= 70) {
          score += 0.1;
          conditions.push("High trust score (≥70)");
        }

        return { score: Math.min(score, 0.55), conditions };
      },

      grinder: () => {
        let score = 0;
        const conditions: string[] = [];

        // High XP but low trust
        if (filters.xpLevel.enabled && filters.xpLevel.min >= 40) {
          score += 0.25;
          conditions.push("High XP (≥40)");
        }

        if (filters.trustScore.enabled && filters.trustScore.value[0] < 50) {
          score += 0.3;
          conditions.push("Low trust score (<50)");
        }

        // Many missions failed
        if (
          filters.failedMissions.enabled &&
          filters.failedMissions.value <= 3
        ) {
          score += 0.25;
          conditions.push("Some failed missions");
        }

        // Often active
        if (
          filters.lastActive.enabled &&
          ["today", "3days"].includes(filters.lastActive.value)
        ) {
          score += 0.15;
          conditions.push("Often active");
        }

        return { score: Math.min(score, 0.25), conditions };
      },

      lurker: () => {
        let score = 0;
        const conditions: string[] = [];

        // Inactive for 7+ days
        if (
          filters.lastActive.enabled &&
          filters.lastActive.value === "inactive"
        ) {
          score += 0.4;
          conditions.push("Inactive 7+ days");
        }

        // Low XP
        if (filters.xpLevel.enabled && filters.xpLevel.max <= 20) {
          score += 0.3;
          conditions.push("Low XP (≤20)");
        }

        // No engagement (low mission streak)
        if (
          !filters.missionStreak.enabled ||
          filters.missionStreak.value === 0
        ) {
          score += 0.2;
          conditions.push("No engagement");
        }

        return { score: Math.min(score, 0.15), conditions };
      },

      degen: () => {
        let score = 0;
        const conditions: string[] = [];

        // High referral count
        if (filters.referredUsers.enabled && filters.referredUsers.value >= 3) {
          score += 0.3;
          conditions.push("High referrals (≥3)");
        }

        // Connected wallet
        if (filters.connectedWallet.enabled && filters.connectedWallet.value) {
          score += 0.25;
          conditions.push("Wallet connected");
        }

        // Tagged interests like degen trading, airdrops
        if (
          filters.taggedInterests.enabled &&
          filters.taggedInterests.value.some((tag) =>
            DEGEN_INTEREST_TAGS.includes(tag.toLowerCase())
          )
        ) {
          score += 0.3;
          conditions.push("Degen interests tagged");
        }

        // Some XP (not complete beginner)
        if (filters.xpLevel.enabled && filters.xpLevel.min >= 20) {
          score += 0.15;
          conditions.push("Some XP (≥20)");
        }

        return { score: Math.min(score, 0.35), conditions };
      },
    };

    // Calculate segment scores and conditions
    const segmentResults = {
      explorer: calculateSegmentScore.explorer(),
      builder: calculateSegmentScore.builder(),
      grinder: calculateSegmentScore.grinder(),
      lurker: calculateSegmentScore.lurker(),
      degen: calculateSegmentScore.degen(),
    };

    // Normalize scores to ensure they sum to 1
    const totalScore = Object.values(segmentResults).reduce(
      (sum, { score }) => sum + score,
      0
    );
    const normalizedScores = Object.fromEntries(
      Object.entries(segmentResults).map(([key, { score, conditions }]) => [
        key,
        {
          score: totalScore > 0 ? score / totalScore : 0.2, // Default equal distribution if no filters
          conditions,
        },
      ])
    );

    // Create segment objects with estimated counts
    const segments: UserSegment[] = [
      {
        id: "explorer",
        name: "Explorer",
        icon: Eye,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        description: "Low XP, recently joined, no wallet yet, some activity",
        estimatedCount: Math.round(
          totalFilteredUsers * normalizedScores.explorer.score
        ),
        percentage: normalizedScores.explorer.score * 100,
        conditions: normalizedScores.explorer.conditions,
      },
      {
        id: "builder",
        name: "Builder",
        icon: Building,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        description:
          "High XP, high mission streak, wallet connected, memory proof submitted",
        estimatedCount: Math.round(
          totalFilteredUsers * normalizedScores.builder.score
        ),
        percentage: normalizedScores.builder.score * 100,
        conditions: normalizedScores.builder.conditions,
      },
      {
        id: "grinder",
        name: "Grinder",
        icon: Zap,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        description:
          "High XP but low trust, many missions failed, often active",
        estimatedCount: Math.round(
          totalFilteredUsers * normalizedScores.grinder.score
        ),
        percentage: normalizedScores.grinder.score * 100,
        conditions: normalizedScores.grinder.conditions,
      },
      {
        id: "lurker",
        name: "Lurker",
        icon: Activity,
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        description: "Inactive for 7+ days, low XP, no engagement",
        estimatedCount: Math.round(
          totalFilteredUsers * normalizedScores.lurker.score
        ),
        percentage: normalizedScores.lurker.score * 100,
        conditions: normalizedScores.lurker.conditions,
      },
      {
        id: "degen",
        name: "Degen",
        icon: TrendingUp,
        color: "text-green-600",
        bgColor: "bg-green-50",
        description:
          "High referral count, connected wallet, tagged interests like degen trading, airdrops",
        estimatedCount: Math.round(
          totalFilteredUsers * normalizedScores.degen.score
        ),
        percentage: normalizedScores.degen.score * 100,
        conditions: normalizedScores.degen.conditions,
      },
    ];

    return segments.filter((s) => s.estimatedCount > 0);
  };

  // Calculate audience estimate with enhanced logic
  const audienceEstimate = useMemo((): AudienceEstimate => {
    if (audienceType === "global") {
      const globalSegments: UserSegment[] = [
        {
          id: "builder",
          name: "Builder",
          icon: Building,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          description:
            "High XP, high mission streak, wallet connected, memory proof submitted",
          estimatedCount: 4850,
          percentage: 31.5,
          conditions: ["Global segment"],
        },
        {
          id: "degen",
          name: "Degen",
          icon: TrendingUp,
          color: "text-green-600",
          bgColor: "bg-green-50",
          description:
            "High referral count, connected wallet, tagged interests like degen trading, airdrops",
          estimatedCount: 4320,
          percentage: 28.0,
          conditions: ["Global segment"],
        },
        {
          id: "explorer",
          name: "Explorer",
          icon: Eye,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          description: "Low XP, recently joined, no wallet yet, some activity",
          estimatedCount: 3680,
          percentage: 23.9,
          conditions: ["Global segment"],
        },
        {
          id: "grinder",
          name: "Grinder",
          icon: Zap,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          description:
            "High XP but low trust, many missions failed, often active",
          estimatedCount: 1890,
          percentage: 12.3,
          conditions: ["Global segment"],
        },
        {
          id: "lurker",
          name: "Lurker",
          icon: Activity,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          description: "Inactive for 7+ days, low XP, no engagement",
          estimatedCount: 680,
          percentage: 4.4,
          conditions: ["Global segment"],
        },
      ];

      return {
        totalReach: BASE_USER_DATA.total,
        segments: globalSegments,
        channels: {
          discord: 8900,
          telegram: 5200,
          groups: 45,
        },
      };
    }

    const segments = classifyUserSegments(behaviorFilters);
    const totalReach = segments.reduce(
      (sum, segment) => sum + segment.estimatedCount,
      0
    );

    // Calculate channel distribution based on delivery options
    const channelMultipliers = {
      discord: 0.58,
      telegram: 0.34,
      line: 0.08,
    };

    const selectedChannelMultiplier =
      channelMultipliers[
        deliveryOptions.channel as keyof typeof channelMultipliers
      ] || 0.58;
    const channelReach = Math.round(totalReach * selectedChannelMultiplier);

    return {
      totalReach,
      segments: segments.filter((s) => s.estimatedCount > 0),
      channels: {
        discord:
          deliveryOptions.channel === "discord"
            ? channelReach
            : Math.round(totalReach * 0.58),
        telegram:
          deliveryOptions.channel === "telegram"
            ? channelReach
            : Math.round(totalReach * 0.34),
        groups: Math.ceil(channelReach / 200), // Assume ~200 users per group
      },
    };
  }, [audienceType, behaviorFilters, demographicFilters, deliveryOptions]);

  // Update parent component when targeting changes
  useEffect(() => {
    if (onTargetingChange) {
      onTargetingChange({
        audienceType,
        behaviorFilters,
        demographicFilters,
        deliveryOptions,
      });
    }
  }, [
    audienceType,
    behaviorFilters,
    demographicFilters,
    deliveryOptions,
    onTargetingChange,
  ]);

  const toggleBehaviorFilter = (filterKey: keyof BehaviorFilters) => {
    setBehaviorFilters((prev) => ({
      ...prev,
      [filterKey]: {
        ...prev[filterKey],
        enabled: !prev[filterKey].enabled,
      },
    }));
  };

  const updateBehaviorFilter = (
    filterKey: keyof BehaviorFilters,
    field: string,
    value: string | number | boolean | number[]
  ) => {
    setBehaviorFilters((prev) => ({
      ...prev,
      [filterKey]: {
        ...prev[filterKey],
        [field]: value,
      },
    }));
  };

  const addDemographicFilter = (
    type: keyof DemographicFilters,
    value: string
  ) => {
    setDemographicFilters((prev) => ({
      ...prev,
      [type]: Array.isArray(prev[type])
        ? [...(prev[type] as string[]), value]
        : value,
    }));
  };

  const removeDemographicFilter = (
    type: keyof DemographicFilters,
    value: string
  ) => {
    setDemographicFilters((prev) => ({
      ...prev,
      [type]: Array.isArray(prev[type])
        ? (prev[type] as string[]).filter((item: string) => item !== value)
        : prev[type],
    }));
  };

  const addTaggedInterest = (interest: string) => {
    setBehaviorFilters((prev) => ({
      ...prev,
      taggedInterests: {
        ...prev.taggedInterests,
        value: [...prev.taggedInterests.value, interest],
      },
    }));
  };

  const removeTaggedInterest = (interest: string) => {
    setBehaviorFilters((prev) => ({
      ...prev,
      taggedInterests: {
        ...prev.taggedInterests,
        value: prev.taggedInterests.value.filter((tag) => tag !== interest),
      },
    }));
  };

  // Time picker component
  const TimePicker = ({
    value,
    onChange,
  }: {
    value?: string;
    onChange: (time: string) => void;
    placeholder?: string;
  }) => {
    const [hours, setHours] = useState(value ? value.split(":")[0] : "12");
    const [minutes, setMinutes] = useState(value ? value.split(":")[1] : "00");

    const updateTime = (newHours: string, newMinutes: string) => {
      const timeString = `${newHours.padStart(2, "0")}:${newMinutes.padStart(
        2,
        "0"
      )}`;
      onChange(timeString);
    };

    return (
      <div className="flex items-center space-x-2">
        <Select
          value={hours}
          onValueChange={(newHours) => {
            setHours(newHours);
            updateTime(newHours, minutes);
          }}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 24 }, (_, i) => (
              <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                {i.toString().padStart(2, "0")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-muted-foreground">:</span>
        <Select
          value={minutes}
          onValueChange={(newMinutes) => {
            setMinutes(newMinutes);
            updateTime(hours, newMinutes);
          }}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 60 }, (_, i) => (
              <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                {i.toString().padStart(2, "0")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  // DateTime picker component
  const DateTimePicker = ({
    value,
    onChange,
    placeholder = "Pick a date and time",
  }: {
    value?: string;
    onChange: (datetime: string) => void;
    placeholder?: string;
  }) => {
    const [date, setDate] = useState<Date | undefined>(
      value ? new Date(value) : undefined
    );
    const [time, setTime] = useState<string>(
      value ? format(new Date(value), "HH:mm") : "12:00"
    );
    const [isOpen, setIsOpen] = useState(false);

    const handleDateSelect = (selectedDate: Date | undefined) => {
      if (selectedDate) {
        setDate(selectedDate);
        const [hours, minutes] = time.split(":");
        selectedDate.setHours(parseInt(hours), parseInt(minutes));
        onChange(selectedDate.toISOString().slice(0, 16));
      }
    };

    const handleTimeChange = (newTime: string) => {
      setTime(newTime);
      if (date) {
        const [hours, minutes] = newTime.split(":");
        const newDate = new Date(date);
        newDate.setHours(parseInt(hours), parseInt(minutes));
        onChange(newDate.toISOString().slice(0, 16));
      }
    };

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "PPP") + " at " + time
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </div>
          <div className="p-3">
            <Label className="text-sm font-medium mb-2 block">Time</Label>
            <TimePicker value={time} onChange={handleTimeChange} />
          </div>
          <div className="p-3 pt-0">
            <Button
              className="w-full"
              onClick={() => setIsOpen(false)}
              size="sm"
            >
              Confirm
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="space-y-6">
      {/* Mission Targeting Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Mission Targeting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Audience Type Toggle */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Audience Type</Label>
            <RadioGroup
              value={audienceType}
              onValueChange={(value: "global" | "custom") =>
                setAudienceType(value)
              }
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="global" id="global" />
                <Label htmlFor="global">🌍 Global – Send to all users</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom">🎯 Custom – Apply filters</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Custom Filters - Only show when Custom is selected */}
          {audienceType === "custom" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Filters */}
              <div className="lg:col-span-2 space-y-6">
                {/* Behavior Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Behavior Filters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* XP Level */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">XP Level</Label>
                        <Switch
                          checked={behaviorFilters.xpLevel.enabled}
                          onCheckedChange={() =>
                            toggleBehaviorFilter("xpLevel")
                          }
                        />
                      </div>
                      {behaviorFilters.xpLevel.enabled && (
                        <div className="pl-4 space-y-2">
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <Label className="text-sm">Min</Label>
                              <Input
                                type="number"
                                value={behaviorFilters.xpLevel.min}
                                onChange={(e) =>
                                  updateBehaviorFilter(
                                    "xpLevel",
                                    "min",
                                    parseInt(e.target.value)
                                  )
                                }
                                className="mt-1"
                              />
                            </div>
                            <div className="flex-1">
                              <Label className="text-sm">Max</Label>
                              <Input
                                type="number"
                                value={behaviorFilters.xpLevel.max}
                                onChange={(e) =>
                                  updateBehaviorFilter(
                                    "xpLevel",
                                    "max",
                                    parseInt(e.target.value) || 100
                                  )
                                }
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Mission Streak */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">Mission Streak</Label>
                        <Switch
                          checked={behaviorFilters.missionStreak.enabled}
                          onCheckedChange={() =>
                            toggleBehaviorFilter("missionStreak")
                          }
                        />
                      </div>
                      {behaviorFilters.missionStreak.enabled && (
                        <div className="pl-4">
                          <Input
                            type="number"
                            placeholder="Minimum streak"
                            value={behaviorFilters.missionStreak.value}
                            onChange={(e) =>
                              updateBehaviorFilter(
                                "missionStreak",
                                "value",
                                parseInt(e.target.value)
                              )
                            }
                          />
                        </div>
                      )}
                    </div>

                    {/* Last Active */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">Last Active</Label>
                        <Switch
                          checked={behaviorFilters.lastActive.enabled}
                          onCheckedChange={() =>
                            toggleBehaviorFilter("lastActive")
                          }
                        />
                      </div>
                      {behaviorFilters.lastActive.enabled && (
                        <div className="pl-4">
                          <Select
                            value={behaviorFilters.lastActive.value}
                            onValueChange={(value) =>
                              updateBehaviorFilter("lastActive", "value", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select timeframe" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="today">Today</SelectItem>
                              <SelectItem value="3days">
                                Within 3 days
                              </SelectItem>
                              <SelectItem value="7days">
                                Within 7 days
                              </SelectItem>
                              <SelectItem value="inactive">
                                Inactive 7+ days
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    {/* Failed Missions */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">Failed Missions</Label>
                        <Switch
                          checked={behaviorFilters.failedMissions.enabled}
                          onCheckedChange={() =>
                            toggleBehaviorFilter("failedMissions")
                          }
                        />
                      </div>
                      {behaviorFilters.failedMissions.enabled && (
                        <div className="pl-4">
                          <Input
                            type="number"
                            placeholder="Maximum failed missions"
                            value={behaviorFilters.failedMissions.value}
                            onChange={(e) =>
                              updateBehaviorFilter(
                                "failedMissions",
                                "value",
                                parseInt(e.target.value)
                              )
                            }
                          />
                        </div>
                      )}
                    </div>

                    {/* Trust Score */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">Trust Score</Label>
                        <Switch
                          checked={behaviorFilters.trustScore.enabled}
                          onCheckedChange={() =>
                            toggleBehaviorFilter("trustScore")
                          }
                        />
                      </div>
                      {behaviorFilters.trustScore.enabled && (
                        <div className="pl-4 space-y-2">
                          <div className="flex items-center gap-4">
                            <span className="text-sm">0</span>
                            <Slider
                              value={behaviorFilters.trustScore.value}
                              onValueChange={(value) =>
                                updateBehaviorFilter(
                                  "trustScore",
                                  "value",
                                  value
                                )
                              }
                              max={100}
                              step={1}
                              className="flex-1"
                            />
                            <span className="text-sm">100</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Minimum: {behaviorFilters.trustScore.value[0]}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Connected Wallet */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">Connected Wallet</Label>
                        <Switch
                          checked={behaviorFilters.connectedWallet.enabled}
                          onCheckedChange={() =>
                            toggleBehaviorFilter("connectedWallet")
                          }
                        />
                      </div>
                      {behaviorFilters.connectedWallet.enabled && (
                        <div className="pl-4">
                          <Select
                            value={
                              behaviorFilters.connectedWallet.value
                                ? "yes"
                                : "no"
                            }
                            onValueChange={(value) =>
                              updateBehaviorFilter(
                                "connectedWallet",
                                "value",
                                value === "yes"
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select requirement" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">
                                Must have wallet
                              </SelectItem>
                              <SelectItem value="no">
                                No wallet required
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    {/* Memory Proof Submitted - NEW */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">
                          Memory Proof Submitted
                        </Label>
                        <Switch
                          checked={behaviorFilters.memoryProofSubmitted.enabled}
                          onCheckedChange={() =>
                            toggleBehaviorFilter("memoryProofSubmitted")
                          }
                        />
                      </div>
                      {behaviorFilters.memoryProofSubmitted.enabled && (
                        <div className="pl-4">
                          <Select
                            value={
                              behaviorFilters.memoryProofSubmitted.value
                                ? "yes"
                                : "no"
                            }
                            onValueChange={(value) =>
                              updateBehaviorFilter(
                                "memoryProofSubmitted",
                                "value",
                                value === "yes"
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select requirement" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">
                                Must have submitted
                              </SelectItem>
                              <SelectItem value="no">Not required</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    {/* Tagged Interests - NEW for Degen classification */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">Tagged Interests</Label>
                        <Switch
                          checked={behaviorFilters.taggedInterests.enabled}
                          onCheckedChange={() =>
                            toggleBehaviorFilter("taggedInterests")
                          }
                        />
                      </div>
                      {behaviorFilters.taggedInterests.enabled && (
                        <div className="pl-4 space-y-2">
                          <Select onValueChange={addTaggedInterest}>
                            <SelectTrigger>
                              <SelectValue placeholder="Add interest tags" />
                            </SelectTrigger>
                            <SelectContent>
                              {DEGEN_INTEREST_TAGS.map((tag) => (
                                <SelectItem key={tag} value={tag}>
                                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex flex-wrap gap-2">
                            {behaviorFilters.taggedInterests.value.map(
                              (interest: string) => (
                                <Badge
                                  key={interest}
                                  variant="secondary"
                                  className="cursor-pointer"
                                  onClick={() => removeTaggedInterest(interest)}
                                >
                                  {interest} <X className="h-3 w-3 ml-1" />
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Joined via Partner */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">
                          Joined via Partner
                        </Label>
                        <Switch
                          checked={behaviorFilters.joinedViaPartner.enabled}
                          onCheckedChange={() =>
                            toggleBehaviorFilter("joinedViaPartner")
                          }
                        />
                      </div>
                      {behaviorFilters.joinedViaPartner.enabled && (
                        <div className="pl-4">
                          <Select
                            value={behaviorFilters.joinedViaPartner.value}
                            onValueChange={(value) =>
                              updateBehaviorFilter(
                                "joinedViaPartner",
                                "value",
                                value
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select partner" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="staika">Staika</SelectItem>
                              <SelectItem value="gath3r">Gath3r</SelectItem>
                              <SelectItem value="bread">Bread.gg</SelectItem>
                              <SelectItem value="deepbrew">Deepbrew</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    {/* Referred Users */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">Referred Users</Label>
                        <Switch
                          checked={behaviorFilters.referredUsers.enabled}
                          onCheckedChange={() =>
                            toggleBehaviorFilter("referredUsers")
                          }
                        />
                      </div>
                      {behaviorFilters.referredUsers.enabled && (
                        <div className="pl-4">
                          <Input
                            type="number"
                            placeholder="Minimum referred users"
                            value={behaviorFilters.referredUsers.value}
                            onChange={(e) =>
                              updateBehaviorFilter(
                                "referredUsers",
                                "value",
                                parseInt(e.target.value)
                              )
                            }
                          />
                        </div>
                      )}
                    </div>

                    {/* Agent Health */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">Agent Health</Label>
                        <Switch
                          checked={behaviorFilters.agentHealth.enabled}
                          onCheckedChange={() =>
                            toggleBehaviorFilter("agentHealth")
                          }
                        />
                      </div>
                      {behaviorFilters.agentHealth.enabled && (
                        <div className="pl-4 space-y-2">
                          <div className="flex items-center gap-4">
                            <span className="text-sm">0</span>
                            <Slider
                              value={behaviorFilters.agentHealth.value}
                              onValueChange={(value) =>
                                updateBehaviorFilter(
                                  "agentHealth",
                                  "value",
                                  value
                                )
                              }
                              max={100}
                              step={1}
                              className="flex-1"
                            />
                            <span className="text-sm">100</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Minimum: {behaviorFilters.agentHealth.value[0]}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Demographics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Demographics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Location */}
                    <div className="space-y-2">
                      <Label className="font-medium">Location</Label>
                      <Select
                        onValueChange={(value) =>
                          addDemographicFilter("location", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Add countries" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="TH">Thailand</SelectItem>
                          <SelectItem value="SG">Singapore</SelectItem>
                          <SelectItem value="JP">Japan</SelectItem>
                          <SelectItem value="KR">South Korea</SelectItem>
                          <SelectItem value="GB">United Kingdom</SelectItem>
                          <SelectItem value="DE">Germany</SelectItem>
                          <SelectItem value="FR">France</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex flex-wrap gap-2">
                        {demographicFilters.location.map((country: string) => (
                          <Badge
                            key={country}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() =>
                              removeDemographicFilter("location", country)
                            }
                          >
                            {country} <X className="h-3 w-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Language */}
                    <div className="space-y-2">
                      <Label className="font-medium">Language</Label>
                      <Select
                        onValueChange={(value) =>
                          addDemographicFilter("language", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Add languages" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="th">Thai</SelectItem>
                          <SelectItem value="zh">Chinese</SelectItem>
                          <SelectItem value="ja">Japanese</SelectItem>
                          <SelectItem value="ko">Korean</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex flex-wrap gap-2">
                        {demographicFilters.language.map((lang: string) => (
                          <Badge
                            key={lang}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() =>
                              removeDemographicFilter("language", lang)
                            }
                          >
                            {lang} <X className="h-3 w-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Age Range */}
                    <div className="space-y-2">
                      <Label className="font-medium">Age Range</Label>
                      <Select
                        value={demographicFilters.ageRange}
                        onValueChange={(value) =>
                          setDemographicFilters((prev) => ({
                            ...prev,
                            ageRange: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select age range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="13-17">13-17</SelectItem>
                          <SelectItem value="18-24">18-24</SelectItem>
                          <SelectItem value="25-34">25-34</SelectItem>
                          <SelectItem value="35-44">35-44</SelectItem>
                          <SelectItem value="45+">45+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                      <Label className="font-medium">Gender</Label>
                      <Select
                        value={demographicFilters.gender}
                        onValueChange={(value) =>
                          setDemographicFilters((prev) => ({
                            ...prev,
                            gender: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Options */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Delivery Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Delivery Channel */}
                    <div className="space-y-2">
                      <Label className="font-medium">Delivery Channel</Label>
                      <Select
                        value={deliveryOptions.channel}
                        onValueChange={(value) =>
                          setDeliveryOptions((prev) => ({
                            ...prev,
                            channel: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select channel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="discord">Discord</SelectItem>
                          <SelectItem value="telegram">Telegram</SelectItem>
                          <SelectItem value="line">LINE</SelectItem>
                          <SelectItem value="inapp">In-app</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Target Scope */}
                    <div className="space-y-2">
                      <Label className="font-medium">Target Scope</Label>
                      <RadioGroup
                        value={deliveryOptions.scope}
                        onValueChange={(value) =>
                          setDeliveryOptions((prev) => ({
                            ...prev,
                            scope: value,
                          }))
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="dm" id="dm" />
                          <Label htmlFor="dm">DM</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="group" id="group" />
                          <Label htmlFor="group">Group</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="global" id="globalScope" />
                          <Label htmlFor="globalScope">Global</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Schedule Delivery */}
                    <div className="space-y-2">
                      <Label className="font-medium">Schedule Delivery</Label>
                      <RadioGroup
                        value={deliveryOptions.schedule}
                        onValueChange={(value) =>
                          setDeliveryOptions((prev) => ({
                            ...prev,
                            schedule: value,
                          }))
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="immediate" id="immediate" />
                          <Label htmlFor="immediate">Immediate</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="scheduled" id="scheduled" />
                          <Label htmlFor="scheduled">Future-scheduled</Label>
                        </div>
                      </RadioGroup>

                      {deliveryOptions.schedule === "scheduled" && (
                        <div className="mt-2">
                          <DateTimePicker
                            value={deliveryOptions.scheduledDate}
                            onChange={(value) =>
                              setDeliveryOptions((prev) => ({
                                ...prev,
                                scheduledDate: value,
                              }))
                            }
                            placeholder="Select delivery date and time"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Enhanced Audience Preview */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Audience Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Estimated Reach */}
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        {audienceEstimate.totalReach.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        estimated reach
                      </div>
                    </div>

                    {/* Channel Distribution */}
                    <div className="space-y-3">
                      <Label className="font-medium">
                        Estimated Servers / Groups:
                      </Label>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm flex items-center gap-2">
                            💬 Discord
                          </span>
                          <Badge variant="outline">
                            {audienceEstimate.channels.discord.toLocaleString()}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm flex items-center gap-2">
                            ✈️ Telegram
                          </span>
                          <Badge variant="outline">
                            {audienceEstimate.channels.telegram.toLocaleString()}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm flex items-center gap-2">
                            👥 Groups
                          </span>
                          <Badge variant="outline">
                            {audienceEstimate.channels.groups}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced User Segments Breakdown */}
                    <div className="space-y-3">
                      <Label className="font-medium">Breakdown:</Label>
                      <div className="space-y-3">
                        {audienceEstimate.segments.map((segment) => {
                          const IconComponent = segment.icon;
                          return (
                            <div
                              key={segment.id}
                              className={`p-3 rounded-lg border ${segment.bgColor} ${segment.color}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <IconComponent className="h-4 w-4" />
                                  <span className="font-medium text-sm">
                                    {segment.name}
                                  </span>
                                </div>
                                <Badge variant="secondary">
                                  {segment.percentage.toFixed(1)}%
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-muted-foreground">
                                  {segment.description}
                                </span>
                                <span className="text-sm font-bold">
                                  {segment.estimatedCount.toLocaleString()}
                                </span>
                              </div>
                              {/* Show matching conditions */}
                              {segment.conditions.length > 0 && (
                                <div className="mt-2">
                                  <div className="text-xs text-gray-600 mb-1">
                                    Matching conditions:
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {segment.conditions.map(
                                      (condition, idx) => (
                                        <Badge
                                          key={idx}
                                          variant="outline"
                                          className="text-xs px-1 py-0"
                                        >
                                          {condition}
                                        </Badge>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Live Update Indicator */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Live updating
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Global Audience Preview - Show when Global is selected */}
          {audienceType === "global" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Global Audience Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {audienceEstimate.segments.map((segment) => {
                        const IconComponent = segment.icon;
                        return (
                          <div
                            key={segment.id}
                            className={`p-4 rounded-lg border text-center ${segment.bgColor}`}
                          >
                            <IconComponent
                              className={`h-8 w-8 mx-auto mb-2 ${segment.color}`}
                            />
                            <div className="font-semibold text-sm">
                              {segment.name}
                            </div>
                            <div className="text-2xl font-bold mt-1">
                              {segment.estimatedCount.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {segment.percentage.toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-600 mt-2">
                              {segment.description}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Global Reach
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        {audienceEstimate.totalReach.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        total users
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="font-medium">Platform Coverage:</Label>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">💬 Discord</span>
                          <Badge variant="outline">8,900</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">✈️ Telegram</span>
                          <Badge variant="outline">5,200</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">📱 LINE</span>
                          <Badge variant="outline">1,320</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Maximum reach enabled
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MissionTargetingForm;
