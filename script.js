// Registrar plugin de zoom
Chart.register(ChartZoom);

// Configurações dos motores
const motorConfigs = {
    'UG06': {
        power1Stage: 13.5, // kW
        power2Stage: 27,   // kW
        current: 26.1,     // A
        voltage: 480,      // V
        circuit: 'trifásico',
        color: '#3498db'   // Azul
    },
    'UG19': {
        power1Stage: 13.5, // kW
        power2Stage: 27,   // kW
        current: 26.1,     // A
        voltage: 480,      // V
        circuit: 'trifásico',
        color: '#f1c40f'   // Amarelo
    },
    'UG20': {
        power1Stage: 18,   // kW
        power2Stage: 36,   // kW
        current: 45.2,     // A
        voltage: 480,      // V
        circuit: 'bifásico',
        color: '#27ae60'   // Verde
    }
};

let chart;
let csvData = [];

// Função para carregar e processar dados CSV
async function loadCSVData() {
    try {
        const response = await fetch('data.csv');
        const csvText = await response.text();
        
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(';');
        
        csvData = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(';');
            if (values.length >= 4) {
                csvData.push({
                    time: values[0],
                    ug06: parseFloat(values[1].replace(',', '.')),
                    ug19: parseFloat(values[2].replace(',', '.')),
                    ug20: parseFloat(values[3].replace(',', '.'))
                });
            }
        }
        
        console.log('Dados CSV carregados:', csvData.length, 'registros');
        return csvData;
    } catch (error) {
        console.error('Erro ao carregar CSV:', error);
        return [];
    }
}

// Função para converter tempo em minutos desde o início
function timeToMinutes(timeStr) {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return hours * 60 + minutes + seconds / 60;
}

// Função para detectar se está em fase de aquecimento (2 estágios) ou resfriamento (1 estágio)
function detectHeatingPhase(data, motorKey, index) {
    if (index === 0) return 'heating'; // Primeiro ponto assume aquecimento
    
    const current = data[index][motorKey];
    const previous = data[index - 1][motorKey];
    
    return current > previous ? 'heating' : 'cooling';
}

// Função para calcular taxa de elevação de temperatura
function calculateTemperatureRate(data, motorKey, index) {
    if (index === 0) return 0;
    
    const currentTemp = data[index][motorKey];
    const previousTemp = data[index - 1][motorKey];
    const currentTime = timeToMinutes(data[index].time);
    const previousTime = timeToMinutes(data[index - 1].time);
    
    const tempDiff = currentTemp - previousTemp;
    const timeDiff = currentTime - previousTime;
    
    return timeDiff > 0 ? tempDiff / timeDiff : 0; // °C/min
}

// Função para calcular consumo de energia
function calculateEnergyConsumption(data, motorKey) {
    const motorConfig = motorConfigs[motorKey.toUpperCase()];
    let total1Stage = 0; // kWh
    let total2Stage = 0; // kWh
    let time1Stage = 0;  // horas
    let time2Stage = 0;  // horas
    
    for (let i = 1; i < data.length; i++) {
        const phase = detectHeatingPhase(data, motorKey, i);
        const currentTime = timeToMinutes(data[i].time);
        const previousTime = timeToMinutes(data[i - 1].time);
        const timeDiff = (currentTime - previousTime) / 60; // converter para horas
        
        if (phase === 'heating') {
            // 2 estágios ligados
            total2Stage += motorConfig.power2Stage * timeDiff;
            time2Stage += timeDiff;
        } else {
            // 1 estágio ligado
            total1Stage += motorConfig.power1Stage * timeDiff;
            time1Stage += timeDiff;
        }
    }
    
    const totalTime = time1Stage + time2Stage;
    const totalConsumption = total1Stage + total2Stage;
    
    return {
        avg1Stage: time1Stage > 0 ? (total1Stage / time1Stage) : motorConfig.power1Stage,
        avg2Stage: time2Stage > 0 ? (total2Stage / time2Stage) : motorConfig.power2Stage,
        avgTotal: totalTime > 0 ? (totalConsumption / totalTime) : ((total1Stage + total2Stage) / totalTime || 0),
        total1Stage,
        total2Stage,
        totalConsumption,
        time1Stage,
        time2Stage,
        totalTime
    };
}

// Função para criar o gráfico
function createChart(data) {
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    
    // Preparar dados para o gráfico
    const labels = data.map(row => row.time);
    
    const datasets = [
        {
            label: 'Aquecimento UG#06',
            data: data.map((row, index) => ({
                x: row.time,
                y: row.ug06,
                phase: detectHeatingPhase(data, 'ug06', index),
                rate: calculateTemperatureRate(data, 'ug06', index)
            })),
            borderColor: motorConfigs.UG06.color,
            backgroundColor: motorConfigs.UG06.color + '20',
            borderWidth: 1.5,
            fill: false,
            tension: 0.1
        },
        {
            label: 'Aquecimento UG#19',
            data: data.map((row, index) => ({
                x: row.time,
                y: row.ug19,
                phase: detectHeatingPhase(data, 'ug19', index),
                rate: calculateTemperatureRate(data, 'ug19', index)
            })),
            borderColor: motorConfigs.UG19.color,
            backgroundColor: motorConfigs.UG19.color + '20',
            borderWidth: 1.5,
            fill: false,
            tension: 0.1
        },
        {
            label: 'Aquecimento UG#20',
            data: data.map((row, index) => ({
                x: row.time,
                y: row.ug20,
                phase: detectHeatingPhase(data, 'ug20', index),
                rate: calculateTemperatureRate(data, 'ug20', index)
            })),
            borderColor: motorConfigs.UG20.color,
            backgroundColor: motorConfigs.UG20.color + '20',
            borderWidth: 1.5,
            fill: false,
            tension: 0.1
        }
    ];

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Comparação de Aquecimento dos Motores',
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    filter: function(tooltipItem) {
                        // Mostrar apenas um tooltip por vez (o primeiro da lista)
                        return tooltipItem.datasetIndex === 0;
                    },
                    callbacks: {
                        title: function(context) {
                            return 'Tempo: ' + context[0].label;
                        },
                        label: function(context) {
                            const dataIndex = context.dataIndex;
                            const timeFromStart = timeToMinutes(context.label).toFixed(1);
                            
                            // Coletar dados de todos os motores para este ponto no tempo
                            const ug06Data = chart.data.datasets[0].data[dataIndex];
                            const ug19Data = chart.data.datasets[1].data[dataIndex];
                            const ug20Data = chart.data.datasets[2].data[dataIndex];
                            
                            return [
                                `UG#06: ${ug06Data.y.toFixed(1)}°C`,
                                `UG#19: ${ug19Data.y.toFixed(1)}°C`,
                                `UG#20: ${ug20Data.y.toFixed(1)}°C`,
                                `Tempo de aquecimento: ${timeFromStart} min`
                            ];
                        }
                    }
                },
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        drag: {
                            enabled: true,
                            backgroundColor: 'rgba(225,225,225,0.3)'
                        },
                        mode: 'xy',
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy',
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Tempo (HH:MM:SS)'
                    },
                    grid: {
                        display: true,
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temperatura (°C)'
                    },
                    min: 20,
                    max: 90,
                    grid: {
                        display: true,
                        color: 'rgba(0,0,0,0.1)'
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        },
        plugins: [{
            id: 'temperatureLines',
            afterDraw: function(chart) {
                const ctx = chart.ctx;
                const yAxis = chart.scales.y;
                const xAxis = chart.scales.x;
                
                // Linha tracejada laranja para 50.1°C
                const y50 = yAxis.getPixelForValue(50.1);
                ctx.save();
                ctx.strokeStyle = '#ff8c00';
                ctx.lineWidth = 2;
                ctx.setLineDash([10, 5]);
                ctx.beginPath();
                ctx.moveTo(xAxis.left, y50);
                ctx.lineTo(xAxis.right, y50);
                ctx.stroke();
                
                // Texto para a linha de 50.1°C
                ctx.fillStyle = '#ff8c00';
                ctx.font = 'bold 12px Arial';
                ctx.fillText('Temp. mín para partida (50.1°C)', xAxis.left + 10, y50 - 5);
                
                ctx.restore();
            }
        }]
    });
}

// Função para atualizar os cartões de informação
function updateInfoCards(data) {
    const motors = ['ug06', 'ug19', 'ug20'];
    const motorNumbers = ['06', '19', '20'];
    
    motors.forEach((motorKey, index) => {
        const consumption = calculateEnergyConsumption(data, motorKey);
        const motorNum = motorNumbers[index];
        
        // Calcular média total de consumo durante todo o período
        const totalTimeHours = consumption.totalTime;
        const avgTotalConsumption = totalTimeHours > 0 ? consumption.totalConsumption / totalTimeHours : 0;
        
        document.getElementById(`motor${motorNum}-total`).textContent = avgTotalConsumption.toFixed(2);
    });
}

// Função principal para inicializar a aplicação
async function init() {
    console.log('Inicializando aplicação...');
    
    // Mostrar loading
    const chartContainer = document.querySelector('.chart-container');
    chartContainer.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    
    try {
        // Carregar dados
        const data = await loadCSVData();
        
        if (data.length === 0) {
            throw new Error('Nenhum dado foi carregado');
        }
        
        // Restaurar canvas
        chartContainer.innerHTML = '<canvas id="temperatureChart"></canvas>';
        
        // Criar gráfico
        createChart(data);
        
        // Atualizar cartões de informação
        updateInfoCards(data);
        
        console.log('Aplicação inicializada com sucesso');
        
    } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
        chartContainer.innerHTML = '<p style="text-align: center; color: #e74c3c;">Erro ao carregar os dados. Verifique se o arquivo data.csv está disponível.</p>';
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', init);

