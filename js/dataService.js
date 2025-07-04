// Data service for loading and managing reference data
import { CONFIG, FALLBACK_DATA } from './config.js';

class DataService {
    constructor() {
        this.referenceData = {};
        this.isLoaded = false;
    }

    /**
     * Load all reference data from JSON files
     * @returns {Promise<Object>} Reference data object
     */
    async loadReferenceData() {
        try {
            const loadPromises = Object.entries(CONFIG.REFERENCE_DATA_PATHS).map(
                async ([key, path]) => {
                    try {
                        const data = await this.loadJSON(path);
                        return { key, data };
                    } catch (error) {
                        console.warn(`Failed to load ${path}, using fallback data`);
                        return { key, data: FALLBACK_DATA[key] || [] };
                    }
                }
            );

            const results = await Promise.all(loadPromises);
            
            // Build reference data object
            results.forEach(({ key, data }) => {
                this.referenceData[key] = data;
            });

            this.isLoaded = true;
            return this.referenceData;
        } catch (error) {
            console.error('Error loading reference data:', error);
            this.loadFallbackData();
            return this.referenceData;
        }
    }

    /**
     * Load individual JSON file
     * @param {string} filename - JSON file path
     * @returns {Promise<Array>} JSON data
     */
    async loadJSON(filename) {
        const response = await fetch(filename);
        if (!response.ok) {
            throw new Error(`Failed to load ${filename}: ${response.status}`);
        }
        return await response.json();
    }

    /**
     * Load fallback data when JSON files are not available
     */
    loadFallbackData() {
        this.referenceData = { ...FALLBACK_DATA };
        this.isLoaded = true;
        console.info('Using fallback reference data');
    }

    /**
     * Get reference data by key
     * @param {string} key - Reference data key
     * @returns {Array} Reference data array
     */
    getReferenceData(key) {
        if (!this.isLoaded) {
            console.warn('Reference data not loaded yet');
            return [];
        }
        return this.referenceData[key] || [];
    }

    /**
     * Get all reference data
     * @returns {Object} All reference data
     */
    getAllReferenceData() {
        return this.referenceData;
    }

    /**
     * Find item in reference data by ID
     * @param {string} dataKey - Reference data key
     * @param {string} id - Item ID to find
     * @param {string} idField - Field name for ID (default: 'id')
     * @returns {Object|null} Found item or null
     */
    findById(dataKey, id, idField = 'id') {
        const data = this.getReferenceData(dataKey);
        return data.find(item => item[idField] === id) || null;
    }

    /**
     * Get display text for an item
     * @param {string} dataKey - Reference data key
     * @param {string} id - Item ID
     * @param {string} textField - Field name for display text
     * @param {string} idField - Field name for ID (default: 'id')
     * @returns {string} Display text or empty string
     */
    getDisplayText(dataKey, id, textField, idField = 'id') {
        const item = this.findById(dataKey, id, idField);
        return item ? item[textField] : '';
    }
}

// Export singleton instance
export const dataService = new DataService();