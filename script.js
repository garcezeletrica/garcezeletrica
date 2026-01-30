// Configuração inicial
document.addEventListener('DOMContentLoaded', function() {
    console.log('Garcez Elétrica - Site inicializado');
    
    // Configura o ano atual no footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Inicializa componentes
    initMobileMenu();
    initScrollAnimations();
    initContactForm();
    initSmoothScrolling();
    initCarousels();
    initImageExpansion();
    initScrollHeader();
    
    // Força a verificação inicial de elementos visíveis
    checkVisibleElements();
    
    // Previne comportamento padrão de formulário
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
        });
    });
});

// Menu móvel
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            const isActive = nav.classList.toggle('active');
            this.innerHTML = isActive 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
            this.setAttribute('aria-label', isActive 
                ? 'Fechar menu' 
                : 'Abrir menu');
            this.setAttribute('aria-expanded', isActive);
        });
        
        // Fecha o menu ao clicar em um link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                mobileMenuBtn.setAttribute('aria-label', 'Abrir menu');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Fecha o menu ao clicar fora
        document.addEventListener('click', function(event) {
            const isClickInsideNav = nav.contains(event.target);
            const isClickOnMenuBtn = mobileMenuBtn.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnMenuBtn && nav.classList.contains('active')) {
                nav.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                mobileMenuBtn.setAttribute('aria-label', 'Abrir menu');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// Header ao rolar
function initScrollHeader() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Animações ao rolar
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Adiciona delay escalonado
                if (entry.target.classList.contains('service-card') || 
                    entry.target.classList.contains('feature-item')) {
                    
                    const cards = Array.from(entry.target.parentElement.children);
                    const index = cards.indexOf(entry.target);
                    const delay = (index % 6) * 100;
                    
                    entry.target.style.transitionDelay = `${delay}ms`;
                }
                
                // Para o observador após a animação
                setTimeout(() => {
                    observer.unobserve(entry.target);
                }, 1000);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.fade-in').forEach((element) => {
        observer.observe(element);
    });
}

// Carrosséis
function initCarousels() {
    const carousels = document.querySelectorAll('.carousel-service');
    
    carousels.forEach((carousel, carouselIndex) => {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');
        const indicators = carousel.querySelectorAll('.indicator');
        const currentSlideElement = carousel.querySelector('.current-slide');
        const totalSlidesElement = carousel.querySelector('.total-slides');
        
        let currentSlide = 0;
        let autoSlideInterval;
        
        // Atualiza contador
        if (totalSlidesElement) {
            totalSlidesElement.textContent = slides.length;
        }
        
        function updateSlideCounter() {
            if (currentSlideElement) {
                currentSlideElement.textContent = currentSlide + 1;
            }
        }
        
        // Mostra slide específico
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));
            
            currentSlide = index;
            slides[currentSlide].classList.add('active');
            
            if (indicators[currentSlide]) {
                indicators[currentSlide].classList.add('active');
            }
            
            updateSlideCounter();
        }
        
        // Próximo slide
        function nextSlide() {
            let nextIndex = (currentSlide + 1) % slides.length;
            showSlide(nextIndex);
        }
        
        // Slide anterior
        function prevSlide() {
            let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(prevIndex);
        }
        
        // Auto slide
        function startAutoSlide() {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextSlide, 5000);
        }
        
        function pauseAutoSlide() {
            clearInterval(autoSlideInterval);
        }
        
        // Event listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                startAutoSlide();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                startAutoSlide();
            });
        }
        
        // Indicadores
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showSlide(index);
                startAutoSlide();
            });
        });
        
        // Pausa ao interagir
        carousel.addEventListener('mouseenter', pauseAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
        
        // Observador de visibilidade
        const carouselObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startAutoSlide();
                } else {
                    pauseAutoSlide();
                }
            });
        }, { threshold: 0.5 });
        
        carouselObserver.observe(carousel);
        
        // Navegação por teclado
        carousel.setAttribute('tabindex', '0');
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                startAutoSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                startAutoSlide();
            }
        });
        
        // Swipe para mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                startAutoSlide();
            }
        }
        
        // Inicia
        showSlide(0);
        startAutoSlide();
    });
}

// Expansão de imagens com Lightbox aprimorado
function initImageExpansion() {
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxThumbnails = document.getElementById('lightboxThumbnails');
    
    let currentImages = [];
    let currentIndex = 0;
    let currentCarouselIndex = 0;
    
    // Abre lightbox
    function openLightbox(carouselIndex, slideIndex) {
        const carousel = document.querySelectorAll('.carousel-service')[carouselIndex];
        const slides = carousel.querySelectorAll('.carousel-slide');
        
        currentImages = [];
        currentCarouselIndex = carouselIndex;
        
        slides.forEach((slide, index) => {
            const img = slide.querySelector('img');
            const title = slide.querySelector('.slide-info h4')?.textContent || '';
            const description = slide.querySelector('.slide-info p')?.textContent || '';
            const overlayTitle = slide.querySelector('.overlay-content h4')?.textContent || '';
            const overlayText = slide.querySelector('.overlay-content p')?.textContent || '';
            
            currentImages.push({
                src: img.src,
                alt: img.alt,
                title: title,
                description: description,
                overlayTitle: overlayTitle,
                overlayText: overlayText,
                index: index
            });
        });
        
        currentIndex = slideIndex;
        updateLightboxImage();
        createThumbnails();
        
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        lightboxModal.setAttribute('aria-hidden', 'false');
        
        setTimeout(() => {
            lightboxClose.focus();
        }, 100);
    }
    
    // Atualiza imagem no lightbox
    function updateLightboxImage() {
        if (currentImages.length === 0 || currentIndex < 0 || currentIndex >= currentImages.length) return;
        
        const image = currentImages[currentIndex];
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        
        // Atualiza contador
        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
        }
        
        // Atualiza título
        if (lightboxTitle) {
            const serviceTitle = document.querySelectorAll('.service-title-section h3')[currentCarouselIndex]?.textContent || '';
            const imageTitle = image.overlayTitle || image.title;
            lightboxTitle.textContent = `${serviceTitle} - ${imageTitle}`;
        }
        
        // Legenda
        let caption = '';
        if (image.overlayTitle) caption += `${image.overlayTitle} `;
        if (image.overlayText) caption += `- ${image.overlayText} `;
        if (image.description) caption += `| ${image.description}`;
        
        lightboxCaption.textContent = caption;
        
        // Atualiza thumbnails
        updateThumbnails();
        
        // Pré-carrega imagens adjacentes
        preloadAdjacentImages();
    }
    
    // Cria thumbnails
    function createThumbnails() {
        if (!lightboxThumbnails || currentImages.length === 0) return;
        
        lightboxThumbnails.innerHTML = '';
        
        currentImages.forEach((image, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.className = 'lightbox-thumbnail';
            thumbnail.src = image.src;
            thumbnail.alt = `Miniatura ${index + 1}`;
            
            if (index === currentIndex) {
                thumbnail.classList.add('active');
            }
            
            thumbnail.addEventListener('click', () => {
                currentIndex = index;
                updateLightboxImage();
            });
            
            lightboxThumbnails.appendChild(thumbnail);
        });
    }
    
    // Atualiza thumbnails ativos
    function updateThumbnails() {
        if (!lightboxThumbnails) return;
        
        const thumbnails = lightboxThumbnails.querySelectorAll('.lightbox-thumbnail');
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Pré-carrega imagens
    function preloadAdjacentImages() {
        const prevIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        const nextIndex = (currentIndex + 1) % currentImages.length;
        
        [prevIndex, nextIndex].forEach(index => {
            const img = new Image();
            img.src = currentImages[index].src;
        });
    }
    
    // Fecha lightbox
    function closeLightbox() {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
        lightboxModal.setAttribute('aria-hidden', 'true');
        
        // Retorna foco para o botão que abriu o lightbox
        const activeButton = document.querySelector(`.expand-btn[data-carousel="${currentCarouselIndex}"][data-slide="${currentIndex}"]`);
        if (activeButton) {
            activeButton.focus();
        }
    }
    
    // Navegação
    function prevImage() {
        if (currentImages.length === 0) return;
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateLightboxImage();
        lightboxPrev.focus();
    }
    
    function nextImage() {
        if (currentImages.length === 0) return;
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateLightboxImage();
        lightboxNext.focus();
    }
    
    // Event listeners para botões de expandir
    document.querySelectorAll('.expand-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const carouselIndex = parseInt(this.getAttribute('data-carousel'));
            const slideIndex = parseInt(this.getAttribute('data-slide'));
            openLightbox(carouselIndex, slideIndex);
        });
    });
    
    // Click na imagem para abrir lightbox
    document.querySelectorAll('.slide-image').forEach((slideImage, index) => {
        slideImage.addEventListener('click', function(e) {
            if (e.target.closest('.expand-btn')) return;
            
            const slide = this.closest('.carousel-slide');
            const carousel = slide.closest('.carousel-service');
            const carousels = Array.from(document.querySelectorAll('.carousel-service'));
            const carouselIndex = carousels.indexOf(carousel);
            
            const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
            const slideIndex = slides.indexOf(slide);
            
            openLightbox(carouselIndex, slideIndex);
        });
    });
    
    // Controles do lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', prevImage);
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', nextImage);
    }
    
    // Click fora do conteúdo
    lightboxModal.addEventListener('click', function(e) {
        if (e.target === lightboxModal || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });
    
    // Navegação por teclado
    document.addEventListener('keydown', function(e) {
        if (lightboxModal.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    prevImage();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    break;
            }
        }
    });
    
    // Swipe para mobile no lightbox
    let lightboxTouchStartX = 0;
    
    lightboxModal.addEventListener('touchstart', function(e) {
        lightboxTouchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    
    lightboxModal.addEventListener('touchend', function(e) {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = lightboxTouchStartX - touchEndX;
        const swipeThreshold = 50;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextImage();
            } else {
                prevImage();
            }
        }
    }, { passive: true });
}

// Formulário de contato
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value.trim();
            
            if (!name || !phone || !service || !message) {
                showFormMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }
            
            const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
            if (!phoneRegex.test(phone)) {
                showFormMessage('Por favor, insira um número de telefone válido.', 'error');
                return;
            }
            
            // Simulação de envio
            showFormMessage('✅ Solicitação enviada com sucesso! Entraremos em contato em breve.', 'success');
            
            // Prepara mensagem para WhatsApp
            const whatsappMessage = `Olá! Meu nome é ${name}. Gostaria de solicitar um orçamento para: ${service}. ${message}. Telefone: ${phone}`;
            const whatsappUrl = `https://wa.me/5513982138280?text=${encodeURIComponent(whatsappMessage)}`;
            
            // Abre WhatsApp após 1.5 segundos
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 1500);
            
            // Limpa formulário após 3 segundos
            setTimeout(() => {
                contactForm.reset();
                hideFormMessage();
            }, 3000);
        });
    }
}

function showFormMessage(text, type) {
    hideFormMessage();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = text;
    messageDiv.style.cssText = `
        padding: 15px 20px;
        border-radius: var(--radius);
        margin-top: 20px;
        font-weight: 500;
        background-color: ${type === 'success' ? '#e7f7ef' : '#fee'};
        color: ${type === 'success' ? '#0a5' : '#d33'};
        border: 1px solid ${type === 'success' ? '#bde8d1' : '#fcc'};
        text-align: center;
        font-size: 0.95rem;
        animation: fadeIn 0.3s ease;
    `;
    
    const contactForm = document.getElementById('contactForm');
    contactForm.appendChild(messageDiv);
    
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideFormMessage() {
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

// Navegação suave
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
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Verifica elementos visíveis
function checkVisibleElements() {
    const fadeElements = document.querySelectorAll('.fade-in');
    const windowHeight = window.innerHeight;
    
    fadeElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        
        if (rect.top <= windowHeight * 0.85) {
            element.classList.add('visible');
        }
    });
}

// Carregamento otimizado de imagens
function optimizeImageLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para navegadores antigos
        images.forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
    }
}

// Inicializa otimização
if ('IntersectionObserver' in window) {
    document.addEventListener('DOMContentLoaded', optimizeImageLoading);
}