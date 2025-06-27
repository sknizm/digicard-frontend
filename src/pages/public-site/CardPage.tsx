// components/business-card/BusinessCard.tsx
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { config } from "@/lib/config";
import { AppContext } from "@/context/AppContext";
import { CardType, ServiceType, StatusType } from "@/lib/types";
import { ErrorStates } from "@/components/business-card/ErrorStates";
import { CardHeader } from "@/components/business-card/CardHeader";
import { ServicesList } from "@/components/business-card/ServicesList";
import { BookingForm } from "@/components/business-card/BookingForm";
import { Footer } from "@/components/business-card/Footer";

export const BusinessCard = () => {
  const { slug } = useParams<{ slug: string }>();
  const [cardData, setCardData] = useState<CardType | null>(null);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [status, setStatus] = useState<StatusType>("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");

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

  if (status !== "loaded" || !cardData) {
    return <ErrorStates 
      status={status} 
      errorMsg={errorMsg} 
      onRetry={() => window.location.reload()} 
    />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CardHeader data={cardData.data} />
      <ServicesList services={services} />
      {services.length > 0 && (
        <BookingForm 
          services={services} 
          businessPhone={cardData.data.phone}
          businessName={cardData.data.name}
        />
      )}
      <Footer/>
    </div>
  );
};

export default BusinessCard;