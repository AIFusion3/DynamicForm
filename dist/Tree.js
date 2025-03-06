var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useState, useEffect, useRef } from 'react';
import { Tree, Checkbox, Group, Text } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
var TreeField = function (_a) {
    var field = _a.field, form = _a.form, globalStyle = _a.globalStyle, getHeaders = _a.getHeaders;
    var _b = useState(field.options || []), treeData = _b[0], setTreeData = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState({}), checkedState = _d[0], setCheckedState = _d[1];
    var treeRef = useRef(null);
    useEffect(function () {
        if (field.options) {
            setTreeData(field.options);
        }
        else if (field.optionsUrl) {
            setLoading(true);
            fetch(field.optionsUrl, {
                method: 'GET',
                headers: (getHeaders === null || getHeaders === void 0 ? void 0 : getHeaders()) || { 'Content-Type': 'application/json' },
                credentials: 'include',
                mode: 'cors'
            })
                .then(function (res) { return res.json(); })
                .then(function (data) {
                setTreeData(data);
            })
                .catch(function (error) {
                console.error('Error loading tree data:', error);
            })
                .finally(function () { return setLoading(false); });
        }
    }, [field.optionsUrl, field.options]);
    useEffect(function () {
        if (form.values[field.field] && Array.isArray(form.values[field.field])) {
            var newState_1 = {};
            form.values[field.field].forEach(function (value) {
                newState_1[value] = true;
            });
            setCheckedState(newState_1);
        }
    }, []);
    var getAllNodes = function (nodes) {
        var result = [];
        nodes.forEach(function (node) {
            result.push(node);
            if (node.children && node.children.length > 0) {
                result = __spreadArray(__spreadArray([], result, true), getAllNodes(node.children), true);
            }
        });
        return result;
    };
    var getAllChildrenValues = function (node) {
        var values = [node.value];
        if (node.children && node.children.length > 0) {
            node.children.forEach(function (child) {
                values = __spreadArray(__spreadArray([], values, true), getAllChildrenValues(child), true);
            });
        }
        return values;
    };
    var getParentPath = function (value, nodes, path) {
        if (path === void 0) { path = []; }
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var node = nodes_1[_i];
            if (node.value === value) {
                return path;
            }
            if (node.children && node.children.length > 0) {
                var foundPath = getParentPath(value, node.children, __spreadArray(__spreadArray([], path, true), [node.value], false));
                if (foundPath.length > 0) {
                    return foundPath;
                }
            }
        }
        return [];
    };
    var toggleNodeCheck = function (value, checked, tree) {
        var newState = __assign({}, checkedState);
        if (field.is_dropdown) {
            Object.keys(newState).forEach(function (key) {
                delete newState[key];
                tree.uncheckNode(key);
            });
            if (checked) {
                newState[value] = true;
                tree.checkNode(value);
                var selectedNode = findNodeByValue(value, treeData);
                if (selectedNode) {
                    form.setFieldValue(field.field + "__title", selectedNode.label);
                }
            }
            else {
                form.setFieldValue(field.field + "__title", "");
            }
        }
        else {
            if (checked) {
                newState[value] = true;
                tree.checkNode(value);
                var node = findNodeByValue(value, treeData);
                if (node) {
                    var childrenValues = getAllChildrenValues(node);
                    childrenValues.forEach(function (childValue) {
                        newState[childValue] = true;
                        tree.checkNode(childValue);
                    });
                }
                var parentPath = getParentPath(value, treeData);
                parentPath.forEach(function (parentValue) {
                    newState[parentValue] = true;
                    tree.checkNode(parentValue);
                });
            }
            else {
                delete newState[value];
                tree.uncheckNode(value);
                var node = findNodeByValue(value, treeData);
                if (node) {
                    var childrenValues = getAllChildrenValues(node);
                    childrenValues.forEach(function (childValue) {
                        delete newState[childValue];
                        tree.uncheckNode(childValue);
                    });
                }
                var parentPath = getParentPath(value, treeData);
                parentPath.forEach(function (parentValue) {
                    var parentNode = findNodeByValue(parentValue, treeData);
                    if (parentNode && !hasCheckedChildren(parentNode, newState)) {
                        delete newState[parentValue];
                        tree.uncheckNode(parentValue);
                    }
                });
            }
        }
        setCheckedState(newState);
        var selectedValues = Object.keys(newState);
        form.setFieldValue(field.field, selectedValues);
    };
    var findNodeByValue = function (value, nodes) {
        for (var _i = 0, nodes_2 = nodes; _i < nodes_2.length; _i++) {
            var node = nodes_2[_i];
            if (node.value === value) {
                return node;
            }
            if (node.children && node.children.length > 0) {
                var foundNode = findNodeByValue(value, node.children);
                if (foundNode) {
                    return foundNode;
                }
            }
        }
        return null;
    };
    var hasCheckedChildren = function (node, state) {
        if (node.children && node.children.length > 0) {
            return node.children.some(function (child) {
                return state[child.value] || hasCheckedChildren(child, state);
            });
        }
        return false;
    };
    var renderTreeNode = function (_a) {
        var _b;
        var node = _a.node, expanded = _a.expanded, hasChildren = _a.hasChildren, elementProps = _a.elementProps, tree = _a.tree;
        var checked = checkedState[node.value] || false;
        var hasCheckedChildren = ((_b = node.children) === null || _b === void 0 ? void 0 : _b.some(function (child) {
            return checkedState[child.value] || false;
        })) || false;
        var indeterminate = !checked && hasCheckedChildren;
        return (React.createElement(Group, __assign({ gap: "xs" }, elementProps),
            React.createElement(Checkbox.Indicator, { checked: checked, style: { fontSize: '13px' }, color: 'var(--mantine-color-blue-6)', mb: 2, mt: 2, indeterminate: indeterminate, onClick: function (e) {
                    e.stopPropagation();
                    toggleNodeCheck(node.value, !checked, tree);
                } }),
            React.createElement(Group, { gap: 5, onClick: function () { return tree.toggleExpanded(node.value); } },
                React.createElement("span", null, node.label),
                hasChildren && (React.createElement(IconChevronDown, { size: 14, style: { transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' } })))));
    };
    return (React.createElement("div", { style: globalStyle },
        React.createElement(Text, { size: "sm", fw: 500, mb: 5 },
            field.title,
            " ",
            field.required && React.createElement("span", { style: { color: 'red' } }, "*")),
        loading ? (React.createElement(Text, { size: "sm", color: "dimmed" }, "Y\u00FCkleniyor...")) : (React.createElement(Tree, { ref: treeRef, style: { fontSize: '13px' }, data: treeData, levelOffset: field.levelOffset || 23, expandOnClick: false, renderNode: renderTreeNode }))));
};
export default TreeField;
