import React from 'react';
import { Text, Grid, Image, Group, MantineProvider, Paper, MantineSize, Table } from '@mantine/core';
import { IconFile } from '@tabler/icons-react';

export type ViewFieldType = 'text' | 'date' | 'datetime' | 'image' | 'file' | 'gallery' | 'html' | 'number' | 'boolean' | 'table';

export interface ViewFieldConfig {
    field: string;
    title: string;
    type: ViewFieldType;
    format?: string;
    imageWidth?: number;
    imageHeight?: number;
    columns?: Array<{key: string, title: string}>;  // Tablo sütunları için
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

const formatValue = (value: any, field: ViewFieldConfig, data: Record<string, any>): React.ReactNode => {
    if (value === null || value === undefined) return '-';

    switch (field.type) {
        case 'date':
            try {
                const date = new Date(value);
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                return `${day}.${month}.${year}`;
            } catch (error) {
                return value;
            }
        case 'datetime':
            try {
                const date = new Date(value);
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                return `${day}.${month}.${year} ${hours}:${minutes}`;
            } catch (error) {
                return value;
            }
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
            value = data[field.field];
            
            if (field.field.includes('.')) {
                const fieldParts = field.field.split('.');
                const arrayField = fieldParts[0];
                const propertyField = fieldParts[1];
                
                const arrayData = data[arrayField];
                
                if (Array.isArray(arrayData)) {
                    return (
                        <Group>
                            {arrayData.map((item, idx) => (
                                <Image
                                    key={idx}
                                    src={item[propertyField]}
                                    width={field.imageWidth || 100}
                                    height={field.imageHeight || 100}
                                    fit="contain"
                                />
                            ))}
                        </Group>
                    );
                }
            }
            
            if (Array.isArray(value)) {
                return (
                    <Group>
                        {value.map((item, idx) => {
                            const imgSrc = typeof item === 'string' ? item : (field.format ? getNestedValue(item, field.format) : item);
                            return (
                                <Image
                                    key={idx}
                                    src={imgSrc}
                                    width={field.imageWidth || 100}
                                    height={field.imageHeight || 100}
                                    fit="contain"
                                />
                            );
                        })}
                    </Group>
                );
            }
            return '-';
        case 'html':
            return <div dangerouslySetInnerHTML={{ __html: value }} />;
        case 'boolean':
            return value ? 'Evet' : 'Hayır';
        case 'number':
            return value.toLocaleString('tr-TR');
        case 'table':
            if (!Array.isArray(value) || !field.columns) return '-';
            return (
                <Table striped highlightOnHover withTableBorder withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            {field.columns.map((column, idx) => (
                                <Table.Th key={idx}>{column.title}</Table.Th>
                            ))}
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {value.map((row, rowIdx) => (
                            <Table.Tr key={rowIdx}>
                                {field.columns?.map((column, colIdx) => (
                                    <Table.Td key={colIdx}>
                                        {row[column.key] !== undefined ? String(row[column.key]) : '-'}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            );
        default:
            return String(value);
    }
};

// Nokta notasyonu ile iç içe objelere erişim sağlayan yardımcı fonksiyon
const getNestedValue = (obj: any, path: string) => {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
        if (current === null || current === undefined) return undefined;
        current = current[key];
    }
    
    return current;
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
                                                    {formatValue(getNestedValue(data, field.field), field, data)}
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
                                                {formatValue(getNestedValue(data, field.field), field, data)}
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