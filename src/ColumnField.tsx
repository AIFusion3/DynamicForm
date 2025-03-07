import React, { useState, useEffect } from 'react';
import { Box, Text, ScrollArea, Stack, Group, Paper, Loader, Flex } from '@mantine/core';
import { useForm } from '@mantine/form';
import { FieldType } from './DynamicForm';

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
  };
  form: ReturnType<typeof useForm>;
  getHeaders?: () => Record<string, string>;
}

export const ColumnField: React.FC<ColumnFieldProps> = ({
  field,
  form,
  getHeaders
}) => {
  const [columns, setColumns] = useState<ColumnNode[][]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const columnWidth = field.columnWidth || 200;
  const columnHeight = field.columnHeight || 300;
  const border = field.border || '1px solid #e0e0e0';
  const borderRadius = field.borderRadius || 4;
  const backgroundColor = field.backgroundColor || '#ffffff';
  const selectedColor = field.selectedColor || '#e6f7ff';
  const fontSize = field.fontSize || 12;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let resultData: ColumnNode[] = [];

        if (field.optionsUrl) {
          const headers = {
            'Content-Type': 'application/json',
            ...(getHeaders ? getHeaders() : {})
          };
          
          const response = await fetch(field.optionsUrl, {
            method: 'GET',
            headers,
            credentials: 'include',
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const result = await response.json();
          resultData = result.data || result;
          console.log("API'den veri alındı:", resultData);
        } else if (field.options) {
          resultData = field.options;
          console.log("Statik veri kullanılıyor:", resultData);
        }

        setColumns([resultData]);
      } catch (err) {
        console.error("Veri alma hatası:", err);
        setError(err instanceof Error ? err.message : 'Veri yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [field.optionsUrl, field.options]);

  const updateFormValue = (newSelectedValues: string[], newColumns: ColumnNode[][]) => {
    if (newSelectedValues.length === 0) {
      if (field.required) {
        form.setFieldError(field.field, 'Lütfen bir kategori seçin');
      }
      form.setFieldValue(field.field, '');
      form.setFieldValue(`${field.field}__title`, '');
      return;
    }

    const lastSelectedIndex = newSelectedValues.length - 1;
    const lastSelectedValue = newSelectedValues[lastSelectedIndex];
    const lastColumn = newColumns[lastSelectedIndex];
    const lastSelectedItem = lastColumn.find(item => item.value === lastSelectedValue);
    
    if (lastSelectedItem) {
      if (field.required && lastSelectedItem.children && lastSelectedItem.children.length > 0) {
        form.setFieldError(field.field, 'Lütfen alt kategori seçin');
        
        form.setFieldValue(field.field, '');
        form.setFieldValue(`${field.field}__title`, '');
      } else {
        form.setFieldValue(field.field, lastSelectedItem.value);
        form.setFieldValue(`${field.field}__title`, lastSelectedItem.label);
        form.clearFieldError(field.field);
      }
    }
  };

  const handleItemSelect = (item: ColumnNode, columnIndex: number) => {
    console.log("item----->", item);
    console.log("columnIndex----->", columnIndex);

    const newSelectedValues = [...selectedValues];
    newSelectedValues[columnIndex] = item.value;
    
    if (newSelectedValues.length > columnIndex + 1) {
      newSelectedValues.splice(columnIndex + 1);
    }
    
    const newColumns = [...columns];
    console.log("newColumns----->", newColumns);

    if (item.children && item.children.length > 0) {
      if (newColumns.length > columnIndex + 1) {
        newColumns[columnIndex + 1] = item.children;
      } else {
        newColumns.push(item.children);
      }
      
      if (newColumns.length > columnIndex + 2) {
        newColumns.splice(columnIndex + 2);
      }
    } else {
      if (newColumns.length > columnIndex + 1) {
        newColumns.splice(columnIndex + 1);
      }
    }
    
    setSelectedValues(newSelectedValues);
    setColumns(newColumns);
    
    updateFormValue(newSelectedValues, newColumns);
  };

  useEffect(() => {
    if (columns.length > 0) {
      updateFormValue(selectedValues, columns);
    }
  }, [field.required]);

  const renderItem = (item: ColumnNode, columnIndex: number) => {
    const isSelected = selectedValues[columnIndex] === item.value;
    const hasChildren = item.children && item.children.length > 0;
    
    return (
      <Box
        key={item.value}
        py="5"
        px="10"
        m={0}
        style={{
          cursor: 'pointer',
          backgroundColor: isSelected ? selectedColor : backgroundColor,
          borderRadius,
          borderBottom: '1px solid #f5f5f5',
        }}
        onClick={() => handleItemSelect(item, columnIndex)}
      >
        <Flex justify="space-between" align="center">
          <Text style={{ fontWeight: 600, fontSize: fontSize, margin: 0 }} truncate>
            {item.label}
          </Text>
          
          {isSelected && hasChildren && (
            <Text style={{ marginLeft: 8, color: '#888', fontSize: 14 }}>
              ›
            </Text>
          )}
        </Flex>
      </Box>
    );
  };

  const renderColumn = (items: ColumnNode[], columnIndex: number) => {
    const height = typeof columnHeight === 'number' ? columnHeight : 300;
    const scrollHeight = Math.max(0, height - 20);
    
    return (
      <Paper
        key={columnIndex}
        shadow="0"
        p="0"
        withBorder
        style={{
          width: columnWidth,
          minWidth: columnWidth,
          height: height,
          border,
          borderRadius,
          marginRight: 1,
          overflow: 'hidden',
        }}
      >
        <ScrollArea 
          style={{ height: scrollHeight }}
          type="auto"
          scrollbarSize={6}
        >
          <Stack gap={0}>
            {items.map(item => renderItem(item, columnIndex))}
          </Stack>
        </ScrollArea>
      </Paper>
    );
  };

  return (
    <Box mb={20}>
      <Text style={{ fontWeight: 500 }} size="sm" mb={5}>
        {field.title} {field.required && <span style={{ color: 'red' }}>*</span>}
      </Text>

      {loading ? (
        <Loader size="sm" />
      ) : error ? (
        <Text color="red" size="sm">{error}</Text>
      ) : (
        <ScrollArea type="auto" offsetScrollbars>
          <Group gap={10} wrap="nowrap">
            {columns.map((columnItems, index) => renderColumn(columnItems, index))}
          </Group>
        </ScrollArea>
      )}

      {form.errors[field.field] && (
        <Text color="red" size="xs" mt={5}>
          {form.errors[field.field]}
        </Text>
      )}
    </Box>
  );
};

export default ColumnField;