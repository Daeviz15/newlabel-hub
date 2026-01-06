"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/use-user-profile";
import { toast } from "@/hooks/use-toast";
import { 
  getSaved as getLocalSaved, 
  addSaved as addLocalSaved, 
  removeSaved as removeLocalSaved, 
  onSavedChange,
  SavedItem 
} from "./use-saved";

export function useSavedItems() {
  const { userId } = useUserProfile();
  const [savedItems, setSavedItems] = useState<SavedItem[]>(getLocalSaved());
  const [isLoading, setIsLoading] = useState(false);

  // Sync with local storage changes
  useEffect(() => {
    const unsubscribe = onSavedChange(() => {
      setSavedItems(getLocalSaved());
    });
    return unsubscribe;
  }, []);

  // Initial fetch from Supabase on mount/auth change
  useEffect(() => {
    const syncWithSupabase = async () => {
      if (!userId) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('saved_items')
          .select(`
            id,
            product:products (
              id,
              title,
              image_url,
              instructor,
              price,
              brand,
              description
            )
          `);

        if (error) throw error;

        if (data) {
          // Transform Supabase data to SavedItem format
          const remoteItems: SavedItem[] = data
            .filter(item => item.product)
            .map(item => ({
              id: item.product!.id,
              title: item.product!.title,
              image: item.product!.image_url || "/placeholder.svg",
              creator: item.product!.instructor || "Unknown",
              price: `₦${item.product!.price}`,
              brand: item.product!.brand || undefined,
              description: item.product!.description || undefined,
            }));

          // Merge Logic: Identify items in local that are missing from remote
          // and were likely added while offline/loading.
          const localItems = getLocalSaved();
          const itemsToPush = localItems.filter(localItem => 
             !remoteItems.some(remoteItem => String(remoteItem.id) === String(localItem.id))
          );

          if (itemsToPush.length > 0) {
             // Push these new local items to Supabase
             for (const item of itemsToPush) {
                 const { error: insertError } = await supabase.from('saved_items').insert({
                    user_id: userId,
                    product_id: item.id
                 });
                 if (insertError) {
                    console.error("Failed to sync local item:", item.title, insertError);
                 }
             }
             // Add them to our remote list representation so UI updates immediately
             remoteItems.push(...itemsToPush);
          }

          localStorage.setItem("saved_items", JSON.stringify(remoteItems));
          window.dispatchEvent(new CustomEvent("saved:changed"));
        }
      } catch (error) {
        console.error("Error syncing saved items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    syncWithSupabase();
  }, [userId]);

  const isSaved = useCallback((productId: string) => {
    return savedItems.some(item => String(item.id) === String(productId));
  }, [savedItems]);

  const toggleSave = async (item: SavedItem) => {
    const currentlySaved = isSaved(item.id);
    const originalState = [...savedItems];

    // Optimistic update
    if (currentlySaved) {
      removeLocalSaved(item.id);
      toast({
        title: "Removed from library",
        description: "Course removed from your saved items",
      });
    } else {
      addLocalSaved(item);
      toast({
        title: "Added to library",
        description: "Course saved to your library",
      });
    }

    // Supabase sync
    if (userId) {
      try {
        if (currentlySaved) {
            // Find the saved_item record to delete. 
            // We need to delete by product_id and user_id.
            // But we don't have the saved_item ID here easily. 
            // Deleting by product_id and user_id matches is best.
            const { error } = await supabase
                .from('saved_items')
                .delete()
                .eq('user_id', userId)
                .eq('product_id', item.id);
            
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('saved_items')
                .insert({
                    user_id: userId,
                    product_id: item.id
                });

            if (error) throw error;
        }
      } catch (error) {
        console.error("Error syncing save action:", error);
        // Revert on error
        localStorage.setItem("saved_items", JSON.stringify(originalState));
        window.dispatchEvent(new CustomEvent("saved:changed"));
        toast({
            title: "Error",
            description: "Failed to sync changes. Please try again.",
            variant: "destructive"
        });
      }
    }
  };

  return {
    savedItems,
    isLoading,
    isSaved,
    toggleSave
  };
}
