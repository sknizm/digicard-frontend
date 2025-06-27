// components/business-card/ServicesList.tsx

import { ServiceType } from "@/lib/types";

interface ServicesListProps {
  services: ServiceType[];
}

export const ServicesList = ({ services }: ServicesListProps) => {
  return (
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
  );
};