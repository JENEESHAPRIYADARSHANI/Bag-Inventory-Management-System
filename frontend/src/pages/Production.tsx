import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Factory,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
  ChevronDown,
  Pencil,
  Trash2,
} from "lucide-react";


interface ProductionBatch {
  id: string;
  product: string;
  quantity: number;
  startDate: string;
  endDate: string;
  status: "planned" | "in_progress" | "completed";
}


const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return (
          <Badge className="bg-success/20 text-success border-success/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
      );

    case "in_progress":
      return (
          <Badge className="bg-info/20 text-info border-info/30">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
      );

    case "planned":
      return (
          <Badge className="bg-warning/20 text-warning border-warning/30">
            <AlertCircle className="h-3 w-3 mr-1" />
            Planned
          </Badge>
      );

    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const Production = () => {
  const [batches, setBatches] = useState<ProductionBatch[]>([]); // Initialize with empty array

// FETCH DATA ON LOAD
  useEffect(() => {
    fetchBatches();
  }, []);



  const fetchBatches = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/production");
      if (response.ok) {
        const data = await response.json();
        setBatches(data);
      }

    } catch (error) {
      console.error("Failed to fetch batches:", error);
    }

  };
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<ProductionBatch | null>(null);
  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    startDate: "",
    endDate: "",
    status: "planned" as "planned" | "in_progress" | "completed",
  });



  const totalBatches = batches.length;
  const completedBatches = batches.filter((b) => b.status === "completed").length;
  const inProgressBatches = batches.filter((b) => b.status === "in_progress").length;
  const plannedBatches = batches.filter((b) => b.status === "planned").length;

  const resetForm = () => {
    setFormData({
      product: "",
      quantity: "",
      startDate: "",
      endDate: "",
      status: "planned",
    });

    setEditingBatch(null);
  };



  const handleOpenDialog = (batch?: ProductionBatch) => {
    if (batch) {
      setEditingBatch(batch);
      setFormData({
        product: batch.product,
        quantity: batch.quantity.toString(),
        startDate: batch.startDate,
        endDate: batch.endDate,
        status: batch.status,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };



  const handleSubmit = async () => {
    if (!formData.product || !formData.quantity || !formData.startDate || !formData.endDate) {
      return;
    }

    const batchData = {
      product: formData.product,
      quantity: parseInt(formData.quantity),
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
    };

    try {
      if (editingBatch) {
// Update existing
        const response = await fetch(`http://localhost:8081/api/production/${editingBatch.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(batchData),
        });
        if (response.ok) fetchBatches(); // Refresh list
      } else {
// Create new
        const response = await fetch('http://localhost:8081/api/production', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(batchData),
        });
        if (response.ok) fetchBatches(); // Refresh list
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Error saving batch:", error);
    }
  };


  const handleUpdateStatus = (batchId: string, newStatus: "planned" | "in_progress" | "completed") => {
    setBatches((prev) =>
        prev.map((batch) =>
            batch.id === batchId ? { ...batch, status: newStatus } : batch
        )
    );
  };



  const handleDelete = async (batchId: string) => {
    try {
      await fetch(`http://localhost:8081/api/production/${batchId}`, {
        method: 'DELETE',
      });

      setBatches((prev) => prev.filter((batch) => batch.id !== batchId));
    } catch (error) {
      console.error("Error deleting batch:", error);
    }
  };

  return (
      <DashboardLayout
          title="Production"
          subtitle="Manage production batches and track manufacturing progress"
      >
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Batches</p>
                  <p className="text-3xl font-bold text-foreground">{totalBatches}</p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Factory className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>



          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Planned</p>
                  <p className="text-3xl font-bold text-foreground">{plannedBatches}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                  <AlertCircle className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>



          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-3xl font-bold text-foreground">{inProgressBatches}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info/10">
                  <Clock className="h-6 w-6 text-info" />
                </div>
              </div>

            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold text-foreground">{completedBatches}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Production Batches Table */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg font-semibold">
              Production Batches

            </CardTitle>
            <Button className="btn-gradient" onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              New Batch
            </Button>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">Batch ID</TableHead>
                  <TableHead className="text-muted-foreground">Product</TableHead>
                  <TableHead className="text-muted-foreground">Quantity</TableHead>
                  <TableHead className="text-muted-foreground">Start Date</TableHead>
                  <TableHead className="text-muted-foreground">End Date</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>

              </TableHeader>
              <TableBody>
                {batches.map((batch) => (
                    <TableRow key={batch.id} className="border-border">
                      <TableCell className="font-medium text-foreground">
                        {batch.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <span className="font-medium text-foreground">{batch.product}</span>
                        </div>

                      </TableCell>
                      <TableCell className="text-foreground">{batch.quantity}</TableCell>
                      <TableCell className="text-muted-foreground">{batch.startDate}</TableCell>
                      <TableCell className="text-muted-foreground">{batch.endDate}</TableCell>
                      <TableCell>{getStatusBadge(batch.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                Status
                                <ChevronDown className="h-4 w-4 ml-1" />
                              </Button>

                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleUpdateStatus(batch.id, "planned")}>
                                <AlertCircle className="h-4 w-4 mr-2 text-warning" />

                                Planned

                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(batch.id, "in_progress")}>
                                <Clock className="h-4 w-4 mr-2 text-info" />

                                In Progress

                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(batch.id, "completed")}>
                                <CheckCircle2 className="h-4 w-4 mr-2 text-success" />

                                Completed
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDialog(batch)}
                          >

                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(batch.id)}
                          >

                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                ))}

              </TableBody>
            </Table>
          </CardContent>
        </Card>



        {/* Add/Edit Batch Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingBatch ? "Edit Batch" : "Add New Batch"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <Input
                    id="product"
                    placeholder="Enter product name"
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                />

              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                    id="quantity"
                    type="number"
                    placeholder="Enter quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />

              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />

              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />

              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                    value={formData.status}
                    onValueChange={(value: "planned" | "in_progress" | "completed") =>
                        setFormData({ ...formData, status: value })
                    }

                >

                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>

              <Button variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button className="btn-gradient" onClick={handleSubmit}>
                {editingBatch ? "Save Changes" : "Add Batch"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>

  );

};
export default Production;