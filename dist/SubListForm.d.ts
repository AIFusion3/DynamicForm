import React from 'react';
import { useForm } from '@mantine/form';
import { FormConfig } from './DynamicForm';
interface SubColumn {
    key: string;
    title: string;
}
interface Column {
    key: string;
    title: string;
    type?: 'json';
    subColumns?: SubColumn[];
}
export interface SubListFormProps {
    field: {
        field: string;
        title: string;
        buttonTitle?: string;
        buttonIcon?: string;
        required?: boolean;
        subform: FormConfig;
        size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
        columns?: Column[];
    };
    form: ReturnType<typeof useForm>;
    globalStyle?: React.CSSProperties;
    baseUrl: string;
}
declare const SubListForm: React.FC<SubListFormProps>;
export default SubListForm;
