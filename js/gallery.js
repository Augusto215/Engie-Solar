// Script para a galeria de projetos com filtros dinâmicos

document.addEventListener('DOMContentLoaded', function() {
    // Inicialização do Isotope para filtros de projetos
    const grid = document.querySelector('.grid');
    if (grid) {
        const iso = new Isotope(grid, {
            itemSelector: '.grid-item',
            layoutMode: 'fitRows',
            transitionDuration: '0.6s'
        });

        // Filtros para a galeria de projetos
        const filterButtons = document.querySelectorAll('.filter-button');
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');
                
                // Atualizar classe ativa nos botões
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                
                // Filtrar os itens
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

    // Filtros para o blog
    const blogFilter = document.querySelector('.blog-filter');
    if (blogFilter) {
        const blogButtons = blogFilter.querySelectorAll('button');
        const blogCards = document.querySelectorAll('.blog-card');
        
        blogButtons.forEach(button => {
            button.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                // Atualizar classe ativa nos botões
                blogButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                
                // Filtrar os cards do blog
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
                
                // Atualizar AOS após filtrar
                setTimeout(() => {
                    AOS.refresh();
                }, 500);
            });
        });
    }
});
