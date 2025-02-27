import React from 'react';
import { useForm } from '@mantine/form';
import { FieldType } from './DynamicForm';
export interface TreeNode {
    value: string;
    label: string;
    children?: TreeNode[];
}
export interface TreeFieldProps {
    field: {
        field: string;
        title: string;
        type: FieldType;
        required?: boolean;
        optionsUrl?: string;
        options?: TreeNode[];
        levelOffset?: number;
    };
    form: ReturnType<typeof useForm>;
    globalStyle?: React.CSSProperties;
    getHeaders?: () => Record<string, string>;
}
declare const TreeField: React.FC<TreeFieldProps>;
export default TreeField;
