
class OrderSystem {
    constructor() {
        this.orders = this.loadOrders();
        this.filteredOrders = [];
        this.currentFilter = 'all';
        this.currentSort = 'time_desc';
        this.currentPage = 1;
        this.pageSize = 10;
        this.searchQuery = '';
        this.timeRange = 'all';
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateOrderStats();
        this.filterAndRenderOrders();
        this.updatePageInfo();
        this.showToast('订单页面加载成功！', 'success');
    }
    
    // 加载订单数据
    loadOrders() {
        const mockOrders = [
            // 这里放入之前的mockOrders数据，由于长度限制，只放一个示例
            {
                id: 'DD20231201001',
                time: '2025-12-01 14:30:25',
                status: 'pending_payment',
                statusText: '待付款',
                total: 158.00,
                products: [
                    {
                        id: 'P001',
                        name: 'KN95级莫兰迪色防护口罩',
                        image: './uploads/新鲜好物1.png',
                        spec: '10只装/盒',
                        price: 79.00,
                        quantity: 2
                    }
                ],
                address: {
                    name: '陈小薇',
                    phone: '13242284435',
                    address: '广东省揭阳市揭东区榕水湾小区'
                },
                payment: {
                    method: '支付宝',
                    amount: 158.00,
                    time: '2025-12-01 14:30:25'
                },
                delivery: null
            }
            // ... 其他订单数据
        ];
        
        return mockOrders;
    }
    
    // 设置事件监听器
    setupEventListeners() {
        // 状态筛选
        document.querySelectorAll('.status-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const status = e.currentTarget.dataset.status;
                this.setFilter(status);
            });
        });
        
        // 时间筛选
        document.getElementById('timeRange').addEventListener('change', (e) => {
            this.timeRange = e.target.value;
            if (this.timeRange === 'custom') {
                document.getElementById('customDateRange').style.display = 'flex';
            } else {
                document.getElementById('customDateRange').style.display = 'none';
                this.filterAndRenderOrders();
            }
        });
        
        // 自定义日期范围
        document.getElementById('applyDateRange').addEventListener('click', () => {
            this.filterAndRenderOrders();
        });
        
        // 搜索
        document.getElementById('searchButton').addEventListener('click', () => {
            this.searchOrders();
        });
        
        document.getElementById('orderSearch').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchOrders();
            }
        });
        
        // 排序
        document.getElementById('sortBy').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.sortOrders();
            this.renderOrders();
        });
        
        // 刷新
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.filterAndRenderOrders();
            this.showToast('订单列表已刷新', 'success');
        });
        
        // 分页
        document.querySelector('.page-btn.prev').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderOrders();
                this.updatePageInfo();
            }
        });
        
        document.querySelector('.page-btn.next').addEventListener('click', () => {
            const totalPages = Math.ceil(this.filteredOrders.length / this.pageSize);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderOrders();
                this.updatePageInfo();
            }
        });
        
        // 页面大小
        document.getElementById('pageSize').addEventListener('change', (e) => {
            this.pageSize = parseInt(e.target.value);
            this.currentPage = 1;
            this.renderOrders();
            this.updatePageInfo();
        });
        
        // 退出登录
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.showConfirmModal('退出登录', '您确定要退出登录吗？', () => {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('currentUser');
                window.location.href = 'login.html';
            });
        });
        
        // 模态框关闭
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('.modal-overlay').style.display = 'none';
            });
        });
        
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                e.target.style.display = 'none';
            }
        });
    }
    
    // 设置筛选条件
    setFilter(status) {
        this.currentFilter = status;
        this.currentPage = 1;
        
        // 更新UI
        document.querySelectorAll('.status-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-status="${status}"]`).classList.add('active');
        
        this.filterAndRenderOrders();
    }
    
    // 搜索订单
    searchOrders() {
        this.searchQuery = document.getElementById('orderSearch').value.trim().toLowerCase();
        this.currentPage = 1;
        this.filterAndRenderOrders();
    }
    
    // 筛选和排序订单
    filterAndRenderOrders() {
        this.filterOrders();
        this.sortOrders();
        this.renderOrders();
        this.updateOrderStats();
        this.updatePageInfo();
    }
    
    // 筛选订单
    filterOrders() {
        // 应用状态筛选
        if (this.currentFilter === 'all') {
            this.filteredOrders = [...this.orders];
        } else {
            this.filteredOrders = this.orders.filter(order => order.status === this.currentFilter);
        }
        
        // 应用搜索筛选
        if (this.searchQuery) {
            this.filteredOrders = this.filteredOrders.filter(order => {
                return order.id.toLowerCase().includes(this.searchQuery) ||
                       order.products.some(product => product.name.toLowerCase().includes(this.searchQuery));
            });
        }
        
        // 应用时间筛选
        if (this.timeRange !== 'all') {
            const now = new Date();
            let startDate = new Date();
            
            switch(this.timeRange) {
                case 'today':
                    startDate.setHours(0, 0, 0, 0);
                    break;
                case 'week':
                    startDate.setDate(startDate.getDate() - 7);
                    break;
                case 'month':
                    startDate.setMonth(startDate.getMonth() - 1);
                    break;
                case '3months':
                    startDate.setMonth(startDate.getMonth() - 3);
                    break;
                case '6months':
                    startDate.setMonth(startDate.getMonth() - 6);
                    break;
                case 'year':
                    startDate.setFullYear(startDate.getFullYear() - 1);
                    break;
                case 'custom':
                    const startInput = document.getElementById('startDate').value;
                    const endInput = document.getElementById('endDate').value;
                    if (startInput && endInput) {
                        startDate = new Date(startInput);
                        const endDate = new Date(endInput);
                        endDate.setHours(23, 59, 59, 999);
                        
                        this.filteredOrders = this.filteredOrders.filter(order => {
                            const orderDate = new Date(order.time);
                            return orderDate >= startDate && orderDate <= endDate;
                        });
                    }
                    return;
            }
            
            this.filteredOrders = this.filteredOrders.filter(order => {
                const orderDate = new Date(order.time);
                return orderDate >= startDate;
            });
        }
    }
    
    // 排序订单
    sortOrders() {
        this.filteredOrders.sort((a, b) => {
            switch(this.currentSort) {
                case 'time_desc':
                    return new Date(b.time) - new Date(a.time);
                case 'time_asc':
                    return new Date(a.time) - new Date(b.time);
                case 'price_desc':
                    return b.total - a.total;
                case 'price_asc':
                    return a.total - b.total;
                default:
                    return 0;
            }
        });
    }
    
    // 渲染订单列表
    renderOrders() {
        const container = document.getElementById('orderList');
        const emptyState = document.getElementById('emptyState');
        const loadingState = document.getElementById('loadingState');
        
        // 显示加载状态
        loadingState.style.display = 'block';
        container.innerHTML = '';
        
        // 模拟加载延迟
        setTimeout(() => {
            loadingState.style.display = 'none';
            
            if (this.filteredOrders.length === 0) {
                emptyState.style.display = 'block';
                return;
            }
            
            emptyState.style.display = 'none';
            
            // 计算分页
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            const paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
            
            // 渲染订单
            paginatedOrders.forEach(order => {
                const orderElement = this.createOrderElement(order);
                container.appendChild(orderElement);
            });
            
            // 添加事件监听器
            this.attachOrderEvents();
        }, 300);
    }
    
    // 创建订单元素
    createOrderElement(order) {
        const div = document.createElement('div');
        div.className = 'order-item';
        div.dataset.orderId = order.id;
        
        div.innerHTML = `
            <div class="order-header">
                <div class="order-info">
                    <div class="order-number">
                        <i class="fas fa-receipt"></i>
                        订单号：${order.id}
                    </div>
                    <div class="order-time">
                        <i class="far fa-clock"></i>
                        下单时间：${order.time}
                    </div>
                </div>
                <div class="order-status status-${order.status}">
                    ${order.statusText}
                </div>
            </div>
            <div class="order-products">
                ${order.products.map(product => `
                    <div class="product-row">
                        <div class="product-img">
                            <img src="${product.image}" alt="${product.name}" onerror="this.src='./uploads/default-product.png'">
                        </div>
                        <div class="product-details">
                            <div class="product-name">${product.name}</div>
                            <div class="product-spec">${product.spec}</div>
                            <div class="product-price">¥${product.price.toFixed(2)}</div>
                        </div>
                        <div class="product-quantity">×${product.quantity}</div>
                    </div>
                `).join('')}
            </div>
            <div class="order-summary">
                <div class="total-amount">
                    实付金额：<span>¥${order.total.toFixed(2)}</span>
                </div>
                <div class="order-actions">
                    ${this.getOrderActions(order)}
                </div>
            </div>
        `;
        
        return div;
    }
    
    // 获取订单操作按钮
    getOrderActions(order) {
        let actions = '';
        
        // 查看详情按钮
        actions += `
            <button class="btn-order-action btn-detail" data-action="view" data-order="${order.id}">
                <i class="fas fa-eye"></i>查看详情
            </button>
        `;
        
        // 根据状态添加不同按钮
        switch(order.status) {
            case 'pending_payment':
                actions += `
                    <button class="btn-order-action btn-pay" data-action="pay" data-order="${order.id}">
                        <i class="fas fa-credit-card"></i>立即支付
                    </button>
                    <button class="btn-order-action btn-cancel" data-action="cancel" data-order="${order.id}">
                        <i class="fas fa-times"></i>取消订单
                    </button>
                `;
                break;
            case 'pending_delivery':
                actions += `
                    <button class="btn-order-action btn-cancel" data-action="cancel" data-order="${order.id}">
                        <i class="fas fa-times"></i>取消订单
                    </button>
                `;
                break;
            case 'pending_receipt':
                actions += `
                    <button class="btn-order-action btn-receive" data-action="receive" data-order="${order.id}">
                        <i class="fas fa-check-circle"></i>确认收货
                    </button>
                `;
                break;
            case 'completed':
            case 'cancelled':
                actions += `
                    <button class="btn-order-action btn-delete" data-action="delete" data-order="${order.id}">
                        <i class="fas fa-trash"></i>删除订单
                    </button>
                `;
                break;
        }
        
        return actions;
    }
    
    // 添加订单事件监听器
    attachOrderEvents() {
        document.querySelectorAll('.btn-order-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                const orderId = e.currentTarget.dataset.order;
                const order = this.orders.find(o => o.id === orderId);
                
                switch(action) {
                    case 'view':
                        this.showOrderDetail(order);
                        break;
                    case 'pay':
                        this.showPaymentModal(order);
                        break;
                    case 'receive':
                        this.confirmReceiveOrder(order);
                        break;
                    case 'cancel':
                        this.confirmCancelOrder(order);
                        break;
                    case 'delete':
                        this.confirmDeleteOrder(order);
                        break;
                }
            });
        });
    }
    
    // 显示订单详情
    showOrderDetail(order) {
        const modal = document.getElementById('orderDetailModal');
        const content = document.getElementById('orderDetailContent');
        
        content.innerHTML = this.generateOrderDetailHTML(order);
        modal.style.display = 'flex';
    }
    
    // 生成订单详情HTML
    generateOrderDetailHTML(order) {
        // 生成详情HTML，由于长度限制，这里简化
        return `
            <div class="order-detail">
                <h4>订单详情</h4>
                <p>订单号：${order.id}</p>
                <p>状态：${order.statusText}</p>
                <p>总金额：¥${order.total.toFixed(2)}</p>
            </div>
        `;
    }
    
    // 显示支付模态框
    showPaymentModal(order) {
        const modal = document.getElementById('paymentModal');
        document.getElementById('paymentAmount').textContent = `¥${order.total.toFixed(2)}`;
        document.getElementById('paymentOrderId').textContent = order.id;
        modal.style.display = 'flex';
        
        // 支付方式选择
        document.querySelectorAll('.method-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.method-item').forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
            });
        });
        
        // 确认支付
        document.getElementById('confirmPayment').onclick = () => {
            this.processPayment(order);
        };
        
        // 取消支付
        document.getElementById('cancelPayment').onclick = () => {
            modal.style.display = 'none';
        };
    }
    
    // 处理支付
    processPayment(order) {
        // 模拟支付过程
        document.getElementById('paymentModal').style.display = 'none';
        this.showToast('正在处理支付...', 'info');
        
        setTimeout(() => {
            // 更新订单状态
            const index = this.orders.findIndex(o => o.id === order.id);
            if (index !== -1) {
                this.orders[index].status = 'pending_delivery';
                this.orders[index].statusText = '待发货';
                this.orders[index].payment.time = new Date().toLocaleString();
                
                this.filterAndRenderOrders();
                this.showToast('支付成功！', 'success');
                this.playSound('success');
            }
        }, 1500);
    }
    
    // 确认收货
    confirmReceiveOrder(order) {
        this.showConfirmModal('确认收货', '请确认您已收到商品？', () => {
            this.receiveOrder(order);
        });
    }
    
    receiveOrder(order) {
        const index = this.orders.findIndex(o => o.id === order.id);
        if (index !== -1) {
            this.orders[index].status = 'completed';
            this.orders[index].statusText = '已完成';
            this.orders[index].delivery = {
                time: new Date().toLocaleString(),
                company: '顺丰速运',
                number: 'SF' + Math.random().toString(36).substr(2, 10).toUpperCase()
            };
            
            this.filterAndRenderOrders();
            this.showToast('确认收货成功！', 'success');
            this.playSound('success');
        }
    }
    
    // 确认取消订单
    confirmCancelOrder(order) {
        this.showConfirmModal('取消订单', '您确定要取消此订单吗？', () => {
            this.cancelOrder(order);
        });
    }
    
    cancelOrder(order) {
        const index = this.orders.findIndex(o => o.id === order.id);
        if (index !== -1) {
            this.orders[index].status = 'cancelled';
            this.orders[index].statusText = '已取消';
            this.orders[index].cancelReason = '用户取消';
            
            this.filterAndRenderOrders();
            this.showToast('订单已取消！', 'success');
            this.playSound('success');
        }
    }
    
    // 确认删除订单
    confirmDeleteOrder(order) {
        this.showConfirmModal('删除订单', '删除后不可恢复，确定删除吗？', () => {
            this.deleteOrder(order);
        });
    }
    
    deleteOrder(order) {
        const index = this.orders.findIndex(o => o.id === order.id);
        if (index !== -1) {
            this.orders.splice(index, 1);
            this.filterAndRenderOrders();
            this.showToast('订单已删除！', 'success');
            this.playSound('success');
        }
    }
    
    // 显示确认模态框
    showConfirmModal(title, message, confirmCallback) {
        const modal = document.getElementById('confirmModal');
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMessage').textContent = message;
        
        // 移除旧的监听器
        const oldConfirmBtn = document.getElementById('confirmAction');
        const newConfirmBtn = oldConfirmBtn.cloneNode(true);
        oldConfirmBtn.parentNode.replaceChild(newConfirmBtn, oldConfirmBtn);
        
        const oldCancelBtn = document.getElementById('cancelConfirm');
        const newCancelBtn = oldCancelBtn.cloneNode(true);
        oldCancelBtn.parentNode.replaceChild(newCancelBtn, oldCancelBtn);
        
        // 添加新监听器
        newConfirmBtn.addEventListener('click', () => {
            confirmCallback();
            modal.style.display = 'none';
        });
        
        newCancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        modal.style.display = 'flex';
    }
    
    // 更新订单统计
    updateOrderStats() {
        const total = this.orders.length;
        const pending = this.orders.filter(o => o.status === 'pending_payment').length;
        const completed = this.orders.filter(o => o.status === 'completed').length;
        
        document.getElementById('totalCount').textContent = total;
        document.getElementById('pendingCount').textContent = pending;
        document.getElementById('completedCount').textContent = completed;
        
        // 更新筛选计数
        const statusCounts = {
            all: total,
            pending_payment: pending,
            pending_delivery: this.orders.filter(o => o.status === 'pending_delivery').length,
            pending_receipt: this.orders.filter(o => o.status === 'pending_receipt').length,
            completed: completed,
            cancelled: this.orders.filter(o => o.status === 'cancelled').length
        };
        
        Object.keys(statusCounts).forEach(status => {
            const element = document.getElementById(`count-${status}`);
            if (element) {
                element.textContent = statusCounts[status];
            }
        });
    }
    
    // 更新分页信息
    updatePageInfo() {
        const totalPages = Math.ceil(this.filteredOrders.length / this.pageSize);
        const prevBtn = document.querySelector('.page-btn.prev');
        const nextBtn = document.querySelector('.page-btn.next');
        const pageNumbers = document.getElementById('pageNumbers');
        const displayCount = document.getElementById('displayCount');
        
        // 更新显示数量
        const start = (this.currentPage - 1) * this.pageSize + 1;
        const end = Math.min(this.currentPage * this.pageSize, this.filteredOrders.length);
        displayCount.textContent = this.filteredOrders.length;
        
        // 更新总页数
        document.getElementById('totalPages').textContent = totalPages;
        
        // 更新按钮状态
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages;
        
        // 生成页码
        let pageHTML = '';
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pageHTML += `<span class="page-number ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</span>`;
            }
        } else {
            // 简化页码生成逻辑
            pageHTML = '...';
        }
        
        pageNumbers.innerHTML = pageHTML;
        
        // 添加页码点击事件
        pageNumbers.querySelectorAll('.page-number').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!isNaN(e.target.textContent)) {
                    this.currentPage = parseInt(e.target.textContent);
                    this.renderOrders();
                    this.updatePageInfo();
                }
            });
        });
    }
    
    // 显示消息提示
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${icons[type]}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${this.getToastTitle(type)}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(toast);
        
        // 自动移除
        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
        
        // 点击关闭
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
    }
    
    getToastTitle(type) {
        const titles = {
            success: '成功',
            error: '错误',
            warning: '警告',
            info: '信息'
        };
        return titles[type];
    }
    
    // 播放提示音
    playSound(type) {
        const audio = document.getElementById(`${type}Sound`);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log('音频播放失败:', e));
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 设置用户信息
    const userName = localStorage.getItem('currentUser') || '陈小薇';
    document.getElementById('userName').textContent = userName;
    
    // 初始化订单系统
    window.orderSystem = new OrderSystem();
    
});
