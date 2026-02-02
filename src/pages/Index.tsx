import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { TopProducts } from "@/components/dashboard/TopProducts";
import { InventoryStatus } from "@/components/dashboard/InventoryStatus";
import {
  ShoppingCart,
  Users,
  DollarSign,
  Package,
  TrendingUp,
  Factory,
} from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Welcome back! Here's an overview of your business."
    >
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Orders"
          value="1,284"
          change="+12.5% from last month"
          changeType="positive"
          icon={ShoppingCart}
          iconColor="bg-primary"
        />
        <StatCard
          title="Total Revenue"
          value="$128,450"
          change="+8.2% from last month"
          changeType="positive"
          icon={DollarSign}
          iconColor="bg-success"
        />
        <StatCard
          title="Active Customers"
          value="324"
          change="+5 new this week"
          changeType="positive"
          icon={Users}
          iconColor="bg-info"
        />
        <StatCard
          title="Products in Stock"
          value="856"
          change="12 items low stock"
          changeType="negative"
          icon={Package}
          iconColor="bg-warning"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <StatCard
          title="Production Batches"
          value="28"
          change="6 in progress"
          changeType="neutral"
          icon={Factory}
          iconColor="bg-primary"
        />
        <StatCard
          title="Monthly Growth"
          value="+18.5%"
          change="Compared to last quarter"
          changeType="positive"
          icon={TrendingUp}
          iconColor="bg-success"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
        <div>
          <InventoryStatus />
        </div>
      </div>

      {/* Products Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TopProducts />
        <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
          <h2 className="font-display text-lg font-semibold text-foreground mb-6">
            Quick Actions
          </h2>
          <div className="grid gap-3">
            <button className="btn-gradient flex items-center justify-center gap-2 rounded-lg py-3 px-4">
              <ShoppingCart className="h-5 w-5" />
              Create New Order
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg border border-primary bg-primary/10 py-3 px-4 font-semibold text-primary hover:bg-primary/20 transition-colors">
              <Users className="h-5 w-5" />
              Add Customer
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg border border-border bg-muted py-3 px-4 font-semibold text-foreground hover:bg-muted/80 transition-colors">
              <Package className="h-5 w-5" />
              Manage Inventory
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg border border-border bg-muted py-3 px-4 font-semibold text-foreground hover:bg-muted/80 transition-colors">
              <Factory className="h-5 w-5" />
              View Production
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
