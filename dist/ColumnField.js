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
import { Box, Text, ScrollArea, Stack, Group, Paper, Loader, Flex } from '@mantine/core';
export var ColumnField = function (_a) {
    var field = _a.field, form = _a.form, getHeaders = _a.getHeaders;
    var _b = useState([]), columns = _b[0], setColumns = _b[1];
    var _c = useState([]), selectedValues = _c[0], setSelectedValues = _c[1];
    var _d = useState(false), loading = _d[0], setLoading = _d[1];
    var _e = useState(null), error = _e[0], setError = _e[1];
    var columnWidth = field.columnWidth || 200;
    var columnHeight = field.columnHeight || 300;
    var border = field.border || '1px solid #e0e0e0';
    var borderRadius = field.borderRadius || 4;
    var backgroundColor = field.backgroundColor || '#ffffff';
    var selectedColor = field.selectedColor || '#e6f7ff';
    var fontSize = field.fontSize || 12;
    useEffect(function () {
        var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var resultData, headers, response, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoading(true);
                        setError(null);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, 7, 8]);
                        resultData = [];
                        if (!field.optionsUrl) return [3 /*break*/, 4];
                        headers = __assign({ 'Content-Type': 'application/json' }, (getHeaders ? getHeaders() : {}));
                        return [4 /*yield*/, fetch(field.optionsUrl, {
                                method: 'GET',
                                headers: headers,
                                credentials: 'include',
                            })];
                    case 2:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("HTTP error! status: ".concat(response.status));
                        }
                        return [4 /*yield*/, response.json()];
                    case 3:
                        result = _a.sent();
                        resultData = result.data || result;
                        console.log("API'den veri alındı:", resultData);
                        return [3 /*break*/, 5];
                    case 4:
                        if (field.options) {
                            resultData = field.options;
                            console.log("Statik veri kullanılıyor:", resultData);
                        }
                        _a.label = 5;
                    case 5:
                        setColumns([resultData]);
                        return [3 /*break*/, 8];
                    case 6:
                        err_1 = _a.sent();
                        console.error("Veri alma hatası:", err_1);
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
    }, [field.optionsUrl, field.options]);
    var updateFormValue = function (newSelectedValues, newColumns) {
        if (newSelectedValues.length === 0) {
            if (field.required) {
                form.setFieldError(field.field, 'Lütfen bir kategori seçin');
            }
            form.setFieldValue(field.field, '');
            form.setFieldValue("".concat(field.field, "__title"), '');
            return;
        }
        var lastSelectedIndex = newSelectedValues.length - 1;
        var lastSelectedValue = newSelectedValues[lastSelectedIndex];
        var lastColumn = newColumns[lastSelectedIndex];
        var lastSelectedItem = lastColumn.find(function (item) { return item.value === lastSelectedValue; });
        if (lastSelectedItem) {
            if (field.required && lastSelectedItem.children && lastSelectedItem.children.length > 0) {
                form.setFieldError(field.field, 'Lütfen alt kategori seçin');
                form.setFieldValue(field.field, '');
                form.setFieldValue("".concat(field.field, "__title"), '');
            }
            else {
                form.setFieldValue(field.field, lastSelectedItem.value);
                form.setFieldValue("".concat(field.field, "__title"), lastSelectedItem.label);
                form.clearFieldError(field.field);
            }
        }
    };
    var handleItemSelect = function (item, columnIndex) {
        console.log("item----->", item);
        console.log("columnIndex----->", columnIndex);
        var newSelectedValues = __spreadArray([], selectedValues, true);
        newSelectedValues[columnIndex] = item.value;
        if (newSelectedValues.length > columnIndex + 1) {
            newSelectedValues.splice(columnIndex + 1);
        }
        var newColumns = __spreadArray([], columns, true);
        console.log("newColumns----->", newColumns);
        if (item.children && item.children.length > 0) {
            if (newColumns.length > columnIndex + 1) {
                newColumns[columnIndex + 1] = item.children;
            }
            else {
                newColumns.push(item.children);
            }
            if (newColumns.length > columnIndex + 2) {
                newColumns.splice(columnIndex + 2);
            }
        }
        else {
            if (newColumns.length > columnIndex + 1) {
                newColumns.splice(columnIndex + 1);
            }
        }
        setSelectedValues(newSelectedValues);
        setColumns(newColumns);
        updateFormValue(newSelectedValues, newColumns);
    };
    useEffect(function () {
        if (columns.length > 0) {
            updateFormValue(selectedValues, columns);
        }
    }, [field.required]);
    var renderItem = function (item, columnIndex) {
        var isSelected = selectedValues[columnIndex] === item.value;
        var hasChildren = item.children && item.children.length > 0;
        return (React.createElement(Box, { key: item.value, py: "5", px: "10", m: 0, style: {
                cursor: 'pointer',
                backgroundColor: isSelected ? selectedColor : backgroundColor,
                borderRadius: borderRadius,
                borderBottom: '1px solid #f5f5f5',
            }, onClick: function () { return handleItemSelect(item, columnIndex); } },
            React.createElement(Flex, { justify: "space-between", align: "center" },
                React.createElement(Text, { style: { fontWeight: 600, fontSize: fontSize, margin: 0 }, truncate: true }, item.label),
                isSelected && hasChildren && (React.createElement(Text, { style: { marginLeft: 8, color: '#888', fontSize: 14 } }, "\u203A")))));
    };
    var renderColumn = function (items, columnIndex) {
        var height = typeof columnHeight === 'number' ? columnHeight : 300;
        var scrollHeight = Math.max(0, height - 20);
        return (React.createElement(Paper, { key: columnIndex, shadow: "0", p: "0", withBorder: true, style: {
                width: columnWidth,
                minWidth: columnWidth,
                height: height,
                border: border,
                borderRadius: borderRadius,
                marginRight: 1,
                overflow: 'hidden',
            } },
            React.createElement(ScrollArea, { style: { height: scrollHeight }, type: "auto", scrollbarSize: 6 },
                React.createElement(Stack, { gap: 0 }, items.map(function (item) { return renderItem(item, columnIndex); })))));
    };
    return (React.createElement(Box, { mb: 20 },
        React.createElement(Text, { style: { fontWeight: 500 }, size: "sm", mb: 5 },
            field.title,
            " ",
            field.required && React.createElement("span", { style: { color: 'red' } }, "*")),
        loading ? (React.createElement(Loader, { size: "sm" })) : error ? (React.createElement(Text, { color: "red", size: "sm" }, error)) : (React.createElement(ScrollArea, { type: "auto", offsetScrollbars: true },
            React.createElement(Group, { gap: 10, wrap: "nowrap" }, columns.map(function (columnItems, index) { return renderColumn(columnItems, index); })))),
        form.errors[field.field] && (React.createElement(Text, { color: "red", size: "xs", mt: 5 }, form.errors[field.field]))));
};
export default ColumnField;
