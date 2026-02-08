(function () {
    const buttons = document.querySelectorAll('[data-lang-target]');
    const blocks = document.querySelectorAll('.language-block[data-lang]');
    const KEY = 'trekreel-site-lang';

    // Apply language selection
    function applyLang(lang) {
        // Toggle visibility of content blocks
        blocks.forEach(block => {
            const isVisible = block.getAttribute('data-lang') === lang;
            block.classList.toggle('is-visible', isVisible);
        });

        // Toggle active state of buttons
        buttons.forEach(btn => {
            const isActive = btn.getAttribute('data-lang-target') === lang;
            btn.classList.toggle('is-active', isActive);
        });

        // Update HTML lang attribute
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    }

    // Event Listeners
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang-target') || 'zh';
            localStorage.setItem(KEY, lang);
            applyLang(lang);
        });
    });

    // Initialization
    // Check local storage or browser preference
    let saved = localStorage.getItem(KEY);
    if (!saved) {
        const browserLang = navigator.language || navigator.userLanguage;
        saved = browserLang.startsWith('zh') ? 'zh' : 'en';
    }
    applyLang(saved);

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .hero-content, .hero-carousel-container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Carousel Logic
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    let currentSlide = 0;
    let carouselInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('is-active'));
        dots.forEach(dot => dot.classList.remove('is-active'));

        // Handle wrapping
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        slides[currentSlide].classList.add('is-active');
        dots[currentSlide].classList.add('is-active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startCarousel() {
        if (carouselInterval) clearInterval(carouselInterval);
        carouselInterval = setInterval(nextSlide, 5000); // 5 seconds per slide
    }

    function stopCarousel() {
        if (carouselInterval) clearInterval(carouselInterval);
    }

    if (slides.length > 0) {
        // Event listeners for controls
        nextBtn.addEventListener('click', () => {
            stopCarousel();
            nextSlide();
            startCarousel();
        });

        prevBtn.addEventListener('click', () => {
            stopCarousel();
            prevSlide();
            startCarousel();
        });

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                stopCarousel();
                showSlide(parseInt(dot.dataset.index));
                startCarousel();
            });
        });

        // Start auto-play
        startCarousel();
    }
})();
