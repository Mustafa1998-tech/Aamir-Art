/* =====================================================
   AAMIR ART — Vanilla JavaScript
   Orchid-Inspired Interactions & Animations
   ===================================================== */

(function () {
    'use strict';

    // ============================================
    // 1. SCROLL REVEAL — Intersection Observer
    // ============================================
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const parent = entry.target.parentElement;
                    const siblings = parent
                        ? Array.from(parent.querySelectorAll('.reveal'))
                        : [entry.target];
                    const index = siblings.indexOf(entry.target);
                    const delay = Math.min(index * 100, 400);

                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);

                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        }
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    // ============================================
    // 2. SMOOTH SCROLLING (internal links)
    // ============================================
    const scrollLinks = document.querySelectorAll(
        'a[href^="#"]:not([href="#"])'
    );

    scrollLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            const nav = document.querySelector('.nav');
            const navHeight = nav ? nav.offsetHeight : 0;
            const targetPosition =
                target.getBoundingClientRect().top + window.scrollY - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth',
            });

            closeMobileMenu();
        });
    });

    // ============================================
    // 3. NAVBAR SCROLL EFFECT
    // ============================================
    const nav = document.querySelector('.nav');

    function handleNavScroll() {
        if (window.scrollY > 50) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // ============================================
    // 4. MOBILE MENU TOGGLE
    // ============================================
    const toggleBtn = document.querySelector('.nav__toggle');
    const mobileMenu = document.getElementById('mobileMenu');

    function openMobileMenu() {
        toggleBtn.classList.add('active');
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        toggleBtn.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (toggleBtn && mobileMenu) {
        toggleBtn.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        mobileMenu.querySelectorAll('.mobile-menu__link').forEach((link) => {
            link.addEventListener('click', closeMobileMenu);
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && mobileMenu.classList.contains('open')) {
                closeMobileMenu();
            }
        });
    }

    // ============================================
    // 5. CURSOR FOLLOW (subtle dot) — desktop only
    // ============================================
    const cursor = document.createElement('div');
    cursor.classList.add('cursor-dot');
    document.body.appendChild(cursor);

    let cursorVisible = false;

    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
        if (!cursorVisible) {
            cursorVisible = true;
            cursor.style.opacity = '1';
        }
    });

    document.addEventListener('mouseleave', () => {
        cursorVisible = false;
        cursor.style.opacity = '0';
    });

    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        cursor.remove();
    }

    // ============================================
    // 6. ACTIVE NAV LINK ON SCROLL
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    function updateActiveLink() {
        let current = '';
        const scrollPos = window.scrollY + 200;

        sections.forEach((section) => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            if (scrollPos >= top && scrollPos < bottom) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            link.classList.remove('nav__link--active');
            if (href === `#${current}`) {
                link.classList.add('nav__link--active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();

    // ============================================
    // 7. STAT COUNTER ANIMATION
    // ============================================
    function animateCounters() {
        document.querySelectorAll('.about__stat-number').forEach((el) => {
            const text = el.textContent;
            const target = parseInt(text);
            if (isNaN(target)) return;

            const suffix = text.replace(/[\d]/g, '');
            const duration = 1500;
            const start = performance.now();

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * target);
                el.textContent = current + suffix;
                if (progress < 1) requestAnimationFrame(update);
            }

            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        requestAnimationFrame(update);
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            counterObserver.observe(el);
        });
    }

    animateCounters();

    // ============================================
    // 8. SCROLL TO TOP & PROGRESS BAR
    // ============================================
    const scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollTopBtn?.classList.add('visible');
        } else {
            scrollTopBtn?.classList.remove('visible');
        }

        const scrollProgressBar = document.getElementById('scrollProgressBar');
        if (scrollProgressBar) {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgressBar.style.width = scrollPercent + '%';
        }
    }, { passive: true });

    scrollTopBtn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ============================================
    // 9. PROJECT MODAL
    // ============================================
    const modal = document.getElementById('projectModal');
    const modalBackdrop = modal?.querySelector('.modal__backdrop');
    const modalClose = modal?.querySelector('.modal__close');
    const modalImage = modal?.querySelector('.modal__image');
    const modalCategory = modal?.querySelector('.modal__category');
    const modalTitle = modal?.querySelector('.modal__title');
    const modalDetails = modal?.querySelector('.modal__details');

    function openModal(card) {
        if (!modal) return;

        const folder = card.dataset.folder;
        const cardVideo = card.querySelector('.card-gallery video');
        const videoSrc = cardVideo ? cardVideo.src : null;
        const category = card.querySelector('.work__card-category')?.textContent || '';
        const title = card.querySelector('.work__card-title')?.textContent || '';
        const details = card.dataset.details || '';

        modalImage.innerHTML = '';

        const grid = document.createElement('div');
        grid.className = 'modal__media-grid';

        if (folder) {
            for (let i = 1; i <= 10; i++) {
                const imgPath = `${folder}/image-${i}.jpg`;
                const img = document.createElement('img');
                img.src = imgPath;
                img.alt = `${title} - ${i}`;
                img.loading = 'lazy';
                img.onerror = function () { this.remove(); };
                grid.appendChild(img);
            }
        }

        if (videoSrc) {
            const video = document.createElement('video');
            video.src = videoSrc;
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            video.className = 'modal__video';
            grid.appendChild(video);
        }

        modalImage.appendChild(grid);

        modalCategory.textContent = category;
        modalTitle.textContent = title;
        modalDetails.textContent = details;

        document.body.style.overflow = 'hidden';
        modal.classList.add('open');
    }

    function closeModal() {
        if (!modal) return;
        document.body.style.overflow = '';
        modal.classList.remove('open');
        const video = modalImage?.querySelector('video');
        if (video) video.pause();
    }

    document.querySelectorAll('.work__card').forEach((card) => {
        card.addEventListener('click', () => openModal(card));
    });

    modalClose?.addEventListener('click', closeModal);
    modalBackdrop?.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('open')) {
            closeModal();
        }
    });

})();
