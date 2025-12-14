import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useSavedItems() {
  const [savedItemIds, setSavedItemIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let userId: string | null = null;

    const fetchSavedItems = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id || null;
      
      if (!user) {
        setSavedItemIds(new Set());
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("saved_items")
        .select("product_id")
        .eq("user_id", user.id);

      if (!error && data) {
        setSavedItemIds(new Set(data.map((item) => item.product_id)));
      } else {
        setSavedItemIds(new Set());
      }
      setIsLoading(false);
    };

    fetchSavedItems();

    // Subscribe to changes - refetch when any change occurs
    // The immediate state update in toggleSavedItem should handle most cases
    const channel = supabase
      .channel("saved_items_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "saved_items",
        },
        (payload) => {
          // Only refetch if the change is for the current user
          if (userId && payload.new && (payload.new as any).user_id === userId) {
            fetchSavedItems();
          } else if (userId && payload.old && (payload.old as any).user_id === userId) {
            fetchSavedItems();
          }
        }
      )
      .subscribe();

    // Also listen to auth changes to refetch when user changes
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(() => {
      fetchSavedItems();
    });

    return () => {
      supabase.removeChannel(channel);
      authSub.unsubscribe();
    };
  }, []);

  const isItemSaved = (productId: string): boolean => {
    return savedItemIds.has(productId);
  };

  const toggleSavedItem = async (productId: string): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return false;
    }

    const isSaved = savedItemIds.has(productId);

    if (isSaved) {
      // Remove from saved items
      const { error } = await supabase
        .from("saved_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (!error) {
        setSavedItemIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
        return true;
      }
    } else {
      // Add to saved items
      const { error } = await supabase
        .from("saved_items")
        .insert({
          user_id: user.id,
          product_id: productId,
        });

      if (!error) {
        setSavedItemIds((prev) => new Set([...prev, productId]));
        return true;
      }
    }

    return false;
  };

  const removeSavedItem = async (productId: string): Promise<boolean> => {
    return toggleSavedItem(productId);
  };

  return {
    isItemSaved,
    toggleSavedItem,
    removeSavedItem,
    isLoading,
    savedItemIds,
  };
}

