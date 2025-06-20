import { useCallback, useContext, useEffect, useState } from "react";
import { Eye, Copy, ArrowRight, QrCode } from "lucide-react";
import { toast } from "sonner";
import QRCode from "react-qr-code";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AppContext } from "@/context/AppContext";
import { config } from "@/lib/config";

export default function DashboardHomePage() {
  const [loadingSlug, setLoadingSlug] = useState(true);
  const [slug, setSlug] = useState("");
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error("AppContext must be used within an AppProvider");
  }

  const { token } = context;
  const menuLink = slug ? `${config.public_url}/${slug}` : "";

  const fetchSlug = useCallback(async () => {
    try {
      const res = await fetch(`${config.backend_url}/api/get-slug`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success && data.slug) {
        setSlug(data.slug);
      } else {
        throw new Error(data.message || "Slug not found");
      }
    } catch (err) {
      console.error("Error fetching slug", err);
      toast.error("Failed to load restaurant slug.");
    } finally {
      setLoadingSlug(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchSlug();
    }
  }, [token, fetchSlug]);

  const copyToClipboard = useCallback(() => {
    if (!menuLink) return;
    navigator.clipboard.writeText(menuLink)
      .then(() => toast.success("Link Copied Successfully"))
      .catch(() => toast.error("Failed to copy link"));
  }, [menuLink]);

  const openLink = useCallback(() => {
    if (!menuLink) return;
    window.open(`https://${menuLink}`, "_blank", "noopener,noreferrer");
  }, [menuLink]);

  const downloadQRCode = useCallback(() => {
    const svg = document.getElementById("qr-code");
    if (!svg || !menuLink) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${slug}-menu-qr.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  }, [menuLink, slug]);

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      
          
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* Menu Link Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Your Menu Link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {loadingSlug ? (
                <Skeleton className="h-11 w-full rounded-md" />
              ) : (
                <Input
                  value={menuLink}
                  readOnly
                  className="flex-1 text-sm truncate bg-gray-50"
                  aria-label="Your menu link"
                />
              )}
              <div className="flex space-x-2">
                <Button 
                  onClick={copyToClipboard} 
                  size="sm"
                  disabled={loadingSlug || !menuLink}
                  variant="outline"
                  className="p-2"
                  aria-label="Copy link"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={openLink}
                  disabled={loadingSlug || !menuLink} 
                  size="sm" 
                  variant="outline" 
                  className="p-2" 
                  aria-label="Preview link"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Share this link with your customers to access your digital menu
            </p>
          </CardContent>
        </Card>

        {/* QR Code Card */}
        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <QrCode className="h-5 w-5 text-green-600" />
              Your QR Code
            </CardTitle>
            <CardDescription className="text-sm">
              Print or display this QR code for customers to scan your menu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setQrDialogOpen(true)}
              disabled={loadingSlug || !menuLink}
              className="w-full md:w-auto gap-2 bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all"
              size="lg"
              aria-label="Show QR code"
            >
              Show QR Code
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Menu QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            {menuLink && (
              <div className="p-4 bg-white rounded-lg">
                <QRCode 
                  id="qr-code"
                  value={`https://${menuLink}`} 
                  size={256}
                  level="H"
                  aria-label="QR Code for your menu"
                />
              </div>
            )}
            <div className="flex gap-2 w-full">
              <Button 
                onClick={downloadQRCode}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={!menuLink}
                aria-label="Download QR code"
              >
                Download QR Code
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setQrDialogOpen(false)}
                className="flex-1"
                aria-label="Close dialog"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}