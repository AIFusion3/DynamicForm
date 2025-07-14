# Dynamic Form Component

A flexible and customizable form component built with Mantine UI.

## DynamicView Documentation

- [DynamicView Documentation](docs/DynamicView.md)

## Features

- Form creation with JSON configuration
- Supported field types:
  - Textbox
  - Textarea
  - Date 
  - Checkbox
  - Dropdown (With dependent dropdown support)
  - Mask Input
  - Number
  - Switch
  - MultiSelect
  - Upload (File upload with preview)
  - UploadCollection (Multiple file uploads with preview and ordering)
  - HTMLEditor (Rich text editor)
  - SubListForm (Nested table support with JSON data)
  - ColumnField (Multi-column hierarchical data selection)
  - Refresh (Dynamic field type changing based on other field values)
- Automatic form validation
- Dependent fields support
- API integration with customizable endpoints
- Error handling and notifications
- Responsive grid layout
- File upload support for various file types (images, PDFs, etc.)

## Installation

```bash
npm install dynamic-form
# or
yarn add dynamic-form
```

## Quick Start

```typescript
import { DynamicForm } from 'dynamic-form';

const config = {
  rows: [
    {
      title: "Personal Information",
      headerStyle: { 
        color: '#2c3e50',
        fontSize: '18px',
        fontWeight: 'bold'
      },
      rowStyle: {
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #e9ecef'
      },
      columns: [
        {
          span: 6,
          fields: [
            {
              field: "name", 
              title: "Name",
              type: "textbox",
              required: true
            },
            {
              field: "birthDate",
              title: "Birth Date",
              type: "date"
            }
          ]
        },
        {
          span: 6,
          fields: [
            {
              field: "email",
              title: "Email",
              type: "textbox",
              required: true
            },
            {
              field: "phone",
              title: "Phone",
              type: "maskinput",
              mask: "+90 (000) 000-00-00"
            }
          ]
        }
      ]
    },
    {
      title: "Additional Information",
      rowStyle: {
        marginTop: '2rem',
        backgroundColor: '#fff3cd',
        padding: '1rem',
        borderLeft: '4px solid #ffc107'
      },
      columns: [
        {
          fields: [
            {
              field: "notes",
              title: "Notes",
              type: "textarea",
              minRows: 3,
              maxRows: 5,
              autosize: true
            }
          ]
        }
      ]
    }
  ]
};

function App() {
  return (
    <DynamicForm
      config={config}
      baseUrl="https://api.example.com"
      endpoint="users"
      onSuccess={(data) => console.log(data)}
      useToken={true}
      showDebug={false}
      pk_field="id"
      initialData={{ name: "John Doe", email: "john@example.com" }}
      submitButtonProps={{ children: "Save User", color: "blue" }}
      cancelButtonProps={{ children: "Cancel", color: "gray" }}
    />
  );
}
```

## Form Structure

The form is structured using a hierarchical configuration:

```
FormConfig
└── rows: RowConfig[]
    └── columns: ColumnConfig[]
        └── fields: FieldConfig[]
```

- **FormConfig**: The top-level configuration object
  - `fieldStyle`: Optional global style for all fields
  - `rows`: Array of row configurations

- **RowConfig**: Defines a row in the form
  - `title`: Optional title for the row
  - `headerStyle`: Optional style for the row header
  - `rowStyle`: Optional style for the row container
  - `columns`: Array of column configurations

- **ColumnConfig**: Defines a column within a row
  - `span`: Optional column width (1-12, using Mantine Grid system)
  - `fields`: Array of field configurations

- **FieldConfig**: Defines an individual form field
  - Common and type-specific properties as described below

## Row Styling

### headerStyle vs rowStyle

The form supports two different styling approaches for rows:

- **`headerStyle`**: Applied only to the row title/header text
- **`rowStyle`**: Applied to the entire row container (including all fields)

### Example Usage

```tsx
const config = {
  rows: [
    {
      title: "Personal Information",
      // Styles only the title text
      headerStyle: { 
        color: '#2c3e50',
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '1rem'
      },
      // Styles the entire row container
      rowStyle: {
        backgroundColor: '#f8f9fa',
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid #e9ecef',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '3rem'
      },
      columns: [...]
    },
    {
      title: "Contact Information",
      // Alert-style row
      rowStyle: {
        backgroundColor: '#d1ecf1',
        borderLeft: '5px solid #bee5eb',
        padding: '1.5rem',
        borderRadius: '0 8px 8px 0'
      },
      columns: [...]
    },
    {
      title: "Emergency Section",
      headerStyle: { color: '#dc3545', fontWeight: 'bold' },
      rowStyle: {
        backgroundColor: '#f8d7da',
        border: '2px solid #f5c6cb',
        padding: '1rem',
        borderRadius: '8px'
      },
      columns: [...]
    }
  ]
};
```

### Common Use Cases

**Card-style rows:**
```tsx
rowStyle: {
  backgroundColor: '#ffffff',
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e5e5e5'
}
```

**Alert/Warning sections:**
```tsx
rowStyle: {
  backgroundColor: '#fff3cd',
  border: '1px solid #ffeaa7',
  borderLeft: '4px solid #fdcb6e',
  padding: '1rem'
}
```

**Grouped sections:**
```tsx
rowStyle: {
  backgroundColor: '#f1f3f4',
  margin: '0 -1rem',
  padding: '1.5rem',
  borderTop: '3px solid #4285f4'
}
```

## Props

| Prop | Type | Description |
|------|-----|-------------|
| config | FormConfig | Form configuration |
| baseUrl | string | API base URL |
| endpoint | string | API endpoint |
| initialData | object | Initial values |
| onSuccess | function | Successful form submission callback |
| submitButtonProps | object | Save button properties |
| cancelButtonProps | object | Cancel button properties |
| useToken | boolean | Token usage (default: false) |
| showDebug | boolean | Debug mode (default: false) |
| pk_field | string | Primary key field name for PUT requests |
| hiddenCancel | boolean | Hide cancel button (default: false) |

## Field Types and Properties

### Common Properties
- field: Field name
- title: Label
- type: Field type
- required: Boolean indicating if the field is required
- placeholder: Placeholder text
- maxLength: Maximum character length (for text inputs)
- minLength: Minimum character length (for text inputs)

### Conditional Visibility Properties
All field types support conditional visibility based on other field values:

- visible_field: Field name to watch for visibility control
- hidden_field: Field name to watch for hiding control  
- visible_value: Field becomes visible when the watched field has this value
- hidden_value: Field becomes hidden when the watched field has this value
- visible: Initial visibility state ('show' | 'hidden'), default is 'show'

**Visibility Logic:**
1. Initial state is determined by the `visible` property (default: 'show')
2. If `visible_field` and `visible_value` are set, field is shown only when the watched field equals the visible_value
3. If `hidden_field` and `hidden_value` are set, field is hidden when the watched field equals the hidden_value (takes priority)
4. Visibility updates automatically when watched field values change

**Example:**
```tsx
// Dropdown field that controls visibility
{
  field: "document_type",
  title: "Document Type",
  type: "dropdown",
  options: [
    { value: "tckn", label: "TC Identity Number" },
    { value: "vkn", label: "Tax Number" }
  ]
},

// Conditional field - shown only when Tax Number is selected
{
  field: "tax_number",
  title: "Tax Number", 
  type: "textbox",
  visible_field: "document_type",
  visible_value: "vkn",
  visible: "hidden", // Initially hidden
  maxLength: 10,
  minLength: 10
},

// Conditional field - hidden when Tax Number is selected
{
  field: "identity_number",
  title: "TC Identity Number",
  type: "textbox", 
  hidden_field: "document_type",
  hidden_value: "vkn",
  visible: "show", // Initially visible
  maxLength: 11,
  minLength: 11
}
```

### Special Properties

#### Textbox
- type: "textbox"
- maxLength: Maximum character length
- minLength: Minimum character length (validates only if data is entered)

```tsx
{
  field: "name",
  title: "Full Name",
  type: "textbox",
  required: true,
  placeholder: "Enter your full name",
  maxLength: 100,
  minLength: 2
}
```

#### Textarea
- type: "textarea"
- minRows: Minimum rows
- maxRows: Maximum rows
- autosize: Auto sizing
- maxLength: Maximum character length

```tsx
{
  field: "description",
  title: "Description",
  type: "textarea",
  required: true,
  placeholder: "Enter description",
  minRows: 3,
  maxRows: 6,
  autosize: true,
  maxLength: 500
}
```

#### Date
- type: "date"
- valueFormat: date format (varsayılan: "DD.MM.YYYY")

```tsx
{
  field: "birthDate",
  title: "Birth Date",
  type: "date",
  required: true,
  placeholder: "Select date",
  valueFormat: "YYYY-MM-DD" // optional, default: "DD.MM.YYYY"
}
```

#### DateTime
- type: "datetime"
- valueFormat: Date ve clock format (varsayılan: "DD.MM.YYYY HH:mm")

```tsx
{
  field: "meetingTime",
  title: "Meeting Time",
  type: "datetime",
  required: true,
  placeholder: "Select date and time",
  valueFormat: "YYYY-MM-DD HH:mm" // optional, default: "DD.MM.YYYY HH:mm"
}
```

#### Checkbox
- type: "checkbox"

```tsx
{
  field: "agreeTerms",
  title: "I agree to the terms and conditions",
  type: "checkbox",
  required: true
}
```

#### Switch
- type: "switch"
- defaultChecked: Default state

```tsx
{
  field: "isActive",
  title: "Active Status",
  type: "switch",
  defaultChecked: true
}
```

#### Dropdown
- type: "dropdown"
- optionsUrl: API URL for options
- options: Static options
- refField: Dependent field

```tsx
{
  field: "country",
  title: "Country",
  type: "dropdown",
  required: true,
  placeholder: "Select a country",
  optionsUrl: "https://api.example.com/countries"
}
```

For dependent dropdowns, use the `refField` property to specify the field that this dropdown depends on. The `optionsUrl` should include a placeholder `{0}` that will be replaced with the value of the referenced field:

```tsx
{
  field: "country",
  title: "Country",
  type: "dropdown",
  optionsUrl: "https://api.example.com/countries"
},
{
  field: "city",
  title: "City",
  type: "dropdown",
  optionsUrl: "https://api.example.com/cities/{0}",
  refField: "country"
}
```

#### MultiSelect
- type: "multiselect"
- optionsUrl: API URL for options
- options: Static options

```tsx
{
  field: "skills",
  title: "Skills",
  type: "multiselect",
  required: true,
  placeholder: "Select skills",
  options: [
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "angular", label: "Angular" }
  ]
}
```

#### Number
- type: "number"
- min: Minimum value
- max: Maximum value
- step: Step amount
- prefix: Prefix
- suffix: Suffix
- defaultValue: Default value
- decimalSeparator: Decimal separator
- thousandSeparator: Thousand separator
- hideControls: Hide spinner buttons (default: true)

```tsx
{
  field: "price",
  title: "Price",
  type: "number",
  required: true,
  placeholder: "Enter price",
  min: 0,
  max: 1000,
  step: 0.01,
  prefix: "$",
  defaultValue: 0,
  decimalSeparator: ".",
  thousandSeparator: ",",
  hideControls: true // Hide spinner buttons (default)
}

// With spinner buttons enabled
{
  field: "quantity",
  title: "Quantity",
  type: "number",
  required: true,
  min: 1,
  max: 100,
  step: 1,
  hideControls: false // Show spinner buttons
}
```

#### MaskInput
- type: "maskinput"
- mask: Mask pattern

```tsx
{
  field: "phone",
  title: "Phone Number",
  type: "maskinput",
  required: true,
  placeholder: "Enter phone number",
  mask: "+1 (000) 000-0000"
}
```

#### Upload
- type: "upload"
- uploadUrl: URL to upload files
- maxSize: Maximum file size in bytes (default: 5MB)
- acceptedFileTypes: Array of accepted MIME types
- width: Width for preview (default: 200px)
- height: Height for preview (default: 200px)
- uploadContext: Optional context parameter for the upload request

```tsx
// Image upload configuration
{
  field: "profileImage",
  title: "Profile Image",
  type: "upload",
  acceptedFileTypes: ["image/png", "image/jpeg", "image/webp"],
  uploadUrl: "/api/upload"
}

// PDF upload configuration
{
  field: "document",
  title: "Document",
  type: "upload",
  acceptedFileTypes: ["application/pdf"],
  uploadUrl: "/api/upload"
}
```

Features:
- Support for both image and non-image file types
- File type specific preview:
  - Images: Shows thumbnail preview
  - Other files (PDF, etc.): Shows file icon and filename
- "View File" link for non-image files
- Display of accepted file types in the dropzone
- Different API response handling based on file type

Expected API response format:

For images:
```json
{
  "data": {
    "success": true,
    "list_image_url": "https://example.com/images/list/image.jpg",
    "detail_image_url": "https://example.com/images/detail/image.jpg"
  }
}
```

For other files (PDF, etc.):
```json
{
  "data": {
    "success": true,
    "file_url": "https://example.com/files/document.pdf"
  }
}
```

Form values stored:
- Images: Object with list and detail URLs
```json
{
  "list": "https://example.com/images/list/image.jpg",
  "detail": "https://example.com/images/detail/image.jpg"
}
```
- Other files: String with file URL
```json
"https://example.com/files/document.pdf"
```

#### UploadCollection
- type: "uploadcollection"
- uploadUrl: URL to upload files
- maxSize: Maximum file size in bytes (default: 5MB)
- acceptedFileTypes: Array of accepted MIME types
- width: Width for each image preview (default: 150px)
- height: Height for each image preview (default: 150px)
- uploadContext: Optional context parameter for the upload request
- maxImages: Maximum number of images allowed (default: 10)

```tsx
{
  field: "productGallery",
  title: "Product Gallery",
  type: "uploadcollection",
  required: true,
  uploadUrl: "https://api.example.com/upload",
  maxSize: 5 * 1024 * 1024, // 5MB
  acceptedFileTypes: ["image/png", "image/jpeg", "image/webp"],
  width: "100%", // Can be a percentage or pixel value
  height: 220,
  maxImages: 5, // Show 5 upload boxes
  uploadContext: "product_gallery"
}
```

The upload request format and expected API response are the same as the Upload field. The component stores the image URLs in the form values as an array of objects:

```json
[
  {
    "list": "https://example.com/images/list/image1.jpg",
    "detail": "https://example.com/images/detail/image1.jpg"
  },
  {
    "list": "https://example.com/images/list/image2.jpg",
    "detail": "https://example.com/images/detail/image2.jpg"
  }
]
```

Features of UploadCollection:
- Horizontal scrollable interface for multiple images
- Drag and drop support for each upload box
- Image preview with overlay controls
- Ability to replace existing images
- Delete functionality for removing images
- Left/right buttons for reordering images
- Progress indicator during upload
- Error handling and display

**Note:** The `width` and `height` properties were previously named `imageWidth` and `imageHeight` in versions prior to 1.x.x. The new property names provide more consistent naming across components.

#### HTMLEditor
- type: "htmleditor"
- editorHeight: Editor height in pixels

```tsx
{
  field: "content",
  title: "Content",
  type: "htmleditor",
  required: true,
  editorHeight: 300
}
```

Features of HTMLEditor:
- Rich text editing capabilities
- Toolbar with formatting options:
  - Bold, Italic, Underline, Strikethrough
  - Headings (H1-H4)
  - Lists (bullet and ordered)
  - Links
  - Text alignment
  - Code and Clear formatting
- Customizable height
- HTML content output

#### SegmentedControl
- type: "segmentedcontrol"
- color: MantineColor (theme color or custom color)
- radius: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- fullWidth: boolean (stretch control to full width)
- orientation: 'horizontal' | 'vertical'
- options: Array of { value: string, label: string }
- optionsUrl: API URL for dynamic options loading
- refField: Reference field for dependent loading

```tsx
// Static options
{
  field: "status",
  title: "Status",
  type: "segmentedcontrol",
  required: true,
  color: "blue",
  size: "sm",
  fullWidth: true,
  orientation: "horizontal",
  options: [
    { value: "1", label: "Active" },
    { value: "0", label: "Passive" }
  ]
}

// Dynamic options from API
{
  field: "category",
  title: "Category",
  type: "segmentedcontrol",
  required: true,
  color: "blue",
  optionsUrl: "https://api.example.com/categories"
}

// Dependent loading
{
  field: "subcategory",
  title: "Sub Category",
  type: "segmentedcontrol",
  required: true,
  optionsUrl: "https://api.example.com/categories/{0}/subcategories",
  refField: "category"
}
```

Features of SegmentedControl:
- Customizable appearance with color and size options
- Support for both horizontal and vertical orientations
- Full width mode for better layout control
- Automatic value and label handling
- Integration with form validation
- Support for required field validation
- Error message display
- Dynamic options loading from API
- Dependent field support like dropdown
- Automatic state management for API-loaded options

#### SubListForm
- type: "sublistform"
- subform: Nested form configuration
- columns: Column definitions with support for nested JSON data
- size: Modal size for edit form
- buttonTitle: Custom add button text

```tsx
{
  field: "variants",
  title: "Product Variants",
  type: "sublistform",
  required: true,
  buttonTitle: "Add Variant",
  size: "lg",
  columns: [
    {
      key: "name",
      title: "Name"
    },
    {
      key: "options",
      title: "Options",
      type: "json",
      subColumns: [
        { key: "color", title: "Color" },
        { key: "size", title: "Size" }
      ]
    }
  ],
  subform: {
    rows: [
      {
        columns: [
          {
            fields: [
              {
                field: "name",
                title: "Variant Name",
                type: "textbox",
                required: true
              },
              {
                field: "options",
                title: "Options",
                type: "sublistform",
                // Nested configuration...
              }
            ]
          }
        ]
      }
    ]
  }
}
```

Features of SubListForm:
- Table view of list items
- Add/Edit/Delete operations
- Modal form for item editing
- Support for nested JSON data display
- Customizable columns
- Nested table support for JSON array data

#### ColumnField
- type: "columnfield"
- optionsUrl: API URL for hierarchical data
- options: Static hierarchical data
- columnWidth: Width of each column (default: 200)
- columnHeight: Height of each column (default: 300)
- border: Border style (default: '1px solid #e0e0e0')
- borderRadius: Border radius for columns and items (default: 4)
- backgroundColor: Background color for items (default: '#ffffff')
- selectedColor: Background color for selected items (default: '#e6f7ff')
- fontSize: Font size for item text (default: 12)

```tsx
// Dynamic options from API
{
  field: "category",
  title: "Category Selection",
  type: "columnfield",
  required: true,
  optionsUrl: "https://api.example.com/categories",
  columnWidth: 220,
  columnHeight: 350,
  selectedColor: "#f0f8ff"
}

// Static options
{
  field: "productCategory",
  title: "Product Category",
  type: "columnfield",
  required: true,
  options: [
    {
      label: "Electronics",
      value: "electronics",
      children: [
        {
          label: "Computers",
          value: "computers"
        },
        {
          label: "Mobile Phones",
          value: "phones",
          children: [
            {
              label: "Smartphones",
              value: "smartphones"
            },
            {
              label: "Accessories",
              value: "accessories"
            }
          ]
        }
      ]
    },
    {
      label: "Clothing",
      value: "clothing"
    }
  ]
}
```

Features of ColumnField:
- Multi-column hierarchical data selection
- Responsive column-based interface
- Automatic navigation between parent and child categories
- Visual indicators for items with children
- Customizable appearance with styling options
- Scrollable columns for handling large datasets
- Form validation integration with required field support
- Dynamic loading of hierarchical data from API
- Support for both static and API-loaded options

The component expects hierarchical data in the following format:

```json
[
  {
    "label": "Category Name",
    "value": "unique_id",
    "children": [
      {
        "label": "Subcategory Name",
        "value": "sub_unique_id",
        "children": [
          // Further nested items
        ]
      }
    ]
  }
]
```

When a selection is made, the form stores:
- The selected item's value in the field
- The selected item's label in a field named `{fieldName}__title`

This allows you to capture both the ID and display name of the selected category.

#### Refresh Field
- type: "refresh"
- refreshMessage: Custom message to display
- changeto: Array of ChangeToConfig objects for dynamic field type changes

```tsx
{
  field: "productType",
  title: "Product Type",
  type: "dropdown",
  required: true,
  options: [
    { value: "physical", label: "Physical Product" },
    { value: "digital", label: "Digital Product" }
  ],
  changeto: [
    {
      target: "productDetails",
      updateurl: "/api/product/field-config"
    }
  ]
},
{
  field: "productDetails",
  title: "Product Details",
  type: "refresh",
  refreshMessage: "Bu alan ürün tipine göre değişecektir."
}
```

Features of Refresh Field:
- Dynamic field type changing based on other field values
- Server-side field configuration
- Automatic field updates when dependent fields change
- Customizable placeholder message
- Seamless integration with form validation

The Refresh field works in conjunction with the `changeto` property on other fields. When a field with a `changeto` property changes, it triggers an API call to get a new field configuration for the target field.

The `changeto` property is an array of objects with the following properties:
- `target`: The field name to update
- `updateurl`: The API URL to call to get the new field configuration

The API should return a response with the following format:

```json
{
  "data": {
    "field": "productDetails",
    "title": "Physical Product Details",
    "type": "sublistform",
    "required": true,
    // Other field properties based on the new type
  }
}
```

The component will replace the target field with the new configuration returned by the API. This allows for dynamic form behavior based on user selections.

#### ColumnField
- type: "columnfield"
- optionsUrl: API URL for hierarchical data
- options: Static hierarchical data
- columnWidth: Width of each column (default: 200)
- columnHeight: Height of each column (default: 300)
- border: Border style (default: '1px solid #e0e0e0')
- borderRadius: Border radius for columns and items (default: 4)
- backgroundColor: Background color for items (default: '#ffffff')
- selectedColor: Background color for selected items (default: '#e6f7ff')
- fontSize: Font size for item text (default: 12)

```tsx
// Dynamic options from API
{
  field: "category",
  title: "Category Selection",
  type: "columnfield",
  required: true,
  optionsUrl: "https://api.example.com/categories",
  columnWidth: 220,
  columnHeight: 350,
  selectedColor: "#f0f8ff"
}

// Static options
{
  field: "productCategory",
  title: "Product Category",
  type: "columnfield",
  required: true,
  options: [
    {
      label: "Electronics",
      value: "electronics",
      children: [
        {
          label: "Computers",
          value: "computers"
        },
        {
          label: "Mobile Phones",
          value: "phones",
          children: [
            {
              label: "Smartphones",
              value: "smartphones"
            },
            {
              label: "Accessories",
              value: "accessories"
            }
          ]
        }
      ]
    },
    {
      label: "Clothing",
      value: "clothing"
    }
  ]
}

// With conditional visibility
{
  field: "subcategory",
  title: "Sub Category",
  type: "columnfield",
  visible_field: "enable_categories",
  visible_value: "yes",
  visible: "hidden",
  optionsUrl: "https://api.example.com/subcategories"
}
```

Features of ColumnField:
- **Multi-column hierarchical interface**: iOS Settings-like navigation with multiple columns showing category levels
- **Interactive selection**: Click on parent categories to reveal children in next column
- **Visual feedback**: Selected items are highlighted with customizable colors
- **Responsive design**: Horizontal scrolling for multiple columns on smaller screens
- **Automatic navigation**: Seamless browsing through category hierarchies
- **Form integration**: Stores both value (ID) and title (display name) in form
- **Validation support**: Required field validation with error messages
- **Flexible data source**: Supports both static data and API-loaded hierarchical data
- **Customizable appearance**: Full control over colors, sizes, and styling

**Data Format:**
The component expects hierarchical data in the following format:

```json
[
  {
    "label": "Category Name",
    "value": "unique_id",
    "children": [
      {
        "label": "Subcategory Name",
        "value": "sub_unique_id",
        "children": [
          // Further nested items
        ]
      }
    ]
  }
]
```

**Form Values:**
When a selection is made, the form stores:
- The selected item's value in the field (e.g., "smartphones")
- The selected item's label in a field named `{fieldName}__title` (e.g., "Smartphones")

**Use Cases:**
- E-commerce product category selection
- Location/address hierarchical selection (Country > State > City)
- Organization structure navigation (Company > Department > Team)
- File/folder structure browsing
- Menu/page hierarchy selection
- Any multi-level categorization system

**Validation:**
- Required field validation ensures a selection is made
- Validation prevents selection of parent categories that have children (forces selection to leaf nodes)
- Error messages are displayed below the component
- Real-time validation feedback during user interaction

## URL Handling and baseUrl Integration

The DynamicForm component provides a centralized way to handle URLs for API requests through the `baseUrl` prop. This simplifies development and deployment across different environments.

### How baseUrl Works

The `baseUrl` prop is used as the base URL for all API requests made by the component, including:

1. Form submission (POST/PUT requests)
2. Options loading for dropdown, multiselect, and other fields
3. File uploads
4. Dynamic field configuration updates

### URL Resolution Logic

When a URL is specified in a field configuration (like `optionsUrl` or `uploadUrl`), it is processed as follows:

1. If the URL starts with "http://" or "https://", it is used as-is (absolute URL)
2. Otherwise, it is combined with the `baseUrl` (relative URL)

For example:

```tsx
// With baseUrl="https://api.example.com"

// Absolute URL - used as-is
optionsUrl: "https://other-api.com/options" // -> https://other-api.com/options

// Relative URL - combined with baseUrl
optionsUrl: "/options" // -> https://api.example.com/options
optionsUrl: "options" // -> https://api.example.com/options
```

This approach allows you to:
- Use the same form configuration across different environments (development, staging, production)
- Override specific endpoints when needed
- Maintain a clean configuration without repeating the base URL

### URL Parameters and Templates

Some URL properties support parameter templates, like the `{0}` placeholder in dependent dropdowns:

```tsx
{
  field: "country",
  title: "Country",
  type: "dropdown",
  optionsUrl: "/countries"
},
{
  field: "city",
  title: "City",
  type: "dropdown",
  optionsUrl: "/cities/{0}", // {0} will be replaced with the country value
  refField: "country"
}
```

When the user selects a country, the `{0}` in the city dropdown's `optionsUrl` is replaced with the selected country value before being combined with the `baseUrl`.

### URL Usage in Different Field Types

| Field Type | URL Property | Purpose |
|------------|-------------|---------|
| dropdown | optionsUrl | Load dropdown options |
| multiselect | optionsUrl | Load multiselect options |
| segmentedcontrol | optionsUrl | Load segmented control options |
| upload | uploadUrl | Upload file endpoint |
| uploadcollection | uploadUrl | Upload multiple files endpoint |
| tree | optionsUrl | Load hierarchical data |
| columnfield | optionsUrl | Load hierarchical column data |
| refresh (via changeto) | updateurl | Get dynamic field configuration |

### Best Practices

1. Use relative URLs in your field configurations whenever possible
2. Set the `baseUrl` prop to match your current environment
3. Use absolute URLs only when you need to call a different API domain
4. For dependent fields, use the `{0}` placeholder consistently
5. When using the `changeto` property, ensure the `updateurl` follows the same pattern

## API Integration

The component handles form submission to your API endpoint automatically:

1. For new records, it sends a POST request to `${baseUrl}/${endpoint}`
2. For existing records (when `initialData` contains the `pk_field`), it sends a PUT request to `${baseUrl}/${endpoint}/${initialData[pk_field]}`

Expected API response format:

```json
{
  "data": {
    // The created/updated record
  },
  "message": "Record saved successfully",
  "status_code": 200
}
```

## Error Handling

The component displays error messages from the API using Mantine notifications. If the API returns an error, it should have the following format:

```json
{
  "message": "Error message to display",
  "status_code": 400
}
```

## Form Validation

Form validation is handled automatically based on the `required` property of each field. You can see validation errors in real-time as users interact with the form.

## Development

### Version Management

The package includes scripts to automatically increment the version number when building:

```bash
# Increment patch version (1.0.0 -> 1.0.1) and build
npm run build:patch

# Increment minor version (1.0.0 -> 1.1.0) and build
npm run build:minor

# Increment major version (1.0.0 -> 2.0.0) and build
npm run build:major
```

You can also increment the version without building:

```bash
npm run version:patch
npm run version:minor
npm run version:major
```

## Token Usage

For token usage:
1. Set useToken prop to true
2. Store JWT token in localStorage with 'token' key

Token will be automatically added to API requests as Bearer token.

## License

MIT

