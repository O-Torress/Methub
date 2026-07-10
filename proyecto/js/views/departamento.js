const DEPT_ICONS = {
    1:  `<svg viewBox="0 0 48 48"><path d="M24 4c-3 0-8 6-8 14 0 6 3 10 6 12v6h4v-6c3-2 6-6 6-12C32 10 27 4 24 4z"/><path d="M20 38h8v4c0 1-1 2-2 2h-4c-1 0-2-1-2-2v-4z"/><circle cx="24" cy="14" r="3"/></svg>`,
    3:  `<svg viewBox="0 0 48 48"><path d="M6 40h36M10 40V20M38 40V20M24 6l-20 14h40L24 6z"/><path d="M18 40V28h12v12"/><path d="M14 20v20M34 20v20"/></svg>`,
    4:  `<svg viewBox="0 0 48 48"><path d="M14 8l-4 16h8L14 8z"/><path d="M14 24v16"/><path d="M8 36h12"/><path d="M24 14h16M24 20h12M24 26h8"/><circle cx="36" cy="14" r="3"/></svg>`,
    5:  `<svg viewBox="0 0 48 48"><path d="M24 4C12 4 8 16 8 24s8 20 16 20 16-12 16-20S36 4 24 4z"/><path d="M16 18c2-4 5-6 8-6s6 2 8 6"/><path d="M12 28c4 4 8 6 12 6s8-2 12-6"/><path d="M24 4v40"/><path d="M8 24h32"/></svg>`,
    6:  `<svg viewBox="0 0 48 48"><path d="M8 8h24c4 0 8 4 8 8v16c0 4-4 8-8 8H8V8z"/><path d="M14 16h16M14 24h20M14 32h12"/><path d="M8 8v32"/></svg>`,
    7:  `<svg viewBox="0 0 48 48"><circle cx="24" cy="20" r="14"/><path d="M18 18c0-2 2-4 4-4"/><path d="M14 34l-4 10M34 34l4 10"/><path d="M20 36c0 4 8 4 8 0"/></svg>`,
    8:  `<svg viewBox="0 0 48 48"><path d="M12 44V20c0-8 6-16 12-16s12 8 12 16v24"/><path d="M12 44h24"/><path d="M18 28h12M20 34h8"/><ellipse cx="24" cy="16" rx="4" ry="6"/></svg>`,
    9:  `<svg viewBox="0 0 48 48"><path d="M16 4c-4 2-8 8-8 14v2h8V4z"/><path d="M32 4c4 2 8 8 8 14v2h-8V4z"/><circle cx="24" cy="28" r="12"/><path d="M20 26c0-1 1-2 2-2h4c1 0 2 1 2 2v2c0 1-1 2-2 2h-4c-1 0-2-1-2-2v-2z"/><path d="M24 32v4"/><path d="M20 36h8"/></svg>`,
    10: `<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="18"/><path d="M6 24h36"/><path d="M24 6c-6 4-10 10-10 18s4 14 10 18"/><path d="M24 6c6 4 10 10 10 18s-4 14-10 18"/><path d="M10 14h28M10 34h28"/></svg>`,
    11: `<svg viewBox="0 0 48 48"><path d="M24 4v12M20 16h8l4 4v8l-4 4h-8l-4-4v-8l4-4z"/><path d="M16 32l-6 12M32 32l6 12"/><path d="M14 8h20"/><path d="M10 44h28"/></svg>`,
    12: `<svg viewBox="0 0 48 48"><path d="M14 4c-2 0-6 8-6 18s4 22 8 22c2 0 4-2 4-4v-8"/><path d="M34 4c2 0 6 8 6 18s-4 22-8 22c-2 0-4-2-4-4v-8"/><path d="M20 22h8"/><ellipse cx="24" cy="18" rx="6" ry="8"/></svg>`,
    13: `<svg viewBox="0 0 48 48"><rect x="6" y="6" width="36" height="28" rx="2"/><path d="M6 6l18 14L42 6"/><path d="M10 38h28"/><path d="M14 42h20"/></svg>`,
    14: `<svg viewBox="0 0 48 48"><rect x="8" y="8" width="32" height="32" rx="2"/><path d="M16 8v32M32 8v32M8 16h32M8 32h32"/><circle cx="24" cy="24" r="4"/></svg>`,
    15: `<svg viewBox="0 0 48 48"><ellipse cx="24" cy="30" rx="10" ry="14"/><path d="M24 16V4"/><path d="M20 4h8"/><path d="M14 26h20"/><path d="M18 34h12"/><circle cx="18" cy="8" r="2"/><circle cx="30" cy="8" r="2"/></svg>`,
    16: `<svg viewBox="0 0 48 48"><path d="M6 40h36M10 40V20M38 40V20M24 6l-20 14h40L24 6z"/><rect x="18" y="26" width="12" height="14"/><circle cx="24" cy="16" r="4"/></svg>`,
    17: `<svg viewBox="0 0 48 48"><path d="M8 38c4-8 8-14 16-14s12 6 16 14"/><path d="M24 8v16"/><path d="M18 12l6-4 6 4"/><circle cx="16" cy="20" r="3"/><circle cx="32" cy="20" r="3"/><path d="M4 42h40"/></svg>`,
    18: `<svg viewBox="0 0 48 48"><rect x="8" y="8" width="32" height="28" rx="4"/><circle cx="24" cy="22" r="8"/><circle cx="24" cy="22" r="3"/><path d="M32 12h4v6h-4z"/><path d="M16 40l4-4h8l4 4"/></svg>`,
    19: `<svg viewBox="0 0 48 48"><path d="M16 8c0 0-4 1-6 6s-2 10-2 14c0 2 1 4 3 4h26c2 0 3-2 3-4 0-4 0-9-2-14s-6-6-6-6"/><path d="M16 8h16"/><path d="M18 36v6M30 36v6"/><path d="M14 42h20"/><path d="M20 18v10M28 18v10"/></svg>`,
    21: `<svg viewBox="0 0 48 48"><path d="M16 44c0-8-8-12-8-24C8 10 15 4 24 4s16 6 16 16c0 12-8 16-8 24"/><path d="M16 44h16"/><path d="M18 38h12"/><path d="M20 14c-2 2-3 5-3 8"/></svg>`,
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

        departments.forEach((dept, index) => {
            const card = document.createElement('div');
            card.className = 'department-card';
            card.style.animationDelay = `${index * 0.06}s`;

            const icon = document.createElement('span');
            icon.className = 'department-icon';
            icon.innerHTML = DEPT_ICONS[dept.departmentId] || DEPT_ICONS[3];

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
