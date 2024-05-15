const startTime = new Date('2023-05-01').getTime(); // Début de la période
const endTime = new Date('2023-05-02').getTime(); // Fin de la période

const data_1h = [
    { x: new Date('2023-05-01 03:00:00').getTime(), y: [51.5, 53, 50.5, 52] }, // UTC/TZ
    { x: new Date('2023-05-01 04:00:00').getTime(), y: [52, 55.5, 51, 54.5] }, // UTC/TZ
];

const options1h = {
    chart: {
        type: 'candlestick',
        height: 350
    },
    series: [{
        name: '1h Candles',
        data: data_1h
    }],
    grid: {
        padding: {
            left: 0,  // Ajoute un padding à gauche pour élargir l'espace de l'axe Y
            right: 0  // Ajoute un padding à droite pour empêcher les bougies de toucher le bord du graphique
        }
    },
    xaxis: {
        type: 'datetime',
        min: startTime,
        max: endTime
    }
};

const SIX_HOURS_IN_MS = 6 * 60 * 60 * 1000; // 6 heures en millisecondes

data_12h = [
    { x: new Date('2023-05-01 02:00:00').getTime(), y: [51.5, 62, 48.5, 59] }, // UTC/TZ
    { x: new Date('2023-05-01 14:00:00').getTime(), y: [59, 64.5, 56, 61.5] }, // UTC/TZ
    // Plus de données ici...
];

// Fonction pour transformer les données en ajoutant un décalage de 6 heures
const transformedData = data_12h.map(item => ({
    x: item.x + SIX_HOURS_IN_MS,
    y: item.y
}));

const options12h = {
    chart: {
        type: 'candlestick',
        height: 350,
        /* offsetX: 100, */
    },
    series: [{
        name: '12h Candles',
        data: transformedData
    }],
    grid: {
        padding: {
            left: 30,  // Ajoute un padding à gauche pour élargir l'espace de l'axe Y
            right: 30  // Ajoute un padding à droite pour empêcher les bougies de toucher le bord du graphique
        }
    },
    xaxis: {
        type: 'datetime',
        min: startTime,
        max: endTime,
        /* offsetX: -150, */
    }
};

const chart1h = new ApexCharts(document.querySelector("#chart1h"), options1h);
const chart12h = new ApexCharts(document.querySelector("#chart12h"), options12h);

chart1h.render();
chart12h.render();

function fetchData() {
    fetch('/data')
        .then(response => response.json())
        .then(data => {
            // Transforme et met à jour le graphique avec les nouvelles données
            const data12h = data.data_12h.map(d => ({
                x: d.timestamp,
                y: [d.open, d.high, d.low, d.close]
            }));
            const data1h = data.data_1h.map(d => ({
                x: d.timestamp,
                y: [d.open, d.high, d.low, d.close]
            }));

            chart.updateSeries([
                { name: '1h Candles', data: data1h },
                { name: '12h Candles', data: data12h }
            ]);
        })
        .catch(error => console.error('Error fetching data:', error));

    setTimeout(fetchData, 1000);  // Récupérer les nouvelles données chaque seconde
}

fetchData();
