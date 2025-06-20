import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import BouncingDotsLoader from "@/components/ui/bounce-loader";
import { config } from "@/lib/config";
import { AppContext } from "@/context/AppContext";
import { ImageUploader } from "@/components/ui/image-uploader";

export default function CardSettingsPage() {
  const [formData, setFormData] = useState({
    name: "",
    profession: "",
    bio: "",
    email: "",
    phone: "",
    address: "",
    instagram: "",
    facebook: "",
    website: "",
    bannerImage: "",
    profileImage: "",
  });

  const [initialData, setInitialData] = useState(formData);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within an AppProvider");
  }
  const { token } = context;

  useEffect(() => {
    if (!token) return;

    const fetchCardData = async () => {
      try {
        const res = await fetch(`${config.backend_url}/api/card`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch card data");

        const data = await res.json();

        if (data.success && data.data) {
          const cardData = data.data.data || {};
          const formattedData = {
            name: cardData.name || "",
            profession: cardData.profession || "",
            bio: cardData.bio || "",
            email: cardData.email || "",
            phone: cardData.phone || "",
            address: cardData.address || "",
            instagram: cardData.instagram || "",
            facebook: cardData.facebook || "",
            website: cardData.website || "",
            bannerImage: cardData.bannerImage || "",
            profileImage: cardData.profileImage || "",
          };
          setFormData(formattedData);
          setInitialData(formattedData);
        } else {
          throw new Error(data.message || "Card not found");
        }
      } catch (err) {
        toast.error("Failed to load card data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCardData();
  }, [token]);

  useEffect(() => {
    const changesDetected = JSON.stringify(formData) !== JSON.stringify(initialData);
    setHasChanges(changesDetected);
  }, [formData, initialData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!token) {
      toast.error("You must be logged in to update.");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(`${config.backend_url}/api/card`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          data: {
            name: formData.name,
            profession: formData.profession,
            bio: formData.bio,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            instagram: formData.instagram,
            facebook: formData.facebook,
            website: formData.website,
            bannerImage: formData.bannerImage,
            profileImage: formData.profileImage,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update");
      }

      // const data = await res.json();
      setInitialData(formData);
      toast.success("Changes saved successfully");
    } catch (err) {
      toast.error("Failed to save changes");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };


  const handleImageUpload = async (type: 'banner' | 'profile', file: File | null) => {
  if (!file || !token) {
    handleChange(`${type}Image`, "");
    return;
  }

  try {
    setSaving(true); // Show loading state during upload
    
    // Create FormData and append the file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type); // Send image type to server if needed

    // Upload to your backend
    const res = await fetch(`${config.backend_url}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData
    });

    if (!res.ok) {
      throw new Error('Image upload failed');
    }

    const data = await res.json();
    
    // Handle the response based on your API structure
    if (data.url) {
      handleChange(`${type}Image`, data.url);
      toast.success(`${type === 'profile' ? 'Profile' : 'Banner'} image uploaded successfully`);
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error(`Failed to upload ${type} image:`, error);
    toast.error(`Failed to upload ${type} image`);
    handleChange(`${type}Image`, ""); // Clear the field on error
  } finally {
    setSaving(false);
  }
};

  if (loading) return <BouncingDotsLoader />;

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Card Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your digital card details
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="w-full md:w-auto"
        >
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
          {hasChanges && !saving && (
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
              Unsaved
            </span>
          )}
        </Button>
      </div>

      <div className="space-y-8">
        {/* Images Section */}
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Images</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <Label>Profile Image</Label>
              <ImageUploader
                imageUrl={formData.profileImage}
                onUpload={(file) => handleImageUpload('profile', file)}
                onDelete={() => handleChange("profileImage", "")}
                className="h-48"
              />
            </div>
            <div className="space-y-4">
              <Label>Banner Image</Label>
              <ImageUploader
                imageUrl={formData.bannerImage}
                onUpload={(file) => handleImageUpload('banner', file)}
                onDelete={() => handleChange("bannerImage", "")}
                className="h-48"
              />
            </div>
          </div>
        </div>

        {/* Basic Information Section */}
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Basic Information</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession">Profession</Label>
                <Input
                  id="profession"
                  value={formData.profession}
                  onChange={(e) => handleChange("profession", e.target.value)}
                  placeholder="Your profession"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  placeholder="A short bio about yourself"
                  rows={5}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Contact Information</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+1 (123) 456-7890"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Your address"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Social Media</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => handleChange("instagram", e.target.value)}
                  placeholder="@username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={formData.facebook}
                  onChange={(e) => handleChange("facebook", e.target.value)}
                  placeholder="facebook.com/username"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {hasChanges && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-green-200 flex items-center gap-4">
          <div className="text-green-800">You have unsaved changes</div>
          <Button
            onClick={handleSave}
            disabled={saving}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save
          </Button>
        </div>
      )}
    </div>
  );
}