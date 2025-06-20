import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Card, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MenuItem } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { Plus } from 'lucide-react'; 

interface MenuCategoryProps {
  category: {
    id: string;
    name: string;
    menuItems?: MenuItem[];
  };
  isGrid: boolean;
  isOrder: boolean;
  isFirstCategory: boolean;
}

export function MenuCategory({ category, isGrid, isOrder, isFirstCategory }: MenuCategoryProps) {
  const { addToCart, updateQuantity, getQuantity } = useCart();

  const itemsPerPage = 10;
  const [visibleItems, setVisibleItems] = useState<MenuItem[]>([]);
  const [page, setPage] = useState(1);

  const { ref, inView } = useInView({ threshold: 0 });

  // Load initial items
  useEffect(() => {
    if (category.menuItems) {
      setVisibleItems(category.menuItems.slice(0, itemsPerPage));
      setPage(1);
    }
  }, [category]);

  // Load more items when in view
  useEffect(() => {
    if (inView && category.menuItems && visibleItems.length < category.menuItems.length) {
      const nextItems = category.menuItems.slice(0, (page + 1) * itemsPerPage);
      setVisibleItems(nextItems);
      setPage((prev) => prev + 1);
    }
  }, [inView]);

  return (
    <div className="space-y-5">
      {isFirstCategory && <></>}



      <div className="flex items-center gap-3 mt-15">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 whitespace-nowrap">
          {category.name}
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      <div className={`${isGrid ? 'grid grid-cols-2 sm:grid-cols-3' : 'grid'} gap-4`}>
        {visibleItems.map((item, index) => {
          const quantity = getQuantity(item.id);
          const isLast = index === visibleItems.length - 1;

          return (
            <Card
              key={item.id}
              className={`overflow-hidden hover:shadow-md border border-gray-100 ${
                isGrid ? 'flex flex-col h-full' : ''
              }`}
              ref={isLast ? ref : undefined}
            >
              <div className={isGrid ? 'flex flex-col h-full' : 'flex h-full'}>
                {item.image && (
                  <div
                    className={`relative overflow-hidden rounded-md ${
                      isGrid
                        ? 'w-full aspect-square'
                        : 'flex-shrink-0 w-24 h-24 m-2'
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className={`w-full h-full object-cover rounded-md ${isGrid ? 'max-w-full' : ''}`}
                    />
                  </div>
                )}

                <div
                  className={`${
                    isGrid
                      ? 'flex-1 p-4 flex flex-col justify-between'
                      : 'flex-1 p-2 flex flex-col justify-between'
                  } ${!item.image && !isGrid ? 'pl-2' : ''}`}
                >
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p
                        className={`text-sm text-gray-600 mt-1 ${
                          isGrid ? 'line-clamp-3' : 'line-clamp-2'
                        }`}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>

                  <CardFooter
                    className={`p-0 pt-3 flex items-start ${
                      isGrid ? 'flex-col mt-auto gap-2' : 'justify-between items-center'
                    }`}
                  >
                    <span className="font-bold text-amber-600">
                      ₹{item.price.toFixed(2)}
                    </span>

                    {quantity === 0 ? (
                      isOrder ? (
                        <Button
                          className={` ${!isGrid ? 'rounded-full p-1 bg-amber-50' : 'bg-amber-600'}`}
                          size={isGrid ? "sm" : "icon"}
                          onClick={() =>
                            addToCart({
                              id: item.id,
                              name: item.name,
                              price: item.price,
                            })
                          }
                        >
                          {isGrid ? "Add to Cart" : <Plus className="h-3 w-3 text-amber-600" />}
                        </Button>
                      ) : null
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, quantity - 1)}
                        >
                          −
                        </Button>
                        <span className="text-sm font-medium">{quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    )}
                  </CardFooter>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}