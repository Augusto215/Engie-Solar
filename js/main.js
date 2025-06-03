// Script principal para o site M J Feo Energia Solar

// Preloader
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    preloader.style.opacity = '0';
    setTimeout(function() {
        preloader.style.display = 'none';
    }, 500);
});

// Inicialização do AOS (Animate on Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Navbar scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });


    



    // Botão voltar ao topo
    const backToTop = document.querySelector('.back-to-top');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth scroll para links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Timeline interativa
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.2 });

        timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });

        // Modal para vídeos da timeline
        const videoButtons = document.querySelectorAll('.video-btn');
        const timelineModal = document.getElementById('timelineModal');
        
        if (videoButtons.length > 0 && timelineModal) {
            videoButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const timelineItem = this.closest('.timeline-item');
                    const videoSrc = timelineItem.getAttribute('data-video');
                    const stepNumber = timelineItem.getAttribute('data-step');
                    const title = timelineItem.querySelector('h3').textContent;
                    
                    const modalTitle = timelineModal.querySelector('.modal-title');
                    const modalBody = timelineModal.querySelector('.modal-body');
                    
                    modalTitle.textContent = `Etapa ${stepNumber}: ${title}`;
                    modalBody.innerHTML = `<div class="ratio ratio-16x9">
                        <iframe src="${videoSrc}" title="${title}" allowfullscreen></iframe>
                    </div>`;
                    
                    const modal = new bootstrap.Modal(timelineModal);
                    modal.show();
                });
            });
            
            timelineModal.addEventListener('hidden.bs.modal', function() {
                const modalBody = this.querySelector('.modal-body');
                modalBody.innerHTML = '';
            });
        }
    }

    // Inicialização do Swiper para depoimentos
    const testimonialSwiper = new Swiper('.testimonial-swiper', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                effect: 'slide',
            },
            768: {
                slidesPerView: 'auto',
                effect: 'coverflow',
            }
        }
    });

    // Pausa no autoplay do Swiper ao hover
    const swiperContainer = document.querySelector('.testimonial-swiper');
    if (swiperContainer && testimonialSwiper) {
        swiperContainer.addEventListener('mouseenter', function() {
            testimonialSwiper.autoplay.stop();
        });

        swiperContainer.addEventListener('mouseleave', function() {
            testimonialSwiper.autoplay.start();
        });
    }

    // Flip cards
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.flip-card-inner').style.transform = 'rotateY(180deg)';
        });

        card.addEventListener('mouseleave', function() {
            this.querySelector('.flip-card-inner').style.transform = 'rotateY(0deg)';
        });
    });

    // Máscara para telefone
    const phoneInputs = document.querySelectorAll('input[name="phone"]');
    if (phoneInputs.length > 0 && typeof $.fn.mask === 'function') {
        phoneInputs.forEach(input => {
            $(input).mask('(00) 00000-0000');
        });
    }

    // Validação de formulários
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                const submitButton = form.querySelector('button[type="submit"]');
                submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
                submitButton.disabled = true;
                
                // Simulação de envio (substituir por AJAX real)
                setTimeout(() => {
                    const feedbackDiv = form.querySelector('.form-feedback') || document.createElement('div');
                    feedbackDiv.className = 'form-feedback mt-3';
                    feedbackDiv.innerHTML = '<div class="alert alert-success">Mensagem enviada com sucesso! Entraremos em contato em breve.</div>';
                    
                    if (!form.querySelector('.form-feedback')) {
                        form.appendChild(feedbackDiv);
                    }
                    
                    submitButton.innerHTML = 'Enviado!';
                    form.reset();
                    
                    inputs.forEach(input => {
                        input.classList.remove('is-valid');
                    });
                    
                    setTimeout(() => {
                        submitButton.innerHTML = 'Enviar mensagem';
                        submitButton.disabled = false;
                        feedbackDiv.innerHTML = '';
                    }, 5000);
                }, 2000);
            }
        });
    });

    function validateField(field) {
        if (field.type === 'checkbox') {
            if (!field.checked && field.required) {
                field.classList.add('is-invalid');
                return false;
            } else {
                field.classList.remove('is-invalid');
                return true;
            }
        }
        
        if (field.value.trim() === '' && field.required) {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
            return false;
        }
        
        if (field.type === 'email' && field.value.trim() !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value.trim())) {
                field.classList.add('is-invalid');
                field.classList.remove('is-valid');
                return false;
            }
        }
        
        if (field.name === 'phone' && field.value.trim() !== '') {
            const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
            if (!phoneRegex.test(field.value.trim())) {
                field.classList.add('is-invalid');
                field.classList.remove('is-valid');
                return false;
            }
        }
        
        field.classList.remove('is-invalid');
        if (field.value.trim() !== '') {
            field.classList.add('is-valid');
        }
        return true;
    }
});
