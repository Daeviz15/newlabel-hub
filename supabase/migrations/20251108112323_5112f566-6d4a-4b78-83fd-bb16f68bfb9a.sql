-- Create user roles enum and table for admin access control
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles without RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Add preview_video_url to products table
ALTER TABLE public.products
ADD COLUMN preview_video_url TEXT;

-- Create course_lessons table
CREATE TABLE public.course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  duration TEXT,
  order_number INTEGER NOT NULL,
  is_preview BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

-- RLS policies for course_lessons
CREATE POLICY "Anyone can view lessons"
  ON public.course_lessons
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert lessons"
  ON public.course_lessons
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update lessons"
  ON public.course_lessons
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete lessons"
  ON public.course_lessons
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_course_lessons_updated_at
  BEFORE UPDATE ON public.course_lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage buckets for course content
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('course-videos', 'course-videos', true),
  ('course-images', 'course-images', true);

-- Storage policies for course-videos bucket
CREATE POLICY "Anyone can view course videos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'course-videos');

CREATE POLICY "Admins can upload course videos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'course-videos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update course videos"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'course-videos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete course videos"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'course-videos' AND public.has_role(auth.uid(), 'admin'));

-- Storage policies for course-images bucket
CREATE POLICY "Anyone can view course images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'course-images');

CREATE POLICY "Admins can upload course images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'course-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update course images"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'course-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete course images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'course-images' AND public.has_role(auth.uid(), 'admin'));

-- Update products RLS to allow admin modifications
CREATE POLICY "Admins can insert products"
  ON public.products
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
  ON public.products
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
  ON public.products
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));