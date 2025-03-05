# DynamicView Component Documentation

DynamicView is a flexible component for displaying data in a structured layout. It supports various field types and customizable styling options.

## Basic Usage

```typescript
import { DynamicView, ViewConfig } from 'dynamic-form';

const viewConfig: ViewConfig = {
    layout: 'horizontal',
    labelStyle: {
        width: 200,
        align: 'right',
        size: 'sm',
        weight: 600,
        color: '#2C3E50'
    },
    rows: [
        {
            title: 'Personal Information',
            columns: [
                {
                    span: 6,
                    fields: [
                        {
                            field: 'name',
                            title: 'Full Name',
                            type: 'text'
                        },
                        {
                            field: 'birthDate',
                            title: 'Birth Date',
                            type: 'date'
                        }
                    ]
                }
            ]
        }
    ]
};

const data = {
    name: 'John Doe',
    birthDate: '1990-01-01'
};

<DynamicView config={viewConfig} data={data} />
```

## Configuration

### ViewConfig Interface

```typescript
interface ViewConfig {
    fieldStyle?: React.CSSProperties;
    labelStyle?: {
        width?: number;
        align?: 'left' | 'right' | 'center' | 'justify';
        size?: MantineSize;
        weight?: number;
        color?: string;
        lineClamp?: number;
        inline?: boolean;
        inherit?: boolean;
    };
    rows: ViewRowConfig[];
    layout?: 'vertical' | 'horizontal';
}
```

### Supported Field Types

- `text`: Regular text display
- `date`: Date format (localized)
- `datetime`: Date and time format (localized)
- `image`: Image display with customizable dimensions
- `file`: File link with icon
- `gallery`: Multiple image display
- `html`: HTML content
- `number`: Numeric value with localized formatting
- `boolean`: Yes/No display

### Layout Options

#### Horizontal Layout
Labels are placed to the left of values:
```typescript
{
    layout: 'horizontal',
    labelStyle: {
        width: 200,
        align: 'right'
    }
}
```

#### Vertical Layout
Labels are placed above values:
```typescript
{
    layout: 'vertical',
    labelStyle: {
        align: 'left'
    }
}
```

### Styling Options

#### Label Styling
```typescript
labelStyle: {
    width: 200,              // Width of label container
    align: 'right',          // Text alignment: 'left', 'right', 'center', 'justify'
    size: 'sm',              // Text size: 'xs', 'sm', 'md', 'lg', 'xl'
    weight: 600,             // Font weight
    color: '#2C3E50',        // Text color
    lineClamp: 1,            // Number of lines before truncating
    inline: false,           // Inline display
    inherit: false           // Inherit font properties from parent
}
```

#### Value Styling
```typescript
fieldStyle: {
    backgroundColor: '#f9f9f9',
    padding: '8px 12px',
    // ... any valid CSS properties
}
```

### Grid System

The component uses Mantine's Grid system for layout:

```typescript
{
    rows: [
        {
            title: 'Section Title',
            columns: [
                {
                    span: 6,        // 6 columns out of 12 (half width)
                    fields: [...]
                },
                {
                    span: 6,        // Other half
                    fields: [...]
                }
            ]
        }
    ]
}
```

## Examples

### Mixed Field Types
```typescript
const viewConfig: ViewConfig = {
    layout: 'horizontal',
    rows: [
        {
            columns: [
                {
                    fields: [
                        {
                            field: 'photo',
                            title: 'Profile Photo',
                            type: 'image',
                            imageWidth: 150,
                            imageHeight: 150
                        },
                        {
                            field: 'documents',
                            title: 'Documents',
                            type: 'gallery',
                            imageWidth: 100,
                            imageHeight: 100
                        },
                        {
                            field: 'resume',
                            title: 'Resume',
                            type: 'file'
                        },
                        {
                            field: 'isActive',
                            title: 'Active Status',
                            type: 'boolean'
                        }
                    ]
                }
            ]
        }
    ]
};
```

### Custom Styling
```typescript
const viewConfig: ViewConfig = {
    labelStyle: {
        width: 180,
        align: 'right',
        size: 'sm',
        weight: 600,
        color: '#2C3E50'
    },
    fieldStyle: {
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        padding: '10px 15px'
    }
};
``` 