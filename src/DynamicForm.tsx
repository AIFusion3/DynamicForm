// components/DynamicForm.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
    Button,
    ButtonProps,
    TextInput,
    Textarea,
    Grid,
    Checkbox,
    Group,
    Select,
    Loader,
    Text,
    InputBase,
    NumberInput,
    Switch,
    MultiSelect,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { MantineProvider } from '@mantine/core';
import '@mantine/dates/styles.css';
import { IMaskInput } from 'react-imask';
import { notifications, Notifications } from '@mantine/notifications';

// Supported field types
export type FieldType = 'textbox' | 'textarea' | 'date' | 'checkbox' | 'dropdown' | 'maskinput' | 'number' | 'switch' | 'multiselect';

export interface FieldConfig {
    field: string;      // Field name
    title: string;      // Label to display
    type: FieldType;
    required?: boolean;
    maxLength?: number; // Newly added
    placeholder?: string;  // Placeholder property added
    mask?: string;  // Mask pattern for maskinput
    // Options for textarea:
    minRows?: number;
    maxRows?: number;
    autosize?: boolean;  // Newly added
    // For dropdown fields:
    optionsUrl?: string;  // URL to fetch options from API
    options?: { value: string; label: string }[]; // Static options (optional)
    // Properties for number input
    min?: number;
    max?: number;
    step?: number;
    prefix?: string;
    suffix?: string;
    defaultValue?: number;
    decimalSeparator?: string;
    thousandSeparator?: string;
    defaultChecked?: boolean;  // Default value for switch
    refField?: string;  // Reference field name
}

// New: Interface defining fields in a column, added optional span
export interface ColumnConfig {
    span?: number; // If defined, will be used as Grid.Col span value
    fields: FieldConfig[];
}

export interface RowConfig {
    title?: string;                    // Row title (e.g. "General Information") 
    headerStyle?: React.CSSProperties; // Custom style for row header (optional)
    columns: ColumnConfig[];           // Columns
}

// Global olarak field stilini belirlemek için (bileşenin kendisine uygulanır)
export interface FormConfig {
    fieldStyle?: React.CSSProperties;
    rows: RowConfig[];
}

export interface DynamicFormProps {
    config: FormConfig;      // Form konfigürasyon JSON
    baseUrl: string;         // POST isteği için base URL
    endpoint: string;        // POST isteği için endpoint adresi
    initialData?: Record<string, any>; // Yeni eklenen
    onSuccess?: (data: any) => void; // Form başarılı gönderildikten sonra fırlatılacak event
    // Buton ayarları; detaylı ayarlar (text, variant, color vs.) için
    submitButtonProps?: Partial<ButtonProps & { onClick: (event: React.MouseEvent<HTMLButtonElement>) => void }>;
    cancelButtonProps?: Partial<ButtonProps & { onClick: (event: React.MouseEvent<HTMLButtonElement>) => void }>;
}

// DropdownField için tip güncellemesi
interface DropdownOption {
    value: string | number;
    label: string;
}

export interface DropdownFieldProps {
    field: FieldConfig;
    form: ReturnType<typeof useForm>;
    globalStyle?: React.CSSProperties;
    onDropdownChange?: (fieldName: string, value: string | number) => void;
    options?: DropdownOption[];
    setOptionsForField?: (fieldName: string, options: DropdownOption[]) => void;
}

const DropdownField: React.FC<DropdownFieldProps> = ({
    field,
    form,
    globalStyle,
    onDropdownChange,
    options = [],
    setOptionsForField,
}) => {
    const [loading, setLoading] = useState(false);
    const [thisValue, setThisValue] = useState(form.values[field.field] || '');
    
    useEffect(() => {
        if(form.values[field.field]) {
            setThisValue(form.values[field.field]);
        }
        
        if (field.refField && form.values[field.field] && form.values[field.refField]) {
            const url = field.optionsUrl?.replace('{0}', String(form.values[field.refField]));
            if (url) {
                setLoading(true);
                fetch(url)
                    .then((res) => res.json())
                    .then((data: DropdownOption[]) => {
                        const formattedData = data.map((item) => ({
                            ...item,
                            value: String(item.value),
                        }));
                        setOptionsForField?.(field.field, formattedData);
                        
                    })
                    .finally(() => setLoading(false));
            }
        } else if (!field.refField && !field.options && field.optionsUrl) {
            setLoading(true);
            fetch(field.optionsUrl)
                .then((res) => res.json())
                .then((data: DropdownOption[]) => {
                    const formattedData = data.map((item) => ({
                        ...item,
                        value: String(item.value),
                    }));
                    setOptionsForField?.(field.field, formattedData);
                    console.log("field.field2", field.field);
                    if (field.field === "sector2") {
                        //form.initialize({ "sector2": "3" });
                        setThisValue(form.values[field.field] || '');
                    }
                })
                .finally(() => setLoading(false));
        }
    }, []);

    // Form state'inden ilgili alanın güncel değerini alıyoruz.
    const currentValue = form.values[field.field];

    return (
        <>
            <Select
                label={field.title}
                placeholder={field.placeholder || "Select an option"}
                data={options.map((item: DropdownOption) => ({
                    value: String(item.value),
                    label: item.label,
                }))}
                {...form.getInputProps(field.field)}
                value={thisValue}
                onChange={(val) => {
                  form.setFieldValue(field.field, val);
                  onDropdownChange?.(field.field, val || '');
                  setThisValue(val || '');
                }}
                error={form.errors[field.field]}
                required={field.required}
                //disabled={loading || (!!field.refField && !form.values[field.refField])}
                style={globalStyle ? globalStyle : undefined}
                allowDeselect={false}
                clearable={true}
                searchable
            />
            {loading && <Loader size="xs" mt={5} />}
        </>
    );
};

// MultiSelect için yeni bir bileşen oluşturuyoruz
const MultiSelectField: React.FC<DropdownFieldProps> = ({ field, form, globalStyle }) => {
    const [options, setOptions] = useState<DropdownOption[]>(field.options || []);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (field.options) {
            setOptions(field.options);
        } else if (field.optionsUrl) {
            setLoading(true);
            fetch(field.optionsUrl)
                .then((res) => res.json())
                .then((data: DropdownOption[]) => {
                    const formattedData = data.map(item => ({
                        ...item,
                        value: String(item.value)
                    }));
                    setOptions(formattedData);
                })
                .finally(() => setLoading(false));
        }
    }, [field.options, field.optionsUrl]);

    return (
        <>
            <MultiSelect
                label={field.title}
                placeholder={field.placeholder || "Select options"}
                data={options.map(item => ({ value: String(item.value), label: item.label }))}
                value={Array.isArray(form.values[field.field]) ? form.values[field.field].map(String) : []}
                onChange={(value) => form.setFieldValue(field.field, value)}
                error={form.errors[field.field]}
                required={field.required}
                disabled={loading}
                style={globalStyle ? globalStyle : undefined}
                searchable
            />
            {loading && <Loader size="xs" mt={5} />}
        </>
    );
};

/**
 * DynamicForm Bileşeni:
 * - JSON konfigürasyona göre form alanlarını oluşturur.
 * - useForm hook'unu uncontrolled mode'da kullanır.
 * - Form gönderildiğinde API çağrısı yapılır; yanıt başarılı ise onSuccess event'i tetiklenir.
 * - Submit ve Cancel butonları, dışarıdan detaylı buton ayarları ile kontrol edilebilir.
 */
const DynamicForm: React.FC<DynamicFormProps> = ({
    config,
    baseUrl,
    endpoint,
    initialData,
    onSuccess,
    submitButtonProps,
    cancelButtonProps,
}) => {
    // Form değerlerini takip etmek için state ekliyoruz
    const [formValues, setFormValues] = useState<Record<string, any>>({});
    const [dropdownOptions, setDropdownOptions] = useState<Record<string, DropdownOption[]>>({});

    // initialValues: Her field için başlangıç değeri belirleniyor.
    // Checkbox için false, date için null, diğerleri için boş string
    const initialValues: Record<string, any> = {};
    config.rows.forEach((row) => {
        row.columns.forEach((column) => {
            column.fields.forEach((field) => {
                if (initialData && initialData[field.field] !== undefined) {
                    // Number tipi için özel kontrol
                    if (field.type === 'number') {
                        initialValues[field.field] = Number(initialData[field.field]);
                    } else if (field.type === 'dropdown') {
                        initialValues[field.field] = String(initialData[field.field]);
                    } else {
                        initialValues[field.field] = initialData[field.field];
                    }
                } else {
                    if (field.type === 'checkbox') {
                        initialValues[field.field] = false;
                    } else if (field.type === 'date') {
                        initialValues[field.field] = null;
                    } else if (field.type === 'number') {
                        initialValues[field.field] = field.defaultValue || 0;
                    } else {
                        initialValues[field.field] = '';
                    }
                }
            });
        });
    });

    // validate: Zorunlu alanlar için validasyon fonksiyonları
    const validate: Record<string, (value: any) => string | null> = {};
    config.rows.forEach((row) => {
        row.columns.forEach((column) => {
            column.fields.forEach((field) => {
                if (field.required) {
                    if (field.type === 'checkbox') {
                        validate[field.field] = (value) => (value ? null : `${field.title} is required.`);
                    } else if (field.type === 'date') {
                        validate[field.field] = (value) => (value !== null ? null : `${field.title} is required.`);
                    } else {
                        validate[field.field] = (value) =>
                            value && value.toString().trim() !== '' ? null : `${field.title} is required.`;
                    }
                }
            });
        });
    });

    // useForm'u başlatırken transformValues ekleyelim
    const form = useForm({
        mode: 'uncontrolled',
        initialValues,
        validate,
        transformValues: (values) => {
            // Form gönderilirken _options ile biten alanları temizle
            const cleanedValues = { ...values };
            Object.keys(cleanedValues).forEach(key => {
                if (key.endsWith('_options')) {
                    delete cleanedValues[key];
                }
            });
            return cleanedValues;
        },
        onValuesChange: (values: Record<string, any>) => {
            setFormValues(values);
        }
    });

    // Form submit edildiğinde değerleri gönderiyoruz.
    const handleSubmit = form.onSubmit(async (values) => {
        try {
            const response = await fetch(`${baseUrl}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            const result = await response.json();
            // Beklenen response model: { data: any, message: string, code: string }
            if (response.ok) {
                if (onSuccess) {
                    onSuccess(result.data);
                }
            } else {
                notifications.show({
                    title: 'Hata',
                    message: result.message || 'Bir hata oluştu',
                    color: 'red'
                });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    });

    // Options güncelleme fonksiyonu
    const setOptionsForField = (fieldName: string, options: DropdownOption[]) => {
        setDropdownOptions(prev => ({
            ...prev,
            [fieldName]: options
        }));
    };

    // handleDropdownChange fonksiyonunu güncelle
    const handleDropdownChange = (fieldName: string, value: string | number) => {
        console.log(`Dropdown ${fieldName} changed to:`, value);

        config.rows.forEach(row => {
            row.columns.forEach(column => {
                column.fields.forEach(field => {
                    if (field.refField === fieldName) {
                        console.log(`Found dependent field: ${field.field}`);

                        if (field.type === 'dropdown' && field.optionsUrl) {
                            form.setFieldValue(field.field, '');
                            setOptionsForField(field.field, []);
                            field.options = [];

                            if (value) {
                                const url = field.optionsUrl.replace('{0}', String(value));
                                console.log(`Loading options for ${field.field} with URL:`, url);

                                fetch(url)
                                    .then(res => res.json())
                                    .then((data: DropdownOption[]) => {
                                        console.log(`Setting options for ${field.field}:`, data);
                                        setOptionsForField(field.field, data);
                                    })
                                    .catch(error => {
                                        console.error(`Error loading options for ${field.field}:`, error);
                                    });
                            }
                        }
                    }
                });
            });
        });
    };

    // Eğer cancelButtonProps veya submitButtonProps tanımlı değilse boş obje oluşturuyoruz.
    const cancelProps = cancelButtonProps || {};
    const submitProps = submitButtonProps || {};

    return (
        <MantineProvider>
            <Notifications />
            <form onSubmit={handleSubmit}>
                {config.rows.map((row, rowIndex) => (
                    <div key={rowIndex} style={{ marginBottom: '2rem' }}>
                        {row.title && (
                            <Text size="lg" mb="sm" style={row.headerStyle}>
                                {row.title}
                            </Text>
                        )}
                        <Grid gutter="md">
                            {row.columns.map((column, colIndex) => (
                                <Grid.Col
                                    key={colIndex}
                                    // Eğer column.span tanımlıysa onu, tanımlı değilse 12 / row.columns.length hesaplamasını kullan.
                                    span={column.span ?? (12 / row.columns.length)}
                                >
                                    {column.fields.map((field, fieldIndex) => (
                                        <div key={fieldIndex} style={{ marginBottom: '1rem' }}>
                                            {field.type === 'textbox' && (
                                                <TextInput
                                                    label={field.title}
                                                    placeholder={field.placeholder || field.title}
                                                    {...form.getInputProps(field.field)}
                                                    required={field.required}
                                                    maxLength={field.maxLength}
                                                    style={config.fieldStyle ? config.fieldStyle : undefined}
                                                />
                                            )}
                                            {field.type === 'textarea' && (
                                                <Textarea
                                                    label={field.title}
                                                    placeholder={field.placeholder || field.title}
                                                    {...form.getInputProps(field.field)}
                                                    required={field.required}
                                                    maxLength={field.maxLength}
                                                    autosize={field.autosize ?? undefined}
                                                    minRows={field.minRows ?? 1}
                                                    maxRows={field.maxRows ?? 2}
                                                    style={config.fieldStyle ? config.fieldStyle : undefined}
                                                />
                                            )}
                                            {field.type === 'date' && (
                                                <DatePickerInput
                                                    label={field.title}
                                                    placeholder={field.placeholder || field.title}
                                                    value={form.values[field.field]}
                                                    onChange={(value) => form.setFieldValue(field.field, value)}
                                                    required={field.required}
                                                    error={form.errors[field.field]}
                                                    style={config.fieldStyle ? config.fieldStyle : undefined}
                                                />
                                            )}
                                            {field.type === 'checkbox' && (
                                                <Checkbox
                                                    label={field.title}
                                                    {...form.getInputProps(field.field, { type: 'checkbox' })}
                                                // Checkbox bileşeninde style uygulanması opsiyonel olabilir;
                                                // istenirse ekleyebilirsiniz.
                                                />
                                            )}
                                            {field.type === 'dropdown' && (
                                                <DropdownField
                                                    field={field}
                                                    form={form}
                                                    globalStyle={config.fieldStyle}
                                                    onDropdownChange={handleDropdownChange}
                                                    options={dropdownOptions[field.field] || field.options || []}
                                                    setOptionsForField={setOptionsForField}
                                                />
                                            )}
                                            {field.type === 'maskinput' && (
                                                <InputBase
                                                    label={field.title}
                                                    placeholder={field.placeholder || field.title}
                                                    component={IMaskInput}
                                                    mask={field.mask || ''}
                                                    {...form.getInputProps(field.field)}
                                                    required={field.required}
                                                    style={config.fieldStyle ? config.fieldStyle : undefined}
                                                />
                                            )}
                                            {field.type === 'number' && (
                                                <NumberInput
                                                    required={field.required}
                                                    min={field.min}
                                                    max={field.max}
                                                    step={field.step}
                                                    prefix={field.prefix}
                                                    suffix={field.suffix}
                                                    defaultValue={field.defaultValue}
                                                    label={field.title}
                                                    placeholder={field.placeholder}
                                                    value={form.values[field.field]}
                                                    onChange={(val) => {
                                                        form.setFieldValue(field.field, val !== '' ? Number(val) : null);
                                                    }}
                                                    error={form.errors[field.field]}
                                                    thousandSeparator={field.thousandSeparator || ','}
                                                    decimalSeparator={field.decimalSeparator || '.'}
                                                />
                                            )}
                                            {field.type === 'switch' && (
                                                <Switch
                                                    label={field.title}
                                                    {...form.getInputProps(field.field, { type: 'checkbox' })}
                                                    defaultChecked={field.defaultChecked}
                                                    style={config.fieldStyle ? config.fieldStyle : undefined}
                                                />
                                            )}
                                            {field.type === 'multiselect' && (
                                                <MultiSelectField
                                                    field={field}
                                                    form={form}
                                                    globalStyle={config.fieldStyle}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </Grid.Col>
                            ))}
                        </Grid>
                    </div>
                ))}
                <Group>
                    <Button
                        type="button"
                        {...cancelProps}
                        onClick={(event) => {
                            form.reset();
                            cancelProps.onClick && cancelProps.onClick(event);
                        }}
                    >
                        {cancelProps.children || 'Cancel'}
                    </Button>
                    <Button type="submit" {...submitProps}>
                        {submitProps.children || 'Save'}
                    </Button>
                </Group>

                {/* Debug alanı */}
                <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    <Text size="sm" mb={8}>Debug - Form Values:</Text>
                    <pre style={{ margin: 0 }}>
                        {JSON.stringify(formValues, null, 2)}
                    </pre>
                </div>
            </form>
        </MantineProvider>
    );
};

export default DynamicForm;