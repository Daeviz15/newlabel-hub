-- Add unique constraint to cart_items to prevent duplicate entries per user
ALTER TABLE cart_items ADD CONSTRAINT cart_items_user_product_unique UNIQUE (user_id, product_id);