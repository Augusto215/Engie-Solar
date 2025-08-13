document.addEventListener('DOMContentLoaded', function() {
    // Inicialização do Isotope para filtros de projetos
    const grid = document.querySelector('.grid');
    if (grid) {
        const iso = new Isotope(grid, {
            itemSelector: '.grid-item',
            layoutMode: 'fitRows',
            transitionDuration: '0.6s',
            filter: '.residencial' // <-- já inicia filtrando por "residencial"
        });

        // Ajusta o botão ativo inicial
        const filterButtons = document.querySelectorAll('.filter-button');
        filterButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('.filter-button[data-filter=".residencial"]').classList.add('active');

        // Filtros para a galeria de projetos
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');
                
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                iso.arrange({ filter: filterValue });
            });
        });

        // Animação de entrada para os itens da galeria
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.querySelector('.project-overlay').style.opacity = '1';
            });
            card.addEventListener('mouseleave', function() {
                this.querySelector('.project-overlay').style.opacity = '0';
            });
        });
    }

    // Filtros para o blog (mantém igual)
    const blogFilter = document.querySelector('.blog-filter');
    if (blogFilter) {
        const blogButtons = blogFilter.querySelectorAll('button');
        const blogCards = document.querySelectorAll('.blog-card');
        
        blogButtons.forEach(button => {
            button.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                blogButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                if (category === 'all') {
                    blogCards.forEach(card => {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    });
                } else {
                    blogCards.forEach(card => {
                        if (card.getAttribute('data-category') === category) {
                            card.style.display = 'block';
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            }, 50);
                        } else {
                            card.style.opacity = '0';
                            card.style.transform = 'translateY(20px)';
                            setTimeout(() => {
                                card.style.display = 'none';
                            }, 300);
                        }
                    });
                }
                
                setTimeout(() => {
                    AOS.refresh();
                }, 500);
            });
        });
    }
});
