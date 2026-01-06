import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface WatchProgressItem {
  id: string;
  lesson_id: string;
  course_id: string;
  progress_seconds: number;
  duration_seconds: number;
  completed: boolean;
  last_watched_at: string;
  course: {
    id: string;
    title: string;
    image_url: string | null;
    instructor: string | null;
    brand: string | null;
  };
  lesson: {
    id: string;
    title: string;
    video_url: string;
  };
}

export function useWatchProgress(userId: string | null) {
  const [watchProgress, setWatchProgress] = useState<WatchProgressItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWatchProgress = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("watch_progress")
        .select(`
          id,
          lesson_id,
          course_id,
          progress_seconds,
          duration_seconds,
          completed,
          last_watched_at,
          products:course_id (
            id,
            title,
            image_url,
            instructor,
            brand
          ),
          course_lessons:lesson_id (
            id,
            title,
            video_url
          )
        `)
        .eq("user_id", userId)
        .eq("completed", false)
        .order("last_watched_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      // Transform the data
      const transformedData = (data || []).map((item: any) => ({
        id: item.id,
        lesson_id: item.lesson_id,
        course_id: item.course_id,
        progress_seconds: item.progress_seconds,
        duration_seconds: item.duration_seconds,
        completed: item.completed,
        last_watched_at: item.last_watched_at,
        course: item.products,
        lesson: item.course_lessons,
      }));

      setWatchProgress(transformedData);
    } catch (error) {
      console.error("Error fetching watch progress:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchWatchProgress();
  }, [fetchWatchProgress]);

  const updateProgress = useCallback(
    async (
      lessonId: string,
      courseId: string,
      progressSeconds: number,
      durationSeconds: number
    ) => {
      if (!userId) return;

      const completed = durationSeconds > 0 && progressSeconds >= durationSeconds * 0.95;

      const { error } = await supabase
        .from("watch_progress")
        .upsert(
          {
            user_id: userId,
            lesson_id: lessonId,
            course_id: courseId,
            progress_seconds: Math.floor(progressSeconds),
            duration_seconds: Math.floor(durationSeconds),
            completed,
            last_watched_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,lesson_id",
          }
        );

      if (error) {
        console.error("Error updating watch progress:", error);
      }
    },
    [userId]
  );

  const getProgressPercent = (progressSeconds: number, durationSeconds: number) => {
    if (durationSeconds === 0) return 0;
    return Math.round((progressSeconds / durationSeconds) * 100);
  };

  return {
    watchProgress,
    isLoading,
    updateProgress,
    getProgressPercent,
    refetch: fetchWatchProgress,
  };
}
