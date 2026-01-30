let lightboxIsOpen = false;

// Configuração inicial
document.addEventListener('DOMContentLoaded', function() {
    console.log('Garcez Elétrica - Site inicializado');
    
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    initMobileMenu();
    initScrollAnimations();
    initContactForm();
    initSmoothScrolling();
    initCarousels();
    initImageExpansion();
    initScrollHeader();
});

// Menu móvel
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            const isActive = nav.classList.toggle('active');
            this.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            this.setAttribute('aria-label', isActive ? 'Fechar menu' : 'Abrir menu');
            this.setAttribute('aria-expanded', isActive);
        });
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                mobileMenuBtn.setAttribute('aria-label', 'Abrir menu');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// Header ao rolar
function initScrollHeader() {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        header.classList.toggle('scrolled', window.pageYOffset > 50);
    });
}

// Animações ao rolar
function initScrollAnimations() {
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.fade-in').forEach(element => observer.observe(element));
}

// Carrosséis
function initCarousels() {
    document.querySelectorAll('.carousel-service').forEach((carousel) => {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');
        const indicators = carousel.querySelectorAll('.indicator');
        const currentSlideElement = carousel.querySelector('.current-slide');
        const totalSlidesElement = carousel.querySelector('.total-slides');
        
        let currentSlide = 0;
        let autoplayInterval; // 🔥 controle do autoplay
        
        if (totalSlidesElement) totalSlidesElement.textContent = slides.length;
        
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));
            
            currentSlide = index;
            slides[currentSlide].classList.add('active');
            indicators[currentSlide]?.classList.add('active');
            
            if (currentSlideElement) currentSlideElement.textContent = currentSlide + 1;
        }
        
        function nextSlide() { showSlide((currentSlide + 1) % slides.length); }
        function prevSlide() { showSlide((currentSlide - 1 + slides.length) % slides.length); }
        
        // 🔥 AUTOPLAY
        function startAutoplay() {
            autoplayInterval = setInterval(() => {
                if (!lightboxIsOpen) nextSlide(); // só roda se lightbox estiver fechado
            }, 4000); // troca a cada 4s
        }
        
        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }
        
        // Botões param e reiniciam autoplay
        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); restartAutoplay(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); restartAutoplay(); });
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showSlide(index);
                restartAutoplay();
            });
        });
        
        function restartAutoplay() {
            stopAutoplay();
            startAutoplay();
        }
        
        // Pausa se mouse estiver em cima
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
        
        showSlide(0);
        startAutoplay(); // 🔥 inicia automático
    });
}


// LIGHTBOX
function initImageExpansion() {
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');
    
    let currentImages = [];
    let currentIndex = 0;
    let isOpen = false;
    
    function openLightbox(images, startIndex) {
        currentImages = images;
        currentIndex = startIndex;
        isOpen = true;
        lightboxIsOpen = true;
        
        lightboxImage.src = currentImages[currentIndex];
        lightboxImage.style.opacity = '1';
        lightboxImage.style.display = 'block';
        
        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
        }
        
        lightboxModal.style.display = 'flex';
        setTimeout(() => {
            lightboxModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 10);
        
        setTimeout(() => lightboxClose.focus(), 50);
    }
    
    function changeImage(newIndex) {
        currentIndex = newIndex;
        lightboxImage.style.opacity = '0';
        
        setTimeout(() => {
            lightboxImage.src = currentImages[currentIndex];
            lightboxImage.onload = () => {
                lightboxImage.style.opacity = '1';
                if (lightboxCounter) {
                    lightboxCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
                }
            };
        }, 200);
    }
    
    function nextImage() {
        if (!isOpen) return;
        changeImage((currentIndex + 1) % currentImages.length);
    }
    
    function prevImage() {
        if (!isOpen) return;
        changeImage((currentIndex - 1 + currentImages.length) % currentImages.length);
    }
    
    function closeLightbox() {
        if (!isOpen) return;
        isOpen = false;
        lightboxIsOpen = false; // 🔥 libera carrossel
        
        lightboxModal.classList.remove('active');
        
        setTimeout(() => {
            lightboxModal.style.display = 'none';
            document.body.style.overflow = '';
            lightboxImage.style.opacity = '1';

            // 🔥 garante que sempre exista um slide ativo
            document.querySelectorAll('.carousel-service').forEach(carousel => {
                const slides = carousel.querySelectorAll('.carousel-slide');
                if (!carousel.querySelector('.carousel-slide.active') && slides.length > 0) {
                    slides[0].classList.add('active');
                }
            });

        }, 300);
    }
    
    document.querySelectorAll('.expand-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const carouselIndex = parseInt(this.dataset.carousel) || 0;
            const slideIndex = parseInt(this.dataset.slide) || 0;
            const carousel = document.querySelectorAll('.carousel-service')[carouselIndex];
            
            if (!carousel) return;
            
            const images = Array.from(carousel.querySelectorAll('.carousel-slide img')).map(img => img.src);
            if (images.length > 0) openLightbox(images, slideIndex);
        });
    });
    
    document.querySelectorAll('.slide-image').forEach(slideImage => {
        slideImage.addEventListener('click', function(e) {
            if (e.target.closest('.expand-btn')) return;
            
            const slide = this.closest('.carousel-slide');
            const carousel = slide.closest('.carousel-service');
            const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
            const slideIndex = slides.indexOf(slide);
            const images = slides.map(s => s.querySelector('img').src);
            
            openLightbox(images, slideIndex);
        });
    });
    
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
    
    lightboxModal.addEventListener('click', e => {
        if (e.target === lightboxModal) closeLightbox();
    });
    
    document.addEventListener('keydown', e => {
        if (!isOpen) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });
}

// Formulário
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Formulário enviado! Entraremos em contato em breve.');
            contactForm.reset();
        });
    }
}

// Scroll suave
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#inicio') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
}
