-- Enable realtime for products table
ALTER TABLE products REPLICA IDENTITY FULL;

-- Add products to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE products;