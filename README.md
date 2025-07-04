# MIS to XML Field Mapping Reference Documentation

## 📋 Overview

Comprehensive documentation for creating XML documents from MIS (Management Information System) form fields. This project provides complete field mappings, validation rules, and reference data for automated XML generation from printing industry MIS systems.

### Key Statistics
- **223 Form Fields** discovered and mapped
- **125+ XML Mappings** identified and documented
- **10+ Categories** of field types
- **400+ Reference Values** with validation endpoints
- **98% Mapping Completion** achieved

## 🚀 Quick Start

### Accessing the Documentation

1. **Local Setup:**
   ```bash
   git clone <repository-url>
   cd mis-xml-reference
   # Open index.html in your browser
   ```

2. **Direct Access:**
   - Open `index.html` in any modern web browser
   - No server setup required - works offline

### Basic Usage

1. **Browse Field Mappings:** Start with the index page for overview
2. **Search Specific Fields:** Use the search functionality on each page
3. **Validate Data:** Check reference data tables for valid field values
4. **Generate XML:** Use the XML template with your MIS data

## 📚 Documentation Structure

### Core Pages

| Page | Purpose | Content |
|------|---------|---------|
| [`index.html`](./index.html) | Main overview and navigation | Statistics, quick reference, external links |
| [`job-fields.html`](./job-fields.html) | Job-level field mappings | Basic info, extended fields, custom ISBN fields |
| [`jobpart-fields.html`](./jobpart-fields.html) | JobPart-level specifications | Production specs, sizes, colors, workflows |
| [`materials.html`](./materials.html) | Material specifications | JobMaterial table, size allowances |
| [`operations.html`](./operations.html) | Operations and workflows | Press forms, prepress, finishing, contacts |
| [`reference-data.html`](./reference-data.html) | Lookup tables and validation data | Complete reference datasets with filtering |
| [`validation.html`](./validation.html) | Implementation guidelines | API endpoints, validation rules, examples |

### Supporting Files

| File | Purpose |
|------|---------|
| [`TJ_job_import_v01.xml`](./TJ_job_import_v01.xml) | Sample XML structure | Real-world example for reference |
| [`field_mapping_document.md`](./field_mapping_document.md) | Technical documentation | Detailed field mapping specifications |
| **Excel Files** | Reference data sources | BindingMethod.xlsx, JobStatus.xlsx, etc. |

## 🔧 Field Mappings

### Job Level Fields (9 core + 6 extended + 8 custom)

#### Required Fields
```xml
<customer>AMBPUB</customer>                    <!-- Customer selection -->
<description>Job Description</description>     <!-- Primary job title -->
<jobType>1</jobType>                          <!-- Job type classification -->
```

#### Essential Fields
```xml
<promiseDate>2025-05-15</promiseDate>         <!-- YYYY-MM-DD format -->
<adminStatus>O</adminStatus>                  <!-- Job status code -->
```

#### Custom Fields
```xml
<U_BindingMethod>5151</U_BindingMethod>       <!-- Binding specification -->
<U_CasedISBN>9781234567890</U_CasedISBN>     <!-- ISBN for cased books -->
<U_LimpISBN>9781234567891</U_LimpISBN>       <!-- ISBN for limp books -->
```

### JobPart Level Fields (26 total fields)

#### Core JobPart Fields
```xml
<jobPart>01</jobPart>                         <!-- Two-digit with leading zero -->
<qtyOrdered>1000</qtyOrdered>                 <!-- Required quantity -->
<jobProductType>02CAN1UC</jobProductType>     <!-- Product classification -->
```

#### Production Specifications
```xml
<pages>32</pages>                             <!-- Page count -->
<foldPattern>51</foldPattern>                 <!-- Fold specification -->
<colorsS1>4</colorsS1>                        <!-- Side 1 colors -->
<colorsS2>4</colorsS2>                        <!-- Side 2 colors -->
```

### Material Fields (11 fields per material)

```xml
<JobMaterial>
    <sequence>01</sequence>
    <inventoryItem>PAPER-120GSM</inventoryItem>
    <plannedQuantity>1500</plannedQuantity>
    <paperWeight>120</paperWeight>
</JobMaterial>
```

### Operations & Workflows

- **Press Forms & Inks:** 6 fields per ink specification
- **Prepress Operations:** 5 fields per operation
- **Finishing Operations:** 8 fields per finishing step
- **Contacts & Shipping:** 6 shipping-related fields

## 📊 Reference Data

### Validation Endpoints

All reference data can be validated against these API endpoints:

| Endpoint | Records | Purpose |
|----------|---------|---------|
| [JobStatus/list](http://192.168.10.251/epace/company:public/object/JobStatus/list) | 57 | Job status validation |
| [JobType/list](http://192.168.10.251/epace/company:public/object/JobType/list) | 3 | Job type validation |
| [BindingMethod/list](http://192.168.10.251/epace/company:public/object/BindingMethod/list) | 104 | Binding method validation |
| [FoldPattern/list](http://192.168.10.251/epace/company:public/object/FoldPattern/list) | 86 | Fold pattern validation |
| [PrepressWorkflow/list](http://192.168.10.251/epace/company:public/object/PrepressWorkflow/list) | 14 | Prepress workflow validation |
| [JobProductType/list](http://192.168.10.251/epace/company:public/object/JobProductType/list) | 108 | Product type validation |
| [ShipmentType/list](http://192.168.10.251/epace/company:public/object/ShipmentType/list) | 10 | Shipment type validation |
| [ShipProvider/list](http://192.168.10.251/epace/company:public/object/ShipProvider/list) | 17 | Ship provider validation |

### Key Reference Tables

#### Job Status Codes (Sample)
| ID | Description | Open Job | In Production |
|----|-------------|----------|---------------|
| O | 01 Open | Yes | No |
| P | 03 In Production | Yes | Yes |
| C | 06 Complete | No | No |

#### Common Product Types
| ID | Description | Press | Colors |
|----|-------------|-------|--------|
| 02CAN1UC | 2pp 1/1 Cut and Stack Cased | Titan 6330 | 1 |
| 08CAN4UC | 8pp 4/4 Letter Fold Cased | Titan 6330 | 4 |
| 32SIG4UC | 32pp 4/4 Signature Cased | Titan 6330 | 4 |

## 🎯 XML Template Usage

### Basic Structure

Every job requires a minimum of 2 JobParts:

```xml
<import>
    <Jobs>
        <Job refId="Job1">
            <!-- Job Level Fields -->
            <customer>CLALTD</customer>
            <description>Job Title</description>
            <jobType>1</jobType>
            
            <JobParts>
                <!-- Part 01: Cover/Outer -->
                <JobPart>
                    <jobPart>01</jobPart>
                    <qtyOrdered>1000</qtyOrdered>
                    <!-- Cover specifications -->
                </JobPart>
                
                <!-- Part 02: Text/Inner -->
                <JobPart>
                    <jobPart>02</jobPart>
                    <qtyOrdered>1000</qtyOrdered>
                    <!-- Text specifications -->
                </JobPart>
            </JobParts>
        </Job>
    </Jobs>
</import>
```

### Common Use Cases

1. **Book Printing:**
   - Part 01: Cover (4pp, color)
   - Part 02: Text Block (32pp+, mono)

2. **Brochure Production:**
   - Part 01: Outer Pages (color)
   - Part 02: Inner Pages (mono/color)

3. **Magazine Publishing:**
   - Part 01: Cover (high-quality stock)
   - Part 02: Content Pages (standard stock)

## 🔍 Search & Navigation Features

### Global Search
- **Cross-page search** from index page
- **Page-specific search** with highlighting
- **Real-time filtering** of reference tables

### Navigation
- **Breadcrumb navigation** on all pages
- **Section navigation** within pages
- **Smooth scrolling** between sections
- **Previous/Next page** links

### Filtering
- **Active records only** filtering
- **Category-based filtering** (e.g., Digital vs Litho)
- **Custom filters** for specific needs

## ⚡ Implementation Guidelines

### Data Validation Requirements

#### Required Field Validation
```javascript
function validateJobData(jobData) {
    const errors = [];
    
    // Required fields
    if (!jobData.customer) errors.push("Customer is required");
    if (!jobData.description) errors.push("Description is required");
    if (!jobData.jobType) errors.push("Job type is required");
    if (!jobData.qtyOrdered || jobData.qtyOrdered <= 0) 
        errors.push("Quantity ordered must be positive");
    
    return errors;
}
```

#### Date Format Validation
```javascript
function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString) && !isNaN(Date.parse(dateString));
}
```

### Data Type Specifications

| Type | Format | Example | Notes |
|------|--------|---------|-------|
| **Dates** | YYYY-MM-DD | 2025-05-15 | ISO 8601 format |
| **Numbers** | Decimal | 126.0 | Dimensions, weights |
| **Integers** | Whole numbers | 1000 | Quantities, counts |
| **Booleans** | true/false | true | Checkbox states |
| **References** | ID values | 5151 | Database IDs |

### Special Considerations

- **JobPart Numbering:** Always use two digits with leading zeros (01, 02, 03)
- **Reference Validation:** Always verify IDs exist in reference endpoints
- **Material Specifications:** Use either `inventoryItem` OR `paperWeight` + `stockNumber`
- **Quantity Management:** Set `plannedQuantity` to 0 for automatic calculation

## 🛠️ Technical Specifications

### Framework & Dependencies
- **Bootstrap 5.3.0** - UI framework
- **Font Awesome 6.0.0** - Icons
- **Vanilla JavaScript** - No additional frameworks
- **Responsive Design** - Mobile-friendly

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Performance Features
- **Static HTML/CSS/JS** - No server required
- **Optimized tables** - Efficient rendering of large datasets
- **Lazy loading** - Content loaded as needed
- **Search indexing** - Fast text search across all content

## 📝 Development

### File Organization
```
mis-xml-reference/
├── index.html                 # Main overview page
├── job-fields.html            # Job level mappings
├── jobpart-fields.html        # JobPart level mappings
├── materials.html             # Material specifications
├── operations.html            # Operations & workflows
├── reference-data.html        # Reference lookup tables
├── validation.html            # Implementation guidelines
├── TJ_job_import_v01.xml      # Sample XML template
├── field_mapping_document.md  # Technical documentation
└── README.md                  # This file
```

## 📄 License & Usage

This documentation is provided for internal use in MIS to XML conversion projects. 


### Version History
- **v1.0** - Initial comprehensive documentation
- **v1.1** - Added two-part JobPart template
- **v1.2** - Fixed navigation links and search functionality

---

**Last Updated:** January 2025  
**Documentation Version:** 1.2  
**Mapping Completion:** 98%