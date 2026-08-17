
-- Fix function search_path
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Restrict guest-friendly INSERT policies to explicit roles (still allows guests via anon)
DROP POLICY "Anyone can create an order" ON public.orders;
CREATE POLICY "Guests and users create orders" ON public.orders FOR INSERT TO anon, authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

DROP POLICY "Anyone insert order_items" ON public.order_items;
CREATE POLICY "Guests and users insert order_items" ON public.order_items FOR INSERT TO anon, authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id));

DROP POLICY "Anyone submit enquiry" ON public.b2b_enquiries;
CREATE POLICY "Guests and users submit enquiry" ON public.b2b_enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Lock down SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
