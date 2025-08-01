import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Mission } from "@/types/admin/missions/missionTypes";
import {
  getStatusColor,
  parseReward,
} from "@/lib/admin/missions/missionTableUtils";

interface ViewMissionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mission: Mission | null;
}

export const ViewMissionModal: React.FC<ViewMissionModalProps> = ({
  isOpen,
  onOpenChange,
  mission,
}) => {
  if (!mission) return null;

  const reward = parseReward(mission.reward);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs sm:max-w-2xl mx-2 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-sm sm:text-lg">Mission Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 sm:space-y-4">
          <Card>
            <CardHeader className="p-3 sm:p-6 -mb-4 sm:pb-2">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm sm:text-lg break-words">{mission.title}</span>
                <Badge className={`${getStatusColor(mission.status)} text-xs self-start sm:self-auto`}>
                  {mission.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0">
              <div>
                <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Description
                </Label>
                <p className="text-xs sm:text-sm mt-1 break-words">{mission.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Type
                  </Label>
                  <p className="text-xs sm:text-sm mt-1 break-words">{mission.type}</p>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Platform
                  </Label>
                  <p className="text-xs sm:text-sm mt-1 break-words">{mission.platform}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Level Required
                  </Label>
                  <p className="text-xs sm:text-sm mt-1">{mission.level_required}</p>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Reward
                  </Label>
                  <p className="text-xs sm:text-sm mt-1">
                    {reward.amount} {reward.token}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Action Request
                </Label>
                <p className="text-xs sm:text-sm mt-1 break-words">{mission.action_request}</p>
              </div>

              <div>
                <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Partner
                </Label>
                <p className="text-xs sm:text-sm mt-1 break-words">{mission.partnerName || "N/A"}</p>
              </div>

              {mission.useful_link && (
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Useful Link
                  </Label>
                  <p className="text-xs sm:text-sm mt-1 break-all">
                    <a
                      href={mission.useful_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {mission.useful_link}
                    </a>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
