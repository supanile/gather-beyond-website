import React from "react";
import { Mission } from "@/types/admin/adminTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { getStatusVariant, getStatusColor, getLinkType } from "@/lib/admin/user/userTableUtils";

interface MissionSubmissionModalProps {
  mission: Mission | null;
  isOpen: boolean;
  onClose: () => void;
}

const MissionSubmissionModal: React.FC<MissionSubmissionModalProps> = ({
  mission,
  isOpen,
  onClose,
}) => {
  if (!mission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Mission #{mission.mission_id} Submission
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground -mb-4">
                Submission Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col space-y-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Link:
                </span>
                <div>
                  <Badge variant="outline" className="mb-2">
                    {getLinkType(mission.submission_link!)}
                  </Badge>
                  <p className="text-sm text-foreground break-all">
                    {mission.submission_link}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Status:
                </span>
                <Badge
                  variant={getStatusVariant(mission.status)}
                  className={getStatusColor(mission.status)}
                >
                  {mission.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Button asChild className="flex-1">
              <a
                href={mission.submission_link!}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Link
              </a>
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MissionSubmissionModal;