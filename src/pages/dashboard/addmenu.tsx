import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, X } from "lucide-react";
import { ImageUploader } from "@/components/ui/image-uploader";
import {config} from "@/lib/config";
import BouncingDotsLoader from "@/components/ui/bounce-loader";
import { AppContext } from "@/context/AppContext";

export default function MenuItemForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false); // New state for category loading
  
       const context = useContext(AppContext);
        
          if (!context) {
            throw new Error("AppContext must be used within an AppProvider");
          }
        
          const { token } = context;
  

  const [formData, setFormData] = useState<Omit<MenuItem, 'id'>>({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    image: "",
    isAvailable:true
  });

  useEffect(() => {
    const loadData = async () => {
  try {
    setLoading(true);
    setButtonLoading(true);

    // Fetch categories
    const categoriesRes = await fetch(`${config.backend_url}/api/menu/categories`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!categoriesRes.ok) throw new Error("Failed to fetch categories");

    const categoriesData = await categoriesRes.json();
    setCategories(categoriesData);

    let existingItem = null;

    // Fetch existing item if in edit mode
    if (isEditMode && id) {
      const itemRes = await fetch(`${config.backend_url}/api/menu/items/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!itemRes.ok) throw new Error("Failed to fetch menu item");

      existingItem = await itemRes.json();
    }

    // Set form data
    if (existingItem) {
      setFormData({
        name: existingItem.name,
        description: existingItem.description || "",
        price: existingItem.price,
        categoryId: existingItem.category_id,
        image: existingItem.image,
        isAvailable: true,
      });
    } else if (categoriesData.length > 0) {
      setFormData(prev => ({
        ...prev,
        categoryId: categoriesData[0].id,
      }));
    }

  } catch (error) {
    toast.error("Failed to load data");
    console.error(error);
  } finally {
    setLoading(false);
    setButtonLoading(false);
  }
};
    loadData();
  }, [id, isEditMode, token]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      setAddingCategory(true); // Set loading state
      const res = await fetch(`${config.backend_url}/api/menu/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategoryName })
      });
      
      if (!res.ok) throw new Error("Failed to add category");
      const newCategory = await res.json();
      
      setCategories([...categories, newCategory]);
      setFormData(prev => ({ ...prev, categoryId: newCategory.id }));
      setNewCategoryName("");
      setShowAddCategory(false);
      toast.success("Category added successfully");
    } catch (error) {
      toast.error("Failed to add category");
      console.error(error);
    } finally {
      setAddingCategory(false); // Reset loading state
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setFormLoading(true);
      
      if (isEditMode && id) {
        const res = await fetch(`${config.backend_url}/api/menu/items/${id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData
          }),
        });
        if (!res.ok) throw new Error("Failed to update menu item");
        toast.success("Menu item updated successfully");
      } else {
        const res = await fetch(`${config.backend_url}/api/menu/items`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...formData
          }),
        });
        if (!res.ok) throw new Error("Failed to create menu item");
        toast.success("Menu item created successfully");
      }
      
      navigate("/dashboard/menu");
    } catch (error) {
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} menu item`);
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;

    setButtonLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch(`${config.backend_url}/api/upload`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error("Failed to upload image");
      const data = await res.json();
      console.log("IMAGE URL", data.url)
      setFormData(prev => ({ ...prev, image: data.url }));
      toast.success("Image Uploaded Successfully")
    setButtonLoading(false);
    } catch (error) {
      toast.error("Failed to upload image");
      
    setButtonLoading(false);
      console.error(error);
    }
  };

 const handleImageDelete = async () => {
  if (!formData.image) return;

  try {
    const res = await fetch(`${config.backend_url}/api/delete-image`, {
      method: 'DELETE',
      credentials: 'include', // Optional: include this if using cookies
      headers: {
        'Content-Type': 'application/json', // ✅ Required for JSON
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url: formData.image }),
    });


    if (!res.ok) throw new Error("Failed to delete image");

    setFormData(prev => ({ ...prev, image: "" }));
    toast.success("Image deleted successfully");
  } catch (error) {
    toast.error("Failed to delete image");
    console.error(error);
  }
};

  if (loading) {
    return <BouncingDotsLoader/>
  }

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {isEditMode ? "Edit Menu Item" : "Add New Menu Item"}
        </h2>
        <Button variant="ghost" onClick={() => navigate("/dashboard/menu")}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label>Item Image (Optional)</Label>
          <ImageUploader
            imageUrl={formData.image}
            onUpload={handleImageUpload}
            onDelete={handleImageDelete}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Item Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price (₹) *</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <div className="flex gap-2">
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddCategory(true)}
                disabled={showAddCategory}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {showAddCategory && (
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="New category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  autoFocus
                />
                <Button
                  type="button"
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim() || addingCategory}
                >
                  {addingCategory ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Add"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddCategory(false);
                    setNewCategoryName("");
                  }}
                  disabled={addingCategory}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={formLoading || buttonLoading}>
            {formLoading || buttonLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />:<></>}
            {isEditMode ? "Update Item" : "Create Item"}
          </Button>
        </div>
      </form>
    </div>
  );
}