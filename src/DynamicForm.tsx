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
    SegmentedControl,
    MantineColor
} from '@mantine/core';
import { DatePickerInput, DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { MantineProvider } from '@mantine/core';
import '@mantine/dates/styles.css';
import { IMaskInput } from 'react-imask';
import { notifications, Notifications } from '@mantine/notifications';
import DropField from './DropField';
import UploadCollection from './UploadCollection';
import TreeField from './Tree';
import SubListForm from './SubListForm';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import '@mantine/tiptap/styles.css';
import 'dayjs/locale/tr';
import ColumnField from './ColumnField';

// Supported field types
export type FieldType = 'textbox' | 'textarea' | 'date' | 'checkbox' | 'dropdown' | 'maskinput' | 'number' | 'switch' | 'multiselect' | 'upload' | 'uploadcollection' | 'tree' | 'sublistform' | 'htmleditor' | 'datetime' | 'segmentedcontrol' | 'columnfield' | 'refresh';

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
    // Properties for upload field
    uploadUrl?: string;  // URL to upload files
    maxSize?: number;  // Maximum file size in bytes
    acceptedFileTypes?: string[];  // Accepted file types
    imageWidth?: number;  // Width for image preview
    imageHeight?: number;  // Height for image preview
    uploadContext?: string;  // İsteğe bağlı upload context parametresi
    // Tree field için özellikler
    levelOffset?: number; // Tree level offset
    // SubListForm için özellikler - sadece sublistform tipi için geçerli
    subform?: FormConfig;
    buttonTitle?: string;
    columns?: { key: string; title: string }[];
    isDetail?: boolean; // Detay görünümü için yeni prop
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    editorHeight?: number;
    valueFormat?: string;
    // SegmentedControl için özel proplar
    color?: MantineColor;
    radius?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
    orientation?: 'horizontal' | 'vertical';
    is_dropdown?: boolean;  // Tree bileşeni için dropdown modu
    changeto?: ChangeToConfig[];  // Yeni özellik
    refreshMessage?: string;  // Refresh field için özel mesaj
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


export interface FormConfig {
    fieldStyle?: React.CSSProperties;
    rows: RowConfig[];
}

export interface DynamicFormProps {
    config: FormConfig;      
    baseUrl: string;         
    endpoint: string;        
    initialData?: Record<string, any>;
    onSuccess?: (data: any) => void;
    submitButtonProps?: Partial<ButtonProps & { onClick: (event: React.MouseEvent<HTMLButtonElement>) => void }>;
    cancelButtonProps?: Partial<ButtonProps & { onClick: (event: React.MouseEvent<HTMLButtonElement>) => void }>;
    useToken?: boolean;
    showDebug?: boolean;
    pk_field?: string;
    noSubmit?: boolean; // API'ye submit etmeden form değerlerini döndürmek için
    noForm?: boolean; // Form elementini tamamen kaldır
    hiddenCancel?: boolean;
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
    getHeaders?: () => Record<string, string>;  // Yeni prop
}

const DropdownField: React.FC<DropdownFieldProps> = ({
    field,
    form,
    globalStyle,
    onDropdownChange,
    options = [],
    setOptionsForField,
    getHeaders
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
                fetch(url, {
                    method: 'GET',
                    headers: getHeaders?.() || { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    mode: 'cors'
                })
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
            fetch(field.optionsUrl, {
                method: 'GET',
                headers: getHeaders?.() || { 'Content-Type': 'application/json' },
                credentials: 'include',
                mode: 'cors'
            })
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
                    // Seçilen öğenin title değerini ayrı bir alana kaydet
                    const selectedOption = options.find(opt => String(opt.value) === val);
                    if (selectedOption) {
                        form.setFieldValue(field.field + "__title", selectedOption.label);
                    } else {
                        form.setFieldValue(field.field + "__title", '');
                    }
                    onDropdownChange?.(field.field, val || '');
                    setThisValue(val || '');
                }}
                error={form.errors[field.field]}
                required={field.required}
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
const MultiSelectField: React.FC<DropdownFieldProps> = ({ 
    field, 
    form, 
    globalStyle,
    getHeaders 
}) => {
    const [options, setOptions] = useState<DropdownOption[]>(field.options || []);
    const [loading, setLoading] = useState(false);
    const [selectedValues, setSelectedValues] = useState<string[]>(
        Array.isArray(form.values[field.field]) ? form.values[field.field].map(String) : []
    );

    useEffect(() => {
        if (field.options) {
            setOptions(field.options);
        } else if (field.optionsUrl) {
            setLoading(true);
            fetch(field.optionsUrl, {
                method: 'GET',
                headers: getHeaders?.() || { 'Content-Type': 'application/json' },
                credentials: 'include',
                mode: 'cors'
            })
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
    }, []);

    useEffect(() => {
        if (form.values[field.field]) {
            setSelectedValues(
                Array.isArray(form.values[field.field]) ? form.values[field.field].map(String) : []
            );
        }
    }, [form.values[field.field]]);

    const handleValueChange = (value: string[]) => {
        setSelectedValues(value);
        form.setFieldValue(field.field, value);
    };

    return (
        <>
            <MultiSelect
                label={field.title}
                placeholder={field.placeholder || "Select options"}
                data={options.map(item => ({ value: String(item.value), label: item.label }))}
                value={selectedValues}
                onChange={handleValueChange}
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

// HTMLEditor bileşenini oluşturalım
const HTMLEditorField: React.FC<{
    field: FieldConfig;
    form: ReturnType<typeof useForm>;
    globalStyle?: React.CSSProperties;
}> = ({ field, form, globalStyle }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link,
        ],
        content: form.values[field.field] || '',
        onUpdate: ({ editor }) => {
            form.setFieldValue(field.field, editor.getHTML());
        },
    });

    return (
        <div style={globalStyle}>
            <Text size="sm" fw={500} mb={5}>
                {field.title} {field.required && <span style={{ color: 'red' }}>*</span>}
            </Text>
            <RichTextEditor editor={editor} style={{ minHeight:field.editorHeight }}>
                <RichTextEditor.Toolbar sticky stickyOffset={60}>
                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Bold />
                        <RichTextEditor.Italic />
                        <RichTextEditor.Underline />
                        <RichTextEditor.Strikethrough />
                        <RichTextEditor.ClearFormatting />
                        <RichTextEditor.Code />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.H1 />
                        <RichTextEditor.H2 />
                        <RichTextEditor.H3 />
                        <RichTextEditor.H4 />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Blockquote />
                        <RichTextEditor.Hr />
                        <RichTextEditor.BulletList />
                        <RichTextEditor.OrderedList />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Link />
                        <RichTextEditor.Unlink />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.AlignLeft />
                        <RichTextEditor.AlignCenter />
                        <RichTextEditor.AlignRight />
                    </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>

                <RichTextEditor.Content />
            </RichTextEditor>
            {form.errors[field.field] && (
                <Text size="xs" color="red" mt={5}>
                    {form.errors[field.field]}
                </Text>
            )}
        </div>
    );
};

// SegmentedControlField bileşenini oluşturuyoruz
const SegmentedControlField: React.FC<DropdownFieldProps> = ({
    field,
    form,
    globalStyle,
    onDropdownChange,
    options = [],
    setOptionsForField,
    getHeaders
}) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (field.optionsUrl) {
            setLoading(true);
            fetch(field.optionsUrl, {
                method: 'GET',
                headers: getHeaders?.() || { 'Content-Type': 'application/json' },
                credentials: 'include',
                mode: 'cors'
            })
                .then((res) => res.json())
                .then((data: DropdownOption[]) => {
                    const formattedData = data.map((item) => ({
                        ...item,
                        value: String(item.value),
                    }));
                    setOptionsForField?.(field.field, formattedData);
                })
                .catch(error => {
                    console.error(`Error loading options for ${field.field}:`, error);
                })
                .finally(() => setLoading(false));
        }
    }, []);

    return (
        <>
            <Text size="sm" fw={500} mb={5}>
                {field.title} {field.required && <span style={{ color: 'red' }}>*</span>}
            </Text>
            <SegmentedControl
                {...form.getInputProps(field.field)}
                onChange={(value) => {
                    form.setFieldValue(field.field, value);
                    const selectedOption = options.find(opt => String(opt.value) === value);
                    if (selectedOption) {
                        form.setFieldValue(field.field + "__title", selectedOption.label);
                    }
                    onDropdownChange?.(field.field, value);
                }}
                data={options.map((item) => ({
                    value: String(item.value),
                    label: item.label
                }))}
                color={field.color}
                radius={field.radius}
                size={field.size}
                fullWidth={field.fullWidth}
                orientation={field.orientation}
                style={globalStyle ? globalStyle : undefined}
            />
            {loading && <Loader size="xs" mt={5} />}
            {form.errors[field.field] && (
                <Text size="xs" color="red" mt={5}>
                    {form.errors[field.field]}
                </Text>
            )}
        </>
    );
};

// Switch için özel bileşen oluşturuyoruz
const SwitchField: React.FC<{
    field: FieldConfig;
    form: ReturnType<typeof useForm>;
    globalStyle?: React.CSSProperties;
}> = ({ field, form, globalStyle }) => {
    const [isChecked, setIsChecked] = useState(() => {
        const initialValue = form.values[field.field];
        console.log('Switch Initial Value:', {
            field: field.field,
            value: initialValue,
            type: typeof initialValue
        });
        return Boolean(initialValue);
    });

    useEffect(() => {
        const formValue = form.values[field.field];
        setIsChecked(Boolean(formValue));
    }, [form.values[field.field]]);

    return (
        <Switch
            label={field.title}
            checked={isChecked}
            onChange={(event) => {
                const newValue = event.currentTarget.checked;
                setIsChecked(newValue);
                form.setFieldValue(field.field, newValue);
            }}
            style={globalStyle ? globalStyle : undefined}
        />
    );
};

export interface ChangeToConfig {
    target: string;     // Hedef field adı
    updateurl: string;  // API URL
}

const RefreshField: React.FC<{
    field: FieldConfig;
    form: ReturnType<typeof useForm>;
    globalStyle?: React.CSSProperties;
}> = ({ field, form, globalStyle }) => {
    return (
        <div style={{ ...globalStyle }}>
            <Text size="sm" fw={500} style={{ marginBottom: 5 }}>
                {field.title} {field.required && <span style={{ color: 'red' }}>*</span>}
            </Text>
            <Text size="xs" c="dimmed">
                {field.refreshMessage || "Bu alan diğer alanların değişimine göre güncellenecektir."}
            </Text>
        </div>
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
    useToken = false,
    showDebug = false,
    pk_field,
    noSubmit = false,
    noForm = false,
    hiddenCancel = false
}) => {
    // Form değerlerini takip etmek için state ekliyoruz
    const [formValues, setFormValues] = useState<Record<string, any>>({});
    const [dropdownOptions, setDropdownOptions] = useState<Record<string, DropdownOption[]>>({});

    // initialValues: Her field için başlangıç değeri belirleniyor.
    const initialValues: Record<string, any> = {};
    config.rows.forEach((row) => {
        row.columns.forEach((column) => {
            column.fields.forEach((field) => {
                if (initialData && initialData[field.field] !== undefined) {
                    if (field.type === 'number') {
                        initialValues[field.field] = Number(initialData[field.field]);
                    } else if (field.type === 'dropdown') {
                        initialValues[field.field] = String(initialData[field.field]);
                        
                        // __title alanını initialData'dan al
                        const titleField = field.field + "__title";
                        if (initialData[titleField] !== undefined) {
                            initialValues[titleField] = initialData[titleField];
                        }
                    } else if (field.type === 'segmentedcontrol') {
                        initialValues[field.field] = String(initialData[field.field]);
                        
                        // __title alanını initialData'dan al
                        const titleField = field.field + "__title";
                        if (initialData[titleField] !== undefined) {
                            initialValues[titleField] = initialData[titleField];
                        }
                    } else if (field.type === 'tree') {
                        initialValues[field.field] = Array.isArray(initialData[field.field]) 
                            ? initialData[field.field] 
                            : [initialData[field.field]].filter(Boolean);
                        
                        // __title alanını initialData'dan al
                        const titleField = field.field + "__title";
                        if (initialData[titleField] !== undefined) {
                            initialValues[titleField] = initialData[titleField];
                        }
                    } else if (field.type === 'switch') {
                        initialValues[field.field] = Boolean(initialData[field.field]);
                    } else if (field.type === 'multiselect') {
                        initialValues[field.field] = Array.isArray(initialData[field.field]) 
                            ? initialData[field.field] 
                            : [initialData[field.field]].filter(Boolean);
                    } else {
                        initialValues[field.field] = initialData[field.field];
                    }
                } else {
                    if (field.type === 'checkbox' || field.type === 'switch') {
                        initialValues[field.field] = false;
                    } else if (field.type === 'date' || field.type === 'datetime') {
                        initialValues[field.field] = null;
                    } else if (field.type === 'number') {
                        initialValues[field.field] = field.defaultValue || 0;
                    } else if (field.type === 'multiselect' || field.type === 'tree') {
                        initialValues[field.field] = [];
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

    // Helper function to get headers
    const getHeaders = () => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };

        if (useToken) {
            const token = localStorage.getItem('token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            } else {
                console.warn('Token required but not found in localStorage');
            }
        }

        console.log('Request Headers:', headers); // Debug için
        return headers;
    };

    // Form submit edildiğinde değerleri gönderiyoruz.
    const handleSubmit = form.onSubmit(async (values) => {
        // Form değerlerini kopyala
        const formData = { ...values };
        
        // Eksik __title alanlarını tamamla
        config.rows.forEach((row) => {
            row.columns.forEach((column) => {
                column.fields.forEach((field) => {
                    // Dropdown, SegmentedControl ve Tree için __title alanlarını kontrol et
                    if ((field.type === 'dropdown' || field.type === 'segmentedcontrol' || field.type === 'tree') && 
                        formData[field.field] && 
                        formData[field.field + "__title"] === undefined) {
                        
                        // Dropdown ve SegmentedControl için
                        if (field.type === 'dropdown' || field.type === 'segmentedcontrol') {
                            const options = dropdownOptions[field.field] || [];
                            const selectedOption = options.find(opt => String(opt.value) === String(formData[field.field]));
                            if (selectedOption) {
                                formData[field.field + "__title"] = selectedOption.label;
                            }
                        }
                        
                        // Tree için (is_dropdown modunda)
                        if (field.type === 'tree' && field.is_dropdown && Array.isArray(formData[field.field]) && formData[field.field].length > 0) {
                            const treeData = dropdownOptions[field.field] || [];
                            const findNode = (value: string, nodes: any[]): any => {
                                for (const node of nodes) {
                                    if (String(node.value) === String(value)) return node;
                                    if (node.children) {
                                        const found = findNode(value, node.children);
                                        if (found) return found;
                                    }
                                }
                                return null;
                            };
                            
                            const selectedNode = findNode(formData[field.field][0], treeData);
                            if (selectedNode) {
                                formData[field.field + "__title"] = selectedNode.label;
                            }
                        }
                    }
                });
            });
        });
        
        // noSubmit true ise, API çağrısı yapmadan direkt olarak form değerlerini döndür
        if (noSubmit) {
            if (onSuccess) {
                onSuccess(formData);
            }
            return;
        }

        try {
            const requestHeaders = getHeaders();
            
            // pk_field kontrolü
            const isPutRequest = pk_field && initialData && initialData[pk_field];
            console.log("isPutRequest----->", isPutRequest);
            const method = isPutRequest ? 'PUT' : 'POST';
            const url = isPutRequest 
                ? `${baseUrl}/${endpoint}/${initialData[pk_field]}`
                : `${baseUrl}/${endpoint}`;

            const response = await fetch(url, {
                method,
                headers: requestHeaders,
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify(formData),
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

    // Eğer cancelButtonProps veya submitButtonProps tanımlı değilse boş obje oluşturuyoruz.
    const cancelProps = cancelButtonProps || {};
    const submitProps = submitButtonProps || {};

    // Form içeriğini render eden fonksiyon
    const renderFormContent = () => (
        <>
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
                                                valueFormat={field.valueFormat || "DD.MM.YYYY"}
                                                locale="tr"
                                            />
                                        )}
                                        {field.type === 'datetime' && (
                                            <DateTimePicker
                                                label={field.title}
                                                placeholder={field.placeholder || field.title}
                                                value={form.values[field.field]}
                                                onChange={(value) => form.setFieldValue(field.field, value)}
                                                required={field.required}
                                                error={form.errors[field.field]}
                                                style={config.fieldStyle ? config.fieldStyle : undefined}
                                                valueFormat={field.valueFormat || "DD.MM.YYYY HH:mm"}
                                                locale="tr"
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
                                                getHeaders={getHeaders}
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
                                            <SwitchField
                                                field={field}
                                                form={form}
                                                globalStyle={config.fieldStyle}
                                            />
                                        )}
                                        {field.type === 'multiselect' && (
                                            <MultiSelectField
                                                field={field}
                                                form={form}
                                                globalStyle={config.fieldStyle}
                                                getHeaders={getHeaders}
                                            />
                                        )}
                                        {field.type === 'upload' && (
                                            <DropField
                                                field={field}
                                                form={form}
                                                globalStyle={config.fieldStyle}
                                                getHeaders={getHeaders}
                                            />
                                        )}
                                        {field.type === 'uploadcollection' && (
                                            <UploadCollection
                                                field={field}
                                                form={form}
                                                globalStyle={config.fieldStyle}
                                                getHeaders={getHeaders}
                                            />
                                        )}
                                        {field.type === 'tree' && (
                                            <TreeField
                                                field={field}
                                                form={form}
                                                globalStyle={config.fieldStyle}
                                                getHeaders={getHeaders}
                                            />
                                        )}
                                        {field.type === 'sublistform' && 'subform' in field && field.subform && (
                                            <SubListForm
                                                field={field as any}
                                                form={form}
                                                globalStyle={config.fieldStyle}
                                                baseUrl={baseUrl}
                                            />
                                        )}
                                        {field.type === 'htmleditor' && (
                                            <HTMLEditorField
                                                field={field}
                                                form={form}
                                                globalStyle={config.fieldStyle}
                                            />
                                        )}
                                        {field.type === 'segmentedcontrol' && (
                                            <SegmentedControlField
                                                field={field}
                                                form={form}
                                                globalStyle={config.fieldStyle}
                                                onDropdownChange={handleDropdownChange}
                                                options={dropdownOptions[field.field] || field.options || []}
                                                setOptionsForField={setOptionsForField}
                                                getHeaders={getHeaders}
                                            />
                                        )}
                                        {field.type === 'columnfield' && (
                                            <ColumnField
                                                field={field}
                                                form={form}
                                                getHeaders={getHeaders}
                                                handleFieldChange={handleFieldChange} 
                                            />
                                        )}
                                        {field.type === 'refresh' && (
                                            <RefreshField
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
                {!hiddenCancel && (
                    <Button
                        type="button" variant="outline"
                        {...cancelProps}
                        onClick={(event) => {
                            form.reset();
                            cancelProps.onClick && cancelProps.onClick(event);
                        }}
                    >
                        {cancelProps.children || 'İptal'}
                    </Button>
                )}
                <Button 
                    type={noForm ? "button" : "submit"} 
                    {...submitProps}
                    onClick={(event) => {
                        if (noForm) {
                            // Form elementi yoksa manuel validation yap
                            const validationResult = form.validate();
                            
                            if (!validationResult.hasErrors) {
                                // Validation başarılıysa ve noSubmit=true ise
                                // form değerlerini doğrudan onSuccess'e gönder
                                if (noSubmit && onSuccess) {
                                    console.log("Manuel submit: değerler gönderiliyor", form.getValues());
                                    onSuccess(form.getValues());
                                } 
                                // Normal API submit
                                else if (!noSubmit) {
                                    handleSubmit(new Event('submit') as any);
                                }
                            }
                        }
                        
                        // Dışarıdan verilen onClick varsa çalıştır
                        if (submitProps.onClick) {
                            submitProps.onClick(event);
                        }
                    }}
                >
                    {submitProps.children || 'Save'}
                </Button>
            </Group>

            {showDebug === true && (
                <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    <Text size="sm" mb={8}>Debug - Form Values:</Text>
                    <pre style={{ margin: 0 }}>
                        {JSON.stringify(formValues, null, 2)}
                    </pre>
                </div>
            )}
        </>
    );

    // Options güncelleme fonksiyonu
    const setOptionsForField = (fieldName: string, options: DropdownOption[]) => {
        setDropdownOptions(prev => ({
            ...prev,
            [fieldName]: options
        }));
    };

    // handleDropdownChange fonksiyonunu güncelle
    const handleDropdownChange = (fieldName: string, value: string | number) => {
        config.rows.forEach(row => {
            row.columns.forEach(column => {
                column.fields.forEach(field => {
                    if (field.refField === fieldName) {
                        if (field.type === 'dropdown' && field.optionsUrl) {
                            form.setFieldValue(field.field, '');
                            setOptionsForField(field.field, []);
                            field.options = [];

                            if (value) {
                                const url = field.optionsUrl.replace('{0}', String(value));
                                const requestHeaders = getHeaders();
                                
                                fetch(url, {
                                    method: 'GET',
                                    headers: requestHeaders,
                                    credentials: 'include',
                                    mode: 'cors'
                                })
                                    .then(res => res.json())
                                    .then((data: DropdownOption[]) => {
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

    // DynamicForm bileşeni içinde, diğer fonksiyonların yanına
    const handleFieldChange = async (fieldName: string, value: any) => {
        console.log("handleFieldChange", fieldName, value);
        // Tüm fieldları kontrol et
        config.rows.forEach(row => {
            row.columns.forEach(column => {
                column.fields.forEach(async (field) => {
                    // changeto özelliği olan field'ı bul
                    if (field.field === fieldName && field.changeto && field.changeto.length > 0) {
                        // Mevcut form değerlerini al
                        const currentFormValues = form.getValues();
                        
                        // Her bir changeto hedefi için işlem yap
                        for (const changeConfig of field.changeto) {
                            try {
                                // API isteği gönder
                                const response = await fetch(changeConfig.updateurl, {
                                    method: 'POST',
                                    headers: getHeaders(),
                                    body: JSON.stringify(currentFormValues)
                                });
                                
                                const result = await response.json();
                                
                                if (result && result.data) {
                                    // Hedef field'ı bul ve güncelle
                                    config.rows.forEach(r => {
                                        r.columns.forEach(c => {
                                            c.fields.forEach((f, index) => {
                                                if (f.field === changeConfig.target) {

                                                    if (initialData && initialData[f.field] !== undefined) {
                                                        form.setFieldValue(f.field, initialData[f.field]);
                                                    } else {
                                                        form.setFieldValue(f.field, null);
                                                    }
                                                    c.fields[index] = {
                                                        ...result.data,
                                                        field: f.field  
                                                    };
                                                    setFormValues({...form.values});
                                                }
                                            });
                                        });
                                    });
                                } else {
                                    // Hatalı response veya data field yoksa
                                    config.rows.forEach(r => {
                                        r.columns.forEach(c => {
                                            c.fields.forEach((f, index) => {
                                                if (f.field === changeConfig.target) {
                                                    // Field'ı refresh field olarak güncelle
                                                    c.fields[index] = {
                                                        ...f,
                                                        type: 'refresh',
                                                        field: f.field
                                                    };
                                                    
                                                    // initialData'da değer varsa onu kullan, yoksa sıfırla
                                                    if (initialData && initialData[f.field] !== undefined) {
                                                        form.setFieldValue(f.field, initialData[f.field]);
                                                    } else {
                                                        // Field tipine göre sıfırlama
                                                        if (f.type === 'number') {
                                                            form.setFieldValue(f.field, 0);
                                                        } else if (f.type === 'checkbox' || f.type === 'switch') {
                                                            form.setFieldValue(f.field, false);
                                                        } else if (f.type === 'multiselect' || f.type === 'tree') {
                                                            form.setFieldValue(f.field, []);
                                                        } else if (f.type === 'date' || f.type === 'datetime') {
                                                            form.setFieldValue(f.field, null);
                                                        } else {
                                                            form.setFieldValue(f.field, '');
                                                        }
                                                    }
                                                    
                                                    // Formu yeniden render etmek için state'i güncelle
                                                    setFormValues({...form.values});
                                                }
                                            });
                                        });
                                    });
                                }
                            } catch (error) {
                                console.error('Field güncelleme hatası:', error);
                            }
                        }
                    }
                });
            });
        });
    };

    return (
        <MantineProvider>
            <Notifications />
            {noForm ? (
                // Form elementi OLMADAN içeriği render et
                <div className="dynamic-form-content">
                    {renderFormContent()}
                </div>
            ) : (
                // Normal form elementi ile
                <form onSubmit={handleSubmit}>
                    {renderFormContent()}
                </form>
            )}
        </MantineProvider>
    );
};

export default DynamicForm;