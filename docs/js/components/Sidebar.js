class SaSidebar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const currentPath = window.location.pathname;
        
        const isActive = (path) => {
            if (path === '/' && currentPath === '/') return 'active';
            if (path !== '/' && currentPath.includes(path)) return 'active';
            return '';
        };

        this.innerHTML = `
            <aside class="sidebar">
                <div class="sidebar-logo">
                    <div style="width: 32px; height: 32px; background: var(--gradient-primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">S</div>
                    <h1>SuperAmerica</h1>
                </div>
                <ul class="sidebar-nav">
                    <li><a href="/" class="${isActive('/')}"><span class="icon">🏠</span><span>Inicio</span></a></li>
                    <li><a href="/pages/resumen.html" class="${isActive('/resumen.html')}"><span class="icon">📊</span><span>Resumen</span></a></li>
                    <li><a href="/pages/ventas.html" class="${isActive('/ventas.html')}"><span class="icon">💰</span><span>Ventas</span></a></li>
                    <li><a href="/pages/productos.html" class="${isActive('/productos.html')}"><span class="icon">🛒</span><span>Productos</span></a></li>
                    <li><a href="/pages/insights.html" class="${isActive('/insights.html')}"><span class="icon">💡</span><span>Hallazgos</span></a></li>
                    <li><a href="/pages/predicciones.html" class="${isActive('/predicciones.html')}"><span class="icon">📈</span><span>Predicciones</span></a></li>
                    <li><a href="/pages/settings.html" class="${isActive('/settings.html')}"><span class="icon">⚙️</span><span>Configuración</span></a></li>
                </ul>
            </aside>
        `;
    }
}

customElements.define('sa-sidebar', SaSidebar);
