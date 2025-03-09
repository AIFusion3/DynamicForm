'use client';
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
import { Text, Button, Group, Modal, Table, ActionIcon, Box, ScrollArea, OptionalPortal } from '@mantine/core';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import DynamicForm from './DynamicForm';
var SubListForm = function (_a) {
    var field = _a.field, form = _a.form, globalStyle = _a.globalStyle, baseUrl = _a.baseUrl;
    var _b = useState(false), opened = _b[0], setOpened = _b[1];
    var _c = useState(null), editingIndex = _c[0], setEditingIndex = _c[1];
    var _d = useState(undefined), initialData = _d[0], setInitialData = _d[1];
    // Yerel state ile items'ı takip edelim
    var _e = useState([]), items = _e[0], setItems = _e[1];
    // Form değerlerini takip eden bir effect ekleyelim
    useEffect(function () {
        // Form değerlerinden field.field'i al ve items state'ini güncelle
        var formItems = form.values[field.field] || [];
        setItems(formItems);
        console.log('Form değerleri güncellendi:', formItems);
    }, [form.values[field.field]]); // field.field değiştiğinde tekrar çalıştır
    // Tablo sütunlarını belirle
    var columns = field.columns || Object.keys(field.subform.rows[0].columns[0].fields[0])
        .filter(function (key) { return key !== 'field' && key !== 'type'; })
        .map(function (key) { return ({ key: key, title: key }); });
    // Alt form başarıyla tamamlandığında
    var handleSubFormSuccess = function (data) {
        console.log('SubListForm - alınan değerler:', data);
        // Yerel state'den items'ı al (en güncel)
        var updatedItems = __spreadArray([], items, true);
        if (editingIndex !== null) {
            // Mevcut öğeyi güncelle
            updatedItems[editingIndex] = data;
        }
        else {
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
    var handleEdit = function (index) {
        setEditingIndex(index);
        console.log('Düzenleme için seçilen öğe-->', items[index]);
        setInitialData(items[index]);
        setOpened(true);
    };
    // Öğe silme
    var handleDelete = function (index) {
        var updatedItems = __spreadArray([], items, true);
        updatedItems.splice(index, 1);
        // Form değerini güncelle
        form.setFieldValue(field.field, updatedItems);
        // Yerel state'i de güncelle
        setItems(updatedItems);
    };
    // Yeni öğe ekleme
    var handleAdd = function () {
        // isDetail true ise ve zaten bir kayıt varsa eklemeye izin verme
        if (field.isDetail && items.length > 0) {
            return;
        }
        setEditingIndex(null);
        setInitialData(undefined);
        setOpened(true);
    };
    // Render işlemi için强制重新渲染
    var forceUpdate = React.useReducer(function () { return ({}); }, {})[1];
    return (React.createElement("div", { style: globalStyle },
        React.createElement(Text, { size: "sm", fw: 500, mb: 5 },
            field.title,
            " ",
            field.required && React.createElement("span", { style: { color: 'red' } }, "*")),
        React.createElement(Box, { mb: 10 },
            React.createElement(ScrollArea, null,
                React.createElement(Table, { striped: true, withTableBorder: true, withColumnBorders: true, variant: field.isDetail ? "vertical" : undefined, layout: field.isDetail ? "fixed" : undefined },
                    !field.isDetail ? (React.createElement(Table.Thead, null,
                        React.createElement(Table.Tr, null,
                            columns.map(function (column) { return (React.createElement(Table.Th, { key: column.key }, column.title)); }),
                            React.createElement(Table.Th, { style: { width: 80 } })))) : null,
                    React.createElement(Table.Tbody, null, items.length > 0 ? (field.isDetail ? (
                    // Detay görünümü için
                    columns.map(function (column) { return (React.createElement(Table.Tr, { key: column.key },
                        React.createElement(Table.Th, { w: 160 }, column.title),
                        React.createElement(Table.Td, null, (function () {
                            var item = items[0];
                            if (column.type === 'json' && column.subColumns) {
                                if (Array.isArray(item[column.key])) {
                                    var subColumns_1 = column.subColumns;
                                    return (subColumns_1.length > 0 ?
                                        React.createElement(Table, null,
                                            React.createElement(Table.Thead, null,
                                                React.createElement(Table.Tr, null, subColumns_1.map(function (subCol) { return (React.createElement(Table.Th, { key: subCol.key }, subCol.title)); }))),
                                            React.createElement(Table.Tbody, null, item[column.key].map(function (subItem, subIndex) { return (React.createElement(Table.Tr, { key: subIndex }, subColumns_1.map(function (subCol) { return (React.createElement(Table.Td, { key: subCol.key }, String(subItem[subCol.key] || ''))); }))); })))
                                        : null);
                                }
                                return null;
                            }
                            return typeof item[column.key] === 'object'
                                ? JSON.stringify(item[column.key])
                                : String(item[column.key] || '');
                        })()))); })) : (
                    // Normal liste görünümü için
                    items.map(function (item, index) { return (React.createElement(Table.Tr, { key: index },
                        columns.map(function (column) { return (React.createElement(Table.Td, { key: column.key }, (function () {
                            if (column.type === 'json' && column.subColumns) {
                                if (Array.isArray(item[column.key])) {
                                    var subColumns_2 = column.subColumns;
                                    return (subColumns_2.length > 0 ?
                                        React.createElement(Table, null,
                                            React.createElement(Table.Thead, null,
                                                React.createElement(Table.Tr, null, subColumns_2.map(function (subCol) { return (React.createElement(Table.Th, { key: subCol.key }, subCol.title)); }))),
                                            React.createElement(Table.Tbody, null, item[column.key].map(function (subItem, subIndex) { return (React.createElement(Table.Tr, { key: subIndex }, subColumns_2.map(function (subCol) { return (React.createElement(Table.Td, { key: subCol.key }, String(subItem[subCol.key] || ''))); }))); })))
                                        : null);
                                }
                                return null;
                            }
                            return typeof item[column.key] === 'object'
                                ? JSON.stringify(item[column.key])
                                : String(item[column.key] || '');
                        })())); }),
                        React.createElement(Table.Td, null,
                            React.createElement(Group, { gap: 5 },
                                React.createElement(ActionIcon, { size: "sm", color: "black", onClick: function () { return handleEdit(index); } },
                                    React.createElement(IconEdit, { size: 16 })),
                                React.createElement(ActionIcon, { size: "sm", color: "gray", onClick: function () { return handleDelete(index); } },
                                    React.createElement(IconTrash, { size: 16 })))))); }))) : (React.createElement(Table.Tr, null,
                        React.createElement(Table.Td, { colSpan: field.isDetail ? 2 : columns.length + 1, style: { textAlign: 'center' } }, "Hen\u00FCz veri eklenmemi\u015F"))))))),
        !(field.isDetail && items.length > 0) && (React.createElement(Button, { leftSection: React.createElement(IconPlus, { size: 16 }), onClick: handleAdd, variant: "outline", color: "black" }, field.buttonTitle || 'Ekle')),
        field.isDetail && items.length > 0 && (React.createElement(Group, { gap: 5, mt: 10 },
            React.createElement(Button, { leftSection: React.createElement(IconEdit, { size: 16 }), onClick: function () { return handleEdit(0); }, variant: "outline", color: "black" }, "D\u00FCzenle"),
            React.createElement(Button, { leftSection: React.createElement(IconTrash, { size: 16 }), onClick: function () { return handleDelete(0); }, variant: "outline", color: "red" }, "Sil"))),
        form.errors[field.field] && (React.createElement(Text, { size: "xs", color: "red", mt: 5 }, form.errors[field.field])),
        React.createElement(OptionalPortal, { withinPortal: true },
            React.createElement(Modal, { opened: opened, onClose: function () {
                    setOpened(false);
                    setEditingIndex(null);
                    setInitialData(undefined);
                }, title: editingIndex !== null ? 'Düzenle' : 'Yeni Ekle', size: field.size || 'md' },
                React.createElement(DynamicForm, { config: field.subform, baseUrl: baseUrl, endpoint: "/fake/account", initialData: initialData, onSuccess: handleSubFormSuccess, noSubmit: true, noForm: true, submitButtonProps: {
                        children: editingIndex !== null ? 'Güncelle' : 'Ekle',
                    }, cancelButtonProps: {
                        onClick: function () { return setOpened(false); },
                    } })))));
};
export default SubListForm;
