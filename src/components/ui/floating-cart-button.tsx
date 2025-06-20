import { ShoppingCart } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Restaurant } from '@/lib/types';

interface FloatingCartButtonProps {
  className?: string;
  iconSize?: number;
  buttonStyle?: 'default' | 'minimal';
  restaurant:Restaurant;
}

export function FloatingCartButton({ 
  className = '', 
  iconSize = 16,
  buttonStyle = 'default',
  restaurant 
}: FloatingCartButtonProps) {
  const { cartItems } = useCart();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (itemCount === 0) return null;

  const baseClasses = `
    fixed bottom-4 inset-x-0 z-50 flex justify-center px-4
    ${className}
  `;

  const buttonClasses = {
    default: `
      bg-amber-600 hover:bg-primary-dark
      text-white text-xs font-medium
      py-3 px-5
      rounded-full
      shadow-md
      transition-all duration-200
      transform hover:scale-[1.03]
      active:scale-95
      flex items-center justify-center
      gap-1.5
      max-w-xs w-full
      whitespace-nowrap
    `,
    minimal: `
      bg-background/90 hover:bg-background
      text-foreground border border-border
      text-xs font-medium
      py-1.5 px-3
      rounded-full
      shadow-sm
      transition-all duration-200
      flex items-center justify-center
      gap-1.5
      max-w-xs w-full
      whitespace-nowrap
      backdrop-blur-sm
    `
  };

  return (
    <div className={baseClasses}>
        <Link
        state={{ whatsappNumber: restaurant.whatsapp, restaurantName: restaurant.name, restaurantSlug: restaurant.slug }}
        to={`/${slug}/cart`}
        >
             <button
        onClick={() => navigate(`/${slug}/cart`)}
        className={buttonClasses[buttonStyle]}
        aria-label={`View cart (${itemCount} items)`}
      >
        <ShoppingCart size={iconSize} className="flex-shrink-0" />
        <span>Open Cart ({itemCount})</span>
      </button>
        </Link>
     
    </div>
  );
}