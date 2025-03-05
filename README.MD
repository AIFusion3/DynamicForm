# Dynamic Form

Mantine UI based dynamic form creation component.

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
- Automatic form validation
- Dependent fields support
- API integration with customizable endpoints
- Error handling and notifications
- Responsive grid layout
- File upload support for various file types (images, PDFs, etc.)

## Installation

```bash
npm install @mantine/core @mantine/form @mantine/dates @mantine/notifications @tabler/icons-react react-imask
npm install git+https://github.com/AIFusion3/DynamicForm
```

## Usage

```tsx
import DynamicForm from 'dynamic-form';

const config = {
  rows: [
    {
      title: "Personal Information",
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
  - `columns`: Array of column configurations

- **ColumnConfig**: Defines a column within a row
  - `span`: Optional column width (1-12, using Mantine Grid system)
  - `fields`: Array of field configurations

- **FieldConfig**: Defines an individual form field
  - Common and type-specific properties as described below

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

### Special Properties

#### Textbox
- type: "textbox"
- maxLength: Maximum character length

```tsx
{
  field: "name",
  title: "Full Name",
  type: "textbox",
  required: true,
  placeholder: "Enter your full name",
  maxLength: 100
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

```tsx
{
  field: "birthDate",
  title: "Birth Date",
  type: "date",
  required: true,
  placeholder: "Select date"
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
  thousandSeparator: ","
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
- width: Width for image preview (default: 200px)
- height: Height for image preview (default: 200px)
- uploadContext: Optional context parameter for the upload request

```tsx
{
  field: "profileImage",
  title: "Profile Image",
  type: "upload",
  required: true,
  uploadUrl: "https://api.example.com/upload",
  maxSize: 5 * 1024 * 1024, // 5MB
  acceptedFileTypes: ["image/png", "image/jpeg", "image/webp"],
  width: 200,
  height: 200,
  uploadContext: "profile"
}
```

The upload request is sent as `multipart/form-data` with the following fields:
- file: The file to upload
- filename: The name of the file
- content_type: The MIME type of the file
- uploadcontext: The context parameter (if provided)

Expected API response format:

```json
{
  "data": {
    "success": true,
    "list_image_url": "https://example.com/images/list/image.jpg",
    "detail_image_url": "https://example.com/images/detail/image.jpg"
  },
  "message": "Upload successful",
  "status_code": 200
}
```

The component stores the image URLs in the form values as an object:

```json
{
  "list": "https://example.com/images/list/image.jpg",
  "detail": "https://example.com/images/detail/image.jpg"
}
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

#### Upload (Updated)
The Upload component now supports various file types beyond images:

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

New features for Upload component:
- Support for non-image file types
- File type specific preview:
  - Images: thumbnail preview
  - Other files: file icon with filename
- "View File" link for non-image files
- Display of accepted file types
- Different response handling for images vs files:
  - Images: expects list_image_url and detail_image_url
  - Files: expects file_url

Expected API response format for files:
```json
{
  "data": {
    "success": true,
    "file_url": "https://example.com/files/document.pdf"
  },
  "message": "Upload successful",
  "status_code": 200
}
```

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

