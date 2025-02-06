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

## Installation

```bash
npm install @mantine/core @mantine/form
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
        />
    );
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

#### Switch
- defaultChecked: Default state

## Token Usage

For token usage:
1. Set useToken prop to true
2. Store JWT token in localStorage with 'token' key

Token will be automatically added to API requests as Bearer token.

## License

MIT

