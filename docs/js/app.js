/**
 * SuperAmerica Dashboard - Main Application
 * Shared utilities and theme management
 */

// Format currency
function formatCurrency(value) {
    return '₡' + Math.round(value).toLocaleString();
}

// Format number
function formatNumber(value) {
    return Math.round(value).toLocaleString();
}

// Theme management
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

// Toggle theme
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Update all theme toggles on page
    document.querySelectorAll('.theme-toggle').forEach(btn => {
        const icon = btn.querySelector('#theme-icon');
        const text = btn.querySelector('#theme-text');
        if (icon) icon.textContent = isDark ? '☀️' : '🌙';
        if (text) text.textContent = isDark ? 'Modo Claro' : 'Modo Oscuro';
    });
    
    // Dispatch event for charts to update
    window.dispatchEvent(new Event('themechange'));
}

// Fetch with error handling
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        return null;
    }
}

// Export utilities
window.SuperAmericaDashboard = {
    formatCurrency,
    formatNumber,
    initTheme,
    toggleTheme,
    fetchData
};