/**
 * Supabase 数据库操作封装
 */

// --- 认证相关 ---

// 1. 注册新用户
async function signUp(email, password) {
    const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
    });
    if (error) throw error;
    return data;
}

// 2. 登录用户
async function signIn(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data;
}

// 3. 注销用户
async function signOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
}

// 4. 获取当前用户
function getCurrentUser() {
    return supabaseClient.auth.getUser();
}

// 5. 监听认证状态变化
function onAuthStateChange(callback) {
    return supabaseClient.auth.onAuthStateChange(callback);
}

// --- 数据库相关 ---

// 1. 获取用户身材配置
async function fetchUserProfile(userId) {
    const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 表示未找到记录
        console.error('获取身材配置失败:', error);
        return null;
    }
    return data;
}

// 2. 更新/保存身材配置
async function upsertUserProfile(profile) {
    const { data, error } = await supabaseClient
        .from('profiles')
        .upsert(profile)
        .select();
    
    if (error) {
        console.error('保存身材配置失败:', error);
        throw error;
    }
    return data;
}

// 3. 获取衣橱数据
async function fetchUserClothes(userId) {
    const { data, error } = await supabaseClient
        .from('clothes')
        .select('*')
        .eq('user_id', userId);
    
    if (error) {
        console.error('获取衣橱数据失败:', error);
        return [];
    }
    return data;
}

// 4. 添加衣物到数据库
async function insertClothes(clothesItem) {
    const { data, error } = await supabaseClient
        .from('clothes')
        .insert([clothesItem])
        .select();
    
    if (error) {
        console.error('添加衣物失败:', error);
        throw error;
    }
    return data[0];
}

// 5. 删除衣物
async function deleteClothes(clothesId) {
    const { error } = await supabaseClient
        .from('clothes')
        .delete()
        .eq('id', clothesId);
    
    if (error) {
        console.error('删除衣物失败:', error);
        throw error;
    }
}

// 6. 获取搭配方案
async function fetchUserOutfits(userId) {
    const { data, error } = await supabaseClient
        .from('outfits')
        .select('*')
        .eq('user_id', userId);
    
    if (error) {
        console.error('获取搭配方案失败:', error);
        return [];
    }
    return data;
}

// 7. 保存搭配方案
async function insertOutfit(outfit) {
    const { data, error } = await supabaseClient
        .from('outfits')
        .insert([outfit])
        .select();
    
    if (error) {
        console.error('保存搭配方案失败:', error);
        throw error;
    }
    return data[0];
}

// 8. 删除搭配方案
async function deleteOutfitRow(outfitId) {
    const { error } = await supabaseClient
        .from('outfits')
        .delete()
        .eq('id', outfitId);

    if (error) {
        console.error('删除搭配方案失败:', error);
        throw error;
    }
}
