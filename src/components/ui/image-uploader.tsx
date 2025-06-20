import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  imageUrl?: string;
  onUpload: (file: File | null) => void;
  onDelete: () => void;
  className?: string;
  disabled?: boolean;
}

export function ImageUploader({
  imageUrl,
  onUpload,
  onDelete,
  className,
  disabled = false,
}: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(imageUrl);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(
    (file: File | null) => {
      if (!file) {
        setPreviewUrl(undefined);
        onUpload(null);
        return;
      }

      // Validate file type
      if (!file.type.match("image.*")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
        onUpload(file);
      };
      reader.readAsDataURL(file);
    },
    [onUpload]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Update preview when imageUrl changes
  useEffect(() => {
    setPreviewUrl(imageUrl);
  }, [imageUrl]);

  return (
    <div className={cn("space-y-2 w-full", className)}>
      {previewUrl ? (
        <div className="relative group w-full h-full">
          <div className="w-full h-full overflow-hidden rounded-md border">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => {
              setPreviewUrl(undefined);
              onDelete();
            }}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-md p-4 md:p-6 text-center cursor-pointer transition-colors w-full h-full",
            isDragging ? "border-primary bg-primary/10" : "border-gray-300",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && document.getElementById("file-upload")?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-2 h-full">
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              {isDragging ? "Drop image here" : "Drag & drop or click to upload"}
            </p>
            <p className="text-xs text-gray-500">Upto 2mb Max</p>
            <p className="text-xs text-gray-500">Supports: JPG, PNG, WEBP</p>
          </div>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}