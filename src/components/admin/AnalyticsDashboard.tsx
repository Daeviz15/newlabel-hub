import { useAnalytics } from "@/hooks/use-analytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  DollarSign,
  ShoppingCart,
  BookOpen,
  TrendingUp,
  Heart,
  RefreshCw,
  Target,
  ArrowRightLeft,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AdminLayout } from "./AdminLayout";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "#8b5cf6"];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  loading,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-1" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

function ConversionCard({
  title,
  rate,
  description,
  loading,
}: {
  title: string;
  rate: number;
  description: string;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-2 w-full mb-2" />
          <Skeleton className="h-3 w-40" />
        </CardContent>
      </Card>
    );
  }

  const getProgressColor = (value: number) => {
    if (value >= 50) return "bg-green-500";
    if (value >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Target className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{rate.toFixed(1)}%</div>
        <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${getProgressColor(rate)}`}
            style={{ width: `${Math.min(rate, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      </CardContent>
    </Card>
  );
}

export function AnalyticsDashboard() {
  const { data, loading, error, refetch } = useAnalytics();

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--primary))",
    },
    purchases: {
      label: "Purchases",
      color: "hsl(var(--secondary))",
    },
  };

  return (
    <AdminLayout>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics Overview</h1>
            <p className="text-zinc-400 text-sm">Last 30 days performance</p>
          </div>
        </div>
        <Button onClick={refetch} variant="outline" size="sm" disabled={loading} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={data ? formatCurrency(data.totalRevenue) : 0}
          icon={DollarSign}
          description={data ? `${formatCurrency(data.revenueLast30Days)} last 30 days` : undefined}
          loading={loading}
        />
        <StatCard
          title="Total Users"
          value={data?.totalUsers || 0}
          icon={Users}
          description={data ? `+${data.newUsersLast30Days} new users` : undefined}
          loading={loading}
        />
        <StatCard
          title="Total Purchases"
          value={data?.totalPurchases || 0}
          icon={ShoppingCart}
          description={data ? `${data.purchasesLast30Days} last 30 days` : undefined}
          loading={loading}
        />
        <StatCard
          title="Total Courses"
          value={data?.totalCourses || 0}
          icon={BookOpen}
          description="Active courses"
          loading={loading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenue Trend
            </CardTitle>
            <CardDescription>Daily revenue over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <LineChart data={data?.dailyRevenue || []}>
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", { day: "numeric", month: "short" })
                    }
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 10 }}
                    width={50}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Revenue by Brand */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Brand</CardTitle>
            <CardDescription>Distribution across brands</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <PieChart>
                  <Pie
                    data={data?.revenueByBrand || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="revenue"
                    nameKey="brand"
                    label={({ brand }) => brand}
                  >
                    {data?.revenueByBrand.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ payload }) => {
                      if (payload && payload[0]) {
                        return (
                          <div className="bg-background border rounded-lg p-2 shadow-md">
                            <p className="font-medium">{payload[0].name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(payload[0].value as number)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Conversion Rates */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Conversion Rates</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <ConversionCard
            title="User → Cart"
            rate={data?.userToCartRate || 0}
            description={`${data?.usersWithCart || 0} of ${data?.totalUsers || 0} users added to cart`}
            loading={loading}
          />
          <ConversionCard
            title="Cart → Purchase"
            rate={data?.cartToPurchaseRate || 0}
            description={`${data?.usersWithPurchases || 0} of ${data?.usersWithCart || 0} cart users purchased`}
            loading={loading}
          />
          <ConversionCard
            title="Saved → Purchase"
            rate={data?.savedToPurchaseRate || 0}
            description={`Conversion from saved items to purchases`}
            loading={loading}
          />
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Items in Carts"
          value={data?.totalCartItems || 0}
          icon={ShoppingCart}
          description="Potential revenue"
          loading={loading}
        />
        <StatCard
          title="Saved Items"
          value={data?.totalSavedItems || 0}
          icon={Heart}
          description="Wishlisted courses"
          loading={loading}
        />
        <StatCard
          title="Avg. Order Value"
          value={
            data && data.totalPurchases > 0
              ? formatCurrency(data.totalRevenue / data.totalPurchases)
              : "₦0"
          }
          icon={DollarSign}
          description="Per transaction"
          loading={loading}
        />
      </div>

      {/* Top Courses & Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Courses</CardTitle>
            <CardDescription>By number of purchases</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : data?.topCourses.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No purchases yet
              </p>
            ) : (
              <div className="space-y-3">
                {data?.topCourses.map((course, index) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-sm line-clamp-1">
                          {course.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {course.purchases} purchases
                        </p>
                      </div>
                    </div>
                    <span className="font-medium text-sm">
                      {formatCurrency(course.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Purchases */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchases</CardTitle>
            <CardDescription>Latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : data?.recentPurchases.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No recent purchases
              </p>
            ) : (
              <div className="space-y-3">
                {data?.recentPurchases.slice(0, 5).map((purchase) => (
                  <div
                    key={purchase.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium text-sm line-clamp-1">
                        {purchase.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {purchase.date}
                      </p>
                    </div>
                    <span className="font-medium text-sm text-green-600">
                      +{formatCurrency(purchase.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Courses by Brand */}
      <Card>
        <CardHeader>
          <CardTitle>Courses by Brand</CardTitle>
          <CardDescription>Content distribution</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[150px] w-full" />
          ) : (
            <ChartContainer config={chartConfig} className="h-[150px] w-full">
              <BarChart data={data?.coursesByBrand || []} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis
                  type="category"
                  dataKey="brand"
                  tick={{ fontSize: 12 }}
                  width={80}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={4} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
    </AdminLayout>
  );
}
