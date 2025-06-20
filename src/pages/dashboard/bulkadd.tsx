import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AppContext } from "@/context/AppContext";
import { config } from "@/lib/config";

export default function BulkPasteForm() {
  const context = useContext(AppContext);
  const { token } = context || {};
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const categoriesData = inputText
        .split(";")
        .map(block => block.trim())
        .filter(Boolean)
        .map(block => {
          const [categoryLine, ...itemLines] = block.split("\n").map(l => l.trim());
          const categoryName = categoryLine.replace(":", "").trim();

          const items = itemLines
            .map(line => {
              const [name, priceStr] = line.split(",");
              if (!name || !priceStr) return null;
              return {
                name: name.trim(),
                price: parseFloat(priceStr.trim()),
              };
            })
            .filter(Boolean);

          return { categoryName, items };
        });

      for (const cat of categoriesData) {
        // 1. Create category
        const categoryRes = await fetch(`${config.backend_url}/api/menu/categories`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: cat.categoryName }),
        });

        if (!categoryRes.ok) {
          toast.error(`Failed to create category: ${cat.categoryName}`);
          continue;
        }

        const category = await categoryRes.json();

        // 2. Create all items under this category
        for (const item of cat.items) {
          await fetch(`${config.backend_url}/api/menu/items`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...item,
              description: "",
              image: "",
              isAvailable: true,
              categoryId: category.id,
            }),
          });
        }
      }

      toast.success("All categories and items added!");
      setInputText("");
    } catch (err) {
      console.error(err);
      toast.error("Bulk add failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold">Bulk Add via Paste</h2>
      <Textarea
        rows={12}
        value={inputText}
        onChange={e => setInputText(e.target.value)}
        placeholder={`Example:\nStarters:\nSoup,100\nSalad,120;\n\nMain Course:\nPaneer Butter Masala,250\nButter Naan,30;`}
      />
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </div>
  );
}
