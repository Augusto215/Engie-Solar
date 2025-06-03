# Planejamento Técnico dos Componentes Dinâmicos

## Bibliotecas e Frameworks Necessários

1. **Bootstrap 5**
   - Base para o layout responsivo
   - Sistema de grid para organização dos elementos
   - Componentes básicos (navbar, cards, forms)

2. **GSAP (GreenSock Animation Platform)**
   - Animações avançadas de entrada e saída
   - Efeitos de parallax e scroll
   - Transições suaves entre estados

3. **AOS (Animate On Scroll)**
   - Animações de elementos ao entrar na viewport
   - Configuração simples para diferentes tipos de animação
   - Compatível com dispositivos móveis

4. **Swiper.js**
   - Carrosséis 3D para depoimentos
   - Galeria de projetos com navegação touch
   - Suporte a múltiplos slides visíveis

5. **Chart.js**
   - Gráficos interativos para calculadora de economia
   - Visualização de dados de geração de energia
   - Animações de entrada e atualização

6. **CountUp.js**
   - Contadores animados para estatísticas
   - Configuração de velocidade e formato
   - Trigger baseado em scroll

7. **Leaflet.js**
   - Mapa interativo de projetos
   - Marcadores personalizados e clusters
   - Controles de zoom e navegação

8. **Isotope.js**
   - Filtros dinâmicos para galeria de projetos
   - Reorganização animada dos elementos
   - Layouts responsivos e adaptáveis

9. **Tippy.js**
   - Tooltips avançados para informações técnicas
   - Posicionamento inteligente
   - Suporte a conteúdo HTML

10. **Lottie**
    - Animações vetoriais leves
    - Ícones animados para seções principais
    - Indicadores de carregamento

## Detalhamento dos Componentes

### 1. Header Moderno com Navegação Inteligente

**Implementação Técnica:**
```javascript
// Mudança de cor da navbar ao scroll
$(window).scroll(function() {
  if ($(window).scrollTop() > 50) {
    $('.navbar').addClass('navbar-scrolled');
  } else {
    $('.navbar').removeClass('navbar-scrolled');
  }
});

// Animação de ícones de redes sociais
gsap.from(".social-icon", {
  duration: 0.5,
  opacity: 0,
  y: -20,
  stagger: 0.1,
  ease: "power2.out"
});
```

**HTML/CSS:**
- Navbar com classe `fixed-top` do Bootstrap
- Transições CSS para mudanças de cor
- Ícones SVG para melhor qualidade e animação

### 2. Hero Section com Vídeo de Background

**Implementação Técnica:**
```javascript
// Contador animado
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
  const updateCount = () => {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText;
    const increment = target / 200;
    
    if (count < target) {
      counter.innerText = Math.ceil(count + increment);
      setTimeout(updateCount, 10);
    } else {
      counter.innerText = target;
    }
  };
  updateCount();
});

// Vídeo de fundo responsivo
const video = document.querySelector('.hero-video');
if (window.innerWidth < 768) {
  video.src = 'video/hero-mobile.mp4';
} else {
  video.src = 'video/hero-desktop.mp4';
}
```

**HTML/CSS:**
- Vídeo em loop com `autoplay` e `muted`
- Overlay com gradiente para melhorar legibilidade do texto
- Texto centralizado com animação de entrada

### 3. Cards Dinâmicos com Efeito Flip

**Implementação Técnica:**
```javascript
// Efeito flip nos cards
$('.flip-card').on('mouseenter', function() {
  $(this).find('.flip-card-inner').css('transform', 'rotateY(180deg)');
});

$('.flip-card').on('mouseleave', function() {
  $(this).find('.flip-card-inner').css('transform', 'rotateY(0deg)');
});

// Animação de entrada com AOS
document.addEventListener('DOMContentLoaded', function() {
  AOS.init({
    duration: 800,
    offset: 100,
    easing: 'ease-in-out'
  });
});
```

**HTML/CSS:**
- Estrutura de card com frente e verso
- Transformação 3D com `transform-style: preserve-3d`
- Atributos `data-aos` para animações de entrada

### 4. Galeria com Filtros Dinâmicos

**Implementação Técnica:**
```javascript
// Inicialização do Isotope
var $grid = $('.grid').isotope({
  itemSelector: '.grid-item',
  layoutMode: 'fitRows'
});

// Filtro ao clicar nos botões
$('.filter-button-group').on('click', 'button', function() {
  var filterValue = $(this).attr('data-filter');
  $grid.isotope({ filter: filterValue });
});

// Classe ativa nos botões de filtro
$('.filter-button-group').each(function(i, buttonGroup) {
  var $buttonGroup = $(buttonGroup);
  $buttonGroup.on('click', 'button', function() {
    $buttonGroup.find('.active').removeClass('active');
    $(this).addClass('active');
  });
});
```

**HTML/CSS:**
- Botões de filtro com atributos `data-filter`
- Grid de itens com classes correspondentes aos filtros
- Transições suaves para reorganização dos itens

### 5. Timeline Interativa

**Implementação Técnica:**
```javascript
// Animação da timeline ao scroll
const timeline = document.querySelector('.timeline');
const timelineItems = document.querySelectorAll('.timeline-item');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.5 });

timelineItems.forEach(item => {
  observer.observe(item);
});

// Modal para vídeos explicativos
$('.timeline-item').on('click', function() {
  const videoSrc = $(this).data('video');
  $('#timelineModal .modal-body').html(`<iframe src="${videoSrc}" frameborder="0" allowfullscreen></iframe>`);
  $('#timelineModal').modal('show');
});
```

**HTML/CSS:**
- Estrutura horizontal com flexbox
- Indicadores visuais para cada etapa
- Transições para destacar a etapa atual

### 6. Carrossel 3D de Depoimentos

**Implementação Técnica:**
```javascript
// Inicialização do Swiper
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
});

// Pausa no autoplay ao hover
$('.testimonial-swiper').on('mouseenter', function() {
  testimonialSwiper.autoplay.stop();
});

$('.testimonial-swiper').on('mouseleave', function() {
  testimonialSwiper.autoplay.start();
});
```

**HTML/CSS:**
- Estrutura de slides com Swiper
- Efeito de coverflow para aparência 3D
- Controles de navegação personalizados

### 7. Calculadora Interativa

**Implementação Técnica:**
```javascript
// Atualização em tempo real dos resultados
$('.calculator-form input[type="range"]').on('input', function() {
  updateCalculation();
});

function updateCalculation() {
  const consumption = $('#consumption').val();
  const sunHours = $('#sun-hours').val();
  const electricityPrice = $('#electricity-price').val();
  
  // Cálculos de economia
  const systemSize = consumption / (30 * sunHours * 0.8);
  const annualSavings = consumption * 12 * electricityPrice;
  const installationCost = systemSize * 4000; // Custo médio por kWp
  const paybackTime = installationCost / annualSavings;
  
  // Atualização dos resultados
  $('#system-size').text(systemSize.toFixed(2) + ' kWp');
  $('#annual-savings').text('R$ ' + annualSavings.toFixed(2));
  $('#payback-time').text(paybackTime.toFixed(1) + ' anos');
  
  // Atualização do gráfico
  updateChart(consumption, annualSavings, paybackTime);
}

function updateChart(consumption, savings, payback) {
  // Código para atualizar o gráfico com Chart.js
}
```

**HTML/CSS:**
- Sliders com `input[type="range"]`
- Exibição em tempo real dos valores selecionados
- Área de resultados com gráficos animados

### 8. Blog com Cards Modernos

**Implementação Técnica:**
```javascript
// Filtro de categorias do blog
$('.blog-filter').on('click', 'button', function() {
  const category = $(this).data('category');
  
  if (category === 'all') {
    $('.blog-card').show();
  } else {
    $('.blog-card').hide();
    $(`.blog-card[data-category="${category}"]`).show();
  }
  
  // Atualizar classe ativa
  $('.blog-filter button').removeClass('active');
  $(this).addClass('active');
});

// Animação de entrada dos cards
AOS.refresh();
```

**HTML/CSS:**
- Grid responsivo com cards de diferentes tamanhos
- Efeito de elevação com sombras CSS
- Categorias com atributos `data-category`

### 9. Mapa Interativo

**Implementação Técnica:**
```javascript
// Inicialização do mapa Leaflet
const map = L.map('projects-map').setView([-15.7801, -47.9292], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Adicionar marcadores de projetos
const markers = L.markerClusterGroup();

projectsData.forEach(project => {
  const marker = L.marker([project.lat, project.lng])
    .bindPopup(`
      <h5>${project.title}</h5>
      <p>${project.description}</p>
      <img src="${project.image}" width="100%">
      <a href="${project.url}" class="btn btn-primary btn-sm mt-2">Ver detalhes</a>
    `);
  
  markers.addLayer(marker);
});

map.addLayer(markers);

// Filtros do mapa
$('.map-filter').on('change', function() {
  const type = $('#filter-type').val();
  const size = $('#filter-size').val();
  
  markers.clearLayers();
  
  projectsData.filter(project => {
    return (type === 'all' || project.type === type) && 
           (size === 'all' || project.size === size);
  }).forEach(project => {
    const marker = L.marker([project.lat, project.lng])
      .bindPopup(`
        <h5>${project.title}</h5>
        <p>${project.description}</p>
        <img src="${project.image}" width="100%">
        <a href="${project.url}" class="btn btn-primary btn-sm mt-2">Ver detalhes</a>
      `);
    
    markers.addLayer(marker);
  });
});
```

**HTML/CSS:**
- Contêiner para o mapa com altura fixa
- Controles de filtro acima do mapa
- Estilização personalizada dos popups

### 10. Formulário de Contato Inteligente

**Implementação Técnica:**
```javascript
// Validação em tempo real
$('.contact-form input, .contact-form textarea').on('input', function() {
  validateField($(this));
});

function validateField($field) {
  const value = $field.val();
  const type = $field.attr('type');
  const name = $field.attr('name');
  let isValid = true;
  
  // Validações específicas por tipo
  if (type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    isValid = emailRegex.test(value);
  } else if (name === 'phone') {
    const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    isValid = phoneRegex.test(value);
  } else {
    isValid = value.length > 0;
  }
  
  // Feedback visual
  if (isValid) {
    $field.removeClass('is-invalid').addClass('is-valid');
  } else {
    $field.removeClass('is-valid').addClass('is-invalid');
  }
  
  return isValid;
}

// Máscara para telefone
$('input[name="phone"]').mask('(00) 00000-0000');

// Envio do formulário
$('.contact-form').on('submit', function(e) {
  e.preventDefault();
  
  let isFormValid = true;
  
  // Validar todos os campos
  $(this).find('input, textarea').each(function() {
    if (!validateField($(this))) {
      isFormValid = false;
    }
  });
  
  if (isFormValid) {
    // Animação de envio
    $(this).find('button[type="submit"]').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...');
    
    // Simulação de envio (substituir por AJAX real)
    setTimeout(() => {
      // Animação de sucesso
      $(this).find('.form-feedback').html('<div class="alert alert-success">Mensagem enviada com sucesso!</div>');
      $(this).find('button[type="submit"]').html('Enviado!').prop('disabled', true);
      
      // Limpar formulário
      $(this).find('input, textarea').val('').removeClass('is-valid');
    }, 2000);
  }
});
```

**HTML/CSS:**
- Campos com validação visual
- Feedback em tempo real para erros
- Animação de envio e confirmação

## Arquitetura de Código

### Estrutura de Arquivos
```
mjfeo_bootstrap_moderno/
├── index.html
├── css/
│   ├── style.css
│   ├── animations.css
│   └── responsive.css
├── js/
│   ├── main.js
│   ├── animations.js
│   ├── calculator.js
│   ├── gallery.js
│   ├── map.js
│   └── forms.js
├── img/
│   ├── logo/
│   ├── icons/
│   ├── projects/
│   └── testimonials/
└── video/
    ├── hero-desktop.mp4
    └── hero-mobile.mp4
```

### Organização do JavaScript
- **main.js**: Inicialização geral e funções comuns
- **animations.js**: Configurações do GSAP e AOS
- **calculator.js**: Lógica da calculadora interativa
- **gallery.js**: Configuração do Isotope e filtros
- **map.js**: Inicialização e controle do mapa Leaflet
- **forms.js**: Validação e envio de formulários

### Organização do CSS
- **style.css**: Estilos gerais e componentes
- **animations.css**: Keyframes e classes de animação
- **responsive.css**: Media queries e ajustes responsivos

## Considerações de Performance

1. **Carregamento Lazy de Imagens e Vídeos**
   - Atributo `loading="lazy"` em imagens
   - Carregamento condicional do vídeo de fundo

2. **Minificação de Recursos**
   - CSS e JavaScript minificados para produção
   - Compressão de imagens com WebP

3. **Otimização de Animações**
   - Uso de `will-change` para elementos animados
   - Preferência por animações CSS quando possível
   - Throttling de eventos de scroll

4. **Carregamento Assíncrono de Scripts**
   - Atributos `async` e `defer` para scripts não críticos
   - Carregamento condicional de bibliotecas pesadas

5. **Otimização para Dispositivos Móveis**
   - Redução de animações complexas em dispositivos móveis
   - Versões reduzidas de imagens e vídeos
   - Ajuste de interações para touch
