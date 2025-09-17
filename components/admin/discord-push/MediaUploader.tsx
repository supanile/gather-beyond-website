"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MediaUploaderProps } from "@/types/admin/discordPush";
import { Upload, Link, ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export function MediaUploader({ 
  onImageUpload, 
  largeImageUrl, 
  thumbnailUrl 
}: MediaUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUrlInput = (url: string, type: "large" | "thumbnail") => {
    if (url && !isValidImageUrl(url)) {
      toast.error("Please enter a valid image URL");
      return;
    }
    onImageUpload(url, type);
  };

  const isValidImageUrl = (url: string) => {
    try {
      new URL(url);
      return /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(url);
    } catch {
      return false;
    }
  };

  const handleFileUpload = async (file: File, type: "large" | "thumbnail") => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 8 * 1024 * 1024) { // 8MB limit
      toast.error("Image size must be less than 8MB");
      return;
    }

    setUploading(true);
    try {
      // In a real implementation, you would upload to a service like Cloudinary, AWS S3, etc.
      // For now, we'll create a blob URL for preview
      const url = URL.createObjectURL(file);
      onImageUpload(url, type);
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent, type: "large" | "thumbnail") => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0], type);
    }
  };

  const ImageUploadCard = ({ 
    type, 
    title, 
    description, 
    currentUrl 
  }: { 
    type: "large" | "thumbnail"; 
    title: string; 
    description: string; 
    currentUrl?: string;
  }) => (
    <Card 
      className={`
        p-4 border-2 border-dashed transition-colors
        ${dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
      `}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => handleDrop(e, type)}
    >
      <div className="space-y-3">
        <div>
          <Label className="text-sm font-medium">{title}</Label>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>

        {/* URL Input */}
        <div className="space-y-2">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Enter image URL..."
                value={currentUrl || ""}
                onChange={(e) => handleUrlInput(e.target.value, type)}
                className="pl-10"
              />
            </div>
            {currentUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onImageUpload("", type)}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* File Upload */}
        <div className="text-center">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file, type);
            }}
            className="hidden"
            id={`file-upload-${type}`}
            disabled={uploading}
          />
          <label
            htmlFor={`file-upload-${type}`}
            className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-dashed border-muted-foreground/50 rounded-md hover:bg-muted/50 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            <span className="text-sm">
              {uploading ? "Uploading..." : "Upload File"}
            </span>
          </label>
        </div>

        {/* Preview */}
        {currentUrl && (
          <div className="mt-3">
            <div className="relative">
              <Image
                src={currentUrl}
                alt={`${title} preview`}
                width={type === "large" ? 300 : 64}
                height={type === "large" ? 150 : 64}
                className={`
                  rounded-md object-cover border
                  ${type === "large" ? "w-full h-32" : "w-16 h-16"}
                `}
                onError={() => {
                  toast.error("Failed to load image");
                  onImageUpload("", type);
                }}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => onImageUpload("", type)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <ImageIcon className="w-4 h-4 mr-2" />
        <Label className="text-base font-semibold">Media Upload</Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ImageUploadCard
          type="large"
          title="Large Image"
          description="Main banner image (recommended: 600x300px)"
          currentUrl={largeImageUrl}
        />
        
        <ImageUploadCard
          type="thumbnail"
          title="Thumbnail"
          description="Small thumbnail image (recommended: 80x80px)"
          currentUrl={thumbnailUrl}
        />
      </div>

      <div className="text-xs text-muted-foreground">
        <p>• Supported formats: JPG, PNG, GIF, WebP</p>
        <p>• Maximum file size: 8MB</p>
        <p>• Images will be automatically resized if needed</p>
      </div>
    </div>
  );
}
