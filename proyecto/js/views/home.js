(function () {
    const FEATURED_LIMIT = 10;

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

    function createHero() {
        const hero = createElement('section', 'home-hero');

        const content = createElement('div', 'home-hero-content');
        const eyebrow = createElement('p', 'home-hero-eyebrow', '');
        const title = createElement('h1', 'home-hero-title', ' Museo Metropolitano de Arte');
        const description = createElement('p', 'home-hero-description', 'El Museo Metropolitano de Arte es uno de los museos de arte más destacados del mundo. Situado en el distrito de Manhattan, en la ciudad de Nueva York, abrió sus puertas el 20 de febrero de 1872 ​​​​​La colección del museo es de más de dos millones de obras de arte de todo el mundo.​');

        const actions = createElement('div', 'home-hero-actions');
        const primaryButton = createElement('button', 'home-btn home-btn--primary', 'Explorar colección');
        primaryButton.addEventListener('click', function () {
            window.location.hash = '#explorar';
        });

        const secondaryButton = createElement('button', 'home-btn home-btn--secondary', 'Comparar obras');
        secondaryButton.addEventListener('click', function () {
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

    function createStatsSection() {
        const section = createElement('section', 'home-stats-section');
        const title = createElement('h2', 'home-section-title', 'Estadísticas del Museo');
        section.appendChild(title);

        const loader = document.createElement('loading-state');
        loader.setAttribute('count', '3');
        section.appendChild(loader);

        const statsGrid = createElement('div', 'home-stats-grid');
        section.appendChild(statsGrid);

        return { section, loader, statsGrid };
    }

    function renderStats(statsGrid, departmentsCount, highlightsCount) {
        statsGrid.innerHTML = '';

        const stats = [
            { label: 'Departamentos', value: departmentsCount, icon: '🏛️' },
            { label: 'Obras destacadas', value: highlightsCount, icon: '⭐' },
            { label: 'Colección total', value: '~470,000', icon: '🎨' }
        ];

        stats.forEach(function (stat) {
            const card = createElement('div', 'home-stat-card');
            const icon = createElement('span', 'home-stat-icon', stat.icon);
            const value = createElement('span', 'home-stat-value', String(stat.value));
            const label = createElement('span', 'home-stat-label', stat.label);
            card.appendChild(icon);
            card.appendChild(value);
            card.appendChild(label);
            statsGrid.appendChild(card);
        });
    }

    function createFeaturedSection() {
        const section = createElement('section', 'home-featured-section');
        const title = createElement('h2', 'home-section-title', 'Obras Destacadas');
        section.appendChild(title);

        const loader = document.createElement('loading-state');
        loader.setAttribute('count', String(FEATURED_LIMIT));
        section.appendChild(loader);

        const grid = createElement('div', 'home-featured-grid');
        section.appendChild(grid);

        return { section, loader, grid };
    }

    function renderFeaturedCard(obj) {
        const card = createElement('article', 'home-featured-card');
        card.dataset.id = obj.objectID;

        const imgContainer = createElement('div', 'home-featured-img');
        if (obj.primaryImageSmall) {
            const img = createElement('img');
            img.loading = 'lazy';
            img.src = obj.primaryImageSmall;
            img.alt = obj.title || 'Obra de arte';
            imgContainer.appendChild(img);
        } else {
            const placeholder = createElement('div', 'explore-card-img--placeholder', 'Sin imagen disponible');
            imgContainer.appendChild(placeholder);
        }
        card.appendChild(imgContainer);

        const info = createElement('div', 'home-featured-info');
        const titleEl = createElement('h3', 'home-featured-title', obj.title || 'Sin título');
        const artistEl = createElement('p', 'home-featured-artist', obj.artistDisplayName || 'Artista desconocido');
        const metaEl = createElement('p', 'home-featured-meta',
            (obj.objectDate || 'Fecha desconocida') + ' · ' + (obj.department || ''));

        info.appendChild(titleEl);
        info.appendChild(artistEl);
        info.appendChild(metaEl);
        card.appendChild(info);

        card.addEventListener('click', function () {
            window.location.hash = '#detalle/' + obj.objectID;
        });

        return card;
    }

    async function renderHome(container) {
        container.replaceChildren();

        const page = createElement('div', 'home-page');
        page.appendChild(createHero());
        container.appendChild(page);

        const statsParts = createStatsSection();
        page.appendChild(statsParts.section);

        const featuredParts = createFeaturedSection();
        page.appendChild(featuredParts.section);

        try {
            const departments = await getDepartments();
            const deptCount = departments.length;

            const searchData = await searchObjects({ q: 'art', isHighlight: 'true', hasImages: 'true' });
            const highlightIds = searchData.objectIDs || [];

            statsParts.loader.remove();
            renderStats(statsParts.statsGrid, deptCount, highlightIds.length);

            if (highlightIds.length === 0) {
                featuredParts.loader.remove();
                const emptyMsg = createElement('p', 'no-results', 'No se encontraron obras destacadas.');
                featuredParts.grid.appendChild(emptyMsg);
                return;
            }

            const idsToLoad = highlightIds.slice(0, FEATURED_LIMIT);
            const results = await Promise.allSettled(idsToLoad.map(function (id) { return getObject(id); }));
            const works = results
                .filter(function (r) { return r.status === 'fulfilled'; })
                .map(function (r) { return r.value; });

            featuredParts.loader.remove();

            if (works.length === 0) {
                const errorEl = document.createElement('error-state');
                errorEl.setAttribute('message', 'No se pudieron cargar las obras destacadas.');
                errorEl.addEventListener('retry', function () {
                    renderHome(container);
                });
                featuredParts.grid.appendChild(errorEl);
                return;
            }

            works.forEach(function (obj) {
                featuredParts.grid.appendChild(renderFeaturedCard(obj));
            });

            var failedCount = idsToLoad.length - works.length;
            if (failedCount > 0) {
                var note = createElement('p', 'explore-error-note',
                    failedCount + ' obra(s) no pudieron cargarse.');
                featuredParts.grid.appendChild(note);
            }

        } catch (error) {
            statsParts.loader.remove();
            featuredParts.loader.remove();

            var errorContainer = createElement('div', 'home-error-container');
            var errorEl = document.createElement('error-state');
            errorEl.setAttribute('message', 'Error al cargar los datos del museo. Verifica tu conexión.');
            errorEl.addEventListener('retry', function () {
                renderHome(container);
            });
            errorContainer.appendChild(errorEl);
            page.appendChild(errorContainer);
        }
    }

    window.renderHome = renderHome;
})();
