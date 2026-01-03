"use client";

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TopPick } from "./course-card";
import { BrandedSpinner } from "./ui/BrandedSpinner";

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  instructor: string | null;
  description: string | null;
  category: string;
  brand: string | null;
  created_at: string;
  // Analytics fields (if available)
  view_count?: number;
  purchase_count?: number;
  rating?: number;
}

interface TopPickData {
  product: Product;
  score: number;
  reason: string;
}

/**
 * Intelligent Top Pick Algorithm
 * 
 * Scoring factors:
 * 1. Recency (40%) - Products created in the last 7 days get higher scores
 * 2. Price Point (20%) - Mid-range products tend to perform better
 * 3. Completeness (20%) - Products with images, descriptions score higher
 * 4. Category Diversity (10%) - Rotate through different categories
 * 5. Random Factor (10%) - Add variety to recommendations
 */
function calculateTopPickScore(product: Product, allProducts: Product[]): TopPickData {
  let score = 0;
  const reasons: string[] = [];

  // 1. RECENCY SCORE (40 points max)
  const createdDate = new Date(product.created_at);
  const now = new Date();
  const daysSinceCreation = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSinceCreation <= 7) {
    // Newer products get higher scores
    const recencyScore = Math.max(0, 40 - (daysSinceCreation * 5));
    score += recencyScore;
    if (daysSinceCreation <= 3) {
      reasons.push("New Release");
    }
  } else if (daysSinceCreation <= 30) {
    score += 20;
  } else {
    score += 10;
  }

  // 2. PRICE POINT SCORE (20 points max)
  // Mid-range products (not too cheap, not too expensive) score higher
  const avgPrice = allProducts.reduce((sum, p) => sum + p.price, 0) / allProducts.length;
  const priceRatio = product.price / avgPrice;
  
  if (priceRatio >= 0.5 && priceRatio <= 1.5) {
    score += 20; // Sweet spot
    reasons.push("Best Value");
  } else if (priceRatio >= 0.3 && priceRatio <= 2) {
    score += 15;
  } else if (product.price === 0) {
    score += 10;
    reasons.push("Free Course");
  } else {
    score += 5;
  }

  // 3. COMPLETENESS SCORE (20 points max)
  let completenessScore = 0;
  if (product.image_url && !product.image_url.includes("placeholder")) {
    completenessScore += 8;
  }
  if (product.description && product.description.length > 50) {
    completenessScore += 6;
  }
  if (product.instructor) {
    completenessScore += 6;
    reasons.push(`By ${product.instructor}`);
  }
  score += completenessScore;

  // 4. CATEGORY DIVERSITY (10 points max)
  // Use current week number to rotate categories
  const weekNumber = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
  const categories = [...new Set(allProducts.map(p => p.category))];
  const targetCategoryIndex = weekNumber % categories.length;
  
  if (product.category === categories[targetCategoryIndex]) {
    score += 10;
    reasons.push("Featured Category");
  }

  // 5. RANDOM FACTOR (10 points max)
  // Use product ID hash for consistent randomness
  const hashCode = product.id.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const randomScore = Math.abs(hashCode % 11); // 0-10
  score += randomScore;

  // 6. BONUS: Check for analytics data (if available)
  if (product.view_count && product.view_count > 100) {
    score += 5;
    reasons.push("Trending");
  }
  if (product.purchase_count && product.purchase_count > 10) {
    score += 5;
    reasons.push("Popular");
  }
  if (product.rating && product.rating >= 4.5) {
    score += 5;
    reasons.push("Highly Rated");
  }

  return {
    product,
    score,
    reason: reasons.slice(0, 2).join(" • ") || "Editor's Choice",
  };
}

interface WeeklyTopPickProps {
  accent?: "lime" | "purple";
  brand?: string;
}

export function WeeklyTopPick({ accent = "lime", brand }: WeeklyTopPickProps) {
  const navigate = useNavigate();
  const [topPick, setTopPick] = useState<TopPickData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopPick = async () => {
      try {
        setLoading(true);
        
        // Build query
        let query = supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(20); // Get last 20 products to analyze

        // Filter by brand if specified
        if (brand) {
          query = query.eq("brand", brand);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        if (!data || data.length === 0) {
          setError("No products available");
          return;
        }

        // Calculate scores for all products
        const scoredProducts = data.map((product) => 
          calculateTopPickScore(product as Product, data as Product[])
        );

        // Sort by score and get the top one
        scoredProducts.sort((a, b) => b.score - a.score);
        const winner = scoredProducts[0];

        setTopPick(winner);
      } catch (err: any) {
        console.error("Error fetching top pick:", err);
        setError(err.message || "Failed to load top pick");
      } finally {
        setLoading(false);
      }
    };

    fetchTopPick();
  }, [brand]);

  const handleClick = () => {
    if (topPick) {
      navigate("/video-details", {
        state: {
          id: topPick.product.id,
          image: topPick.product.image_url,
          title: topPick.product.title,
          creator: topPick.product.instructor,
          price: `₦${topPick.product.price.toLocaleString()}`,
        },
      });
    }
  };

  if (loading) {
    return (
      <section className="rounded-2xl border border-white/10 bg-[#121212] p-8">
        <div className="flex items-center justify-center h-64">
          <BrandedSpinner size="lg" message="Finding this week's top pick..." />
        </div>
      </section>
    );
  }

  if (error || !topPick) {
    return null; // Silently hide if no data
  }

  return (
    <TopPick
      imageSrc={topPick.product.image_url || "/assets/dashboard-images/face.jpg"}
      eyebrow={`This Week's Top Pick • ${topPick.reason}`}
      title={topPick.product.title}
      author={topPick.product.instructor || "NewLabel Team"}
      authorRole={topPick.product.description?.substring(0, 50) + "..." || `${topPick.product.category} • NewLabel`}
      cta={topPick.product.price === 0 ? "Get Free Access" : `Buy • ₦${topPick.product.price.toLocaleString()}`}
      accent={accent}
      imageFit="cover"
      onClick={handleClick}
    />
  );
}

export default WeeklyTopPick;
