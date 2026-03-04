const BASE_URL = "http://localhost:8081/api/suppliers";

// ---------------- SUPPLIERS ----------------

export async function fetchSuppliers() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch suppliers");
  return res.json();
}

export async function createSupplier(data: any) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create supplier");
  return res.json();
}
export async function updateSupplier(id: string, data: any) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    // <- removed extra '/suppliers'
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update supplier");
  return res.json();
}

export async function deleteSupplier(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    // <- removed extra '/suppliers'
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete supplier");
}
