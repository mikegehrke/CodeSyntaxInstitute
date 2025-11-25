/* =============================================
   MAIN.JS - Code Syntax Institut
   Haupt JavaScript-Funktionalität
   ============================================= */

/**
 * Hauptinitialisierung beim DOM-Load
 */
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSmoothScroll();
    initScrollAnimations();
    initHeaderScroll();
    initMobileNav();
});

/**
 * Navigation aktiven Link markieren
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.header nav a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/**
 * Smooth Scroll für Anker-Links
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            
            // Skip wenn es nur "#" ist
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Header-Höhe berücksichtigen
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Mobile Navigation schließen
                closeMobileNav();
            }
        });
    });
}

/**
 * Scroll-Animationen für Elemente
 */
function initScrollAnimations() {
    const scrollElements = document.querySelectorAll('.scroll-animate');
    
    if (scrollElements.length === 0) return;
    
    // Intersection Observer für bessere Performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    scrollElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Header-Styling beim Scrollen
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateHeaderOnScroll(header, lastScrollY);
                lastScrollY = window.scrollY;
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * Header-Klasse basierend auf Scroll-Position aktualisieren
 */
function updateHeaderOnScroll(header, lastScrollY) {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

/**
 * Mobile Navigation initialisieren
 */
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.header nav');
    
    if (!navToggle || !nav) return;
    
    navToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', nav.classList.contains('active'));
        
        // Body-Scroll verhindern wenn Nav offen ist
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });
    
    // Schließen bei Klick außerhalb
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !navToggle.contains(e.target) && nav.classList.contains('active')) {
            closeMobileNav();
        }
    });
    
    // Schließen bei Escape-Taste
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            closeMobileNav();
        }
    });
}

/**
 * Mobile Navigation schließen
 */
function closeMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.header nav');
    
    if (nav) nav.classList.remove('active');
    if (navToggle) {
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
}

/**
 * Utility: Debounce-Funktion für Performance-Optimierung
 */
function debounce(func, wait = 100) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Utility: Throttle-Funktion für Scroll-Events
 */
function throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Viewport Check für Animationen
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0 &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
        rect.right >= 0
    );
}

/**
 * Lazy Loading für Bilder
 */
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback für ältere Browser
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

/**
 * Konsolenausgabe für Entwickler
 */
console.log('%c🚀 Code Syntax Institut', 'font-size: 24px; font-weight: bold; color: #4ecbff;');
console.log('%cModernste App-Entwicklung • KI-Tools • Mobile Full-Stack', 'font-size: 12px; color: #888;');
console.log('%c© 2025 Code Syntax Institut • Köln', 'font-size: 10px; color: #666;');
