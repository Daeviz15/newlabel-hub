import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsData {
  // User engagement
  totalUsers: number;
  activeUsersLast30Days: number;
  newUsersLast30Days: number;
  
  // Revenue & Sales
  totalRevenue: number;
  revenueLast30Days: number;
  totalPurchases: number;
  purchasesLast30Days: number;
  revenueByBrand: { brand: string; revenue: number }[];
  dailyRevenue: { date: string; revenue: number }[];
  
  // Content performance
  totalCourses: number;
  coursesByBrand: { brand: string; count: number }[];
  totalCartItems: number;
  totalSavedItems: number;
  topCourses: { id: string; title: string; purchases: number; revenue: number }[];
  
  // Recent activity
  recentPurchases: { id: string; title: string; amount: number; date: string }[];
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoISO = thirtyDaysAgo.toISOString();

      // Fetch all data in parallel
      const [
        profilesResult,
        purchasesResult,
        recentPurchasesResult,
        productsResult,
        cartItemsResult,
        savedItemsResult,
      ] = await Promise.all([
        // Total users
        supabase.from("profiles").select("id, created_at"),
        // All purchases
        supabase.from("purchases").select("id, amount_paid, purchased_at, product_id"),
        // Recent purchases with product info
        supabase
          .from("purchases")
          .select("id, amount_paid, purchased_at, product_id, products(title)")
          .order("purchased_at", { ascending: false })
          .limit(10),
        // All products
        supabase.from("products").select("id, title, brand, price"),
        // Cart items count
        supabase.from("cart_items").select("id", { count: "exact", head: true }),
        // Saved items count
        supabase.from("saved_items").select("id", { count: "exact", head: true }),
      ]);

      const profiles = profilesResult.data || [];
      const purchases = purchasesResult.data || [];
      const recentPurchases = recentPurchasesResult.data || [];
      const products = productsResult.data || [];

      // Calculate user metrics
      const totalUsers = profiles.length;
      const newUsersLast30Days = profiles.filter(
        (p) => new Date(p.created_at) >= thirtyDaysAgo
      ).length;

      // Get unique users who made purchases in last 30 days
      const purchasesLast30Days = purchases.filter(
        (p) => new Date(p.purchased_at) >= thirtyDaysAgo
      );

      // Calculate revenue metrics
      const totalRevenue = purchases.reduce(
        (sum, p) => sum + Number(p.amount_paid),
        0
      );
      const revenueLast30Days = purchasesLast30Days.reduce(
        (sum, p) => sum + Number(p.amount_paid),
        0
      );

      // Revenue by brand
      const productBrandMap = new Map(products.map((p) => [p.id, p.brand || "unknown"]));
      const brandRevenue: Record<string, number> = {};
      purchases.forEach((p) => {
        const brand = productBrandMap.get(p.product_id) || "unknown";
        brandRevenue[brand] = (brandRevenue[brand] || 0) + Number(p.amount_paid);
      });
      const revenueByBrand = Object.entries(brandRevenue).map(([brand, revenue]) => ({
        brand: brand.charAt(0).toUpperCase() + brand.slice(1),
        revenue,
      }));

      // Daily revenue for last 30 days
      const dailyRevenueMap: Record<string, number> = {};
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        dailyRevenueMap[dateStr] = 0;
      }
      purchasesLast30Days.forEach((p) => {
        const dateStr = new Date(p.purchased_at).toISOString().split("T")[0];
        if (dailyRevenueMap[dateStr] !== undefined) {
          dailyRevenueMap[dateStr] += Number(p.amount_paid);
        }
      });
      const dailyRevenue = Object.entries(dailyRevenueMap)
        .map(([date, revenue]) => ({ date, revenue }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Courses by brand
      const brandCounts: Record<string, number> = {};
      products.forEach((p) => {
        const brand = p.brand || "unknown";
        brandCounts[brand] = (brandCounts[brand] || 0) + 1;
      });
      const coursesByBrand = Object.entries(brandCounts).map(([brand, count]) => ({
        brand: brand.charAt(0).toUpperCase() + brand.slice(1),
        count,
      }));

      // Top courses by purchases
      const coursePurchases: Record<string, { count: number; revenue: number }> = {};
      purchases.forEach((p) => {
        if (!coursePurchases[p.product_id]) {
          coursePurchases[p.product_id] = { count: 0, revenue: 0 };
        }
        coursePurchases[p.product_id].count += 1;
        coursePurchases[p.product_id].revenue += Number(p.amount_paid);
      });
      const topCourses = Object.entries(coursePurchases)
        .map(([id, stats]) => {
          const product = products.find((p) => p.id === id);
          return {
            id,
            title: product?.title || "Unknown",
            purchases: stats.count,
            revenue: stats.revenue,
          };
        })
        .sort((a, b) => b.purchases - a.purchases)
        .slice(0, 5);

      // Format recent purchases
      const formattedRecentPurchases = recentPurchases.map((p) => ({
        id: p.id,
        title: (p.products as any)?.title || "Unknown",
        amount: Number(p.amount_paid),
        date: new Date(p.purchased_at).toLocaleDateString(),
      }));

      setData({
        totalUsers,
        activeUsersLast30Days: new Set(purchasesLast30Days.map((p) => p.product_id)).size,
        newUsersLast30Days,
        totalRevenue,
        revenueLast30Days,
        totalPurchases: purchases.length,
        purchasesLast30Days: purchasesLast30Days.length,
        revenueByBrand,
        dailyRevenue,
        totalCourses: products.length,
        coursesByBrand,
        totalCartItems: cartItemsResult.count || 0,
        totalSavedItems: savedItemsResult.count || 0,
        topCourses,
        recentPurchases: formattedRecentPurchases,
      });
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    // Set up real-time subscription for purchases
    const channel = supabase
      .channel("analytics-updates")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "purchases" },
        () => fetchAnalytics()
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "products" },
        () => fetchAnalytics()
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "profiles" },
        () => fetchAnalytics()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { data, loading, error, refetch: fetchAnalytics };
}
