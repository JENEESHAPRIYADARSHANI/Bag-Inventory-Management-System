import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MoreVertical, Building2, Mail, Phone } from "lucide-react";

const customers = [
  {
    id: "CUS-001",
    name: "Tech Solutions Ltd",
    email: "contact@techsolutions.com",
    phone: "+94 11 234 5678",
    address: "123 Business Park, Colombo",
    registeredDate: "Jan 10, 2025",
    totalOrders: 24,
    totalSpent: "$45,600",
    status: "active",
  },
  {
    id: "CUS-002",
    name: "Global Corp Inc",
    email: "orders@globalcorp.com",
    phone: "+94 11 876 5432",
    address: "456 Corporate Tower, Kandy",
    registeredDate: "Feb 15, 2025",
    totalOrders: 18,
    totalSpent: "$32,100",
    status: "active",
  },
  {
    id: "CUS-003",
    name: "Innovate Hub",
    email: "purchasing@innovatehub.lk",
    phone: "+94 77 123 4567",
    address: "789 Innovation Center, Galle",
    registeredDate: "Mar 22, 2025",
    totalOrders: 12,
    totalSpent: "$18,450",
    status: "active",
  },
  {
    id: "CUS-004",
    name: "Digital Wave Co",
    email: "info@digitalwave.co",
    phone: "+94 76 987 6543",
    address: "321 Tech Hub, Negombo",
    registeredDate: "Apr 05, 2025",
    totalOrders: 8,
    totalSpent: "$12,800",
    status: "inactive",
  },
  {
    id: "CUS-005",
    name: "NextGen Enterprises",
    email: "bulk@nextgen.lk",
    phone: "+94 11 555 0123",
    address: "654 Enterprise Zone, Colombo",
    registeredDate: "May 18, 2025",
    totalOrders: 32,
    totalSpent: "$78,200",
    status: "active",
  },
];

const Customers = () => {
  return (
    <DashboardLayout
      title="Customers"
      subtitle="Manage your corporate customers and their orders"
    >
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            className="pl-10 bg-muted/50 border-transparent focus:border-primary"
          />
        </div>
        <Button className="btn-gradient gap-2">
          <Plus className="h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {/* Customers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {customers.map((customer, index) => (
          <div
            key={customer.id}
            className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{customer.name}</h3>
                  <p className="text-sm text-muted-foreground">{customer.id}</p>
                </div>
              </div>
              <button className="p-1 rounded-lg hover:bg-muted transition-colors">
                <MoreVertical className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {customer.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {customer.phone}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="font-semibold text-foreground">{customer.totalOrders}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="font-semibold text-primary">{customer.totalSpent}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <Badge
                variant="outline"
                className={
                  customer.status === "active"
                    ? "bg-success/10 text-success border-success/20"
                    : "bg-muted text-muted-foreground"
                }
              >
                {customer.status}
              </Badge>
              <span className="text-xs text-muted-foreground">Since {customer.registeredDate}</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Customers;
