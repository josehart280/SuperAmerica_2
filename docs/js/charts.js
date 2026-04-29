// ─── Shared config ─────────────────────────────────────
const C = {
    primary:      '#5B8DEF',
    primaryLight: 'rgba(91,141,239,0.18)',
    success:      '#10B981',
    grid:         '#F1F5F9',
    text:         '#94A3B8',
    palette:      ['#5B8DEF','#34D399','#FB923C','#A78BFA','#F472B6'],
    font:         { size: 10, family: "'Inter', sans-serif" }
};

const defaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        x: { grid: { display: false }, border: { display: false },
             ticks: { color: C.text, font: C.font, maxRotation: 0 } },
        y: { grid: { color: C.grid }, border: { display: false },
             ticks: { color: C.text, font: C.font } }
    }
};

// Map to track chart instances
const charts = {};

function destroyChart(id) {
    if (charts[id]) { charts[id].destroy(); delete charts[id]; }
}

// ─── SALES CHART (trend, grouped labels) ───────────────
export function renderSalesChart(id, chartData) {
    destroyChart(id);
    const canvas = document.getElementById(id);
    if (!canvas) return;

    charts[id] = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Ventas',
                data: chartData.values,
                borderColor: C.primary,
                backgroundColor: C.primaryLight,
                fill: true,
                tension: 0.4,
                borderWidth: 2.5,
                pointRadius: chartData.labels.length > 10 ? 2 : 4,
                pointBackgroundColor: C.primary
            }]
        },
        options: {
            ...defaults,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => ` ₡${Number(ctx.raw).toLocaleString('es-CR', { maximumFractionDigits: 0 })}`
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    border: { display: false },
                    ticks: { color: C.text, font: C.font, maxRotation: 0, autoSkip: false }
                },
                y: {
                    grid: { color: C.grid },
                    border: { display: false },
                    ticks: {
                        color: C.text,
                        font: C.font,
                        callback: v => v >= 1_000_000
                            ? `₡${(v / 1_000_000).toFixed(0)}M`
                            : `₡${(v / 1_000).toFixed(0)}K`
                    }
                }
            }
        }
    });
}

export function updateSalesChart(id, chartData) {
    renderSalesChart(id, chartData); // simply re-render
}

// ─── CATEGORY / DONUT CHART ────────────────────────────
export function renderCategoryChart(id, profitObj) {
    destroyChart(id);
    const canvas = document.getElementById(id);
    if (!canvas) return;

    const entries = Object.entries(profitObj).slice(0, 5);
    const labels = entries.map(([k]) => k.length > 16 ? k.substring(0, 14) + '…' : k);
    const values = entries.map(([, v]) => v);

    charts[id] = new Chart(canvas.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data: values,
                backgroundColor: C.palette,
                borderWidth: 0,
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        font: { size: 9, family: C.font.family },
                        color: C.text,
                        boxWidth: 8,
                        padding: 6
                    }
                },
                tooltip: {
                    callbacks: {
                        label: ctx => ` ₡${Number(ctx.raw).toLocaleString('es-CR', { maximumFractionDigits: 0 })}`
                    }
                }
            }
        }
    });
}

// ─── TOP PROFIT BAR CHART ──────────────────────────────
export function renderTopProfitChart(id, profitObj) {
    destroyChart(id);
    const canvas = document.getElementById(id);
    if (!canvas) return;

    const entries = Object.entries(profitObj).slice(0, 5);
    const labels = entries.map(([k]) => k.length > 16 ? k.substring(0, 14) + '…' : k);
    const values = entries.map(([, v]) => v);

    charts[id] = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                data: values,
                backgroundColor: C.palette,
                borderRadius: 5,
                barThickness: 22
            }]
        },
        options: {
            ...defaults,
            indexAxis: 'y',
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => ` ₡${Number(ctx.raw).toLocaleString('es-CR', { maximumFractionDigits: 0 })}`
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: C.grid },
                    border: { display: false },
                    ticks: {
                        color: C.text, font: C.font,
                        callback: v => `₡${(v / 1_000).toFixed(0)}K`
                    }
                },
                y: {
                    grid: { display: false },
                    border: { display: false },
                    ticks: { color: C.text, font: { size: 9, family: C.font.family } }
                }
            }
        }
    });
}

export function updateTopProfitChart(id, profitObj) {
    renderTopProfitChart(id, profitObj);
}

// ─── FORECAST CHART ────────────────────────────────────
export function renderForecastChart(id, predicciones) {
    destroyChart(id);
    const canvas = document.getElementById(id);
    if (!canvas) return;

    const forecast = predicciones.forecast;
    // Show every 3rd label to reduce clutter
    const labels = forecast.map((f, i) => i % 3 === 0 ? f.date.slice(5) : ''); // MM-DD

    charts[id] = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: forecast.map(f => f.date.slice(5)),
            datasets: [
                {
                    label: 'Predicción',
                    data: forecast.map(f => f.value),
                    borderColor: C.primary,
                    borderDash: [5, 4],
                    fill: false,
                    tension: 0.3,
                    borderWidth: 2,
                    pointRadius: 0
                },
                {
                    label: 'Banda Superior',
                    data: forecast.map(f => f.upper),
                    borderColor: 'transparent',
                    backgroundColor: 'rgba(91,141,239,0.1)',
                    fill: '+1',
                    pointRadius: 0
                },
                {
                    label: 'Banda Inferior',
                    data: forecast.map(f => f.lower),
                    borderColor: 'transparent',
                    backgroundColor: 'rgba(91,141,239,0.1)',
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
            ...defaults,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: { font: C.font, color: C.text, boxWidth: 10, filter: item => item.text !== 'Banda Superior' }
                },
                tooltip: {
                    callbacks: {
                        label: ctx => ctx.dataset.label !== 'Banda Superior'
                            ? ` ₡${Number(ctx.raw).toLocaleString('es-CR', { maximumFractionDigits: 0 })}`
                            : null
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    border: { display: false },
                    ticks: { color: C.text, font: C.font, maxTicksLimit: 8, maxRotation: 0 }
                },
                y: {
                    grid: { color: C.grid },
                    border: { display: false },
                    ticks: {
                        color: C.text, font: C.font,
                        callback: v => `₡${(v / 1_000_000).toFixed(1)}M`
                    }
                }
            }
        }
    });
}
