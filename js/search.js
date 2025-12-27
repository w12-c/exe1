// 搜索功能脚本

// 模拟的商品数据
const mockProducts = [
    {
        id: 1,
        name: "新鲜红富士苹果",
        description: "山东红富士，甜脆多汁，新鲜采摘",
        category: "fresh",
        price: 25.8,
        originalPrice: 32.0,
        sales: 1560,
        rating: 4.8,
        ratingCount: 235,
        image: "uploads/蛋糕模具.png",
        tags: ["新鲜", "水果", "山东"],
        stock: 100,
        isNew: true
    },
    {
        id: 2,
        name: "泰国金枕榴莲",
        description: "泰国进口，果肉饱满，香味浓郁",
        category: "fresh",
        price: 198.0,
        originalPrice: 258.0,
        sales: 890,
        rating: 4.9,
        ratingCount: 156,
        image: "uploads/蛋糕模具.png",
        tags: ["进口", "榴莲", "泰国"],
        stock: 50,
        isNew: false
    },
    {
        id: 3,
        name: "有机西兰花",
        description: "有机种植，无农药残留，健康蔬菜",
        category: "fresh",
        price: 12.5,
        originalPrice: 15.0,
        sales: 2340,
        rating: 4.7,
        ratingCount: 189,
        image: "uploads/蛋糕模具.png",
        tags: ["有机", "蔬菜", "健康"],
        stock: 200,
        isNew: true
    },
    {
        id: 4,
        name: "内蒙古羔羊肉",
        description: "精选羔羊肉，肉质鲜嫩，营养丰富",
        category: "fresh",
        price: 68.0,
        originalPrice: 85.0,
        sales: 1250,
        rating: 4.8,
        ratingCount: 267,
        image: "uploads/蛋糕模具.png",
        tags: ["羊肉", "内蒙古", "精选"],
        stock: 80,
        isNew: false
    },
    {
        id: 5,
        name: "挪威三文鱼",
        description: "挪威进口，冰鲜直达，富含Omega-3",
        category: "fresh",
        price: 158.0,
        originalPrice: 198.0,
        sales: 680,
        rating: 4.9,
        ratingCount: 134,
        image: "uploads/蛋糕模具.png",
        tags: ["海鲜", "进口", "三文鱼"],
        stock: 40,
        isNew: true
    },
    {
        id: 6,
        name: "日本和牛",
        description: "A5级和牛，雪花分布均匀，口感绝佳",
        category: "fresh",
        price: 588.0,
        originalPrice: 688.0,
        sales: 230,
        rating: 5.0,
        ratingCount: 89,
        image: "uploads/蛋糕模具.png",
        tags: ["和牛", "进口", "高端"],
        stock: 20,
        isNew: true
    },
    {
        id: 7,
        name: "智利车厘子",
        description: "智利进口，个大味甜，送礼佳品",
        category: "fresh",
        price: 128.0,
        originalPrice: 158.0,
        sales: 1560,
        rating: 4.8,
        ratingCount: 456,
        image: "uploads/蛋糕模具.png",
        tags: ["车厘子", "进口", "智利"],
        stock: 150,
        isNew: false
    },
    {
        id: 8,
        name: "有机土鸡蛋",
        description: "农家散养土鸡蛋，蛋黄饱满，营养丰富",
        category: "fresh",
        price: 28.0,
        originalPrice: 35.0,
        sales: 2890,
        rating: 4.7,
        ratingCount: 678,
        image: "uploads/蛋糕模具.png",
        tags: ["鸡蛋", "有机", "土鸡蛋"],
        stock: 300,
        isNew: true
    },
    {
        id: 9,
        name: "手工意大利面",
        description: "传统工艺制作，口感劲道，多种形状可选",
        category: "food",
        price: 36.0,
        originalPrice: 45.0,
        sales: 890,
        rating: 4.6,
        ratingCount: 234,
        image: "uploads/蛋糕模具.png",
        tags: ["意大利面", "手工", "面食"],
        stock: 120,
        isNew: true
    },
    {
        id: 10,
        name: "法式可颂面包",
        description: "层层酥脆，奶香浓郁，早餐优选",
        category: "food",
        price: 18.0,
        originalPrice: 25.0,
        sales: 1560,
        rating: 4.8,
        ratingCount: 456,
        image: "uploads/蛋糕模具.png",
        tags: ["面包", "法式", "早餐"],
        stock: 200,
        isNew: false
    }
];

// 热门搜索关键词
const hotKeywords = [
    { keyword: "苹果", count: 1560, type: "hot" },
    { keyword: "榴莲", count: 890, type: "hot" },
    { keyword: "三文鱼", count: 680, type: "normal" },
    { keyword: "牛排", count: 1250, type: "hot" },
    { keyword: "车厘子", count: 1560, type: "normal" },
    { keyword: "鸡蛋", count: 2890, type: "hot" },
    { keyword: "意大利面", count: 890, type: "normal" },
    { keyword: "面包", count: 1560, type: "normal" },
    { keyword: "牛奶", count: 2340, type: "normal" },
    { keyword: "海鲜", count: 980, type: "normal" }
];

// 搜索历史
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    initSearchPage();
    
    // 绑定事件监听器
    bindEvents();
    
    // 加载热门搜索
    loadHotKeywords();
    
    // 加载搜索历史
    loadSearchHistory();
});

// 初始化搜索页面
function initSearchPage() {
    // 从URL获取搜索关键词
    const urlParams = new URLSearchParams(window.location.search);
    const searchKeyword = urlParams.get('q');
    
    if (searchKeyword) {
        document.getElementById('mainSearchInput').value = searchKeyword;
        performSearch(searchKeyword);
    }
}

// 绑定事件监听器
function bindEvents() {
    // 搜索框相关
    const searchInput = document.getElementById('searchInput');
    const mainSearchInput = document.getElementById('mainSearchInput');
    const searchButton = document.getElementById('searchButton');
    const mainSearchButton = document.getElementById('mainSearchButton');
    
    // 输入框事件
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('focus', showSuggestions);
    searchInput.addEventListener('blur', hideSuggestions);
    
    mainSearchInput.addEventListener('input', handleMainSearchInput);
    mainSearchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(this.value);
        }
    });
    
    // 搜索按钮事件
    searchButton.addEventListener('click', function() {
        performSearch(searchInput.value);
    });
    
    mainSearchButton.addEventListener('click', function() {
        performSearch(mainSearchInput.value);
    });
    
    // 高级搜索
    const toggleAdvanced = document.getElementById('toggleAdvanced');
    const toggleIcon = document.getElementById('toggleIcon');
    const advancedOptions = document.getElementById('advancedOptions');
    
    toggleAdvanced.addEventListener('click', function() {
        const isVisible = advancedOptions.style.display === 'block';
        advancedOptions.style.display = isVisible ? 'none' : 'block';
        toggleIcon.className = isVisible ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
    });
    
    // 筛选按钮
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    
    // 清除历史记录
    document.getElementById('clearHistory').addEventListener('click', clearHistory);
    document.getElementById('clearAllHistory').addEventListener('click', clearAllHistory);
    
    // 视图切换
    const viewBtns = document.querySelectorAll('.view_btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const viewType = this.dataset.view;
            switchView(viewType);
        });
    });
    
    // 排序切换
    document.getElementById('resultsSort').addEventListener('change', function() {
        applyFilters();
    });
    
    // 分页
    document.getElementById('prevPage').addEventListener('click', prevPage);
    document.getElementById('nextPage').addEventListener('click', nextPage);
    document.getElementById('jumpButton').addEventListener('click', jumpToPage);
    document.getElementById('pageSize').addEventListener('change', function() {
        applyFilters();
    });
    
    // 语音搜索
    const voiceButton = document.getElementById('voiceButton');
    const voiceModal = document.getElementById('voiceModal');
    const closeVoiceModal = document.getElementById('closeVoiceModal');
    const cancelVoice = document.getElementById('cancelVoice');
    const startVoice = document.getElementById('startVoice');
    const stopVoice = document.getElementById('stopVoice');
    
    if (voiceButton) {
        voiceButton.addEventListener('click', function() {
            voiceModal.style.display = 'flex';
        });
    }
    
    closeVoiceModal.addEventListener('click', function() {
        voiceModal.style.display = 'none';
    });
    
    cancelVoice.addEventListener('click', function() {
        voiceModal.style.display = 'none';
    });
    
    startVoice.addEventListener('click', startVoiceSearch);
    stopVoice.addEventListener('click', stopVoiceSearch);
    
    // 点击模态框背景关闭
    voiceModal.addEventListener('click', function(event) {
        if (event.target === voiceModal) {
            voiceModal.style.display = 'none';
        }
    });
}

// 处理搜索输入
function handleSearchInput() {
    const keyword = this.value.trim();
    if (keyword.length > 0) {
        showSuggestions();
        loadSuggestions(keyword);
    } else {
        loadHotKeywords();
    }
}

// 处理主搜索输入
function handleMainSearchInput() {
    const keyword = this.value.trim();
    if (keyword.length > 0) {
        loadSuggestions(keyword);
    }
}

// 显示智能提示框
function showSuggestions() {
    const suggestionsBox = document.getElementById('suggestionsBox');
    suggestionsBox.style.display = 'block';
}

// 隐藏智能提示框
function hideSuggestions() {
    // 延迟隐藏，以便点击建议项
    setTimeout(() => {
        const suggestionsBox = document.getElementById('suggestionsBox');
        suggestionsBox.style.display = 'none';
    }, 200);
}

// 加载智能提示
function loadSuggestions(keyword) {
    const suggestionsList = document.getElementById('suggestionsList');
    
    // 模拟API调用获取建议
    const suggestions = getSuggestions(keyword);
    
    if (suggestions.length === 0) {
        suggestionsList.innerHTML = '<div class="no-suggestions">暂无建议</div>';
        return;
    }
    
    suggestionsList.innerHTML = suggestions.map(item => `
        <div class="suggestion_item" onclick="selectSuggestion('${item.keyword}')">
            <span class="suggestion_text">${item.keyword}</span>
            <span class="suggestion_count">约${item.count}件商品</span>
        </div>
    `).join('');
}

// 获取建议数据
function getSuggestions(keyword) {
    // 模拟从服务器获取数据
    const filtered = mockProducts.filter(product => 
        product.name.includes(keyword) || 
        product.description.includes(keyword) ||
        product.tags.some(tag => tag.includes(keyword))
    );
    
    // 按商品类别分组统计
    const suggestions = [];
    const categories = {
        fresh: { keyword: "生鲜水果", count: 0 },
        food: { keyword: "美食", count: 0 },
        kitchen: { keyword: "餐厨用品", count: 0 }
    };
    
    filtered.forEach(product => {
        if (categories[product.category]) {
            categories[product.category].count++;
        }
    });
    
    // 添加分类建议
    Object.values(categories).forEach(cat => {
        if (cat.count > 0) {
            suggestions.push({
                keyword: cat.keyword,
                count: cat.count
            });
        }
    });
    
    // 添加具体的商品建议
    filtered.slice(0, 3).forEach(product => {
        suggestions.push({
            keyword: product.name,
            count: product.sales
        });
    });
    
    return suggestions;
}

// 选择建议项
function selectSuggestion(keyword) {
    document.getElementById('searchInput').value = keyword;
    document.getElementById('mainSearchInput').value = keyword;
    performSearch(keyword);
    hideSuggestions();
}

// 执行搜索
function performSearch(keyword) {
    if (!keyword.trim()) {
        showToast('提示', '请输入搜索关键词', 'warning');
        return;
    }
    
    // 显示加载动画
    showLoading();
    
    // 保存到搜索历史
    addToHistory(keyword);
    
    // 更新页面标题
    document.title = `${keyword} - 搜索结果 - 小兔鲜儿`;
    
    // 模拟搜索延迟
    setTimeout(() => {
        // 获取筛选条件
        const filters = getCurrentFilters();
        
        // 执行搜索
        const results = searchProducts(keyword, filters);
        
        // 更新搜索结果
        updateSearchResults(results, keyword);
        
        // 隐藏加载动画
        hideLoading();
        
        // 更新URL
        updateURL(keyword, filters);
    }, 500);
}

// 获取当前筛选条件
function getCurrentFilters() {
    return {
        category: document.getElementById('categoryFilter').value,
        priceRange: document.getElementById('priceFilter').value,
        sortBy: document.getElementById('resultsSort').value,
        page: 1,
        pageSize: parseInt(document.getElementById('pageSize').value)
    };
}

// 搜索商品
function searchProducts(keyword, filters) {
    let results = mockProducts.filter(product => {
        // 关键词匹配
        const keywordMatch = 
            product.name.includes(keyword) || 
            product.description.includes(keyword) ||
            product.tags.some(tag => tag.includes(keyword));
        
        // 分类筛选
        const categoryMatch = !filters.category || product.category === filters.category;
        
        // 价格区间筛选
        let priceMatch = true;
        if (filters.priceRange) {
            const [min, max] = filters.priceRange.split('-').map(Number);
            if (max) {
                priceMatch = product.price >= min && product.price <= max;
            } else {
                priceMatch = product.price >= min;
            }
        }
        
        return keywordMatch && categoryMatch && priceMatch;
    });
    
    // 排序
    results = sortProducts(results, filters.sortBy);
    
    // 分页
    const startIndex = (filters.page - 1) * filters.pageSize;
    const paginatedResults = results.slice(startIndex, startIndex + filters.pageSize);
    
    return {
        products: paginatedResults,
        total: results.length,
        page: filters.page,
        pageSize: filters.pageSize,
        totalPages: Math.ceil(results.length / filters.pageSize)
    };
}

// 商品排序
function sortProducts(products, sortBy) {
    const sorted = [...products];
    
    switch(sortBy) {
        case 'sales':
            return sorted.sort((a, b) => b.sales - a.sales);
        case 'price_asc':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price_desc':
            return sorted.sort((a, b) => b.price - a.price);
        case 'new':
            return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        default: // relevance
            return sorted;
    }
}

// 更新搜索结果
function updateSearchResults(results, keyword) {
    const searchResultsSection = document.getElementById('searchResultsSection');
    const noResults = document.getElementById('noResults');
    
    if (results.total === 0) {
        // 没有结果
        searchResultsSection.style.display = 'none';
        noResults.style.display = 'block';
        document.getElementById('searchKeyword').textContent = keyword;
        return;
    }
    
    // 显示结果区域
    searchResultsSection.style.display = 'block';
    noResults.style.display = 'none';
    
    // 更新结果信息
    document.getElementById('resultsTitle').textContent = `"${keyword}"的搜索结果`;
    document.getElementById('totalResults').textContent = results.total;
    document.getElementById('searchTime').textContent = `(搜索用时0.5秒)`;
    
    // 更新当前页码
    document.getElementById('basic-current').textContent = results.page;
    document.getElementById('fade-current').textContent = results.page;
    
    // 更新应用筛选条件显示
    updateAppliedFilters(keyword);
    
    // 更新商品列表
    renderProducts(results.products);
    
    // 更新分页
    updatePagination(results);
}

// 更新应用筛选条件
function updateAppliedFilters(keyword) {
    const appliedFilters = document.getElementById('appliedFilters');
    const filters = [];
    
    // 添加关键词
    filters.push({
        type: 'keyword',
        label: keyword,
        value: keyword
    });
    
    // 添加分类筛选
    const category = document.getElementById('categoryFilter').value;
    if (category) {
        const categoryText = document.querySelector(`#categoryFilter option[value="${category}"]`).textContent;
        filters.push({
            type: 'category',
            label: `分类: ${categoryText}`,
            value: category
        });
    }
    
    // 添加价格筛选
    const priceRange = document.getElementById('priceFilter').value;
    if (priceRange) {
        const priceText = document.querySelector(`#priceFilter option[value="${priceRange}"]`).textContent;
        filters.push({
            type: 'price',
            label: `价格: ${priceText}`,
            value: priceRange
        });
    }
    
    // 渲染筛选标签
    appliedFilters.innerHTML = filters.map(filter => `
        <div class="filter_tag">
            <i class="fas fa-filter"></i>
            <span>${filter.label}</span>
            <button class="filter_remove" onclick="removeFilter('${filter.type}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// 移除筛选条件
function removeFilter(filterType) {
    switch(filterType) {
        case 'keyword':
            document.getElementById('mainSearchInput').value = '';
            break;
        case 'category':
            document.getElementById('categoryFilter').value = '';
            break;
        case 'price':
            document.getElementById('priceFilter').value = '';
            break;
    }
    
    applyFilters();
}

// 渲染商品列表
function renderProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    const productsList = document.getElementById('productsList');
    
    // 网格视图
    productsGrid.innerHTML = products.map(product => `
        <div class="product_card" onclick="viewProduct(${product.id})">
            <div class="product_image">
                <img src="${product.image}" alt="${product.name}">
                ${product.isNew ? '<span class="product_badge">新品</span>' : ''}
                ${product.sales > 1000 ? '<span class="product_badge" style="background:#27ba9b;">热销</span>' : ''}
            </div>
            <div class="product_content">
                <h3 class="product_title">${product.name}</h3>
                <p class="product_desc">${product.description}</p>
                <div class="product_price">
                    <div>
                        <span class="current_price">¥${product.price.toFixed(2)}</span>
                        ${product.originalPrice > product.price ? 
                            `<span class="original_price">¥${product.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <div class="product_rating">
                        <span class="stars">
                            ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}
                        </span>
                        <span class="rating_count">${product.rating}</span>
                    </div>
                </div>
                <div class="product_actions">
                    <button class="add_cart" onclick="event.stopPropagation();addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> 加入购物车
                    </button>
                    <button class="favorite" onclick="event.stopPropagation();toggleFavorite(${product.id})">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // 列表视图
    productsList.innerHTML = products.map(product => `
        <div class="product_list_item" onclick="viewProduct(${product.id})">
            <div class="list_image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="list_content">
                <div>
                    <h3 class="list_title">${product.name}</h3>
                    <p class="list_desc">${product.description}</p>
                    <div class="list_details">
                        <div class="detail_item">
                            <i class="fas fa-tag"></i>
                            <span>${getCategoryName(product.category)}</span>
                        </div>
                        <div class="detail_item">
                            <i class="fas fa-chart-line"></i>
                            <span>销量 ${product.sales}</span>
                        </div>
                        <div class="detail_item">
                            <i class="fas fa-star"></i>
                            <span>评分 ${product.rating}</span>
                        </div>
                    </div>
                </div>
                <div class="list_price_section">
                    <div class="list_price">¥${product.price.toFixed(2)}</div>
                    <div class="product_actions">
                        <button class="add_cart" onclick="event.stopPropagation();addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i> 加入购物车
                        </button>
                        <button class="favorite" onclick="event.stopPropagation();toggleFavorite(${product.id})">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// 获取分类名称
function getCategoryName(category) {
    const categories = {
        fresh: '生鲜',
        food: '美食',
        kitchen: '餐厨',
        appliance: '电器',
        home: '居家',
        care: '洗护',
        baby: '孕婴',
        clothing: '服装'
    };
    return categories[category] || '其他';
}

// 更新分页
function updatePagination(results) {
    const totalPages = document.getElementById('totalPages');
    const pageNumbers = document.getElementById('pageNumbers');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    
    totalPages.textContent = results.totalPages;
    
    // 更新页码按钮状态
    prevPageBtn.disabled = results.page === 1;
    nextPageBtn.disabled = results.page === results.totalPages;
    
    // 生成页码
    let pageHtml = '';
    const currentPage = results.page;
    const totalPagesCount = results.totalPages;
    
    if (totalPagesCount <= 7) {
        // 显示所有页码
        for (let i = 1; i <= totalPagesCount; i++) {
            pageHtml += `<span class="page_number ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</span>`;
        }
    } else {
        // 显示部分页码
        if (currentPage <= 4) {
            for (let i = 1; i <= 5; i++) {
                pageHtml += `<span class="page_number ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</span>`;
            }
            pageHtml += '<span class="page_number">...</span>';
            pageHtml += `<span class="page_number" onclick="goToPage(${totalPagesCount})">${totalPagesCount}</span>`;
        } else if (currentPage >= totalPagesCount - 3) {
            pageHtml += '<span class="page_number" onclick="goToPage(1)">1</span>';
            pageHtml += '<span class="page_number">...</span>';
            for (let i = totalPagesCount - 4; i <= totalPagesCount; i++) {
                pageHtml += `<span class="page_number ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</span>`;
            }
        } else {
            pageHtml += '<span class="page_number" onclick="goToPage(1)">1</span>';
            pageHtml += '<span class="page_number">...</span>';
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                pageHtml += `<span class="page_number ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</span>`;
            }
            pageHtml += '<span class="page_number">...</span>';
            pageHtml += `<span class="page_number" onclick="goToPage(${totalPagesCount})">${totalPagesCount}</span>`;
        }
    }
    
    pageNumbers.innerHTML = pageHtml;
}

// 跳转到指定页码
function goToPage(page) {
    const keyword = document.getElementById('mainSearchInput').value;
    const filters = getCurrentFilters();
    filters.page = page;
    
    performSearchWithFilters(keyword, filters);
}

// 上一页
function prevPage() {
    const currentPage = parseInt(document.getElementById('basic-current').textContent);
    if (currentPage > 1) {
        goToPage(currentPage - 1);
    }
}

// 下一页
function nextPage() {
    const currentPage = parseInt(document.getElementById('basic-current').textContent);
    const totalPages = parseInt(document.getElementById('totalPages').textContent);
    if (currentPage < totalPages) {
        goToPage(currentPage + 1);
    }
}

// 跳转到指定页码
function jumpToPage() {
    const pageInput = document.getElementById('jumpToPage');
    const page = parseInt(pageInput.value);
    const totalPages = parseInt(document.getElementById('totalPages').textContent);
    
    if (page >= 1 && page <= totalPages) {
        goToPage(page);
    } else {
        showToast('提示', `请输入1-${totalPages}之间的页码`, 'warning');
    }
}

// 应用筛选
function applyFilters() {
    const keyword = document.getElementById('mainSearchInput').value;
    const filters = getCurrentFilters();
    performSearchWithFilters(keyword, filters);
}

// 重置筛选
function resetFilters() {
    document.getElementById('categoryFilter').value = '';
    document.getElementById('priceFilter').value = '';
    document.getElementById('resultsSort').value = 'relevance';
    applyFilters();
}

// 带筛选条件的搜索
function performSearchWithFilters(keyword, filters) {
    showLoading();
    
    setTimeout(() => {
        const results = searchProducts(keyword, filters);
        updateSearchResults(results, keyword);
        hideLoading();
    }, 500);
}

// 更新URL
function updateURL(keyword, filters) {
    const params = new URLSearchParams();
    params.set('q', keyword);
    if (filters.category) params.set('category', filters.category);
    if (filters.priceRange) params.set('price', filters.priceRange);
    if (filters.sortBy !== 'relevance') params.set('sort', filters.sortBy);
    if (filters.page > 1) params.set('page', filters.page);
    
    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newURL);
}

// 加载热门搜索关键词
function loadHotKeywords() {
    const hotTagsList = document.getElementById('hotTagsList');
    const suggestionsList = document.getElementById('suggestionsList');
    
    hotTagsList.innerHTML = hotKeywords.map(item => `
        <span class="tag ${item.type === 'hot' ? 'hot' : ''}" onclick="selectSuggestion('${item.keyword}')">
            ${item.keyword}
        </span>
    `).join('');
    
    suggestionsList.innerHTML = hotKeywords.slice(0, 5).map(item => `
        <div class="suggestion_item" onclick="selectSuggestion('${item.keyword}')">
            <span class="suggestion_text">${item.keyword}</span>
            <span class="suggestion_count">约${item.count}件商品</span>
        </div>
    `).join('');
}

// 加载搜索历史
function loadSearchHistory() {
    const historyList = document.getElementById('historyList');
    const historyListSection = document.getElementById('historyListSection');
    
    if (searchHistory.length === 0) {
        historyList.innerHTML = '<div class="no-history">暂无搜索历史</div>';
        historyListSection.innerHTML = '<div class="no-history">暂无搜索历史</div>';
        return;
    }
    
    // 导航栏历史列表
    historyList.innerHTML = searchHistory.slice(0, 5).map(item => `
        <div class="history_item" onclick="selectSuggestion('${item.keyword}')">
            <span class="history_keyword">${item.keyword}</span>
            <span class="history_time">${formatTime(item.timestamp)}</span>
            <button class="history_delete" onclick="event.stopPropagation();deleteHistory('${item.id}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
    
    // 详细历史记录
    historyListSection.innerHTML = searchHistory.map(item => `
        <div class="history_card" onclick="selectSuggestion('${item.keyword}')">
            <h4 class="history_keyword_large">${item.keyword}</h4>
            <div class="history_time_large">${formatTime(item.timestamp)}</div>
            <div class="history_products">找到约${item.resultCount || 0}件商品</div>
        </div>
    `).join('');
}

// 添加到搜索历史
function addToHistory(keyword) {
    // 检查是否已存在
    const existingIndex = searchHistory.findIndex(item => item.keyword === keyword);
    
    if (existingIndex !== -1) {
        // 更新现有记录的时间
        searchHistory[existingIndex].timestamp = Date.now();
    } else {
        // 添加新记录
        searchHistory.unshift({
            id: Date.now().toString(),
            keyword: keyword,
            timestamp: Date.now(),
            resultCount: 0 // 实际应用中应该从搜索结果获取
        });
    }
    
    // 只保留最近10条记录
    searchHistory = searchHistory.slice(0, 10);
    
    // 保存到本地存储
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    
    // 重新加载历史记录
    loadSearchHistory();
}

// 删除单条历史记录
function deleteHistory(id) {
    searchHistory = searchHistory.filter(item => item.id !== id);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    loadSearchHistory();
}

// 清除历史记录
function clearHistory() {
    searchHistory = [];
    localStorage.removeItem('searchHistory');
    loadSearchHistory();
    showToast('提示', '搜索历史已清除', 'success');
}

// 清除全部历史记录
function clearAllHistory() {
    if (confirm('确定要清除所有搜索历史吗？')) {
        clearHistory();
    }
}

// 格式化时间
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) { // 1分钟内
        return '刚刚';
    } else if (diff < 3600000) { // 1小时内
        return `${Math.floor(diff / 60000)}分钟前`;
    } else if (diff < 86400000) { // 1天内
        return `${Math.floor(diff / 3600000)}小时前`;
    } else if (diff < 604800000) { // 1周内
        return `${Math.floor(diff / 86400000)}天前`;
    } else {
        return date.toLocaleDateString();
    }
}

// 视图切换
function switchView(viewType) {
    const productsGrid = document.getElementById('productsGrid');
    const productsList = document.getElementById('productsList');
    
    if (viewType === 'grid') {
        productsGrid.style.display = 'grid';
        productsList.style.display = 'none';
    } else {
        productsGrid.style.display = 'none';
        productsList.style.display = 'block';
    }
}

// 语音搜索
let isRecording = false;
let recognition = null;

function startVoiceSearch() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        showToast('提示', '您的浏览器不支持语音识别功能', 'warning');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = function() {
        isRecording = true;
        document.getElementById('startVoice').style.display = 'none';
        document.getElementById('stopVoice').style.display = 'block';
        document.getElementById('voiceInstruction').textContent = '请开始说话...';
        animateVoiceWaves();
    };
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('voiceResult').textContent = transcript;
        document.getElementById('voiceInstruction').textContent = '识别完成';
    };
    
    recognition.onend = function() {
        stopVoiceSearch();
    };
    
    recognition.onerror = function(event) {
        showToast('语音识别错误', event.error, 'error');
        stopVoiceSearch();
    };
    
    recognition.start();
}

function stopVoiceSearch() {
    if (recognition) {
        recognition.stop();
    }
    
    isRecording = false;
    document.getElementById('startVoice').style.display = 'block';
    document.getElementById('stopVoice').style.display = 'none';
    document.getElementById('voiceInstruction').textContent = '请说出您要搜索的商品名称...';
    stopVoiceAnimation();
    
    // 如果有识别结果，执行搜索
    const result = document.getElementById('voiceResult').textContent;
    if (result.trim()) {
        setTimeout(() => {
            document.getElementById('voiceModal').style.display = 'none';
            document.getElementById('mainSearchInput').value = result;
            performSearch(result);
            document.getElementById('voiceResult').textContent = '';
        }, 1000);
    }
}

function animateVoiceWaves() {
    const waves = document.querySelectorAll('.voice-wave');
    waves.forEach(wave => {
        wave.style.animation = 'wave 1.5s infinite ease-in-out';
    });
}

function stopVoiceAnimation() {
    const waves = document.querySelectorAll('.voice-wave');
    waves.forEach(wave => {
        wave.style.animation = 'none';
    });
}

// 显示加载动画
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

// 隐藏加载动画
function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

// 显示提示消息
function showToast(title, message, type) {
    const toastContainer = document.getElementById('toastContainer');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconClass = 'fas fa-info-circle';
    switch(type) {
        case 'success': iconClass = 'fas fa-check-circle'; break;
        case 'error': iconClass = 'fas fa-exclamation-circle'; break;
        case 'warning': iconClass = 'fas fa-exclamation-triangle'; break;
        case 'info': iconClass = 'fas fa-info-circle'; break;
    }
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="${iconClass}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // 添加关闭功能
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', function() {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            toast.remove();
        }, 300);
    });
    
    // 5秒后自动关闭
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }
    }, 5000);
}

// 商品相关功能
function viewProduct(productId) {
    showToast('提示', `查看商品 ${productId}`, 'info');
    // 实际应用中应该跳转到商品详情页
}

function addToCart(productId) {
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
        showToast('成功', `已添加 ${product.name} 到购物车`, 'success');
        
        // 更新购物车数量
        const cartCount = document.getElementById('cartCount');
        let count = parseInt(cartCount.textContent) || 0;
        cartCount.textContent = count + 1;
    }
}

function toggleFavorite(productId) {
    const button = event.currentTarget;
    const isActive = button.classList.contains('active');
    
    if (isActive) {
        button.classList.remove('active');
        button.innerHTML = '<i class="far fa-heart"></i>';
        showToast('提示', '已取消收藏', 'info');
    } else {
        button.classList.add('active');
        button.innerHTML = '<i class="fas fa-heart"></i>';
        showToast('成功', '已收藏该商品', 'success');
    }
    
    event.stopPropagation();
}
