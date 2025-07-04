// Form data collection and validation
import { CONFIG } from './config.js';

class FormHandler {
    constructor() {
        this.formData = {};
    }

    /**
     * Collect all form data
     * @returns {Object} Complete form data
     */
    collectFormData() {
        const formData = {
            // Basic Information
            customer: this.getFieldValue('customer'),
            sectionOrder: this.getFieldValue('sectionOrder'),
            description: this.getFieldValue('description'),
            additionalDescription: this.getFieldValue('additionalDescription'),
            jobType: this.getFieldValue('jobType'),
            subJobType: this.getFieldValue('subJobType'),
            adminStatus: this.getFieldValue('adminStatus'),
            
            // ISBN and Binding
            casedISBN: this.getFieldValue('casedISBN'),
            limpISBN: this.getFieldValue('limpISBN'),
            bindingMethod: this.getFieldValue('bindingMethod'),
            
            // Contact and PO Information
            poNumber: this.getFieldValue('poNumber'),
            enteredBy: this.getFieldValue('enteredBy'),
            author: this.getFieldValue('author'),
            jobContact: this.getFieldValue('jobContact'),
            shipToContact: this.getFieldValue('shipToContact'),
            
            // Dates and Schedule
            earliestStart: this.getFieldValue('earliestStart'),
            scheduledShip: this.getFieldValue('scheduledShip'),
            scheduledShipTime: this.getFieldValue('scheduledShipTime'),
            processedDate: this.getFieldValue('processedDate'),
            readyToSchedule: this.getCheckboxValue('readyToSchedule'),
            scheduled: this.getCheckboxValue('scheduled'),
            
            // Shipment
            shipmentType: this.getFieldValue('shipmentType'),
            shipVia: this.getFieldValue('shipVia'),
            
            // Job Parts
            jobParts: this.collectJobPartsData()
        };
        
        return formData;
    }

    /**
     * Get value from form field
     * @param {string} fieldId - Field ID
     * @returns {string} Field value
     */
    getFieldValue(fieldId) {
        const element = document.getElementById(fieldId);
        return element ? element.value.trim() : '';
    }

    /**
     * Get checkbox value
     * @param {string} fieldId - Checkbox field ID
     * @returns {boolean} Checkbox state
     */
    getCheckboxValue(fieldId) {
        const element = document.getElementById(fieldId);
        return element ? element.checked : false;
    }

    /**
     * Collect job parts data
     * @returns {Array} Job parts data array
     */
    collectJobPartsData() {
        const jobParts = document.querySelectorAll('.job-part');
        const partsData = [];
        
        jobParts.forEach((part, index) => {
            const partData = {
                jobPart: String(index + 1).padStart(2, '0'),
                qtyOrdered: this.getPartFieldValue(part, 'qtyOrdered'),
                description: this.getPartFieldValue(part, 'partDescription'),
                jobProductType: this.getPartFieldValue(part, 'jobProductType'),
                pages: this.getPartFieldValue(part, 'pages'),
                finalSizeW: this.getPartFieldValue(part, 'finalSizeW'),
                finalSizeH: this.getPartFieldValue(part, 'finalSizeH'),
                colorsS1: this.getPartFieldValue(part, 'colorsS1'),
                colorsS2: this.getPartFieldValue(part, 'colorsS2'),
                foldPattern: this.getPartFieldValue(part, 'foldPattern'),
                binderyMethod: this.getPartFieldValue(part, 'binderyMethod'),
                prepressWorkflow: this.getPartFieldValue(part, 'prepressWorkflow')
            };
            partsData.push(partData);
        });
        
        return partsData;
    }

    /**
     * Get value from job part field
     * @param {HTMLElement} partElement - Job part container element
     * @param {string} fieldName - Field name
     * @returns {string} Field value
     */
    getPartFieldValue(partElement, fieldName) {
        const field = partElement.querySelector(`[name="${fieldName}"]`);
        return field ? field.value.trim() : '';
    }

    /**
     * Validate form data
     * @param {Object} formData - Form data to validate
     * @returns {Object} Validation result
     */
    validateFormData(formData) {
        const errors = [];
        
        // Check required fields
        CONFIG.VALIDATION.REQUIRED_FIELDS.forEach(field => {
            if (!formData[field] || formData[field] === '') {
                errors.push(`${this.getFieldDisplayName(field)} is required`);
            }
        });
        
        // Check if at least one job part has quantity ordered
        const hasValidJobPart = formData.jobParts.some(part => 
            part.qtyOrdered && parseInt(part.qtyOrdered) > 0
        );
        
        if (!hasValidJobPart) {
            errors.push('At least one job part must have a quantity ordered');
        }
        
        // Validate numeric fields
        formData.jobParts.forEach((part, index) => {
            const partNumber = index + 1;
            
            // Validate quantity
            if (part.qtyOrdered && isNaN(parseInt(part.qtyOrdered))) {
                errors.push(`Job Part ${partNumber}: Quantity must be a valid number`);
            }
            
            // Validate dimensions
            if (part.finalSizeW && isNaN(parseFloat(part.finalSizeW))) {
                errors.push(`Job Part ${partNumber}: Final Width must be a valid number`);
            }
            
            if (part.finalSizeH && isNaN(parseFloat(part.finalSizeH))) {
                errors.push(`Job Part ${partNumber}: Final Height must be a valid number`);
            }
            
            // Validate colors
            if (part.colorsS1 && isNaN(parseInt(part.colorsS1))) {
                errors.push(`Job Part ${partNumber}: Colors Side 1 must be a valid number`);
            }
            
            if (part.colorsS2 && isNaN(parseInt(part.colorsS2))) {
                errors.push(`Job Part ${partNumber}: Colors Side 2 must be a valid number`);
            }
        });
        
        // Validate date format
        if (formData.promiseDate && !this.isValidDate(formData.promiseDate)) {
            errors.push('Promise date must be in YYYY-MM-DD format');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors,
            message: errors.length > 0 ? errors.join('\n') : 'Validation passed'
        };
    }

    /**
     * Get display name for field
     * @param {string} fieldName - Field name
     * @returns {string} Display name
     */
    getFieldDisplayName(fieldName) {
        const displayNames = {
            customer: 'Customer',
            description: 'Job Description',
            jobType: 'Job Type',
            qtyOrdered: 'Quantity Ordered'
        };
        
        return displayNames[fieldName] || fieldName;
    }

    /**
     * Check if date is valid
     * @param {string} dateString - Date string to validate
     * @returns {boolean} True if valid date
     */
    isValidDate(dateString) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateString)) {
            return false;
        }
        
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    /**
     * Clear all form fields
     */
    clearForm() {
        const form = document.getElementById('jobForm');
        if (form) {
            form.reset();
        }
        
        // Clear job parts except the first one
        const jobParts = document.querySelectorAll('.job-part');
        jobParts.forEach((part, index) => {
            if (index > 0) {
                part.remove();
            }
        });
    }

    /**
     * Set form field value
     * @param {string} fieldId - Field ID
     * @param {string} value - Value to set
     */
    setFieldValue(fieldId, value) {
        const element = document.getElementById(fieldId);
        if (element) {
            element.value = value;
        }
    }

    /**
     * Set job part field value
     * @param {number} partIndex - Job part index (0-based)
     * @param {string} fieldName - Field name
     * @param {string} value - Value to set
     */
    setJobPartFieldValue(partIndex, fieldName, value) {
        const jobParts = document.querySelectorAll('.job-part');
        if (jobParts[partIndex]) {
            const field = jobParts[partIndex].querySelector(`[name="${fieldName}"]`);
            if (field) {
                field.value = value;
            }
        }
    }

    /**
     * Highlight validation errors
     * @param {Array} errors - Array of error messages
     */
    highlightErrors(errors) {
        // Clear previous error highlights
        document.querySelectorAll('.is-invalid').forEach(element => {
            element.classList.remove('is-invalid');
        });
        
        // Add error highlights for required fields
        CONFIG.VALIDATION.REQUIRED_FIELDS.forEach(field => {
            const element = document.getElementById(field);
            if (element && (!element.value || element.value.trim() === '')) {
                element.classList.add('is-invalid');
            }
        });
        
        // Highlight job parts with missing quantities
        const jobParts = document.querySelectorAll('.job-part');
        jobParts.forEach(part => {
            const qtyField = part.querySelector('[name="qtyOrdered"]');
            if (qtyField && (!qtyField.value || parseInt(qtyField.value) <= 0)) {
                qtyField.classList.add('is-invalid');
            }
        });
    }
}

// Export singleton instance
export const formHandler = new FormHandler();