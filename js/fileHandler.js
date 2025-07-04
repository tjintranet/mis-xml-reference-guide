// File handling for import functionality
import { CONFIG } from './config.js';
import { uiManager } from './uiManager.js';

class FileHandler {
    constructor() {
        this.importedData = [];
    }

    /**
     * Initialize file handling
     */
    initialize() {
        this.setupFileHandling();
    }

    /**
     * Setup file input and drag-drop functionality
     */
    setupFileHandling() {
        const fileInput = document.getElementById('fileInput');
        const dropZone = document.getElementById('fileDropZone');

        if (!fileInput || !dropZone) {
            console.warn('File input or drop zone not found');
            return;
        }

        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                this.handleFileSelect({ target: fileInput });
            }
        });
    }

    /**
     * Handle file selection
     * @param {Event} event - File input change event
     */
    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        const fileName = file.name.toLowerCase();
        
        // Check file type
        const isValidType = CONFIG.VALIDATION.SUPPORTED_FILE_TYPES.some(type => 
            fileName.endsWith(type)
        );

        if (!isValidType) {
            uiManager.showNotification(
                `Please select a supported file type: ${CONFIG.VALIDATION.SUPPORTED_FILE_TYPES.join(', ')}`,
                'error'
            );
            return;
        }

        // Process file based on type
        if (fileName.endsWith('.csv')) {
            this.readCSVFile(file);
        } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
            this.readExcelFile(file);
        }
    }

    /**
     * Read CSV file
     * @param {File} file - CSV file object
     */
    readCSVFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csv = e.target.result;
                const parsedData = this.parseCSV(csv);
                this.handleParsedData(parsedData.headers, parsedData.rows);
            } catch (error) {
                console.error('Error reading CSV file:', error);
                uiManager.showNotification('Error reading CSV file. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
    }

    /**
     * Read Excel file
     * @param {File} file - Excel file object
     */
    readExcelFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const fileData = new Uint8Array(e.target.result);
                const workbook = XLSX.read(fileData, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
                
                if (jsonData.length < 2) {
                    throw new Error('File must contain at least a header row and one data row.');
                }
                
                const headers = jsonData[0];
                const rows = jsonData.slice(1).map(row => {
                    const rowData = {};
                    headers.forEach((header, index) => {
                        rowData[header] = row[index] || '';
                    });
                    return rowData;
                });
                
                this.handleParsedData(headers, rows);
            } catch (error) {
                console.error('Error reading Excel file:', error);
                uiManager.showNotification('Error reading Excel file. Please check the file format.', 'error');
            }
        };
        reader.readAsArrayBuffer(file);
    }

    /**
     * Parse CSV content
     * @param {string} csv - CSV content
     * @returns {Object} Parsed data with headers and rows
     */
    parseCSV(csv) {
        const lines = csv.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
            throw new Error('File must contain at least a header row and one data row.');
        }
        
        const headers = this.parseCSVLine(lines[0]);
        const rows = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            rows.push(row);
        }
        
        return { headers, rows };
    }

    /**
     * Parse a single CSV line handling quoted values
     * @param {string} line - CSV line
     * @returns {Array} Parsed values
     */
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        return result;
    }

    /**
     * Handle parsed data from file
     * @param {Array} headers - Column headers
     * @param {Array} rows - Data rows
     */
    handleParsedData(headers, rows) {
        this.importedData = rows;
        this.displayImportPreview(headers, rows);
    }

    /**
     * Display import preview table
     * @param {Array} headers - Column headers
     * @param {Array} rows - Data rows
     */
    displayImportPreview(headers, rows) {
        const previewDiv = document.getElementById('importPreview');
        const table = document.getElementById('previewTable');
        
        if (!previewDiv || !table) {
            console.warn('Preview elements not found');
            return;
        }
        
        // Create table header
        const thead = table.querySelector('thead');
        thead.innerHTML = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
        
        // Create table body (show limited rows)
        const tbody = table.querySelector('tbody');
        const previewRows = rows.slice(0, CONFIG.UI.MAX_PREVIEW_ROWS);
        tbody.innerHTML = previewRows.map(row => 
            `<tr>${headers.map(h => `<td>${this.escapeHtml(row[h] || '')}</td>`).join('')}</tr>`
        ).join('');
        
        previewDiv.style.display = 'block';
        
        // Show success notification
        uiManager.showNotification(
            `File imported successfully! Found ${rows.length} records with ${headers.length} columns.`,
            'success'
        );
    }

    /**
     * Escape HTML characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Get imported data
     * @returns {Array} Imported data array
     */
    getImportedData() {
        return this.importedData;
    }

    /**
     * Clear imported data
     */
    clearImportedData() {
        this.importedData = [];
        const previewDiv = document.getElementById('importPreview');
        if (previewDiv) {
            previewDiv.style.display = 'none';
        }
    }

    /**
     * Validate imported data
     * @returns {Object} Validation result
     */
    validateImportedData() {
        if (this.importedData.length === 0) {
            return {
                isValid: false,
                message: 'No data to process. Please import a file first.'
            };
        }

        // Check for required fields
        const missingFields = [];
        const requiredFields = CONFIG.VALIDATION.REQUIRED_FIELDS;
        
        requiredFields.forEach(field => {
            const hasField = this.importedData.some(row => row[field] && row[field].toString().trim() !== '');
            if (!hasField) {
                missingFields.push(field);
            }
        });

        if (missingFields.length > 0) {
            return {
                isValid: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            };
        }

        return {
            isValid: true,
            message: 'Data validation passed'
        };
    }
}

// Export singleton instance
export const fileHandler = new FileHandler();