// src/pages/CardSettingsPage.tsx
import CardForm from "@/components/setting/CardForm";
import BouncingDotsLoader from "@/components/ui/bounce-loader";
import { AppContext } from "@/context/AppContext";
import { config } from "@/lib/config";
import { CardType } from "@/lib/types";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner"; // adjust the path based on your file structure

export default function CardSettingsPage() {
  const { token } = useContext(AppContext)!;
  const [card, setCard] = useState<CardType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCardData();
  }, []);

  const fetchCardData = async () => {
    try {
      const res = await fetch(`${config.backend_url}/api/card`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setCard(json.data);
    } catch (err) {
      if(err)
      toast.error("Failed to fetch card data");
    } finally {
      setLoading(false);
    }
  };

 if (loading || !token || !card) {
  return <BouncingDotsLoader/>;
}

return (
  <div className="max-w-2xl mx-auto p-4">
    <h1 className="text-xl font-semibold mb-4">Card Settings</h1>
    <CardForm card={card} token={token} />
  </div>
);
}
