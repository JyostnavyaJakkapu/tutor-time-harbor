CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  full_name text,
  role text NOT NULL DEFAULT 'student',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (full_name) ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject text NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin(_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = _uid AND role = 'admin')
$$;

CREATE POLICY "Own profile or admin read" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "Update own name" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "Own bookings or admin read" ON public.bookings FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "Create own bookings" ON public.bookings FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Update own bookings" ON public.bookings FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Delete own bookings" ON public.bookings FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed fake students and bookings
INSERT INTO public.profiles (id, full_name, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Test Student One', 'student'),
  ('00000000-0000-0000-0000-000000000002', 'Test Student Two', 'student'),
  ('00000000-0000-0000-0000-000000000003', 'Test Student Three', 'student');

INSERT INTO public.bookings (user_id, subject, date, time, notes) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Maths', '2026-10-20', '10:00', 'Fake booking: algebra review'),
  ('00000000-0000-0000-0000-000000000001', 'Physics', '2026-10-22', '14:00', 'Fake booking: forces'),
  ('00000000-0000-0000-0000-000000000001', 'Maths', '2026-10-27', '10:00', 'Fake booking: geometry'),
  ('00000000-0000-0000-0000-000000000001', 'Chemistry', '2026-11-03', '16:00', 'Fake booking'),
  ('00000000-0000-0000-0000-000000000002', 'English', '2026-10-21', '09:30', 'Fake booking: essay feedback'),
  ('00000000-0000-0000-0000-000000000002', 'History', '2026-10-28', '11:00', 'Fake booking'),
  ('00000000-0000-0000-0000-000000000002', 'English', '2026-11-04', '09:30', 'Fake booking: poetry'),
  ('00000000-0000-0000-0000-000000000003', 'Biology', '2026-10-23', '15:00', 'Fake booking: cells'),
  ('00000000-0000-0000-0000-000000000003', 'Maths', '2026-10-30', '17:00', 'Fake booking: exam prep'),
  ('00000000-0000-0000-0000-000000000003', 'Biology', '2026-11-06', '15:00', 'Fake booking');