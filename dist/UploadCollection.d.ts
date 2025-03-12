import React from 'react';
import { useForm } from '@mantine/form';
export interface UploadCollectionProps {
    field: {
        field: string;
        title: string;
        required?: boolean;
        uploadUrl?: string;
        maxSize?: number;
        acceptedFileTypes?: string[];
        width?: number | string;
        height?: number;
        uploadContext?: string;
        maxImages?: number;
    };
    form: ReturnType<typeof useForm>;
    globalStyle?: React.CSSProperties;
    getHeaders?: () => Record<string, string>;
    baseUrl?: string;
}
declare const UploadCollection: React.FC<UploadCollectionProps>;
export default UploadCollection;
