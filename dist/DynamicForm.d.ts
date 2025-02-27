import React from 'react';
import { ButtonProps } from '@mantine/core';
import { useForm } from '@mantine/form';
import '@mantine/dates/styles.css';
export type FieldType = 'textbox' | 'textarea' | 'date' | 'checkbox' | 'dropdown' | 'maskinput' | 'number' | 'switch' | 'multiselect' | 'upload' | 'uploadcollection' | 'tree';
export interface FieldConfig {
    field: string;
    title: string;
    type: FieldType;
    required?: boolean;
    maxLength?: number;
    placeholder?: string;
    mask?: string;
    minRows?: number;
    maxRows?: number;
    autosize?: boolean;
    optionsUrl?: string;
    options?: {
        value: string;
        label: string;
    }[];
    min?: number;
    max?: number;
    step?: number;
    prefix?: string;
    suffix?: string;
    defaultValue?: number;
    decimalSeparator?: string;
    thousandSeparator?: string;
    defaultChecked?: boolean;
    refField?: string;
    uploadUrl?: string;
    maxSize?: number;
    acceptedFileTypes?: string[];
    imageWidth?: number;
    imageHeight?: number;
    uploadContext?: string;
    levelOffset?: number;
}
export interface ColumnConfig {
    span?: number;
    fields: FieldConfig[];
}
export interface RowConfig {
    title?: string;
    headerStyle?: React.CSSProperties;
    columns: ColumnConfig[];
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
    submitButtonProps?: Partial<ButtonProps & {
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    }>;
    cancelButtonProps?: Partial<ButtonProps & {
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    }>;
    useToken?: boolean;
    showDebug?: boolean;
    pk_field?: string;
}
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
    getHeaders?: () => Record<string, string>;
}
/**
 * DynamicForm Bileşeni:
 * - JSON konfigürasyona göre form alanlarını oluşturur.
 * - useForm hook'unu uncontrolled mode'da kullanır.
 * - Form gönderildiğinde API çağrısı yapılır; yanıt başarılı ise onSuccess event'i tetiklenir.
 * - Submit ve Cancel butonları, dışarıdan detaylı buton ayarları ile kontrol edilebilir.
 */
declare const DynamicForm: React.FC<DynamicFormProps>;
export default DynamicForm;
