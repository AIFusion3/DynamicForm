'use client';

import React, { useState, useEffect } from 'react';
import {
  Text,
  Button,
  Group,
  Modal,
  Table,
  ActionIcon,
  Box,
  ScrollArea,
  OptionalPortal
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import DynamicForm from './DynamicForm';
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
    columns?: { key: string; title: string }[];
  };
  form: ReturnType<typeof useForm>;
  globalStyle?: React.CSSProperties;
  baseUrl: string;
}

const SubListForm: React.FC<SubListFormProps> = ({ field, form, globalStyle, baseUrl }) => {
  const [opened, setOpened] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<Record<string, any> | undefined>(undefined);
  
  // Yerel state ile items'ı takip edelim
  const [items, setItems] = useState<any[]>([]);
  
  // Form değerlerini takip eden bir effect ekleyelim
  useEffect(() => {
    // Form değerlerinden field.field'i al ve items state'ini güncelle
    const formItems = form.values[field.field] || [];
    setItems(formItems);
    console.log('Form değerleri güncellendi:', formItems);
  }, [form.values[field.field]]); // field.field değiştiğinde tekrar çalıştır
  
  // Tablo sütunlarını belirle
  const columns = field.columns || Object.keys(field.subform.rows[0].columns[0].fields[0])
    .filter(key => key !== 'field' && key !== 'type')
    .map(key => ({ key, title: key }));

  // Alt form başarıyla tamamlandığında
  const handleSubFormSuccess = (data: any) => {
    console.log('SubListForm - alınan değerler:', data);
    
    // Yerel state'den items'ı al (en güncel)
    const updatedItems = [...items];
    
    if (editingIndex !== null) {
      // Mevcut öğeyi güncelle
      updatedItems[editingIndex] = data;
    } else {
      // Yeni öğe ekle
      updatedItems.push(data);
    }
    
    // Ana formu güncelle
    form.setFieldValue(field.field, updatedItems);
    
    // Yerel state'i de güncelle (form effect'i tetiklenmeden önce)
    setItems(updatedItems);
    
    // Modalı kapat ve düzenleme durumunu sıfırla
    setOpened(false);
    setEditingIndex(null);
    setInitialData(undefined);
    
    console.log('Güncellenmiş items:', updatedItems);
  };

  // Öğe düzenleme
  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setInitialData(items[index]);
    setOpened(true);
  };

  // Öğe silme
  const handleDelete = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    
    // Form değerini güncelle
    form.setFieldValue(field.field, updatedItems);
    
    // Yerel state'i de güncelle
    setItems(updatedItems);
  };

  // Yeni öğe ekleme
  const handleAdd = () => {
    setEditingIndex(null);
    setInitialData(undefined);
    setOpened(true);
  };

  // Render işlemi için强制重新渲染
  const forceUpdate = React.useReducer(() => ({}), {})[1];

  return (
    <div style={globalStyle}>
      <Text size="sm" fw={500} mb={5}>
        {field.title} {field.required && <span style={{ color: 'red' }}>*</span>}
      </Text>
      
       
      
      <Box mb={10}>
        <ScrollArea>
          <Table striped withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                {columns.map(column => (
                  <Table.Th key={column.key}>{column.title}</Table.Th>
                ))}
                <Table.Th style={{ width: 80 }}>İşlemler</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <Table.Tr key={index}>
                    {columns.map(column => (
                      <Table.Td key={column.key}>
                        {typeof item[column.key] === 'object' 
                          ? JSON.stringify(item[column.key]) 
                          : String(item[column.key] || '')}
                      </Table.Td>
                    ))}
                    <Table.Td>
                      <Group gap={5}>
                        <ActionIcon 
                          size="sm" 
                          color="blue" 
                          onClick={() => handleEdit(index)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon 
                          size="sm" 
                          color="red" 
                          onClick={() => handleDelete(index)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={columns.length + 1} style={{ textAlign: 'center' }}>
                    Henüz veri eklenmemiş
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Box>
      
      <Button 
        leftSection={<IconPlus size={16} />}
        onClick={handleAdd} variant="outline"
      >
        {field.buttonTitle || 'Ekle'}
      </Button>
      
      {form.errors[field.field] && (
        <Text size="xs" color="red" mt={5}>
          {form.errors[field.field]}
        </Text>
      )}
      <OptionalPortal withinPortal={true}>
        <Modal
            opened={opened}
            onClose={() => {
                setOpened(false);
                setEditingIndex(null);
                setInitialData(undefined);
            }}
            title={editingIndex !== null ? 'Düzenle' : 'Yeni Ekle'}
            size={field.size || 'md'}
        >
            <DynamicForm
                config={field.subform}
                baseUrl={baseUrl}
                endpoint="/fake/account"
                initialData={initialData}
                onSuccess={handleSubFormSuccess}
                noSubmit={true}
                noForm={true}
                submitButtonProps={{
                    children: editingIndex !== null ? 'Güncelle' : 'Ekle',
                }}
                cancelButtonProps={{
                    onClick: () => setOpened(false),
                }}
            />
        </Modal>
      </OptionalPortal>
    </div>
  );
};

export default SubListForm;