class ErrorState extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        if (this._rendered) return;
        this._rendered = true;

        const message = this.getAttribute('message') || 'Ocurrió un error al cargar los datos.';
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
        if (msgEl && message) {
            msgEl.textContent = message;
        }

        const btn = this.querySelector('.error-state-retry');
        if (btn) {
            if (onRetry) {
                btn.onclick = () => {
                    btn.textContent = 'Reintentando...';
                    btn.disabled = true;
                    onRetry();
                };
            } else {
                btn.style.display = 'none';
            }
        }
    }
}

customElements.define('error-state', ErrorState);
