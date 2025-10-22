/**
 * Gets an access token for AEM Cloud Service API authentication.
 * This function loads the configuration and exchanges JWT for access token.
 * @returns {Promise<string|null>} The access token or null if failed
 */
async function getAccessToken() {
    try {
        // Import the exchange library and configuration
        const { default: exchange } = await import('../libs/aemcs-api-client-lib.js');
        
        // Load configuration from certs file
        const jsonFile = '../certs/22-10-2026.json';
        
        const config = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
        
        // Exchange JWT for access token
        exchange(config).then(accessToken => {
            return accessToken;
        }).catch(e => {
            return null;
        });
    } catch (error) {
        console.error('Error getting access token:', error);
        return null;
    }
}

/**
 * Makes an authenticated API request to AEM Cloud Service.
 * @param {string} url - The API endpoint URL
 * @param {object} options - Fetch options (method, headers, etc.)
 * @returns {Promise<Response>} The fetch response
 */
export async function makeAuthenticatedRequest(url, options = {}) {
    const token = await getAccessToken();
    if (!token) {
        throw new Error('Failed to obtain access token');
    }
    
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    return fetch(url, {
        ...options,
        headers
    });
}

export { getAccessToken };