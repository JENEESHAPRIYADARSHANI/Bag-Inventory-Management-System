import { useState, useEffect } from "react";
import axios from "axios";
const API_BASE = "http://localhost:8081";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Pencil,
  Trash2,
  Truck,
  Package,
  Link2,
  ToggleLeft,
  ToggleRight,
  Users,
  Boxes,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
} from "lucide-react";
import { useSupplier } from "@/contexts/SupplierContext";

// Types
interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: "active" | "inactive";
}

interface Material {
  id: string;
  name: string;
  type: string;
  unit: string;
  unitPrice: number;
  reorderLevel: number;
  status: "active" | "disabled";
}

interface SupplierMaterialMapping {
  id: string;
  supplierId: string;
  materialId: string;
  supplyPrice: number;
  leadTimeDays: number;
}

export default function Suppliers() {
  const { suppliers, addSupplier, editSupplier, removeSupplier, toggleStatus } =
    useSupplier();

  // --- State ---
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [supplierForm, setSupplierForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "active" as "active" | "inactive",
  });
  const [supplierSearch, setSupplierSearch] = useState("");

  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [materialForm, setMaterialForm] = useState({
    name: "",
    type: "",
    unit: "",
    unitPrice: 0,
    reorderLevel: 0,
    status: "active" as "active" | "disabled",
  });
  const [materialSearch, setMaterialSearch] = useState("");

  const [mappings, setMappings] = useState<SupplierMaterialMapping[]>([]);
  const [mappingDialogOpen, setMappingDialogOpen] = useState(false);
  const [editingMapping, setEditingMapping] =
    useState<SupplierMaterialMapping | null>(null);
  const [mappingForm, setMappingForm] = useState({
    supplierId: "",
    materialId: "",
    supplyPrice: 0,
    leadTimeDays: 0,
  });

  // --- Stats ---
  const activeSuppliers = suppliers.filter((s) => s.status === "active").length;
  const activeMaterials = materials.filter((m) => m.status === "active").length;
  const totalMappings = mappings.length;
  const avgLeadTime = mappings.length
    ? Math.round(
        mappings.reduce((sum, m) => sum + m.leadTimeDays, 0) / mappings.length,
      )
    : 0;

  // --- Filtered Data ---
  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(supplierSearch.toLowerCase()),
  );

  const filteredMaterials = materials.filter(
    (m) =>
      m.name.toLowerCase().includes(materialSearch.toLowerCase()) ||
      m.type.toLowerCase().includes(materialSearch.toLowerCase()),
  );

  // --- Supplier Handlers ---
  const openSupplierDialog = (supplier?: Supplier) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setSupplierForm({ ...supplier });
    } else {
      setEditingSupplier(null);
      setSupplierForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        status: "active",
      });
    }
    setSupplierDialogOpen(true);
  };

  const handleSupplierSubmit = async () => {
    try {
      if (editingSupplier) {
        await editSupplier(editingSupplier.id, supplierForm);
      } else {
        await addSupplier(supplierForm);
      }
      setSupplierDialogOpen(false);
    } catch (error) {
      console.error("Error saving supplier:", error);
    }
  };

  const handleToggleSupplierStatus = async (id: string) => {
    try {
      await toggleStatus(id);
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      await removeSupplier(id);
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  // --- Material Handlers ---
  const openMaterialDialog = (material?: Material) => {
    if (material) {
      setEditingMaterial(material);
      setMaterialForm({ ...material });
    } else {
      setEditingMaterial(null);
      setMaterialForm({
        name: "",
        type: "",
        unit: "",
        unitPrice: 0,
        reorderLevel: 0,
        status: "active",
      });
    }
    setMaterialDialogOpen(true);
  };

  const handleMaterialSubmit = async () => {
    try {
      if (editingMaterial) {
        await axios.put(
          `${API_BASE}/api/materials/${editingMaterial.id}`,
          materialForm,
        );
      } else {
        await axios.post(`${API_BASE}/api/materials`, materialForm);
      }
      fetchMaterials();
      setMaterialDialogOpen(false);
    } catch (error) {
      console.error("Error saving material:", error);
    }
  };

  const toggleMaterialStatus = async (id: string) => {
    const material = materials.find((m) => m.id === id);
    if (!material) return;
    const updated = {
      ...material,
      status: material.status === "active" ? "disabled" : "active",
    };
    try {
      await axios.put(`${API_BASE}/api/materials/${id}`, updated);
      fetchMaterials();
    } catch (error) {
      console.error("Error toggling material status:", error);
    }
  };

  const deleteMaterial = async (id: string) => {
    try {
      await axios.delete(`${API_BASE}/api/materials/${id}`);
      fetchMaterials();
    } catch (error) {
      console.error("Error deleting material:", error);
    }
  };

  // --- Mapping Handlers ---
  const openMappingDialog = (mapping?: SupplierMaterialMapping) => {
    if (mapping) {
      setEditingMapping(mapping);
      setMappingForm({ ...mapping });
    } else {
      setEditingMapping(null);
      setMappingForm({
        supplierId: "",
        materialId: "",
        supplyPrice: 0,
        leadTimeDays: 0,
      });
    }
    setMappingDialogOpen(true);
  };

  const handleMappingSubmit = async () => {
    try {
      if (editingMapping) {
        await axios.put(
          `${API_BASE}/api/supplier-materials/${editingMapping.id}`,
          mappingForm,
        );
      } else {
        await axios.post(`${API_BASE}/api/supplier-materials`, mappingForm);
      }
      fetchMappings();
      setMappingDialogOpen(false);
    } catch (error) {
      console.error("Error saving mapping:", error);
    }
  };

  const deleteMapping = async (id: string) => {
    try {
      await axios.delete(`${API_BASE}/api/supplier-materials/${id}`);
      fetchMappings();
    } catch (error) {
      console.error("Error deleting mapping:", error);
    }
  };

  const getSupplierName = (id: string) =>
    suppliers.find((s) => s.id === id)?.name || "Unknown";
  const getMaterialName = (id: string) =>
    materials.find((m) => m.id === id)?.name || "Unknown";

  // --- Fetch Backend Data ---

  const fetchMaterials = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/materials`);
      setMaterials(res.data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const fetchMappings = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/supplier-materials`);
      setMappings(res.data);
    } catch (error) {
      console.error("Error fetching mappings:", error);
    }
  };

  useEffect(() => {
    fetchMaterials();
    fetchMappings();
  }, []);

  return (
    <DashboardLayout
      title="Suppliers and Materials"
      subtitle="Manage your supply chain, materials inventory, and vendor relationships"
    >
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Suppliers
                </p>
                <p className="text-3xl font-bold text-primary">
                  {activeSuppliers}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Materials
                </p>
                <p className="text-3xl font-bold text-accent">
                  {activeMaterials}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Mappings
                </p>
                <p className="text-3xl font-bold text-success">
                  {totalMappings}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <Link2 className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg Lead Time
                </p>
                <p className="text-3xl font-bold text-warning">
                  {avgLeadTime} days
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="suppliers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[600px] h-12 p-1 bg-muted/50">
          <TabsTrigger
            value="suppliers"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            <Truck className="h-4 w-4" />
            <span className="hidden sm:inline">Suppliers</span>
          </TabsTrigger>
          <TabsTrigger
            value="materials"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Materials</span>
          </TabsTrigger>
          <TabsTrigger
            value="mapping"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            <Link2 className="h-4 w-4" />
            <span className="hidden sm:inline">Supplier–Material</span>
          </TabsTrigger>
        </TabsList>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers" className="space-y-4">
          <Card className="shadow-lg border-border/50">
            <CardHeader className="bg-muted/30 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Supplier Management
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Add and manage your supplier network
                  </CardDescription>
                </div>
                <Button
                  onClick={() => openSupplierDialog()}
                  className="btn-gradient"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supplier
                </Button>
              </div>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search suppliers by name or email..."
                  value={supplierSearch}
                  onChange={(e) => setSupplierSearch(e.target.value)}
                  className="pl-10 max-w-md"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/20 hover:bg-muted/20">
                      <TableHead className="font-semibold">ID</TableHead>
                      <TableHead className="font-semibold">
                        Supplier Name
                      </TableHead>
                      <TableHead className="font-semibold">Contact</TableHead>
                      <TableHead className="font-semibold">Address</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSuppliers.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-12 text-muted-foreground"
                        >
                          <Truck className="h-12 w-12 mx-auto mb-4 opacity-20" />
                          <p>No suppliers found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSuppliers.map((supplier) => (
                        <TableRow
                          key={supplier.id}
                          className="group hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="font-mono text-sm text-muted-foreground">
                            {supplier.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-semibold text-primary">
                                  {supplier.name.charAt(0)}
                                </span>
                              </div>
                              <span className="font-medium">
                                {supplier.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-sm">{supplier.email}</p>
                              <p className="text-xs text-muted-foreground">
                                {supplier.phone}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px]">
                            <p className="truncate text-sm text-muted-foreground">
                              {supplier.address}
                            </p>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                supplier.status === "active"
                                  ? "bg-success/10 text-success border-success/20 hover:bg-success/20"
                                  : "bg-muted text-muted-foreground border-border hover:bg-muted"
                              }
                            >
                              {supplier.status === "active" ? (
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              {supplier.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleToggleSupplierStatus(supplier.id)
                                }
                                className="h-8 w-8 p-0"
                              >
                                {supplier.status === "active" ? (
                                  <ToggleRight className="h-4 w-4 text-success" />
                                ) : (
                                  <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openSupplierDialog(supplier)}
                                className="h-8 w-8 p-0"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => deleteSupplier(supplier.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials" className="space-y-4">
          <Card className="shadow-lg border-border/50">
            <CardHeader className="bg-muted/30 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-accent" />
                    Material Inventory
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Track and manage raw materials and components
                  </CardDescription>
                </div>
                <Button
                  onClick={() => openMaterialDialog()}
                  className="btn-gradient"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Material
                </Button>
              </div>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search materials by name or type..."
                  value={materialSearch}
                  onChange={(e) => setMaterialSearch(e.target.value)}
                  className="pl-10 max-w-md"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/20 hover:bg-muted/20">
                      <TableHead className="font-semibold">ID</TableHead>
                      <TableHead className="font-semibold">Material</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold">Unit</TableHead>
                      <TableHead className="font-semibold">
                        Unit Price
                      </TableHead>
                      <TableHead className="font-semibold">
                        Reorder Level
                      </TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMaterials.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-12 text-muted-foreground"
                        >
                          <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
                          <p>No materials found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMaterials.map((material) => (
                        <TableRow
                          key={material.id}
                          className="group hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="font-mono text-sm text-muted-foreground">
                            {material.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                                <Boxes className="h-5 w-5 text-accent" />
                              </div>
                              <span className="font-medium">
                                {material.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-normal">
                              {material.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {material.unit}
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-success">
                              ${material.unitPrice.toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-warning font-medium">
                              {material.reorderLevel}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                material.status === "active"
                                  ? "bg-success/10 text-success border-success/20 hover:bg-success/20"
                                  : "bg-muted text-muted-foreground border-border hover:bg-muted"
                              }
                            >
                              {material.status === "active" ? (
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              {material.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  toggleMaterialStatus(material.id)
                                }
                                className="h-8 w-8 p-0"
                              >
                                {material.status === "active" ? (
                                  <ToggleRight className="h-4 w-4 text-success" />
                                ) : (
                                  <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openMaterialDialog(material)}
                                className="h-8 w-8 p-0"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => deleteMaterial(material.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mapping Tab */}
        <TabsContent value="mapping" className="space-y-4">
          <Card className="shadow-lg border-border/50">
            <CardHeader className="bg-muted/30 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Link2 className="h-5 w-5 text-success" />
                    Supplier–Material Relationships
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Define which suppliers provide which materials with pricing
                    and lead times
                  </CardDescription>
                </div>
                <Button
                  onClick={() => openMappingDialog()}
                  className="btn-gradient"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Mapping
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/20 hover:bg-muted/20">
                      <TableHead className="font-semibold">ID</TableHead>
                      <TableHead className="font-semibold">Supplier</TableHead>
                      <TableHead className="font-semibold">Material</TableHead>
                      <TableHead className="font-semibold">
                        Supply Price
                      </TableHead>
                      <TableHead className="font-semibold">Lead Time</TableHead>
                      <TableHead className="font-semibold text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mappings.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-12 text-muted-foreground"
                        >
                          <Link2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                          <p>No mappings found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      mappings.map((mapping) => (
                        <TableRow
                          key={mapping.id}
                          className="group hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="font-mono text-sm text-muted-foreground">
                            {mapping.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Truck className="h-4 w-4 text-primary" />
                              </div>
                              <span className="font-medium">
                                {getSupplierName(mapping.supplierId)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                                <Package className="h-4 w-4 text-accent" />
                              </div>
                              <span>{getMaterialName(mapping.materialId)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-success" />
                              <span className="font-semibold text-success">
                                {mapping.supplyPrice.toFixed(2)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-warning" />
                              <span className="font-medium text-warning">
                                {mapping.leadTimeDays} days
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openMappingDialog(mapping)}
                                className="h-8 w-8 p-0"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => deleteMapping(mapping.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Supplier Dialog */}
      <Dialog open={supplierDialogOpen} onOpenChange={setSupplierDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
            </DialogTitle>
            <DialogDescription>
              {editingSupplier
                ? "Update supplier information"
                : "Fill in the details to add a new supplier"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="supplier-name">Supplier Name</Label>
              <Input
                id="supplier-name"
                value={supplierForm.name}
                onChange={(e) =>
                  setSupplierForm({ ...supplierForm, name: e.target.value })
                }
                placeholder="Enter supplier name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier-email">Email</Label>
                <Input
                  id="supplier-email"
                  type="email"
                  value={supplierForm.email}
                  onChange={(e) =>
                    setSupplierForm({ ...supplierForm, email: e.target.value })
                  }
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier-phone">Phone</Label>
                <Input
                  id="supplier-phone"
                  value={supplierForm.phone}
                  onChange={(e) =>
                    setSupplierForm({ ...supplierForm, phone: e.target.value })
                  }
                  placeholder="+1 555-0100"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier-address">Address</Label>
              <Input
                id="supplier-address"
                value={supplierForm.address}
                onChange={(e) =>
                  setSupplierForm({ ...supplierForm, address: e.target.value })
                }
                placeholder="123 Main St, City, State"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier-status">Status</Label>
              <Select
                value={supplierForm.status}
                onValueChange={(value: "active" | "inactive") =>
                  setSupplierForm({ ...supplierForm, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      Active
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                      Inactive
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSupplierDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSupplierSubmit} className="btn-gradient">
              {editingSupplier ? "Update" : "Add"} Supplier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Material Dialog */}
      <Dialog open={materialDialogOpen} onOpenChange={setMaterialDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-accent" />
              {editingMaterial ? "Edit Material" : "Add New Material"}
            </DialogTitle>
            <DialogDescription>
              {editingMaterial
                ? "Update material information"
                : "Fill in the details to add a new material"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="material-name">Material Name</Label>
              <Input
                id="material-name"
                value={materialForm.name}
                onChange={(e) =>
                  setMaterialForm({ ...materialForm, name: e.target.value })
                }
                placeholder="Enter material name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="material-type">Type</Label>
                <Input
                  id="material-type"
                  value={materialForm.type}
                  onChange={(e) =>
                    setMaterialForm({ ...materialForm, type: e.target.value })
                  }
                  placeholder="e.g., Leather, Fabric"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="material-unit">Unit</Label>
                <Input
                  id="material-unit"
                  value={materialForm.unit}
                  onChange={(e) =>
                    setMaterialForm({ ...materialForm, unit: e.target.value })
                  }
                  placeholder="e.g., sq ft, meter"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="material-price">Unit Price ($)</Label>
                <Input
                  id="material-price"
                  type="number"
                  step="0.01"
                  value={materialForm.unitPrice}
                  onChange={(e) =>
                    setMaterialForm({
                      ...materialForm,
                      unitPrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="material-reorder">Reorder Level</Label>
                <Input
                  id="material-reorder"
                  type="number"
                  value={materialForm.reorderLevel}
                  onChange={(e) =>
                    setMaterialForm({
                      ...materialForm,
                      reorderLevel: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="material-status">Status</Label>
              <Select
                value={materialForm.status}
                onValueChange={(value: "active" | "disabled") =>
                  setMaterialForm({ ...materialForm, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      Active
                    </div>
                  </SelectItem>
                  <SelectItem value="disabled">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                      Disabled
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMaterialDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleMaterialSubmit} className="btn-gradient">
              {editingMaterial ? "Update" : "Add"} Material
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mapping Dialog */}
      <Dialog open={mappingDialogOpen} onOpenChange={setMappingDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-success" />
              {editingMapping
                ? "Edit Mapping"
                : "Add Supplier-Material Mapping"}
            </DialogTitle>
            <DialogDescription>
              {editingMapping
                ? "Update the supplier-material relationship"
                : "Link a supplier to a material with pricing"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="mapping-supplier">Supplier</Label>
              <Select
                value={mappingForm.supplierId}
                onValueChange={(value) =>
                  setMappingForm({ ...mappingForm, supplierId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers
                    .filter((s) => s.status === "active")
                    .map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-primary" />
                          {supplier.name}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mapping-material">Material</Label>
              <Select
                value={mappingForm.materialId}
                onValueChange={(value) =>
                  setMappingForm({ ...mappingForm, materialId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {materials
                    .filter((m) => m.status === "active")
                    .map((material) => (
                      <SelectItem key={material.id} value={material.id}>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-accent" />
                          {material.name}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mapping-price">Supply Price ($)</Label>
                <Input
                  id="mapping-price"
                  type="number"
                  step="0.01"
                  value={mappingForm.supplyPrice}
                  onChange={(e) =>
                    setMappingForm({
                      ...mappingForm,
                      supplyPrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mapping-leadtime">Lead Time (Days)</Label>
                <Input
                  id="mapping-leadtime"
                  type="number"
                  value={mappingForm.leadTimeDays}
                  onChange={(e) =>
                    setMappingForm({
                      ...mappingForm,
                      leadTimeDays: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMappingDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleMappingSubmit} className="btn-gradient">
              {editingMapping ? "Update" : "Add"} Mapping
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
