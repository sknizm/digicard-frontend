import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Globe,
  Briefcase,
  Calendar,
  User,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { config } from "@/lib/config";
import { AppContext } from "@/context/AppContext";
import { CardType, ServiceType } from "@/lib/types";
import { toast } from "sonner";

const BusinessCard = () => {
  const { slug } = useParams<{ slug: string }>();
  

  const [cardData, setCardData] = useState<CardType | null>(null);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [status, setStatus] = useState<
    "loading" | "not_found" | "inactive" | "loaded" | "error"
  >("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Booking form state
  const [bookingData, setBookingData] = useState({
    name: "",
    phone: "",
    serviceId: "",
    message: "",
  });

  const context = useContext(AppContext);
  if (!context) throw new Error("AppContext must be used within an AppProvider");
  const { token } = context;

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        setStatus("loading");

        const res = await fetch(`${config.backend_url}/api/card/${slug}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 404) {
          setStatus("not_found");
          return;
        }
        if (res.status === 403) {
          setStatus("inactive");
          return;
        }
        if (!res.ok) {
          throw new Error("Failed to fetch card data");
        }

        const json = await res.json();
        setCardData(json.data as CardType);
        setServices((json.data?.services as ServiceType[]) ?? []);
        setStatus("loaded");
      } catch (err) {
        setErrorMsg(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setStatus("error");
      }
    };

    if (slug) fetchCardData();
  }, [slug, token]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`${config.backend_url}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...bookingData,
          cardId: cardData?.id,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit booking");
      }

      toast.message("The business owner will contact you soon.");

      // Reset form
      setBookingData({
        name: "",
        phone: "",
        serviceId: "",
        message: "",
      });
    } catch (err) {
      if(err)
      toast.message("Failed to submit booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  /* ──────────────────────────  UI STATES  ─────────────────────────── */

  if (status === "loading") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Banner skeleton */}
          <Skeleton className="h-48 w-full rounded-t-xl" />
          
          <div className="p-6 space-y-6">
            {/* Profile skeleton */}
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <Skeleton className="h-32 w-32 rounded-full -mt-20 border-4 border-white" />
              <div className="space-y-3 flex-1">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-5 w-48" />
              </div>
            </div>
            
            {/* Bio skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
            
            {/* Social links skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-md" />
              ))}
            </div>
            
            {/* Services skeleton */}
            <div className="pt-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-20 w-20 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "not_found") {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Card Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The business card you're looking for doesn't exist or may have been removed.
          </p>
          <Button onClick={() => window.location.href = "/"}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (status === "inactive") {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 mb-4">
            <svg
              className="h-6 w-6 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-yellow-600 mb-2">
            Membership Expired
          </h2>
          <p className="text-gray-600 mb-6">
            This business card is currently inactive. Please ask the owner to renew their membership.
          </p>
          <Button
            onClick={() => window.location.href = "/pricing"}
            className="w-full"
          >
            Renew Membership
          </Button>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{errorMsg}</p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
            <Button onClick={() => window.location.href = "/"}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (status !== "loaded" || !cardData) return null;

  /* ──────────────────────────  SUCCESS VIEW  ─────────────────────────── */

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
  } = cardData.data;

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* ─── USER DETAILS CARD ─────────────────────────────────────── */}
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
          <div className={`mt-${profileImage ? "20" : "0"} mb-6`}>
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
            <p className="text-gray-600 mb-6 whitespace-pre-line">
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

      {/* ─── SERVICES CARD ─────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
          Services Offered
        </h2>

        {services.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No services added yet.</p>
          </div>
        ) : (
          <ul className="space-y-6">
            {services.map((s) => (
              <li
                key={s.id}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
              >
                {s.image_url && (
                  <div className="sm:w-32 sm:h-32 w-full h-48 flex-shrink-0 overflow-hidden rounded-md">
                    <img
                      src={s.image_url}
                      alt={s.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        (e.target as HTMLImageElement).parentElement!.classList.add("hidden");
                      }}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h3 className="font-medium text-gray-900 text-lg">
                      {s.name}
                    </h3>
                    <span className="whitespace-nowrap font-semibold text-blue-600">
                      ₹{Number(s.price).toFixed(2)}
                    </span>
                  </div>
                  {s.description && (
                    <p className="text-gray-600 mt-2 whitespace-pre-line">
                      {s.description}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ─── BOOKING FORM ─────────────────────────────────────────── */}
      {services.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
            Book a Service
          </h2>
          
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User className="w-4 h-4" />
                  </span>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={bookingData.name}
                    onChange={handleInputChange}
                    className="pl-9"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Phone className="w-4 h-4" />
                  </span>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={bookingData.phone}
                    onChange={handleInputChange}
                    className="pl-9"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                Select Service
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                </span>
                <Select
                  value={bookingData.serviceId}
                  onValueChange={(value) => 
                    setBookingData(prev => ({ ...prev, serviceId: value }))
                  }
                  required
                >
                  <SelectTrigger className="pl-9">
                    <SelectValue placeholder="Choose a service..." />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id || ''}>
                        {service.name} (₹{Number(service.price).toFixed(2)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Message (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">
                  <MessageSquare className="w-4 h-4" />
                </span>
                <Textarea
                  id="message"
                  name="message"
                  value={bookingData.message}
                  onChange={handleInputChange}
                  className="pl-9 min-h-[100px]"
                  placeholder="Any special requests or details..."
                />
              </div>
            </div>
            
            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Book Now"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BusinessCard;