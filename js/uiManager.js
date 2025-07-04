// UI management and DOM manipulation
import { CONFIG } from './config.js';
import { dataService } from './dataService.js';

class UIManager {
    constructor() {
        this.jobPartCounter = 0;
    }

    /**
     * Initialize UI components
     */
    async initialize() {
        await dataService.loadReferenceData();
        this.populateDropdowns();
        this.addJobPart();
        this.setupEventListeners();
    }

    /**
     * Populate all dropdown selects with reference data
     */
    populateDropdowns() {
        const referenceData = dataService.getAllReferenceData();
        
        this.populateSelect('jobType', referenceData.jobTypes, 'id', 'Description', CONFIG.DEFAULTS.jobType);
        this.populateSelect('adminStatus', referenceData.jobStatus, 'id', 'Description', CONFIG.DEFAULTS.adminStatus);
        this.populateSelect('bindingMethod', referenceData.bindingMethods, 'id', 'Description');
        this.populateSelect('shipmentType', referenceData.shipmentTypes, 'id', 'Description');
        this.populateSelect('shipVia', referenceData.shipProviders, 'id', 'Name');
    }

    /**
     * Populate a single select element with data
     */
    populateSelect(elementId, dataArray, valueField, textField, defaultValue = '') {
        const select = document.getElementById(elementId);
        if (!select) {
            console.warn(`Select element with ID '${elementId}' not found`);
            return;
        }
        
        select.innerHTML = '<option value="">Select...</option>';
        
        dataArray.forEach(item => {
            const option = document.createElement('option');
            option.value = item[valueField];
            option.textContent = item[textField];
            if (item[valueField] === defaultValue) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    }

    /**
     * Add a new job part to the form
     */
    addJobPart() {
        this.jobPartCounter++;
        const container = document.getElementById('jobPartsContainer');
        
        const jobPartDiv = document.createElement('div');
        jobPartDiv.className = 'job-part';
        jobPartDiv.setAttribute('data-part-number', this.jobPartCounter);
        
        const referenceData = dataService.getAllReferenceData();
        
        const jobProductTypeOptions = this.buildSelectOptions(referenceData.jobProductTypes, 'Product Type ID', 'Description');
        const foldPatternOptions = this.buildSelectOptions(referenceData.foldPatterns, 'Pattern Number', (item) => `${item.Description} (${item.Pages}pp)`);
        const bindingMethodOptions = this.buildSelectOptions(referenceData.bindingMethods, 'id', 'Description');
        const prepressWorkflowOptions = this.buildSelectOptions(referenceData.prepressWorkflows, 'Prep Method', 'Prep Method');
        
        jobPartDiv.innerHTML = this.getJobPartHTML(this.jobPartCounter, {
            jobProductTypeOptions,
            foldPatternOptions,
            bindingMethodOptions,
            prepressWorkflowOptions
        });
        
        container.appendChild(jobPartDiv);
    }

    /**
     * Build option HTML string for select elements
     */
    buildSelectOptions(dataArray, valueField, textField) {
        return dataArray.map(item => {
            const value = item[valueField];
            const text = typeof textField === 'function' ? textField(item) : item[textField];
            return `<option value="${value}">${text}</option>`;
        }).join('');
    }

    /**
     * Get HTML template for job part
     */
    getJobPartHTML(partNumber, options) {
        const removeButton = partNumber > 1 ? 
            `<button type="button" class="btn btn-outline-danger btn-sm" onclick="uiManager.removeJobPart(this)">
                <i class="fas fa-trash"></i> Remove
            </button>` : '';

        return `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5><i class="fas fa-layer-group"></i> Job Part ${String(partNumber).padStart(2, '0')}</h5>
                ${removeButton}
            </div>
            
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Quantity Ordered <span class="text-danger">*</span></label>
                        <input type="number" class="form-control required-field" name="qtyOrdered" placeholder="e.g., 1000" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Job Product Type</label>
                        <select class="form-select" name="jobProductType">
                            <option value="">Select...</option>
                            ${options.jobProductTypeOptions}
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-12">
                    <div class="mb-3">
                        <label class="form-label">Part Description</label>
                        <input type="text" class="form-control" name="partDescription" placeholder="e.g., Cover Customer Supplied">
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-4">
                    <div class="mb-3">
                        <label class="form-label">Pages</label>
                        <input type="number" class="form-control" name="pages" placeholder="e.g., 4">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="mb-3">
                        <label class="form-label">Final Width (mm)</label>
                        <input type="number" step="0.1" class="form-control" name="finalSizeW" placeholder="e.g., 126.0">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="mb-3">
                        <label class="form-label">Final Height (mm)</label>
                        <input type="number" step="0.1" class="form-control" name="finalSizeH" placeholder="e.g., 198.0">
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-4">
                    <div class="mb-3">
                        <label class="form-label">Colors Side 1</label>
                        <input type="number" class="form-control" name="colorsS1" placeholder="e.g., 4">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="mb-3">
                        <label class="form-label">Colors Side 2</label>
                        <input type="number" class="form-control" name="colorsS2" placeholder="e.g., 0">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="mb-3">
                        <label class="form-label">Fold Pattern</label>
                        <select class="form-select" name="foldPattern">
                            <option value="">Select...</option>
                            ${options.foldPatternOptions}
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Bindery Method</label>
                        <select class="form-select" name="binderyMethod">
                            <option value="">Select...</option>
                            ${options.bindingMethodOptions}
                        </select>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Prepress Workflow</label>
                        <select class="form-select" name="prepressWorkflow">
                            <option value="">Select...</option>
                            ${options.prepressWorkflowOptions}
                        </select>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Remove a job part from the form
     */
    removeJobPart(button) {
        const jobPart = button.closest('.job-part');
        if (jobPart) {
            jobPart.remove();
        }
    }

    /**
     * Show notification message
     */
    showNotification(message, type = 'info') {
        const iconMap = {
            success: 'check-circle',
            error: 'exclamation-triangle',
            danger: 'exclamation-triangle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.innerHTML = `
            <i class="fas fa-${iconMap[type] || 'info-circle'}"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, CONFIG.UI.NOTIFICATION_DURATION);
    }

    /**
     * Switch to a specific tab
     */
    switchToTab(tabId) {
        const tab = document.getElementById(tabId);
        if (tab) {
            tab.click();
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        console.log('UI event listeners initialized');
    }

    /**
     * Load sample data into the form
     */
    loadSampleData() {
        // Basic Information
        document.getElementById('customer').value = 'CLALTD - Clays Ltd.';
        document.getElementById('sectionOrder').value = '58x8pp';
        document.getElementById('description').value = 'THE FIFTH ELEPHANT (011)';
        document.getElementById('additionalDescription').value = 'NOTE: Only 2mm grind on when binding\\nStack down for Shrinkwrapping in WHITE wrap - parcels of 12 (2 base)\\nBespoke labels - Please scan ISBN in Fulfilment to generate label';
        document.getElementById('jobType').value = '1';
        document.getElementById('subJobType').value = '';
        document.getElementById('adminStatus').value = 'x';
        
        // ISBN and Binding
        document.getElementById('casedISBN').value = '9780857524164';
        document.getElementById('limpISBN').value = '';
        document.getElementById('bindingMethod').value = 'CLOTH_SEWN';
        
        // Contact and PO Information
        document.getElementById('poNumber').value = 'TFA417';
        document.getElementById('enteredBy').value = 'J Benham';
        document.getElementById('author').value = 'Pratchett, Terry';
        document.getElementById('jobContact').value = 'Vicky Ellis-Duveen';
        document.getElementById('shipToContact').value = 'Ian Smith - Clays Ltd';
        
        // Dates and Schedule
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        const scheduledDate = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
        const processedDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        document.getElementById('earliestStart').value = nextWeek.toISOString().split('T')[0];
        document.getElementById('scheduledShip').value = scheduledDate.toISOString().split('T')[0];
        document.getElementById('scheduledShipTime').value = '12:01';
        document.getElementById('processedDate').value = processedDate.toISOString().split('T')[0];
        document.getElementById('readyToSchedule').checked = true;
        document.getElementById('scheduled').checked = true;
        
        // Shipment
        document.getElementById('shipmentType').value = '2';
        document.getElementById('shipVia').value = '5021';
        
        // Fill first job part
        const firstJobPart = document.querySelector('.job-part');
        if (firstJobPart) {
            firstJobPart.querySelector('[name="qtyOrdered"]').value = '2500';
            firstJobPart.querySelector('[name="partDescription"]').value = 'Text Block 58x8pp';
            firstJobPart.querySelector('[name="jobProductType"]').value = '8PAGEIL';
            firstJobPart.querySelector('[name="pages"]').value = '464';
            firstJobPart.querySelector('[name="finalSizeW"]').value = '129.0';
            firstJobPart.querySelector('[name="finalSizeH"]').value = '198.0';
            firstJobPart.querySelector('[name="colorsS1"]').value = '1';
            firstJobPart.querySelector('[name="colorsS2"]').value = '1';
            firstJobPart.querySelector('[name="foldPattern"]').value = '41';
            firstJobPart.querySelector('[name="binderyMethod"]').value = 'LIMP_SEWN';
            firstJobPart.querySelector('[name="prepressWorkflow"]').value = 'Digital';
        }
        
        this.showNotification('Sample data loaded successfully! Based on "The Fifth Elephant" print job.', 'info');
    }
}

// Export singleton instance
export const uiManager = new UIManager();