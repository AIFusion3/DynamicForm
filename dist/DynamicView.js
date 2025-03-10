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
import React from 'react';
import { Text, Grid, Image, Group, MantineProvider, Paper, Table } from '@mantine/core';
import { IconFile } from '@tabler/icons-react';
var formatValue = function (value, field, data) {
    if (value === null || value === undefined)
        return '-';
    switch (field.type) {
        case 'date':
            try {
                var date = new Date(value);
                var day = date.getDate().toString().padStart(2, '0');
                var month = (date.getMonth() + 1).toString().padStart(2, '0');
                var year = date.getFullYear();
                return "".concat(day, ".").concat(month, ".").concat(year);
            }
            catch (error) {
                return value;
            }
        case 'datetime':
            try {
                var date = new Date(value);
                var day = date.getDate().toString().padStart(2, '0');
                var month = (date.getMonth() + 1).toString().padStart(2, '0');
                var year = date.getFullYear();
                var hours = date.getHours().toString().padStart(2, '0');
                var minutes = date.getMinutes().toString().padStart(2, '0');
                return "".concat(day, ".").concat(month, ".").concat(year, " ").concat(hours, ":").concat(minutes);
            }
            catch (error) {
                return value;
            }
        case 'image':
            return value ? (React.createElement(Image, { src: value, width: field.imageWidth || 100, height: field.imageHeight || 100, fit: "contain" })) : '-';
        case 'file':
            return value ? (React.createElement(Group, null,
                React.createElement(IconFile, { size: 20 }),
                React.createElement(Text, { component: "a", href: value, target: "_blank" }, "Dosyay\u0131 G\u00F6r\u00FCnt\u00FCle"))) : '-';
        case 'gallery':
            value = data[field.field];
            if (field.field.includes('.')) {
                var fieldParts = field.field.split('.');
                var arrayField = fieldParts[0];
                var propertyField_1 = fieldParts[1];
                var arrayData = data[arrayField];
                if (Array.isArray(arrayData)) {
                    return (React.createElement(Group, null, arrayData.map(function (item, idx) { return (React.createElement(Image, { key: idx, src: item[propertyField_1], width: field.imageWidth || 100, height: field.imageHeight || 100, fit: "contain" })); })));
                }
            }
            if (Array.isArray(value)) {
                return (React.createElement(Group, null, value.map(function (item, idx) {
                    var imgSrc = typeof item === 'string' ? item : (field.format ? getNestedValue(item, field.format) : item);
                    return (React.createElement(Image, { key: idx, src: imgSrc, width: field.imageWidth || 100, height: field.imageHeight || 100, fit: "contain" }));
                })));
            }
            return '-';
        case 'html':
            return React.createElement("div", { dangerouslySetInnerHTML: { __html: value } });
        case 'boolean':
            return value ? 'Evet' : 'Hayır';
        case 'number':
            return value.toLocaleString('tr-TR');
        case 'table':
            if (!Array.isArray(value) || !field.columns)
                return '-';
            return (React.createElement(Table, { striped: true, highlightOnHover: true, withTableBorder: true, withColumnBorders: true },
                React.createElement(Table.Thead, null,
                    React.createElement(Table.Tr, null, field.columns.map(function (column, idx) { return (React.createElement(Table.Th, { key: idx }, column.title)); }))),
                React.createElement(Table.Tbody, null, value.map(function (row, rowIdx) {
                    var _a;
                    return (React.createElement(Table.Tr, { key: rowIdx }, (_a = field.columns) === null || _a === void 0 ? void 0 : _a.map(function (column, colIdx) { return (React.createElement(Table.Td, { key: colIdx }, row[column.key] !== undefined ? String(row[column.key]) : '-')); })));
                }))));
        default:
            return String(value);
    }
};
// Nokta notasyonu ile iç içe objelere erişim sağlayan yardımcı fonksiyon
var getNestedValue = function (obj, path) {
    var keys = path.split('.');
    var current = obj;
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        if (current === null || current === undefined)
            return undefined;
        current = current[key];
    }
    return current;
};
var DynamicView = function (_a) {
    var config = _a.config, data = _a.data;
    var isHorizontal = config.layout === 'horizontal';
    var valueStyle = __assign({ padding: '8px 12px', backgroundColor: '#f9f9f9', borderRadius: '4px', minHeight: '36px', display: 'flex', alignItems: 'center' }, config.fieldStyle);
    return (React.createElement(MantineProvider, null, config.rows.map(function (row, rowIndex) { return (React.createElement("div", { key: rowIndex, style: { marginBottom: '2rem' } },
        row.title && (React.createElement(Text, { size: "lg", mb: "sm", fw: 600, style: row.headerStyle }, row.title)),
        React.createElement(Grid, { gutter: "md" }, row.columns.map(function (column, colIndex) {
            var _a;
            return (React.createElement(Grid.Col, { key: colIndex, span: (_a = column.span) !== null && _a !== void 0 ? _a : (12 / row.columns.length) }, column.fields.map(function (field, fieldIndex) {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                return (React.createElement("div", { key: fieldIndex, style: { marginBottom: '1rem' } }, isHorizontal ? (React.createElement(Group, { align: "center", justify: "flex-start", gap: "md" },
                    React.createElement("div", { style: { width: ((_a = config.labelStyle) === null || _a === void 0 ? void 0 : _a.width) || 150 } },
                        React.createElement(Text, { ta: (_b = config.labelStyle) === null || _b === void 0 ? void 0 : _b.align, size: ((_c = config.labelStyle) === null || _c === void 0 ? void 0 : _c.size) || 'sm', fw: ((_d = config.labelStyle) === null || _d === void 0 ? void 0 : _d.weight) || 600, c: (_e = config.labelStyle) === null || _e === void 0 ? void 0 : _e.color, lineClamp: (_f = config.labelStyle) === null || _f === void 0 ? void 0 : _f.lineClamp, inline: (_g = config.labelStyle) === null || _g === void 0 ? void 0 : _g.inline, inherit: (_h = config.labelStyle) === null || _h === void 0 ? void 0 : _h.inherit },
                            field.title,
                            ":")),
                    React.createElement(Paper, { shadow: "0", style: valueStyle }, formatValue(getNestedValue(data, field.field), field, data)))) : (React.createElement(React.Fragment, null,
                    React.createElement(Text, { ta: (_j = config.labelStyle) === null || _j === void 0 ? void 0 : _j.align, size: (_k = config.labelStyle) === null || _k === void 0 ? void 0 : _k.size, fw: (_l = config.labelStyle) === null || _l === void 0 ? void 0 : _l.weight, c: (_m = config.labelStyle) === null || _m === void 0 ? void 0 : _m.color, lineClamp: (_o = config.labelStyle) === null || _o === void 0 ? void 0 : _o.lineClamp, inline: (_p = config.labelStyle) === null || _p === void 0 ? void 0 : _p.inline, inherit: (_q = config.labelStyle) === null || _q === void 0 ? void 0 : _q.inherit, mb: 8 }, field.title),
                    React.createElement(Paper, { shadow: "0", style: valueStyle }, formatValue(getNestedValue(data, field.field), field, data))))));
            })));
        })))); })));
};
export default DynamicView;
