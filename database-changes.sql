-- Add company stats to settings table
ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS user_count TEXT DEFAULT '10K+',
ADD COLUMN IF NOT EXISTS player_count TEXT DEFAULT '10K+',
ADD COLUMN IF NOT EXISTS downloads_count TEXT DEFAULT '50K+',
ADD COLUMN IF NOT EXISTS studios_icon TEXT DEFAULT 'Code',
ADD COLUMN IF NOT EXISTS entertainment_icon TEXT DEFAULT 'Gamepad2';

-- Update existing settings with default values
UPDATE settings 
SET user_count = '10K+', 
    player_count = '10K+', 
    downloads_count = '50K+',
    studios_icon = 'Code',
    entertainment_icon = 'Gamepad2'
WHERE user_count IS NULL;

-- Add icon_url field to products table for division icons (optional, if you want custom icons)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS icon_url TEXT;

-- Ensure coming_soon products are properly synced
-- This query checks if there are any products with coming_soon=true that might not be displaying correctly
SELECT id, name, slug, coming_soon, published FROM products WHERE coming_soon = true;
