import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  userName: string | null;
  userEmail: string | null;
  avatarUrl: string | null;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>({
    userName: null,
    userEmail: null,
    avatarUrl: null,
  });

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

  useEffect(() => {
    const updateFromSession = (session: any) => {
      const user = session?.user || null;
      if (user) {
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

        setTimeout(async () => {
          const { data, error } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("user_id", user.id)
            .maybeSingle();
          if (!error && data) {
            setProfile((prev) => ({
              ...prev,
              userName: data.full_name || prev.userName,
              avatarUrl: data.avatar_url || prev.avatarUrl,
            }));
          }
        }, 0);
      } else {
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
  }, []);

  return profile;
}
