-- Add extra guidance field to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS extra_guidance TEXT;
