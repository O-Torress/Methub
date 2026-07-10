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

        departments.forEach(dept => {
            const card = document.createElement('div');
            card.className = 'department-card';

            const icon = document.createElement('span');
            icon.className = 'department-icon';
            icon.textContent = DEPT_ICONS[dept.departmentId] || '🏛️';

            const name = document.createElement('span');
            name.className = 'department-name';
            name.textContent = dept.displayName;

            card.appendChild(icon);
            card.appendChild(name);

            card.addEventListener('click', () => {
                window.location.hash = '#explorar/' + dept.departmentId;
            });

            grid.appendChild(card);
        });

        container.appendChild(grid);
    } catch (error) {
        loader.remove();
        const errorEl = document.createElement('error-state');
        errorEl.setAttribute('message', 'No se pudieron cargar los departamentos.');
        errorEl.addEventListener('retry', function () {
            renderDepartments(container, param);
        });
        container.appendChild(errorEl);
    }
}
