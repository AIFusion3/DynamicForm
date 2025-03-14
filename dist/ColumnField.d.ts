import React from 'react';
import { useForm } from '@mantine/form';
import { FieldType, ChangeToConfig } from './DynamicForm';
export interface ColumnNode {
    label: string;
    value: string;
    children?: ColumnNode[];
}
export interface ColumnFieldProps {
    field: {
        field: string;
        title: string;
        type: FieldType;
        required?: boolean;
        optionsUrl?: string;
        options?: ColumnNode[];
        columnWidth?: number;
        columnHeight?: number;
        border?: string;
        borderRadius?: number;
        backgroundColor?: string;
        hoverColor?: string;
        selectedColor?: string;
        fontSize?: number;
        changeto?: ChangeToConfig[];
    };
    form: ReturnType<typeof useForm>;
    getHeaders?: () => Record<string, string>;
    handleFieldChange?: (fieldName: string, value: any) => void;
    baseUrl?: string;
}
export declare const ColumnField: React.FC<ColumnFieldProps>;
export default ColumnField;
