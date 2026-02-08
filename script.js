(function () {
    const buttons = document.querySelectorAll('[data-lang-target]');
    const blocks = document.querySelectorAll('.language-block[data-lang]');
    const KEY = 'trekreel-site-lang';
    const SUPPORTED_LANGS = ['zh', 'en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'ru', 'ar', 'hi'];
    const HTML_LANG_MAP = {
        zh: 'zh-CN',
        en: 'en',
        es: 'es',
        fr: 'fr',
        de: 'de',
        it: 'it',
        pt: 'pt-BR',
        ja: 'ja',
        ko: 'ko',
        ru: 'ru',
        ar: 'ar',
        hi: 'hi',
    };

    function normalizeLang(lang) {
        if (SUPPORTED_LANGS.includes(lang)) return lang;
        return 'zh';
    }

    function detectBrowserLang() {
        const locale = (navigator.language || navigator.userLanguage || '').toLowerCase();
        if (locale.startsWith('zh')) return 'zh';
        if (locale.startsWith('es')) return 'es';
        if (locale.startsWith('fr')) return 'fr';
        if (locale.startsWith('de')) return 'de';
        if (locale.startsWith('it')) return 'it';
        if (locale.startsWith('pt')) return 'pt';
        if (locale.startsWith('ja')) return 'ja';
        if (locale.startsWith('ko')) return 'ko';
        if (locale.startsWith('ru')) return 'ru';
        if (locale.startsWith('ar')) return 'ar';
        if (locale.startsWith('hi')) return 'hi';
        return 'en';
    }

    function getLocalizedText(entries, lang) {
        for (const entry of entries) {
            const block = document.querySelector(`${entry.block}[data-lang="${lang}"]`)
                || document.querySelector(`${entry.block}[data-lang="en"]`)
                || document.querySelector(`${entry.block}[data-lang="zh"]`);
            if (!block) continue;

            const node = entry.text ? block.querySelector(entry.text) : block;
            if (!node) continue;

            const text = node.textContent?.replace(/\s+/g, ' ').trim();
            if (text) return text;
        }
        return '';
    }

    function updatePageMeta(lang) {
        const titleText = getLocalizedText([
            { block: '.page-header .language-block', text: 'h1' },
            { block: '.page-title .language-block', text: 'h1' },
            { block: '.hero-content .language-block', text: '.hero-title' },
        ], lang);

        const descText = getLocalizedText([
            { block: '.page-header .language-block', text: 'p' },
            { block: '.page-title .language-block', text: 'p' },
            { block: '.hero-content .language-block', text: '.hero-subtitle' },
        ], lang);

        if (titleText) {
            document.title = titleText.includes('TrekReel')
                ? titleText
                : `TrekReel | ${titleText}`;
        }

        if (descText) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.setAttribute('content', descText);
        }
    }

    // Dropdown Elements
    const langDropdown = document.querySelector('.lang-dropdown');
    const langToggle = document.querySelector('.lang-toggle');
    const currentLangLabel = document.querySelector('.current-lang-label');

    // Apply language selection
    function applyLang(lang) {
        const normalized = normalizeLang(lang);
        // Toggle visibility of content blocks
        blocks.forEach(block => {
            const isVisible = block.getAttribute('data-lang') === normalized;
            block.classList.toggle('is-visible', isVisible);
        });

        // Toggle active state of buttons
        buttons.forEach(btn => {
            const isTarget = btn.getAttribute('data-lang-target') === normalized;
            btn.classList.toggle('is-active', isTarget);

            // Update dropdown label if this is the active button
            if (isTarget && currentLangLabel) {
                currentLangLabel.textContent = btn.textContent;
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = HTML_LANG_MAP[normalized] || 'en';
        updatePageMeta(normalized);

        // Close dropdown
        if (langDropdown) {
            langDropdown.classList.remove('is-open');
            if (langToggle) langToggle.setAttribute('aria-expanded', 'false');
        }
    }

    // Event Listeners
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = normalizeLang(btn.getAttribute('data-lang-target') || 'zh');
            localStorage.setItem(KEY, lang);
            applyLang(lang);
        });
    });

    // Dropdown Toggle Logic
    if (langToggle && langDropdown) {
        langToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = langDropdown.classList.contains('is-open');
            langDropdown.classList.toggle('is-open', !isOpen);
            langToggle.setAttribute('aria-expanded', !isOpen);
        });

        document.addEventListener('click', (e) => {
            if (!langDropdown.contains(e.target)) {
                langDropdown.classList.remove('is-open');
                langToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Initialization
    // Check local storage or browser preference
    const stored = localStorage.getItem(KEY);
    let saved = SUPPORTED_LANGS.includes(stored) ? stored : null;
    if (!saved) {
        saved = detectBrowserLang();
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
