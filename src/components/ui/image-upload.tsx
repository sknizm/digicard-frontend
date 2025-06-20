import { useState, useRef, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImagePlus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { config } from "@/lib/config";
import { AppContext } from "@/context/AppContext";
import { useContext } from 'react';

type RestaurantImageUploadProps = {
  type: 'logo' | 'banner';
  currentImage?: string | null;
  onUploadSuccess: (url: string) => void;
  onDeleteSuccess: () => void;
};

export function RestaurantImageUpload({
  type,
  currentImage,
  onUploadSuccess,
  onDeleteSuccess,
}: RestaurantImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error("AppContext must be used within an AppProvider");
  }
  const { token } = context;

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const res = await fetch(`${config.backend_url}/api/upload`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      console.log("HEY", data)
      onUploadSuccess(data.url);
      toast.success(`${type === 'logo' ? 'Logo' : 'Banner'} uploaded successfully`);
    } catch (err) {
      toast.error(`Failed to upload ${type}`);
      console.error(err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    if (!currentImage || !token) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`${config.backend_url}/api/delete-image`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: currentImage }),
      });

      if (!res.ok) throw new Error('Delete failed');

      onDeleteSuccess();
      toast.success(`${type === 'logo' ? 'Logo' : 'Banner'} removed successfully`);
    } catch (err) {
      toast.error(`Failed to remove ${type}`);
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Label>{type === 'logo' ? 'Logo' : 'Banner'} Image</Label>
      
      {currentImage ? (
        <div className="relative group">
          <div className={`overflow-hidden rounded-md ${type === 'logo' ? 'w-32 h-32' : 'w-full h-48'}`}>
            <img
              src={currentImage}
              alt={type === 'logo' ? 'Restaurant logo' : 'Restaurant banner'}
              className={`w-full h-full object-${type === 'logo' ? 'contain' : 'cover'}`}
            />
          </div>
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-md flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
            type === 'logo' ? 'w-32 h-32' : 'w-full h-48'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            accept="image/*"
            className="hidden"
          />
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          ) : (
            <>
              <ImagePlus className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500 text-center">
                Click to upload {type}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}