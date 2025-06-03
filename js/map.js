// Script para o mapa interativo de projetos

document.addEventListener('DOMContentLoaded', function() {
    // Inicialização do mapa Leaflet
    const mapElement = document.getElementById('projects-map');
    if (!mapElement) return;
    
    // Criar o mapa centralizado no Brasil
    const map = L.map('projects-map').setView([-15.7801, -47.9292], 5);
    
    // Adicionar camada de mapa base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Dados de projetos (simulados)
    const projectsData = [
        {
            lat: -13.8406, 
            lng: -56.0842, 
            title: 'Sistema Solar Residencial',
            description: 'Potência: 5.2 kWp',
            image: 'https://images.unsplash.com/photo-1592833167665-45638958673d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            type: 'residencial',
            size: 'small',
            location: 'Nova Mutum, MT'
        },
        {
            lat: -20.9286, 
            lng: -54.9863, 
            title: 'Sistema Solar Comercial',
            description: 'Potência: 75.6 kWp',
            image: 'https://images.unsplash.com/photo-1605980625600-88d6617f5208?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            type: 'comercial',
            size: 'medium',
            location: 'Sidrolândia, MS'
        },
        {
            lat: -13.8306, 
            lng: -56.1042, 
            title: 'Sistema Solar Fazenda',
            description: 'Potência: 112.8 kWp',
            image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            type: 'rural',
            size: 'large',
            location: 'Nova Mutum, MT'
        },
        {
            lat: -20.7722, 
            lng: -51.7081, 
            title: 'Sistema Solar Industrial',
            description: 'Potência: 256.4 kWp',
            image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            type: 'industrial',
            size: 'xlarge',
            location: 'Três Lagoas, MS'
        },
        {
            lat: -20.9386, 
            lng: -54.9763, 
            title: 'Sistema Solar Residencial',
            description: 'Potência: 8.7 kWp',
            image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            type: 'residencial',
            size: 'small',
            location: 'Sidrolândia, MS'
        },
        {
            lat: -13.8506, 
            lng: -56.0742, 
            title: 'Sistema Solar Igreja',
            description: 'Potência: 32.4 kWp',
            image: 'https://images.unsplash.com/photo-1611365892117-00d770df8a5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            type: 'comercial',
            size: 'medium',
            location: 'Nova Mutum, MT'
        },
        {
            lat: -15.6014, 
            lng: -56.0979, 
            title: 'Sistema Solar Escola',
            description: 'Potência: 45.2 kWp',
            image: 'https://images.unsplash.com/photo-1611365892117-00d770df8a5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            type: 'comercial',
            size: 'medium',
            location: 'Cuiabá, MT'
        },
        {
            lat: -20.4428, 
            lng: -54.6487, 
            title: 'Sistema Solar Condomínio',
            description: 'Potência: 180.6 kWp',
            image: 'https://images.unsplash.com/photo-1605980625600-88d6617f5208?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            type: 'comercial',
            size: 'large',
            location: 'Campo Grande, MS'
        }
    ];
    
    // Criar grupo de marcadores com clusters
    const markers = L.markerClusterGroup();
    
    // Função para obter cor do ícone com base no tipo
    function getMarkerColor(type) {
        switch(type) {
            case 'residencial': return '#4CAF50';
            case 'comercial': return '#2196F3';
            case 'rural': return '#FFC107';
            case 'industrial': return '#9C27B0';
            default: return '#607D8B';
        }
    }
    
    // Função para criar ícone personalizado
    function createCustomIcon(type) {
        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${getMarkerColor(type)}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            popupAnchor: [0, -12]
        });
    }
    
    // Adicionar marcadores ao mapa
    function addMarkersToMap(projects) {
        // Limpar marcadores existentes
        markers.clearLayers();
        
        // Adicionar novos marcadores
        projects.forEach(project => {
            const marker = L.marker([project.lat, project.lng], {
                icon: createCustomIcon(project.type)
            }).bindPopup(`
                <div class="map-popup">
                    <h5>${project.title}</h5>
                    <p>${project.description}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${project.location}</p>
                    <img src="${project.image}" width="100%" class="mb-2">
                    <a href="#projetos" class="btn btn-primary btn-sm">Ver detalhes</a>
                </div>
            `);
            
            markers.addLayer(marker);
        });
        
        map.addLayer(markers);
        
        // Ajustar visualização para mostrar todos os marcadores
        if (projects.length > 0) {
            const bounds = L.latLngBounds(projects.map(p => [p.lat, p.lng]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }
    
    // Inicializar mapa com todos os projetos
    addMarkersToMap(projectsData);
    
    // Filtros do mapa
    const typeFilter = document.getElementById('filter-type');
    const sizeFilter = document.getElementById('filter-size');
    
    if (typeFilter && sizeFilter) {
        // Função para filtrar projetos
        function filterProjects() {
            const selectedType = typeFilter.value;
            const selectedSize = sizeFilter.value;
            
            const filteredProjects = projectsData.filter(project => {
                return (selectedType === 'all' || project.type === selectedType) && 
                       (selectedSize === 'all' || project.size === selectedSize);
            });
            
            addMarkersToMap(filteredProjects);
        }
        
        // Adicionar event listeners aos filtros
        typeFilter.addEventListener('change', filterProjects);
        sizeFilter.addEventListener('change', filterProjects);
    }
    
    // Estilizar popups
    const style = document.createElement('style');
    style.textContent = `
        .map-popup {
            max-width: 250px;
        }
        .map-popup h5 {
            margin-top: 0;
            color: #0099cc;
            font-size: 16px;
        }
        .map-popup p {
            margin-bottom: 8px;
            font-size: 14px;
        }
        .map-popup img {
            border-radius: 4px;
            margin: 8px 0;
        }
        .leaflet-popup-content-wrapper {
            border-radius: 8px;
        }
        .custom-marker {
            transition: transform 0.3s ease;
        }
        .custom-marker:hover {
            transform: scale(1.2);
        }
    `;
    document.head.appendChild(style);
    
    // Redimensionar mapa quando a janela for redimensionada
    window.addEventListener('resize', function() {
        map.invalidateSize();
    });
});
