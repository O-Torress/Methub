
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

async function getDepartments() {
    const data = await fetchWithTimeout(`${BASE_URL}/departments`);
    return data.departments;
}

async function searchObjects(params) {
    const queryString = Object.entries(params)
        .filter(([, value]) => value !== null && value !== undefined && value !== '')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const data = await fetchWithTimeout(`${BASE_URL}/search?${queryString}`);

    return {
        total: data.total || 0,
        objectIDs: data.objectIDs || []
    };
}
