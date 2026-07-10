function renderDetail(container, id) {
    container.innerHTML = '';

    if (!id) {
        const errorEl = document.createElement('error-state');
        errorEl.setAttribute('message', 'No se especificó una obra.');
        errorEl.addEventListener('retry', function () {
            window.location.hash = '#home';
        });
        container.appendChild(errorEl);
        return;
    }

    const loading = document.createElement('loading-state');
    loading.setAttribute('count', '1');
    container.appendChild(loading);

    getObject(id).then(function (obra) {
        container.innerHTML = '';

        const backBtn = document.createElement('button');
        backBtn.className = 'btn-back';
        backBtn.textContent = '← Volver';
        backBtn.addEventListener('click', function () {
            window.history.back();
        });
        container.appendChild(backBtn);

        const wrapper = document.createElement('div');
        wrapper.className = 'detail-wrapper';

        const imgCol = document.createElement('div');
        imgCol.className = 'detail-image-col';

        if (obra.primaryImage) {
            const img = document.createElement('img');
            img.className = 'detail-main-img';
            img.src = obra.primaryImage;
            img.alt = obra.title || '';
            imgCol.appendChild(img);
        } else if (obra.primaryImageSmall) {
            const img = document.createElement('img');
            img.className = 'detail-main-img';
            img.src = obra.primaryImageSmall;
            img.alt = obra.title || '';
            imgCol.appendChild(img);
        } else {
            const placeholder = document.createElement('div');
            placeholder.className = 'detail-img-placeholder';
            placeholder.textContent = 'Sin imagen disponible';
            imgCol.appendChild(placeholder);
        }

        if (obra.additionalImages && obra.additionalImages.length > 0) {
            const extraGallery = document.createElement('div');
            extraGallery.className = 'detail-extra-gallery';
            obra.additionalImages.slice(0, 8).forEach(function (url) {
                const extraImg = document.createElement('img');
                extraImg.className = 'detail-extra-img';
                extraImg.src = url;
                extraImg.loading = 'lazy';
                extraGallery.appendChild(extraImg);
            });
            imgCol.appendChild(extraGallery);
        }

        wrapper.appendChild(imgCol);

        const infoCol = document.createElement('div');
        infoCol.className = 'detail-info-col';

        const title = document.createElement('h1');
        title.className = 'detail-title';
        title.textContent = obra.title || 'Sin título';
        infoCol.appendChild(title);

        if (obra.artistDisplayName) {
            const artistLink = document.createElement('a');
            artistLink.className = 'detail-artist-link';
            artistLink.textContent = obra.artistDisplayName;
            artistLink.href = '#';
            artistLink.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.hash = '#artista/' + encodeURIComponent(obra.artistDisplayName);
            });
            infoCol.appendChild(artistLink);

            if (obra.artistDisplayBio) {
                const bio = document.createElement('p');
                bio.className = 'detail-bio';
                bio.textContent = obra.artistDisplayBio;
                infoCol.appendChild(bio);
            }
        }

        var fields = [
            { label: 'Fecha', value: obra.objectDate },
            { label: 'Técnica', value: obra.medium },
            { label: 'Dimensiones', value: obra.dimensions },
            { label: 'Departamento', value: obra.department },
            { label: 'Cultura', value: obra.culture },
            { label: 'Periodo', value: obra.period },
            { label: 'Clasificación', value: obra.classification },
            { label: 'Adquisición', value: obra.creditLine }
        ];

        fields.forEach(function (f) {
            if (f.value) {
                var p = document.createElement('p');
                p.className = 'detail-field';
                p.innerHTML = '<strong>' + f.label + ':</strong> ' + f.value;
                infoCol.appendChild(p);
            }
        });

        if (obra.tags && obra.tags.length > 0) {
            var tagsContainer = document.createElement('div');
            tagsContainer.className = 'detail-tags';
            var tagsTitle = document.createElement('span');
            tagsTitle.textContent = 'Tags: ';
            tagsContainer.appendChild(tagsTitle);
            obra.tags.slice(0, 12).forEach(function (tag, i) {
                var tagEl = document.createElement('span');
                tagEl.className = 'detail-tag';
                tagEl.textContent = tag.term;
                tagsContainer.appendChild(tagEl);
                if (i < Math.min(obra.tags.length, 12) - 1) {
                    tagsContainer.appendChild(document.createTextNode(' '));
                }
            });
            infoCol.appendChild(tagsContainer);
        }

        if (obra.objectURL) {
            var externalLink = document.createElement('a');
            externalLink.className = 'detail-external-link';
            externalLink.href = obra.objectURL;
            externalLink.target = '_blank';
            externalLink.textContent = 'Ver en el sitio del museo →';
            infoCol.appendChild(externalLink);
        }

        var actions = document.createElement('div');
        actions.className = 'detail-actions';

        if (obra.artistDisplayName) {
            var moreBtn = document.createElement('button');
            moreBtn.className = 'btn-secondary';
            moreBtn.textContent = 'Ver más obras del artista';
            moreBtn.addEventListener('click', function () {
                window.location.hash = '#artista/' + encodeURIComponent(obra.artistDisplayName);
            });
            actions.appendChild(moreBtn);
        }

        var compareBtn = document.createElement('button');
        compareBtn.className = 'btn-secondary';
        compareBtn.textContent = 'Comparar';
        compareBtn.addEventListener('click', function () {
            window.location.hash = '#comparar/' + obra.objectID;
        });
        actions.appendChild(compareBtn);

        infoCol.appendChild(actions);

        wrapper.appendChild(infoCol);
        container.appendChild(wrapper);

    }).catch(function () {
        container.innerHTML = '';
        var errorEl = document.createElement('error-state');
        errorEl.setAttribute('message', 'No se pudo cargar la obra solicitada.');
        errorEl.addEventListener('retry', function () {
            renderDetail(container, id);
        });
        container.appendChild(errorEl);
    });
}