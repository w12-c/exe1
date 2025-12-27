// 个人中心页面交互逻辑

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    initPersonalPage();
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 加载数据
    loadUserData();
    loadRecentOrders();
    loadAddresses();
    loadFavorites();
    loadTransactions();
    loadCoupons();
});

// 初始化页面
function initPersonalPage() {
    // 设置当前用户
    const userName = localStorage.getItem('userName') || '陈小薇';
    document.getElementById('userName').textContent = userName;
    document.getElementById('displayUserName').textContent = userName;
    
    // 设置购物车数量
    const cartCount = localStorage.getItem('cartCount') || '3';
    document.getElementById('cartCount').textContent = cartCount;
}

// 绑定事件监听器
function bindEventListeners() {
    // 侧边栏导航
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            switchSection(sectionId);
            
            // 更新活动状态
            menuItems.forEach(mi => mi.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 编辑资料按钮
    document.getElementById('editProfileBtn').addEventListener('click', toggleProfileEdit);
    document.getElementById('cancelEditBtn').addEventListener('click', toggleProfileEdit);
    document.getElementById('profileForm').addEventListener('submit', saveProfile);
    
    // 头像上传
    document.getElementById('uploadAvatarBtn').addEventListener('click', () => {
        document.getElementById('avatarInput').click();
    });
    document.getElementById('avatarInput').addEventListener('change', handleAvatarUpload);
    
    // 添加地址按钮
    document.getElementById('addAddressBtn').addEventListener('click', openAddressModal);
    
    // 模态框关闭
    document.querySelectorAll('.close-modal, .btn-cancel').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // 保存地址
    document.getElementById('saveAddressBtn').addEventListener('click', saveAddress);
    
    // 标签选择
    document.querySelectorAll('.tag-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            document.getElementById('customTag').value = '';
        });
    });
    
    // 自定义标签输入
    document.getElementById('customTag').addEventListener('input', function() {
        document.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
    });
    
    // 收藏标签切换
    document.querySelectorAll('.favorite-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.favorite-tabs .tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // 这里可以添加切换收藏类型的逻辑
        });
    });
    
    // 优惠券标签切换
    document.querySelectorAll('.coupon-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.coupon-tabs .tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const status = this.getAttribute('data-status');
            filterCoupons(status);
        });
    });
    
    // 账户安全按钮
    document.querySelectorAll('.security-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleSecurityAction(action);
        });
    });
    
    // 保存设置
    document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);
    
    // 退出登录
    document.getElementById('logoutBtn').addEventListener('click', logout);
}

// 切换内容区域
function switchSection(sectionId) {
    // 隐藏所有区域
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // 显示目标区域
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// 切换资料编辑状态
function toggleProfileEdit() {
    const isEditing = document.getElementById('profileActions').style.display === 'flex';
    const formControls = document.querySelectorAll('#profileForm .form-control, #profileForm select');
    
    if (isEditing) {
        // 取消编辑，恢复原始值
        resetProfileForm();
        document.getElementById('profileActions').style.display = 'none';
        document.getElementById('editProfileBtn').innerHTML = '<i class="fas fa-edit"></i> 编辑资料';
    } else {
        // 进入编辑模式
        formControls.forEach(control => {
            control.disabled = false;
        });
        document.getElementById('profileActions').style.display = 'flex';
        document.getElementById('editProfileBtn').innerHTML = '<i class="fas fa-times"></i> 取消编辑';
    }
}

// 重置资料表单
function resetProfileForm() {
    // 这里应该从服务器获取原始数据，这里用硬编码值
    document.getElementById('username').value = '陈小薇';
    document.getElementById('nickname').value = '小薇';
    document.getElementById('email').value = 'chenxiaowei@qq.com';
    document.getElementById('phone').value = '132****4435';
    document.getElementById('gender').value = 'female';
    document.getElementById('birthday').value = '2004-12-23';
    document.getElementById('signature').value = '热爱生活，享受美食，喜欢小兔鲜儿的每一件商品！';
    
    // 禁用所有表单控件
    const formControls = document.querySelectorAll('#profileForm .form-control, #profileForm select');
    formControls.forEach(control => {
        control.disabled = true;
    });
}

// 保存个人资料
function saveProfile(e) {
    e.preventDefault();
    
    // 收集表单数据
    const profileData = {
        nickname: document.getElementById('nickname').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        gender: document.getElementById('gender').value,
        birthday: document.getElementById('birthday').value,
        signature: document.getElementById('signature').value
    };
    
    // 这里应该发送到服务器，这里模拟保存
    console.log('保存个人资料:', profileData);
    
    // 显示成功消息
    showToast('资料更新成功', 'success');
    
    // 退出编辑模式
    toggleProfileEdit();
    
    // 更新显示的用户名
    document.getElementById('displayUserName').textContent = profileData.nickname || '陈小薇';
}

// 处理头像上传
function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // 验证文件类型
    if (!file.type.match('image.*')) {
        showToast('请选择图片文件', 'error');
        return;
    }
    
    // 验证文件大小 (2MB)
    if (file.size > 2 * 1024 * 1024) {
        showToast('图片大小不能超过2MB', 'error');
        return;
    }
    
    // 预览图片
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('avatarPreview').src = e.target.result;
        document.getElementById('userAvatar').src = e.target.result;
    };
    reader.readAsDataURL(file);
    
    // 这里应该上传到服务器
    console.log('上传头像:', file.name);
    
    // 显示成功消息
    showToast('头像上传成功', 'success');
}

// 加载用户数据
function loadUserData() {
    // 这里应该从服务器获取用户数据
    // 模拟数据
    const userData = {
        username: '陈小薇',
        nickname: '小薇',
        email: 'chenxiaowei@example.com',
        phone: '132****4435',
        gender: 'female',
        birthday: '2004-12-23',
        signature: '热爱生活，享受美食，喜欢小兔鲜儿的每一件商品！',
        level: '黄金会员',
        avatar: './uploads/avatar.png'
    };
    
    // 更新页面
    document.getElementById('userAvatar').src = userData.avatar;
    document.getElementById('avatarPreview').src = userData.avatar;
}

// 加载最近订单
function loadRecentOrders() {
    // 这里应该从服务器获取订单数据
    // 模拟数据
    const orders = [
        {
            id: '20231215001',
            product: '紫檀外独板三层普洱茶盒',
            image: './uploads/新鲜好物2.png',
            spec: '紫檀木',
            price: '¥566',
            status: 'pending',
            statusText: '待付款',
            date: '2025-12-15'
        },
        {
            id: '20231214002',
            product: 'KN95级莫兰迪色防护口罩',
            image: './uploads/新鲜好物1.png',
            spec: '10只装',
            price: '¥79',
            status: 'delivery',
            statusText: '待发货',
            date: '2025-12-14'
        },
        {
            id: '20231213003',
            product: '法拉蒙高颜值记事本可定制',
            image: './uploads/新鲜好物3.png',
            spec: 'A5大小',
            price: '¥58',
            status: 'completed',
            statusText: '已完成',
            date: '2025-12-13'
        }
    ];
    
    const orderList = document.querySelector('.recent-orders');
    if (!orderList) return;
    
    // 清空现有内容
    orderList.innerHTML = '';
    
    // 生成订单列表
    orders.forEach(order => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div class="order-img">
                <img src="${order.image}" alt="${order.product}">
            </div>
            <div class="order-info">
                <div class="order-title">${order.product}</div>
                <div class="order-spec">${order.spec}</div>
                <div class="order-price">${order.price}</div>
            </div>
            <div class="order-status status-${order.status}">${order.statusText}</div>
            <div class="order-actions">
                <button class="order-btn">查看详情</button>
                ${order.status === 'pending' ? '<button class="order-btn">去付款</button>' : ''}
            </div>
        `;
        orderList.appendChild(orderItem);
    });
}

// 加载收货地址
function loadAddresses() {
    // 这里应该从服务器获取地址数据
    // 模拟数据
    const addresses = [
        {
            id: 1,
            name: '陈小薇',
            phone: '13242284435',
            tag: 'home',
            tagText: '家',
            isDefault: true,
            address: '广东省揭阳市揭东区磐东xxx小区'
        },
        {
            id: 2,
            name: '陈小薇',
            phone: '13242284435',
            tag: 'company',
            tagText: '公司',
            isDefault: false,
            address: '广东省揭阳市五金辉煌不锈公司'
        }
    ];
    
    const addressList = document.querySelector('.address-list');
    if (!addressList) return;
    
    // 清空现有内容
    addressList.innerHTML = '';
    
    // 更新地址数量徽章
    document.getElementById('addressBadge').textContent = addresses.length;
    
    // 生成地址列表
    addresses.forEach(address => {
        const addressCard = document.createElement('div');
        addressCard.className = `address-card ${address.isDefault ? 'default' : ''}`;
        addressCard.innerHTML = `
            <div class="address-header">
                <div class="address-name">${address.name}</div>
                <div class="address-phone">${address.phone}</div>
            </div>
            <div class="address-tag">${address.tagText}</div>
            ${address.isDefault ? '<div class="address-default">默认地址</div>' : ''}
            <div class="address-detail">${address.address}</div>
            <div class="address-actions">
                <button class="address-btn" onclick="editAddress(${address.id})">编辑</button>
                ${!address.isDefault ? '<button class="address-btn" onclick="setDefaultAddress(${address.id})">设为默认</button>' : ''}
                <button class="address-btn delete" onclick="deleteAddress(${address.id})">删除</button>
            </div>
        `;
        addressList.appendChild(addressCard);
    });
}

// 加载收藏商品
function loadFavorites() {
    // 这里应该从服务器获取收藏数据
    // 模拟数据
    const favorites = [
        {
            id: 1,
            name: 'KN95级莫兰迪色防护口罩',
            image: './uploads/新鲜好物1.png',
            price: '¥79'
        },
        {
            id: 2,
            name: '紫檀外独板三层普洱茶盒',
            image: './uploads/新鲜好物2.png',
            price: '¥566'
        },
        {
            id: 3,
            name: '法拉蒙高颜值记事本可定制',
            image: './uploads/新鲜好物3.png',
            price: '¥58'
        },
        {
            id: 4,
            name: '科技布布艺沙发',
            image: './uploads/新鲜好物4.png',
            price: '¥3579'
        },
        {
            id: 5,
            name: '全麦奶油浓香小面包',
            image: './uploads/面包.png',
            price: '¥69'
        },
        {
            id: 6,
            name: '水果面膜韩国蜂蜜柚子茶',
            image: './uploads/蜂蜜.png',
            price: '¥89.99'
        }
    ];
    
    const favoriteList = document.querySelector('.favorite-products');
    if (!favoriteList) return;
    
    // 清空现有内容
    favoriteList.innerHTML = '';
    
    // 更新收藏数量徽章
    document.getElementById('favoriteBadge').textContent = favorites.length;
    
    // 生成收藏列表
    favorites.forEach(item => {
        const favoriteItem = document.createElement('div');
        favoriteItem.className = 'favorite-item';
        favoriteItem.innerHTML = `
            <div class="favorite-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <button class="favorite-remove" onclick="removeFavorite(${item.id})">
                <i class="fas fa-times"></i>
            </button>
            <div class="favorite-info">
                <div class="favorite-title">${item.name}</div>
                <div class="favorite-price">${item.price}</div>
                <div class="favorite-actions">
                    <button class="favorite-btn buy">加入购物车</button>
                    <button class="favorite-btn remove" onclick="removeFavorite(${item.id})">取消收藏</button>
                </div>
            </div>
        `;
        favoriteList.appendChild(favoriteItem);
    });
}

// 加载交易记录
function loadTransactions() {
    // 这里应该从服务器获取交易数据
    // 模拟数据
    const transactions = [
        {
            id: 1,
            title: '商品购买',
            time: '2025-12-15 14:30',
            amount: '+¥566',
            type: 'income'
        },
        {
            id: 2,
            title: '账户充值',
            time: '2025-12-14 10:15',
            amount: '+¥500',
            type: 'income'
        },
        {
            id: 3,
            title: '商品购买',
            time: '2025-12-13 16:45',
            amount: '-¥137',
            type: 'expense'
        },
        {
            id: 4,
            title: '退款',
            time: '2025-12-12 09:20',
            amount: '+¥79',
            type: 'income'
        },
        {
            id: 5,
            title: '商品购买',
            time: '2025-12-11 19:30',
            amount: '-¥210',
            type: 'expense'
        }
    ];
    
    const transactionList = document.querySelector('.transaction-list');
    if (!transactionList) return;
    
    // 清空现有内容
    transactionList.innerHTML = '';
    
    // 生成交易记录列表
    transactions.forEach(transaction => {
        const transactionItem = document.createElement('div');
        transactionItem.className = `transaction-item transaction-${transaction.type}`;
        transactionItem.innerHTML = `
            <div class="transaction-icon">
                <i class="fas ${transaction.type === 'income' ? 'fa-plus' : 'fa-minus'}"></i>
            </div>
            <div class="transaction-info">
                <div class="transaction-title">${transaction.title}</div>
                <div class="transaction-time">${transaction.time}</div>
            </div>
            <div class="transaction-amount">${transaction.amount}</div>
        `;
        transactionList.appendChild(transactionItem);
    });
}

// 加载优惠券
function loadCoupons() {
    // 这里应该从服务器获取优惠券数据
    // 模拟数据
    const coupons = [
        {
            id: 1,
            amount: '50',
            type: 'discount',
            typeText: '满减券',
            title: '满300减50',
            desc: '适用于全平台商品，特殊商品除外',
            validity: '有效期至 2025-12-31',
            status: 'usable'
        },
        {
            id: 2,
            amount: '20',
            type: 'discount',
            typeText: '满减券',
            title: '满200减20',
            desc: '适用于生鲜类商品',
            validity: '有效期至 2025-12-25',
            status: 'usable'
        },
        {
            id: 3,
            amount: '30',
            type: 'discount',
            typeText: '满减券',
            title: '满500减30',
            desc: '适用于家居类商品',
            validity: '有效期至 2025-12-20',
            status: 'used'
        },
        {
            id: 4,
            amount: '100',
            type: 'discount',
            typeText: '满减券',
            title: '满1000减100',
            desc: '适用于全平台商品',
            validity: '有效期至 2025-12-10',
            status: 'expired'
        }
    ];
    
    const couponList = document.querySelector('.coupon-list');
    if (!couponList) return;
    
    // 清空现有内容
    couponList.innerHTML = '';
    
    // 更新优惠券数量徽章
    const usableCount = coupons.filter(c => c.status === 'usable').length;
    document.getElementById('couponBadge').textContent = usableCount;
    
    // 生成优惠券列表
    coupons.forEach(coupon => {
        const couponItem = document.createElement('div');
        couponItem.className = `coupon-item ${coupon.status}`;
        couponItem.innerHTML = `
            <div class="coupon-header">
                <div class="coupon-amount">¥${coupon.amount}<small>元</small></div>
                <div class="coupon-type">${coupon.typeText}</div>
            </div>
            <div class="coupon-body">
                <div class="coupon-title">${coupon.title}</div>
                <div class="coupon-desc">${coupon.desc}</div>
                <div class="coupon-validity">${coupon.validity}</div>
                <button class="coupon-btn">
                    ${coupon.status === 'usable' ? '立即使用' : coupon.status === 'used' ? '已使用' : '已过期'}
                </button>
            </div>
        `;
        couponList.appendChild(couponItem);
    });
}

// 过滤优惠券
function filterCoupons(status) {
    const couponItems = document.querySelectorAll('.coupon-item');
    couponItems.forEach(item => {
        if (status === 'all' || item.classList.contains(status)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// 打开地址模态框
function openAddressModal() {
    document.getElementById('addressModal').style.display = 'flex';
    document.getElementById('modalTitle').textContent = '添加收货地址';
    document.getElementById('addressForm').reset();
}

// 关闭模态框
function closeModal() {
    document.getElementById('addressModal').style.display = 'none';
}

// 保存地址
function saveAddress() {
    const name = document.getElementById('addressName').value;
    const phone = document.getElementById('addressPhone').value;
    const region = document.getElementById('addressRegion').value;
    const detail = document.getElementById('addressDetail').value;
    const isDefault = document.getElementById('isDefault').checked;
    
    if (!name || !phone || !region || !detail) {
        showToast('请填写完整信息', 'error');
        return;
    }
    
    // 这里应该发送到服务器
    console.log('保存地址:', { name, phone, region, detail, isDefault });
    
    // 显示成功消息
    showToast('地址保存成功', 'success');
    
    // 关闭模态框
    closeModal();
    
    // 重新加载地址
    loadAddresses();
}

// 编辑地址
function editAddress(addressId) {
    console.log('编辑地址:', addressId);
    // 这里应该从服务器获取地址信息并填充表单
    openAddressModal();
    document.getElementById('modalTitle').textContent = '编辑收货地址';
    
    // 模拟填充数据
    document.getElementById('addressName').value = '陈小薇';
    document.getElementById('addressPhone').value = '13242284435';
    document.getElementById('addressRegion').value = '广东省揭阳市揭东区';
    document.getElementById('addressDetail').value = 'xxx小区';
    document.getElementById('isDefault').checked = true;
    
    showToast('编辑模式已启用', 'info');
}

// 设置默认地址
function setDefaultAddress(addressId) {
    console.log('设置默认地址:', addressId);
    // 这里应该发送到服务器
    showToast('已设为默认地址', 'success');
    loadAddresses();
}

// 删除地址
function deleteAddress(addressId) {
    if (confirm('确定要删除这个地址吗？')) {
        console.log('删除地址:', addressId);
        // 这里应该发送到服务器
        showToast('地址已删除', 'success');
        loadAddresses();
    }
}

// 移除收藏
function removeFavorite(itemId) {
    if (confirm('确定要移除这个收藏吗？')) {
        console.log('移除收藏:', itemId);
        // 这里应该发送到服务器
        showToast('已移除收藏', 'success');
        loadFavorites();
    }
}

// 处理安全操作
function handleSecurityAction(action) {
    switch(action) {
        case 'changePassword':
            alert('修改密码功能开发中...');
            break;
        case 'changePhone':
            alert('更换手机号功能开发中...');
            break;
        case 'changeEmail':
            alert('更换邮箱功能开发中...');
            break;
    }
}

// 保存设置
function saveSettings() {
    // 收集设置数据
    const settings = {
        orderNotify: document.getElementById('orderNotify').checked,
        promoNotify: document.getElementById('promoNotify').checked,
        systemNotify: document.getElementById('systemNotify').checked,
        publicFavorites: document.getElementById('publicFavorites').checked,
        publicOrders: document.getElementById('publicOrders').checked,
        securityToggle: document.getElementById('securityToggle').checked
    };
    
    // 这里应该发送到服务器
    console.log('保存设置:', settings);
    
    showToast('设置已保存', 'success');
}

// 退出登录
function logout() {
    if (confirm('确定要退出登录吗？')) {
        // 清除登录状态
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userName');
        
        // 跳转到登录页面
        window.location.href = 'login.html';
    }
}

// 显示消息提示
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${getToastIcon(type)}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${getToastTitle(type)}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // 自动移除
    setTimeout(() => {
        toast.remove();
    }, 3000);
    
    // 点击关闭
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
}

// 获取提示图标
function getToastIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// 获取提示标题
function getToastTitle(type) {
    switch(type) {
        case 'success': return '成功';
        case 'error': return '错误';
        case 'warning': return '警告';
        default: return '提示';
    }
}
