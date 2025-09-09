"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X, AlertTriangle, Loader2 } from "lucide-react";

export interface MissionActionConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: "approve" | "reject";
  missionName: string;
  isLoading?: boolean;
}

export const MissionActionConfirmDialog: React.FC<MissionActionConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  missionName,
  isLoading = false,
}) => {
  const isApprove = action === "approve";

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        {/* Header Section with Gradient */}
        <div
          className={`relative px-6 pt-6 pb-4 ${
            isApprove
              ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30"
              : "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30"
          }`}
        >
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-center mb-2">
              <div
                className={`relative flex items-center justify-center w-16 h-16 rounded-full ${
                  isApprove
                    ? "bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40"
                    : "bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/40 dark:to-rose-900/40"
                } shadow-lg`}
              >
                {isApprove ? (
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                ) : (
                  <X className="h-8 w-8 text-red-600 dark:text-red-400" />
                )}
                {/* Decorative ring */}
                <div
                  className={`absolute inset-0 rounded-full border-2 ${
                    isApprove
                      ? "border-green-200 dark:border-green-700"
                      : "border-red-200 dark:border-red-700"
                  } opacity-30`}
                />
              </div>
            </div>

            <DialogTitle className="text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
              {isApprove ? "Approve Mission" : "Reject Mission"}
            </DialogTitle>

            <DialogDescription className="text-center text-gray-600 dark:text-gray-400 text-base">
              {isApprove
                ? "This action will mark the mission as approved and notify the user"
                : "This action will mark the mission as rejected and notify the user"}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content Section */}
        <div className="px-6 py-4 space-y-6">
          {/* Warning Section */}
          <div className="flex items-start gap-4 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                Confirm Action
              </h4>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Are you sure you want to {isApprove ? "approve" : "reject"} this mission? 
                This action cannot be undone.
              </p>
            </div>
          </div>

          {/* Mission Details Card */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm uppercase tracking-wide">
              Mission Details
            </h4>
            <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50" />
              <div className="relative p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Mission Name
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100 break-words leading-relaxed">
                      {missionName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <DialogFooter className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 sm:flex-initial h-11 px-6 font-medium border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`flex-1 sm:flex-initial h-11 px-6 font-medium transition-all duration-200 shadow-lg ${
                isApprove
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-green-200 dark:shadow-green-900/30"
                  : "bg-red-600 hover:bg-red-700 text-white shadow-red-200 dark:shadow-red-900/30"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isApprove ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  <span>{isApprove ? "Approve Mission" : "Reject Mission"}</span>
                </div>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};