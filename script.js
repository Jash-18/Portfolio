// --- Run animations only after the page is fully loaded ---
window.onload = () => {
    // --- Hide Pre-loader ---
    const preloader = document.getElementById('preloader');
    preloader.classList.add('loaded');
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 500);

    // --- Staggered Load-in Animation for Bento Items ---
    document.querySelectorAll('.bento-item').forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('visible');
        }, index * 100);
    });

    // --- Trigger letter reveal for hero section after a delay ---
    setTimeout(() => {
        const heroTitles = document.querySelectorAll('#profile [data-reveal-letters]');
        heroTitles.forEach(title => {
            title.classList.add('visible');
            const letters = title.querySelectorAll('span');
            letters.forEach((span, index) => {
                span.style.transitionDelay = `${index * 30}ms`;
            });
        });
    }, 500);

    // --- Global mouse position object ---
    const mouse = { x: 0, y: 0 };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // --- Theme Toggler ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
    });
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
    }

    // --- Certifications Modal Logic ---
    const pegaSkillBtn = document.getElementById('pega-skill-btn');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    pegaSkillBtn.addEventListener('click', () => {
        modalOverlay.classList.add('visible');
    });
    modalCloseBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('visible');
    });
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('visible');
        }
    });

    // --- Live Clock ---
    const timeDisplay = document.getElementById('time-display');
    function updateTime() {
        const now = new Date();
        const options = { timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit' };
        timeDisplay.textContent = now.toLocaleTimeString('en-US', options);
    }
    setInterval(updateTime, 1000);
    updateTime();

    // --- Letter Reveal Function ---
    function setupLetterReveal(elements) {
        elements.forEach(element => {
            const text = element.textContent;
            element.innerHTML = '';
            text.split('').forEach((char) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                element.appendChild(span);
            });
        });
    }

    // --- Intersection Observer for Scroll Animations ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                const titles = entry.target.querySelectorAll('[data-reveal-letters]');
                titles.forEach(title => {
                    const letters = title.querySelectorAll('span');
                    letters.forEach((span, index) => {
                        span.style.transitionDelay = `${index * 30}ms`;
                    });
                });
            }
        });
    }, { threshold: 0.2 });

    setupLetterReveal(document.querySelectorAll('[data-reveal-letters]'));
    document.querySelectorAll('.content-section').forEach(section => {
        observer.observe(section);
    });
    
    // --- Central Animation Loop ---
    const cursorLight = document.getElementById('cursor-light');
    function animationLoop() {
        cursorLight.style.transform = `translate(${mouse.x - cursorLight.offsetWidth / 2}px, ${mouse.y - cursorLight.offsetHeight / 2}px)`;
        requestAnimationFrame(animationLoop);
    }
    animationLoop();


    // --- Scroll-based Animations ---
    const hero = document.querySelector('.sticky-hero');
    const scrollProgressBar = document.getElementById('scroll-progress-bar');
    const parallaxItems = document.querySelectorAll('[data-parallax]');
    let lastScrollY = window.scrollY;
    let scrollTimeout;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        if (scrollY > lastScrollY) {
            body.classList.add('scrolling-down');
            body.classList.remove('scrolling-up');
        } else {
            body.classList.add('scrolling-up');
            body.classList.remove('scrolling-down');
        }
        lastScrollY = scrollY <= 0 ? 0 : scrollY;
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            body.classList.remove('scrolling-down', 'scrolling-up');
        }, 150);

        hero.classList.toggle('scrolled', scrollY > 50);
        hero.classList.toggle('hidden', scrollY > 300);

        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0;
        scrollProgressBar.style.width = `${progress}%`;

        parallaxItems.forEach(item => {
            const speed = parseFloat(item.dataset.parallax);
            item.style.transform = `translateY(${scrollY * speed * 0.5}px)`;
        });

    }, { passive: true });
    
    // --- 3D Card Tilt Effect ---
    document.querySelectorAll('.project-card').forEach(card => {
        const sensitivity = 20;
        card.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = card.getBoundingClientRect();
            const x = e.clientX - left;
            const y = e.clientY - top;
            const rotateX = -(y - height / 2) / sensitivity;
            const rotateY = (x - width / 2) / sensitivity;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // --- "Slide to Contact" Logic ---
    const sliderHandle = document.getElementById('slider-handle');
    const sliderTrack = document.getElementById('contact-slider-track');
    const sliderText = document.querySelector('.slider-text');
    const sliderLink = document.getElementById('contact-slider-link');

    let isDragging = false;
    
    function startDrag(e) {
        e.preventDefault();
        isDragging = true;
    }

    function onDrag(e) {
        if (!isDragging) return;
        const currentX = e.touches ? e.touches[0].clientX : e.clientX;
        const trackRect = sliderTrack.getBoundingClientRect();
        const handleWidth = sliderHandle.offsetWidth;
        
        let newX = currentX - trackRect.left - (handleWidth / 2);

        if (newX < 0) newX = 0;
        if (newX > trackRect.width - handleWidth) newX = trackRect.width - handleWidth;
        
        sliderHandle.style.transform = `translateX(${newX}px)`;
        sliderText.style.opacity = 1 - (newX / (trackRect.width / 2));
    }

    function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        
        const trackWidth = sliderTrack.offsetWidth;
        const threshold = trackWidth * 0.8;
        let finalX = sliderHandle.getBoundingClientRect().left - sliderTrack.getBoundingClientRect().left;

        if (finalX > threshold) {
            window.location.href = sliderLink.href;
        }

        sliderHandle.style.transition = 'transform 0.3s ease';
        sliderHandle.style.transform = 'translateX(0px)';
        sliderText.style.opacity = 1;
        
        setTimeout(() => {
            sliderHandle.style.transition = '';
        }, 300);
    }

    sliderHandle.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', endDrag);

    sliderHandle.addEventListener('touchstart', startDrag, { passive: false });
    window.addEventListener('touchmove', onDrag);
    window.addEventListener('touchend', endDrag);
};