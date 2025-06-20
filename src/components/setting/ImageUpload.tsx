// src/components/ImageUpload.tsx
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { config } from "@/lib/config";
import { UploadCloud, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  label: string;
  imageUrl?: string;
  onUpload: (url: string) => void;
  token: string;
}

export default function ImageUpload({
  label,
  imageUrl,
  onUpload,
  token,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${config.backend_url}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      onUpload(data.url);
      toast.success("Image uploaded successfully");
    } catch (err) {
      if (err) toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium leading-none">{label}</label>
      <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed p-6 text-center">
        {imageUrl ? (
          <div className="relative w-full">
            <img
              src={imageUrl}
              alt="Uploaded preview"
              className="h-40 w-full rounded-md object-cover"
            />
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Change Image"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <UploadCloud className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              SVG, PNG, JPG (max. 5MB)
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              {uploading ? "Uploading..." : "Select Image"}
            </Button>
          </div>
        )}
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>
    </div>
  );
}