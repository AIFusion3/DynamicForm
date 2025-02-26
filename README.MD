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
- Automatic form validation
- Dependent fields support
- API integration with customizable endpoints
- Error handling and notifications
- Responsive grid layout

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

## Field Types and Properties

### Common Properties
- field: Field name
- title: Label
- type: Field type
- required: Required field
- placeholder: Placeholder text

### Special Properties

#### Textarea
- minRows: Minimum rows
- maxRows: Maximum rows
- autosize: Auto sizing

#### Dropdown
- optionsUrl: API URL for options
- options: Static options
- refField: Dependent field

The dropdown component supports both static options and dynamic options loaded from an API. When using `optionsUrl`, the component will fetch options from the specified URL. The API response can be either a direct array of options or an object with a `data` property containing the array:

```json
// Direct array response
[
  { "value": "1", "label": "Option 1" },
  { "value": "2", "label": "Option 2" }
]

// Or with data property
{
  "data": [
    { "value": "1", "label": "Option 1" },
    { "value": "2", "label": "Option 2" }
  ],
  "message": "Success",
  "status_code": 200
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
- optionsUrl: API URL for options
- options: Static options

The MultiSelect component works similarly to the Dropdown component but allows selecting multiple options. It supports the same API response formats (direct array or object with data property).

#### Number
- min: Minimum value
- max: Maximum value
- step: Step amount
- prefix: Prefix
- suffix: Suffix
- defaultValue: Default value
- decimalSeparator: Decimal separator
- thousandSeparator: Thousand separator

#### MaskInput
- mask: Mask pattern

Example:
```tsx
{
  field: "phone",
  title: "Phone Number",
  type: "maskinput",
  mask: "+1 (000) 000-0000",
  required: true
}
```

#### Switch
- defaultChecked: Default state

#### Upload
- uploadUrl: URL to upload files
- maxSize: Maximum file size in bytes (default: 5MB)
- acceptedFileTypes: Array of accepted MIME types
- imageWidth: Width for image preview (default: 200px)
- imageHeight: Height for image preview (default: 200px)
- uploadContext: Optional context parameter for the upload request

The Upload field provides a drag-and-drop interface for file uploads with image preview. When a file is selected, it's automatically uploaded to the specified URL. The component shows upload progress and displays the uploaded image once complete.

Example configuration:

```tsx
{
  field: "productImage",
  title: "Product Image",
  type: "upload",
  required: true,
  uploadUrl: "https://api.example.com/upload",
  maxSize: 5 * 1024 * 1024, // 5MB
  acceptedFileTypes: ["image/png", "image/jpeg", "image/webp"],
  imageWidth: 200,
  imageHeight: 200,
  uploadContext: "product" // Optional context parameter
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

