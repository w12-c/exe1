// 登录页面脚本 - 添加注册功能

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const backToLoginBtn = document.getElementById('backToLogin');
    const switchToRegisterBtn = document.getElementById('switchToRegister');
    const showRegisterModalBtn = document.getElementById('showRegisterModal');
    const closeRegisterModalBtn = document.getElementById('closeRegisterModal');
    const registerModal = document.getElementById('registerModal');
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const toggleRegisterPasswordBtn = document.getElementById('toggleRegisterPassword');
    const goHomeBtn = document.getElementById('goHomeBtn');
    const goShoppingBtn = document.getElementById('goShoppingBtn');
    const registerSuccess = document.getElementById('registerSuccess');
    
    // 登录表单相关
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
    const rememberCheckbox = document.getElementById('remember');
    
    // 注册表单相关
    const registerPhoneInput = document.getElementById('registerPhone');
    const verificationCodeInput = document.getElementById('verificationCode');
    const registerUsernameInput = document.getElementById('registerUsername');
    const registerPasswordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const agreeTermsCheckbox = document.getElementById('agreeTerms');
    const countryCodeSelect = document.getElementById('countryCode');
    
    // 错误信息元素
    const phoneError = document.getElementById('phoneError');
    const codeError = document.getElementById('codeError');
    const registerUsernameError = document.getElementById('registerUsernameError');
    const registerPasswordError = document.getElementById('registerPasswordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const agreementError = document.getElementById('agreementError');
    
    // 检查本地存储中是否有保存的登录信息
    checkRememberedLogin();
    
    // 表单切换
    switchToRegisterBtn.addEventListener('click', function(event) {
        event.preventDefault();
        showRegisterForm();
    });
    
    backToLoginBtn.addEventListener('click', function(event) {
        event.preventDefault();
        showLoginForm();
    });
    
    showRegisterModalBtn.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
            // 移动端显示模态框
            registerModal.style.display = 'flex';
        } else {
            // 桌面端切换表单
            showRegisterForm();
        }
    });
    
    closeRegisterModalBtn.addEventListener('click', function() {
        registerModal.style.display = 'none';
    });
    
    // 点击模态框背景关闭
    registerModal.addEventListener('click', function(event) {
        if (event.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });
    
    // 登录表单提交事件
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        handleLogin();
    });
    
    // 注册表单提交事件
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        handleRegister();
    });
    
    // 登录按钮点击事件
    loginBtn.addEventListener('click', function() {
        handleLogin();
    });
    
    // 注册按钮点击事件
    registerBtn.addEventListener('click', function() {
        handleRegister();
    });
    
    // 发送验证码按钮点击事件
    sendCodeBtn.addEventListener('click', function() {
        sendVerificationCode();
    });
    
    // 显示/隐藏密码功能
    togglePasswordBtn.addEventListener('click', function() {
        togglePasswordVisibility(passwordInput, togglePasswordBtn);
    });
    
    if (toggleRegisterPasswordBtn) {
        toggleRegisterPasswordBtn.addEventListener('click', function() {
            togglePasswordVisibility(registerPasswordInput, toggleRegisterPasswordBtn);
        });
    }
    
    // 返回首页按钮
    goHomeBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    // 去购物按钮
    goShoppingBtn.addEventListener('click', function() {
        window.location.href = 'category.html?type=fresh';
    });
    
    // 实时表单验证
    setupFormValidation();
    
    // 显示注册表单
    function showRegisterForm() {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        registerSuccess.style.display = 'none';
        clearRegisterErrors();
    }
    
    // 显示登录表单
    function showLoginForm() {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        registerSuccess.style.display = 'none';
        clearLoginErrors();
    }
    
    // 处理登录
    function handleLogin() {
        clearLoginErrors();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        let isValid = true;
        
        // 验证用户名
        if (username === '') {
            showLoginError(usernameError, '请输入用户名、手机号或邮箱');
            isValid = false;
        } else if (!isValidUsername(username)) {
            showLoginError(usernameError, '请输入正确的用户名、手机号或邮箱');
            isValid = false;
        }
        
        // 验证密码
        if (password === '') {
            showLoginError(passwordError, '请输入密码');
            isValid = false;
        } else if (password.length < 6) {
            showLoginError(passwordError, '密码长度至少6位');
            isValid = false;
        }
        
        if (!isValid) {
            showToast('登录失败', '请检查输入信息', 'error');
            playErrorSound();
            return;
        }
        
        // 显示加载状态
        loginBtn.classList.add('loading');
        
        // 模拟登录过程
        simulateLogin(username, password);
    }
    
    // 处理注册
    function handleRegister() {
        clearRegisterErrors();
        
        const phone = registerPhoneInput.value.trim();
        const countryCode = countryCodeSelect.value;
        const code = verificationCodeInput.value.trim();
        const username = registerUsernameInput.value.trim();
        const password = registerPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        const agreeTerms = agreeTermsCheckbox.checked;
        
        let isValid = true;
        
        // 验证手机号
        if (phone === '') {
            showRegisterError(phoneError, '请输入手机号');
            isValid = false;
        } else if (!isValidPhone(phone)) {
            showRegisterError(phoneError, '请输入正确的手机号');
            isValid = false;
        }
        
        // 验证验证码
        if (code === '') {
            showRegisterError(codeError, '请输入验证码');
            isValid = false;
        } else if (code.length !== 6) {
            showRegisterError(codeError, '验证码为6位数字');
            isValid = false;
        }
        
        // 验证用户名
        if (username === '') {
            showRegisterError(registerUsernameError, '请输入用户名');
            isValid = false;
        } else if (!isValidRegisterUsername(username)) {
            showRegisterError(registerUsernameError, '用户名必须为3-20位字母、数字或下划线');
            isValid = false;
        }
        
        // 验证密码
        if (password === '') {
            showRegisterError(registerPasswordError, '请输入密码');
            isValid = false;
        } else if (password.length < 6) {
            showRegisterError(registerPasswordError, '密码长度至少6位');
            isValid = false;
        }
        
        // 验证确认密码
        if (confirmPassword === '') {
            showRegisterError(confirmPasswordError, '请再次输入密码');
            isValid = false;
        } else if (password !== confirmPassword) {
            showRegisterError(confirmPasswordError, '两次输入的密码不一致');
            isValid = false;
        }
        
        // 验证协议
        if (!agreeTerms) {
            showRegisterError(agreementError, '请同意用户服务协议和隐私政策');
            isValid = false;
        }
        
        if (!isValid) {
            showToast('注册失败', '请检查输入信息', 'error');
            playErrorSound();
            return;
        }
        
        // 显示加载状态
        registerBtn.classList.add('loading');
        
        // 模拟注册过程
        simulateRegister(phone, countryCode, username, password);
    }
    
    // 发送验证码
    function sendVerificationCode() {
        const phone = registerPhoneInput.value.trim();
        const countryCode = countryCodeSelect.value;
        
        if (phone === '') {
            showRegisterError(phoneError, '请输入手机号');
            showToast('提示', '请输入手机号', 'warning');
            playErrorSound();
            return;
        }
        
        if (!isValidPhone(phone)) {
            showRegisterError(phoneError, '请输入正确的手机号');
            showToast('提示', '请输入正确的手机号', 'warning');
            playErrorSound();
            return;
        }
        
        // 禁用发送按钮
        sendCodeBtn.disabled = true;
        sendCodeBtn.textContent = '60秒后重试';
        
        // 模拟发送验证码
        showToast('验证码已发送', '验证码已发送到您的手机，请注意查收', 'success');
        playSuccessSound();
        
        // 倒计时
        let countdown = 60;
        const timer = setInterval(() => {
            countdown--;
            sendCodeBtn.textContent = `${countdown}秒后重试`;
            
            if (countdown <= 0) {
                clearInterval(timer);
                sendCodeBtn.disabled = false;
                sendCodeBtn.textContent = '获取验证码';
            }
        }, 1000);
    }
    
    // 模拟登录过程
    function simulateLogin(username, password) {
        setTimeout(() => {
            const testAccounts = [
                { username: 'cxw', password: '123456' },
                { username: '508739754@qq.com', password: '123456' },
                { username: '13242284435', password: '123456' },
                { username: '25216950303', password: '123456' }
            ];
            
            const isValid = testAccounts.some(account => 
                (account.username === username && account.password === password)
            );
            
            if (isValid) {
                loginSuccess(username);
            } else {
                loginFailed();
            }
        }, 1500);
    }
    
    // 模拟注册过程
    function simulateRegister(phone, countryCode, username, password) {
        setTimeout(() => {
            registerSuccessFunc(phone, username);
        }, 2000);
    }
    
    // 登录成功处理
    function loginSuccess(username) {
        loginBtn.classList.remove('loading');
        
        // 保存登录状态
        if (rememberCheckbox.checked) {
            saveLoginInfo(username);
        } else {
            clearLoginInfo();
        }
        
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', username);
        
        showToast('登录成功', '欢迎回来！正在为您跳转到首页...', 'success');
        playSuccessSound();
        
        // 跳转到首页
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
    
    // 登录失败处理
    function loginFailed() {
        loginBtn.classList.remove('loading');
        showLoginError(usernameError, '用户名或密码错误');
        showLoginError(passwordError, '用户名或密码错误');
        showToast('登录失败', '用户名或密码错误，请重新输入', 'error');
        playErrorSound();
    }
    
    // 注册成功处理
    function registerSuccessFunc(phone, username) {
        registerBtn.classList.remove('loading');
        
        // 隐藏注册表单，显示成功提示
        registerForm.style.display = 'none';
        registerSuccess.style.display = 'block';
        
        // 自动登录
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', username);
        
        showToast('注册成功', '账号已创建，正在为您自动登录...', 'success');
        playSuccessSound();
    }
    
    // 验证用户名格式
    function isValidUsername(value) {
        const phoneRegex = /^1[3-9]\d{9}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        
        return phoneRegex.test(value) || emailRegex.test(value) || usernameRegex.test(value);
    }
    
    // 验证手机号格式
    function isValidPhone(value) {
        const phoneRegex = /^1[3-9]\d{9}$/;
        return phoneRegex.test(value);
    }
    
    // 验证注册用户名格式
    function isValidRegisterUsername(value) {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(value);
    }
    
    // 保存登录信息
    function saveLoginInfo(username) {
        const loginInfo = { username: username, remember: true };
        localStorage.setItem('loginInfo', JSON.stringify(loginInfo));
    }
    
    // 清除登录信息
    function clearLoginInfo() {
        localStorage.removeItem('loginInfo');
    }
    
    // 检查保存的登录信息
    function checkRememberedLogin() {
        const savedLoginInfo = localStorage.getItem('loginInfo');
        
        if (savedLoginInfo) {
            const loginInfo = JSON.parse(savedLoginInfo);
            if (loginInfo.remember) {
                usernameInput.value = loginInfo.username;
                rememberCheckbox.checked = true;
                passwordInput.focus();
            }
        } else {
            usernameInput.focus();
        }
    }
    
    // 清除登录错误
    function clearLoginErrors() {
        usernameError.textContent = '';
        passwordError.textContent = '';
        usernameInput.style.borderColor = '#e0e0e0';
        passwordInput.style.borderColor = '#e0e0e0';
    }
    
    // 清除注册错误
    function clearRegisterErrors() {
        phoneError.textContent = '';
        codeError.textContent = '';
        registerUsernameError.textContent = '';
        registerPasswordError.textContent = '';
        confirmPasswordError.textContent = '';
        agreementError.textContent = '';
        
        registerPhoneInput.style.borderColor = '#e0e0e0';
        verificationCodeInput.style.borderColor = '#e0e0e0';
        registerUsernameInput.style.borderColor = '#e0e0e0';
        registerPasswordInput.style.borderColor = '#e0e0e0';
        confirmPasswordInput.style.borderColor = '#e0e0e0';
    }
    
    // 显示登录错误
    function showLoginError(errorElement, message) {
        errorElement.textContent = message;
        errorElement.style.display = 'flex';
    }
    
    // 显示注册错误
    function showRegisterError(errorElement, message) {
        errorElement.textContent = message;
        errorElement.style.display = 'flex';
    }
    
    // 切换密码可见性
    function togglePasswordVisibility(passwordInput, toggleBtn) {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        if (type === 'text') {
            toggleBtn.classList.remove('fa-eye');
            toggleBtn.classList.add('fa-eye-slash');
        } else {
            toggleBtn.classList.remove('fa-eye-slash');
            toggleBtn.classList.add('fa-eye');
        }
    }
    
    // 设置表单实时验证
    function setupFormValidation() {
        // 登录表单实时验证
        usernameInput.addEventListener('input', () => {
            const username = usernameInput.value.trim();
            if (isValidUsername(username)) {
                usernameError.textContent = '';
                usernameInput.style.borderColor = '#27ba9b';
            } else {
                usernameInput.style.borderColor = '#e0e0e0';
            }
        });
        
        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value.trim();
            if (password.length >= 6) {
                passwordError.textContent = '';
                passwordInput.style.borderColor = '#27ba9b';
            } else {
                passwordInput.style.borderColor = '#e0e0e0';
            }
        });
        
        // 注册表单实时验证
        registerPhoneInput.addEventListener('input', () => {
            const phone = registerPhoneInput.value.trim();
            if (isValidPhone(phone)) {
                phoneError.textContent = '';
                registerPhoneInput.style.borderColor = '#27ba9b';
            } else {
                registerPhoneInput.style.borderColor = '#e0e0e0';
            }
        });
        
        registerUsernameInput.addEventListener('input', () => {
            const username = registerUsernameInput.value.trim();
            if (isValidRegisterUsername(username)) {
                registerUsernameError.textContent = '';
                registerUsernameInput.style.borderColor = '#27ba9b';
            } else {
                registerUsernameInput.style.borderColor = '#e0e0e0';
            }
        });
        
        registerPasswordInput.addEventListener('input', () => {
            const password = registerPasswordInput.value.trim();
            if (password.length >= 6) {
                registerPasswordError.textContent = '';
                registerPasswordInput.style.borderColor = '#27ba9b';
            } else {
                registerPasswordInput.style.borderColor = '#e0e0e0';
            }
        });
        
        confirmPasswordInput.addEventListener('input', () => {
            const password = registerPasswordInput.value.trim();
            const confirmPassword = confirmPasswordInput.value.trim();
            if (confirmPassword !== '' && password === confirmPassword) {
                confirmPasswordError.textContent = '';
                confirmPasswordInput.style.borderColor = '#27ba9b';
            } else {
                confirmPasswordInput.style.borderColor = '#e0e0e0';
            }
        });
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
    
    // 播放成功音效
    function playSuccessSound() {
        const successSound = document.getElementById('successSound');
        if (successSound) {
            successSound.currentTime = 0;
            successSound.play().catch(e => console.log('音频播放失败:', e));
        }
    }
    
    // 播放错误音效
    function playErrorSound() {
        const errorSound = document.getElementById('errorSound');
        if (errorSound) {
            errorSound.currentTime = 0;
            errorSound.play().catch(e => console.log('音频播放失败:', e));
        }
    }
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
    `;
    document.head.appendChild(style);
});
