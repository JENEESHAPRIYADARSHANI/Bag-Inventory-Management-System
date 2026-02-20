export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  category: string;
  quantityInStock: number;
  reorderLevel: number;
  lastUpdated: string;
  createdAt: string;
}

export function getStockStatus(item: InventoryItem): StockStatus {
  if (item.quantityInStock <= 0) return "out_of_stock";
  if (item.quantityInStock <= item.reorderLevel) return "low_stock";
  return "in_stock";
}
