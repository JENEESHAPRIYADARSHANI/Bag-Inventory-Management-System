import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  PlusCircle,
  Image as ImageIcon,
} from "lucide-react";

interface ProductVariant {
  color: string;
  frontView: File | string | null;
  backView: File | string | null;
  insideView: File | string | null;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  material: string;
  dimensions: string;
  capacity: string;
  variants: ProductVariant[];
}

const CATEGORIES = ["Laptop Bags", "School Bags", "Messenger Bags"];

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // CRUD State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Product>({
    id: "",
    name: "",
    category: "",
    price: "",
    material: "",
    dimensions: "",
    capacity: "",
    variants: [
      { color: "", frontView: null, backView: null, insideView: null },
    ],
  });

  // Fetch products from database when page loads
  useEffect(() => {
    fetch("http://localhost:8082/api/v1/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVariantTextChange = (
    index: number,
    field: keyof ProductVariant,
    value: string,
  ) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  const handleVariantFileChange = (
    index: number,
    field: keyof ProductVariant,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0] || null;
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: file };
    setFormData({ ...formData, variants: newVariants });
  };

  const handleAddVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        { color: "", frontView: null, backView: null, insideView: null },
      ],
    });
  };

  const handleRemoveVariant = (index: number) => {
    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: newVariants });
  };

  const handleOpenForm = (product?: Product) => {
    if (product) {
      setFormData(product);
      setEditingId(product.id);
    } else {
      setFormData({
        id: `PRD-00${products.length + 1}`,
        name: "",
        category: "",
        price: "",
        material: "",
        dimensions: "",
        capacity: "",
        variants: [
          { color: "", frontView: null, backView: null, insideView: null },
        ],
      });
      setEditingId(null);
    }
    setIsFormOpen(true);
  };

  // Helper to upload single image to Spring Boot
  const uploadImageToServer = async (file: File): Promise<string | null> => {
    const imgData = new FormData();
    imgData.append("file", file);
    try {
      const response = await fetch(
        "http://localhost:8082/api/v1/upload/image",
        {
          method: "POST",
          body: imgData,
        },
      );
      if (response.ok) return await response.text();
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    return null;
  };

  // NEW: Saves to Database
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Copy data so we don't mess up the screen while uploading
    const payload = {
      ...formData,
      variants: formData.variants.map((v) => ({
        color: v.color,
        frontView: typeof v.frontView === "string" ? v.frontView : null,
        backView: typeof v.backView === "string" ? v.backView : null,
        insideView: typeof v.insideView === "string" ? v.insideView : null,
      })),
    };
    // 2. Upload any new images first
    for (let i = 0; i < formData.variants.length; i++) {
      const variant = formData.variants[i];
      if (variant.frontView instanceof File) {
        payload.variants[i].frontView = await uploadImageToServer(
          variant.frontView,
        );
      }
      if (variant.backView instanceof File) {
        payload.variants[i].backView = await uploadImageToServer(
          variant.backView,
        );
      }
      if (variant.insideView instanceof File) {
        payload.variants[i].insideView = await uploadImageToServer(
          variant.insideView,
        );
      }
    }

    // 3. Send final JSON to the database
    try {
      const url = editingId
        ? `http://localhost:8082/api/v1/products/${editingId}`
        : "http://localhost:8082/api/v1/products";

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const savedProduct = await response.json();
        if (editingId) {
          setProducts(
            products.map((p) => (p.id === editingId ? savedProduct : p)),
          );
        } else {
          setProducts([...products, savedProduct]);
        }
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error("Error saving product to database:", error);
    }
  };

  // NEW: Deletes from Database
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(
          `http://localhost:8082/api/v1/products/${id}`,
          {
            method: "DELETE",
          },
        );
        if (response.ok) {
          setProducts(products.filter((p) => p.id !== id));
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getFileDisplay = (fileOrString: File | string | null) => {
    if (!fileOrString) return "No file selected";
    if (fileOrString instanceof File) return fileOrString.name;
    return fileOrString;
  };

  return (
    <DashboardLayout
      title="Products"
      subtitle="Manage your bag products and catalog"
    >
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10 bg-muted/50 border-transparent focus:border-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => handleOpenForm()} className="btn-gradient gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground bg-muted/50 uppercase border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">ID / Name</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Specs (Dim/Cap)</th>
              <th className="px-6 py-4 font-medium">Available Colors</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className="border-b border-border hover:bg-muted/20 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-semibold text-foreground">
                    {product.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {product.id}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="secondary" className="font-normal">
                    {product.category}
                  </Badge>
                </td>
                <td className="px-6 py-4 font-medium text-primary">
                  ${product.price}
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs text-muted-foreground">
                    {product.dimensions}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {product.capacity}
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-muted-foreground">
                  {product.variants
                    .map((v) => v.color)
                    .filter(Boolean)
                    .join(", ") || "No colors added"}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenForm(product)}
                    >
                      <Edit className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-card z-10 flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-lg font-semibold">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFormOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSave} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Price ($)</label>
                  <Input
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Material</label>
                  <Input
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Dimensions</label>
                  <Input
                    name="dimensions"
                    placeholder="e.g. 15 x 10 x 5 in"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Capacity</label>
                  <Input
                    name="capacity"
                    placeholder="e.g. 20L"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="md:col-span-2 pt-4 border-t border-border space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-semibold">
                        Color Variants & Media
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Upload specific images for each color variation.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddVariant}
                      className="gap-2"
                    >
                      <PlusCircle className="h-4 w-4" /> Add Color
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {formData.variants.map((variant, index) => (
                      <div
                        key={index}
                        className="p-4 bg-muted/30 border border-border rounded-lg relative grid grid-cols-1 md:grid-cols-3 gap-4"
                      >
                        {formData.variants.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveVariant(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}

                        <div className="space-y-2 md:col-span-3 pr-10">
                          <label className="text-xs font-medium">
                            Color Name
                          </label>
                          <Input
                            placeholder="e.g. Midnight Black"
                            value={variant.color}
                            onChange={(e) =>
                              handleVariantTextChange(
                                index,
                                "color",
                                e.target.value,
                              )
                            }
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-medium flex items-center gap-1">
                            <ImageIcon className="h-3 w-3" /> Front View
                          </label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleVariantFileChange(index, "frontView", e)
                            }
                            className="cursor-pointer file:text-primary file:bg-primary/10 file:border-0 file:rounded-md file:mr-2 file:px-2 file:py-1 file:text-xs"
                          />
                          <p
                            className="text-[10px] text-muted-foreground truncate"
                            title={getFileDisplay(variant.frontView)}
                          >
                            {getFileDisplay(variant.frontView)}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-medium flex items-center gap-1">
                            <ImageIcon className="h-3 w-3" /> Back View
                          </label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleVariantFileChange(index, "backView", e)
                            }
                            className="cursor-pointer file:text-primary file:bg-primary/10 file:border-0 file:rounded-md file:mr-2 file:px-2 file:py-1 file:text-xs"
                          />
                          <p
                            className="text-[10px] text-muted-foreground truncate"
                            title={getFileDisplay(variant.backView)}
                          >
                            {getFileDisplay(variant.backView)}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-medium flex items-center gap-1">
                            <ImageIcon className="h-3 w-3" /> Inside View
                          </label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleVariantFileChange(index, "insideView", e)
                            }
                            className="cursor-pointer file:text-primary file:bg-primary/10 file:border-0 file:rounded-md file:mr-2 file:px-2 file:py-1 file:text-xs"
                          />
                          <p
                            className="text-[10px] text-muted-foreground truncate"
                            title={getFileDisplay(variant.insideView)}
                          >
                            {getFileDisplay(variant.insideView)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground"
                >
                  Save Product
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Products;
