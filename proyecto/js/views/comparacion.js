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
    miniLoader.textContent = 'Buscando obras…';
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
    const card = document.createElement('div');
    card.className = 'mini-card';

    const otraObra = panelId === 'A' ? compareState.panelB : compareState.panelA;
    const yaSeleccionada = otraObra && otraObra.objectID === obra.objectID;

    if (yaSeleccionada) {
        card.classList.add('mini-card--disabled');
        card.title = 'Ya está seleccionada en el otro panel';
    }

    const img = document.createElement('img');
    img.className = 'mini-card-img';
    img.src = obra.primaryImageSmall || '';
    img.alt = obra.title || 'Sin título';
    img.onerror = () => { img.style.display = 'none'; };

    const info = document.createElement('div');
    info.className = 'mini-card-info';

    const title = document.createElement('span');
    title.className = 'mini-card-title';
    title.textContent = obra.title || 'Sin título';

    const artist = document.createElement('span');
    artist.className = 'mini-card-artist';
    artist.textContent = obra.artistDisplayName || 'Artista desconocido';

    if (yaSeleccionada) {
        const tag = document.createElement('span');
        tag.className = 'mini-card-tag';
        tag.textContent = 'Ya seleccionada en otro panel';
        info.appendChild(tag);
    }

    info.appendChild(title);
    info.appendChild(artist);
    card.appendChild(img);
    card.appendChild(info);

    if (!yaSeleccionada) {
        card.addEventListener('click', () => {
            seleccionarObra(obra, panelId, panel, mainContainer);
        });
    }

    return card;
}

function seleccionarObra(obra, panelId, panel, mainContainer) {
    if (panelId === 'A') {
        compareState.panelA = obra;
    } else {
        compareState.panelB = obra;
    }

    mostrarObraEnPanel(obra, panelId, panel, mainContainer);

    if (compareState.panelA && compareState.panelB) {
        mostrarTablaComparativa(mainContainer);
    }
}

function mostrarObraEnPanel(obra, panelId, panel, mainContainer) {
    const label = panel.querySelector('.panel-label');
    panel.innerHTML = '';
    panel.appendChild(label);

    const selectedWrapper = document.createElement('div');
    selectedWrapper.className = 'panel-selected';

    const img = document.createElement('img');
    img.className = 'panel-selected-img';
    img.src = obra.primaryImageSmall || '';
    img.alt = obra.title || 'Sin título';
    img.onerror = () => { img.style.display = 'none'; };

    const info = document.createElement('div');
    info.className = 'panel-selected-info';

    const title = document.createElement('h3');
    title.className = 'panel-selected-title';
    title.textContent = obra.title || 'Sin título';

    const artist = document.createElement('p');
    artist.className = 'panel-selected-artist';
    artist.textContent = obra.artistDisplayName || 'Artista desconocido';

    const date = document.createElement('p');
    date.className = 'panel-selected-meta';
    date.textContent = obra.objectDate || '—';

    /* ── Description / Medium ── */
    const description = document.createElement('p');
    description.className = 'panel-selected-description';
    const descParts = [];
    if (obra.medium) descParts.push(obra.medium);
    if (obra.department) descParts.push(obra.department);
    if (obra.classification) descParts.push(obra.classification);
    if (obra.culture) descParts.push(obra.culture);
    description.textContent = descParts.join(' · ') || 'Sin descripción disponible';

    info.appendChild(title);
    info.appendChild(artist);
    info.appendChild(date);
    info.appendChild(description);

    const changeBtn = document.createElement('button');
    changeBtn.className = 'btn-change-selection';
    changeBtn.textContent = '↻ Cambiar selección';
    changeBtn.addEventListener('click', () => {
        if (panelId === 'A') compareState.panelA = null;
        else compareState.panelB = null;

        const tableSection = document.getElementById('compare-table-section');
        if (tableSection) tableSection.style.display = 'none';

        mostrarBuscador(panel, panelId, mainContainer);
    });

    selectedWrapper.appendChild(img);
    selectedWrapper.appendChild(info);
    panel.appendChild(selectedWrapper);
    panel.appendChild(changeBtn);
}

function mostrarTablaComparativa(container) {
    const tableSection = document.getElementById('compare-table-section');
    if (!tableSection) return;

    tableSection.style.display = 'block';
    tableSection.innerHTML = '';

    const obraA = compareState.panelA;
    const obraB = compareState.panelB;

    const title = document.createElement('h2');
    title.className = 'table-title';
    title.textContent = 'Comparación de Obras';
    tableSection.appendChild(title);

    const table = document.createElement('table');
    table.className = 'compare-table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    ['Atributo', 'Obra A', 'Obra B'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const campos = [
        { label: 'Título',           keyA: obraA.title,             keyB: obraB.title },
        { label: 'Artista',          keyA: obraA.artistDisplayName, keyB: obraB.artistDisplayName },
        { label: 'Año',              keyA: obraA.objectEndDate || obraA.objectBeginDate || null, keyB: obraB.objectEndDate || obraB.objectBeginDate || null },
        { label: 'Departamento',     keyA: obraA.department,        keyB: obraB.department },
        { label: 'Técnica',          keyA: obraA.medium,            keyB: obraB.medium },
        { label: 'Clasificación',    keyA: obraA.classification,    keyB: obraB.classification },
        { label: 'Cultura',          keyA: obraA.culture,           keyB: obraB.culture },
        { label: 'Dimensiones',      keyA: obraA.dimensions,        keyB: obraB.dimensions },
        { label: '¿Obra destacada?', keyA: obraA.isHighlight ? 'Sí' : 'No', keyB: obraB.isHighlight ? 'Sí' : 'No' },
        { label: '¿Dominio público?',keyA: obraA.isPublicDomain ? 'Sí' : 'No', keyB: obraB.isPublicDomain ? 'Sí' : 'No' }
    ];

    const tbody = document.createElement('tbody');

    campos.forEach(campo => {
        const row = document.createElement('tr');
        const valA = campo.keyA || '—';
        const valB = campo.keyB || '—';
        const sonDiferentes = String(valA) !== String(valB);

        if (sonDiferentes) {
            row.classList.add('row-different');
        }

        const tdLabel = document.createElement('td');
        tdLabel.className = 'td-label';
        tdLabel.textContent = campo.label;

        const tdA = document.createElement('td');
        tdA.textContent = String(valA);

        const tdB = document.createElement('td');
        tdB.textContent = String(valB);

        if (sonDiferentes) {
            const icon = document.createElement('span');
            icon.className = 'diff-icon';
            icon.textContent = ' ≠';
            tdLabel.appendChild(icon);
        }

        row.appendChild(tdLabel);
        row.appendChild(tdA);
        row.appendChild(tdB);
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableSection.appendChild(table);

    const yearA = obraA.objectEndDate || obraA.objectBeginDate;
    const yearB = obraB.objectEndDate || obraB.objectBeginDate;

    if (yearA && yearB) {
        const diffSection = document.createElement('p');
        diffSection.className = 'year-diff';
        const diff = Math.abs(parseInt(yearA) - parseInt(yearB));
        diffSection.textContent = `Diferencia entre obras: ${diff} año${diff !== 1 ? 's' : ''}`;
        tableSection.appendChild(diffSection);
    }

    /* Scroll to table */
    tableSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function precargarObra(id, panelId, panel) {
    const label = panel.querySelector('.panel-label');
    panel.innerHTML = '';
    panel.appendChild(label);

    const loader = document.createElement('p');
    loader.className = 'panel-loading';
    loader.textContent = 'Cargando obra…';
    panel.appendChild(loader);

    try {
        const obra = await getObject(id);
        seleccionarObra(obra, panelId, panel, panel.closest('#view-container') || document.getElementById('view-container'));
    } catch (error) {
        panel.innerHTML = '';
        panel.appendChild(label);
        const errEl = document.createElement('error-state');
        errEl.setAttribute('message', 'No se pudo cargar la obra preseleccionada.');
        errEl.addEventListener('retry', function () {
            precargarObra(id, panelId, panel);
        });
        panel.appendChild(errEl);
    }
}
