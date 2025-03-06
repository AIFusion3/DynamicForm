import React, { useState, useEffect, useRef } from 'react';
import { Tree, Checkbox, Group, RenderTreeNodePayload, Text } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { FieldType } from './DynamicForm';

export interface TreeNode {
  value: string;
  label: string;
  children?: TreeNode[];
}

export interface TreeFieldProps {
  field: {
    field: string;
    title: string;
    type: FieldType;
    required?: boolean;
    optionsUrl?: string;
    options?: TreeNode[];
    levelOffset?: number;
    is_dropdown?: boolean;
  };
  form: ReturnType<typeof useForm>;
  globalStyle?: React.CSSProperties;
  getHeaders?: () => Record<string, string>;
}

const TreeField: React.FC<TreeFieldProps> = ({ field, form, globalStyle, getHeaders }) => {
  const [treeData, setTreeData] = useState<TreeNode[]>(field.options || []);
  const [loading, setLoading] = useState(false);
  
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});
  
  const treeRef = useRef<any>(null);

  useEffect(() => {
    if (field.options) {
      setTreeData(field.options);
    } else if (field.optionsUrl) {
      setLoading(true);
      fetch(field.optionsUrl, {
        method: 'GET',
        headers: getHeaders?.() || { 'Content-Type': 'application/json' },
        credentials: 'include',
        mode: 'cors'
      })
        .then((res) => res.json())
        .then((data: TreeNode[]) => {
          setTreeData(data);
        })
        .catch(error => {
          console.error('Error loading tree data:', error);
        })
        .finally(() => setLoading(false));
    }
  }, [field.optionsUrl, field.options]);

  useEffect(() => {
    if (form.values[field.field] && Array.isArray(form.values[field.field])) {
      const newState: Record<string, boolean> = {};
      form.values[field.field].forEach((value: string) => {
        newState[value] = true;
      });
      setCheckedState(newState);
    }
  }, []);

  const getAllNodes = (nodes: TreeNode[]): TreeNode[] => {
    let result: TreeNode[] = [];
    
    nodes.forEach(node => {
      result.push(node);
      if (node.children && node.children.length > 0) {
        result = [...result, ...getAllNodes(node.children)];
      }
    });
    
    return result;
  };

  const getAllChildrenValues = (node: TreeNode): string[] => {
    let values: string[] = [node.value];
    
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        values = [...values, ...getAllChildrenValues(child)];
      });
    }
    
    return values;
  };

  const getParentPath = (value: string, nodes: TreeNode[], path: string[] = []): string[] => {
    for (const node of nodes) {
      if (node.value === value) {
        return path;
      }
      
      if (node.children && node.children.length > 0) {
        const foundPath = getParentPath(value, node.children, [...path, node.value]);
        if (foundPath.length > 0) {
          return foundPath;
        }
      }
    }
    
    return [];
  };

  const toggleNodeCheck = (value: string, checked: boolean, tree: any) => {
    const newState = { ...checkedState };
    
    if (field.is_dropdown) {
      Object.keys(newState).forEach(key => {
        delete newState[key];
        tree.uncheckNode(key);
      });
      
      if (checked) {
        newState[value] = true;
        tree.checkNode(value);
        
        const selectedNode = findNodeByValue(value, treeData);
        if (selectedNode) {
          form.setFieldValue(field.field + "__title", selectedNode.label);
        }
      } else {
        form.setFieldValue(field.field + "__title", "");
      }
    } else {
      if (checked) {
        newState[value] = true;
        tree.checkNode(value);
        
        const node = findNodeByValue(value, treeData);
        if (node) {
          const childrenValues = getAllChildrenValues(node);
          childrenValues.forEach(childValue => {
            newState[childValue] = true;
            tree.checkNode(childValue);
          });
        }
        
        const parentPath = getParentPath(value, treeData);
        parentPath.forEach(parentValue => {
          newState[parentValue] = true;
          tree.checkNode(parentValue);
        });
      } else {
        delete newState[value];
        tree.uncheckNode(value);
        
        const node = findNodeByValue(value, treeData);
        if (node) {
          const childrenValues = getAllChildrenValues(node);
          childrenValues.forEach(childValue => {
            delete newState[childValue];
            tree.uncheckNode(childValue);
          });
        }
        
        const parentPath = getParentPath(value, treeData);
        parentPath.forEach(parentValue => {
          const parentNode = findNodeByValue(parentValue, treeData);
          if (parentNode && !hasCheckedChildren(parentNode, newState)) {
            delete newState[parentValue];
            tree.uncheckNode(parentValue);
          }
        });
      }
    }
    
    setCheckedState(newState);
    const selectedValues = Object.keys(newState);
    form.setFieldValue(field.field, selectedValues);
  };

  const findNodeByValue = (value: string, nodes: TreeNode[]): TreeNode | null => {
    for (const node of nodes) {
      if (node.value === value) {
        return node;
      }
      
      if (node.children && node.children.length > 0) {
        const foundNode = findNodeByValue(value, node.children);
        if (foundNode) {
          return foundNode;
        }
      }
    }
    
    return null;
  };

  const hasCheckedChildren = (node: TreeNode, state: Record<string, boolean>): boolean => {
    if (node.children && node.children.length > 0) {
      return node.children.some(child => 
        state[child.value] || hasCheckedChildren(child, state)
      );
    }
    return false;
  };

  const renderTreeNode = ({
    node,
    expanded,
    hasChildren,
    elementProps,
    tree,
  }: RenderTreeNodePayload) => {
    const checked = checkedState[node.value] || false;
    
    const hasCheckedChildren = node.children?.some(child => 
      checkedState[child.value] || false
    ) || false;
    
    const indeterminate = !checked && hasCheckedChildren;

    return (
      <Group gap="xs" {...elementProps}>
        <Checkbox.Indicator
          checked={checked}
          style={{ fontSize: '13px' }}
          color='var(--mantine-color-blue-6)'
          mb={2}
          mt={2}
          indeterminate={indeterminate}
          onClick={(e) => {
            e.stopPropagation();
            toggleNodeCheck(node.value, !checked, tree);
          }}
        />

        <Group gap={5} onClick={() => tree.toggleExpanded(node.value)}>
          <span>{node.label}</span>

          {hasChildren && (
            <IconChevronDown
              size={14}
              style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          )}
        </Group>
      </Group>
    );
  };

  return (
    <div style={globalStyle}>
      <Text size="sm" fw={500} mb={5}>
        {field.title} {field.required && <span style={{ color: 'red' }}>*</span>}
      </Text>
      
      {loading ? (
        <Text size="sm" color="dimmed">Yükleniyor...</Text>
      ) : (
        <Tree
          ref={treeRef}
          style={{ fontSize: '13px' }}
          data={treeData}
          levelOffset={field.levelOffset || 23}
          expandOnClick={false}
          renderNode={renderTreeNode}
        />
      )}
      
    </div>
  );
};

export default TreeField;
