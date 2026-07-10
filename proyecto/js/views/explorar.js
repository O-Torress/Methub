function renderExplore(container, departmentId) {
    container.innerHTML = '';

    const layout = document.createElement('div');
    layout.className = 'explore-layout';

    /* ── Search bar ── */
    const searchBar = document.createElement('div');
    searchBar.className = 'explore-search-bar';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'explore-search-input';
    searchInput.placeholder = 'Buscar obras por nombre, artista, tema…';
    searchInput.id = 'explore-search-input';

    const searchBtn = document.createElement('button');
    searchBtn.className = 'explore-search-btn';
    searchBtn.textContent = 'Buscar';
    searchBtn.id = 'explore-search-btn';

    searchBar.appendChild(searchInput);
    searchBar.appendChild(searchBtn);
    layout.appendChild(searchBar);

    /* ── Gallery containers ── */
    const galleriesContainer = document.createElement('div');
    galleriesContainer.className = 'explore-content';

    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'explore-gallery';

    const paginationEl = document.createElement('div');
    paginationEl.className = 'pagination';

    galleriesContainer.appendChild(galleryContainer);
    galleriesContainer.appendChild(paginationEl);
    layout.appendChild(galleriesContainer);
    container.appendChild(layout);

    let currentPage = 1;
    let totalResults = 0;
    let allIds = [];
    let currentObjects = [];
    let isLoading = false;
    let currentQuery = departmentId ? '' : 'art';

    /* ── If coming from a department, set label ── */
    if (departmentId) {
        searchInput.placeholder = 'Buscando obras del departamento…';
    }

    /* ── Search button click ── */
    searchBtn.addEventListener('click', function () {
        const q = searchInput.value.trim();
        if (!q) return;
        currentQuery = q;
        currentPage = 1;
        allIds = [];
        performSearch();
    });

    /* ── Enter key ── */
    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            const q = searchInput.value.trim();
            if (!q) return;
            currentQuery = q;
            currentPage = 1;
            allIds = [];
            performSearch();
        }
    });

    /* ── Initial load ── */
    performSearch();

    async function performSearch() {
        if (isLoading) return;
        isLoading = true;

        galleryContainer.innerHTML = '';
        paginationEl.innerHTML = '';

        let loading = document.createElement('loading-state');
        loading.setAttribute('count', '12');
        galleryContainer.appendChild(loading);

        try {
            let params = { q: currentQuery || 'art', hasImages: 'true' };
            if (departmentId) {
                params.departmentId = departmentId;
                if (!currentQuery) params.q = 'art';
            }

            let result = await searchObjects(params);
            allIds = result.objectIDs;
            totalResults = result.total;

            galleryContainer.innerHTML = '';

            if (totalResults === 0 || allIds.length === 0) {
                let noResults = document.createElement('p');
                noResults.className = 'no-results';
                noResults.textContent = 'No se encontraron obras para "' + (currentQuery || 'art') + '".';
                galleryContainer.appendChild(noResults);
                updatePagination(paginationEl, 0, 0);
                isLoading = false;
                return;
            }

            let startIdx = (currentPage - 1) * 12;
            let pageIds = allIds.slice(startIdx, startIdx + 12);
            currentObjects = await resolveIds(pageIds);

            if (currentObjects.length === 0) {
                let noResults = document.createElement('p');
                noResults.className = 'no-results';
                noResults.textContent = 'No se pudieron cargar las obras de esta pagina.';
                galleryContainer.appendChild(noResults);
                updatePagination(paginationEl, Math.ceil(allIds.length / 12), currentPage);
                isLoading = false;
                return;
            }

            let requestedCount = pageIds.length;
            renderGallery(galleryContainer, currentObjects, requestedCount);
            let totalPages = Math.ceil(allIds.length / 12);
            updatePagination(paginationEl, totalPages, currentPage);
        } catch (error) {
            galleryContainer.innerHTML = '';
            let errorState = document.createElement('error-state');
            errorState.setAttribute('message', 'Error al cargar las obras. Verifica tu conexion.');
            errorState.addEventListener('retry', performSearch);
            galleryContainer.appendChild(errorState);
        }

        isLoading = false;
    }

    window.goToPage = function (page) {
        if (page < 1) return;
        const totalPages = Math.ceil(allIds.length / 12);
        if (page > totalPages) return;
        currentPage = page;
        window.scrollTo({ top: container.offsetTop - 100, behavior: 'smooth' });
        performSearch();
    };
}



function renderGallery(container, objects, requestedCount) {
    container.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'explore-grid';

    objects.forEach(function (obj, index) {
        const card = document.createElement('article');
        card.className = 'explore-card';
        card.dataset.id = obj.objectID;
        card.style.animationDelay = `${index * 0.05}s`;

        const imgContainer = document.createElement('div');
        imgContainer.className = 'explore-card-img';

        if (obj.primaryImageSmall) {
            const img = document.createElement('img');
            img.loading = 'lazy';
            img.src = obj.primaryImageSmall;
            img.alt = obj.title || 'Obra de arte';
            imgContainer.appendChild(img);
        } else {
            const placeholder = document.createElement('div');
            placeholder.className = 'explore-card-img--placeholder';
            placeholder.textContent = 'Sin imagen disponible';
            imgContainer.appendChild(placeholder);
        }
        card.appendChild(imgContainer);

        const info = document.createElement('div');
        info.className = 'explore-card-info';

        const title = document.createElement('h3');
        title.className = 'explore-card-title';
        title.textContent = obj.title || 'Sin titulo';
        info.appendChild(title);

        const artist = document.createElement('p');
        artist.className = 'explore-card-artist';
        artist.textContent = obj.artistDisplayName || 'Artista desconocido';
        info.appendChild(artist);

        const meta = document.createElement('p');
        meta.className = 'explore-card-meta';
        meta.textContent = (obj.objectDate || 'Fecha desconocida') + ' · ' + (obj.department || '');
        info.appendChild(meta);

        card.appendChild(info);

        card.addEventListener('click', function () {
            window.location.hash = '#detalle/' + obj.objectID;
        });

        grid.appendChild(card);
    });

    container.appendChild(grid);

    let failedCount = requestedCount - objects.length;
    if (failedCount > 0) {
        let note = document.createElement('p');
        note.className = 'explore-error-note';
        note.textContent = failedCount + ' obra(s) no pudieron cargarse.';
        container.appendChild(note);
    }
}

function updatePagination(container, totalPages, currentPage) {
    container.innerHTML = '';

    if (totalPages <= 1) return;

    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn';
    prevBtn.textContent = '← Anterior';
    prevBtn.disabled = currentPage <= 1;
    prevBtn.addEventListener('click', function () {
        window.goToPage(currentPage - 1);
    });
    container.appendChild(prevBtn);

    const pageInfo = document.createElement('span');
    pageInfo.className = 'pagination-info';
    pageInfo.textContent = 'Página ' + currentPage + ' de ' + totalPages;
    container.appendChild(pageInfo);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn';
    nextBtn.textContent = 'Siguiente →';
    nextBtn.disabled = currentPage >= totalPages;
    nextBtn.addEventListener('click', function () {
        window.goToPage(currentPage + 1);
    });
    container.appendChild(nextBtn);
}
