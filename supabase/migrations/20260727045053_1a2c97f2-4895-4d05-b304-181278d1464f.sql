
-- ============ ENUM + role infra ============
CREATE TYPE public.app_role AS ENUM ('admin', 'customer');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Auto-create profile + default customer role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ Catalog ============
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category_slug TEXT NOT NULL REFERENCES public.categories(slug),
  price NUMERIC(10,2) NOT NULL,
  sale_price NUMERIC(10,2),
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  ingredients TEXT NOT NULL,
  nutrition JSONB NOT NULL DEFAULT '[]'::jsonb,
  weight TEXT NOT NULL,
  shelf_life TEXT NOT NULL,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  best_seller BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ Orders ============
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  shipping NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  status TEXT NOT NULL DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.orders TO anon;
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create an order" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view all orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_slug TEXT NOT NULL,
  product_name TEXT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  quantity INT NOT NULL,
  line_total NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.order_items TO anon, authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone insert order_items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Users view own order items" ON public.order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND o.user_id = auth.uid()));
CREATE POLICY "Admins view all order items" ON public.order_items FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============ B2B ============
CREATE TABLE public.b2b_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT,
  business_type TEXT,
  quantity TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.b2b_enquiries TO anon, authenticated;
GRANT SELECT, UPDATE ON public.b2b_enquiries TO authenticated;
GRANT ALL ON public.b2b_enquiries TO service_role;
ALTER TABLE public.b2b_enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone submit enquiry" ON public.b2b_enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view enquiries" ON public.b2b_enquiries FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update enquiries" ON public.b2b_enquiries FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ Testimonials ============
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  role TEXT,
  quote TEXT NOT NULL,
  rating INT NOT NULL DEFAULT 5,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (is_published = true);
CREATE POLICY "Admins manage testimonials" ON public.testimonials FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ updated_at trigger ============
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ Seed data ============
INSERT INTO public.categories (slug, name, description, sort_order) VALUES
  ('energy-bars', 'Energy Bars', 'Single-origin dark chocolate energy bars', 1),
  ('gift-hampers', 'Gift Hampers', 'Curated pralines and truffle boxes', 2);

INSERT INTO public.products (slug, name, category_slug, price, sale_price, short_description, full_description, ingredients, nutrition, weight, shelf_life, best_seller, sort_order) VALUES
('cacao-noir-original','ChocoVibes Original','energy-bars',349,299,
 'Single-origin 72% dark chocolate energy bar with cocoa nibs and dates.',
 'Our signature bar is crafted from single-origin 72% dark chocolate, slow-blended with Medjool dates, roasted cocoa nibs and a whisper of Himalayan pink salt. Sustained clean energy, no refined sugar.',
 '72% dark chocolate, Medjool dates, cocoa nibs, oats, almonds, Himalayan salt.',
 '[{"label":"Energy","value":"212 kcal"},{"label":"Protein","value":"6.4 g"},{"label":"Carbs","value":"22 g"},{"label":"Fats","value":"11 g"}]'::jsonb,
 '45 g','9 months',true,1),
('almond-sea-salt','Almond & Sea Salt','energy-bars',349,NULL,
 'Roasted almonds folded into 65% dark chocolate with flaked sea salt.',
 'A study in contrasts — deep bittersweet chocolate meets golden roasted almonds and a finishing crunch of Fleur de Sel. Balanced, elegant, and quietly powerful.',
 '65% dark chocolate, roasted almonds, oats, honey, Fleur de Sel.',
 '[{"label":"Energy","value":"224 kcal"},{"label":"Protein","value":"7.1 g"},{"label":"Carbs","value":"20 g"},{"label":"Fats","value":"13 g"}]'::jsonb,
 '45 g','9 months',true,2),
('hazelnut-cocoa-nib','Hazelnut & Cocoa Nib','energy-bars',379,NULL,
 'Piedmont hazelnuts and crushed cocoa nibs in dark chocolate.',
 'Rich, roasted, and unapologetically indulgent. Piedmont hazelnuts crushed into a soft praline, wrapped in dark chocolate and finished with a scatter of cocoa nibs.',
 'Dark chocolate, hazelnuts, cocoa nibs, oats, dates, cocoa butter.',
 '[{"label":"Energy","value":"236 kcal"},{"label":"Protein","value":"6.8 g"},{"label":"Carbs","value":"21 g"},{"label":"Fats","value":"14 g"}]'::jsonb,
 '45 g','9 months',true,3),
('pistachio-rose','Pistachio & Rose','energy-bars',399,NULL,
 'Slivered pistachios and Damask rose petals in cream chocolate.',
 'An ode to Persian confectionery — slivered Iranian pistachios, dried Damask rose and a delicate cream chocolate coating. Fragrant, refined, unforgettable.',
 'Cream chocolate, pistachios, rose petals, oats, honey, cardamom.',
 '[{"label":"Energy","value":"228 kcal"},{"label":"Protein","value":"7.4 g"},{"label":"Carbs","value":"19 g"},{"label":"Fats","value":"13 g"}]'::jsonb,
 '45 g','9 months',false,4),
('the-noir-signature','The Noir Signature Box','gift-hampers',2499,2199,
 '24 hand-finished pralines and truffles in a lacquered wooden box.',
 'Our flagship hamper. Twenty-four hand-finished pralines and truffles nestled in gold cups within a lacquered walnut box. Includes a hand-tied silk ribbon and a personalisation card.',
 'Assorted dark, milk and white chocolate pralines, ganaches, caramels, nut clusters.',
 '[{"label":"Serving","value":"12 g / piece"},{"label":"Pieces","value":"24"}]'::jsonb,
 '290 g','3 months',true,1),
('grand-reserve-hamper','Grand Reserve Hamper','gift-hampers',3999,NULL,
 'Aged single-origin truffles with gold-leaf bonbons.',
 'A curator''s edition — aged single-origin truffles from Ecuador and Madagascar, paired with 24-karat gold-leaf bonbons. Presented in a burgundy fold-out case with silk lining.',
 'Single-origin dark chocolate, cream, cocoa butter, edible gold leaf.',
 '[{"label":"Serving","value":"14 g / piece"},{"label":"Pieces","value":"20"}]'::jsonb,
 '320 g','3 months',true,2),
('petit-noir-tin','Petit Noir Truffle Tin','gift-hampers',1199,NULL,
 'Nine gilded truffles in a keepsake tin.',
 'A pocket of indulgence. Nine gilded truffles — cocoa, praline, salted caramel — in a matte-black keepsake tin, perfect for corporate gifting at scale.',
 'Dark chocolate, cream, praline, salted caramel, cocoa dusting.',
 '[{"label":"Serving","value":"10 g / piece"},{"label":"Pieces","value":"9"}]'::jsonb,
 '110 g','3 months',false,3);

INSERT INTO public.testimonials (author, role, quote, rating, sort_order) VALUES
('Anaya Kapoor','Food Editor, Vogue India','ChocoVibes has quietly become the most exciting chocolate on my desk. Every bite is measured, deliberate — and completely addictive.',5,1),
('Rohan Mehta','Head of Gifting, Taj Hotels','We shortlisted six chocolatiers for our client hampers this year. ChocoVibes was the only one that felt truly luxurious end-to-end.',5,2),
('Sara D''Souza','Founder, The Perch Cafe','Our guests notice the difference immediately. This is chocolate as it was meant to be — small batch, beautifully crafted, unforgettable.',5,3);
