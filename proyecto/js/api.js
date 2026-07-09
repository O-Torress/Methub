
const BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';

/**
 * @param {string} url
 * @param {number} timeoutMs 
 * @returns {Promise<any>} 
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
