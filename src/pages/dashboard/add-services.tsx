import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { config } from "@/lib/config";
import ImageUpload from "@/components/setting/ImageUpload";
import { Loader2 } from "lucide-react";

interface Service {
  id?: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
}

export default function ServiceManagerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<Service>({
    name: "",
    description: "",
    price: "",
    image_url: "",
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    if (id) {
      fetchService();
    }
  }, [id]);

  const fetchService = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.backend_url}/api/services/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch service");
      const data = await response.json();
      setService({
        ...data,
        price: data.price.toString(),
      });
    } catch (err) {
      if(err)
      toast.error("Failed to load service");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Service, value: string) => {
    setService({ ...service, [field]: value });
  };

  const handleImageUpload = (url: string) => {
    handleChange("image_url", url);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const url = id 
        ? `${config.backend_url}/api/services/${id}`
        : `${config.backend_url}/api/services`;
      
      const method = id ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...service,
          price: parseFloat(service.price),
        }),
      });

      if (!response.ok) throw new Error("Failed to save service");
      
      toast.success(`Service ${id ? "updated" : "created"} successfully!`);
      navigate("/dashboard/all-services");
    } catch (err) {
      if(err)
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-4">
      <h1 className="text-2xl font-semibold">
        {id ? "Edit Service" : "Add New Service"}
      </h1>

      <div className="rounded-lg border p-4 space-y-4 shadow-sm bg-white">
        <ImageUpload
          label="Service Image (Optional)"
          imageUrl={service.image_url}
          token={token}
          onUpload={handleImageUpload}
        />

        <Input
          placeholder="Service Name*"
          value={service.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />

        <Textarea
          placeholder="Description (Optional)"
          value={service.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        <Input
          placeholder="Price*"
          type="number"
          value={service.price}
          onChange={(e) => handleChange("price", e.target.value)}
          required
        />

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : null}
            {id ? "Update Service" : "Create Service"}
          </Button>
        </div>
      </div>
    </div>
  );
}