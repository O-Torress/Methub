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
    return panel;
}

function precargarObra(id, panelId, panel) {
}
