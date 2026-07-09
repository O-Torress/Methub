====================================================

const BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';

/**
 * Hace un fetch con timeout usando AbortController.
 * Si la petición tarda más de `timeoutMs` ms, se cancela.
 * @param {string} url
 * @param {number} timeoutMs - tiempo máximo en milisegundos (default: 10s)
 * @returns {Promise<any>} - el JSON de la respuesta
 */
async function fetchWithTimeout(url, timeoutMs = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('La petición tardó demasiado y fue cancelada (timeout).');
        }
        throw error;
    }
}
