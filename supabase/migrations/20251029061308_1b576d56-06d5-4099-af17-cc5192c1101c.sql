-- Create products table with authoritative pricing
CREATE TABLE IF NOT EXISTS public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'course',
  instructor TEXT,
  instructor_role TEXT,
  duration TEXT,
  level TEXT,
  students INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user purchases table to track confirmed payments
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  amount_paid DECIMAL(10,2) NOT NULL,
  payment_provider TEXT DEFAULT 'paystack',
  payment_reference TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create cart items table for server-side cart management
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create saved items table for user favorites
CREATE TABLE IF NOT EXISTS public.saved_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;

-- Products are publicly readable
CREATE POLICY "Anyone can view products" 
ON public.products 
FOR SELECT 
USING (true);

-- Users can only view their own purchases
CREATE POLICY "Users can view their own purchases" 
ON public.purchases 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can manage their own cart
CREATE POLICY "Users can view their own cart" 
ON public.cart_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own cart" 
ON public.cart_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart" 
ON public.cart_items 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own cart" 
ON public.cart_items 
FOR DELETE 
USING (auth.uid() = user_id);

-- Users can manage their own saved items
CREATE POLICY "Users can view their own saved items" 
ON public.saved_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own saved items" 
ON public.saved_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved items" 
ON public.saved_items 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
BEFORE UPDATE ON public.cart_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products migrated from hardcoded data
INSERT INTO public.products (title, description, price, image_url, category, instructor, instructor_role, duration, level, students, rating) VALUES
  ('How to Build Thriving Communities', 'Learn the secrets to building engaged, thriving online communities from scratch', 19.00, '/assets/dashboard-images/Cart1.jpg', 'course', 'Sarah Johnson', 'Community Expert', '3 hours', 'Beginner', 1234, 4.5),
  ('Advanced React Patterns', 'Master advanced React patterns and best practices for scalable applications', 29.00, '/assets/dashboard-images/firm.jpg', 'course', 'John Doe', 'Senior Developer', '5 hours', 'Advanced', 2567, 4.8),
  ('UI/UX Design Masterclass', 'Complete guide to modern UI/UX design principles and tools', 24.00, '/assets/dashboard-images/lady.jpg', 'course', 'Emma Wilson', 'Lead Designer', '4 hours', 'Intermediate', 1890, 4.6),
  ('JavaScript Fundamentals', 'Comprehensive introduction to JavaScript programming', 15.00, '/assets/dashboard-images/only.jpg', 'course', 'Mike Chen', 'JavaScript Expert', '6 hours', 'Beginner', 3421, 4.7)
ON CONFLICT DO NOTHING;