import React from 'react';
import { useForm } from '@mantine/form';
interface TreeNode {
    value: string;
    label: string;
    children?: TreeNode[];
    level?: number;
}
interface TreeFieldProps {
    field: {
        field: string;
        title: string;
        required?: boolean;
        optionsUrl?: string;
        options?: TreeNode[];
        levelOffset?: number;
        is_dropdown?: boolean;
    };
    form: ReturnType<typeof useForm>;
    globalStyle?: React.CSSProperties;
    getHeaders?: () => Record<string, string>;
    baseUrl?: string;
}
declare const TreeField: React.FC<TreeFieldProps>;
export default TreeField;
