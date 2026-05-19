# 🚀 Supabase 集成方案 - 3D虚拟试衣间

此文件夹包含将本项目从本地存储（LocalStorage）迁移到 Supabase 云端存储所需的所有配置和数据库模式。

## 📂 文件夹结构

- `schema.sql`: 完整建表、RLS、用户注册时自动创建 `profiles` 的触发器。
- `schema_incremental.sql`: 旧库仅需补齐 `profiles` 的 INSERT 策略与触发器时单独执行。
- `edge-functions/`: (待添加) 自定义后端逻辑。

前端在 [`supabase-config.js`](../supabase-config.js) 中填写 `SUPABASE_URL` 与 `SUPABASE_ANON_KEY`。

## 🛠️ 集成步骤

### 1. 创建 Supabase 项目
- 登录 [Supabase 控制台](https://supabase.com/dashboard)
- 创建一个新项目。

### 2. 初始化数据库
- 打开 Supabase 项目中的 **SQL Editor**。
- 复制并运行 `supabase/schema.sql` 中的所有代码。
- 这将自动创建 `profiles` (身材数据), `clothes` (衣橱单品) 和 `outfits` (搭配方案) 三张表，并启用权限保护。

### 3. 连接前端
- `index.html` 已引入 Supabase JS v2 CDN。
- 配置 `supabase-config.js` 后，登录用户会同步身材、衣橱（含新上传/商城加入的单品）与搭配方案；未登录仍使用浏览器 `localStorage`。

## 📈 迁移优势

1. **多端同步**：用户可以在不同设备上登录并查看自己的衣橱。
2. **数据安全**：云端备份，不再担心浏览器清理缓存导致数据丢失。
3. **扩展性**：支持社交功能（如分享搭配）、多人在线等。
