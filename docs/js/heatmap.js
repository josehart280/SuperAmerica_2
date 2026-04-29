/**
 * SuperAmerica Dashboard - Heatmap Plugin
 * Hour × Day heatmap visualization using ApexCharts
 */

class HeatmapChart {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.options = {
            title: 'Heatmap: Transacciones por Hora y Día',
            colors: ['#0078d4'],
            ...options
        };
        this.chart = null;
    }

    /**
     * Generate sample heatmap data for demonstration
     * In production, this would come from the server
     */
    generateSampleData() {
        // Days of week: Mon-Sun
        const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        // Hours: 7am - 9pm (15 hours)
        const hours = Array.from({length: 15}, (_, i) => i + 7);
        
        // Generate realistic heatmap data
        const series = days.map((day, dayIndex) => {
            return {
                name: day,
                data: hours.map(hour => {
                    let value = Math.random() * 100;
                    
                    // Peak hours: 11-13 and 18-20
                    if ((hour >= 11 && hour <= 13) || (hour >= 18 && hour <= 20)) {
                        value *= 1.8;
                    }
                    
                    // Weekend higher on mornings
                    if ((dayIndex === 5 || dayIndex === 6) && hour >= 7 && hour <= 11) {
                        value *= 1.3;
                    }
                    
                    // Monday and Tuesday mornings are slower
                    if (dayIndex <= 1 && hour <= 10) {
                        value *= 0.7;
                    }
                    
                    return Math.round(value);
                })
            };
        });
        
        return series;
    }

    /**
     * Render the heatmap chart
     */
    render(data = null) {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container #${this.containerId} not found`);
            return;
        }

        const chartData = data || this.generateSampleData();
        
        // Destroy existing chart if any
        if (this.chart) {
            this.chart.destroy();
        }

        const isDark = document.body.classList.contains('dark-mode');
        
        this.chart = new ApexCharts(document.querySelector(`#${this.containerId}`), {
            series: chartData,
            chart: {
                type: 'heatmap',
                height: 350,
                toolbar: { show: false },
                animations: { enabled: true }
            },
            dataLabels: { 
                enabled: true,
                style: {
                    fontSize: '10px',
                    colors: [isDark ? '#fff' : '#333']
                }
            },
            colors: ['#FE9929'],
            title: {
                text: this.options.title,
                style: {
                    fontSize: '16px',
                    fontWeight: 600,
                    color: isDark ? '#f3f3f3' : '#323130'
                }
            },
            plotOptions: {
                heatmap: {
                    radius: 4,
                    colorScale: {
                        ranges: [
                            { from: 0, to: 30, color: '#FFFFD4', name: 'Bajo' },
                            { from: 31, to: 70, color: '#FED98E', name: 'Medio-Bajo' },
                            { from: 71, to: 120, color: '#FE9929', name: 'Medio-Alto' },
                            { from: 121, to: 200, color: '#CC4C02', name: 'Alto' },
                            { from: 201, to: 5000, color: '#993404', name: 'Pico' }
                        ]
                    }
                }
            },
            xaxis: {
                categories: Array.from({length: 15}, (_, i) => `${i + 7}:00`),
                labels: {
                    style: { colors: isDark ? '#c8c8c8' : '#605e5c' }
                }
            },
            yaxis: {
                labels: {
                    style: { colors: isDark ? '#c8c8c8' : '#605e5c' }
                }
            },
            grid: {
                borderColor: isDark ? '#404040' : '#edebe9'
            },
            tooltip: {
                theme: isDark ? 'dark' : 'light',
                y: {
                    formatter: (val) => `${val} transacciones`
                }
            }
        });

        this.chart.render();
        
        return this.chart;
    }

    /**
     * Update chart with new data
     */
    updateData(newData) {
        if (this.chart) {
            this.chart.updateSeries(newData);
        }
    }

    /**
     * Toggle between light/dark theme
     */
    toggleTheme() {
        if (this.chart) {
            this.render();
        }
    }

    /**
     * Destroy the chart
     */
    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}

// Export for use in other files
window.HeatmapChart = HeatmapChart;