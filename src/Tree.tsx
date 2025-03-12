import React, { useState, useEffect } from 'react';
import { Text, Loader, Box, Checkbox, Group, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { getFullUrl } from './DynamicForm';

interface TreeNode {
    value: string;
    label: string;
    children?: TreeNode[];
    level?: number;
}

interface TreeFieldProps {
    field: {
        field: string;
        title: string;
        required?: boolean;
        optionsUrl?: string;
        options?: TreeNode[];
        levelOffset?: number;
        is_dropdown?: boolean;
    };
    form: ReturnType<typeof useForm>;
    globalStyle?: React.CSSProperties;
    getHeaders?: () => Record<string, string>;
    baseUrl?: string;
}

const TreeField: React.FC<TreeFieldProps> = ({ 
    field, 
    form, 
    globalStyle,
    getHeaders,
    baseUrl = ''
}) => {
    const [treeData, setTreeData] = useState<TreeNode[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const [dropdownOptions, setDropdownOptions] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                let data: TreeNode[] = [];
                
                if (field.options) {
                    data = field.options;
                } else if (field.optionsUrl) {
                    const headers = {
                        'Content-Type': 'application/json',
                        ...(getHeaders ? getHeaders() : {})
                    };
                    
                    const response = await fetch(getFullUrl(field.optionsUrl, baseUrl), {
                        method: 'GET',
                        headers,
                        credentials: 'include',
                        mode: 'cors'
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const result = await response.json();
                    data = result.data || result;
                }
                
                const processedData = processTreeLevels(data, 0);
                setTreeData(processedData);
                
                if (field.is_dropdown) {
                    const flatOptions = flattenTreeForDropdown(processedData);
                    setDropdownOptions(flatOptions);
                }
                
                if (form.values[field.field]) {
                    const values = Array.isArray(form.values[field.field]) 
                        ? form.values[field.field] 
                        : [form.values[field.field]];
                    
                    setSelectedValues(values.map(String));
                }
            } catch (err) {
                console.error('Error loading tree data:', err);
                setError(err instanceof Error ? err.message : 'Veri yüklenirken hata oluştu');
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [field.optionsUrl, field.options, baseUrl]);

    const processTreeLevels = (nodes: TreeNode[], level: number): TreeNode[] => {
        return nodes.map(node => {
            const newNode = { 
                ...node, 
                level: level + (field.levelOffset || 0)
            };
            
            if (node.children && node.children.length > 0) {
                newNode.children = processTreeLevels(node.children, level + 1);
            }
            
            return newNode;
        });
    };

    const flattenTreeForDropdown = (nodes: TreeNode[], prefix = ''): { value: string; label: string }[] => {
        let result: { value: string; label: string }[] = [];
        
        nodes.forEach(node => {
            const indent = '—'.repeat(node.level || 0);
            const label = node.level ? `${indent} ${node.label}` : node.label;
            
            result.push({
                value: node.value,
                label: label
            });
            
            if (node.children && node.children.length > 0) {
                result = [...result, ...flattenTreeForDropdown(node.children)];
            }
        });
        
        return result;
    };

    const handleCheckboxChange = (node: TreeNode, checked: boolean) => {
        let newSelectedValues = [...selectedValues];
        
        if (checked) {
            if (!newSelectedValues.includes(node.value)) {
                newSelectedValues.push(node.value);
            }
        } else {
            newSelectedValues = newSelectedValues.filter(val => val !== node.value);
        }
        
        setSelectedValues(newSelectedValues);
        form.setFieldValue(field.field, newSelectedValues);
        
        if (newSelectedValues.length > 0) {
            const selectedNode = findNodeByValue(treeData, newSelectedValues[0]);
            if (selectedNode) {
                form.setFieldValue(field.field + "__title", selectedNode.label);
            }
        } else {
            form.setFieldValue(field.field + "__title", '');
        }
    };

    const handleDropdownChange = (value: string | null) => {
        const newSelectedValues = value ? [value] : [];
        setSelectedValues(newSelectedValues);
        form.setFieldValue(field.field, newSelectedValues);
        
        if (value) {
            const selectedOption = dropdownOptions.find(opt => opt.value === value);
            if (selectedOption) {
                form.setFieldValue(field.field + "__title", selectedOption.label);
            }
        } else {
            form.setFieldValue(field.field + "__title", '');
        }
    };

    const findNodeByValue = (nodes: TreeNode[], value: string): TreeNode | null => {
        for (const node of nodes) {
            if (node.value === value) return node;
            if (node.children) {
                const found = findNodeByValue(node.children, value);
                if (found) return found;
            }
        }
        return null;
    };

    const renderTreeNode = (node: TreeNode) => {
        const isSelected = selectedValues.includes(node.value);
        const level = node.level || 0;
        
        return (
            <Box key={node.value} ml={level * 20} mb={5}>
                <Checkbox
                    label={node.label}
                    checked={isSelected}
                    onChange={(event) => handleCheckboxChange(node, event.currentTarget.checked)}
                />
                
                {node.children && node.children.length > 0 && (
                    <Box ml={20}>
                        {node.children.map(child => renderTreeNode(child))}
                    </Box>
                )}
            </Box>
        );
    };

    if (field.is_dropdown) {
        return (
            <Box style={globalStyle}>
                <Select
                    label={field.title}
                    placeholder="Seçiniz"
                    data={dropdownOptions}
                    value={selectedValues.length > 0 ? selectedValues[0] : null}
                    onChange={handleDropdownChange}
                    searchable
                    clearable
                    required={field.required}
                    error={form.errors[field.field]}
                    disabled={loading}
                />
                {loading && <Loader size="xs" mt={5} />}
                {error && <Text color="red" size="xs" mt={5}>{error}</Text>}
            </Box>
        );
    }

    return (
        <Box style={globalStyle}>
            <Text size="sm" fw={500} mb={10}>
                {field.title} {field.required && <span style={{ color: 'red' }}>*</span>}
            </Text>
            
            {loading ? (
                <Loader size="sm" />
            ) : error ? (
                <Text color="red" size="sm">{error}</Text>
            ) : (
                <Box>
                    {treeData.map(node => renderTreeNode(node))}
                </Box>
            )}
            
            {form.errors[field.field] && (
                <Text color="red" size="xs" mt={5}>
                    {form.errors[field.field]}
                </Text>
            )}
        </Box>
    );
};

export default TreeField;
