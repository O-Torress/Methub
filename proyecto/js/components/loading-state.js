class LoadingState extends HTMLElement {
    constructor() {
        super();

        const count = parseInt(this.getAttribute('count')) || 6;

        const wrapper = document.createElement('div');
        wrapper.className = 'loading-state-wrapper';

        for (let i = 0; i < count; i++) {
            const card = document.createElement('div');
            card.className = 'skeleton-card';

            const imgPlaceholder = document.createElement('div');
            imgPlaceholder.className = 'skeleton-img';

            const line1 = document.createElement('div');
            line1.className = 'skeleton-line skeleton-line--title';

            const line2 = document.createElement('div');
            line2.className = 'skeleton-line skeleton-line--short';

            const line3 = document.createElement('div');
            line3.className = 'skeleton-line skeleton-line--short';

            card.appendChild(imgPlaceholder);
            card.appendChild(line1);
            card.appendChild(line2);
            card.appendChild(line3);
            wrapper.appendChild(card);
        }

        this.appendChild(wrapper);
    }
}

customElements.define('loading-state', LoadingState);
