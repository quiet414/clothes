// 淘宝风格商城集成 - 真实商品展示和购买功能
class TaobaoMall {
    constructor() {
        this.products = [];
        this.categories = [
            { id: 'tops', name: '上衣', icon: '👕' },
            { id: 'bottoms', name: '下装', icon: '👖' },
            { id: 'dresses', name: '连衣裙', icon: '👗' },
            { id: 'outerwear', name: '外套', icon: '🧥' },
            { id: 'shoes', name: '鞋子', icon: '👠' },
            { id: 'accessories', name: '配饰', icon: '👜' }
        ];
        this.currentCategory = 'tops';
        this.init();
    }

    init() {
        this.loadSampleProducts();
        this.createMallInterface();
    }

    // 加载示例商品数据
    loadSampleProducts() {
        this.products = [
            // 上衣类
            {
                id: 'tb_001',
                name: '纯棉白色基础T恤',
                price: 89,
                originalPrice: 129,
                image: 'https://img.alicdn.com/imgextra/i4/6000000002383/O1CN01hJZ7K21v2YhJZ7K2_!!6000000002383-0-item_pic.jpg',
                category: 'tops',
                brand: '优衣库',
                rating: 4.8,
                sales: 15420,
                tags: ['纯棉', '基础款', '百搭'],
                colors: ['#FFFFFF', '#000000', '#FF6B6B', '#4ECDC4'],
                sizes: ['S', 'M', 'L', 'XL'],
                description: '100%纯棉材质，舒适透气，经典基础款设计'
            },
            {
                id: 'tb_002',
                name: '商务休闲衬衫',
                price: 159,
                originalPrice: 229,
                image: 'https://img.alicdn.com/imgextra/i1/6000000001234/O1CN01example1234_!!6000000001234-0-item_pic.jpg',
                category: 'tops',
                brand: '海澜之家',
                rating: 4.6,
                sales: 8960,
                tags: ['商务', '休闲', '免烫'],
                colors: ['#FFFFFF', '#87CEEB', '#F0E68C', '#DDA0DD'],
                sizes: ['S', 'M', 'L', 'XL', 'XXL'],
                description: '免烫工艺，商务休闲两相宜'
            },
            {
                id: 'tb_003',
                name: '宽松连帽卫衣',
                price: 129,
                originalPrice: 189,
                image: 'https://img.alicdn.com/imgextra/i2/6000000005678/O1CN01example5678_!!6000000005678-0-item_pic.jpg',
                category: 'tops',
                brand: 'Champion',
                rating: 4.9,
                sales: 22350,
                tags: ['宽松', '连帽', '潮流'],
                colors: ['#000000', '#808080', '#FF4500', '#4169E1'],
                sizes: ['S', 'M', 'L', 'XL'],
                description: '潮流连帽设计，舒适宽松版型'
            },

            // 下装类
            {
                id: 'tb_004',
                name: '高腰直筒牛仔裤',
                price: 199,
                originalPrice: 299,
                image: 'https://img.alicdn.com/imgextra/i3/6000000009012/O1CN01example9012_!!6000000009012-0-item_pic.jpg',
                category: 'bottoms',
                brand: 'Levi\'s',
                rating: 4.7,
                sales: 18750,
                tags: ['高腰', '直筒', '显瘦'],
                colors: ['#4169E1', '#191970', '#654321'],
                sizes: ['25', '26', '27', '28', '29', '30'],
                description: '经典高腰设计，修饰腿型，显瘦显高'
            },
            {
                id: 'tb_005',
                name: '休闲运动短裤',
                price: 79,
                originalPrice: 119,
                image: 'https://img.alicdn.com/imgextra/i4/6000000003456/O1CN01example3456_!!6000000003456-0-item_pic.jpg',
                category: 'bottoms',
                brand: 'Nike',
                rating: 4.5,
                sales: 12680,
                tags: ['运动', '透气', '速干'],
                colors: ['#000000', '#FFFFFF', '#FF6B6B', '#00CED1'],
                sizes: ['S', 'M', 'L', 'XL'],
                description: '运动休闲设计，透气速干面料'
            },

            // 连衣裙类
            {
                id: 'tb_006',
                name: '碎花雪纺连衣裙',
                price: 259,
                originalPrice: 359,
                image: 'https://img.alicdn.com/imgextra/i1/6000000007890/O1CN01example7890_!!6000000007890-0-item_pic.jpg',
                category: 'dresses',
                brand: '韩都衣舍',
                rating: 4.8,
                sales: 9840,
                tags: ['碎花', '雪纺', '甜美'],
                colors: ['#FFB6C1', '#98FB98', '#87CEEB'],
                sizes: ['S', 'M', 'L'],
                description: '甜美碎花图案，轻盈雪纺面料'
            },

            // 鞋子类
            {
                id: 'tb_007',
                name: '小白鞋百搭运动鞋',
                price: 299,
                originalPrice: 429,
                image: 'https://img.alicdn.com/imgextra/i2/6000000002468/O1CN01example2468_!!6000000002468-0-item_pic.jpg',
                category: 'shoes',
                brand: 'Adidas',
                rating: 4.9,
                sales: 35620,
                tags: ['百搭', '舒适', '经典'],
                colors: ['#FFFFFF', '#000000', '#C0C0C0'],
                sizes: ['36', '37', '38', '39', '40', '41', '42'],
                description: '经典小白鞋设计，百搭各种风格'
            },

            // 外套类
            {
                id: 'tb_008',
                name: '羊毛呢大衣',
                price: 599,
                originalPrice: 899,
                image: 'https://img.alicdn.com/imgextra/i3/6000000006789/O1CN01example6789_!!6000000006789-0-item_pic.jpg',
                category: 'outerwear',
                brand: 'Max Mara',
                rating: 4.7,
                sales: 5680,
                tags: ['羊毛', '呢料', '优雅'],
                colors: ['#8B4513', '#000000', '#696969'],
                sizes: ['S', 'M', 'L'],
                description: '优质羊毛呢料，优雅经典设计'
            }
        ];
    }

    // 创建商城界面
    createMallInterface() {
        const mallHTML = `
        <div id="mall-modal" class="modal" style="display: none;">
            <div class="modal-content" style="max-width: 90%; height: 85vh; overflow: hidden;">
                <span class="close" onclick="closeMall()">×</span>
                <div class="mall-container">
                    <div class="mall-header">
                        <h2>🛍️ 时尚商城</h2>
                        <div class="mall-search">
                            <input type="text" id="mall-search-input" placeholder="搜索商品...">
                            <button onclick="searchProducts()">🔍</button>
                        </div>
                        <button class="btn-text" onclick="closeMall()" style="margin-left: 10px; color: var(--text-secondary);">返回衣橱</button>
                    </div>

                    <div class="mall-categories">
                        ${this.categories.map(cat => `
                            <button class="category-btn ${cat.id === this.currentCategory ? 'active' : ''}"
                                    onclick="switchCategory('${cat.id}')">
                                ${cat.icon} ${cat.name}
                            </button>
                        `).join('')}
                    </div>

                    <div class="mall-products" id="mall-products-grid">
                        <!-- 商品网格将在这里动态生成 -->
                    </div>
                </div>
            </div>
        </div>
        `;

        // 添加到页面
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = mallHTML;
        document.body.appendChild(modalContainer);

        // 渲染初始商品
        this.renderProducts(this.currentCategory);
    }

    // 渲染商品网格
    renderProducts(category) {
        const productsGrid = document.getElementById('mall-products-grid');
        const filteredProducts = this.products.filter(p => p.category === category);

        productsGrid.innerHTML = filteredProducts.map(product => `
            <div class="mall-product-card" onclick="showProductDetail('${product.id}')">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjFmNWY5IiBzdHJva2U9IiNlMmU4ZjAiLz4KPHN2ZyB4PSI4MCIgeT0iODAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2NDc0OEIiPgo8cGF0aCBkPSJtMyA1IDctNyA3IDd2MTBjMCAyLjIxLTEuNzkgNC00IDRoLTZjLTIuMjEgMC00LTEuNzktNC00eiIvPgo8L3N2Zz4KPC9zdmc+'">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">¥${product.price}</span>
                        ${product.originalPrice > product.price ? `<span class="original-price">¥${product.originalPrice}</span>` : ''}
                    </div>
                    <div class="product-meta">
                        <span class="product-rating">⭐ ${product.rating}</span>
                        <span class="product-sales">已售${product.sales}</span>
                    </div>
                    <div class="product-tags">
                        ${product.tags.slice(0, 2).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 切换商品分类
    switchCategory(categoryId) {
        this.currentCategory = categoryId;

        // 更新按钮状态
        const buttons = document.querySelectorAll('.category-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`[onclick="switchCategory('${categoryId}')"]`);
        if (activeBtn) activeBtn.classList.add('active');

        // 渲染新分类的商品
        this.renderProducts(categoryId);
    }

    // 搜索商品
    searchProducts() {
        const searchTerm = document.getElementById('mall-search-input').value.toLowerCase();
        const filteredProducts = this.products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );

        const productsGrid = document.getElementById('mall-products-grid');
        productsGrid.innerHTML = filteredProducts.map(product => `
            <div class="mall-product-card" onclick="showProductDetail('${product.id}')">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">¥${product.price}</span>
                        ${product.originalPrice > product.price ? `<span class="original-price">¥${product.originalPrice}</span>` : ''}
                    </div>
                    <div class="product-meta">
                        <span class="product-rating">⭐ ${product.rating}</span>
                        <span class="product-sales">已售${product.sales}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 显示商品详情
    showProductDetail(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const detailHTML = `
        <div id="product-detail-modal" class="modal" style="display: block;">
            <div class="modal-content" style="max-width: 700px;">
                <span class="close" onclick="closeProductDetail()">×</span>
                <div class="product-detail">
                    <div class="detail-images">
                        <img src="${product.image}" alt="${product.name}" class="main-image">
                    </div>
                    <div class="detail-info">
                        <h2>${product.name}</h2>
                        <div class="detail-price">
                            <span class="current-price">¥${product.price}</span>
                            ${product.originalPrice > product.price ? `<span class="original-price">¥${product.originalPrice}</span>` : ''}
                        </div>
                        <div class="detail-meta">
                            <span class="brand">品牌: ${product.brand}</span>
                            <span class="rating">评分: ⭐ ${product.rating}</span>
                            <span class="sales">销量: ${product.sales}</span>
                        </div>
                        <div class="detail-description">
                            <h4>商品描述</h4>
                            <p>${product.description}</p>
                        </div>
                        <div class="detail-options">
                            <div class="color-options">
                                <h4>颜色选择</h4>
                                <div class="color-list">
                                    ${product.colors.map(color => `
                                        <div class="color-option" style="background: ${color}"
                                             onclick="selectColor('${color}')"></div>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="size-options">
                                <h4>尺码选择</h4>
                                <div class="size-list">
                                    ${product.sizes.map(size => `
                                        <button class="size-option" onclick="selectSize('${size}')">${size}</button>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        <div class="detail-actions">
                            <button class="btn-accent" onclick="previewOnAvatar('${productId}')">
                                ✨ 一键试穿 (预览)
                            </button>
                            <button class="btn-primary" onclick="addToWardrobe('${productId}')">
                                ➕ 添加到我的衣橱
                            </button>
                            <button class="btn-secondary" onclick="buyNow('${productId}')">
                                🛒 立即购买
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = detailHTML;
        document.body.appendChild(modalContainer);

        // 关闭商城界面
        this.closeMall();
    }

    async addToWardrobe(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const wardrobeItem = {
            id: Date.now(),
            type: this.mapCategoryToWardrobeType(product.category),
            name: product.name,
            color: product.colors[0],
            image: product.image,
            price: product.price,
            brand: product.brand,
            source: 'taobao',
            dateAdded: new Date().toISOString()
        };

        clothesCollection.push(wardrobeItem);
        await saveToLocalStorage();
        renderClothesGrid();

        showNotification(`${product.name} 已添加到您的衣橱！`);
        closeProductDetail();
    }

    // 分类映射
    mapCategoryToWardrobeType(category) {
        const mapping = {
            'tops': 'top',
            'bottoms': 'bottom',
            'dresses': 'dress',
            'outerwear': 'outer',
            'shoes': 'shoes',
            'accessories': 'accessory'
        };
        return mapping[category] || 'top';
    }

    // 立即购买（模拟）
    buyNow(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        showNotification(`正在跳转到购买页面... (模拟功能)`);
        console.log(`购买商品: ${product.name} - ¥${product.price}`);

        // 这里可以集成真实的购买链接
        setTimeout(() => {
            closeProductDetail();
        }, 2000);
    }

    // 打开商城
    openMall() {
        const modal = document.getElementById('mall-modal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    // 关闭商城
    closeMall() {
        const modal = document.getElementById('mall-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // 关闭商品详情
    closeProductDetail() {
        const modal = document.getElementById('product-detail-modal');
        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }

        // 重新打开商城
        this.openMall();
    }
}

// 全局商城实例
let taobaoMall = null;

// 初始化商城
function initTaobaoMall() {
    if (!taobaoMall) {
        taobaoMall = new TaobaoMall();
    }
}

// 打开商城
function browseCatalog() {
    if (!taobaoMall) {
        initTaobaoMall();
    }
    taobaoMall.openMall();
}

// 关闭商城
function closeMall() {
    if (taobaoMall) {
        taobaoMall.closeMall();
    }
}

// 切换分类
function switchCategory(categoryId) {
    if (taobaoMall) {
        taobaoMall.switchCategory(categoryId);
    }
}

// 搜索商品
function searchProducts() {
    if (taobaoMall) {
        taobaoMall.searchProducts();
    }
}

// 显示商品详情
function showProductDetail(productId) {
    if (taobaoMall) {
        taobaoMall.showProductDetail(productId);
    }
}

// 关闭商品详情
function closeProductDetail() {
    if (taobaoMall) {
        taobaoMall.closeProductDetail();
    }
}

async function addToWardrobe(productId) {
    if (taobaoMall) {
        await taobaoMall.addToWardrobe(productId);
    }
}

// 立即购买
function buyNow(productId) {
    if (taobaoMall) {
        taobaoMall.buyNow(productId);
    }
}

// 在虚拟形象上预览
function previewOnAvatar(productId) {
    if (taobaoMall) {
        const product = taobaoMall.products.find(p => p.id === productId);
        if (product) {
            // 转换商品为临时衣橱格式进行试穿
            const tempItem = {
                id: 'preview_' + product.id,
                type: taobaoMall.mapCategoryToWardrobeType(product.category),
                name: product.name,
                color: product.colors[0],
                image: product.image
            };
            
            if (typeof tryOnClothes3D === 'function') {
                tryOnClothes3D(tempItem);
                showNotification(`正在预览 ${product.name}...`);
            }
        }
    }
}

// 选择颜色
function selectColor(color) {
    console.log(`选择了颜色: ${color}`);
}

// 选择尺码
function selectSize(size) {
    console.log(`选择了尺码: ${size}`);
}

// 页面加载后初始化商城
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initTaobaoMall, 1000);
});