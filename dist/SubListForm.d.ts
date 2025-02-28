import React from 'react';
import { useForm } from '@mantine/form';
import { FormConfig } from './DynamicForm';
export interface SubListFormProps {
    field: {
        field: string;
        title: string;
        buttonTitle?: string;
        buttonIcon?: string;
        required?: boolean;
        subform: FormConfig;
        size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
        columns?: {
            key: string;
            title: string;
        }[];
    };
    form: ReturnType<typeof useForm>;
    globalStyle?: React.CSSProperties;
    baseUrl: string;
}
declare const SubListForm: React.FC<SubListFormProps>;
export default SubListForm;
