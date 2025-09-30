import { GatherProject } from '@/types/gatherDashboard';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Verified, Shield } from 'lucide-react';
import Image from 'next/image';

interface ProjectOverviewProps {
  project: GatherProject;
  isVerified?: boolean;
  isAudited?: boolean;
}

export function ProjectOverview({ project, isVerified = false, isAudited = false }: ProjectOverviewProps) {
  const formatChain = (chain: string) => {
    return chain.charAt(0).toUpperCase() + chain.slice(1);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              {project.image_url ? (
                <Image
                  src={project.image_url}
                  alt={`${project.name} logo`}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {project.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-gray-900 truncate">{project.name}</h2>
                {isVerified && <Verified className="h-4 w-4 text-blue-500 flex-shrink-0" />}
                {isAudited && <Shield className="h-4 w-4 text-green-500 flex-shrink-0" />}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  {formatChain(project.chain)}
                </Badge>
                {project.categories.slice(0, 2).map((category, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {category}
                  </Badge>
                ))}
                {project.categories.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{project.categories.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {project.website && project.website.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(project.website[0], '_blank')}
              className="flex items-center gap-1 flex-shrink-0"
            >
              <ExternalLink className="h-3 w-3" />
              Visit
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-gray-600 text-sm leading-relaxed">
          {project.description}
        </p>
        
        <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div>
              <span className="font-medium text-gray-700">Chain:</span>
              <span className="ml-1 text-gray-600">{formatChain(project.chain)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Address:</span>
              <span className="ml-1 text-gray-600 font-mono text-xs">
                {project.address ? project.address : 'N/A'}
              </span>
            </div>
          </div>
          
          {(isVerified || isAudited) && (
            <div className="flex items-center gap-3 text-xs">
              {isVerified && (
                <div className="flex items-center gap-1 text-blue-600">
                  <Verified className="h-3 w-3" />
                  <span>Verified</span>
                </div>
              )}
              {isAudited && (
                <div className="flex items-center gap-1 text-green-600">
                  <Shield className="h-3 w-3" />
                  <span>Audited</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}