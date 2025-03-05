import React from 'react';
import { Text, Grid, Image, Group, MantineProvider, Paper, MantineSize } from '@mantine/core';
import { IconFile } from '@tabler/icons-react';

export type ViewFieldType = 'text' | 'date' | 'datetime' | 'image' | 'file' | 'gallery' | 'html' | 'number' | 'boolean';

export interface ViewFieldConfig {
    field: string;
    title: string;
    type: ViewFieldType;
    format?: string;
    imageWidth?: number;
    imageHeight?: number;
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

const formatValue = (value: any, field: ViewFieldConfig): React.ReactNode => {
    if (value === null || value === undefined) return '-';

    switch (field.type) {
        case 'date':
            return new Date(value).toLocaleDateString('tr-TR');
        case 'datetime':
            return new Date(value).toLocaleString('tr-TR');
        case 'image':
            return value ? (
                <Image
                    src={value}
                    width={field.imageWidth || 100}
                    height={field.imageHeight || 100}
                    fit="contain"
                />
            ) : '-';
        case 'file':
            return value ? (
                <Group>
                    <IconFile size={20} />
                    <Text component="a" href={value} target="_blank">
                        Dosyayı Görüntüle
                    </Text>
                </Group>
            ) : '-';
        case 'gallery':
            return Array.isArray(value) ? (
                <Group>
                    {value.map((img, idx) => (
                        <Image
                            key={idx}
                            src={img}
                            width={field.imageWidth || 100}
                            height={field.imageHeight || 100}
                            fit="contain"
                        />
                    ))}
                </Group>
            ) : '-';
        case 'html':
            return <div dangerouslySetInnerHTML={{ __html: value }} />;
        case 'boolean':
            return value ? 'Evet' : 'Hayır';
        case 'number':
            return value.toLocaleString('tr-TR');
        default:
            return String(value);
    }
};

const DynamicView: React.FC<DynamicViewProps> = ({ config, data }) => {
    const isHorizontal = config.layout === 'horizontal';

    const valueStyle = {
        padding: '8px 12px',
        backgroundColor: '#f9f9f9',
        borderRadius: '4px',
        minHeight: '36px',
        display: 'flex',
        alignItems: 'center',
        ...config.fieldStyle
    };

    return (
        <MantineProvider>
            {config.rows.map((row, rowIndex) => (
                <div key={rowIndex} style={{ marginBottom: '2rem' }}>
                    {row.title && (
                        <Text size="lg" mb="sm" fw={600} style={row.headerStyle}>
                            {row.title}
                        </Text>
                    )}
                    <Grid gutter="md">
                        {row.columns.map((column, colIndex) => (
                            <Grid.Col
                                key={colIndex}
                                span={column.span ?? (12 / row.columns.length)}
                            >
                                {column.fields.map((field, fieldIndex) => (
                                    <div key={fieldIndex} style={{ marginBottom: '1rem' }}>
                                        {isHorizontal ? (
                                            <Group align="center" justify="flex-start" gap="md">
                                                <div style={{ width: config.labelStyle?.width || 150 }}>
                                                    <Text 
                                                        ta={config.labelStyle?.align}
                                                        size={config.labelStyle?.size || 'sm'}
                                                        fw={config.labelStyle?.weight || 600}
                                                        c={config.labelStyle?.color}
                                                        lineClamp={config.labelStyle?.lineClamp}
                                                        inline={config.labelStyle?.inline}
                                                        inherit={config.labelStyle?.inherit}
                                                    >
                                                        {field.title}:
                                                    </Text>
                                                </div>
                                                <Paper shadow="0" style={valueStyle}>
                                                    {formatValue(data[field.field], field)}
                                                </Paper>
                                            </Group>
                                        ) : (
                                            <>
                                                <Text 
                                                    ta={config.labelStyle?.align}
                                                    size={config.labelStyle?.size}
                                                    fw={config.labelStyle?.weight}
                                                    c={config.labelStyle?.color}
                                                    lineClamp={config.labelStyle?.lineClamp}
                                                    inline={config.labelStyle?.inline}
                                                    inherit={config.labelStyle?.inherit}
                                                    mb={8}
                                                >
                                                    {field.title}
                                                </Text>
                                                <Paper shadow="0" style={valueStyle}>
                                                    {formatValue(data[field.field], field)}
                                                </Paper>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </Grid.Col>
                        ))}
                    </Grid>
                </div>
            ))}
        </MantineProvider>
    );
};

export default DynamicView;