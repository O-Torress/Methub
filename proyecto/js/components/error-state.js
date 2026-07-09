class ErrorState extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <div class="error-state-wrapper">
                <div class="error-icon">⚠️</div>
                <h3 class="error-title">¡Ups! Algo salió mal</h3>
                <p class="error-message">No pudimos cargar la información en este momento.</p>
                <button class="btn-retry">Intentar de nuevo</button>
            </div>
        `;
    }

    setup(message, onRetry) {
        if (message) {
            this.querySelector('.error-message').textContent = message;
        }

        const btn = this.querySelector('.btn-retry');
        if (onRetry) {
            btn.addEventListener('click', () => {
                btn.textContent = 'Reintentando...';
                btn.disabled = true;
                onRetry();
            });
        } else {
            btn.style.display = 'none';
        }
    }
}

customElements.define('error-state', ErrorState);
