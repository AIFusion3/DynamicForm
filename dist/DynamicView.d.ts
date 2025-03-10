import React from 'react';
import { MantineSize } from '@mantine/core';
export type ViewFieldType = 'text' | 'date' | 'datetime' | 'image' | 'file' | 'gallery' | 'html' | 'number' | 'boolean' | 'table';
export interface ViewFieldConfig {
    field: string;
    title: string;
    type: ViewFieldType;
    format?: string;
    imageWidth?: number;
    imageHeight?: number;
    columns?: Array<{
        key: string;
        title: string;
    }>;
}
export interface ViewColumnConfig {
    span?: number;
    fields: ViewFieldConfig[];
}
export interface ViewRowConfig {
    title?: string;
    headerStyle?: React.CSSProperties;
    columns: ViewColumnConfig[];
}
export interface ViewConfig {
    fieldStyle?: React.CSSProperties;
    labelStyle?: {
        width?: number;
        align?: 'left' | 'right' | 'center' | 'justify';
        size?: MantineSize;
        weight?: number;
        color?: string;
        lineClamp?: number;
        inline?: boolean;
        inherit?: boolean;
    };
    rows: ViewRowConfig[];
    layout?: 'vertical' | 'horizontal';
}
export interface DynamicViewProps {
    config: ViewConfig;
    data: Record<string, any>;
}
declare const DynamicView: React.FC<DynamicViewProps>;
export default DynamicView;
