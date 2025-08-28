// Enhanced Performance and Functionality Script
// DOM Content Loaded with Performance Optimization
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Initialize features (MENY: ikke kall andre menu-init enn V2)
    initScrollIndicator();
    // initMobileMenu();              // ❌ fjernet
    initSmoothScrolling();
    initScrollAnimations();
    initHeaderEffects();
    initContactForm();
    initGalleryLightbox();
    initServiceCardEffects();
    initParallaxEffects();
    initFloatingActionButton();
    initPreloader();
    initLazyLoading();
    initPerformanceOptimizations();
    
    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        initPageTransitions();
        hidePreloader();
    });
});

/* ================= PRELOADER ================= */
function initPreloader() {
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="preloader-logo">ARARAT SKREDDER</div>
            <div class="preloader-spinner"></div>
            <div class="preloader-text">Laster inn...</div>
        </div>
    `;
    
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.5s ease, visibility 0.5s ease;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .preloader-content { text-align: center; color: white; }
        .preloader-logo {
            font-family: 'Bebas Neue', cursive;
            font-size: 3rem;
            letter-spacing: 3px;
            margin-bottom: 2rem;
            background: linear-gradient(135deg, #c6a96b 0%, #d4af37 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .preloader-spinner {
            width: 50px; height: 50px; border: 4px solid rgba(198,169,107,.3);
            border-top: 4px solid #c6a96b; border-radius: 50%;
            animation: spin 1s linear infinite; margin: 0 auto 1rem;
        }
        .preloader-text { font-size: 1.1rem; opacity: .8; font-weight: 500; }
        @keyframes spin { 0%{transform:rotate(0)} 100%{transform:rotate(360deg)} }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(preloader);
}
function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            setTimeout(() => { preloader.remove(); }, 500);
        }, 1000);
    }
}

/* ================= SCROLL INDICATOR ================= */
function initScrollIndicator() {
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    document.body.appendChild(scrollIndicator);
    
    let ticking = false;
    function updateScrollIndicator() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = Math.min(scrollTop / docHeight, 1);
        scrollIndicator.style.transform = `scaleX(${scrollPercent})`;
        ticking = false;
    }
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollIndicator);
            ticking = true;
        }
    });
}

/* ================= (REMOVED) OLD MOBILE MENUS ================= */
// function initMobileMenu() { /* ❌ fjernet for å unngå konflikter */ }
// function initEnhancedMobileMenu() { /* ❌ fjernet for å unngå konflikter */ }

/* ================= SMOOTH SCROLL ================= */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
}

/* ================= SCROLL ANIMATIONS ================= */
function initScrollAnimations() {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), index * 100);
            }
        });
    }, observerOptions);
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    
    const counters = document.querySelectorAll('.experience-number, .stats-number');
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    });
    counters.forEach(counter => counterObserver.observe(counter));
}
function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const duration = 2500;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        const suffix = element.textContent.includes('+') ? '+' :
                       element.textContent.includes('%') ? '%' :
                       element.textContent.includes('år') ? ' år' : '';
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

/* ================= HEADER EFFECTS ================= */
function initHeaderEffects() {
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;
    let ticking = false;
    function updateHeader() {
        const currentScrollY = window.scrollY;
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.15)';
            header.style.backdropFilter = 'blur(25px)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
        }
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScrollY = currentScrollY;
        ticking = false;
    }
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });
}

/* ================= CONTACT FORM ================= */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const thankYouMessage = document.getElementById('thankYouMessage');
    if (!contactForm) return;

    const formGroups = contactForm.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea, select');
        const label = group.querySelector('label');
        if (input && label) {
            input.addEventListener('focus', function() {
                group.classList.add('focused');
                label.style.transform = 'translateY(-25px) scale(0.85)';
                label.style.color = '#c6a96b';
            });
            input.addEventListener('blur', function() {
                if (!this.value) {
                    group.classList.remove('focused');
                    label.style.transform = 'none';
                    label.style.color = '#1a202c';
                }
            });
            if (input.value) {
                group.classList.add('focused');
                label.style.transform = 'translateY(-25px) scale(0.85)';
            }
        }
    });

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const message = document.getElementById('message')?.value.trim();
        if (!name || name.length < 2) return showNotification('Vennligst oppgi et gyldig navn (minst 2 tegn).', 'error');
        if (!email) return showNotification('Vennligst oppgi en e-postadresse.', 'error');
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!emailRegex.test(email)) return showNotification('Vennligst oppgi en gyldig e-postadresse.', 'error');
        if (!message || message.length < 10) return showNotification('Vennligst skriv en melding (minst 10 tegn).', 'error');

        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sender...';
        submitButton.disabled = true; submitButton.style.opacity = '0.7';

        setTimeout(() => {
            contactForm.style.display = 'none';
            thankYouMessage.style.display = 'block';
            thankYouMessage.style.animation = 'fadeInUp 0.5s ease';
            showNotification('Melding sendt! Vi tar kontakt snart.', 'success');
            setTimeout(() => {
                contactForm.style.display = 'block';
                thankYouMessage.style.display = 'none';
                contactForm.reset();
                formGroups.forEach(group => {
                    group.classList.remove('focused');
                    const label = group.querySelector('label');
                    if (label) { label.style.transform = 'none'; label.style.color = '#1a202c'; }
                });
                submitButton.innerHTML = originalText;
                submitButton.disabled = false; submitButton.style.opacity = '1';
            }, 6000);
        }, 2000);
    });
}

/* ================= NOTIFICATIONS ================= */
function showNotification(message, type = 'info') {
    document.querySelectorAll('.notification').forEach(n => n.remove());
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    const icons = { success: 'check-circle', error: 'exclamation-triangle', warning: 'exclamation-circle', info: 'info-circle' };
    const colors = { success: '#48bb78', error: '#f56565', warning: '#ed8936', info: '#4299e1' };
    notification.innerHTML = `
        <i class="fas fa-${icons[type]}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: ${colors[type]};
        color: #fff; padding: 1.2rem 1.8rem; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,.2);
        z-index: 10000; display: flex; align-items: center; gap: .8rem; transform: translateX(100%);
        transition: transform .3s ease; max-width: 400px; font-weight: 500;
    `;
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; margin-left: auto; opacity: .8; transition: opacity .3s ease;
    `;
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    document.body.appendChild(notification);
    setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/* ================= GALLERY LIGHTBOX ================= */
function initGalleryLightbox() {
    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('click', function() {
            createLightbox(this.src, this.alt);
        });
    });
}
function createLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="${src}" alt="${alt}" loading="lazy">
            <button class="lightbox-close" aria-label="Lukk">&times;</button>
            <div class="lightbox-info"><h3>${alt}</h3></div>
            <div class="lightbox-nav">
                <button class="lightbox-prev" aria-label="Forrige">&larr;</button>
                <button class="lightbox-next" aria-label="Neste">&rarr;</button>
            </div>
        </div>
    `;
    lightbox.style.cssText = `
        position: fixed; inset: 0; background: rgba(0,0,0,.95);
        display: flex; justify-content: center; align-items: center; z-index: 10000;
        opacity: 0; transition: opacity .3s ease; backdrop-filter: blur(10px);
    `;
    const content = lightbox.querySelector('.lightbox-content');
    content.style.cssText = `position: relative; max-width: 90%; max-height: 90%; animation: lightboxZoom .3s ease;`;
    const lightboxImg = lightbox.querySelector('img');
    lightboxImg.style.cssText = `max-width:100%; max-height:100%; border-radius:15px; box-shadow:0 20px 60px rgba(0,0,0,.5);`;
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.style.cssText = `
        position:absolute; top:-60px; right:0; background:rgba(255,255,255,.2); border:none; color:#fff; font-size:2.5rem; cursor:pointer; padding:.8rem;
        width:60px; height:60px; border-radius:50%; display:flex; align-items:center; justify-content:center; transition:all .3s ease; backdrop-filter: blur(10px);
    `;
    closeBtn.addEventListener('mouseenter', () => { closeBtn.style.background = 'rgba(255,255,255,.3)'; closeBtn.style.transform = 'scale(1.1)'; });
    closeBtn.addEventListener('mouseleave', () => { closeBtn.style.background = 'rgba(255,255,255,.2)'; closeBtn.style.transform = 'scale(1)'; });
    const info = lightbox.querySelector('.lightbox-info');
    info.style.cssText = `
        position:absolute; bottom:-80px; left:0; right:0; text-align:center; color:#fff; background:rgba(0,0,0,.7); padding:1.5rem; border-radius:12px; backdrop-filter:blur(10px);
    `;
    document.body.appendChild(lightbox);
    const style = document.createElement('style');
    style.textContent = `@keyframes lightboxZoom { from{ transform:scale(.5); opacity:0 } to{ transform:scale(1); opacity:1 } }`;
    document.head.appendChild(style);
    setTimeout(() => { lightbox.style.opacity = '1'; }, 10);
    function closeLightbox() {
        lightbox.style.opacity = '0';
        setTimeout(() => { document.body.removeChild(lightbox); document.head.removeChild(style); }, 300);
    }
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) { if (e.target === lightbox) closeLightbox(); });
    const escapeHandler = function(e) { if (e.key === 'Escape') { closeLightbox(); document.removeEventListener('keydown', escapeHandler); } };
    document.addEventListener('keydown', escapeHandler);
}

/* ================= SERVICE CARD EFFECTS ================= */
function initServiceCardEffects() {
    document.querySelectorAll('.service-cards .card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-20px) rotateX(5deg)';
            this.style.boxShadow = '0 30px 70px rgba(0,0,0,.15)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0)';
            this.style.boxShadow = '0 15px 50px rgba(0,0,0,.08)';
        });
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left, y = e.clientY - rect.top;
            const centerX = rect.width / 2, centerY = rect.height / 2;
            const rotateX = (y - centerY) / 8, rotateY = (centerX - x) / 8;
            this.style.transform = `translateY(-20px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        });
    });
}

/* ================= PARALLAX ================= */
function initParallaxEffects() {
    let ticking = false;
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) heroSection.style.transform = `translateY(${scrolled * 0.3}px)`;
        document.querySelectorAll('.parallax-element').forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
        ticking = false;
    }
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

/* ================= FAB ================= */
function initFloatingActionButton() {
    const fab = document.createElement('div');
    fab.innerHTML = '<i class="fas fa-phone"></i>';
    fab.className = 'floating-action-button';
    fab.setAttribute('aria-label', 'Ring oss');
    fab.style.cssText = `
        position: fixed; bottom: 30px; right: 30px; width: 65px; height: 65px;
        background: linear-gradient(135deg, #c6a96b, #d4af37); border-radius: 50%;
        display: flex; align-items: center; justify-content: center; color: white; font-size: 1.6rem;
        cursor: pointer; box-shadow: 0 8px 25px rgba(198,169,107,.4); z-index: 1000; transition: all .3s ease;
        border: 3px solid rgba(255,255,255,.2);
    `;
    fab.addEventListener('click', function() { window.location.href = 'tel:+4748188552'; });
    fab.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.15)'; this.style.boxShadow = '0 15px 40px rgba(198,169,107,.6)'; this.style.borderColor = 'rgba(255,255,255,.4)';
    });
    fab.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)'; this.style.boxShadow = '0 8px 25px rgba(198,169,107,.4)'; this.style.borderColor = 'rgba(255,255,255,.2)';
    });
    setInterval(() => { fab.style.animation = 'pulse 2s ease-in-out'; setTimeout(() => { fab.style.animation = ''; }, 2000); }, 10000);
    const style = document.createElement('style');
    style.textContent = `@keyframes pulse { 0%{transform:scale(1)} 50%{transform:scale(1.1)} 100%{transform:scale(1)} }`;
    document.head.appendChild(style);
    document.body.appendChild(fab);
}

/* ================= LAZY LOADING ================= */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    images.forEach(img => imageObserver.observe(img));
}

/* ================= PERF ================= */
function initPerformanceOptimizations() {
    document.querySelectorAll('img').forEach(img => { if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy'); });
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap',
        'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
    ];
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload'; link.as = 'style'; link.href = resource;
        document.head.appendChild(link);
    });
}

/* ================= PAGE TRANSITIONS ================= */
function initPageTransitions() {
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed; inset: 0; background: linear-gradient(135deg, #c6a96b, #d4af37);
                z-index: 10000; transform: translateX(-100%); transition: transform .6s cubic-bezier(0.4,0,0.2,1);
            `;
            document.body.appendChild(overlay);
            setTimeout(() => { overlay.style.transform = 'translateX(0)'; }, 10);
            setTimeout(() => { window.location.href = href; }, 600);
        });
    });
}

/* ================= UTILS ================= */
function debounce(func, wait) {
    let timeout; return function executedFunction(...args) {
        const later = () => { clearTimeout(timeout); func(...args); };
        clearTimeout(timeout); timeout = setTimeout(later, wait);
    };
}
function throttle(func, limit) {
    let inThrottle; return function() {
        const args = arguments; const context = this;
        if (!inThrottle) { func.apply(context, args); inThrottle = true; setTimeout(() => inThrottle = false, limit); }
    }
}

/* ================= GALLERY FILTER ================= */
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                const filterValue = this.getAttribute('data-filter');
                galleryItems.forEach((item, index) => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        setTimeout(() => {
                            item.classList.remove('hidden');
                            item.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s both`;
                        }, index * 50);
                    } else {
                        item.classList.add('hidden');
                        item.style.animation = '';
                    }
                });
            });
        });
    }
});

/* ================= ERROR/PERF MONITOR ================= */
window.addEventListener('error', function(e) { console.error('JavaScript Error:', e.error); });
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

/* ================= ADVANCED FEATURES (unchanged) ================= */
// (Beholder disse for øvrige effekter; ingen meny-konflikt)
function initAdvancedParallax() {
    const heroSection = document.querySelector('.hero-section');
    const parallaxElements = document.querySelectorAll('.parallax-element');
    if (heroSection) {
        let ticking = false;
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
            parallaxElements.forEach((element, index) => {
                const speed = 0.2 + (index * 0.1);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            ticking = false;
        }
        window.addEventListener('scroll', function() {
            if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
        });
    }
}
function initMagneticCursor() { return; }
function initAdvancedScrollAnimations() {
    const animationElements = document.querySelectorAll('[data-animation]');
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
    const animationObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.dataset.animation;
                const delay = element.dataset.delay || 0;
                setTimeout(() => { element.classList.add(`animate-${animationType}`); }, delay);
                animationObserver.unobserve(element);
            }
        });
    }, observerOptions);
    animationElements.forEach(element => { animationObserver.observe(element); });
}
function initTypewriterEffect() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid #c6a96b';
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) { element.textContent += text.charAt(i); i++; }
            else { clearInterval(timer); setTimeout(() => { element.style.borderRight = 'none'; }, 1000); }
        }, 100);
    });
}
function initParticleSystem() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
        position: fixed; inset: 0; pointer-events: none; z-index: 1; overflow: hidden;
    `;
    document.body.appendChild(particleContainer);
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 4 + 2;
        const x = Math.random() * window.innerWidth;
        const duration = Math.random() * 20 + 10;
        particle.style.cssText = `
            position: absolute; width: ${size}px; height: ${size}px; background: rgba(198,169,107,.3);
            border-radius: 50%; left: ${x}px; top: 100vh; animation: floatUp ${duration}s linear infinite;
        `;
        particleContainer.appendChild(particle);
        setTimeout(() => { particle.remove(); }, duration * 1000);
    }
    setInterval(createParticle, 2000);
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp { 0%{transform:translateY(0) rotate(0); opacity:0}
        10%{opacity:1} 90%{opacity:1} 100%{transform:translateY(-100vh) rotate(360deg); opacity:0} }
    `;
    document.head.appendChild(style);
}
function initAdvancedImageEffects() {
    const images = document.querySelectorAll('.gallery-item img, .image-content img');
    images.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.1) contrast(1.1) saturate(1.2)';
            this.style.transform = 'scale(1.05) rotate(1deg)';
        });
        img.addEventListener('mouseleave', function() {
            this.style.filter = 'none';
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}
function initTextRevealAnimation() {
    const textElements = document.querySelectorAll('.text-reveal');
    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('revealed'); revealObserver.unobserve(entry.target); }
        });
    });
    textElements.forEach(element => { revealObserver.observe(element); });
}
function initButtonLoadingStates() {
    const buttons = document.querySelectorAll('.cta-button, .navbar-cta');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('loading')) return;
            const originalText = this.innerHTML;
            this.classList.add('loading');
            this.innerHTML = '<span class="loading-spinner"></span> Laster...';
            setTimeout(() => { this.classList.remove('loading'); this.innerHTML = originalText; }, 2000);
        });
    });
}
function initScrollProgress() {
    const progressElements = document.querySelectorAll('.progress-bar');
    const progressObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const progress = element.dataset.progress || 100;
                element.style.width = '0%';
                setTimeout(() => { element.style.width = progress + '%'; }, 200);
                progressObserver.unobserve(element);
            }
        });
    });
    progressElements.forEach(element => { progressObserver.observe(element); });
}
function initCustomCursor() { return; }
function initScrollSnap() {
    const sections = document.querySelectorAll('section');
    let isScrolling = false;
    window.addEventListener('wheel', function(e) {
        if (isScrolling) return;
        e.preventDefault(); isScrolling = true;
        const currentSection = getCurrentSection();
        const direction = e.deltaY > 0 ? 1 : -1;
        const nextSection = sections[currentSection + direction];
        if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => { isScrolling = false; }, 1000);
    }, { passive: false });
    function getCurrentSection() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) return i;
        }
        return 0;
    }
}
function initAdvancedFormValidation() {
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('input', function() { validateField(this); });
        input.addEventListener('blur', function() { validateField(this); });
    });
    function validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        const fieldName = field.name;
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) existingError.remove();
        field.classList.remove('field-valid', 'field-invalid');
        let isValid = true; let errorMessage = '';
        if (field.hasAttribute('required') && !value) { isValid = false; errorMessage = 'Dette feltet er påkrevd'; }
        else if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; if (!emailRegex.test(value)) { isValid = false; errorMessage = 'Ugyldig e-postadresse'; }
        } else if (fieldName === 'phone' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/; if (!phoneRegex.test(value)) { isValid = false; errorMessage = 'Ugyldig telefonnummer'; }
        }
        if (value && isValid) field.classList.add('field-valid');
        else if (!isValid) {
            field.classList.add('field-invalid');
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = errorMessage;
            errorElement.style.cssText = `color:#e53e3e; font-size:.8rem; margin-top:.25rem; animation: fadeInUp .3s ease;`;
            field.parentNode.appendChild(errorElement);
        }
    }
}
function initAdvancedFeatures() {
    initAdvancedParallax();
    initMagneticCursor();
    initAdvancedScrollAnimations();
    initTypewriterEffect();
    initParticleSystem();
    initAdvancedImageEffects();
    initTextRevealAnimation();
    initButtonLoadingStates();
    initScrollProgress();
    initCustomCursor();
    initAdvancedFormValidation();
    const advancedStyles = document.createElement('style');
    advancedStyles.textContent = `
        .field-valid { border-color:#48bb78!important; box-shadow:0 0 0 3px rgba(72,187,120,.1)!important; }
        .field-invalid { border-color:#e53e3e!important; box-shadow:0 0 0 3px rgba(229,62,62,.1)!important; }
        .custom-cursor { display:none!important; }
        .scroll-indicator { position:fixed; top:0; left:0; width:100%; height:4px; background:linear-gradient(90deg,#c6a96b,#d4af37); transform-origin:left; transform:scaleX(0); z-index:9999; transition:transform .1s ease; }
        .progress-bar { height:4px; background:linear-gradient(90deg,#c6a96b,#d4af37); border-radius:2px; transition:width 1.5s cubic-bezier(.25,.46,.45,.94); }
    `;
    document.head.appendChild(advancedStyles);
}
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initAdvancedFeatures, 500);
});
function initPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }
}

/* ================= MOBILE SUPPORT HELPERS ================= */
function isMobile() {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
function initMobileTabs() {
    if (!isMobile()) return;
    const tabsNavigation = document.querySelector('.tabs-navigation');
    if (!tabsNavigation) return;
    let isDown = false, startX, scrollLeft;
    tabsNavigation.addEventListener('touchstart', (e) => { isDown = true; startX = e.touches[0].pageX - tabsNavigation.offsetLeft; scrollLeft = tabsNavigation.scrollLeft; });
    tabsNavigation.addEventListener('touchmove', (e) => { if (!isDown) return; e.preventDefault(); const x = e.touches[0].pageX - tabsNavigation.offsetLeft; const walk = (x - startX) * 2; tabsNavigation.scrollLeft = scrollLeft - walk; });
    tabsNavigation.addEventListener('touchend', () => { isDown = false; });
    function scrollToActiveTab() {
        const activeTab = tabsNavigation.querySelector('.tab-button.active');
        if (activeTab) activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => { button.addEventListener('click', () => { setTimeout(scrollToActiveTab, 100); }); });
}

/* ================= ✅ SINGLE SOURCE OF TRUTH: ENHANCED MOBILE MENU V2 ================= */
function initEnhancedMobileMenuV2() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    const header = document.querySelector('header');

    if (!mobileMenuButton || !navLinks) return;

    // Prevent duplicate init on resize / multiple calls
    if (mobileMenuButton.dataset.menuInit === '1') return;
    mobileMenuButton.dataset.menuInit = '1';

    // Ensure ARIA wiring even if HTML not updated
    if (!navLinks.id) navLinks.id = 'primary-navigation';
    mobileMenuButton.setAttribute('aria-controls', navLinks.id);
    mobileMenuButton.setAttribute('aria-expanded', 'false');
    mobileMenuButton.setAttribute('aria-label', mobileMenuButton.getAttribute('aria-label') || 'Åpne meny');

    const toggle = (open) => {
        const isOpen = (typeof open === 'boolean') ? open : !navLinks.classList.contains('active');
        navLinks.classList.toggle('active', isOpen);
        mobileMenuButton.classList.toggle('active', isOpen);
        body.style.overflow = isOpen ? 'hidden' : '';
        mobileMenuButton.setAttribute('aria-expanded', String(isOpen));
    };

    mobileMenuButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
    });

    // Close on link click (and smooth scroll for hash links)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href') || '';
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            toggle(false);
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            toggle(false);
        }
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) toggle(false);
    });

    // Keep header height reasonable on orientation change
    window.addEventListener('orientationchange', () => {
        if (navLinks.classList.contains('active')) {
            setTimeout(() => { navLinks.style.height = '100vh'; }, 100);
        }
    });
}

/* ================= TOUCH & MOBILE ENHANCEMENTS (no menu toggling here) ================= */
function initTouchFriendlyHovers() {
    if (!isMobile()) return;
    const touchElements = document.querySelectorAll('.card, .cta-button, .gallery-item, .service-item');
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() { this.classList.add('touch-active'); });
        element.addEventListener('touchend', function() { setTimeout(() => { this.classList.remove('touch-active'); }, 150); });
    });
    const touchStyles = document.createElement('style');
    touchStyles.textContent = `
        .touch-active.card { transform: translateY(-5px) scale(1.02)!important; box-shadow: 0 15px 40px rgba(0,0,0,.15)!important; }
        .touch-active.cta-button { transform: translateY(-2px) scale(1.02)!important; box-shadow: 0 12px 35px rgba(198,169,107,.4)!important; }
        .touch-active.gallery-item { transform: translateY(-3px)!important; }
        .touch-active.service-item { transform: translateY(-3px)!important; background: rgba(198,169,107,.1)!important; }
    `;
    document.head.appendChild(touchStyles);
}
function initSwipeGestures() {
    if (!isMobile()) return;
    const tabsContent = document.querySelector('.tabs-content');
    const tabButtons = document.querySelectorAll('.tab-button');
    if (!tabsContent || !tabButtons.length) return;
    let startX = 0, startY = 0, currentTabIndex = 0;
    function getCurrentTabIndex() { return Array.from(tabButtons).findIndex(btn => btn.classList.contains('active')); }
    tabsContent.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; startY = e.touches[0].clientY; currentTabIndex = getCurrentTabIndex(); });
    tabsContent.addEventListener('touchmove', (e) => {
        if (Math.abs(e.touches[0].clientX - startX) > Math.abs(e.touches[0].clientY - startY)) e.preventDefault();
    });
    tabsContent.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX, endY = e.changedTouches[0].clientY;
        const diffX = startX - endX, diffY = startY - endY;
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0 && currentTabIndex < tabButtons.length - 1) tabButtons[currentTabIndex + 1].click();
            else if (diffX < 0 && currentTabIndex > 0) tabButtons[currentTabIndex - 1].click();
        }
    });
}
function initMobilePerformance() {
    if (!isMobile()) return;
    const images = document.querySelectorAll('img[src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.transition = 'opacity .3s ease'; img.style.opacity = '0';
                const newImg = new Image();
                newImg.onload = () => { img.style.opacity = '1'; };
                newImg.src = img.src;
                imageObserver.unobserve(img);
            }
        });
    });
    images.forEach(img => imageObserver.observe(img));
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            * { animation-duration:.3s!important; transition-duration:.3s!important; }
            .parallax-element { transform:none!important; }
            .particle-container { display:none!important; }
        }
    `;
    document.head.appendChild(style);
}
function initMobileScrollOptimization() {
    if (!isMobile()) return;
    let ticking = false, lastScrollY = 0;
    function updateScrollElements() {
        const currentScrollY = window.scrollY;
        const header = document.querySelector('header');
        if (currentScrollY > lastScrollY && currentScrollY > 100) header.style.transform = 'translateY(-100%)';
        else header.style.transform = 'translateY(0)';
        lastScrollY = currentScrollY; ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(updateScrollElements); ticking = true; }
    }, { passive: true });
}
function initMobileFormEnhancements() {
    if (!isMobile()) return;
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() { if (this.type !== 'file') this.style.fontSize = '16px'; });
        input.style.cssText += `-webkit-appearance:none; border-radius:8px; font-size:16px; padding:12px 16px;`;
        input.addEventListener('touchstart', function() {
            this.style.borderColor = '#c6a96b'; this.style.boxShadow = '0 0 0 3px rgba(198,169,107,.1)';
        });
    });
}
function initMobileAccessibility() {
    if (!isMobile()) return;
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
    interactiveElements.forEach(element => {
        const computedStyle = window.getComputedStyle(element);
        const height = parseInt(computedStyle.height), width = parseInt(computedStyle.width);
        if (height < 44) { element.style.minHeight = '44px'; element.style.display = 'flex'; element.style.alignItems = 'center'; element.style.justifyContent = 'center'; }
        if (width < 44) { element.style.minWidth = '44px'; }
    });
    const focusStyle = document.createElement('style');
    focusStyle.textContent = `@media (max-width: 768px) { *:focus { outline:3px solid #c6a96b!important; outline-offset:2px!important; } }`;
    document.head.appendChild(focusStyle);
}
function initOrientationHandling() {
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            const tabsNavigation = document.querySelector('.tabs-navigation');
            if (tabsNavigation && isMobile()) {
                const activeTab = tabsNavigation.querySelector('.tab-button.active');
                if (activeTab) {
                    setTimeout(() => { activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }, 300);
                }
            }
        }, 100);
    });
}
function initAllMobileFeatures() {
    initMobileTabs();
    // initEnhancedMobileMenu(); // ❌ ikke kall gammel meny
    initTouchFriendlyHovers();
    initSwipeGestures();
    initMobilePerformance();
    initMobileScrollOptimization();
    initMobileFormEnhancements();
    initMobileAccessibility();
    initOrientationHandling();
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    console.log('Mobile optimalisering aktivert');
}
document.addEventListener('DOMContentLoaded', function() {
    if (isMobile()) { setTimeout(initAllMobileFeatures, 100); }
});
window.addEventListener('resize', function() {
    if (isMobile()) { setTimeout(initAllMobileFeatures, 100); }
});

/* ================= PWA FEATURES ================= */
function initPWAFeatures() {
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault(); deferredPrompt = e;
        const installButton = document.createElement('button');
        installButton.textContent = 'Installer App';
        installButton.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            background: linear-gradient(135deg, #c6a96b, #d4af37); color:#fff; border:none;
            padding:12px 20px; border-radius:25px; font-weight:600; box-shadow:0 4px 15px rgba(0,0,0,.2); z-index:1000; cursor:pointer;
        `;
        installButton.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                await deferredPrompt.userChoice;
                deferredPrompt = null;
                installButton.remove();
            }
        });
        if (isMobile()) {
            document.body.appendChild(installButton);
            setTimeout(() => { if (installButton.parentNode) installButton.remove(); }, 10000);
        }
    });
}
document.addEventListener('DOMContentLoaded', initPWAFeatures);

/* ================= LOGO & NAVBAR & NEW FEATURES ================= */
function initLogoAnimations() {
    const logo = document.querySelector('.logo');
    if (!logo) return;
    logo.addEventListener('click', function(e) {
        this.classList.add('clicked');
        setTimeout(() => { this.classList.remove('clicked'); }, 300);
        const link = this.querySelector('a');
        if (link && (link.getAttribute('href') === '/' || link.getAttribute('href') === 'index.html' || link.getAttribute('href') === '#')) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    logo.addEventListener('mouseenter', function() { this.style.transform = 'scale(1.1)'; });
    logo.addEventListener('mouseleave', function() { this.style.transform = 'scale(1)'; });
}
function initMobileTouchEnhancements() {
    if (!isMobile()) return;
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('touchstart', function() {
            this.style.transform = 'scale(1.05)'; this.style.background = 'rgba(198,169,107,0.3)';
        });
        link.addEventListener('touchend', function() {
            setTimeout(() => { this.style.transform = 'scale(1)'; this.style.background = 'rgba(255,255,255,0.05)'; }, 150);
        });
        link.addEventListener('touchcancel', function() {
            this.style.transform = 'scale(1)'; this.style.background = 'rgba(255,255,255,0.05)';
        });
    });
}
function initSmoothScrollEnhancements() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
}
function initNavbarScrollEffects() {
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;
    let ticking = false;
    function updateHeader() {
        const currentScrollY = window.scrollY;
        if (currentScrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            header.style.backdropFilter = 'blur(10px)';
        }
        if (isMobile()) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) header.style.transform = 'translateY(-100%)';
            else header.style.transform = 'translateY(0)';
        }
        lastScrollY = currentScrollY; ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(updateHeader); ticking = true; }
    }, { passive: true });
}
function initAllNewFeatures() {
    initLogoAnimations();
    initEnhancedMobileMenuV2();       // ✅ eneste meny-init
    initMobileTouchEnhancements();
    initSmoothScrollEnhancements();
    initNavbarScrollEffects();
    console.log('Logo-animasjoner og forbedret mobile menu aktivert');
}
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initAllNewFeatures, 100);
});
window.addEventListener('resize', function() {
    setTimeout(() => {
        initEnhancedMobileMenuV2();   // idempotent – ingen duplikate lyttere
        initMobileTouchEnhancements();
    }, 100);
});

/* ================= (REMOVED) SIMPLE MENU ================= */
// function initSimpleMobileMenu() { /* ❌ fjernet */ }
// document.addEventListener('DOMContentLoaded', function() {
//     initSimpleMobileMenu();
//     console.log('Enkel mobile menu (deaktivert)');
// });
