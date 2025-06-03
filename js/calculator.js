// Script para a calculadora interativa

document.addEventListener('DOMContentLoaded', function() {
    // Elementos da calculadora
    const consumptionInput = document.getElementById('consumption');
    const sunHoursInput = document.getElementById('sun-hours');
    const electricityPriceInput = document.getElementById('electricity-price');
    const stateSelect = document.getElementById('state');
    const calculateBtn = document.getElementById('calculate-btn');
    
    // Elementos de exibição de valores
    const consumptionValue = document.getElementById('consumption-value');
    const sunHoursValue = document.getElementById('sun-hours-value');
    const electricityPriceValue = document.getElementById('electricity-price-value');
    
    // Elementos de resultado
    const systemSizeElement = document.getElementById('system-size');
    const annualSavingsElement = document.getElementById('annual-savings');
    const paybackTimeElement = document.getElementById('payback-time');
    const co2ReductionElement = document.getElementById('co2-reduction');
    
    // Gráfico de economia
    let savingsChart;
    
    // Inicializar a calculadora
    function initCalculator() {
        if (!consumptionInput || !sunHoursInput || !electricityPriceInput) return;
        
        // Atualizar valores exibidos ao mover os sliders
        consumptionInput.addEventListener('input', function() {
            consumptionValue.textContent = this.value + ' kWh';
        });
        
        sunHoursInput.addEventListener('input', function() {
            sunHoursValue.textContent = this.value + 'h';
        });
        
        electricityPriceInput.addEventListener('input', function() {
            electricityPriceValue.textContent = 'R$ ' + this.value;
        });
        
        // Calcular ao clicar no botão
        if (calculateBtn) {
            calculateBtn.addEventListener('click', calculateSavings);
        }
        
        // Inicializar o gráfico
        initChart();
        
        // Calcular valores iniciais
        calculateSavings();
    }
    
    // Inicializar o gráfico
    function initChart() {
        const ctx = document.getElementById('savings-chart');
        if (!ctx) return;
        
        savingsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Ano 1', 'Ano 5', 'Ano 10', 'Ano 25'],
                datasets: [{
                    label: 'Economia acumulada (R$)',
                    data: [0, 0, 0, 0],
                    backgroundColor: [
                        'rgba(255, 204, 0, 0.7)',
                        'rgba(255, 204, 0, 0.7)',
                        'rgba(255, 204, 0, 0.7)',
                        'rgba(255, 204, 0, 0.7)'
                    ],
                    borderColor: [
                        'rgba(255, 204, 0, 1)',
                        'rgba(255, 204, 0, 1)',
                        'rgba(255, 204, 0, 1)',
                        'rgba(255, 204, 0, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'R$ ' + context.raw.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Calcular economia e atualizar resultados
    function calculateSavings() {
        if (!consumptionInput || !sunHoursInput || !electricityPriceInput) return;
        
        // Obter valores dos inputs
        const consumption = parseFloat(consumptionInput.value);
        const sunHours = parseFloat(sunHoursInput.value);
        const electricityPrice = parseFloat(electricityPriceInput.value);
        const state = stateSelect ? stateSelect.value : '';
        
        // Calcular tamanho do sistema (kWp)
        const systemSize = consumption / (30 * sunHours * 0.8);
        
        // Calcular economia anual
        const annualSavings = consumption * 12 * electricityPrice;
        
        // Calcular custo de instalação (estimativa)
        let installationCost = systemSize * 4000; // Custo médio por kWp
        
        // Ajustar custo com base no estado (simulação)
        if (state === 'MT' || state === 'MS') {
            installationCost *= 1.05; // 5% mais caro devido à logística
        } else if (state === 'SP') {
            installationCost *= 0.95; // 5% mais barato devido à concorrência
        }
        
        // Calcular tempo de retorno (payback)
        const paybackTime = installationCost / annualSavings;
        
        // Calcular redução de CO2 (estimativa: 0.5 ton por MWh/ano)
        const co2Reduction = (consumption * 12 / 1000) * 0.5;
        
        // Atualizar elementos de resultado
        if (systemSizeElement) systemSizeElement.textContent = systemSize.toFixed(2) + ' kWp';
        if (annualSavingsElement) annualSavingsElement.textContent = 'R$ ' + annualSavings.toFixed(2);
        if (paybackTimeElement) paybackTimeElement.textContent = paybackTime.toFixed(1) + ' anos';
        if (co2ReductionElement) co2ReductionElement.textContent = co2Reduction.toFixed(1) + ' ton/ano';
        
        // Atualizar gráfico
        updateChart(annualSavings);
        
        // Animar as barras de progresso
        animateProgressBars(systemSize, annualSavings, paybackTime, co2Reduction);
    }
    
    // Atualizar o gráfico com novos valores
    function updateChart(annualSavings) {
        if (!savingsChart) return;
        
        const year1 = annualSavings;
        const year5 = annualSavings * 5;
        const year10 = annualSavings * 10;
        const year25 = annualSavings * 25;
        
        savingsChart.data.datasets[0].data = [year1, year5, year10, year25];
        savingsChart.update();
    }
    
    // Animar as barras de progresso
    function animateProgressBars(systemSize, annualSavings, paybackTime, co2Reduction) {
        const progressBars = document.querySelectorAll('.progress-bar');
        if (progressBars.length < 4) return;
        
        // Normalizar valores para porcentagens (0-100)
        const systemSizePercent = Math.min(systemSize * 10, 100); // 0-10 kWp = 0-100%
        const annualSavingsPercent = Math.min(annualSavings / 100, 100); // R$0-R$10.000 = 0-100%
        const paybackTimePercent = Math.max(0, Math.min(100 - (paybackTime - 3) * 10, 100)); // 3-13 anos = 100-0%
        const co2ReductionPercent = Math.min(co2Reduction * 20, 100); // 0-5 ton = 0-100%
        
        // Atualizar larguras das barras
        progressBars[0].style.width = systemSizePercent + '%';
        progressBars[1].style.width = annualSavingsPercent + '%';
        progressBars[2].style.width = paybackTimePercent + '%';
        progressBars[3].style.width = co2ReductionPercent + '%';
        
        // Atualizar cores com base nos valores
        progressBars[0].className = 'progress-bar ' + getColorClass(systemSizePercent);
        progressBars[1].className = 'progress-bar ' + getColorClass(annualSavingsPercent);
        progressBars[2].className = 'progress-bar ' + getColorClass(paybackTimePercent);
        progressBars[3].className = 'progress-bar ' + getColorClass(co2ReductionPercent);
    }
    
    // Obter classe de cor com base na porcentagem
    function getColorClass(percent) {
        if (percent < 30) return 'bg-danger';
        if (percent < 60) return 'bg-warning';
        if (percent < 80) return 'bg-info';
        return 'bg-success';
    }
    
    // Inicializar a calculadora
    initCalculator();
});
