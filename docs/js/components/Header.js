class SaHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const title = this.getAttribute('title') || 'Dashboard';
        const showMonthSelector = this.hasAttribute('show-month-selector');
        const showExport = this.hasAttribute('show-export');

        let actionsHtml = '';

        if (showMonthSelector) {
            actionsHtml += `
                <select id="mes-selector" class="mes-selector" onchange="if(typeof cambiarMes === 'function') cambiarMes()">
                    <option value="todos">Todos los meses</option>
                    <option value="Enero">Enero 2026</option>
                    <option value="Febrero">Febrero 2026</option>
                    <option value="Marzo" selected>Marzo 2026</option>
                </select>
            `;
        }

        if (showExport) {
            actionsHtml += `
                <button class="btn-secondary" onclick="if(typeof exportPDF === 'function') exportPDF()" title="Exportar a PDF">
                    <span class="icon">📄</span>
                    <span>Exportar</span>
                </button>
            `;
        }

        actionsHtml += `
            <button class="theme-toggle" onclick="if(typeof toggleTheme === 'function') toggleTheme()">
                <span class="icon" id="theme-icon">🌙</span>
                <span id="theme-text">Modo Oscuro</span>
            </button>
        `;

        this.innerHTML = `
            <header class="header">
                <h2>${title}</h2>
                <div class="header-actions">
                    ${actionsHtml}
                </div>
            </header>
        `;
    }
}

customElements.define('sa-header', SaHeader);
