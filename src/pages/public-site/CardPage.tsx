import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CardType } from "@/lib/types";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Facebook, 
  Globe, 
  Briefcase,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {config} from '@/lib/config';
import { AppContext } from '@/context/AppContext';

const BusinessCard = () => {
  const { slug } = useParams<{ slug: string }>();
  const [cardData, setCardData] = useState<CardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  
    const context = useContext(AppContext);
      
    if (!context) {
      throw new Error("AppContext must be used within an AppProvider");
    }
  
    const { token } = context;
    

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${config.backend_url}/api/card/${slug}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(response.status === 404 
            ? 'Card not found' 
            : 'Failed to fetch card data');
        }

        const data = await response.json();
        setCardData(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCardData();
    }
  }, [slug, token]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:w-full">
        <Skeleton className="h-48 w-full" />
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!cardData) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Card Found</h2>
          <p className="text-gray-600">The requested business card doesn't exist</p>
        </div>
      </div>
    );
  }

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
    website 
  } = cardData.data;

  const socialLinks = [
    { icon: <Mail className="w-4 h-4" />, url: email ? `mailto:${email}` : null, label: "Email" },
    { icon: <Phone className="w-4 h-4" />, url: phone ? `tel:${phone}` : null, label: "Phone" },
    { icon: <MapPin className="w-4 h-4" />, url: address ? `https://maps.google.com?q=${encodeURIComponent(address)}` : null, label: "Address" },
    { icon: <Instagram className="w-4 h-4" />, url: instagram ? `https://instagram.com/${instagram}` : null, label: "Instagram" },
    { icon: <Facebook className="w-4 h-4" />, url: facebook ? `https://facebook.com/${facebook}` : null, label: "Facebook" },
    { icon: <Globe className="w-4 h-4" />, url: website ? (website.startsWith('http') ? website : `https://${website}`) : null, label: "Website" },
  ].filter(link => link.url !== null);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:w-full mb-8">
      {/* Banner Image */}
      {bannerImage ?
        <div className="h-48 bg-gray-200 overflow-hidden">
          <img 
            src={bannerImage} 
            alt="Banner" 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      : <div className="h-48 bg-gray-200 overflow-hidden">
          
        </div>}
      
      <div className="p-6 relative">
        {/* Profile Image */}
        {profileImage && (
          <div className="absolute -top-16 left-6 border-4 border-white rounded-full overflow-hidden">
            <img 
              src={profileImage} 
              alt={name || "Profile"} 
              className="w-32 h-32 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/default-profile.png';
              }}
            />
          </div>
        )}
        
        {/* Name and Profession */}
        <div className={`mt-${profileImage ? '16' : '0'} mb-4`}>
          {name && (
            <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
          )}
          {profession && (
            <div className="flex items-center text-gray-600 mt-1">
              <Briefcase className="w-4 h-4 mr-2" />
              <p>{profession}</p>
            </div>
          )}
        </div>
        
        {/* Bio */}
        {bio && (
          <p className="text-gray-600 mb-6">{bio}</p>
        )}
        
        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {socialLinks.map((link, index) => (
              <Button
                key={index}
                variant="outline"
                className="flex items-center justify-start gap-2"
                onClick={() => window.open(link.url || '#', '_blank')}
              >
                {link.icon}
                <span className="truncate">{link.label}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessCard;