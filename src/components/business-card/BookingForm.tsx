// components/business-card/BookingForm.tsx
import { useState } from "react";
import { Calendar, User, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { BookingData, ServiceType } from "@/lib/types";

interface BookingFormProps {
  services: ServiceType[];
  businessPhone?: string;
  businessName?: string;
}

export const BookingForm = ({ services, businessPhone, businessName }: BookingFormProps) => {
  const [bookingData, setBookingData] = useState<BookingData>({
    name: "",
    phone: "",
    serviceId: "",
    message: "",
  });
  const [isSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessPhone) {
      toast.error("This business hasn't provided a contact number");
      return;
    }

    const selectedService = services.find(s => s.id === bookingData.serviceId);
    
    const whatsappMessage = `Hi ${businessName || 'there'}!%0A%0A` +
      `I'd like to book your service:%0A` +
      `*Service:* ${selectedService?.name || 'Not specified'}%0A` +
      `*Price:* ₹${selectedService?.price || '0.00'}%0A` +
      `*My Name:* ${bookingData.name}%0A` +
      `*My Phone:* ${bookingData.phone}%0A` +
      `${bookingData.message ? `*Message:* ${bookingData.message}%0A` : ''}` +
      `Please let me know about availability. Thank you!`;
    
    window.open(
      `https://wa.me/${businessPhone.replace(/\D/g, '')}?text=${whatsappMessage}`,
      '_blank'
    );
    
    // Reset form
    setBookingData({
      name: "",
      phone: "",
      serviceId: "",
      message: "",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
        Book a Service
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
            {isSubmitting ? "Opening WhatsApp..." : "Book via WhatsApp"}
          </Button>
        </div>
      </form>
    </div>
  );
};