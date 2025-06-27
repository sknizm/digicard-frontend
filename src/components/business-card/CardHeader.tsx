// components/business-card/CardHeader.tsx
import { Mail, Phone, MapPin, Instagram, Facebook, Globe, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardDataType } from "@/lib/types";

interface CardHeaderProps {
  data: CardDataType;
}

export const CardHeader = ({ data }: CardHeaderProps) => {
  const {
    name,
    profession,
    bio,
    profileImage,
    bannerImage,
    email,
    phone,
    address,
    instagram,
    facebook,
    website,
  } = data;

  const socialLinks = [
    {
      icon: <Mail className="w-4 h-4" />,
      url: email ? `mailto:${email}` : null,
      label: "Email",
    },
    {
      icon: <Phone className="w-4 h-4" />,
      url: phone ? `tel:${phone}` : null,
      label: "Phone",
    },
    {
      icon: <MapPin className="w-4 h-4" />,
      url: address
        ? `https://maps.google.com?q=${encodeURIComponent(address)}`
        : null,
      label: "Address",
    },
    {
      icon: <Instagram className="w-4 h-4" />,
      url: instagram ? `https://instagram.com/${instagram}` : null,
      label: "Instagram",
    },
    {
      icon: <Facebook className="w-4 h-4" />,
      url: facebook ? `https://facebook.com/${facebook}` : null,
      label: "Facebook",
    },
    {
      icon: <Globe className="w-4 h-4" />,
      url: website
        ? website.startsWith("http")
          ? website
          : `https://${website}`
        : null,
      label: "Website",
    },
  ].filter((l) => l.url);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
      {/* Banner */}
      {bannerImage ? (
        <div className="h-48 sm:h-56 overflow-hidden">
          <img
            src={bannerImage}
            alt="Banner"
            className="w-full h-full object-cover"
            onError={(e) =>
              ((e.target as HTMLImageElement).style.display = "none")
            }
          />
        </div>
      ) : (
        <div className="h-48 sm:h-56 bg-gradient-to-r from-blue-50 to-purple-50" />
      )}

      <div className="p-6 relative">
        {/* Profile */}
        {profileImage && (
          <div className="absolute -top-16 left-6 border-4 border-white rounded-full overflow-hidden shadow-md">
            <img
              src={profileImage}
              alt={name || "Profile"}
              className="w-32 h-32 object-cover"
              onError={(e) =>
                ((e.target as HTMLImageElement).src = "/default-profile.png")
              }
            />
          </div>
        )}

        {/* Name & Profession */}
        <div className={profileImage ? "mt-20" : "mt-0"}>
          {name && (
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {name}
            </h1>
          )}
          {profession && (
            <div className="flex items-center text-gray-600 mt-2">
              <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
              <p className="truncate">{profession}</p>
            </div>
          )}
        </div>

        {/* Bio */}
        {bio && (
          <p className="text-gray-600 my-6 whitespace-pre-line">
            {bio}
          </p>
        )}

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {socialLinks.map((l, i) => (
              <Button
                key={i}
                variant="outline"
                className="flex items-center justify-start gap-2 h-auto py-2"
                onClick={() => window.open(l.url as string, "_blank")}
              >
                <span className="text-gray-700">{l.icon}</span>
                <span className="truncate text-sm">{l.label}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};