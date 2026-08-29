-- Schema for EstateFlow Profiles and Admin Management

-- 1. Table: public.profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on public.profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Allow public read access on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to insert own profile" ON public.profiles;

CREATE POLICY "Allow public read access on profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Allow users to insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow users to update own profile"
  ON public.profiles FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 2. Trigger function to auto-create profile on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    'user',
    'active'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(NULLIF(public.profiles.full_name, ''), EXCLUDED.full_name),
    avatar_url = COALESCE(NULLIF(public.profiles.avatar_url, ''), EXCLUDED.avatar_url),
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Functions for Admin operations
CREATE OR REPLACE FUNCTION public.admin_create_user(
  p_email TEXT,
  p_password TEXT,
  p_full_name TEXT,
  p_role TEXT DEFAULT 'user'
)
RETURNS JSONB AS $$
DECLARE
  v_new_user_id UUID;
BEGIN
  IF p_role NOT IN ('admin', 'user') THEN
    RAISE EXCEPTION 'Invalid role: %', p_role;
  END IF;

  v_new_user_id := gen_random_uuid();

  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  ) VALUES (
    v_new_user_id,
    '00000000-0000-0000-0000-000000000000',
    lower(p_email),
    extensions.crypt(p_password, extensions.gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', p_full_name, 'name', p_full_name),
    'authenticated',
    'authenticated',
    now(),
    now(),
    '',
    ''
  );

  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    v_new_user_id,
    v_new_user_id,
    jsonb_build_object('sub', v_new_user_id::text, 'email', lower(p_email)),
    'email',
    lower(p_email),
    now(),
    now(),
    now()
  );

  INSERT INTO public.profiles (id, email, full_name, role, status)
  VALUES (v_new_user_id, lower(p_email), p_full_name, p_role, 'active')
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    status = 'active',
    updated_at = now();

  RETURN jsonb_build_object(
    'success', true,
    'user_id', v_new_user_id,
    'email', lower(p_email),
    'role', p_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.admin_update_user_role(
  p_target_user_id UUID,
  p_new_role TEXT
)
RETURNS JSONB AS $$
BEGIN
  IF p_new_role NOT IN ('admin', 'user') THEN
    RAISE EXCEPTION 'Invalid role: %', p_new_role;
  END IF;

  UPDATE public.profiles
  SET role = p_new_role, updated_at = now()
  WHERE id = p_target_user_id;

  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.admin_update_user_status(
  p_target_user_id UUID,
  p_new_status TEXT
)
RETURNS JSONB AS $$
BEGIN
  IF p_new_status NOT IN ('active', 'suspended', 'pending') THEN
    RAISE EXCEPTION 'Invalid status: %', p_new_status;
  END IF;

  UPDATE public.profiles
  SET status = p_new_status, updated_at = now()
  WHERE id = p_target_user_id;

  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.admin_delete_user(
  p_target_user_id UUID
)
RETURNS JSONB AS $$
BEGIN
  DELETE FROM auth.users WHERE id = p_target_user_id;
  DELETE FROM public.profiles WHERE id = p_target_user_id;

  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
