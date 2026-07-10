async function renderArtist(container, artistName) {
    if (!artistName) {
        container.innerHTML = '';
        const errorEl = document.createElement('error-state');
        container.appendChild(errorEl);
        errorEl.setup('No se especificó un artista para mostrar.', () => {
            window.location.hash = '#home';
        });
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
        const { objectIDs } = await searchObjects({ artistOrCulture: 'true', q: artistName });

        if (!objectIDs || objectIDs.length === 0) {
            loader.remove();
            const noData = document.createElement('p');
            noData.className = 'artist-no-data';
            noData.textContent = 'No se encontraron obras para este artista.';
            container.appendChild(noData);
            return;
        }
    } catch (error) {
        loader.remove();
        const errorEl = document.createElement('error-state');
        container.appendChild(errorEl);
        errorEl.setup('Error al buscar obras del artista.', () => renderArtist(container, artistName));
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
    compareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.location.hash = `#compare/${obra.objectID}`;
    });

    info.appendChild(title);
    info.appendChild(artist);
    info.appendChild(meta);
    info.appendChild(compareBtn);

    card.appendChild(imgWrapper);
    card.appendChild(info);

    card.addEventListener('click', () => {
        window.location.hash = `#detail/${obra.objectID}`;
    });

    return card;
}
