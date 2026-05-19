/**
 * 1. 浏览器跨域兼容性处理 (解决 Vercel 静态部署后的 Supabase 跨域问题)
 * 在 Supabase 初始化之前执行，拦截并处理 fetch 请求
 */
(function() {
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        if (args[0] && typeof args[0] === 'string' && args[0].includes('supabase.co')) {
            args[1] = args[1] || {};
            args[1].headers = args[1].headers || {};
            // 强制使用 CORS 模式并包含凭据
            args[1].mode = 'cors';
            args[1].credentials = 'include';
        }
        return originalFetch.apply(this, args);
    };
})();

/**
 * 2. Supabase 初始化配置
 * 适配纯 HTML 静态项目，直接在全局作用域初始化
 */
const SUPABASE_URL = 'https://kftyfmxfsbvkiemrnybc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_x8h_9trXzHuWeVcgG_47-Q_LXbGqpZQ';

// 创建全局 supabase 客户端
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * 3. Supabase 数据库操作封装
 * 从 supabase-client.js 整合并优化
 */

// --- 认证相关 ---
async function signUp(email, password) {
    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) throw error;
    return data;
}

async function signIn(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
}

async function signOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
}

function getCurrentUser() {
    return supabaseClient.auth.getUser();
}

function onAuthStateChange(callback) {
    return supabaseClient.auth.onAuthStateChange(callback);
}

// --- 数据库相关 ---
async function fetchUserProfile(userId) {
    const { data, error } = await supabaseClient.from('profiles').select('*').eq('id', userId).single();
    if (error && error.code !== 'PGRST116') {
        console.error('获取身材配置失败:', error);
        return null;
    }
    return data;
}

async function upsertUserProfile(profile) {
    const { data, error } = await supabaseClient.from('profiles').upsert(profile).select();
    if (error) {
        console.error('保存身材配置失败:', error);
        throw error;
    }
    return data;
}

async function fetchUserClothes(userId) {
    const { data, error } = await supabaseClient.from('clothes').select('*').eq('user_id', userId);
    if (error) {
        console.error('获取衣橱数据失败:', error);
        return [];
    }
    return data;
}

async function insertClothes(clothesItem) {
    const { data, error } = await supabaseClient.from('clothes').insert([clothesItem]).select();
    if (error) {
        console.error('添加衣物失败:', error);
        throw error;
    }
    return data[0];
}

async function deleteClothesFromSupabase(clothesId) {
    const { error } = await supabaseClient.from('clothes').delete().eq('id', clothesId);
    if (error) {
        console.error('删除衣物失败:', error);
        throw error;
    }
}

async function fetchUserOutfits(userId) {
    const { data, error } = await supabaseClient.from('outfits').select('*').eq('user_id', userId);
    if (error) {
        console.error('获取搭配方案失败:', error);
        return [];
    }
    return data;
}

async function insertOutfit(outfit) {
    const { data, error } = await supabaseClient.from('outfits').insert([outfit]).select();
    if (error) {
        console.error('保存搭配方案失败:', error);
        throw error;
    }
    return data[0];
}

async function deleteOutfitRow(outfitId) {
    const { error } = await supabaseClient.from('outfits').delete().eq('id', outfitId);
    if (error) {
        console.error('删除搭配方案失败:', error);
        throw error;
    }
}

/**
 * 4. 原有 script.js 逻辑开始
 */
// 全局变量
let userProfile = {
    height: 170,
    weight: 60,
    shoulder: 42,
    chest: 90,
    waist: 70,
    hip: 95,
    skinColor: '#ffefd5',
    hairColor: '#5c3a21',
    hairStyle: 'pony'
};

let clothesCollection = [
    {
        id: 'cloth_1',
        name: '韩系chic牛仔宽腿裤',
        type: 'bottom',
        length: 'long',
        color: '#8ba4ae',
        image: 'https://kftyfmxfsbvkiemrnybc.supabase.co/storage/v1/object/public/wardrobe-images/1.jpg'
    },
    {
        id: 'cloth_2',
        name: '法式简约白衬衫',
        type: 'top',
        length: 'long',
        color: '#ffffff',
        image: 'https://kftyfmxfsbvkiemrnybc.supabase.co/storage/v1/object/public/wardrobe-images/2.jpg'
    },
    {
        id: 'cloth_3',
        name: '复古条纹衬衫',
        type: 'top',
        length: 'long',
        color: '#0b0b0bff',
        image: 'https://kftyfmxfsbvkiemrnybc.supabase.co/storage/v1/object/public/wardrobe-images/3.jpg'
    },
    {
        id: 'cloth_4',
        name: '清新夏日短袖',
        type: 'top',
        length: 'short',
        color: '#e0f7fa',
        image: 'https://kftyfmxfsbvkiemrnybc.supabase.co/storage/v1/object/public/wardrobe-images/4.jpg'
    },
    {
        id: 'cloth_5',
        name: '简约字母T恤',
        type: 'top',
        length: 'short',
        color: '#ffffff',
        image: 'https://kftyfmxfsbvkiemrnybc.supabase.co/storage/v1/object/public/wardrobe-images/5.jpg'
    },
    {
        id: 'cloth_6',
        name: '休闲牛仔短裤',
        type: 'bottom',
        length: 'short',
        color: '#bbdefb',
        image: 'https://kftyfmxfsbvkiemrnybc.supabase.co/storage/v1/object/public/wardrobe-images/6.jpg'
    },
    {
        id: 'cloth_7',
        name: '优雅百褶短裙',
        type: 'bottom',
        length: 'short',
        color: '#f8bbd0',
        image: 'https://kftyfmxfsbvkiemrnybc.supabase.co/storage/v1/object/public/wardrobe-images/7.jpg'
    },
    {
        id: 'cloth_8',
        name: '甜美碎花连衣裙',
        type: 'dress',
        length: 'short',
        color: '#ffc107',
        image: 'https://kftyfmxfsbvkiemrnybc.supabase.co/storage/v1/object/public/wardrobe-images/8.jpg'
    },
    {
        id: 'cloth_9',
        name: '温柔系针织衫',
        type: 'top',
        length: 'long',
        color: '#faaee1ff',
        image: 'https://kftyfmxfsbvkiemrnybc.supabase.co/storage/v1/object/public/wardrobe-images/9.jpg'
    },
    {
        id: 'cloth_10',
        name: '夏季运动短裤',
        type: 'bottom',
        length: 'short',
        color: '#333333',
        image: 'https://kftyfmxfsbvkiemrnybc.supabase.co/storage/v1/object/public/wardrobe-images/10.jpg'
    }
];
let savedOutfits = [];
let currentOutfit = {
    top: null,
    bottom: null,
    dress: null,
    outer: null,
    shoes: null,
    accessory: null
};

function isUuid(value) {
    if (value == null) return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value));
}

async function getSessionUserId() {
    if (typeof supabaseClient === 'undefined' || !supabaseClient) return null;
    const { data: { session } } = await supabaseClient.auth.getSession();
    return session?.user?.id ?? null;
}

function mapDbProfileToUserProfile(row) {
    return {
        height: row.height,
        weight: row.weight,
        shoulder: row.shoulder,
        chest: row.chest,
        waist: row.waist,
        hip: row.hip,
        skinColor: row.skin_color || '#ffefd5',
        hairColor: row.hair_color || '#5c3a21',
        hairStyle: row.hair_style || 'pony'
    };
}

function mapUserProfileToDbRow(userId, p) {
    return {
        id: userId,
        height: p.height,
        weight: p.weight,
        shoulder: p.shoulder,
        chest: p.chest,
        waist: p.waist,
        hip: p.hip,
        skin_color: p.skinColor,
        hair_color: p.hairColor,
        hair_style: p.hairStyle,
        updated_at: new Date().toISOString()
    };
}

function mapClothesRowToItem(row) {
    return {
        id: row.id,
        type: row.type,
        name: row.name,
        color: row.color || '#000000',
        image: row.image_url || '',
        brand: row.brand,
        price: row.price != null ? Number(row.price) : undefined,
        source: row.source || 'upload',
        dateAdded: row.created_at
    };
}

function clothesItemToDbInsert(item, userId) {
    return {
        user_id: userId,
        name: item.name,
        type: item.type,
        color: item.color || null,
        image_url: item.image || null,
        brand: item.brand || null,
        price: item.price != null ? item.price : null,
        source: item.source || 'upload'
    };
}

function hydrateOutfitFromRow(o) {
    const find = (id) => {
        if (!id) return null;
        const sid = String(id);
        return clothesCollection.find(c => String(c.id) === sid) || null;
    };
    return {
        id: o.id,
        name: o.name,
        items: {
            top: find(o.top_id),
            bottom: find(o.bottom_id),
            dress: find(o.dress_id),
            outer: find(o.outer_id),
            shoes: find(o.shoes_id),
            accessory: find(o.accessory_id)
        },
        dateCreated: o.created_at
    };
}

function persistLocalCache() {
    localStorage.setItem('wardrobe-userProfile', JSON.stringify(userProfile));
    localStorage.setItem('wardrobe-clothesCollection', JSON.stringify(clothesCollection));
    localStorage.setItem('wardrobe-savedOutfits', JSON.stringify(savedOutfits));
}

function loadGuestDataFromLocalStorage() {
    const savedProfileStr = localStorage.getItem('wardrobe-userProfile');
    const savedClothesStr = localStorage.getItem('wardrobe-clothesCollection');
    const savedOutfitsStr = localStorage.getItem('wardrobe-savedOutfits');
    if (savedProfileStr) {
        userProfile = { ...userProfile, ...JSON.parse(savedProfileStr) };
    }
    if (savedClothesStr) clothesCollection = JSON.parse(savedClothesStr);
    if (savedOutfitsStr) savedOutfits = JSON.parse(savedOutfitsStr);
}

async function loadUserDataFromSupabase(userId) {
    const remoteProfile = await fetchUserProfile(userId);
    if (remoteProfile) {
        userProfile = { ...userProfile, ...mapDbProfileToUserProfile(remoteProfile) };
    }
    const remoteClothes = await fetchUserClothes(userId);
    clothesCollection = (remoteClothes || []).map(mapClothesRowToItem);
    const remoteOutfits = await fetchUserOutfits(userId);
    savedOutfits = (remoteOutfits || []).map(hydrateOutfitFromRow);
    persistLocalCache();
}

async function syncPendingClothesToSupabase(userId) {
    if (typeof insertClothes !== 'function') return;
    for (let i = 0; i < clothesCollection.length; i++) {
        const item = clothesCollection[i];
        if (isUuid(String(item.id))) continue;
        const inserted = await insertClothes(clothesItemToDbInsert(item, userId));
        const oldId = item.id;
        item.id = inserted.id;
        if (inserted.image_url) item.image = inserted.image_url;
        for (const slot of ['top', 'bottom', 'dress', 'outer', 'shoes', 'accessory']) {
            const worn = currentOutfit[slot];
            if (worn && String(worn.id) === String(oldId)) {
                currentOutfit[slot] = item;
            }
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', async function() {
    await loadFromLocalStorage();
    initializeApp();
    setupEventListeners();
    initAuth();
});

function initAuth() {
    if (typeof onAuthStateChange !== 'function') return;
    onAuthStateChange(async (event, session) => {
        const loginBtn = document.getElementById('login-btn');
        const userInfo = document.getElementById('user-info');
        const userEmail = document.getElementById('user-email');

        if (session) {
            loginBtn.style.display = 'none';
            userInfo.style.display = 'flex';
            userEmail.textContent = session.user.email;
        } else {
            loginBtn.style.display = 'block';
            userInfo.style.display = 'none';
            userEmail.textContent = '';
        }

        await loadFromLocalStorage();
    });
}

// 认证相关函数
function openAuthModal() {
    openModal('auth-modal');
}

function switchAuthTab(tab) {
    const tabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (tab === 'login') {
        tabs[0].classList.add('active');
        tabs[1].classList.remove('active');
        loginForm.style.display = 'flex';
        registerForm.style.display = 'none';
    } else {
        tabs[0].classList.remove('active');
        tabs[1].classList.add('active');
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        await signIn(email, password);
        showNotification('登录成功！');
        closeModal('auth-modal');
    } catch (error) {
        showNotification('登录失败: ' + error.message, 'error');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (password !== confirmPassword) {
        showNotification('两次输入的密码不一致！', 'error');
        return;
    }

    try {
        await signUp(email, password);
        showNotification('注册成功！请检查邮箱确认。');
        closeModal('auth-modal');
    } catch (error) {
        showNotification('注册失败: ' + error.message, 'error');
    }
}

async function handleLogout() {
    try {
        await signOut();
        showNotification('已成功退出登录');
    } catch (error) {
        showNotification('退出失败: ' + error.message, 'error');
    }
}

// --- 页面导航系统 ---

function navigateTo(pageId) {
    // 1. 定义所有页面区域
    const sections = {
        'wardrobe': ['.avatar-section', '.wardrobe-section'],
        'outfits': ['#outfits-section'],
        'recommendations': ['#recommendations-section'],
        'profile': ['#personal-center-section'],
        'weather': ['#today-outfit-section'],
        'calendar': ['#calendar-section']
    };

    // 2. 隐藏所有区域
    Object.values(sections).flat().forEach(selector => {
        const el = selector.startsWith('#') ? document.getElementById(selector.substring(1)) : document.querySelector(selector);
        if (el) el.style.display = 'none';
    });

    // 3. 显示目标页面区域
    if (sections[pageId]) {
        sections[pageId].forEach(selector => {
            const el = selector.startsWith('#') ? document.getElementById(selector.substring(1)) : document.querySelector(selector);
            if (el) el.style.display = 'block';
            
            // 特殊处理：如果是 3D 区域，确保其父容器 grid 正确
            if (pageId === 'wardrobe') {
                const mainContent = document.querySelector('.main-content');
                if (mainContent) mainContent.style.display = 'grid';
            } else {
                const mainContent = document.querySelector('.main-content');
                if (mainContent) mainContent.style.display = 'block';
            }
        });
    }

    // 4. 更新导航按钮状态
    const navButtons = {
        'wardrobe': '.btn-secondary',
        'outfits': '.btn-accent',
        'recommendations': '.btn-recommend',
        'profile': '.btn-profile',
        'weather': '.btn-weather',
        'calendar': '.btn-calendar'
    };

    const actions = document.querySelector('.header-actions');
    if (actions) {
        actions.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
        if (navButtons[pageId]) {
            const activeBtn = actions.querySelector(navButtons[pageId]);
            if (activeBtn) activeBtn.classList.add('active');
        }
    }

    // 5. 触发对应页面的渲染逻辑
    if (pageId === 'outfits') renderOutfitsGrid();
    if (pageId === 'recommendations') renderRecommendations();
    if (pageId === 'wardrobe') renderClothesGrid();
    if (pageId === 'profile') renderPersonalCenter();
    if (pageId === 'weather') renderTodayOutfit();
    if (pageId === 'calendar') renderOutfitCalendar();
}

function showWardrobe() {
    navigateTo('wardrobe');
}

function showOutfits() {
    navigateTo('outfits');
}

function showRecommendations() {
    navigateTo('recommendations');
}

function showPersonalCenter() {
    navigateTo('profile');
}

function showTodayOutfit() {
    navigateTo('weather');
}

function showOutfitCalendar() {
    navigateTo('calendar');
}

// 穿搭日历逻辑
let currentCalendarDate = new Date();
let outfitLogs = JSON.parse(localStorage.getItem('wardrobe-outfitLogs') || '{}');
let selectedLogDate = null;

function renderOutfitCalendar() {
    const grid = document.getElementById('calendar-days');
    const monthDisplay = document.getElementById('current-month-display');
    const todayDateText = document.getElementById('today-date-text');
    
    // 更新今日日期文本
    const today = new Date();
    todayDateText.textContent = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    monthDisplay.textContent = `${year}年${month + 1}月`;
    
    grid.innerHTML = '';
    
    // 获取当月第一天是周几
    const firstDay = new Date(year, month, 1).getDay();
    // 获取当月最后一天
    const lastDate = new Date(year, month + 1, 0).getDate();
    // 获取上个月最后一天
    const prevLastDate = new Date(year, month, 0).getDate();
    
    // 填充上个月末尾
    for (let i = firstDay; i > 0; i--) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day other-month';
        dayDiv.innerHTML = `<span class="day-number">${prevLastDate - i + 1}</span>`;
        grid.appendChild(dayDiv);
    }
    
    // 填充当月
    for (let i = 1; i <= lastDate; i++) {
        const dateKey = `${year}-${month + 1}-${i}`;
        const log = outfitLogs[dateKey];
        const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === i;
        
        const dayDiv = document.createElement('div');
        dayDiv.className = `calendar-day ${isToday ? 'today' : ''}`;
        
        let content = `<span class="day-number">${i}</span>`;
        
        if (log) {
            if (log.image) {
                content += `<img src="${log.image}" class="day-preview-img">`;
            }
            content += `<span class="has-log-indicator" title="${log.style}">${getStyleEmoji(log.style)}</span>`;
        }
        
        dayDiv.innerHTML = content;
        dayDiv.onclick = () => openOutfitLogModal(new Date(year, month, i));
        grid.appendChild(dayDiv);
    }
}

function getStyleEmoji(style) {
    const emojis = {
        '通勤': '💼',
        '休闲': '☕',
        '约会': '💖',
        '运动': '👟',
        '优雅': '👗',
        '街头': '🛹'
    };
    return emojis[style] || '✨';
}

function changeMonth(delta) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + delta);
    renderOutfitCalendar();
}

function openOutfitLogModal(date) {
    selectedLogDate = date;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dateKey = `${year}-${month}-${day}`;
    
    const modal = document.getElementById('outfit-log-modal');
    const title = document.getElementById('log-modal-title');
    const noteInput = document.getElementById('log-note-input');
    const preview = document.getElementById('log-image-preview');
    const deleteBtn = document.getElementById('delete-log-btn');
    const styleInput = document.getElementById('selected-style-input');
    
    title.textContent = `${year}年${month}月${day}日 穿搭记录`;
    
    // 重置表单
    noteInput.value = '';
    preview.innerHTML = '<span>📸 点击上传今日美照</span>';
    deleteBtn.style.display = 'none';
    styleInput.value = '';
    document.querySelectorAll('.style-options-chips .chip').forEach(c => c.classList.remove('active'));
    
    // 如果已有记录则填充
    const log = outfitLogs[dateKey];
    if (log) {
        noteInput.value = log.note || '';
        if (log.image) {
            preview.innerHTML = `<img src="${log.image}">`;
        }
        if (log.style) {
            styleInput.value = log.style;
            document.querySelectorAll('.style-options-chips .chip').forEach(c => {
                if (c.textContent === log.style) c.classList.add('active');
            });
        }
        deleteBtn.style.display = 'block';
    }
    
    openModal('outfit-log-modal');
}

function selectStyleChip(chip) {
    document.querySelectorAll('.style-options-chips .chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    document.getElementById('selected-style-input').value = chip.textContent;
}

function triggerLogImageUpload() {
    document.getElementById('log-image-input').click();
}

function handleLogImageSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('log-image-preview').innerHTML = `<img src="${e.target.result}">`;
        };
        reader.readAsDataURL(file);
    }
}

function saveOutfitLog() {
    if (!selectedLogDate) return;
    
    const year = selectedLogDate.getFullYear();
    const month = selectedLogDate.getMonth() + 1;
    const day = selectedLogDate.getDate();
    const dateKey = `${year}-${month}-${day}`;
    
    const style = document.getElementById('selected-style-input').value;
    const note = document.getElementById('log-note-input').value;
    const imgElement = document.querySelector('#log-image-preview img');
    const image = imgElement ? imgElement.src : null;
    
    if (!style && !note && !image) {
        showNotification('请至少填写一项内容哦', 'warning');
        return;
    }
    
    outfitLogs[dateKey] = { style, note, image };
    localStorage.setItem('wardrobe-outfitLogs', JSON.stringify(outfitLogs));
    
    showNotification('穿搭记录已保存！');
    closeModal('outfit-log-modal');
    renderOutfitCalendar();
}

function deleteOutfitLog() {
    if (!selectedLogDate || !confirm('确定要删除这条记录吗？')) return;
    
    const dateKey = `${selectedLogDate.getFullYear()}-${selectedLogDate.getMonth() + 1}-${selectedLogDate.getDate()}`;
    delete outfitLogs[dateKey];
    localStorage.setItem('wardrobe-outfitLogs', JSON.stringify(outfitLogs));
    
    showNotification('记录已删除');
    closeModal('outfit-log-modal');
    renderOutfitCalendar();
}

// 今日天气逻辑
async function renderTodayOutfit() {
    const weatherCard = document.getElementById('weather-card');
    weatherCard.classList.add('loading-state');

    try {
        // 1. 获取地理位置
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;

        // 2. 获取天气数据 (使用 OpenWeatherMap API)
        // 注意：这里由于是演示，如果用户没有配置 API Key，我们会提供模拟数据
        const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // 提醒用户替换
        let weatherData;

        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=zh_cn&appid=${API_KEY}`);
            if (!response.ok) throw new Error('API Key 无效或请求失败');
            weatherData = await response.json();
        } catch (e) {
            console.warn('天气 API 请求失败，切换至模拟数据:', e);
            weatherData = getMockWeatherData();
        }

        // 3. 更新 UI
        updateWeatherUI(weatherData);
        generateOutfitRecommendation(weatherData);

    } catch (error) {
        console.error('获取天气失败:', error);
        showNotification('无法获取天气，已加载模拟数据', 'warning');
        const mockData = getMockWeatherData();
        updateWeatherUI(mockData);
        generateOutfitRecommendation(mockData);
    } finally {
        weatherCard.classList.remove('loading-state');
    }
}

function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('浏览器不支持地理定位'));
        }
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

function getMockWeatherData() {
    return {
        name: '北京市',
        main: { temp: 24, humidity: 45 },
        weather: [{ description: '晴', icon: '01d', main: 'Clear' }],
        wind: { speed: 3.2 }
    };
}

function updateWeatherUI(data) {
    document.getElementById('current-temp').textContent = Math.round(data.main.temp);
    document.getElementById('weather-desc').textContent = data.weather[0].description;
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('weather-humidity').textContent = `湿度: ${data.main.humidity}%`;
    document.getElementById('weather-wind').textContent = `风速: ${data.wind.speed}m/s`;
    
    const icon = document.getElementById('weather-icon');
    icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    icon.style.display = 'block';
}

function generateOutfitRecommendation(data) {
    const temp = data.main.temp;
    const weatherMain = data.weather[0].main;
    const desc = data.weather[0].description;
    
    let advice = "";
    let items = [];

    // 温度逻辑
    if (temp >= 26) {
        advice = `今天 ${Math.round(temp)}℃ 比较炎热，推荐清爽透气的穿搭。`;
        items = [
            { icon: '👕', title: '上衣', desc: '短袖 T 恤 / 吊带' },
            { icon: '🩳', title: '下装', desc: '短裤 / 短裙' },
            { icon: '👟', title: '鞋子', desc: '凉鞋 / 透气网面鞋' },
            { icon: '👒', title: '配饰', desc: '遮阳帽 / 墨镜' }
        ];
    } else if (temp >= 18) {
        advice = `今天 ${Math.round(temp)}℃ 气候宜人，适合简约舒适的装扮。`;
        items = [
            { icon: '👔', title: '上衣', desc: '长袖衬衫 / 薄卫衣' },
            { icon: '👖', title: '下装', desc: '牛仔裤 / 休闲长裤' },
            { icon: '🧥', title: '外套', desc: '薄款开衫 / 棒球服' },
            { icon: '👟', title: '鞋子', desc: '帆布鞋 / 运动鞋' }
        ];
    } else if (temp >= 10) {
        advice = `今天 ${Math.round(temp)}℃ 体感偏凉，注意叠穿保暖。`;
        items = [
            { icon: '🧶', title: '内搭', desc: '针织衫 / 打底毛衣' },
            { icon: '🧥', title: '外套', desc: '风衣 / 牛仔外套' },
            { icon: '👖', title: '下装', desc: '厚款长裤 + 薄袜' },
            { icon: '🥾', title: '鞋子', desc: '乐福鞋 / 短靴' }
        ];
    } else if (temp >= 0) {
        advice = `今天 ${Math.round(temp)}℃ 天气寒冷，请穿上厚实的冬装。`;
        items = [
            { icon: '🧣', title: '上衣', desc: '厚毛衣 / 加绒卫衣' },
            { icon: '🧥', title: '外套', desc: '呢大衣 / 轻便羽绒服' },
            { icon: '👖', title: '下装', desc: '保暖裤 / 加绒牛仔裤' },
            { icon: '🧤', title: '配饰', desc: '围巾 / 毛线帽' }
        ];
    } else {
        advice = `今天 ${Math.round(temp)}℃ 严寒天气，请务必全副武装保暖！`;
        items = [
            { icon: '🧥', title: '外套', desc: '加厚羽绒服 / 派克服' },
            { icon: '🔥', title: '内搭', desc: '保暖内衣 + 羊绒衫' },
            { icon: '👖', title: '下装', desc: '加绒保暖裤 + 羊毛袜' },
            { icon: '👢', title: '鞋子', desc: '雪地靴 / 防滑棉鞋' }
        ];
    }

    // 天气状况逻辑补充
    if (weatherMain === 'Rain' || weatherMain === 'Drizzle') {
        advice += " 雨天路滑，建议携带雨具并穿着防水鞋服。☔";
    } else if (weatherMain === 'Clear' && temp > 20) {
        advice += " 阳光明媚，紫外线较强，记得做好防晒。☀️";
    } else if (data.wind.speed > 8) {
        advice += " 风力较大，建议穿着防风效果好的外套。💨";
    }

    // 渲染文案
    document.getElementById('ai-outfit-text').textContent = advice;

    // 渲染卡片
    const grid = document.getElementById('outfit-cards-grid');
    grid.innerHTML = items.map(item => `
        <div class="outfit-rec-card">
            <span class="rec-card-icon">${item.icon}</span>
            <span class="rec-card-title">${item.title}</span>
            <p class="rec-card-desc">${item.desc}</p>
        </div>
    `).join('');
}

function toggleForecast() {
    const content = document.getElementById('forecast-content');
    const isHidden = content.style.display === 'none';
    
    if (isHidden) {
        renderForecast();
        content.style.display = 'grid';
    } else {
        content.style.display = 'none';
    }
}

function renderForecast() {
    const container = document.getElementById('forecast-content');
    const today = new Date();
    
    const mockForecast = [
        { date: '明天', temp: '22~26', desc: '晴转多云' },
        { date: '后天', temp: '19~24', desc: '小雨' },
        { date: '大后天', temp: '18~22', desc: '阴' }
    ];

    container.innerHTML = mockForecast.map(f => `
        <div class="forecast-item">
            <span class="forecast-date">${f.date}</span>
            <span class="forecast-temp">${f.temp}°C</span>
            <span class="forecast-desc">${f.desc}</span>
        </div>
    `).join('');
}

function showProfile() {
    openBodySettings();
}

function openBodySettings() {
    // 每次打开弹窗前，先确保 UI 与当前的 userProfile 同步
    syncProfileToUI();
    openModal('body-settings-modal');
}

// 个人中心逻辑
function renderPersonalCenter() {
    // 1. 用户基本信息
    const nicknameEl = document.getElementById('profile-nickname');
    const statusEl = document.getElementById('profile-status');
    
    nicknameEl.textContent = userProfile.nickname || '可爱衣橱主';
    getSessionUserId().then(userId => {
        if (userId) {
            statusEl.textContent = '在线同步模式 (数据已加密备份)';
            statusEl.style.color = 'var(--primary-color)';
        } else {
            statusEl.textContent = '本地模式 (登录以同步数据)';
            statusEl.style.color = 'var(--text-secondary)';
        }
    });

    // 2. 身材数据填充
    const bodyDataContainer = document.getElementById('body-data-display');
    const bodyFields = [
        { label: '身高', key: 'height', unit: 'cm' },
        { label: '体重', key: 'weight', unit: 'kg' },
        { label: '肩宽', key: 'shoulder', unit: 'cm' },
        { label: '胸围', key: 'chest', unit: 'cm' },
        { label: '腰围', key: 'waist', unit: 'cm' },
        { label: '臀围', key: 'hip', unit: 'cm' }
    ];

    bodyDataContainer.innerHTML = bodyFields.map(field => `
        <div class="data-item" onclick="editProfileField('${field.key}', '${field.label}')">
            <span class="data-label">${field.label}</span>
            <span class="data-value">${userProfile[field.key]}${field.unit}</span>
        </div>
    `).join('');

    // 3. 衣橱统计
    document.getElementById('total-clothes-count').textContent = clothesCollection.length;
    document.getElementById('saved-outfits-count').textContent = savedOutfits.length;

    const categories = {
        'top': '上衣',
        'bottom': '下装',
        'dress': '连衣裙',
        'outer': '外套',
        'shoes': '鞋子',
        'accessory': '配饰'
    };

    const categoryList = document.getElementById('category-stats-list');
    categoryList.innerHTML = Object.entries(categories).map(([type, label]) => {
        const count = clothesCollection.filter(c => c.type === type).length;
        return `
            <div class="cat-stat-item">
                <span class="cat-name">${label}</span>
                <span class="cat-count">${count} 件</span>
            </div>
        `;
    }).join('');

    // 4. 风格偏好渲染
    renderStyleTags();

    // 5. 闲置提醒 (模拟逻辑：如果没有记录日期，随机显示0-2)
    const idleCount = clothesCollection.length > 0 ? Math.floor(Math.random() * 3) : 0;
    document.getElementById('idle-count').textContent = idleCount;
}

function renderStyleTags() {
    const tagsContainer = document.getElementById('style-tags');
    const styles = userProfile.stylePreferences || ['甜美', '简约'];
    
    tagsContainer.innerHTML = styles.map(style => `
        <span class="style-tag">${style}</span>
    `).join('') + '<span class="style-tag" onclick="editStylePreference()">+ 添加风格</span>';
}

function editStylePreference() {
    const newStyle = prompt('输入你喜欢的穿搭风格：');
    if (newStyle) {
        if (!userProfile.stylePreferences) userProfile.stylePreferences = ['甜美', '简约'];
        userProfile.stylePreferences.push(newStyle);
        persistLocalCache();
        renderStyleTags();
    }
}

function editProfileField(key, label) {
    const newVal = prompt(`修改${label}:`, userProfile[key]);
    if (newVal !== null && !isNaN(newVal)) {
        userProfile[key] = Number(newVal);
        persistLocalCache();
        renderPersonalCenter();
        updateAvatarDisplay(); // 同步3D模型
        showNotification(`${label} 已更新！`);
    }
}

function exportData() {
    const data = {
        profile: userProfile,
        clothes: clothesCollection,
        outfits: savedOutfits,
        exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-wardrobe-backup-${new Date().toLocaleDateString()}.json`;
    a.click();
    showNotification('数据备份文件已生成并开始下载');
}

function openPreferences() {
    showNotification('偏好设置功能即将上线 🌸');
}

// 达人穿搭数据
const recommendationData = [
    {
        id: 'rec_1',
        title: '韩系Chic街头风',
        style: 'chic',
        image: 'https://kftyfmxfsbvkiemrnybc.supabase.co/storage/v1/object/public/wardrobe-images/3.jpg',
        tags: ['简约', '显瘦', '韩系'],
        items: [
            { type: 'top', name: '黑色正肩T恤', color: '#000000' },
            { type: 'bottom', name: '灰色软糯长裙', color: '#808080' }
        ]
    },
    {
        id: 'rec_2',
        title: '法式优雅穿搭',
        style: 'elegant',
        image: 'https://kftyfmxfsbvkiemrnybc.supabase.co/storage/v1/object/public/wardrobe-images/4.jpg',
        tags: ['气质', '优雅', '长裙'],
        items: [
            { type: 'top', name: '黑色正肩T恤', color: '#000000' },
            { type: 'bottom', name: '米色高腰长裙', color: '#F5F5DC' }
        ]
    },
    {
        id: 'rec_3',
        title: '多巴胺甜美风',
        style: 'dopamine',
        image: 'https://kftyfmxfsbvkiemrnybc.supabase.co/storage/v1/object/public/wardrobe-images/5.jpg',
        tags: ['亮色', '针织', '碎花'],
        items: [
            { type: 'top', name: '白色吊带', color: '#FFFFFF' },
            { type: 'outer', name: '湖蓝色针织开衫', color: '#00CED1' },
            { type: 'bottom', name: '蝴蝶结鱼尾裙', color: '#F5F5F5' }
        ]
    },
    {
        id: 'rec_4',
        title: '韩系温柔风',
        style: 'chic',
        image: 'https://kftyfmxfsbvkiemrnybc.supabase.co/storage/v1/object/public/wardrobe-images/6.jpg',
        tags: ['温柔', '针织', '气质'],
        items: [
            { type: 'top', name: '白色吊带', color: '#FFFFFF' },
            { type: 'outer', name: '粉色针织开衫', color: '#FFB6C1' },
            { type: 'bottom', name: '碎花长裙', color: '#FFF0F5' }
        ]
    },
    {
        id: 'rec_5',
        title: '法式浪漫穿搭',
        style: 'elegant',
        image: 'https://kftyfmxfsbvkiemrnybc.supabase.co/storage/v1/object/public/wardrobe-images/7.jpg',
        tags: ['法式', '浪漫', '优雅'],
        items: [
            { type: 'dress', name: '法式碎花裙', color: '#FFF5F5' }
        ]
    },
    {
        id: 'rec_6',
        title: '清新甜美风',
        style: 'dopamine',
        image: 'https://kftyfmxfsbvkiemrnybc.supabase.co/storage/v1/object/public/wardrobe-images/8.jpg',
        tags: ['清新', '甜美', '夏日'],
        items: [
            { type: 'top', name: '清新短袖', color: '#FFFFFF', length: 'short' },
            { type: 'bottom', name: '甜美短裙', color: '#FFB6C1', length: 'short' }
        ]
    },
    {
        id: 'rec_7',
        title: '简约学院风',
        style: 'chic',
        image: 'https://kftyfmxfsbvkiemrnybc.supabase.co/storage/v1/object/public/wardrobe-images/11.jpg',
        tags: ['学院', '简约', '百搭'],
        items: [
            { type: 'top', name: '学院风衬衫', color: '#FFFFFF', length: 'long' },
            { type: 'bottom', name: '百褶裙', color: '#000000', length: 'short' }
        ]
    }
];

let currentStyleFilter = 'all';

function filterStyle(style) {
    currentStyleFilter = style;
    
    // 更新按钮状态
    const buttons = document.querySelectorAll('.style-btn');
    buttons.forEach(btn => {
        if (btn.textContent.toLowerCase().includes(style) || (style === 'all' && btn.textContent === '全部')) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    renderRecommendations();
}

function renderRecommendations() {
    const grid = document.getElementById('recommendations-grid');
    grid.innerHTML = '';
    
    const filtered = currentStyleFilter === 'all' 
        ? recommendationData 
        : recommendationData.filter(r => r.style === currentStyleFilter);
        
    filtered.forEach(rec => {
        const card = document.createElement('div');
        card.className = 'recommend-card';
        card.innerHTML = `
            <div class="recommend-image">
                <img src="${rec.image}" alt="${rec.title}">
                <div class="recommend-overlay">
                    <div class="recommend-title">${rec.title}</div>
                    <div class="recommend-style">${rec.style.toUpperCase()} STYLE</div>
                </div>
            </div>
            <div class="recommend-info">
                <div class="recommend-tags">
                    ${rec.tags.map(tag => `<span class="recommend-tag"># ${tag}</span>`).join('')}
                </div>
                <div class="recommend-actions">
                    <button class="btn-try-now" onclick="tryRecommendOutfit('${rec.id}')">✨ 试穿这套</button>
                    <button class="btn-save-fav" onclick="saveToFav('${rec.id}')">🤍 收藏</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function tryRecommendOutfit(recId) {
    const rec = recommendationData.find(r => r.id === recId);
    if (!rec) return;
    
    // 切换到试衣间
    showWardrobe();
    
    // 先脱掉所有当前衣物，确保推荐穿搭效果最佳
    Object.keys(currentOutfit).forEach(type => {
        if (currentOutfit[type]) {
            if (typeof removeClothes3D === 'function') {
                removeClothes3D(type);
            }
            currentOutfit[type] = null;
        }
    });
    
    // 模拟试穿推荐衣物
    rec.items.forEach(item => {
        const tempItem = {
            id: 'rec_item_' + Math.random(),
            type: item.type,
            name: item.name,
            color: item.color,
            length: item.length || 'long', // 确保传递长度属性，默认为 long
            image: rec.image // 使用推荐图作为临时预览图
        };
        if (typeof tryOnClothes3D === 'function') {
            tryOnClothes3D(tempItem);
        }
        currentOutfit[item.type] = tempItem;
    });
    
    updateAvatarDisplay();
    renderClothesGrid();
    showNotification(`已为您试穿：${rec.title}`);
}

function saveToFav(recId) {
    showNotification('已加入我的收藏！');
}

// 修改初始化，确保第一个选中的是“我的衣服”
function initializeApp() {
    console.log('衣橱App初始化完成');
    updateAvatarDisplay();
    
    // 默认进入试衣间/衣橱页面
    showWardrobe();

    // 初始化3D Avatar（如果浏览器支持）
    if (typeof initAvatar3D === 'function') {
        setTimeout(initAvatar3D, 500);
    }
}

function setupEventListeners() {
    // 身材参数滑块事件
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
        slider.addEventListener('input', function() {
            const valueDisplay = document.getElementById(this.id + '-value');
            if (valueDisplay) {
                valueDisplay.textContent = this.value;
            }
        });
    });

    // 文件输入事件
    const fileInput = document.getElementById('file-input');
    fileInput.addEventListener('change', handleFileSelect);
}

// 模态框控制函数
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// 点击模态框外部关闭
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// 身材设置功能
function updateProfileFromUI() {
    // 1. 从 DOM 获取所有数值
    const height = parseInt(document.getElementById('height').value);
    const weight = parseInt(document.getElementById('weight').value);
    const shoulder = parseInt(document.getElementById('shoulder').value);
    const chest = parseInt(document.getElementById('chest').value);
    const waist = parseInt(document.getElementById('waist').value);
    const hip = parseInt(document.getElementById('hip').value);
    
    const skinColor = document.getElementById('skinColor').value;
    const hairColor = document.getElementById('hairColor').value;
    const hairStyle = document.getElementById('hairStyle').value;

    // 2. 更新全局状态 userProfile
    userProfile = {
        ...userProfile,
        height, weight, shoulder, chest, waist, hip,
        skinColor, hairColor, hairStyle
    };

    // 3. 实时更新滑块数值显示文本
    const params = ['height', 'weight', 'shoulder', 'chest', 'waist', 'hip'];
    params.forEach(param => {
        const display = document.getElementById(param + '-value');
        if (display) display.textContent = userProfile[param];
    });

    // 4. 同步更新 3D 模型
    if (typeof updateAvatar3DProportions === 'function') {
        updateAvatar3DProportions(userProfile);
    }
    
    // 同时更新 2D 预览状态
    updateAvatarDisplay();
}

async function saveBodySettings() {
    updateProfileFromUI();
    await saveToLocalStorage();
    closeModal('body-settings-modal');
    showNotification('身材与外观设置已保存');
}

// 更新3D小人显示
function updateAvatarDisplay() {
    const avatarDisplay = document.getElementById('avatar-display');
    const placeholder = avatarDisplay.querySelector('.avatar-placeholder');
    const overlay = document.getElementById('avatar-2d-overlay');

    // 清空2D预览层
    if (overlay) overlay.innerHTML = '';

    if (currentOutfit.top || currentOutfit.bottom || currentOutfit.dress) {
        // 显示穿着效果文本
        placeholder.innerHTML = `
            <span>👗</span>
            <p>当前搭配</p>
            <div class="outfit-summary">
                ${currentOutfit.top ? '<div>👕 上衣</div>' : ''}
                ${currentOutfit.bottom ? '<div>👖 下装</div>' : ''}
                ${currentOutfit.dress ? '<div>👗 连衣裙</div>' : ''}
                ${currentOutfit.outer ? '<div>🧥 外套</div>' : ''}
                ${currentOutfit.shoes ? '<div>👠 鞋子</div>' : ''}
                ${currentOutfit.accessory ? '<div>👜 配饰</div>' : ''}
            </div>
        `;

        // 渲染2D预览图片
        if (overlay) {
            // 按照层级顺序渲染：鞋子 -> 下装 -> 上衣 -> 连衣裙 (套装) -> 外套 -> 配饰
            const slots = ['shoes', 'bottom', 'top', 'dress', 'outer', 'accessory'];
            slots.forEach(slot => {
                const item = currentOutfit[slot];
                if (item && item.image) {
                    const img = document.createElement('img');
                    img.src = item.image;
                    img.className = `avatar-2d-image avatar-2d-${slot}`;
                    overlay.appendChild(img);
                }
            });
        }
    } else {
        // 显示默认状态
        placeholder.innerHTML = `
            <span>👤</span>
            <p>点击设置身材参数</p>
            <div class="body-stats">
                <small>身高: ${userProfile.height}cm</small><br>
                <small>体重: ${userProfile.weight}kg</small>
            </div>
        `;
    }
}

// 衣服管理功能
function uploadClothes() {
    openModal('upload-modal');
}

function takePhoto() {
    const fileInput = document.getElementById('file-input');
    fileInput.setAttribute('capture', 'environment');
    fileInput.click();
}

function selectFile() {
    const fileInput = document.getElementById('file-input');
    fileInput.removeAttribute('capture');
    fileInput.click();
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('image-preview');
            preview.innerHTML = `<img src="${e.target.result}" alt="预览" style="max-width: 100%; max-height: 200px; object-fit: contain; border-radius: 8px;">`;
            // 将 base64 数据存储在 input 的 data 属性中，方便后续读取
            document.getElementById('file-input').dataset.preview = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function saveClothes() {
    const fileInput = document.getElementById('file-input');
    const typeEl = document.getElementById('clothes-type');
    const lengthEl = document.getElementById('clothes-length');
    const nameEl = document.getElementById('clothes-name');
    const colorEl = document.getElementById('clothes-color');
    
    if (!typeEl || !nameEl || !colorEl) {
        console.error('无法找到必要的表单元素');
        showNotification('系统错误：无法找到表单元素，请刷新页面重试', 'error');
        return;
    }

    const type = typeEl.value;
    const length = lengthEl ? lengthEl.value : 'long'; // 防御性处理：如果找不到长度选择框，默认为 long
    const name = nameEl.value.trim() || '未命名';
    const color = colorEl.value;
    const previewData = fileInput.dataset.preview;

    if (!previewData && fileInput.files.length === 0) {
        showNotification('请先选择或拍摄图片！', 'error');
        return;
    }

    // 定义保存逻辑
    const performSave = async (imageData) => {
        const newClothes = {
            id: 'cloth_' + Date.now(),
            type: type,
            length: length,
            name: name,
            color: color,
            image: imageData,
            dateAdded: new Date().toISOString()
        };

        clothesCollection.push(newClothes);
        await saveToLocalStorage();
        renderClothesGrid();

        // 重置表单
        fileInput.value = '';
        delete fileInput.dataset.preview;
        document.getElementById('clothes-name').value = '';
        document.getElementById('image-preview').innerHTML = '<div class="preview-placeholder">图片预览</div>';

        closeModal('upload-modal');
        showNotification('衣服已成功添加到衣橱！');
    };

    if (previewData) {
        // 如果已经有预览图数据（说明 FileReader 已经读过了），直接使用
        performSave(previewData);
    } else {
        // 否则重新读取（兜底逻辑）
        const reader = new FileReader();
        reader.onload = function(e) {
            performSave(e.target.result);
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
}

// 渲染衣服网格
let currentFilter = 'all';

function filterClothes(category) {
    currentFilter = category;

    // 更新按钮状态
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    renderClothesGrid();
}

function renderClothesGrid() {
    const grid = document.getElementById('clothes-grid');
    const addNewItem = document.createElement('div');
    addNewItem.className = 'clothes-item add-new';
    addNewItem.onclick = uploadClothes;
    addNewItem.innerHTML = `
        <div class="add-icon">+</div>
        <p>添加新衣服</p>
    `;

    // 清空现有内容
    grid.innerHTML = '';

    // 筛选衣服
    const filteredClothes = currentFilter === 'all'
        ? clothesCollection
        : clothesCollection.filter(c => c.type === currentFilter);

    // 添加现有的衣服
    filteredClothes.forEach(clothes => {
        const item = document.createElement('div');
        const isWearing = currentOutfit[clothes.type] && currentOutfit[clothes.type].id === clothes.id;
        item.className = `clothes-item ${clothes.type} ${isWearing ? 'wearing' : ''}`;
        item.innerHTML = `
            ${isWearing ? '<div class="wearing-badge">已穿上</div>' : ''}
            <div class="delete-btn" onclick="event.stopPropagation(); deleteClothes('${clothes.id}')" title="删除">🗑️</div>
            <img src="${clothes.image}" alt="${clothes.name}">
            <div class="clothes-name">${clothes.name}</div>
            <div class="clothes-type">${getClothesTypeName(clothes.type)}</div>
        `;

        item.addEventListener('click', () => tryOnClothes(clothes));
        grid.appendChild(item);
    });

    // 始终显示"添加新衣服"按钮
    grid.appendChild(addNewItem);
}

function getClothesTypeName(type) {
    const types = {
        'top': '上衣',
        'bottom': '下装',
        'dress': '连衣裙',
        'outer': '外套',
        'shoes': '鞋子',
        'accessory': '配饰'
    };
    return types[type] || type;
}

// 试穿功能
function tryOnClothes(clothes) {
    // 如果已经在穿这件，则脱掉
    if (currentOutfit[clothes.type] && currentOutfit[clothes.type].id === clothes.id) {
        currentOutfit[clothes.type] = null;
        if (typeof removeClothes3D === 'function') {
            removeClothes3D(clothes.type);
        }
        showNotification(`已脱下 ${clothes.name}！`);
    } else {
        // 套装互斥逻辑：如果穿上连衣裙，脱掉上衣和下装；如果穿上上衣/下装，脱掉连衣裙
        if (clothes.type === 'dress') {
            if (currentOutfit.top) {
                if (typeof removeClothes3D === 'function') removeClothes3D('top');
                currentOutfit.top = null;
            }
            if (currentOutfit.bottom) {
                if (typeof removeClothes3D === 'function') removeClothes3D('bottom');
                currentOutfit.bottom = null;
            }
        } else if (clothes.type === 'top' || clothes.type === 'bottom') {
            if (currentOutfit.dress) {
                if (typeof removeClothes3D === 'function') removeClothes3D('dress');
                currentOutfit.dress = null;
            }
        }

        currentOutfit[clothes.type] = clothes;
        // 在3D Avatar上试穿衣物
        if (typeof tryOnClothes3D === 'function') {
            tryOnClothes3D(clothes);
        }
        showNotification(`已穿上 ${clothes.name}！`);
    }
    
    updateAvatarDisplay();
    renderClothesGrid(); // 重新渲染以显示选中状态
}

// 删除衣服
async function deleteClothes(clothesId) {
    if (!confirm('确定要删除这件衣服吗？')) return;

    try {
        const userId = await getSessionUserId();
        
        if (userId) {
            // 如果已登录，从 Supabase 删除
            if (typeof deleteClothesFromSupabase === 'function') {
                await deleteClothesFromSupabase(clothesId);
            }
        }

        // 从本地数组中移除
        const index = clothesCollection.findIndex(c => String(c.id) === String(clothesId));
        if (index !== -1) {
            const clothes = clothesCollection[index];
            
            // 如果当前正穿着，先脱掉
            if (currentOutfit[clothes.type] && String(currentOutfit[clothes.type].id) === String(clothesId)) {
                currentOutfit[clothes.type] = null;
                if (typeof removeClothes3D === 'function') {
                    removeClothes3D(clothes.type);
                }
            }
            
            clothesCollection.splice(index, 1);
            persistLocalCache();
            renderClothesGrid();
            updateAvatarDisplay();
            showNotification('衣服已删除');
        }
    } catch (error) {
        console.error('删除失败:', error);
        showNotification('删除失败', 'error');
    }
}

// 随机搭配
function randomOutfit() {
    // 清空当前搭配
    currentOutfit = {
        top: null,
        bottom: null,
        dress: null,
        outer: null,
        shoes: null,
        accessory: null
    };

    // 随机选择搭配
    const availableClothes = {
        top: clothesCollection.filter(c => c.type === 'top'),
        bottom: clothesCollection.filter(c => c.type === 'bottom'),
        dress: clothesCollection.filter(c => c.type === 'dress'),
        outer: clothesCollection.filter(c => c.type === 'outer'),
        shoes: clothesCollection.filter(c => c.type === 'shoes'),
        accessory: clothesCollection.filter(c => c.type === 'accessory')
    };

    // 优先选择连衣裙或上衣+下装组合
    if (availableClothes.dress.length > 0 && Math.random() > 0.5) {
        currentOutfit.dress = availableClothes.dress[Math.floor(Math.random() * availableClothes.dress.length)];
    } else {
        if (availableClothes.top.length > 0) {
            currentOutfit.top = availableClothes.top[Math.floor(Math.random() * availableClothes.top.length)];
        }
        if (availableClothes.bottom.length > 0) {
            currentOutfit.bottom = availableClothes.bottom[Math.floor(Math.random() * availableClothes.bottom.length)];
        }
    }

    // 随机添加其他配件
    if (availableClothes.outer.length > 0 && Math.random() > 0.7) {
        currentOutfit.outer = availableClothes.outer[Math.floor(Math.random() * availableClothes.outer.length)];
    }

    if (availableClothes.shoes.length > 0 && Math.random() > 0.6) {
        currentOutfit.shoes = availableClothes.shoes[Math.floor(Math.random() * availableClothes.shoes.length)];
    }

    if (availableClothes.accessory.length > 0 && Math.random() > 0.8) {
        currentOutfit.accessory = availableClothes.accessory[Math.floor(Math.random() * availableClothes.accessory.length)];
    }

    // 立即同步到 3D 模型
    if (typeof tryOnClothes3D === 'function') {
        Object.keys(currentOutfit).forEach(type => {
            if (currentOutfit[type]) {
                tryOnClothes3D(currentOutfit[type]);
            } else {
                if (typeof removeClothes3D === 'function') {
                    removeClothes3D(type);
                }
            }
        });
    }

    updateAvatarDisplay();
    renderClothesGrid();
    showNotification('已生成随机搭配！');
}

// 一键脱下所有衣服
function undressAll() {
    // 1. 遍历当前穿着，逐个在 3D 模型上移除
    Object.keys(currentOutfit).forEach(type => {
        if (currentOutfit[type]) {
            if (typeof removeClothes3D === 'function') {
                removeClothes3D(type);
            }
            currentOutfit[type] = null;
        }
    });

    // 2. 更新 UI
    updateAvatarDisplay();
    renderClothesGrid();
    showNotification('已脱下所有衣物');
}

async function saveOutfit() {
    const outfitName = prompt('请为这个搭配命名：');
    if (!outfitName) return;

    const userId = await getSessionUserId();
    if (userId) {
        try {
            await syncPendingClothesToSupabase(userId);
        } catch (e) {
            console.error(e);
            showNotification('同步衣物失败，无法保存搭配', 'error');
            return;
        }
    }

    const outfit = {
        id: Date.now(),
        name: outfitName,
        items: { ...currentOutfit },
        dateCreated: new Date().toISOString()
    };

    if (userId && typeof insertOutfit === 'function') {
        try {
            const row = {
                user_id: userId,
                name: outfitName,
                top_id: currentOutfit.top && isUuid(String(currentOutfit.top.id)) ? currentOutfit.top.id : null,
                bottom_id: currentOutfit.bottom && isUuid(String(currentOutfit.bottom.id)) ? currentOutfit.bottom.id : null,
                dress_id: currentOutfit.dress && isUuid(String(currentOutfit.dress.id)) ? currentOutfit.dress.id : null,
                outer_id: currentOutfit.outer && isUuid(String(currentOutfit.outer.id)) ? currentOutfit.outer.id : null,
                shoes_id: currentOutfit.shoes && isUuid(String(currentOutfit.shoes.id)) ? currentOutfit.shoes.id : null,
                accessory_id: currentOutfit.accessory && isUuid(String(currentOutfit.accessory.id)) ? currentOutfit.accessory.id : null
            };
            const inserted = await insertOutfit(row);
            outfit.id = inserted.id;
        } catch (e) {
            console.error(e);
            showNotification('保存搭配到云端失败', 'error');
        }
    }

    savedOutfits.push(outfit);
    await saveToLocalStorage();
    renderOutfitsGrid();
    showNotification('搭配方案已保存！');
}

function renderOutfitsGrid() {
    const grid = document.getElementById('outfits-grid');
    grid.innerHTML = '';

    if (savedOutfits.length === 0) {
        grid.innerHTML = `
            <div class="no-data">
                <p>还没有保存的搭配方案哦</p>
                <button class="btn-primary" style="margin-top: 15px;" onclick="showWardrobe()">去试衣间搭配一套</button>
            </div>
        `;
        return;
    }

    savedOutfits.forEach(outfit => {
        const el = document.createElement('div');
        el.className = 'outfit-item';

        const outfitItems = Object.values(outfit.items).filter(x => x != null);
        const itemNames = outfitItems.map(x => x.name).filter(Boolean).join(', ');

        const previewWrap = document.createElement('div');
        previewWrap.className = 'outfit-preview';
        if (outfitItems.length > 0) {
            const thumbs = document.createElement('div');
            thumbs.className = 'outfit-thumbnails';
            outfitItems.slice(0, 4).forEach(ci => {
                const img = document.createElement('img');
                img.src = ci.image || '';
                img.alt = ci.name || '';
                img.className = 'mini-thumb';
                thumbs.appendChild(img);
            });
            if (outfitItems.length > 4) {
                const more = document.createElement('div');
                more.className = 'more-items';
                more.textContent = `+${outfitItems.length - 4}`;
                thumbs.appendChild(more);
            }
            previewWrap.appendChild(thumbs);
        } else {
            previewWrap.innerHTML = '<span>👗</span>';
        }

        const nameEl = document.createElement('div');
        nameEl.className = 'outfit-name';
        nameEl.textContent = outfit.name;

        const descEl = document.createElement('div');
        descEl.className = 'outfit-clothes';
        descEl.textContent = itemNames;

        const actions = document.createElement('div');
        actions.className = 'outfit-actions';
        const wearBtn = document.createElement('button');
        wearBtn.className = 'btn-primary';
        wearBtn.textContent = '穿上';
        wearBtn.onclick = () => wearOutfit(outfit.id);
        const delBtn = document.createElement('button');
        delBtn.className = 'btn-secondary';
        delBtn.textContent = '删除';
        delBtn.onclick = () => deleteOutfit(outfit.id);
        actions.appendChild(wearBtn);
        actions.appendChild(delBtn);

        el.appendChild(previewWrap);
        el.appendChild(nameEl);
        el.appendChild(descEl);
        el.appendChild(actions);
        grid.appendChild(el);
    });
}

function wearOutfit(outfitId) {
    const outfit = savedOutfits.find(o => String(o.id) === String(outfitId));
    if (outfit) {
        currentOutfit = {
            top: null,
            bottom: null,
            dress: null,
            outer: null,
            shoes: null,
            accessory: null,
            ...outfit.items
        };
        
        // 同步到 3D Avatar
        if (typeof tryOnClothes3D === 'function') {
            // 先清除当前 3D 上的所有衣物（或者按需替换）
            Object.keys(currentOutfit).forEach(type => {
                const item = currentOutfit[type];
                if (item) {
                    tryOnClothes3D(item);
                } else {
                    if (typeof removeClothes3D === 'function') {
                        removeClothes3D(type);
                    }
                }
            });
        }
        
        updateAvatarDisplay();
        renderClothesGrid(); // 更新衣橱里的选中状态
        showNotification(`已穿上搭配方案：${outfit.name}`);
        
        // 切换回主界面查看效果
        showWardrobe();
    }
}

async function deleteOutfit(outfitId) {
    if (!confirm('确定要删除这个搭配方案吗？')) return;
    const userId = await getSessionUserId();
    if (userId && typeof deleteOutfitRow === 'function' && isUuid(String(outfitId))) {
        try {
            await deleteOutfitRow(outfitId);
        } catch (e) {
            console.error(e);
            showNotification('云端删除失败', 'error');
        }
    }
    savedOutfits = savedOutfits.filter(o => String(o.id) !== String(outfitId));
    await saveToLocalStorage();
    renderOutfitsGrid();
    showNotification('搭配方案已删除');
}



// 浏览商城功能
function browseCatalog() {
    if (typeof browseCatalog === 'function' && taobaoMall) {
        browseCatalog();
    } else {
        showNotification('3D商城加载中，请稍候...');
        setTimeout(() => {
            if (typeof browseCatalog === 'function') {
                browseCatalog();
            }
        }, 1000);
    }
}

async function saveToLocalStorage() {
    try {
        persistLocalCache();
    } catch (error) {
        console.error('保存到本地存储失败:', error);
        showNotification('保存失败，请检查浏览器设置', 'error');
    }

    const userId = await getSessionUserId();
    if (!userId || typeof upsertUserProfile !== 'function') return;

    try {
        await upsertUserProfile(mapUserProfileToDbRow(userId, userProfile));
        await syncPendingClothesToSupabase(userId);
        persistLocalCache();
    } catch (error) {
        console.error('Supabase 同步失败:', error);
    }
}

async function loadFromLocalStorage() {
    try {
        const userId = await getSessionUserId();
        if (userId && typeof fetchUserProfile === 'function') {
            await loadUserDataFromSupabase(userId);
        } else {
            loadGuestDataFromLocalStorage();
        }
        syncProfileToUI();
        updateAvatarDisplay();
        renderClothesGrid();
        renderOutfitsGrid();
    } catch (error) {
        console.error('加载数据失败:', error);
        showNotification('加载历史数据失败', 'error');
    }
}

function syncProfileToUI() {
    // 将 userProfile 数据回填到滑块、颜色选择器和下拉框
    const fields = ['height', 'weight', 'shoulder', 'chest', 'waist', 'hip'];
    fields.forEach(field => {
        const el = document.getElementById(field);
        const display = document.getElementById(field + '-value');
        if (el) el.value = userProfile[field];
        if (display) display.textContent = userProfile[field];
    });

    if (document.getElementById('skinColor')) document.getElementById('skinColor').value = userProfile.skinColor || '#ffefd5';
    if (document.getElementById('hairColor')) document.getElementById('hairColor').value = userProfile.hairColor || '#5c3a21';
    if (document.getElementById('hairStyle')) document.getElementById('hairStyle').value = userProfile.hairStyle || 'pony';

    // 立即同步 3D
    if (typeof updateAvatar3DProportions === 'function') {
        updateAvatar3DProportions(userProfile);
    }
}

// 通知功能
function showNotification(message, type = 'success') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : '#10b981'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

async function addSampleData() {
    if (clothesCollection.length > 0) return;
    if (await getSessionUserId()) return;

    const sampleClothes = [
            {
                id: 1,
                type: 'top',
                name: '纯棉白色基础T恤',
                color: '#FFFFFF',
                image: 'https://img.alicdn.com/imgextra/i4/6000000002383/O1CN01hJZ7K21v2YhJZ7K2_!!6000000002383-0-item_pic.jpg',
                brand: '优衣库',
                price: 89,
                dateAdded: new Date().toISOString()
            },
            {
                id: 2,
                type: 'bottom',
                name: '高腰直筒牛仔裤',
                color: '#4169E1',
                image: 'https://img.alicdn.com/imgextra/i3/6000000009012/O1CN01example9012_!!6000000009012-0-item_pic.jpg',
                brand: 'Levi\'s',
                price: 199,
                dateAdded: new Date().toISOString()
            },
            {
                id: 3,
                type: 'dress',
                name: '碎花雪纺连衣裙',
                color: '#FFB6C1',
                image: 'https://img.alicdn.com/imgextra/i1/6000000007890/O1CN01example7890_!!6000000007890-0-item_pic.jpg',
                brand: '韩都衣舍',
                price: 259,
                dateAdded: new Date().toISOString()
            },
            {
                id: 4,
                type: 'shoes',
                name: '小白鞋百搭运动鞋',
                color: '#FFFFFF',
                image: 'https://img.alicdn.com/imgextra/i2/6000000002468/O1CN01example2468_!!6000000002468-0-item_pic.jpg',
                brand: 'Adidas',
                price: 299,
                dateAdded: new Date().toISOString()
            }
    ];

    clothesCollection.push(...sampleClothes);
    await saveToLocalStorage();
    renderClothesGrid();
    showNotification('已添加示例衣物到您的衣橱！');
}

setTimeout(() => addSampleData(), 1000);
