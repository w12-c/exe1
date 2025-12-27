// 轮播图功能 - 快速切换版
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const slideCount = slides.length;
    
    // 切换速度（毫秒）- 改为2秒切换一次
    const SLIDE_INTERVAL = 2000;
    
    // 切换动画持续时间（毫秒）- 缩短为300ms
    const TRANSITION_DURATION = 300;

    // 显示指定索引的幻灯片
    function showSlide(index) {
        // 隐藏当前幻灯片
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        // 更新当前索引
        currentSlide = index;
        
        // 显示新幻灯片
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    // 切换到下一张
    function nextSlide() {
        let nextIndex = (currentSlide + 1) % slideCount;
        showSlide(nextIndex);
    }

    // 切换到上一张
    function prevSlide() {
        let prevIndex = (currentSlide - 1 + slideCount) % slideCount;
        showSlide(prevIndex);
    }

    // 为指示点添加点击事件（立即切换）
    dots.forEach(dot => {
        dot.addEventListener('click', function(e) {
            e.preventDefault();
            const index = parseInt(this.getAttribute('data-index'));
            if (index !== currentSlide) {
                showSlide(index);
                resetAutoSlide(); // 点击后重置自动轮播
            }
        });
    });

    // 自动轮播功能
    let slideTimer;
    
    function startAutoSlide() {
        slideTimer = setInterval(nextSlide, SLIDE_INTERVAL);
    }
    
    function stopAutoSlide() {
        clearInterval(slideTimer);
    }
    
    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    // 初始化显示第一张图片
    showSlide(0);
    
    // 启动自动轮播
    startAutoSlide();

    // 鼠标悬停时暂停轮播
    const bannerContainer = document.querySelector('.banner_slides');
    bannerContainer.addEventListener('mouseenter', stopAutoSlide);
    bannerContainer.addEventListener('mouseleave', startAutoSlide);

    // 键盘左右键控制（可选功能）
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoSlide();
        }
    });
});
