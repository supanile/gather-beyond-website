"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Link, Image, FileText, Video } from "lucide-react";
import { MediaUpload } from "@/types/admin/discordPush";

interface MediaUploaderProps {
  onUpload: (media: MediaUpload) => void;
  onRemove: (mediaId: string) => void;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
}

export function MediaUploader({
  onUpload,
  onRemove,
  maxFileSize = 8,
  acceptedTypes = ["image/*", "video/*", ".pdf", ".doc", ".docx"]
}: MediaUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<MediaUpload[]>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleFiles = useCallback(async (files: FileList) => {
    setUploading(true);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file size
      if (file.size > maxFileSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxFileSize}MB.`);
        continue;
      }

      // Create URL for preview
      const url = URL.createObjectURL(file);
      
      // Determine file type
      let type: "image" | "video" | "document" = "document";
      if (file.type.startsWith("image/")) {
        type = "image";
      } else if (file.type.startsWith("video/")) {
        type = "video";
      }

      const mediaUpload: MediaUpload = {
        file,
        url,
        type,
        size: file.size
      };

      setUploadedFiles(prev => [...prev, mediaUpload]);
      onUpload(mediaUpload);
    }
    
    setUploading(false);
  }, [maxFileSize, onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;

    try {
      new URL(urlInput); // Validate URL
      
      // Determine type from URL extension
      let type: "image" | "video" | "document" = "image";
      const url = urlInput.toLowerCase();
      if (url.includes(".mp4") || url.includes(".webm") || url.includes(".mov")) {
        type = "video";
      } else if (url.includes(".pdf") || url.includes(".doc")) {
        type = "document";
      }

      const mediaUpload: MediaUpload = {
        file: new File([], "url-media"), // Placeholder file
        url: urlInput,
        type,
        size: 0
      };

      setUploadedFiles(prev => [...prev, mediaUpload]);
      onUpload(mediaUpload);
      setUrlInput("");
    } catch {
      alert("Please enter a valid URL");
    }
  };

  const handleRemoveFile = (index: number) => {
    const fileToRemove = uploadedFiles[index];
    URL.revokeObjectURL(fileToRemove.url);
    
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onRemove(`file-${index}`);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "URL";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="w-5 h-5" />
          <span>Media Upload</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Drag and Drop Area */}
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${dragActive 
              ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20" 
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept={acceptedTypes.join(",")}
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {uploading ? "Uploading..." : "Drop files here or click to browse"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Maximum file size: {maxFileSize}MB
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Supports: Images, Videos, Documents
              </p>
            </div>
            
            <Button variant="outline" disabled={uploading}>
              Choose Files
            </Button>
          </div>
        </div>

        {/* URL Input */}
        <div className="space-y-2">
          <Label>Or add media from URL</Label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === "Enter" && handleUrlSubmit()}
              />
            </div>
            <Button onClick={handleUrlSubmit} disabled={!urlInput.trim()}>
              Add
            </Button>
          </div>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <Label>Uploaded Media ({uploadedFiles.length})</Label>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="p-2 bg-white dark:bg-gray-700 rounded">
                      {getFileIcon(file.type)}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {file.file.name || "External URL"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {file.type} • {formatFileSize(file.size)}
                      </p>
                    </div>

                    {file.type === "image" && (
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                        <img
                          src={file.url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Tips for better engagement:
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Use high-quality images (1200x630px recommended for embeds)</li>
            <li>• Keep file sizes under 8MB for faster loading</li>
            <li>• Thumbnails work best at 150x150px</li>
            <li>• Ensure images are relevant to your message content</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
