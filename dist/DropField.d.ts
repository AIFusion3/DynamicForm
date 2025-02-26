import React from 'react';
import { useForm } from '@mantine/form';
export interface DropFieldProps {
    field: {
        field: string;
        title: string;
        required?: boolean;
        uploadUrl?: string;
        maxSize?: number;
        acceptedFileTypes?: string[];
        imageWidth?: number;
        imageHeight?: number;
        uploadContext?: string;
    };
    form: ReturnType<typeof useForm>;
    globalStyle?: React.CSSProperties;
    getHeaders?: () => Record<string, string>;
}
declare const DropField: React.FC<DropFieldProps>;
export default DropField;
