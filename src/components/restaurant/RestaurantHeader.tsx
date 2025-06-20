import { MapPin } from 'lucide-react';
import { Restaurant } from '@/lib/types';

export function RestaurantHeader({
  restaurant,
}: {
  restaurant: Restaurant;
}) {
  // Use proper image paths from restaurant settings
  const banner = restaurant.settings?.bannerImage ?? '';
  const logo = restaurant.settings?.logoImage ?? '';

  return (
    <div className="relative">
      {/* Banner with gradient overlay */}
      {banner && (
        <div className="w-full h-48 sm:h-56 md:h-64 overflow-hidden relative">
          <img
            src={banner}
            alt={`${restaurant.name} banner`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-black/5" />
        </div>
      )}

      {/* Content area */}
      <div
        className={`relative bg-white pb-6 ${
          banner ? '-mt-12 rounded-t-3xl pt-16' : 'pt-6'
        } shadow-sm`}
      >
        {/* Logo */}
        {logo && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white overflow-hidden shadow-lg bg-white flex items-center justify-center">
              <img
                src={logo}
                alt={`${restaurant.name} logo`}
                className="w-full h-full object-contain p-1"
              />
            </div>
          </div>
        )}

        {/* Restaurant info */}
        <div className="text-center mt-6 px-4 sm:px-6 max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {restaurant.name}
          </h1>

          {/* Address */}
          {restaurant.address && (
            <div className="flex items-center justify-center gap-2 text-gray-600 mt-2 text-sm sm:text-base">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{restaurant.address}</span>
            </div>
          )}

      
        </div>
      </div>
    </div>
  );
}