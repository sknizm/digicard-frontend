// src/pages/MenuListPage.tsx
import { useState, useEffect, useContext } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Loader2,
  Trash,
  Pencil,
  Plus,
  HelpCircle,
  MessageCircle,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { Category, LoadingState } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { ImagePreview } from "@/components/ui/image-preview";
import { config } from "@/lib/config";
import BouncingDotsLoader from "@/components/ui/bounce-loader";
import { AppContext } from "@/context/AppContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MenuListPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [actionLoading, setActionLoading] = useState<LoadingState>({
    deleteCategory: "",
    deleteMenuItem: "",
    toggleAvailability: ""
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState({
    category: false,
    menuItem: false
  });
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: 'category' | 'menuItem'} | null>(null);

  const context = useContext(AppContext);
  if (!context) throw new Error("AppContext must be used within an AppProvider");
  const { token } = context;

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!editMode && categories.length > 0 && !loading) {
      setExpandedCategories(categories.map(cat => cat.id));
    } else {
      setExpandedCategories([]);
    }
  }, [categories, loading, editMode]);

  function openWhatsappForHelp() {
    const phoneNumber = "8455838503";
    const message = encodeURIComponent("Hello, I need help to setup my Digital Menu");
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, "_blank");
  }

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${config.backend_url}/api/menu/allmenu`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch menu data");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      if(error)
      toast.error("Failed to load menu data");
    } finally {
      setLoading(false);
    }
  };

  const saveNewCategoryOrder = async (newOrder: Category[]) => {
    try {
      await fetch(`${config.backend_url}/api/menu/categories/reorder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ category_ids: newOrder.map(c => c.id) })
      });
    } catch (err) {
      if(err)
      toast.error("Failed to save order");
    }
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === categories.length - 1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newCategories = [...categories];
    const [movedCategory] = newCategories.splice(index, 1);
    newCategories.splice(newIndex, 0, movedCategory);
    
    setCategories(newCategories);
    saveNewCategoryOrder(newCategories);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      setActionLoading(prev => ({ ...prev, deleteCategory: categoryId }));
      const res = await fetch(`${config.backend_url}/api/menu/categories/${categoryId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      setCategories(categories.filter(cat => cat.id !== categoryId));
      toast.success("Category deleted successfully");
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setActionLoading(prev => ({ ...prev, deleteCategory: "" }));
      setDeleteDialogOpen({ ...deleteDialogOpen, category: false });
    }
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    try {
      setActionLoading(prev => ({ ...prev, deleteMenuItem: itemId }));
      const res = await fetch(`${config.backend_url}/api/menu/items/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      setCategories(categories.map(cat => ({
        ...cat,
        menu_items: cat.menu_items?.filter(item => item.id !== itemId)
      })));
      toast.success("Menu item deleted successfully");
    } catch {
      toast.error("Failed to delete menu item");
    } finally {
      setActionLoading(prev => ({ ...prev, deleteMenuItem: "" }));
      setDeleteDialogOpen({ ...deleteDialogOpen, menuItem: false });
    }
  };

  const handleEditItem = (itemId: string) => navigate(`/dashboard/menu/create/${itemId}`);
  const handleAddNewItem = () => navigate("/dashboard/menu/create");

  if (loading) return <div className="flex justify-center p-8"><BouncingDotsLoader /></div>;

  const TutorialCard = () => (
    <div className="space-y-4">
      <Card className="hover:shadow-lg bg-gradient-to-br from-white to-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" /> Get Help With Setup
          </CardTitle>
          <CardDescription>Need assistance adding your menu or completing setup?</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={openWhatsappForHelp} className="w-full bg-green-600 text-white hover:bg-green-700">
            Get Setup Help <MessageCircle className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Quick Tutorial</CardTitle>
          <p className="text-sm text-muted-foreground">Learn how to add your menu in 2 minutes</p>
        </CardHeader>
        <CardContent>
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/-yEhkpFC0j0"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Menu Items</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant={editMode ? "secondary" : "outline"} 
            onClick={() => setEditMode(!editMode)}
            className="flex-1 sm:flex-none"
          >
            {editMode ? "Done" : "Arrange Categories"}
          </Button>
          <Button onClick={handleAddNewItem} className="flex-1 sm:flex-none">
            <Plus className="mr-2 h-4 w-4" /> <span className="whitespace-nowrap">Add New Item</span>
          </Button>
        </div>
      </div>

      <AlertDialog 
        open={deleteDialogOpen.category || deleteDialogOpen.menuItem} 
        onOpenChange={(open) => {
          if (!open) {
            setDeleteDialogOpen({ category: false, menuItem: false });
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. {itemToDelete?.type === 'category' 
                ? 'All menu items in this category will also be deleted.' 
                : 'This will permanently delete this menu item.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (!itemToDelete) return;
                if (itemToDelete.type === 'category') {
                  handleDeleteCategory(itemToDelete.id);
                } else {
                  handleDeleteMenuItem(itemToDelete.id);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {actionLoading.deleteCategory === itemToDelete?.id || 
               actionLoading.deleteMenuItem === itemToDelete?.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {categories.length === 0 ? (
        <div className="flex justify-center pt-8">
          <TutorialCard />
        </div>
      ) : (
        <div className="space-y-4">
          <Accordion
            type="multiple"
            value={editMode ? [] : expandedCategories}
            onValueChange={editMode ? undefined : setExpandedCategories}
            className="space-y-4"
          >
            {categories.map((category, index) => (
              <AccordionItem key={category.id} value={category.id} className="border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-muted/50 border-b">
                  <div className="flex items-center gap-3 w-full">
                    {!editMode ? (
                      <AccordionTrigger className="flex-1 hover:no-underline [&[data-state=open]>svg:last-child]:rotate-180">
                        <div className="flex flex-col text-left">
                          <h3 className="font-medium">{category.name}</h3>
                          {category.description && (
                            <span className="text-sm text-muted-foreground hidden sm:inline">
                              {category.description}
                            </span>
                          )}
                        </div>
                      </AccordionTrigger>
                    ) : (
                      <div className="flex flex-col">
                        <h3 className="font-medium">{category.name}</h3>
                        {category.description && (
                          <span className="text-sm text-muted-foreground hidden sm:inline">
                            {category.description}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {editMode && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveCategory(index, 'up');
                          }}
                          disabled={index === 0}
                          className="h-8 w-8"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveCategory(index, 'down');
                          }}
                          disabled={index === categories.length - 1}
                          className="h-8 w-8"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {!editMode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setItemToDelete({ id: category.id, type: 'category' });
                          setDeleteDialogOpen({ ...deleteDialogOpen, category: true });
                        }}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <AccordionContent>
                  <div className="overflow-x-auto">
                    <Table className="min-w-full">
                      <TableHeader className="hidden sm:table-header-group">
                        <TableRow>
                          <TableHead className="w-[100px]">Image</TableHead>
                          <TableHead>Item Name</TableHead>
                          <TableHead className="hidden md:table-cell">Description</TableHead>
                          <TableHead>Price (₹)</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {category.menu_items?.map(item => (
                          <TableRow key={item.id} className="hover:bg-muted/50">
                            <TableCell>
                              <ImagePreview
                                imageUrl={item.image}
                                alt={item.name}
                                className="h-12 w-12 rounded-md object-cover"
                              />
                            </TableCell>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="hidden md:table-cell text-muted-foreground">
                              {item.description || "-"}
                            </TableCell>
                            <TableCell>₹{item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleEditItem(item.id)}
                                  className="h-8 w-8"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => {
                                    setItemToDelete({ id: item.id, type: 'menuItem' });
                                    setDeleteDialogOpen({ ...deleteDialogOpen, menuItem: true });
                                  }}
                                  className="h-8 w-8 text-destructive border-destructive/50 hover:border-destructive hover:text-destructive"
                                >
                                  <Trash className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {category.menu_items?.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              No items in this category
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="pt-4">
            <TutorialCard /></div>
        </div>
      )}
    </div>
  );
}