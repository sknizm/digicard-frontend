"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { config } from "@/lib/config";
import { AppContext } from "@/context/AppContext";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
  });

  const context = useContext(AppContext);
    
  if (!context) {
    throw new Error("AppContext must be used within an AppProvider");
  }

  const { token } = context;

  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Upload image if exists
      
      // Prepare data for API
      const onboardingData = {
        ...formData
      };

      // Submit to backend
      const response = await fetch(`${config.backend_url}/api/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(onboardingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save onboarding data");
      }

      toast.success("Profile setup completed successfully");
      navigate("/dashboard");

    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to complete onboarding");
      console.error("Onboarding error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-xl overflow-hidden border border-green-100">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 border border-green-100">
              <span className="text-sm font-bold bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent">
                MenuLink
              </span>
            </span>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-green-800">
              {step === 1 ? "Complete Your Profile" : "Add Your Contact Info"}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {step === 1 ? "Let's start with the basics" : "Help people connect with you"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {step === 1 ? (
            <div className="space-y-6">
              {/* <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profileImageUrl} />
                  <AvatarFallback className="text-2xl">
                    {formData.name ? formData.name.charAt(0).toUpperCase() : "P"}
                  </AvatarFallback>
                </Avatar>
                <label className="cursor-pointer">
                  <span className="text-sm font-medium text-green-600 hover:text-green-700">
                    Upload Profile Photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div> */}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="profession" className="block text-sm font-medium text-gray-700">
                    Profession
                  </label>
                  <Input
                    id="profession"
                    name="profession"
                    placeholder="e.g. Chef, Restaurant Owner"
                    value={formData.profession}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tell us a bit about yourself..."
                    value={formData.bio}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="text-gray-700"
                >
                  Skip for now
                </Button>
                <Button
                  onClick={() => setStep(2)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Next
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="123 Main St, City, Country"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                    Instagram
                  </label>
                  <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      instagram.com/
                    </span>
                    <Input
                      id="instagram"
                      name="instagram"
                      placeholder="yourusername"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      className="flex-1 block w-full rounded-none rounded-r-md"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
                    Facebook
                  </label>
                  <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      facebook.com/
                    </span>
                    <Input
                      id="facebook"
                      name="facebook"
                      placeholder="yourusername"
                      value={formData.facebook}
                      onChange={handleInputChange}
                      className="flex-1 block w-full rounded-none rounded-r-md"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    placeholder="https://yourwebsite.com"
                    value={formData.website}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="text-gray-700"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : "Done"}
                </Button>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                  {errorMessage}
                </div>
              )}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingPage;