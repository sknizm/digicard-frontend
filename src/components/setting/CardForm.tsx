// src/components/CardForm.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CardType } from "@/lib/types";
import ImageUpload from "./ImageUpload";
import { config } from "@/lib/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Globe, Instagram, Facebook } from "lucide-react";

interface CardFormProps {
  card: CardType;
  token: string;
}

export default function CardForm({ card, token }: CardFormProps) {
  const [formData, setFormData] = useState<CardType["data"]>(card.data || {});
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${config.backend_url}/api/card`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: formData }),
      });

      if (!res.ok) throw new Error("Update failed");
      toast.success("Card updated successfully");
    } catch (err) {
      if (err) toast.error("Failed to update card");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 md:p-6">
      {/* Images Section */}
      <Card>
        <CardHeader>
          <CardTitle>Visual Identity</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <ImageUpload
            label="Profile Image"
            imageUrl={formData.profileImage}
            onUpload={(url) =>
              setFormData((prev) => ({ ...prev, profileImage: url }))
            }
            token={token}
          />
          <ImageUpload
            label="Banner Image"
            imageUrl={formData.bannerImage}
            onUpload={(url) =>
              setFormData((prev) => ({ ...prev, bannerImage: url }))
            }
            token={token}
          />
        </CardContent>
      </Card>

      {/* Basic Info Section */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="profession">Profession</Label>
            <Input
              id="profession"
              name="profession"
              value={formData.profession || ""}
              onChange={handleChange}
              placeholder="Software Engineer"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              placeholder="A short description about yourself"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="email">Email</Label>
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="your@email.com"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="phone">Phone</Label>
            </div>
            <Input
              id="phone"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              placeholder="+1 (123) 456-7890"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="address">Address</Label>
            </div>
            <Input
              id="address"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              placeholder="123 Main St, City, Country"
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Instagram className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="instagram">Instagram</Label>
            </div>
            <Input
              id="instagram"
              name="instagram"
              value={formData.instagram || ""}
              onChange={handleChange}
              placeholder="https://instagram.com/username"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Facebook className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="facebook">Facebook</Label>
            </div>
            <Input
              id="facebook"
              name="facebook"
              value={formData.facebook || ""}
              onChange={handleChange}
              placeholder="https://facebook.com/username"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="website">Website</Label>
            </div>
            <Input
              id="website"
              name="website"
              value={formData.website || ""}
              onChange={handleChange}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleSubmit}
        disabled={saving}
        className="w-full md:w-auto"
        size="lg"
      >
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}