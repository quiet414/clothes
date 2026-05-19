/* 
  Supabase Database Schema for 3D Virtual Wardrobe App 
*/

-- 1. Profiles Table: Stores user body proportions and basic info
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    height INTEGER DEFAULT 170,
    weight INTEGER DEFAULT 60,
    shoulder INTEGER DEFAULT 42,
    chest INTEGER DEFAULT 90,
    waist INTEGER DEFAULT 70,
    hip INTEGER DEFAULT 95,
    skin_color TEXT DEFAULT '#ffdbac',
    hair_style TEXT DEFAULT 'short',
    hair_color TEXT DEFAULT '#8b4513',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Clothes Table: Stores individual items in the user's wardrobe
CREATE TABLE IF NOT EXISTS clothes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'top', 'bottom', 'dress', 'outer', 'shoes', 'accessory'
    color TEXT,
    image_url TEXT,
    brand TEXT,
    price DECIMAL(10, 2),
    source TEXT DEFAULT 'upload', -- 'upload', 'taobao'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Outfits Table: Stores saved outfit combinations
CREATE TABLE IF NOT EXISTS outfits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    top_id UUID REFERENCES clothes(id) ON DELETE SET NULL,
    bottom_id UUID REFERENCES clothes(id) ON DELETE SET NULL,
    dress_id UUID REFERENCES clothes(id) ON DELETE SET NULL,
    outer_id UUID REFERENCES clothes(id) ON DELETE SET NULL,
    shoes_id UUID REFERENCES clothes(id) ON DELETE SET NULL,
    accessory_id UUID REFERENCES clothes(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clothes ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;

-- Create Policies（先 DROP 再 CREATE，便于重复执行整份脚本）
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 新用户注册时自动创建 profiles 行（需具备权限；以 security definer 执行）
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

DROP POLICY IF EXISTS "Users can view own clothes" ON clothes;
DROP POLICY IF EXISTS "Users can insert own clothes" ON clothes;
DROP POLICY IF EXISTS "Users can update own clothes" ON clothes;
DROP POLICY IF EXISTS "Users can delete own clothes" ON clothes;
CREATE POLICY "Users can view own clothes" ON clothes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own clothes" ON clothes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own clothes" ON clothes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own clothes" ON clothes FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own outfits" ON outfits;
DROP POLICY IF EXISTS "Users can insert own outfits" ON outfits;
DROP POLICY IF EXISTS "Users can update own outfits" ON outfits;
DROP POLICY IF EXISTS "Users can delete own outfits" ON outfits;
CREATE POLICY "Users can view own outfits" ON outfits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own outfits" ON outfits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own outfits" ON outfits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own outfits" ON outfits FOR DELETE USING (auth.uid() = user_id);
