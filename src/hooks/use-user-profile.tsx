import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  userName: string | null;
  userEmail: string | null;
  avatarUrl: string | null;
  isLoading: boolean;
  refetch: () => void;
}

export function useUserProfile(): UserProfile {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Omit<UserProfile, 'refetch' | 'isLoading'>>({
    userName: null,
    userEmail: null,
    avatarUrl: null,
  });
  const [userId, setUserId] = useState<string | null>(null);

  const toTitleCase = (value: string): string => {
    return value
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const deriveNameFromEmail = (email: string | null): string | null => {
    if (!email) return null;
    const local = email.split("@")[0];
    if (!local) return null;
    const cleaned = local.replace(/[._-]+/g, " ").replace(/\s+/g, " ").trim();
    if (!cleaned) return null;
    return toTitleCase(cleaned);
  };

  const fetchProfileData = useCallback(async (uid: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("user_id", uid)
        .maybeSingle();
      
      if (!error && data) {
        setProfile((prev) => ({
          ...prev,
          userName: data.full_name || prev.userName,
          avatarUrl: data.avatar_url || prev.avatarUrl,
        }));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    if (userId) {
      fetchProfileData(userId);
    }
  }, [userId, fetchProfileData]);

  useEffect(() => {
    const updateFromSession = (session: any) => {
      const user = session?.user || null;
      if (user) {
        setUserId(user.id);
        const meta = user.user_metadata || {};
        const email: string | null = user.email ?? null;
        const metaName: string | null = meta.full_name || meta.name || null;
        const derivedFromEmail: string | null = deriveNameFromEmail(email);
        const bestInitialName: string | null = metaName || derivedFromEmail || email || null;

        setProfile({
          userEmail: email,
          userName: bestInitialName,
          avatarUrl: meta.avatar_url || meta.picture || null,
        });

        setTimeout(() => {
          fetchProfileData(user.id);
        }, 0);
      } else {
        setUserId(null);
        setProfile({
          userName: null,
          userEmail: null,
          avatarUrl: null,
        });
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      updateFromSession(session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      updateFromSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [fetchProfileData]);

  return { ...profile, isLoading, refetch };
}
