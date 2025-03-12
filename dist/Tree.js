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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
import React, { useState, useEffect } from 'react';
import { Text, Loader, Box, Checkbox, Select } from '@mantine/core';
import { getFullUrl } from './DynamicForm';
var TreeField = function (_a) {
    var field = _a.field, form = _a.form, globalStyle = _a.globalStyle, getHeaders = _a.getHeaders, _b = _a.baseUrl, baseUrl = _b === void 0 ? '' : _b;
    var _c = useState([]), treeData = _c[0], setTreeData = _c[1];
    var _d = useState(false), loading = _d[0], setLoading = _d[1];
    var _e = useState(null), error = _e[0], setError = _e[1];
    var _f = useState([]), selectedValues = _f[0], setSelectedValues = _f[1];
    var _g = useState([]), dropdownOptions = _g[0], setDropdownOptions = _g[1];
    useEffect(function () {
        var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var data, headers, response, result, processedData, flatOptions, values, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoading(true);
                        setError(null);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, 7, 8]);
                        data = [];
                        if (!field.options) return [3 /*break*/, 2];
                        data = field.options;
                        return [3 /*break*/, 5];
                    case 2:
                        if (!field.optionsUrl) return [3 /*break*/, 5];
                        headers = __assign({ 'Content-Type': 'application/json' }, (getHeaders ? getHeaders() : {}));
                        return [4 /*yield*/, fetch(getFullUrl(field.optionsUrl, baseUrl), {
                                method: 'GET',
                                headers: headers,
                                credentials: 'include',
                                mode: 'cors'
                            })];
                    case 3:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("HTTP error! status: ".concat(response.status));
                        }
                        return [4 /*yield*/, response.json()];
                    case 4:
                        result = _a.sent();
                        data = result.data || result;
                        _a.label = 5;
                    case 5:
                        processedData = processTreeLevels(data, 0);
                        setTreeData(processedData);
                        if (field.is_dropdown) {
                            flatOptions = flattenTreeForDropdown(processedData);
                            setDropdownOptions(flatOptions);
                        }
                        if (form.values[field.field]) {
                            values = Array.isArray(form.values[field.field])
                                ? form.values[field.field]
                                : [form.values[field.field]];
                            setSelectedValues(values.map(String));
                        }
                        return [3 /*break*/, 8];
                    case 6:
                        err_1 = _a.sent();
                        console.error('Error loading tree data:', err_1);
                        setError(err_1 instanceof Error ? err_1.message : 'Veri yüklenirken hata oluştu');
                        return [3 /*break*/, 8];
                    case 7:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        fetchData();
    }, [field.optionsUrl, field.options, baseUrl]);
    var processTreeLevels = function (nodes, level) {
        return nodes.map(function (node) {
            var newNode = __assign(__assign({}, node), { level: level + (field.levelOffset || 0) });
            if (node.children && node.children.length > 0) {
                newNode.children = processTreeLevels(node.children, level + 1);
            }
            return newNode;
        });
    };
    var flattenTreeForDropdown = function (nodes, prefix) {
        if (prefix === void 0) { prefix = ''; }
        var result = [];
        nodes.forEach(function (node) {
            var indent = '—'.repeat(node.level || 0);
            var label = node.level ? "".concat(indent, " ").concat(node.label) : node.label;
            result.push({
                value: node.value,
                label: label
            });
            if (node.children && node.children.length > 0) {
                result = __spreadArray(__spreadArray([], result, true), flattenTreeForDropdown(node.children), true);
            }
        });
        return result;
    };
    var handleCheckboxChange = function (node, checked) {
        var newSelectedValues = __spreadArray([], selectedValues, true);
        if (checked) {
            if (!newSelectedValues.includes(node.value)) {
                newSelectedValues.push(node.value);
            }
        }
        else {
            newSelectedValues = newSelectedValues.filter(function (val) { return val !== node.value; });
        }
        setSelectedValues(newSelectedValues);
        form.setFieldValue(field.field, newSelectedValues);
        if (newSelectedValues.length > 0) {
            var selectedNode = findNodeByValue(treeData, newSelectedValues[0]);
            if (selectedNode) {
                form.setFieldValue(field.field + "__title", selectedNode.label);
            }
        }
        else {
            form.setFieldValue(field.field + "__title", '');
        }
    };
    var handleDropdownChange = function (value) {
        var newSelectedValues = value ? [value] : [];
        setSelectedValues(newSelectedValues);
        form.setFieldValue(field.field, newSelectedValues);
        if (value) {
            var selectedOption = dropdownOptions.find(function (opt) { return opt.value === value; });
            if (selectedOption) {
                form.setFieldValue(field.field + "__title", selectedOption.label);
            }
        }
        else {
            form.setFieldValue(field.field + "__title", '');
        }
    };
    var findNodeByValue = function (nodes, value) {
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var node = nodes_1[_i];
            if (node.value === value)
                return node;
            if (node.children) {
                var found = findNodeByValue(node.children, value);
                if (found)
                    return found;
            }
        }
        return null;
    };
    var renderTreeNode = function (node) {
        var isSelected = selectedValues.includes(node.value);
        var level = node.level || 0;
        return (React.createElement(Box, { key: node.value, ml: level * 20, mb: 5 },
            React.createElement(Checkbox, { label: node.label, checked: isSelected, onChange: function (event) { return handleCheckboxChange(node, event.currentTarget.checked); } }),
            node.children && node.children.length > 0 && (React.createElement(Box, { ml: 20 }, node.children.map(function (child) { return renderTreeNode(child); })))));
    };
    if (field.is_dropdown) {
        return (React.createElement(Box, { style: globalStyle },
            React.createElement(Select, { label: field.title, placeholder: "Se\u00E7iniz", data: dropdownOptions, value: selectedValues.length > 0 ? selectedValues[0] : null, onChange: handleDropdownChange, searchable: true, clearable: true, required: field.required, error: form.errors[field.field], disabled: loading }),
            loading && React.createElement(Loader, { size: "xs", mt: 5 }),
            error && React.createElement(Text, { color: "red", size: "xs", mt: 5 }, error)));
    }
    return (React.createElement(Box, { style: globalStyle },
        React.createElement(Text, { size: "sm", fw: 500, mb: 10 },
            field.title,
            " ",
            field.required && React.createElement("span", { style: { color: 'red' } }, "*")),
        loading ? (React.createElement(Loader, { size: "sm" })) : error ? (React.createElement(Text, { color: "red", size: "sm" }, error)) : (React.createElement(Box, null, treeData.map(function (node) { return renderTreeNode(node); }))),
        form.errors[field.field] && (React.createElement(Text, { color: "red", size: "xs", mt: 5 }, form.errors[field.field]))));
};
export default TreeField;
