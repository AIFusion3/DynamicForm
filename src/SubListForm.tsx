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
    isDetail?: boolean;
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
  const columns: Column[] = field.columns || Object.keys(field.subform.rows[0].columns[0].fields[0])
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
    console.log('Düzenleme için seçilen öğe-->', items[index]);
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
    // isDetail true ise ve zaten bir kayıt varsa eklemeye izin verme
    if (field.isDetail && items.length > 0) {
      return;
    }
    
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
          <Table 
            striped 
            withTableBorder 
            withColumnBorders
            variant={field.isDetail ? "vertical" : undefined}
            layout={field.isDetail ? "fixed" : undefined}
          >
            {!field.isDetail ? (
              <Table.Thead>
                <Table.Tr>
                  {columns.map(column => (
                    <Table.Th key={column.key}>{column.title}</Table.Th>
                  ))}
                  <Table.Th style={{ width: 80 }}></Table.Th>
                </Table.Tr>
              </Table.Thead>
            ) : null}
            <Table.Tbody>
              {items.length > 0 ? (
                field.isDetail ? (
                  // Detay görünümü için
                  columns.map(column => (
                    <Table.Tr key={column.key}>
                      <Table.Th w={160}>{column.title}</Table.Th>
                      <Table.Td>
                        {(() => {
                          const item = items[0];
                          if (column.type === 'json' && column.subColumns) {
                            if (Array.isArray(item[column.key])) {
                              const subColumns = column.subColumns;
                              return (
                                subColumns.length>0 ?
                                <Table>
                                  <Table.Thead>
                                    <Table.Tr>
                                      {subColumns.map(subCol => (
                                        <Table.Th key={subCol.key}>{subCol.title}</Table.Th>
                                      ))}
                                    </Table.Tr>
                                  </Table.Thead>
                                  <Table.Tbody>
                                    {item[column.key].map((subItem: any, subIndex: number) => (
                                      <Table.Tr key={subIndex}>
                                        {subColumns.map(subCol => (
                                          <Table.Td key={subCol.key}>
                                            {String(subItem[subCol.key] || '')}
                                          </Table.Td>
                                        ))}
                                      </Table.Tr>
                                    ))}
                                  </Table.Tbody>
                                </Table>
                                : null
                              );
                            }
                            return null;
                          }
                          return typeof item[column.key] === 'object' 
                            ? JSON.stringify(item[column.key]) 
                            : String(item[column.key] || '');
                        })()}
                      </Table.Td>
                    </Table.Tr>
                  ))
                ) : (
                  // Normal liste görünümü için
                  items.map((item, index) => (
                    <Table.Tr key={index}>
                      {columns.map(column => (
                        <Table.Td key={column.key}>
                          {(() => {
                            if (column.type === 'json' && column.subColumns) {
                              if (Array.isArray(item[column.key])) {
                                const subColumns = column.subColumns;
                                return (
                                  subColumns.length>0 ?
                                  <Table>
                                    <Table.Thead>
                                      <Table.Tr>
                                        {subColumns.map(subCol => (
                                          <Table.Th key={subCol.key}>{subCol.title}</Table.Th>
                                        ))}
                                      </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                      {item[column.key].map((subItem: any, subIndex: number) => (
                                        <Table.Tr key={subIndex}>
                                          {subColumns.map(subCol => (
                                            <Table.Td key={subCol.key}>
                                              {String(subItem[subCol.key] || '')}
                                            </Table.Td>
                                          ))}
                                        </Table.Tr>
                                      ))}
                                    </Table.Tbody>
                                  </Table>
                                  : null
                                );
                              }
                              return null;
                            }
                            return typeof item[column.key] === 'object' 
                              ? JSON.stringify(item[column.key]) 
                              : String(item[column.key] || '');
                          })()}
                        </Table.Td>
                      ))}
                      <Table.Td>
                        <Group gap={5}>
                          <ActionIcon 
                            size="sm" 
                            color="black" 
                            onClick={() => handleEdit(index)}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                          <ActionIcon 
                            size="sm" 
                            color="gray" 
                            onClick={() => handleDelete(index)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={field.isDetail ? 2 : columns.length + 1} style={{ textAlign: 'center' }}>
                    Henüz veri eklenmemiş
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Box>
      
      {/* isDetail true ve bir kayıt varsa butonu gizle */}
      {!(field.isDetail && items.length > 0) && (
        <Button 
          leftSection={<IconPlus size={16} />}
          onClick={handleAdd} variant="outline" color="black"
        >
          {field.buttonTitle || 'Ekle'}
        </Button>
      )}
      
      {/* Düzenleme ve silme butonlarını detay görünümünde ayrı göster */}
      {field.isDetail && items.length > 0 && (
        <Group gap={5} mt={10}>
          <Button 
            leftSection={<IconEdit size={16} />}
            onClick={() => handleEdit(0)} 
            variant="outline" 
            color="black"
          >
            Düzenle
          </Button>
          <Button 
            leftSection={<IconTrash size={16} />}
            onClick={() => handleDelete(0)} 
            variant="outline" 
            color="red"
          >
            Sil
          </Button>
        </Group>
      )}
      
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
                useToken={true}
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