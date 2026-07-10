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
    container.appendChild(layout);

    const tableSection = document.createElement('div');
    tableSection.id = 'compare-table-section';
    tableSection.className = 'compare-table-section';
    tableSection.style.display = 'none';
    container.appendChild(tableSection);
}
