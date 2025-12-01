-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'content_update',
  related_product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" 
ON public.notifications 
FOR DELETE 
USING (auth.uid() = user_id);

-- Function to create notifications for all users when a product is inserted
CREATE OR REPLACE FUNCTION public.notify_users_on_product_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert notification for all authenticated users
  INSERT INTO public.notifications (user_id, title, message, type, related_product_id)
  SELECT 
    profiles.user_id,
    CASE 
      WHEN NEW.brand = 'jsity' THEN 'New content on JSITY'
      WHEN NEW.brand = 'thc' THEN 'New content on The House Chronicles'
      WHEN NEW.brand = 'gospel' THEN 'New content on Gospel Line'
      ELSE 'New content available'
    END,
    'New ' || NEW.category || ': ' || NEW.title,
    'content_new',
    NEW.id
  FROM public.profiles;
  
  RETURN NEW;
END;
$$;

-- Function to create notifications for all users when a product is updated
CREATE OR REPLACE FUNCTION public.notify_users_on_product_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only notify if significant fields changed
  IF (OLD.title != NEW.title OR OLD.description != NEW.description OR OLD.price != NEW.price) THEN
    INSERT INTO public.notifications (user_id, title, message, type, related_product_id)
    SELECT 
      profiles.user_id,
      CASE 
        WHEN NEW.brand = 'jsity' THEN 'Content updated on JSITY'
        WHEN NEW.brand = 'thc' THEN 'Content updated on The House Chronicles'
        WHEN NEW.brand = 'gospel' THEN 'Content updated on Gospel Line'
        ELSE 'Content updated'
      END,
      'Updated ' || NEW.category || ': ' || NEW.title,
      'content_update',
      NEW.id
    FROM public.profiles;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create triggers for product insert and update
CREATE TRIGGER on_product_insert_notify
  AFTER INSERT ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_users_on_product_insert();

CREATE TRIGGER on_product_update_notify
  AFTER UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_users_on_product_update();

-- Enable realtime for notifications
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;