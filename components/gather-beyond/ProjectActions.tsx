import { ProjectActions, GatherProject } from '@/types/gatherDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  Play, 
  Bookmark, 
  BookmarkCheck, 
  GitCompare, 
  Shield,
  Copy,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ProjectActionsProps {
  project: GatherProject;
  actions: ProjectActions;
  className?: string;
}

export function ProjectActionsComponent({ project, actions, className }: ProjectActionsProps) {
  const [isBookmarked, setIsBookmarked] = useState(actions.isBookmarked);
  const [copied, setCopied] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleCopyAddress = async () => {
    if (project.address) {
      await navigator.clipboard.writeText(project.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleVisitProject = () => {
    if (project.website && project.website.length > 0) {
      window.open(project.website[0], '_blank');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.name,
          text: `Check out ${project.name} on Gather Beyond`,
          url: window.location.href,
        });
      } catch {
        await navigator.clipboard.writeText(window.location.href);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      {/* <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="h-4 w-4 text-blue-600" />
          <span>Trust Actions</span>
        </CardTitle>
      </CardHeader> */}
      
      <CardContent className="space-y-3">
        {/* Primary Actions - Compact */}
        <div className="grid grid-cols-1 gap-2">
          <Button
            onClick={handleVisitProject}
            disabled={!actions.canVisit || !project.website?.length}
            className="flex items-center gap-2 h-10 justify-center"
            variant="default"
          >
            <ExternalLink className="h-4 w-4" />
            Trust Actions
          </Button>

          <Button
            disabled={!actions.canJoinCampaign}
            className="flex items-center gap-2 h-10 justify-center"
            variant={actions.canJoinCampaign ? "default" : "secondary"}
          >
            <Play className="h-4 w-4" />
            {actions.canJoinCampaign ? 'Join Campaign' : 'No Active Campaign'}
          </Button>
        </div>

        {/* Secondary Actions - Inline */}
        <div className="grid grid-cols-3 gap-1">
          <Button
            onClick={handleBookmark}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-xs h-8"
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-3 w-3 text-blue-600" />
            ) : (
              <Bookmark className="h-3 w-3" />
            )}
            {isBookmarked ? 'Saved' : 'Save'}
          </Button>

          <Button
            disabled={!actions.canCompare}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-xs h-8"
          >
            <GitCompare className="h-3 w-3" />
            Compare
          </Button>

          <Button
            onClick={handleShare}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-xs h-8"
          >
            <Share2 className="h-3 w-3" />
            Share
          </Button>
        </div>

        {/* Contract Address - Compact */}
        {project.address && (
          <div className="p-2 bg-gray-50 rounded border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700 mb-1">Contract Address</p>
                <p className="text-xs font-mono text-gray-600 truncate">
                  {project.address}
                </p>
              </div>
              <Button
                onClick={handleCopyAddress}
                variant="ghost"
                size="sm"
                className="ml-2 flex-shrink-0 h-6 text-xs"
              >
                <Copy className="h-3 w-3" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
        )}

        {/* Trust Indicators - Compact Grid */}
        {/* <div className="space-y-2">
          <h4 className="font-semibold text-gray-900 text-sm">Trust Indicators</h4>
          <div className="grid grid-cols-1 gap-1">
            <div className="flex items-center justify-between p-2 bg-green-50 rounded text-xs">
              <span className="text-green-700">Verified Contract</span>
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 h-4">✓</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded text-xs">
              <span className="text-blue-700">Community Vetted</span>
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 h-4">✓</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded text-xs">
              <span className="text-yellow-700">Active Development</span>
              <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 h-4">✓</Badge>
            </div>
          </div>
        </div> */}

        {/* Quick Actions - Compact */}
        {/* <div className="pt-2 border-t border-gray-100">
          <h4 className="font-semibold text-gray-900 text-sm mb-2">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <Button variant="ghost" size="sm" className="text-left justify-start h-6 text-xs">
              Add to Watchlist
            </Button>
            <Button variant="ghost" size="sm" className="text-left justify-start h-6 text-xs">
              Price Alerts
            </Button>
            <Button variant="ghost" size="sm" className="text-left justify-start h-6 text-xs">
              View on Explorer
            </Button>
            <Button variant="ghost" size="sm" className="text-left justify-start h-6 text-xs">
              Report Issue
            </Button>
          </div>
        </div> */}

        {/* Last Updated - Minimal */}
        {/* <div className="text-xs text-gray-500 text-center pt-1 border-t border-gray-100">
          Updated: {new Date().toLocaleTimeString()}
        </div> */}
      </CardContent>
    </Card>
  );
}