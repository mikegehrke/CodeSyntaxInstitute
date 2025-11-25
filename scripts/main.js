// main.js - General site functionality and logging

(function() {
    'use strict';

    // Log initialization
    console.log('Code Syntax Institut - Website initialized');
    console.log(`Current Date: ${new Date().toLocaleDateString('de-DE')}`);
    console.log(`Current Time: ${new Date().toLocaleTimeString('de-DE')}`);

    // DOM Ready handler
    document.addEventListener('DOMContentLoaded', function() {
        initSmoothScroll();
        initScrollAnimations();
        initHeaderBehavior();
    });

    // Smooth scroll for anchor links
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Scroll-triggered animations
    function initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeInUp');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe course cards
        document.querySelectorAll('.course-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.animationDelay = `${index * 0.15}s`;
            observer.observe(card);
        });
    }

    // Header scroll behavior
    function initHeaderBehavior() {
        const header = document.querySelector('.header');
        if (!header) return;

        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 100) {
                header.style.boxShadow = '0 2px 20px rgba(0, 115, 230, 0.3)';
            } else {
                header.style.boxShadow = 'none';
            }

            lastScrollY = currentScrollY;
        });
    }

})();
