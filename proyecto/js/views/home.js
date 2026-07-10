(function () {
    const FEATURED_LIMIT = 8;

    function createElement(tagName, className, textContent) {
        const element = document.createElement(tagName);
        if (className) {
            element.className = className;
        }
        if (textContent !== undefined && textContent !== null) {
            element.textContent = textContent;
        }
        return element;
    }

    function createHero() {
        const hero = createElement('section', 'home-hero');

        const content = createElement('div', 'home-hero-content');
        const eyebrow = createElement('p', 'home-hero-eyebrow', '');
        const title = createElement('h1', 'home-hero-title', ' Museo Metropolitano de Arte');
        const description = createElement('p', 'home-hero-description', 'El Museo Metropolitano de Arte es uno de los museos de arte más destacados del mundo. Situado en el distrito de Manhattan, en la ciudad de Nueva York, abrió sus puertas el 20 de febrero de 1872 ​​​​​La colección del museo es de más de dos millones de obras de arte de todo el mundo.​');

        const actions = createElement('div', 'home-hero-actions');
        const primaryButton = createElement('button', 'home-btn home-btn--primary', 'Explorar colección');
        primaryButton.addEventListener('click', () => {
            window.location.hash = '#explorar';
        });

        const secondaryButton = createElement('button', 'home-btn home-btn--secondary', 'Comparar obras');
        secondaryButton.addEventListener('click', () => {
            window.location.hash = '#comparar';
        });

        actions.appendChild(primaryButton);
        actions.appendChild(secondaryButton);

        content.appendChild(eyebrow);
        content.appendChild(title);
        content.appendChild(description);
        content.appendChild(actions);

        const imageWrapper = createElement('div', 'home-hero-image-wrapper');
        const image = createElement('img', 'home-hero-image');
        image.src = 'https://cdn.sanity.io/images/cctd4ker/production/c47d68fbeb2ac1df1c97065fc4c9576314114ac2-2100x1150.jpg?rect=539,36,1011,1074&w=3840&q=75&fit=clip&auto=format';
        image.alt = 'Exterior del Museo Metropolitano de Arte';
        imageWrapper.appendChild(image);

        hero.appendChild(content);
        hero.appendChild(imageWrapper);
        return hero;
    }

    function renderHome(container) {
        container.replaceChildren();

        const page = createElement('div', 'home-page');
        page.appendChild(createHero());
        container.appendChild(page);
    }

    window.renderHome = renderHome;
})();