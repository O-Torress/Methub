const ITEMS_PER_PAGE = 4;

async function renderArtist(container, artistName) {
    if (!artistName) {
        container.innerHTML = '';
        const errorEl = document.createElement('error-state');
        errorEl.setAttribute('message', 'No se especificó un artista para mostrar.');
        errorEl.addEventListener('retry', function () {
            window.location.hash = '#home';
        });
        container.appendChild(errorEl);
        return;
    }

    container.innerHTML = '';

    const backBtn = document.createElement('button');
    backBtn.className = 'btn-back';
    backBtn.textContent = '← Volver';
    backBtn.addEventListener('click', () => {
        window.history.back();
    });
    container.appendChild(backBtn);

    const header = document.createElement('div');
    header.className = 'artist-header';

    const title = document.createElement('h1');
    title.className = 'artist-title';
    title.textContent = artistName;
    header.appendChild(title);

    const bio = document.createElement('p');
    bio.className = 'artist-bio';
    header.appendChild(bio);

    container.appendChild(header);

    const loader = document.createElement('loading-state');
    loader.setAttribute('count', '4');
    container.appendChild(loader);

    try {
        const { objectIDs } = await searchObjects({ artistOrCulture: 'true', q: artistName, hasImages: 'true' });

        if (!objectIDs || objectIDs.length === 0) {
            loader.remove();
            const noData = document.createElement('p');
            noData.className = 'artist-no-data';
            noData.textContent = 'No se encontraron obras para este artista.';
            container.appendChild(noData);
            return;
        }

        loader.remove();

        const gallery = document.createElement('div');
        gallery.className = 'artist-gallery';
        container.appendChild(gallery);

        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination-controls';
        container.appendChild(paginationContainer);

        const totalItems = objectIDs.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        let currentPage = 1;

        async function loadPage(page) {
            gallery.innerHTML = '';
            
            const miniLoader = document.createElement('loading-state');
            miniLoader.setAttribute('count', '4');
            gallery.appendChild(miniLoader);

            const startIdx = (page - 1) * ITEMS_PER_PAGE;
            const endIdx = startIdx + ITEMS_PER_PAGE;
            const pageIds = objectIDs.slice(startIdx, endIdx);

            try {
                const obras = await resolveIds(pageIds);
                miniLoader.remove();

                if (obras.length === 0) {
                    const noObras = document.createElement('p');
                    noObras.textContent = 'No se pudieron cargar las obras de esta página.';
                    gallery.appendChild(noObras);
                    return;
                }

                if (page === 1 && obras[0]) {
                    bio.textContent = `${obras[0].artistRole || 'Artista'} | Nacimiento/Muerte: ${obras[0].artistBiography || 'Información no disponible'}`;
                }

                obras.forEach(obra => {
                    const card = crearArtworkCard(obra);
                    gallery.appendChild(card);
                });

                renderPagination(paginationContainer, page, totalPages, (targetPage) => {
                    currentPage = targetPage;
                    loadPage(currentPage);
                });
            } catch (error) {
                miniLoader.remove();
                const errorEl = document.createElement('error-state');
                errorEl.setAttribute('message', 'Error al cargar la página de obras.');
                errorEl.addEventListener('retry', function () {
                    loadPage(page);
                });
                gallery.appendChild(errorEl);
            }
        }

        await loadPage(currentPage);
    } catch (error) {
        loader.remove();
        const errorEl = document.createElement('error-state');
        errorEl.setAttribute('message', 'Error al buscar obras del artista.');
        errorEl.addEventListener('retry', function () {
            renderArtist(container, artistName);
        });
        container.appendChild(errorEl);
    }
}

function crearArtworkCard(obra) {
    const card = document.createElement('div');
    card.className = 'artwork-card';

    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'card-img-wrapper';

    if (obra.primaryImageSmall) {
        const img = document.createElement('img');
        img.className = 'card-img';
        img.src = obra.primaryImageSmall;
        img.alt = obra.title || 'Obra del Met';
        img.loading = 'lazy';
        imgWrapper.appendChild(img);
    } else {
        const noImg = document.createElement('div');
        noImg.className = 'card-no-img';
        noImg.textContent = 'Sin imagen disponible';
        imgWrapper.appendChild(noImg);
    }

    const info = document.createElement('div');
    info.className = 'card-info';

    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = obra.title || 'Sin título';

    const artist = document.createElement('p');
    artist.className = 'card-artist';
    artist.textContent = obra.artistDisplayName || 'Artista desconocido';

    const meta = document.createElement('p');
    meta.className = 'card-meta';
    meta.textContent = `${obra.objectDate || 'Fecha desconocida'} | ${obra.medium || 'Técnica no especificada'}`;

    const compareBtn = document.createElement('button');
    compareBtn.className = 'btn-compare-card';
    compareBtn.textContent = '📊 Comparar';
    compareBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        window.location.hash = '#comparar/' + obra.objectID;
    });

    info.appendChild(title);
    info.appendChild(artist);
    info.appendChild(meta);
    info.appendChild(compareBtn);

    card.appendChild(imgWrapper);
    card.appendChild(info);

    card.addEventListener('click', function () {
        window.location.hash = '#detalle/' + obra.objectID;
    });

    return card;
}

function renderPagination(container, currentPage, totalPages, onPageChange) {
    container.innerHTML = '';

    const btnPrev = document.createElement('button');
    btnPrev.className = 'btn-page';
    btnPrev.textContent = '◀ Anterior';
    btnPrev.disabled = currentPage === 1;
    btnPrev.addEventListener('click', () => onPageChange(currentPage - 1));

    const indicator = document.createElement('span');
    indicator.className = 'page-indicator';
    indicator.textContent = `Página ${currentPage} de ${totalPages}`;

    const btnNext = document.createElement('button');
    btnNext.className = 'btn-page';
    btnNext.textContent = 'Siguiente ▶';
    btnNext.disabled = currentPage === totalPages;
    btnNext.addEventListener('click', () => onPageChange(currentPage + 1));

    container.appendChild(btnPrev);
    container.appendChild(indicator);
    container.appendChild(btnNext);
}
