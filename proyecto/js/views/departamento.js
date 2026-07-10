const DEPT_ICONS = {
    1:  '🏺',
    3:  '🏛️',
    4:  '🔫',
    5:  '🌿',
    6:  '📜',
    7:  '🎨',
    8:  '🏺',
    9:  '🎭',
    10: '🌍',
    11: '⚔️',
    12: '🏺',
    13: '🖼️',
    14: '🖨️',
    15: '🎸',
    16: '🏛️',
    17: '🌏',
    18: '📷',
    19: '🧥',
    21: '🏺',
};

async function renderDepartments(container, param) {
    container.innerHTML = '';

    const title = document.createElement('h1');
    title.className = 'departments-title';
    title.textContent = 'Departamentos del Museo';
    container.appendChild(title);

    const loader = document.createElement('loading-state');
    loader.setAttribute('count', '8');
    container.appendChild(loader);

    try {
        const departments = await getDepartments();
        loader.remove();

        const grid = document.createElement('div');
        grid.className = 'departments-grid';
        container.appendChild(grid);
    } catch (error) {
        loader.remove();
        const errorEl = document.createElement('error-state');
        container.appendChild(errorEl);
        errorEl.setup('No se pudieron cargar los departamentos.', () => renderDepartments(container, param));
    }
}
