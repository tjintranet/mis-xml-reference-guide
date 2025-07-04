// Application configuration and constants
export const CONFIG = {
    // File paths for reference data
    REFERENCE_DATA_PATHS: {
        jobTypes: 'jobTypes.json',
        jobStatus: 'jobStatus.json',
        bindingMethods: 'bindingMethods.json',
        foldPatterns: 'foldPatterns.json',
        jobProductTypes: 'jobProductTypes.json',
        prepressWorkflows: 'prepressWorkflows.json',
        shipmentTypes: 'shipmentTypes.json',
        shipProviders: 'shipProviders.json'
    },

    // Default values
    DEFAULTS: {
        jobType: '1',
        adminStatus: 'O',
        productionStatus: 'O'
    },

    // XML template settings
    XML: {
        encoding: 'UTF-8',
        version: '1.0'
    },

    // UI settings
    UI: {
        NOTIFICATION_DURATION: 5000,
        MAX_PREVIEW_ROWS: 10
    },

    // Validation rules
    VALIDATION: {
        REQUIRED_FIELDS: ['customer', 'description'],
        SUPPORTED_FILE_TYPES: ['.csv', '.xlsx', '.xls']
    }
};

// Fallback reference data (used when JSON files can't be loaded)
export const FALLBACK_DATA = {
    jobTypes: [
        {"id": "1", "Description": "Printing Job"},
        {"id": "10", "Description": "Finished Goods Job"},
        {"id": "5001", "Description": "Auto Close Job"}
    ],
    jobStatus: [
        {"id": "O", "Description": "01 Open"},
        {"id": "P", "Description": "02 Pre load"},
        {"id": "I", "Description": "06.5 Imp 2 Print"},
        {"id": "S", "Description": "23 Shipped"},
        {"id": "C", "Description": "25 Closed"},
        {"id": "X", "Description": "26 Cancelled"}
    ],
    bindingMethods: [
        {"id": "CLOTH_NOTCHED", "Description": "Cloth Notched"},
        {"id": "CLOTH_PBOUND", "Description": "Cloth P/Bound"},
        {"id": "CLOTH_PUR", "Description": "Cloth PUR"},
        {"id": "CLOTH_SEWN", "Description": "Cloth Sewn"},
        {"id": "LIMP_NOTCHED", "Description": "Limp Notched"},
        {"id": "LIMP_NOTCHED_8PP", "Description": "Limp Notched 8pp Cover"},
        {"id": "LIMP_PBOUND", "Description": "Limp P/Bound"},
        {"id": "LIMP_PBOUND_8PP", "Description": "Limp P/Bound 8pp Cover"},
        {"id": "LIMP_PUR", "Description": "Limp PUR"},
        {"id": "LIMP_SEWN", "Description": "Limp Sewn"},
        {"id": "LIMP_SEWN_8PP", "Description": "Limp Sewn 8pp Cover"},
        {"id": "PPC_NOTCHED", "Description": "PPC Notched"},
        {"id": "PPC_PBOUND", "Description": "PPC P/Bound"},
        {"id": "PPC_PUR", "Description": "PPC PUR"},
        {"id": "PPC_SEWN", "Description": "PPC Sewn"},
        {"id": "SS_ROUND", "Description": "S/S Round"},
        {"id": "SS_SQUARE", "Description": "S/S Square back"},
        {"id": "WIRO_BOUND", "Description": "Wiro Bound"}
    ],
    foldPatterns: [
        {"Pattern Number": "1", "Pages": "2", "Description": "Flat Sheet (no bleed)"},
        {"Pattern Number": "2", "Pages": "2", "Description": "Flat Sheet (3mm Trim)"},
        {"Pattern Number": "11", "Pages": "4", "Description": "Half Fold"},
        {"Pattern Number": "21", "Pages": "6", "Description": "Z Fold"},
        {"Pattern Number": "31", "Pages": "8", "Description": "Letter Fold"},
        {"Pattern Number": "41", "Pages": "16", "Description": "Signature"}
    ],
    jobProductTypes: [
        {"Product Type ID": "02CAN1UC", "Description": "2pp 1/1 Cut and Stack Cased"},
        {"Product Type ID": "04CAN1UC", "Description": "4pp 1/1 Half Fold Cased"},
        {"Product Type ID": "08CAN1UC", "Description": "8pp 1/1 Letter Fold Cased"},
        {"Product Type ID": "16SIG1UC", "Description": "16pp 1/1 Signature Cased"},
        {"Product Type ID": "32SIG4UC", "Description": "32pp 4/4 Signature Cased"}
    ],
    prepressWorkflows: [
        {"Prep Method": "Digital", "Material Provided": "File"},
        {"Prep Method": "No Approval Required Digital", "Material Provided": "File"},
        {"Prep Method": "Finishing Only", "Material Provided": "File"},
        {"Prep Method": "Prepress Only", "Material Provided": "File"}
    ],
    shipmentTypes: [
        {"id": "1", "Description": "Partial Shipment"},
        {"id": "2", "Description": "Fully Shipped"},
        {"id": "4", "Description": "Final Shipment"},
        {"id": "8", "Description": "Planned Shipments"}
    ],
    shipProviders: [
        {"id": "5024", "Name": "Customer Collect"},
        {"id": "5003", "Name": "DPD"},
        {"id": "5008", "Name": "FedEx"},
        {"id": "5002", "Name": "Royal Mail"},
        {"id": "5021", "Name": "TJ Books"}
    ]
};