// Main application entry point
import { uiManager } from './uiManager.js';
import { fileHandler } from './fileHandler.js';
import { formHandler } from './formHandler.js';
import { xmlGenerator } from './xmlGenerator.js';

class Application {
    constructor() {
        this.isInitialized = false;
    }

    /**
     * Initialize the application
     */
    async initialize() {
        try {
            console.log('Initializing XML Template Generator...');
            
            // Initialize all managers
            await uiManager.initialize();
            fileHandler.initialize();
            
            // Setup global functions for HTML onclick handlers
            this.setupGlobalFunctions();
            
            this.isInitialized = true;
            console.log('Application initialized successfully');
            
        } catch (error) {
            console.error('Error initializing application:', error);
            uiManager.showNotification('Error initializing application. Please refresh the page.', 'error');
        }
    }

    /**
     * Setup global functions for HTML onclick handlers
     */
    setupGlobalFunctions() {
        // Make functions globally available
        window.generateXML = () => this.generateXMLFromForm();
        window.processImportedData = () => this.processImportedData();
        window.downloadXML = () => this.downloadXML();
        window.loadSampleData = () => uiManager.loadSampleData();
        window.addJobPart = () => uiManager.addJobPart();
        
        // Make managers globally available for complex interactions
        window.uiManager = uiManager;
        window.fileHandler = fileHandler;
        window.formHandler = formHandler;
        window.xmlGenerator = xmlGenerator;
    }

    /**
     * Generate XML from form data
     */
    generateXMLFromForm() {
        try {
            const formData = formHandler.collectFormData();
            const validation = formHandler.validateFormData(formData);
            
            if (!validation.isValid) {
                formHandler.highlightErrors(validation.errors);
                uiManager.showNotification(validation.message, 'error');
                return;
            }
            
            const xml = xmlGenerator.generateXMLFromData([formData]);
            this.displayGeneratedXML(xml);
            
            uiManager.switchToTab('v-pills-xml-tab');
            uiManager.showNotification('XML generated successfully!', 'success');
            
        } catch (error) {
            console.error('Error generating XML from form:', error);
            uiManager.showNotification('Error generating XML. Please check your data.', 'error');
        }
    }

    /**
     * Process imported data and generate XML
     */
    processImportedData() {
        try {
            const validation = fileHandler.validateImportedData();
            
            if (!validation.isValid) {
                uiManager.showNotification(validation.message, 'error');
                return;
            }
            
            const importedData = fileHandler.getImportedData();
            const xml = xmlGenerator.generateXMLFromData(importedData);
            this.displayGeneratedXML(xml);
            
            uiManager.switchToTab('v-pills-xml-tab');
            uiManager.showNotification('XML generated successfully from imported data!', 'success');
            
        } catch (error) {
            console.error('Error processing imported data:', error);
            uiManager.showNotification('Error processing imported data. Please check the file format.', 'error');
        }
    }

    /**
     * Display generated XML in the output area
     * @param {string} xml - Generated XML content
     */
    displayGeneratedXML(xml) {
        const xmlOutput = document.getElementById('xmlOutput');
        if (xmlOutput) {
            xmlOutput.textContent = xml;
        }
    }

    /**
     * Download the generated XML
     */
    downloadXML() {
        try {
            const xmlContent = document.getElementById('xmlOutput').textContent;
            
            if (!xmlContent || xmlContent.trim() === '' || xmlContent.includes('Generated XML will appear here')) {
                uiManager.showNotification('No XML content to download. Please generate XML first.', 'warning');
                return;
            }
            
            // Set the XML content in the generator
            xmlGenerator.xmlContent = xmlContent;
            xmlGenerator.downloadXML();
            
            uiManager.showNotification('XML file downloaded successfully!', 'success');
            
        } catch (error) {
            console.error('Error downloading XML:', error);
            uiManager.showNotification('Error downloading XML file.', 'error');
        }
    }

    /**
     * Handle application errors
     * @param {Error} error - Error object
     * @param {string} context - Error context
     */
    handleError(error, context = 'Application') {
        console.error(`${context} Error:`, error);
        uiManager.showNotification(`${context} error: ${error.message}`, 'error');
    }

    /**
     * Get application status
     * @returns {Object} Application status
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            hasImportedData: fileHandler.getImportedData().length > 0,
            hasGeneratedXML: !!xmlGenerator.getXMLContent()
        };
    }
}

// Create and initialize application
const app = new Application();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.initialize();
    
});

// Handle unhandled errors
window.addEventListener('error', (event) => {
    app.handleError(event.error, 'Global');
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    app.handleError(new Error(event.reason), 'Promise');
});

// Export for debugging
window.app = app;