"use strict";

document.addEventListener('DOMContentLoaded', () => {

    // ===== 1. Mobile Menu =====
    const burger = document.querySelector('.burger');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (burger && mobileMenu) {
        const toggleMenu = (force) => {
            const willOpen = typeof force === 'boolean' ? force : !mobileMenu.classList.contains('active');
            mobileMenu.classList.toggle('active', willOpen);
            burger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        };

        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        mobileMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') toggleMenu(false);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.classList.contains('active')) return;
            const clickInside = mobileMenu.contains(e.target) || burger.contains(e.target);
            if (!clickInside) toggleMenu(false);
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                toggleMenu(false);
            }
        });
    }

    // ===== 2. Scroll to Top on Reload =====
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // ===== 3. Scroll Fade-In Effect =====
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fadeEls = document.querySelectorAll('.fade-in');

    if (prefersReducedMotion) {
        fadeEls.forEach(el => el.classList.add('visible'));
    } else if (fadeEls.length > 0) {
        const io = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {rootMargin: '0px 0px -50px 0px', threshold: 0.1});

        fadeEls.forEach(el => io.observe(el));
    }

    // ===== 4. Smooth Anchor Navigation =====
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');
            if (id.length <= 1) return;
            const target = document.querySelector(id);
            if (!target) return;

            e.preventDefault();

            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
            }

            target.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });
        });
    });

    // ===== 5. Modal Form =====
    const openModalBtn = document.querySelector('.contact-btn');
    const modal = document.getElementById('modal');
    const closeModalBtn = document.getElementById('closeModal');

    if (modal) {
        if (openModalBtn) {
            openModalBtn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.showModal();
                document.body.classList.add('modal-open');
            });
        }

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                modal.close();
            });
        }

        // Unlock body scroll on close (including Esc key)
        modal.addEventListener('close', () => {
            document.body.classList.remove('modal-open');
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            const rect = modal.getBoundingClientRect();
            const isInDialog = (
                rect.top <= e.clientY &&
                e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX &&
                e.clientX <= rect.left + rect.width
            );
            if (!isInDialog) {
                modal.close();
            }
        });
    }

    // ===== 6. Scroll to Top Button =====
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }, {passive: true});

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth'});
        });
    }

    // ===== 7. Teachers Slider =====
    if (document.querySelector('.teachers-swiper')) {
        new Swiper('.teachers-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            navigation: {
                nextEl: '.teachers-swiper .swiper-button-next',
                prevEl: '.teachers-swiper .swiper-button-prev',
            },
            pagination: {
                el: '.teachers-swiper .swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                    navigation: {enabled: false}
                },
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                    navigation: {enabled: true}
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                    navigation: {enabled: true}
                },
            },
        });
    }

    // ===== 8. Gallery Slider =====
    if (document.querySelector('.gallery-swiper')) {
        new Swiper('.gallery-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            grabCursor: true,
            navigation: {
                nextEl: '.gallery-swiper .swiper-button-next',
                prevEl: '.gallery-swiper .swiper-button-prev',
            },
            pagination: {
                el: '.gallery-swiper .swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                }
            }
        });
    }

    // ===== 9. Async Form Submission (Pro Style) =====
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        // Create element for the status directly in the code if it does not exist in the HTML
        let statusDiv = form.querySelector('.form-status');
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.className = 'form-status';
            // Add before the submit button or at the very bottom of the form
            const submitBtn = form.querySelector('button[type="submit"]');
            form.insertBefore(statusDiv, submitBtn);
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            // Loading status
            submitBtn.textContent = 'Відправляємо...';
            submitBtn.disabled = true;

            // Reset old status
            statusDiv.style.display = 'none';
            statusDiv.className = 'form-status';

            try {
                // Here will be your actual fetch to the server or Telegram/Formspree
                /*
                const response = await fetch('ВАШ_URL', {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });
                if (!response.ok) throw new Error('Network response was not ok');
                */

                // Network simulation for demonstration (1 second)
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Success message
                statusDiv.textContent = 'Дякуємо! Ваша заявка успішно відправлена. Ми зв\'яжемося з вами найближчим часом.';
                statusDiv.style.cssText = `
                background-color: #e8f5e9;
                color: #2e7d32;
                padding: 12px 16px;
                border-radius: 8px;
                margin-bottom: 15px;
                font-size: 0.95rem;
                font-weight: 500;
                border: 1px solid #c8e6c9;
                display: block;
            `;

                form.reset();

                // If the form is inside a modal window — smoothly close it after 3 seconds
                const modal = form.closest('dialog') || document.getElementById('modal');
                if (modal && typeof modal.close === 'function') {
                    setTimeout(() => {
                        modal.close();
                        statusDiv.style.display = 'none'; // Reset on close
                    }, 3500);
                }

            } catch (error) {
                // Error message
                statusDiv.textContent = 'Сталася помилка при відправці. Спробуйте пізніше або зателефонуйте нам.';
                statusDiv.style.cssText = `
                background-color: #ffebee;
                color: #c62828;
                padding: 12px 16px;
                border-radius: 8px;
                margin-bottom: 15px;
                font-size: 0.95rem;
                font-weight: 500;
                border: 1px solid #ffcdd2;
                display: block;
            `;
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    });

    // ===== 10. Dynamic Copyright Year =====
    const yearElement = document.getElementById("year");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear().toString();
    }
});