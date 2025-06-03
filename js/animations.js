// Script para animações avançadas

document.addEventListener('DOMContentLoaded', function() {
    // Inicialização do GSAP
    if (typeof gsap !== 'undefined') {
        // Animação do hero section
        gsap.from('.hero-section h1', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });
        
        gsap.from('.hero-section .lead', {
            duration: 1,
            y: 30,
            opacity: 0,
            delay: 0.3,
            ease: 'power3.out'
        });
        
        gsap.from('.hero-section .btn', {
            duration: 0.8,
            y: 20,
            opacity: 0,
            stagger: 0.2,
            delay: 0.6,
            ease: 'power3.out'
        });
        
        // Animação dos ícones sociais
        gsap.from('.social-icon', {
            duration: 0.5,
            y: -20,
            opacity: 0,
            stagger: 0.1,
            delay: 1,
            ease: 'power2.out'
        });
        
        // Animação de scroll para seções
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            gsap.from(section.querySelector('.section-title'), {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                duration: 0.8,
                y: 30,
                opacity: 0,
                ease: 'power3.out'
            });
            
            gsap.from(section.querySelector('.section-subtitle'), {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                duration: 0.8,
                y: 20,
                opacity: 0,
                delay: 0.2,
                ease: 'power3.out'
            });
        });
        
        // Animação para cards de benefícios
        const benefitItems = document.querySelectorAll('.benefit-item');
        if (benefitItems.length > 0) {
            gsap.from(benefitItems, {
                scrollTrigger: {
                    trigger: benefitItems[0],
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                duration: 0.8,
                y: 30,
                opacity: 0,
                stagger: 0.2,
                ease: 'power3.out'
            });
        }
        
        // Animação para o badge de experiência
        const experienceBadge = document.querySelector('.experience-badge');
        if (experienceBadge) {
            gsap.from(experienceBadge, {
                scrollTrigger: {
                    trigger: experienceBadge,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                duration: 1,
                scale: 0,
                rotation: 180,
                opacity: 0,
                ease: 'elastic.out(1, 0.5)'
            });
        }
        
        // Animação para o WhatsApp flutuante
        const whatsappFloat = document.querySelector('.whatsapp-float');
        if (whatsappFloat) {
            gsap.from(whatsappFloat, {
                duration: 1,
                x: 100,
                opacity: 0,
                delay: 2,
                ease: 'elastic.out(1, 0.5)'
            });
            
            // Animação de pulso contínua
            gsap.to(whatsappFloat, {
                scale: 1.1,
                duration: 0.8,
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut'
            });
        }
    }})

    document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;
    const started = new WeakSet();

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        let count = 0;
        const increment = Math.ceil(target / speed);

        const updateCount = () => {
            count += increment;
            if (count >= target) {
                counter.innerText = target.toLocaleString();
            } else {
                counter.innerText = count.toLocaleString();
                setTimeout(updateCount, 10);
            }
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !started.has(counter)) {
                    started.add(counter);
                    updateCount();
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(counter);
    });
});
