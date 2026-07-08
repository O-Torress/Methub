const routes = {
    '#home': renderHome,
    '#explore': renderExplore,
    '#detail': renderDetail,         
    '#departments': renderDepartments,
    '#artist': renderArtist,         
    '#compare': renderCompare
};

function router() {

    const container = document.getElementById('view-container');
    const hash = window.location.hash || '#home';
    const pathParts = hash.split('/');
    const baseRoute = pathParts[0]; 
    const parameter = pathParts[1] ? decodeURIComponent(pathParts[1]) : null;

    updateNavbarActiveLink(baseRoute);

    const viewFunction = routes[baseRoute];

    if (viewFunction) {   
        viewFunction(container, parameter);
    } else {
        window.location.hash = '#home';
    }
}

function updateNavbarActiveLink(activeHash) {
    const links = document.querySelectorAll('#navbar a');
    links.forEach(link => {
        if (link.getAttribute('href') === activeHash) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

window.addEventListener('hashchange', router);

window.addEventListener('DOMContentLoaded', router);