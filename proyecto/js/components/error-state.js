class ErrorState extends HTMLElement {
    constructor() {
        super();

        const message = this.getAttribute('message') || 'Ocurrio un error al cargar los datos.';
        const retryLabel = this.getAttribute('retry-label') || 'Reintentar';

        const wrapper = document.createElement('div');
        wrapper.className = 'error-state-wrapper';

        const icon = document.createElement('div');
        icon.className = 'error-state-icon';
        icon.textContent = '!';

        const msgEl = document.createElement('p');
        msgEl.className = 'error-state-message';
        msgEl.textContent = message;

        const btn = document.createElement('button');
        btn.className = 'error-state-retry';
        btn.textContent = retryLabel;
        btn.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('retry', { bubbles: true }));
        });

        wrapper.appendChild(icon);
        wrapper.appendChild(msgEl);
        wrapper.appendChild(btn);
        this.appendChild(wrapper);
    }

    setup(message, onRetry) {
        const msgEl = this.querySelector('.error-state-message');
        const btn = this.querySelector('.error-state-retry');
        if (msgEl) msgEl.textContent = message;
        if (onRetry) {
            this.addEventListener('retry', onRetry);
        }
    }
}

customElements.define('error-state', ErrorState);
