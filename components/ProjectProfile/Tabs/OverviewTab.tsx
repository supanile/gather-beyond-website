"use client";

import React from "react";
import { ExternalLink, Copy, Check, Shield, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Wallet {
  address: string;
  type: string;
  verified: boolean;
}

interface Audit {
  company: string;
  date: string;
  status: string;
  score: number;
}

interface CommunityLinks {
  discord?: string;
  telegram?: string;
  twitter?: string;
  github?: string;
  website?: string;
}

interface Overview {
  about: string;
  verifiedWallets: Wallet[];
  audits: Audit[];
  communityLinks: CommunityLinks;
}

interface OverviewTabProps {
  overview: Overview;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ overview }) => {
  const [copiedWallet, setCopiedWallet] = React.useState<string | null>(null);

  const handleCopyWallet = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedWallet(address);
      setTimeout(() => setCopiedWallet(null), 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  const getLinkIcon = (platform: string) => {
    const icons = {
      discord: "💬",
      telegram: "📱",
      twitter: "🐦",
      github: "⚡",
      website: "🌐",
    };
    return icons[platform as keyof typeof icons] || "🔗";
  };

  const getAuditStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "passed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-8">
      {/* About Section */}
      <section>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          About {overview.about.split(" ")[0]}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {overview.about}
        </p>
      </section>

      {/* Verified Wallets Section */}
      <section>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Verified Wallets
        </h3>
        <div className="space-y-3">
          {overview.verifiedWallets.map((wallet, index) => (
            <div
              key={index}
              className="bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    wallet.verified ? "bg-green-500" : "bg-yellow-500"
                  }`}
                ></div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {wallet.type}
                  </div>
                  <div className="text-sm text-muted-foreground font-mono">
                    {wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={wallet.verified ? "default" : "secondary"}
                  className={
                    wallet.verified
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }
                >
                  {wallet.verified ? "Verified" : "Pending"}
                </Badge>
                <button
                  onClick={() => handleCopyWallet(wallet.address)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  {copiedWallet === wallet.address ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Audits Section */}
      <section>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Security Audits
        </h3>
        <div className="grid gap-4">
          {overview.audits.map((audit, index) => (
            <div
              key={index}
              className="bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {audit.company}
                    </h4>
                    <Badge className={getAuditStatusColor(audit.status)}>
                      {audit.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Completed on {new Date(audit.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {audit.score}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Security Score
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Links Section */}
      <section>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Community Links
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(overview.communityLinks).map(([platform, url]) => (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30 rounded-xl hover:border-primary/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105 group"
            >
              <span className="text-2xl">{getLinkIcon(platform)}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors capitalize">
                  {platform}
                </div>
                <div className="text-sm text-muted-foreground truncate">
                  {url}
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default OverviewTab;