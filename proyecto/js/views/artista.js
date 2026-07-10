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
