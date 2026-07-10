let compareState = {
    panelA: null,
    panelB: null
};

let debounceTimers = { A: null, B: null };

async function renderCompare(container, param) {
    compareState = { panelA: null, panelB: null };
    container.innerHTML = '';

    const pageTitle = document.createElement('h1');
    pageTitle.className = 'compare-page-title';
    pageTitle.textContent = 'Comparador de Obras';
    container.appendChild(pageTitle);

    const layout = document.createElement('div');
    layout.className = 'compare-layout';

    const panelAEl = crearPanel('A', container);
    const panelBEl = crearPanel('B', container);

    layout.appendChild(panelAEl);
    layout.appendChild(panelBEl);
    container.appendChild(layout);

    const tableSection = document.createElement('div');
    tableSection.id = 'compare-table-section';
    tableSection.className = 'compare-table-section';
    tableSection.style.display = 'none';
    container.appendChild(tableSection);

    if (param) {
        precargarObra(param, 'A', panelAEl);
    }
}

function crearPanel(panelId, mainContainer) {
    const panel = document.createElement('div');
    panel.className = 'compare-panel';
    panel.id = `panel-${panelId}`;

    const label = document.createElement('div');
    label.className = 'panel-label';
    label.textContent = `Obra ${panelId}`;
    panel.appendChild(label);

    mostrarBuscador(panel, panelId, mainContainer);

    return panel;
}

function mostrarBuscador(panel, panelId, mainContainer) {
    const label = panel.querySelector('.panel-label');
    panel.innerHTML = '';
    panel.appendChild(label);

    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'panel-search-wrapper';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'panel-search-input';
    input.placeholder = 'Busca una obra por nombre, artista, tema…';
    input.id = `search-input-${panelId}`;

    const resultsList = document.createElement('div');
    resultsList.className = 'panel-results';
    resultsList.id = `results-${panelId}`;

    const hint = document.createElement('p');
    hint.className = 'panel-hint';
    hint.textContent = 'Busca y elige una obra para comparar';
    resultsList.appendChild(hint);

    input.addEventListener('input', () => {
        clearTimeout(debounceTimers[panelId]);
        const query = input.value.trim();

        if (!query) {
            resultsList.innerHTML = '';
            resultsList.appendChild(hint);
            return;
        }

        debounceTimers[panelId] = setTimeout(() => {
            buscarEnPanel(query, resultsList, panelId, panel, mainContainer);
        }, 400);
    });

    searchWrapper.appendChild(input);
    searchWrapper.appendChild(resultsList);
    panel.appendChild(searchWrapper);
}

async function buscarEnPanel(query, resultsList, panelId, panel, mainContainer) {
    resultsList.innerHTML = '';
    const miniLoader = document.createElement('p');
    miniLoader.className = 'panel-loading';
    miniLoader.textContent = '🔍 Buscando…';
    resultsList.appendChild(miniLoader);

    try {
        const { objectIDs } = await searchObjects({ q: query, hasImages: 'true' });

        if (!objectIDs || objectIDs.length === 0) {
            resultsList.innerHTML = '';
            const noResult = document.createElement('p');
            noResult.className = 'panel-no-results';
            noResult.textContent = 'No se encontraron obras con ese término.';
            resultsList.appendChild(noResult);
            return;
        }

        const topIds = objectIDs.slice(0, 5);
        const obras = await resolveIds(topIds);

        resultsList.innerHTML = '';

        if (obras.length === 0) {
            const noResult = document.createElement('p');
            noResult.className = 'panel-no-results';
            noResult.textContent = 'No se pudieron cargar los resultados.';
            resultsList.appendChild(noResult);
            return;
        }

        obras.forEach(obra => {
            const miniCard = crearMiniCard(obra, panelId, panel, mainContainer);
            resultsList.appendChild(miniCard);
        });

    } catch (error) {
        resultsList.innerHTML = '';
        const errMsg = document.createElement('p');
        errMsg.className = 'panel-error';
        errMsg.textContent = 'Error al buscar. ';
        const retryBtn = document.createElement('button');
        retryBtn.textContent = 'Reintentar';
        retryBtn.className = 'btn-retry-inline';
        retryBtn.addEventListener('click', () => buscarEnPanel(query, resultsList, panelId, panel, mainContainer));
        errMsg.appendChild(retryBtn);
        resultsList.appendChild(errMsg);
    }
}

function crearMiniCard(obra, panelId, panel, mainContainer) {
}

function precargarObra(id, panelId, panel) {
}
