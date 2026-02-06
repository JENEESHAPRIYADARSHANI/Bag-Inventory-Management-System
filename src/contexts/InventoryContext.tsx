import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { InventoryItem } from "@/types/inventory";

interface InventoryContextType {
  items: InventoryItem[];
  addItem: (data: Omit<InventoryItem, "id" | "lastUpdated" | "createdAt">) => InventoryItem;
  updateItem: (id: string, updates: Partial<Pick<InventoryItem, "quantityInStock" | "reorderLevel">>) => void;
  deleteItem: (id: string) => void;
  increaseStock: (id: string, amount: number) => void;
  reduceStock: (id: string, amount: number) => void;
  getItem: (id: string) => InventoryItem | undefined;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: "INV-001",
    productId: "1",
    productName: "Executive Leather Briefcase",
    category: "Briefcases",
    quantityInStock: 120,
    reorderLevel: 30,
    lastUpdated: "2026-02-05T10:00:00Z",
    createdAt: "2025-06-01T08:00:00Z",
  },
  {
    id: "INV-002",
    productId: "2",
    productName: "Urban Travel Backpack",
    category: "Backpacks",
    quantityInStock: 18,
    reorderLevel: 25,
    lastUpdated: "2026-02-04T14:30:00Z",
    createdAt: "2025-07-15T09:00:00Z",
  },
  {
    id: "INV-003",
    productId: "3",
    productName: "Classic Tote Bag",
    category: "Totes",
    quantityInStock: 200,
    reorderLevel: 50,
    lastUpdated: "2026-02-03T11:15:00Z",
    createdAt: "2025-05-20T07:30:00Z",
  },
  {
    id: "INV-004",
    productId: "4",
    productName: "Vintage Messenger Bag",
    category: "Messenger",
    quantityInStock: 0,
    reorderLevel: 20,
    lastUpdated: "2026-02-01T16:45:00Z",
    createdAt: "2025-08-10T10:00:00Z",
  },
  {
    id: "INV-005",
    productId: "5",
    productName: "Weekend Duffle Bag",
    category: "Duffle",
    quantityInStock: 45,
    reorderLevel: 15,
    lastUpdated: "2026-02-02T09:20:00Z",
    createdAt: "2025-09-01T08:00:00Z",
  },
  {
    id: "INV-006",
    productId: "6",
    productName: "Minimalist Laptop Sleeve",
    category: "Accessories",
    quantityInStock: 8,
    reorderLevel: 20,
    lastUpdated: "2026-02-05T08:00:00Z",
    createdAt: "2025-10-12T11:00:00Z",
  },
];

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("starbags_inventory");
    if (stored) {
      setItems(JSON.parse(stored));
    } else {
      setItems(INITIAL_INVENTORY);
    }
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("starbags_inventory", JSON.stringify(items));
    }
  }, [items]);

  const addItem = (data: Omit<InventoryItem, "id" | "lastUpdated" | "createdAt">) => {
    const now = new Date().toISOString();
    const newItem: InventoryItem = {
      ...data,
      id: `INV-${String(Date.now()).slice(-6)}`,
      lastUpdated: now,
      createdAt: now,
    };
    setItems((prev) => [...prev, newItem]);
    return newItem;
  };

  const updateItem = (id: string, updates: Partial<Pick<InventoryItem, "quantityInStock" | "reorderLevel">>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...updates, lastUpdated: new Date().toISOString() }
          : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const increaseStock = (id: string, amount: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantityInStock: item.quantityInStock + amount, lastUpdated: new Date().toISOString() }
          : item
      )
    );
  };

  const reduceStock = (id: string, amount: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantityInStock: Math.max(0, item.quantityInStock - amount), lastUpdated: new Date().toISOString() }
          : item
      )
    );
  };

  const getItem = (id: string) => items.find((item) => item.id === id);

  return (
    <InventoryContext.Provider
      value={{ items, addItem, updateItem, deleteItem, increaseStock, reduceStock, getItem }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
