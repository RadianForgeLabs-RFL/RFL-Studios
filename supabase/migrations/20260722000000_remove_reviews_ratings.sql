-- Remove reviews and ratings system
-- Run this in Supabase SQL Editor

-- Drop the rating recalculation trigger
DROP TRIGGER IF EXISTS trg_reviews_rating ON public.reviews;

-- Drop the rating recalculation function
DROP FUNCTION IF EXISTS public.recalc_product_rating();

-- Drop the reviews table
DROP TABLE IF EXISTS public.reviews;

-- Remove rating columns from products table
ALTER TABLE public.products DROP COLUMN IF EXISTS rating_avg;
ALTER TABLE public.products DROP COLUMN IF EXISTS rating_count;
