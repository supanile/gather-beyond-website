"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  username?: string;
  avatarUrl?: string;
  discordId?: string;
}

export function AvatarModal({
  isOpen,
  onClose,
  username = "Unknown User",
  avatarUrl,
  discordId,
}: AvatarModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              {username}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-6">
          <Avatar className="w-48 h-48">
            {avatarUrl ? (
              <AvatarImage
                src={avatarUrl}
                alt={`${username}'s avatar`}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-4xl font-medium">
              <User className="w-20 h-20" />
            </AvatarFallback>
          </Avatar>

          <div className="text-center space-y-1">
            <h3 className="font-semibold text-lg">{username}</h3>
            {discordId && (
              <p className="text-sm text-muted-foreground">ID: {discordId}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
