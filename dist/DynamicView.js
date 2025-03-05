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
import { Text, Grid, Image, Group, MantineProvider, Paper } from '@mantine/core';
import { IconFile } from '@tabler/icons-react';
var formatValue = function (value, field) {
    if (value === null || value === undefined)
        return '-';
    switch (field.type) {
        case 'date':
            return new Date(value).toLocaleDateString('tr-TR');
        case 'datetime':
            return new Date(value).toLocaleString('tr-TR');
        case 'image':
            return value ? (React.createElement(Image, { src: value, width: field.imageWidth || 100, height: field.imageHeight || 100, fit: "contain" })) : '-';
        case 'file':
            return value ? (React.createElement(Group, null,
                React.createElement(IconFile, { size: 20 }),
                React.createElement(Text, { component: "a", href: value, target: "_blank" }, "Dosyay\u0131 G\u00F6r\u00FCnt\u00FCle"))) : '-';
        case 'gallery':
            return Array.isArray(value) ? (React.createElement(Group, null, value.map(function (img, idx) { return (React.createElement(Image, { key: idx, src: img, width: field.imageWidth || 100, height: field.imageHeight || 100, fit: "contain" })); }))) : '-';
        case 'html':
            return React.createElement("div", { dangerouslySetInnerHTML: { __html: value } });
        case 'boolean':
            return value ? 'Evet' : 'Hayır';
        case 'number':
            return value.toLocaleString('tr-TR');
        default:
            return String(value);
    }
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
                    React.createElement(Paper, { shadow: "0", style: valueStyle }, formatValue(data[field.field], field)))) : (React.createElement(React.Fragment, null,
                    React.createElement(Text, { ta: (_j = config.labelStyle) === null || _j === void 0 ? void 0 : _j.align, size: (_k = config.labelStyle) === null || _k === void 0 ? void 0 : _k.size, fw: (_l = config.labelStyle) === null || _l === void 0 ? void 0 : _l.weight, c: (_m = config.labelStyle) === null || _m === void 0 ? void 0 : _m.color, lineClamp: (_o = config.labelStyle) === null || _o === void 0 ? void 0 : _o.lineClamp, inline: (_p = config.labelStyle) === null || _p === void 0 ? void 0 : _p.inline, inherit: (_q = config.labelStyle) === null || _q === void 0 ? void 0 : _q.inherit, mb: 8 }, field.title),
                    React.createElement(Paper, { shadow: "0", style: valueStyle }, formatValue(data[field.field], field))))));
            })));
        })))); })));
};
export default DynamicView;
