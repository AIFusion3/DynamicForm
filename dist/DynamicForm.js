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
// components/DynamicForm.tsx
import React, { useEffect, useState } from 'react';
import { Button, TextInput, Textarea, Grid, Checkbox, Group, Select, Loader, Text, InputBase, NumberInput, Switch, MultiSelect, SegmentedControl } from '@mantine/core';
import { DatePickerInput, DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { MantineProvider } from '@mantine/core';
import '@mantine/dates/styles.css';
import { IMaskInput } from 'react-imask';
import { notifications, Notifications } from '@mantine/notifications';
import DropField from './DropField';
import UploadCollection from './UploadCollection';
import TreeField from './Tree';
import SubListForm from './SubListForm';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import '@mantine/tiptap/styles.css';
import 'dayjs/locale/tr';
var DropdownField = function (_a) {
    var field = _a.field, form = _a.form, globalStyle = _a.globalStyle, onDropdownChange = _a.onDropdownChange, _b = _a.options, options = _b === void 0 ? [] : _b, setOptionsForField = _a.setOptionsForField, getHeaders = _a.getHeaders;
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState(form.values[field.field] || ''), thisValue = _d[0], setThisValue = _d[1];
    useEffect(function () {
        var _a;
        if (form.values[field.field]) {
            setThisValue(form.values[field.field]);
        }
        if (field.refField && form.values[field.field] && form.values[field.refField]) {
            var url = (_a = field.optionsUrl) === null || _a === void 0 ? void 0 : _a.replace('{0}', String(form.values[field.refField]));
            if (url) {
                setLoading(true);
                fetch(url, {
                    method: 'GET',
                    headers: (getHeaders === null || getHeaders === void 0 ? void 0 : getHeaders()) || { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    mode: 'cors'
                })
                    .then(function (res) { return res.json(); })
                    .then(function (data) {
                    var formattedData = data.map(function (item) { return (__assign(__assign({}, item), { value: String(item.value) })); });
                    setOptionsForField === null || setOptionsForField === void 0 ? void 0 : setOptionsForField(field.field, formattedData);
                })
                    .finally(function () { return setLoading(false); });
            }
        }
        else if (!field.refField && !field.options && field.optionsUrl) {
            setLoading(true);
            fetch(field.optionsUrl, {
                method: 'GET',
                headers: (getHeaders === null || getHeaders === void 0 ? void 0 : getHeaders()) || { 'Content-Type': 'application/json' },
                credentials: 'include',
                mode: 'cors'
            })
                .then(function (res) { return res.json(); })
                .then(function (data) {
                var formattedData = data.map(function (item) { return (__assign(__assign({}, item), { value: String(item.value) })); });
                setOptionsForField === null || setOptionsForField === void 0 ? void 0 : setOptionsForField(field.field, formattedData);
            })
                .finally(function () { return setLoading(false); });
        }
    }, []);
    // Form state'inden ilgili alanın güncel değerini alıyoruz.
    var currentValue = form.values[field.field];
    return (React.createElement(React.Fragment, null,
        React.createElement(Select, __assign({ label: field.title, placeholder: field.placeholder || "Select an option", data: options.map(function (item) { return ({
                value: String(item.value),
                label: item.label,
            }); }) }, form.getInputProps(field.field), { value: thisValue, onChange: function (val) {
                form.setFieldValue(field.field, val);
                // Seçilen öğenin title değerini ayrı bir alana kaydet
                var selectedOption = options.find(function (opt) { return String(opt.value) === val; });
                if (selectedOption) {
                    form.setFieldValue(field.field + "__title", selectedOption.label);
                }
                else {
                    form.setFieldValue(field.field + "__title", '');
                }
                onDropdownChange === null || onDropdownChange === void 0 ? void 0 : onDropdownChange(field.field, val || '');
                setThisValue(val || '');
            }, error: form.errors[field.field], required: field.required, style: globalStyle ? globalStyle : undefined, allowDeselect: false, clearable: true, searchable: true })),
        loading && React.createElement(Loader, { size: "xs", mt: 5 })));
};
// MultiSelect için yeni bir bileşen oluşturuyoruz
var MultiSelectField = function (_a) {
    var field = _a.field, form = _a.form, globalStyle = _a.globalStyle, getHeaders = _a.getHeaders;
    var _b = useState(field.options || []), options = _b[0], setOptions = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState(Array.isArray(form.values[field.field]) ? form.values[field.field].map(String) : []), selectedValues = _d[0], setSelectedValues = _d[1];
    useEffect(function () {
        if (field.options) {
            setOptions(field.options);
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
                var formattedData = data.map(function (item) { return (__assign(__assign({}, item), { value: String(item.value) })); });
                setOptions(formattedData);
            })
                .finally(function () { return setLoading(false); });
        }
    }, []);
    useEffect(function () {
        if (form.values[field.field]) {
            setSelectedValues(Array.isArray(form.values[field.field]) ? form.values[field.field].map(String) : []);
        }
    }, [form.values[field.field]]);
    var handleValueChange = function (value) {
        setSelectedValues(value);
        form.setFieldValue(field.field, value);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(MultiSelect, { label: field.title, placeholder: field.placeholder || "Select options", data: options.map(function (item) { return ({ value: String(item.value), label: item.label }); }), value: selectedValues, onChange: handleValueChange, error: form.errors[field.field], required: field.required, disabled: loading, style: globalStyle ? globalStyle : undefined, searchable: true }),
        loading && React.createElement(Loader, { size: "xs", mt: 5 })));
};
// HTMLEditor bileşenini oluşturalım
var HTMLEditorField = function (_a) {
    var field = _a.field, form = _a.form, globalStyle = _a.globalStyle;
    var editor = useEditor({
        extensions: [
            StarterKit,
            Link,
        ],
        content: form.values[field.field] || '',
        onUpdate: function (_a) {
            var editor = _a.editor;
            form.setFieldValue(field.field, editor.getHTML());
        },
    });
    return (React.createElement("div", { style: globalStyle },
        React.createElement(Text, { size: "sm", fw: 500, mb: 5 },
            field.title,
            " ",
            field.required && React.createElement("span", { style: { color: 'red' } }, "*")),
        React.createElement(RichTextEditor, { editor: editor, style: { minHeight: field.editorHeight } },
            React.createElement(RichTextEditor.Toolbar, { sticky: true, stickyOffset: 60 },
                React.createElement(RichTextEditor.ControlsGroup, null,
                    React.createElement(RichTextEditor.Bold, null),
                    React.createElement(RichTextEditor.Italic, null),
                    React.createElement(RichTextEditor.Underline, null),
                    React.createElement(RichTextEditor.Strikethrough, null),
                    React.createElement(RichTextEditor.ClearFormatting, null),
                    React.createElement(RichTextEditor.Code, null)),
                React.createElement(RichTextEditor.ControlsGroup, null,
                    React.createElement(RichTextEditor.H1, null),
                    React.createElement(RichTextEditor.H2, null),
                    React.createElement(RichTextEditor.H3, null),
                    React.createElement(RichTextEditor.H4, null)),
                React.createElement(RichTextEditor.ControlsGroup, null,
                    React.createElement(RichTextEditor.Blockquote, null),
                    React.createElement(RichTextEditor.Hr, null),
                    React.createElement(RichTextEditor.BulletList, null),
                    React.createElement(RichTextEditor.OrderedList, null)),
                React.createElement(RichTextEditor.ControlsGroup, null,
                    React.createElement(RichTextEditor.Link, null),
                    React.createElement(RichTextEditor.Unlink, null)),
                React.createElement(RichTextEditor.ControlsGroup, null,
                    React.createElement(RichTextEditor.AlignLeft, null),
                    React.createElement(RichTextEditor.AlignCenter, null),
                    React.createElement(RichTextEditor.AlignRight, null))),
            React.createElement(RichTextEditor.Content, null)),
        form.errors[field.field] && (React.createElement(Text, { size: "xs", color: "red", mt: 5 }, form.errors[field.field]))));
};
// SegmentedControlField bileşenini oluşturuyoruz
var SegmentedControlField = function (_a) {
    var field = _a.field, form = _a.form, globalStyle = _a.globalStyle, onDropdownChange = _a.onDropdownChange, _b = _a.options, options = _b === void 0 ? [] : _b, setOptionsForField = _a.setOptionsForField, getHeaders = _a.getHeaders;
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    useEffect(function () {
        if (field.optionsUrl) {
            setLoading(true);
            fetch(field.optionsUrl, {
                method: 'GET',
                headers: (getHeaders === null || getHeaders === void 0 ? void 0 : getHeaders()) || { 'Content-Type': 'application/json' },
                credentials: 'include',
                mode: 'cors'
            })
                .then(function (res) { return res.json(); })
                .then(function (data) {
                var formattedData = data.map(function (item) { return (__assign(__assign({}, item), { value: String(item.value) })); });
                setOptionsForField === null || setOptionsForField === void 0 ? void 0 : setOptionsForField(field.field, formattedData);
            })
                .catch(function (error) {
                console.error("Error loading options for ".concat(field.field, ":"), error);
            })
                .finally(function () { return setLoading(false); });
        }
    }, []);
    return (React.createElement(React.Fragment, null,
        React.createElement(Text, { size: "sm", fw: 500, mb: 5 },
            field.title,
            " ",
            field.required && React.createElement("span", { style: { color: 'red' } }, "*")),
        React.createElement(SegmentedControl, __assign({}, form.getInputProps(field.field), { onChange: function (value) {
                form.setFieldValue(field.field, value);
                var selectedOption = options.find(function (opt) { return String(opt.value) === value; });
                if (selectedOption) {
                    form.setFieldValue(field.field + "__title", selectedOption.label);
                }
                onDropdownChange === null || onDropdownChange === void 0 ? void 0 : onDropdownChange(field.field, value);
            }, data: options.map(function (item) { return ({
                value: String(item.value),
                label: item.label
            }); }), color: field.color, radius: field.radius, size: field.size, fullWidth: field.fullWidth, orientation: field.orientation, style: globalStyle ? globalStyle : undefined })),
        loading && React.createElement(Loader, { size: "xs", mt: 5 }),
        form.errors[field.field] && (React.createElement(Text, { size: "xs", color: "red", mt: 5 }, form.errors[field.field]))));
};
/**
 * DynamicForm Bileşeni:
 * - JSON konfigürasyona göre form alanlarını oluşturur.
 * - useForm hook'unu uncontrolled mode'da kullanır.
 * - Form gönderildiğinde API çağrısı yapılır; yanıt başarılı ise onSuccess event'i tetiklenir.
 * - Submit ve Cancel butonları, dışarıdan detaylı buton ayarları ile kontrol edilebilir.
 */
var DynamicForm = function (_a) {
    var config = _a.config, baseUrl = _a.baseUrl, endpoint = _a.endpoint, initialData = _a.initialData, onSuccess = _a.onSuccess, submitButtonProps = _a.submitButtonProps, cancelButtonProps = _a.cancelButtonProps, _b = _a.useToken, useToken = _b === void 0 ? false : _b, _c = _a.showDebug, showDebug = _c === void 0 ? false : _c, pk_field = _a.pk_field, _d = _a.noSubmit, noSubmit = _d === void 0 ? false : _d, _e = _a.noForm, noForm = _e === void 0 ? false : _e, _f = _a.hiddenCancel, hiddenCancel = _f === void 0 ? false : _f;
    // Form değerlerini takip etmek için state ekliyoruz
    var _g = useState({}), formValues = _g[0], setFormValues = _g[1];
    var _h = useState({}), dropdownOptions = _h[0], setDropdownOptions = _h[1];
    // initialValues: Her field için başlangıç değeri belirleniyor.
    // Checkbox için false, date için null, diğerleri için boş string
    var initialValues = {};
    config.rows.forEach(function (row) {
        row.columns.forEach(function (column) {
            column.fields.forEach(function (field) {
                if (initialData && initialData[field.field] !== undefined) {
                    if (field.type === 'number') {
                        initialValues[field.field] = Number(initialData[field.field]);
                    }
                    else if (field.type === 'dropdown') {
                        initialValues[field.field] = String(initialData[field.field]);
                    }
                    else if (field.type === 'switch') {
                        // Switch için boolean dönüşümü yapıyoruz
                        initialValues[field.field] = Boolean(initialData[field.field]);
                    }
                    else {
                        initialValues[field.field] = initialData[field.field];
                    }
                }
                else {
                    if (field.type === 'checkbox') {
                        initialValues[field.field] = false;
                    }
                    else if (field.type === 'date') {
                        initialValues[field.field] = null;
                    }
                    else if (field.type === 'number') {
                        initialValues[field.field] = field.defaultValue || 0;
                    }
                    else if (field.type === 'switch') {
                        // Switch için varsayılan değer
                        initialValues[field.field] = field.defaultChecked || false;
                    }
                    else {
                        initialValues[field.field] = '';
                    }
                }
            });
        });
    });
    // validate: Zorunlu alanlar için validasyon fonksiyonları
    var validate = {};
    config.rows.forEach(function (row) {
        row.columns.forEach(function (column) {
            column.fields.forEach(function (field) {
                if (field.required) {
                    if (field.type === 'checkbox') {
                        validate[field.field] = function (value) { return (value ? null : "".concat(field.title, " is required.")); };
                    }
                    else if (field.type === 'date') {
                        validate[field.field] = function (value) { return (value !== null ? null : "".concat(field.title, " is required.")); };
                    }
                    else {
                        validate[field.field] = function (value) {
                            return value && value.toString().trim() !== '' ? null : "".concat(field.title, " is required.");
                        };
                    }
                }
            });
        });
    });
    // useForm'u başlatırken transformValues ekleyelim
    var form = useForm({
        mode: 'uncontrolled',
        initialValues: initialValues,
        validate: validate,
        transformValues: function (values) {
            // Form gönderilirken _options ile biten alanları temizle
            var cleanedValues = __assign({}, values);
            Object.keys(cleanedValues).forEach(function (key) {
                if (key.endsWith('_options')) {
                    delete cleanedValues[key];
                }
            });
            return cleanedValues;
        },
        onValuesChange: function (values) {
            setFormValues(values);
        }
    });
    // Helper function to get headers
    var getHeaders = function () {
        var headers = {
            'Content-Type': 'application/json'
        };
        if (useToken) {
            var token = localStorage.getItem('token');
            if (token) {
                headers['Authorization'] = "Bearer ".concat(token);
            }
            else {
                console.warn('Token required but not found in localStorage');
            }
        }
        console.log('Request Headers:', headers); // Debug için
        return headers;
    };
    // Form submit edildiğinde değerleri gönderiyoruz.
    var handleSubmit = form.onSubmit(function (values) { return __awaiter(void 0, void 0, void 0, function () {
        var requestHeaders, isPutRequest, method, url, response, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // noSubmit true ise, API çağrısı yapmadan direkt olarak form değerlerini döndür
                    if (noSubmit) {
                        if (onSuccess) {
                            onSuccess(values);
                        }
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    requestHeaders = getHeaders();
                    isPutRequest = pk_field && initialData && initialData[pk_field];
                    method = isPutRequest ? 'PUT' : 'POST';
                    url = isPutRequest
                        ? "".concat(baseUrl, "/").concat(endpoint, "/").concat(initialData[pk_field])
                        : "".concat(baseUrl, "/").concat(endpoint);
                    return [4 /*yield*/, fetch(url, {
                            method: method,
                            headers: requestHeaders,
                            credentials: 'include',
                            mode: 'cors',
                            body: JSON.stringify(values),
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _a.sent();
                    // Beklenen response model: { data: any, message: string, code: string }
                    if (response.ok) {
                        if (onSuccess) {
                            onSuccess(result.data);
                        }
                    }
                    else {
                        notifications.show({
                            title: 'Hata',
                            message: result.message || 'Bir hata oluştu',
                            color: 'red'
                        });
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error submitting form:', error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    // Eğer cancelButtonProps veya submitButtonProps tanımlı değilse boş obje oluşturuyoruz.
    var cancelProps = cancelButtonProps || {};
    var submitProps = submitButtonProps || {};
    // Form içeriğini render eden fonksiyon
    var renderFormContent = function () { return (React.createElement(React.Fragment, null,
        config.rows.map(function (row, rowIndex) { return (React.createElement("div", { key: rowIndex, style: { marginBottom: '2rem' } },
            row.title && (React.createElement(Text, { size: "lg", mb: "sm", style: row.headerStyle }, row.title)),
            React.createElement(Grid, { gutter: "md" }, row.columns.map(function (column, colIndex) {
                var _a;
                return (React.createElement(Grid.Col, { key: colIndex, 
                    // Eğer column.span tanımlıysa onu, tanımlı değilse 12 / row.columns.length hesaplamasını kullan.
                    span: (_a = column.span) !== null && _a !== void 0 ? _a : (12 / row.columns.length) }, column.fields.map(function (field, fieldIndex) {
                    var _a, _b, _c;
                    return (React.createElement("div", { key: fieldIndex, style: { marginBottom: '1rem' } },
                        field.type === 'textbox' && (React.createElement(TextInput, __assign({ label: field.title, placeholder: field.placeholder || field.title }, form.getInputProps(field.field), { required: field.required, maxLength: field.maxLength, style: config.fieldStyle ? config.fieldStyle : undefined }))),
                        field.type === 'textarea' && (React.createElement(Textarea, __assign({ label: field.title, placeholder: field.placeholder || field.title }, form.getInputProps(field.field), { required: field.required, maxLength: field.maxLength, autosize: (_a = field.autosize) !== null && _a !== void 0 ? _a : undefined, minRows: (_b = field.minRows) !== null && _b !== void 0 ? _b : 1, maxRows: (_c = field.maxRows) !== null && _c !== void 0 ? _c : 2, style: config.fieldStyle ? config.fieldStyle : undefined }))),
                        field.type === 'date' && (React.createElement(DatePickerInput, { label: field.title, placeholder: field.placeholder || field.title, value: form.values[field.field], onChange: function (value) { return form.setFieldValue(field.field, value); }, required: field.required, error: form.errors[field.field], style: config.fieldStyle ? config.fieldStyle : undefined, valueFormat: field.valueFormat || "DD.MM.YYYY", locale: "tr" })),
                        field.type === 'datetime' && (React.createElement(DateTimePicker, { label: field.title, placeholder: field.placeholder || field.title, value: form.values[field.field], onChange: function (value) { return form.setFieldValue(field.field, value); }, required: field.required, error: form.errors[field.field], style: config.fieldStyle ? config.fieldStyle : undefined, valueFormat: field.valueFormat || "DD.MM.YYYY HH:mm", locale: "tr" })),
                        field.type === 'checkbox' && (React.createElement(Checkbox, __assign({ label: field.title }, form.getInputProps(field.field, { type: 'checkbox' })))),
                        field.type === 'dropdown' && (React.createElement(DropdownField, { field: field, form: form, globalStyle: config.fieldStyle, onDropdownChange: handleDropdownChange, options: dropdownOptions[field.field] || field.options || [], setOptionsForField: setOptionsForField, getHeaders: getHeaders })),
                        field.type === 'maskinput' && (React.createElement(InputBase, __assign({ label: field.title, placeholder: field.placeholder || field.title, component: IMaskInput, mask: field.mask || '' }, form.getInputProps(field.field), { required: field.required, style: config.fieldStyle ? config.fieldStyle : undefined }))),
                        field.type === 'number' && (React.createElement(NumberInput, { required: field.required, min: field.min, max: field.max, step: field.step, prefix: field.prefix, suffix: field.suffix, defaultValue: field.defaultValue, label: field.title, placeholder: field.placeholder, value: form.values[field.field], onChange: function (val) {
                                form.setFieldValue(field.field, val !== '' ? Number(val) : null);
                            }, error: form.errors[field.field], thousandSeparator: field.thousandSeparator || ',', decimalSeparator: field.decimalSeparator || '.' })),
                        field.type === 'switch' && (React.createElement(Switch, { label: field.title, checked: form.values[field.field], onChange: function (event) { return form.setFieldValue(field.field, event.currentTarget.checked); }, style: config.fieldStyle ? config.fieldStyle : undefined })),
                        field.type === 'multiselect' && (React.createElement(MultiSelectField, { field: field, form: form, globalStyle: config.fieldStyle, getHeaders: getHeaders })),
                        field.type === 'upload' && (React.createElement(DropField, { field: field, form: form, globalStyle: config.fieldStyle, getHeaders: getHeaders })),
                        field.type === 'uploadcollection' && (React.createElement(UploadCollection, { field: field, form: form, globalStyle: config.fieldStyle, getHeaders: getHeaders })),
                        field.type === 'tree' && (React.createElement(TreeField, { field: field, form: form, globalStyle: config.fieldStyle, getHeaders: getHeaders })),
                        field.type === 'sublistform' && 'subform' in field && field.subform && (React.createElement(SubListForm, { field: field, form: form, globalStyle: config.fieldStyle, baseUrl: baseUrl })),
                        field.type === 'htmleditor' && (React.createElement(HTMLEditorField, { field: field, form: form, globalStyle: config.fieldStyle })),
                        field.type === 'segmentedcontrol' && (React.createElement(SegmentedControlField, { field: field, form: form, globalStyle: config.fieldStyle, onDropdownChange: handleDropdownChange, options: dropdownOptions[field.field] || field.options || [], setOptionsForField: setOptionsForField, getHeaders: getHeaders }))));
                })));
            })))); }),
        React.createElement(Group, null,
            !hiddenCancel && (React.createElement(Button, __assign({ type: "button", variant: "outline" }, cancelProps, { onClick: function (event) {
                    form.reset();
                    cancelProps.onClick && cancelProps.onClick(event);
                } }), cancelProps.children || 'İptal')),
            React.createElement(Button, __assign({ type: noForm ? "button" : "submit" }, submitProps, { onClick: function (event) {
                    if (noForm) {
                        // Form elementi yoksa manuel validation yap
                        var validationResult = form.validate();
                        if (!validationResult.hasErrors) {
                            // Validation başarılıysa ve noSubmit=true ise
                            // form değerlerini doğrudan onSuccess'e gönder
                            if (noSubmit && onSuccess) {
                                console.log("Manuel submit: değerler gönderiliyor", form.getValues());
                                onSuccess(form.getValues());
                            }
                            // Normal API submit
                            else if (!noSubmit) {
                                handleSubmit(new Event('submit'));
                            }
                        }
                    }
                    // Dışarıdan verilen onClick varsa çalıştır
                    if (submitProps.onClick) {
                        submitProps.onClick(event);
                    }
                } }), submitProps.children || 'Save')),
        showDebug === true && (React.createElement("div", { style: { marginTop: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' } },
            React.createElement(Text, { size: "sm", mb: 8 }, "Debug - Form Values:"),
            React.createElement("pre", { style: { margin: 0 } }, JSON.stringify(formValues, null, 2)))))); };
    // Options güncelleme fonksiyonu
    var setOptionsForField = function (fieldName, options) {
        setDropdownOptions(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[fieldName] = options, _a)));
        });
    };
    // handleDropdownChange fonksiyonunu güncelle
    var handleDropdownChange = function (fieldName, value) {
        config.rows.forEach(function (row) {
            row.columns.forEach(function (column) {
                column.fields.forEach(function (field) {
                    if (field.refField === fieldName) {
                        if (field.type === 'dropdown' && field.optionsUrl) {
                            form.setFieldValue(field.field, '');
                            setOptionsForField(field.field, []);
                            field.options = [];
                            if (value) {
                                var url = field.optionsUrl.replace('{0}', String(value));
                                var requestHeaders = getHeaders();
                                fetch(url, {
                                    method: 'GET',
                                    headers: requestHeaders,
                                    credentials: 'include',
                                    mode: 'cors'
                                })
                                    .then(function (res) { return res.json(); })
                                    .then(function (data) {
                                    setOptionsForField(field.field, data);
                                })
                                    .catch(function (error) {
                                    console.error("Error loading options for ".concat(field.field, ":"), error);
                                });
                            }
                        }
                    }
                });
            });
        });
    };
    return (React.createElement(MantineProvider, null,
        React.createElement(Notifications, null),
        noForm ? (
        // Form elementi OLMADAN içeriği render et
        React.createElement("div", { className: "dynamic-form-content" }, renderFormContent())) : (
        // Normal form elementi ile
        React.createElement("form", { onSubmit: handleSubmit }, renderFormContent()))));
};
export default DynamicForm;
