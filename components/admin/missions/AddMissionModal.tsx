"use client";

import React, { useEffect } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  NewMissionForm,
  PARTNER_OPTIONS,
} from "@/types/admin/missions/missionTypes";

interface AddMissionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newMission: NewMissionForm;
  onMissionChange: (
    mission: NewMissionForm | ((prev: NewMissionForm) => NewMissionForm)
  ) => void;
  onSubmit: () => Promise<void>;
  isEditMode?: boolean;
  title?: string;
}

export const AddMissionModal: React.FC<AddMissionModalProps> = ({
  isOpen,
  onOpenChange,
  newMission,
  onMissionChange,
  onSubmit,
  isEditMode = false,
  title = "Add New Mission",
}) => {
  // Debug effect to log incoming data
  useEffect(() => {
    if (isOpen) {
      console.log("🔧 AddMissionModal opened with data:", newMission);
      console.log("🔧 Partner value:", newMission.partner);
    }
  }, [isOpen, newMission]);

  const handleInputChange = (
    field: keyof NewMissionForm,
    value: string | number
  ) => {
    console.log(`🔧 Field ${field} changed to:`, value);
    onMissionChange((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };
      console.log(`🔧 Updated form state for ${field}:`, updated[field]);
      console.log(`🔧 Full updated form state:`, updated);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔧 Submitting form with data:", newMission);
    await onSubmit();
  };

  // Define type options
  const TYPE_OPTIONS = [
    { value: "Social", label: "Social" },
    { value: "Trading", label: "Trading" },
    { value: "Community", label: "Community" },
    { value: "Referral", label: "Referral" },
    { value: "Engagement", label: "Engagement" }
  ] as const;

  // Define platform options ให้ตรงกับใน database
  const PLATFORM_OPTIONS = [
    { value: "telegram", label: "Telegram" },
    { value: "twitter", label: "Twitter" },
    { value: "discord", label: "Discord" },
    { value: "website", label: "Website" },
    { value: "mobile", label: "Mobile" }
  ] as const;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {!isEditMode && (
        <DialogTrigger asChild>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Mission
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={newMission.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter mission title"
                className="w-full"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={newMission.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter mission description"
                rows={4}
                className="w-full resize-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Type - แก้ไขให้ใช้ exact value */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium">
                Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={newMission.type || ""}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Platform */}
            <div className="space-y-2">
              <Label htmlFor="platform" className="text-sm font-medium">
                Platform <span className="text-red-500">*</span>
              </Label>
              <Select
                value={newMission.platform || ""}
                onValueChange={(value) => handleInputChange("platform", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORM_OPTIONS.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Partner */}
            <div className="space-y-2">
              <Label htmlFor="partner" className="text-sm font-medium">
                Partner <span className="text-red-500">*</span>
              </Label>
              <Select
                value={newMission.partner || "Super Connector"}
                onValueChange={(value) => {
                  console.log("🔧 Partner selected:", value);
                  handleInputChange("partner", value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select partner" />
                </SelectTrigger>
                <SelectContent>
                  {PARTNER_OPTIONS.map((partner) => (
                    <SelectItem key={partner} value={partner}>
                      {partner}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Level Required */}
            <div className="space-y-2">
              <Label htmlFor="level_required" className="text-sm font-medium">
                Level Required
              </Label>
              <Input
                id="level_required"
                type="number"
                value={newMission.level_required || 1}
                onChange={(e) =>
                  handleInputChange(
                    "level_required",
                    parseInt(e.target.value) || 1
                  )
                }
                min="1"
                placeholder="1"
                className="w-full"
              />
            </div>

            {/* Reward */}
            <div className="space-y-2">
              <Label htmlFor="reward" className="text-sm font-medium">
                Reward
              </Label>
              <Input
                id="reward"
                value={newMission.reward}
                onChange={(e) => handleInputChange("reward", e.target.value)}
                placeholder='{"amount": "100", "token": "XP"}'
                className="w-full font-mono text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Format */}
            <div className="space-y-2">
              <Label htmlFor="format" className="text-sm font-medium">
                Format
              </Label>
              <Input
                id="format"
                value={newMission.format}
                onChange={(e) => handleInputChange("format", e.target.value)}
                placeholder="Enter format"
                className="w-full"
              />
            </div>

            {/* Useful Link */}
            <div className="space-y-2">
              <Label htmlFor="useful_link" className="text-sm font-medium">
                Useful Link
              </Label>
              <Input
                id="useful_link"
                type="url"
                value={newMission.useful_link}
                onChange={(e) =>
                  handleInputChange("useful_link", e.target.value)
                }
                placeholder="https://example.com"
                className="w-full"
              />
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-sm font-medium">
                Start Date
              </Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={newMission.startDate || ""}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className="w-full"
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-sm font-medium">
                End Date
              </Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={newMission.endDate || ""}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Action Request */}
            <div className="space-y-2">
              <Label htmlFor="action_request" className="text-sm font-medium">
                Action Request
              </Label>
              <Textarea
                id="action_request"
                value={newMission.action_request}
                onChange={(e) =>
                  handleInputChange("action_request", e.target.value)
                }
                placeholder="Enter action request"
                rows={3}
                className="w-full resize-none"
              />
            </div>

            {/* Requirements - Full width */}
            <div className="space-y-2">
              <Label htmlFor="requirements" className="text-sm font-medium">
                Requirements
              </Label>
              <Textarea
                id="requirements"
                value={newMission.requirements || ""}
                onChange={(e) =>
                  handleInputChange("requirements", e.target.value)
                }
                placeholder="Enter requirements"
                rows={3}
                className="w-full resize-none"
              />
            </div>

            {/* Regex Pattern - Full width */}
            <div className="space-y-2">
              <Label htmlFor="regex" className="text-sm font-medium">
                Regex Pattern
              </Label>
              <Input
                id="regex"
                value={newMission.regex || ""}
                onChange={(e) => handleInputChange("regex", e.target.value)}
                placeholder="Enter regex pattern"
                className="w-full font-mono text-sm"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 px-6"
            >
              {isEditMode ? "Update Mission" : "Add Mission"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};