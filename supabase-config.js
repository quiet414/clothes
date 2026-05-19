// Supabase 连接配置：将下方占位符替换为你的 Project URL 与 anon public key
// （Supabase 控制台 → Project Settings → API）

const SUPABASE_URL = 'https://your-project-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

// 使用全局命名空间上的 createClient，避免变量名遮蔽模块对象
// @see https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
