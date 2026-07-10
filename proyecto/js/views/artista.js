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
}
