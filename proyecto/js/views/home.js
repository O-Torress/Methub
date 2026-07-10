(function () {
    const FEATURED_LIMIT = 8;

    function createElement(tagName, className, textContent) {
        const element = document.createElement(tagName);
        if (className) {
            element.className = className;
        }
        if (textContent !== undefined && textContent !== null) {
            element.textContent = textContent;
        }
        return element;
    }

    function createStatCard(label, value) {
        const card = createElement('div', 'home-stat-card');
        const valueEl = createElement('div', 'home-stat-value', value);
        const labelEl = createElement('div', 'home-stat-label', label);
        card.appendChild(valueEl);
        card.appendChild(labelEl);
        return card;
    }

    function createArtworkCard(artwork) {
        const card = createElement('article', 'home-card');
        card.tabIndex = 0;

        const imageWrapper = createElement('div', 'home-card-image');
        const image = createElement('img');
        image.alt = artwork.title || 'Obra del museo';

        if (artwork.primaryImageSmall || artwork.primaryImage) {
            image.src = artwork.primaryImageSmall || artwork.primaryImage;
        } else {
            const placeholder = createElement('div', 'home-card-placeholder', 'Sin imagen disponible');
            imageWrapper.appendChild(placeholder);
        }

        if (image.src) {
            imageWrapper.appendChild(image);
        }

        const info = createElement('div', 'home-card-info');
        const title = createElement('h3', 'home-card-title', artwork.title || 'Obra sin título');
        const artist = createElement('p', 'home-card-artist', artwork.artistDisplayName || 'Artista desconocido');
        const meta = createElement('p', 'home-card-meta', `${artwork.objectDate || 'Fecha desconocida'} · ${artwork.department || 'Departamento desconocido'}`);

        info.appendChild(title);
        info.appendChild(artist);
        info.appendChild(meta);

        card.appendChild(imageWrapper);
        card.appendChild(info);

        const goToDetail = () => {
            window.location.hash = `#detalle/${artwork.objectID}`;
        };

        card.addEventListener('click', goToDetail);
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                goToDetail();
            }
        });

        return card;
    }

    function createHero() {
        const hero = createElement('section', 'home-hero');

        const content = createElement('div', 'home-hero-content');
        const eyebrow = createElement('p', 'home-hero-eyebrow', '');
        const title = createElement('h1', 'home-hero-title', ' Museo Metropolitano de Arte');
        const description = createElement('p', 'home-hero-description', 'El Museo Metropolitano de Arte es uno de los museos de arte más destacados del mundo. Situado en el distrito de Manhattan, en la ciudad de Nueva York, abrió sus puertas el 20 de febrero de 1872 ​​​​​La colección del museo es de más de dos millones de obras de arte de todo el mundo.​');

        const actions = createElement('div', 'home-hero-actions');
        const primaryButton = createElement('button', 'home-btn home-btn--primary', 'Explorar colección');
        primaryButton.addEventListener('click', () => {
            window.location.hash = '#explorar';
        });

        const secondaryButton = createElement('button', 'home-btn home-btn--secondary', 'Comparar obras');
        secondaryButton.addEventListener('click', () => {
            window.location.hash = '#comparar';
        });

        actions.appendChild(primaryButton);
        actions.appendChild(secondaryButton);

        content.appendChild(eyebrow);
        content.appendChild(title);
        content.appendChild(description);
        content.appendChild(actions);

        const imageWrapper = createElement('div', 'home-hero-image-wrapper');
        const image = createElement('img', 'home-hero-image');
        image.src = 'https://cdn.sanity.io/images/cctd4ker/production/c47d68fbeb2ac1df1c97065fc4c9576314114ac2-2100x1150.jpg?rect=539,36,1011,1074&w=3840&q=75&fit=clip&auto=format';
        image.alt = 'Exterior del Museo Metropolitano de Arte';
        imageWrapper.appendChild(image);

        hero.appendChild(content);
        hero.appendChild(imageWrapper);
        return hero;
    }

    function renderHome(container) {
        container.replaceChildren();

        const page = createElement('div', 'home-page');
        page.appendChild(createHero());
        container.appendChild(page);
    }

    window.renderHome = renderHome;
})();