// script.js - Code Syntax Institute Interactive Features

// Debugging: Log initialization
console.log('Code Syntax Institute website initialized');
console.log('Current Date and Time:', new Date().toISOString());

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    
    initSmoothScrolling();
    initScrollAnimations();
    initFormHandling();
});

/**
 * Initialize smooth scrolling for navigation links
 * Provides scroll-to-section feature for better user experience
 */
function initSmoothScrolling() {
    console.log('Initializing smooth scrolling...');
    
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (targetId === '#' || targetId === '') {
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                event.preventDefault();
                
                // Get header height for offset
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                console.log('Scrolling to section:', targetId);
            }
        });
    });
    
    console.log('Smooth scrolling initialized for', navLinks.length, 'links');
}

/**
 * Initialize scroll-triggered animations
 * Elements with 'animate-on-scroll' class will fade in when visible
 */
function initScrollAnimations() {
    console.log('Initializing scroll animations...');
    
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    console.log('Element became visible:', entry.target.tagName, entry.target.id || entry.target.className);
                }
            });
        }, observerOptions);
        
        animatedElements.forEach(function(element) {
            observer.observe(element);
        });
        
        console.log('Scroll animations initialized for', animatedElements.length, 'elements using IntersectionObserver');
    } else {
        // Fallback for older browsers
        console.log('IntersectionObserver not supported, showing all elements');
        animatedElements.forEach(function(element) {
            element.classList.add('visible');
        });
    }
}

/**
 * Initialize form handling with validation
 * Provides user feedback and logging for debugging
 */
function initFormHandling() {
    console.log('Initializing form handling...');
    
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {};
            
            formData.forEach(function(value, key) {
                data[key] = value;
            });
            
            console.log('Form submitted with data:', data);
            
            // Validate form
            if (validateForm(data)) {
                // Show success message (in a real app, this would send to a server)
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
                console.log('Form successfully submitted and reset');
            }
        });
        
        // Add input event listeners for real-time feedback
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(function(input) {
            input.addEventListener('focus', function() {
                console.log('Input focused:', input.name);
            });
            
            input.addEventListener('blur', function() {
                console.log('Input blurred:', input.name, '- Value:', input.value ? 'filled' : 'empty');
            });
        });
        
        console.log('Form handling initialized');
    } else {
        console.log('Contact form not found on this page');
    }
}

/**
 * Validate form data
 * @param {Object} data - Form data object
 * @returns {boolean} - Whether the form is valid
 */
function validateForm(data) {
    console.log('Validating form data...');
    
    const errors = [];
    
    if (!data.name || data.name.trim() === '') {
        errors.push('Name is required');
    }
    
    if (!data.email || data.email.trim() === '') {
        errors.push('Email is required');
    } else if (!isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.message || data.message.trim() === '') {
        errors.push('Message is required');
    }
    
    if (errors.length > 0) {
        console.log('Validation errors:', errors);
        alert('Please fix the following errors:\n\n' + errors.join('\n'));
        return false;
    }
    
    console.log('Form validation passed');
    return true;
}

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - Whether the email is valid
 */
function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Log when page is fully loaded (including images, stylesheets, etc.)
window.addEventListener('load', function() {
    console.log('Page fully loaded (including all resources)');
    console.log('Window dimensions:', window.innerWidth, 'x', window.innerHeight);
});

// Log scroll position changes (throttled)
var scrollTimeout;
window.addEventListener('scroll', function() {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(function() {
        console.log('Current scroll position:', window.scrollY);
    }, 100);
});

// Log window resize events (throttled)
var resizeTimeout;
window.addEventListener('resize', function() {
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(function() {
        console.log('Window resized to:', window.innerWidth, 'x', window.innerHeight);
    }, 100);
});
