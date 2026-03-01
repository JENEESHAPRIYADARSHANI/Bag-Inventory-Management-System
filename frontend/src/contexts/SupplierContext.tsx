import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import {
  fetchSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "@/services/supplierApi";

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: "active" | "inactive";
}

interface SupplierContextType {
  suppliers: Supplier[];
  addSupplier: (data: Omit<Supplier, "id">) => Promise<void>;
  editSupplier: (id: string, data: Partial<Supplier>) => Promise<void>;
  removeSupplier: (id: string) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
}

const SupplierContext = createContext<SupplierContextType | undefined>(
  undefined
);

export function SupplierProvider({ children }: { children: ReactNode }) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // FETCH
  useEffect(() => {
    fetchSuppliers()
      .then((data) => {
        const mapped = data.map((s: any) => ({
          id: String(s.id),
          name: s.name,
          email: s.email,
          phone: s.phone,
          address: s.address,
          status: s.status,
        }));

        setSuppliers(mapped);
      })
      .catch(console.error);
  }, []);

  // CREATE
  const addSupplier = async (data: Omit<Supplier, "id">) => {
    const created = await createSupplier(data);

    setSuppliers((prev) => [
      ...prev,
      {
        ...created,
        id: String(created.id),
      },
    ]);
  };

  // UPDATE
  const editSupplier = async (id: string, data: Partial<Supplier>) => {
    const updated = await updateSupplier(id, data);

    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, ...updated } : s
      )
    );
  };

  // DELETE
  const removeSupplier = async (id: string) => {
    await deleteSupplier(id);
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  };

  // TOGGLE STATUS
  const toggleStatus = async (id: string) => {
    const supplier = suppliers.find((s) => s.id === id);
    if (!supplier) return;

    const newStatus = supplier.status === "active" ? "inactive" : "active";
    await editSupplier(id, { status: newStatus });
  };

  return (
    <SupplierContext.Provider
      value={{
        suppliers,
        addSupplier,
        editSupplier,
        removeSupplier,
        toggleStatus,
      }}
    >
      {children}
    </SupplierContext.Provider>
  );
}

export function useSupplier() {
  const context = useContext(SupplierContext);
  if (!context) {
    throw new Error("useSupplier must be used inside SupplierProvider");
  }
  return context;
}