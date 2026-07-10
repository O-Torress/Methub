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

    searchWrapper.appendChild(input);
    searchWrapper.appendChild(resultsList);
    panel.appendChild(searchWrapper);
}
