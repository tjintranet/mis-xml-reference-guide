// XML generation functionality
import { CONFIG } from './config.js';

class XMLGenerator {
    constructor() {
        this.xmlContent = '';
    }

    /**
     * Generate XML from data array
     * @param {Array} dataArray - Array of job data objects
     * @returns {string} Generated XML content
     */
    generateXMLFromData(dataArray) {
        let xml = this.getXMLHeader();
        xml += this.generateJobsSection(dataArray);
        xml += this.generateJobProductsSection(dataArray);
        xml += this.getXMLFooter();
        
        this.xmlContent = xml;
        return xml;
    }

    /**
     * Get XML header
     * @returns {string} XML header
     */
    getXMLHeader() {
        return `<?xml version="${CONFIG.XML.version}" encoding="${CONFIG.XML.encoding}"?>\n<import>\n\t<Jobs>\n`;
    }

    /**
     * Get XML footer
     * @returns {string} XML footer
     */
    getXMLFooter() {
        return `\t</JobProducts>\n</import>`;
    }

    /**
     * Generate Jobs section
     * @param {Array} dataArray - Job data array
     * @returns {string} Jobs XML section
     */
    generateJobsSection(dataArray) {
        let xml = '';
        
        dataArray.forEach((jobData, index) => {
            const jobRefId = `Job${index + 1}`;
            xml += this.generateJobXML(jobData, jobRefId);
        });
        
        xml += `\t</Jobs>\n`;
        return xml;
    }

    /**
     * Generate single Job XML
     * @param {Object} jobData - Job data object
     * @param {string} jobRefId - Job reference ID
     * @returns {string} Job XML
     */
    generateJobXML(jobData, jobRefId) {
        let xml = `\t\t<Job refId="${jobRefId}">\n`;
        
        // Basic job information
        xml += this.generateBasicJobInfo(jobData);
        
        // Job Parts
        xml += `\t\t\t<JobParts>\n`;
        xml += this.generateJobPartsXML(jobData);
        xml += `\t\t\t</JobParts>\n`;
        
        // Job Shipments
        if (jobData.shipmentType || jobData.shipVia) {
            xml += this.generateJobShipmentsXML(jobData);
        }
        
        xml += `\t\t</Job>\n`;
        return xml;
    }

    /**
     * Generate basic job information XML
     * @param {Object} jobData - Job data object
     * @returns {string} Basic job info XML
     */
    generateBasicJobInfo(jobData) {
        let xml = '';
        
        // Required fields
        xml += `\t\t\t<customer>${this.escapeXML(jobData.customer || '')}</customer>\n`;
        xml += `\t\t\t<description>${this.escapeXML(jobData.description || '')}</description>\n`;
        xml += `\t\t\t<jobType>${jobData.jobType || CONFIG.DEFAULTS.jobType}</jobType>\n`;
        
        // Extended description
        if (jobData.additionalDescription) {
            xml += `\t\t\t<description2>${this.escapeXML(jobData.additionalDescription)}</description2>\n`;
        }
        
        // Job identification
        if (jobData.sectionOrder) {
            xml += `\t\t\t<sectionOrder>${this.escapeXML(jobData.sectionOrder)}</sectionOrder>\n`;
        }
        if (jobData.subJobType) {
            xml += `\t\t\t<subJobType>${this.escapeXML(jobData.subJobType)}</subJobType>\n`;
        }
        
        // Status and dates
        if (jobData.adminStatus) {
            xml += `\t\t\t<adminStatus>${jobData.adminStatus}</adminStatus>\n`;
        }
        if (jobData.earliestStart) {
            xml += `\t\t\t<earliestStartDate>${jobData.earliestStart}</earliestStartDate>\n`;
        }
        if (jobData.scheduledShip) {
            xml += `\t\t\t<promiseDate>${jobData.scheduledShip}</promiseDate>\n`;
        }
        if (jobData.processedDate) {
            xml += `\t\t\t<processedDate>${jobData.processedDate}</processedDate>\n`;
        }
        
        // Contact information
        if (jobData.poNumber) {
            xml += `\t\t\t<poNum>${this.escapeXML(jobData.poNumber)}</poNum>\n`;
        }
        if (jobData.enteredBy) {
            xml += `\t\t\t<enteredBy>${this.escapeXML(jobData.enteredBy)}</enteredBy>\n`;
        }
        if (jobData.author) {
            xml += `\t\t\t<author>${this.escapeXML(jobData.author)}</author>\n`;
        }
        if (jobData.jobContact) {
            const contactParts = jobData.jobContact.split(' ');
            xml += `\t\t\t<contactFirstName>${this.escapeXML(contactParts[0] || '')}</contactFirstName>\n`;
            xml += `\t\t\t<contactLastName>${this.escapeXML(contactParts.slice(1).join(' ') || '')}</contactLastName>\n`;
        }
        
        // Binding information
        if (jobData.bindingMethod) {
            xml += `\t\t\t<U_BindingMethod>${jobData.bindingMethod}</U_BindingMethod>\n`;
        }
        
        // ISBN information
        if (jobData.casedISBN) {
            xml += `\t\t\t<U_CasedISBN>${this.escapeXML(jobData.casedISBN)}</U_CasedISBN>\n`;
        }
        if (jobData.limpISBN) {
            xml += `\t\t\t<U_LimpISBN>${this.escapeXML(jobData.limpISBN)}</U_LimpISBN>\n`;
        }
        
        // Schedule flags
        if (jobData.readyToSchedule) {
            xml += `\t\t\t<U_ReadyToSchedule>true</U_ReadyToSchedule>\n`;
        }
        if (jobData.scheduled) {
            xml += `\t\t\t<U_Scheduled>true</U_Scheduled>\n`;
        }
        
        return xml;
    }

    /**
     * Generate Job Parts XML
     * @param {Object} jobData - Job data object
     * @returns {string} Job Parts XML
     */
    generateJobPartsXML(jobData) {
        let xml = '';
        
        if (jobData.jobParts && jobData.jobParts.length > 0) {
            // Form data with job parts array
            jobData.jobParts.forEach(part => {
                xml += this.generateJobPartXML(part, 4);
            });
        } else {
            // Import data - create single job part
            const part = {
                jobPart: '01',
                qtyOrdered: jobData.qtyOrdered || jobData.quantity || '',
                description: jobData.partDescription || jobData.description || '',
                jobProductType: jobData.jobProductType || '',
                pages: jobData.pages || '',
                finalSizeW: jobData.finalSizeW || '',
                finalSizeH: jobData.finalSizeH || '',
                colorsS1: jobData.colorsS1 || '',
                colorsS2: jobData.colorsS2 || '',
                foldPattern: jobData.foldPattern || '',
                binderyMethod: jobData.binderyMethod || '',
                prepressWorkflow: jobData.prepressWorkflow || ''
            };
            xml += this.generateJobPartXML(part, 4);
        }
        
        return xml;
    }

    /**
     * Generate single Job Part XML
     * @param {Object} part - Job part data
     * @param {number} indentLevel - Indentation level
     * @returns {string} Job Part XML
     */
    generateJobPartXML(part, indentLevel) {
        const indent = '\t'.repeat(indentLevel);
        let xml = `${indent}<JobPart>\n`;
        
        // Core fields
        xml += `${indent}\t<jobPart>${part.jobPart}</jobPart>\n`;
        xml += `${indent}\t<jobProduct id="1000"/>\n`;
        xml += `${indent}\t<productionStatus>${CONFIG.DEFAULTS.productionStatus}</productionStatus>\n`;
        
        // Optional fields
        const fields = [
            { key: 'qtyOrdered', value: part.qtyOrdered },
            { key: 'description', value: part.description, escape: true },
            { key: 'jobProductType', value: part.jobProductType },
            { key: 'pages', value: part.pages },
            { key: 'foldPattern', value: part.foldPattern },
            { key: 'finalSizeW', value: part.finalSizeW },
            { key: 'finalSizeH', value: part.finalSizeH },
            { key: 'colorsS1', value: part.colorsS1 },
            { key: 'colorsS2', value: part.colorsS2 },
            { key: 'binderyMethod', value: part.binderyMethod },
            { key: 'prepressWorkflow', value: part.prepressWorkflow, escape: true }
        ];
        
        fields.forEach(field => {
            if (field.value && field.value.toString().trim() !== '') {
                const value = field.escape ? this.escapeXML(field.value) : field.value;
                xml += `${indent}\t<${field.key}>${value}</${field.key}>\n`;
            }
        });
        
        xml += `${indent}</JobPart>\n`;
        return xml;
    }

    /**
     * Generate Job Shipments XML
     * @param {Object} jobData - Job data object
     * @returns {string} Job Shipments XML
     */
    generateJobShipmentsXML(jobData) {
        let xml = `\t\t\t<JobShipments>\n`;
        xml += `\t\t\t\t<JobShipment>\n`;
        
        if (jobData.shipmentType) {
            xml += `\t\t\t\t\t<shipmentType>${jobData.shipmentType}</shipmentType>\n`;
        }
        if (jobData.shipVia) {
            xml += `\t\t\t\t\t<shipVia>${jobData.shipVia}</shipVia>\n`;
        }
        
        xml += `\t\t\t\t</JobShipment>\n`;
        xml += `\t\t\t</JobShipments>\n`;
        
        return xml;
    }

    /**
     * Generate Job Products section
     * @param {Array} dataArray - Job data array
     * @returns {string} Job Products XML section
     */
    generateJobProductsSection(dataArray) {
        let xml = `\t<JobProducts>\n`;
        
        dataArray.forEach((jobData, index) => {
            const jobRefId = `Job${index + 1}`;
            xml += `\t\t<JobProduct refId="1000${index}">\n`;
            xml += `\t\t\t<job id="${jobRefId}"/>\n`;
            xml += `\t\t\t<sequence>1</sequence>\n`;
            xml += `\t\t\t<description>${this.escapeXML(jobData.description || '')}</description>\n`;
            xml += `\t\t</JobProduct>\n`;
        });
        
        return xml;
    }

    /**
     * Escape XML special characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeXML(text) {
        if (!text) return '';
        return text.toString()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /**
     * Format XML with proper indentation
     * @param {string} xml - Raw XML string
     * @returns {string} Formatted XML
     */
    formatXML(xml) {
        // This is a simple formatter - for production, consider using a proper XML formatter
        return xml;
    }

    /**
     * Get current XML content
     * @returns {string} Current XML content
     */
    getXMLContent() {
        return this.xmlContent;
    }

    /**
     * Validate XML structure
     * @param {string} xml - XML to validate
     * @returns {Object} Validation result
     */
    validateXML(xml) {
        try {
            // Basic validation - check if it's well-formed XML
            const parser = new DOMParser();
            const doc = parser.parseFromString(xml, 'application/xml');
            const errors = doc.getElementsByTagName('parsererror');
            
            if (errors.length > 0) {
                return {
                    isValid: false,
                    message: 'XML is not well-formed: ' + errors[0].textContent
                };
            }
            
            return {
                isValid: true,
                message: 'XML is valid'
            };
        } catch (error) {
            return {
                isValid: false,
                message: 'Error validating XML: ' + error.message
            };
        }
    }

    /**
     * Download XML as file
     * @param {string} filename - Download filename
     */
    downloadXML(filename = null) {
        if (!this.xmlContent || this.xmlContent.trim() === '') {
            throw new Error('No XML content to download');
        }
        
        const defaultFilename = `job-import-${new Date().toISOString().split('T')[0]}.xml`;
        const downloadFilename = filename || defaultFilename;
        
        const blob = new Blob([this.xmlContent], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = downloadFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Export singleton instance
export const xmlGenerator = new XMLGenerator();