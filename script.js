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
                    // Add a stagger delay based on index among siblings
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

            // Close mobile menu if open
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
    // Set initial state
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

        // Close mobile menu on link click (for fallback)
        mobileMenu.querySelectorAll('.mobile-menu__link').forEach((link) => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close on resize past breakpoint
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && mobileMenu.classList.contains('open')) {
                closeMobileMenu();
            }
        });
    }

    // ============================================
    // 5. PARALLAX / TILT EFFECT ON PROJECT CARDS
    // ============================================
    const cards = document.querySelectorAll('.work__card');

    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-8px)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ============================================
    // 6. CURSOR FOLLOW (subtle dot) — desktop only
    // ============================================
    const cursor = document.createElement('div');
    cursor.classList.add('cursor-dot');
    document.body.appendChild(cursor);

    let cursorVisible = false;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        cursor.style.transform = `translate(${cursorX - 4}px, ${cursorY - 4}px)`;

        if (!cursorVisible) {
            cursorVisible = true;
            cursor.style.opacity = '1';
        }
    });

    document.addEventListener('mouseleave', () => {
        cursorVisible = false;
        cursor.style.opacity = '0';
    });

    // Hide cursor on touch devices
    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    if (isTouchDevice()) {
        cursor.remove();
    }

    // ============================================
    // 7. ACTIVE NAV LINK ON SCROLL
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

})();
