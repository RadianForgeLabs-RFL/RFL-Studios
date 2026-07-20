
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS coming_soon boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.preorders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

GRANT SELECT, INSERT, DELETE ON public.preorders TO authenticated;
GRANT ALL ON public.preorders TO service_role;

ALTER TABLE public.preorders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own preorders" ON public.preorders
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view all preorders" ON public.preorders
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users create own preorders" ON public.preorders
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own preorders" ON public.preorders
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
