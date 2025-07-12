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
import React, { useEffect, useState, useMemo, useCallback } from 'react';
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
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import ColumnField from './ColumnField';
import { IconX } from '@tabler/icons-react';
// Dayjs plugins
dayjs.locale('tr');
// URL yardımcı fonksiyonu
export var getFullUrl = function (url, baseUrl) {
    if (!url)
        return '';
    // Tam URL kontrolü (http:// veya https:// ile başlıyor)
    if (url.startsWith && (url.startsWith('http://') || url.startsWith('https://'))) {
        return url;
    }
    // Çift slash ile başlayan URL kontrolü (//api/product gibi)
    if (url.startsWith && url.startsWith('//')) {
        // Burada baseUrl'i kullanmak yerine, mevcut alan adının kökünü kullanmalıyız
        // Tarayıcı ortamında, window.location.origin bize "http://localhost:8000" gibi tam kök URL'yi verir
        if (typeof window !== 'undefined') {
            return "".concat(window.location.origin).concat(url.substring(1)); // İlk slash'ı kaldırıyoruz
        }
        else {
            // Sunucu tarafında çalışırken, baseUrl'i kullanabiliriz
            return "".concat(url.substring(1));
        }
    }
    // Göreceli URL, baseUrl ile birleştir
    return "".concat(baseUrl).concat(url.startsWith && url.startsWith('/') ? '' : '/').concat(url);
};
var DropdownField = function (_a) {
    var _b;
    var field = _a.field, form = _a.form, globalStyle = _a.globalStyle, onDropdownChange = _a.onDropdownChange, _c = _a.options, options = _c === void 0 ? [] : _c, setOptionsForField = _a.setOptionsForField, getHeaders = _a.getHeaders, baseUrl = _a.baseUrl;
    var _d = useState(false), loading = _d[0], setLoading = _d[1];
    var _e = useState((_b = form.values[field.field]) !== null && _b !== void 0 ? _b : ''), thisValue = _e[0], setThisValue = _e[1];
    useEffect(function () {
        var _a;
        if (form.values[field.field]) {
            setThisValue(form.values[field.field]);
        }
        if (field.refField && form.values[field.field] && form.values[field.refField]) {
            var url = (_a = field.optionsUrl) === null || _a === void 0 ? void 0 : _a.replace('{0}', String(form.values[field.refField]));
            if (url) {
                setLoading(true);
                fetch(getFullUrl(url, baseUrl), {
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
            fetch(getFullUrl(field.optionsUrl, baseUrl), {
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
        React.createElement(Select, __assign({ label: field.title, placeholder: field.placeholder || "Bir seçim yapınız", data: options.map(function (item) { return ({
                value: String(item.value),
                label: item.label,
            }); }) }, form.getInputProps(field.field), { value: thisValue, onChange: function (val) {
                var safeValue = val === null ? null : val;
                form.setFieldValue(field.field, safeValue);
                var selectedOption = options.find(function (opt) { return String(opt.value) === String(safeValue); });
                if (selectedOption) {
                    form.setFieldValue(field.field + "__title", selectedOption.label);
                }
                else {
                    form.setFieldValue(field.field + "__title", '');
                }
                onDropdownChange === null || onDropdownChange === void 0 ? void 0 : onDropdownChange(field.field, safeValue || '');
                setThisValue(safeValue !== null && safeValue !== void 0 ? safeValue : '');
            }, error: form.errors[field.field], required: field.required, style: globalStyle ? globalStyle : undefined, allowDeselect: true, clearable: true, searchable: true })),
        loading && React.createElement(Loader, { size: "xs", mt: 5 })));
};
// MultiSelect için yeni bir bileşen oluşturuyoruz
var MultiSelectField = function (_a) {
    var field = _a.field, form = _a.form, globalStyle = _a.globalStyle, getHeaders = _a.getHeaders, baseUrl = _a.baseUrl;
    var _b = useState(field.options || []), options = _b[0], setOptions = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState(Array.isArray(form.values[field.field]) ? form.values[field.field].map(String) : []), selectedValues = _d[0], setSelectedValues = _d[1];
    useEffect(function () {
        if (field.options) {
            setOptions(field.options);
        }
        else if (field.optionsUrl) {
            setLoading(true);
            fetch(getFullUrl(field.optionsUrl, baseUrl), {
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
        React.createElement(MultiSelect, { label: field.title, placeholder: field.placeholder || "Bir seçim yapınız", data: options.map(function (item) { return ({ value: String(item.value), label: item.label }); }), value: selectedValues, onChange: handleValueChange, error: form.errors[field.field], required: field.required, disabled: loading, style: globalStyle ? globalStyle : undefined, searchable: true }),
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
    var field = _a.field, form = _a.form, globalStyle = _a.globalStyle, onDropdownChange = _a.onDropdownChange, _b = _a.options, options = _b === void 0 ? [] : _b, setOptionsForField = _a.setOptionsForField, getHeaders = _a.getHeaders, baseUrl = _a.baseUrl;
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    useEffect(function () {
        if (field.optionsUrl) {
            setLoading(true);
            fetch(getFullUrl(field.optionsUrl, baseUrl), {
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
// Switch için özel bileşen oluşturuyoruz
var SwitchField = function (_a) {
    var field = _a.field, form = _a.form, globalStyle = _a.globalStyle;
    var _b = useState(function () {
        var initialValue = form.values[field.field];
        console.log('Switch Initial Value:', {
            field: field.field,
            value: initialValue,
            type: typeof initialValue
        });
        return Boolean(initialValue);
    }), isChecked = _b[0], setIsChecked = _b[1];
    useEffect(function () {
        var formValue = form.values[field.field];
        setIsChecked(Boolean(formValue));
    }, [form.values[field.field]]);
    return (React.createElement(Switch, { label: field.title, checked: isChecked, onChange: function (event) {
            var newValue = event.currentTarget.checked;
            setIsChecked(newValue);
            form.setFieldValue(field.field, newValue);
        }, style: globalStyle ? globalStyle : undefined }));
};
var RefreshField = function (_a) {
    var field = _a.field, form = _a.form, globalStyle = _a.globalStyle;
    return (React.createElement("div", { style: __assign({}, globalStyle) },
        React.createElement(Text, { size: "sm", fw: 500, style: { marginBottom: 5 } },
            field.title,
            " ",
            field.required && React.createElement("span", { style: { color: 'red' } }, "*")),
        React.createElement(Text, { size: "xs", c: "dimmed" }, field.refreshMessage || "Bu alan diğer alanların değişimine göre güncellenecektir.")));
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
    var _g = useState({}), dropdownOptions = _g[0], setDropdownOptions = _g[1];
    var _h = useState(false), isSubmitting = _h[0], setIsSubmitting = _h[1];
    var _j = useState({}), forceUpdate = _j[1];
    // initialValues: Her field için başlangıç değeri belirleniyor.
    var initialValues = useMemo(function () {
        var values = {};
        config.rows.forEach(function (row) {
            row.columns.forEach(function (column) {
                column.fields.forEach(function (field) {
                    if (initialData && initialData[field.field] !== undefined) {
                        if (field.type === 'number') {
                            values[field.field] = Number(initialData[field.field]);
                        }
                        else if (field.type === 'dropdown') {
                            if (initialData[field.field] != null) {
                                values[field.field] = String(initialData[field.field]);
                            }
                            else {
                                values[field.field] = null;
                            }
                            var titleField = field.field + "__title";
                            if (initialData[titleField] !== undefined) {
                                values[titleField] = initialData[titleField];
                            }
                            else {
                                values[titleField] = '';
                            }
                        }
                        else if (field.type === 'segmentedcontrol') {
                            if (initialData[field.field] != null) {
                                values[field.field] = String(initialData[field.field]);
                            }
                            else {
                                values[field.field] = null;
                            }
                            var titleField = field.field + "__title";
                            if (initialData[titleField] !== undefined) {
                                values[titleField] = initialData[titleField];
                            }
                            else {
                                values[titleField] = '';
                            }
                        }
                        else if (field.type === 'tree') {
                            values[field.field] = Array.isArray(initialData[field.field])
                                ? initialData[field.field]
                                : [initialData[field.field]].filter(Boolean);
                            var titleField = field.field + "__title";
                            if (initialData[titleField] !== undefined) {
                                values[titleField] = initialData[titleField];
                            }
                        }
                        else if (field.type === 'switch') {
                            values[field.field] = Boolean(initialData[field.field]);
                        }
                        else if (field.type === 'multiselect') {
                            values[field.field] = Array.isArray(initialData[field.field])
                                ? initialData[field.field]
                                : [initialData[field.field]].filter(Boolean);
                        }
                        else {
                            values[field.field] = initialData[field.field];
                        }
                    }
                    else {
                        if (field.type === 'checkbox' || field.type === 'switch') {
                            values[field.field] = false;
                        }
                        else if (field.type === 'date' || field.type === 'datetime') {
                            values[field.field] = null;
                        }
                        else if (field.type === 'number') {
                            values[field.field] = field.defaultValue || 0;
                        }
                        else if (field.type === 'multiselect' || field.type === 'tree') {
                            values[field.field] = [];
                        }
                        else {
                            values[field.field] = '';
                        }
                    }
                });
            });
        });
        return values;
    }, [config, initialData]);
    // validate: Zorunlu alanlar ve minLength kontrolü için validasyon fonksiyonları
    var validate = useMemo(function () {
        var validationRules = {};
        config.rows.forEach(function (row) {
            row.columns.forEach(function (column) {
                column.fields.forEach(function (field) {
                    validationRules[field.field] = function (value) {
                        // Zorunlu alan kontrolü
                        if (field.required) {
                            if (field.type === 'checkbox') {
                                if (!value)
                                    return "".concat(field.title, " gereklidir.");
                            }
                            else if (field.type === 'date') {
                                if (value === null)
                                    return "".concat(field.title, " gereklidir.");
                            }
                            else {
                                if (!value || value.toString().trim() === '')
                                    return "".concat(field.title, " gereklidir.");
                            }
                        }
                        // minLength kontrolü - sadece veri girildiyse
                        if (field.minLength && value && value.toString().trim() !== '') {
                            var trimmedValue = value.toString().trim();
                            if (trimmedValue.length < field.minLength) {
                                return "".concat(field.title, " en az ").concat(field.minLength, " karakter olmal\u0131d\u0131r.");
                            }
                        }
                        return null;
                    };
                });
            });
        });
        return validationRules;
    }, [config]);
    // transformValues fonksiyonunu useMemo ile stabilize et
    var transformValues = useMemo(function () { return function (values) {
        // Form gönderilirken _options ile biten alanları temizle
        var cleanedValues = __assign({}, values);
        Object.keys(cleanedValues).forEach(function (key) {
            if (key.endsWith('_options')) {
                delete cleanedValues[key];
            }
        });
        return cleanedValues;
    }; }, []);
    // useForm'u başlatırken transformValues ekleyelim
    var form = useForm({
        mode: 'uncontrolled',
        initialValues: initialValues,
        validate: validate,
        transformValues: transformValues
    });
    // Field visibility kontrolü için fonksiyon
    var isFieldVisible = useCallback(function (field) {
        var formValues = form.getValues();
        // Başlangıç durumu kontrolü
        var isVisible = field.visible !== 'hidden'; // Varsayılan: göster
        // visible_field ve visible_value kontrolü
        if (field.visible_field && field.visible_value !== undefined) {
            var fieldValue = formValues[field.visible_field];
            isVisible = String(fieldValue) === String(field.visible_value);
        }
        // hidden_field ve hidden_value kontrolü (öncelikli)
        if (field.hidden_field && field.hidden_value !== undefined) {
            var fieldValue = formValues[field.hidden_field];
            if (String(fieldValue) === String(field.hidden_value)) {
                isVisible = false;
            }
        }
        return isVisible;
    }, [form]);
    // Form değerleri değiştiğinde visibility'yi güncelle
    useEffect(function () {
        var formValues = form.getValues();
        forceUpdate({});
    }, [form.getValues()]);
    // Helper function to get headers - useCallback ile stabilize et
    var getHeaders = useCallback(function () {
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
        return headers;
    }, [useToken]);
    // Form submit edildiğinde değerleri gönderiyoruz.
    var handleSubmit = form.onSubmit(function (values) { return __awaiter(void 0, void 0, void 0, function () {
        var formData_1, requestHeaders, isPutRequest, method, url, response, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsSubmitting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    formData_1 = __assign({}, values);
                    // Eksik __title alanlarını tamamla
                    config.rows.forEach(function (row) {
                        row.columns.forEach(function (column) {
                            column.fields.forEach(function (field) {
                                if (field.type === 'date' && formData_1[field.field]) {
                                    var date = new Date(formData_1[field.field]);
                                    formData_1[field.field] = date.toISOString().split('T')[0];
                                }
                                // Dropdown, SegmentedControl ve Tree için __title alanlarını kontrol et
                                if ((field.type === 'dropdown' || field.type === 'segmentedcontrol' || field.type === 'tree') &&
                                    formData_1[field.field] &&
                                    formData_1[field.field + "__title"] === undefined) {
                                    // Dropdown ve SegmentedControl için
                                    if (field.type === 'dropdown' || field.type === 'segmentedcontrol') {
                                        var options = dropdownOptions[field.field] || [];
                                        var selectedOption = options.find(function (opt) { return String(opt.value) === String(formData_1[field.field]); });
                                        if (selectedOption) {
                                            formData_1[field.field + "__title"] = selectedOption.label;
                                        }
                                    }
                                    // Tree için (is_dropdown modunda)
                                    if (field.type === 'tree' && field.is_dropdown && Array.isArray(formData_1[field.field]) && formData_1[field.field].length > 0) {
                                        var treeData = dropdownOptions[field.field] || [];
                                        var findNode_1 = function (value, nodes) {
                                            for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                                                var node = nodes_1[_i];
                                                if (String(node.value) === String(value))
                                                    return node;
                                                if (node.children) {
                                                    var found = findNode_1(value, node.children);
                                                    if (found)
                                                        return found;
                                                }
                                            }
                                            return null;
                                        };
                                        var selectedNode = findNode_1(formData_1[field.field][0], treeData);
                                        if (selectedNode) {
                                            formData_1[field.field + "__title"] = selectedNode.label;
                                        }
                                    }
                                }
                            });
                        });
                    });
                    // noSubmit true ise, API çağrısı yapmadan direkt olarak form değerlerini döndür
                    if (noSubmit) {
                        if (onSuccess) {
                            onSuccess(formData_1);
                        }
                        return [2 /*return*/];
                    }
                    requestHeaders = getHeaders();
                    isPutRequest = pk_field && initialData && initialData[pk_field];
                    console.log("isPutRequest----->", isPutRequest);
                    method = isPutRequest ? 'PUT' : 'POST';
                    url = isPutRequest
                        ? "".concat(baseUrl, "/").concat(endpoint, "/").concat(initialData[pk_field])
                        : "".concat(baseUrl, "/").concat(endpoint);
                    return [4 /*yield*/, fetch(url, {
                            method: method,
                            headers: requestHeaders,
                            credentials: 'include',
                            mode: 'cors',
                            body: JSON.stringify(formData_1),
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
                        console.log("result----->", result);
                        notifications.show({
                            title: 'Hata',
                            message: result.message || 'Bir hata oluştu',
                            color: 'red',
                            autoClose: 7000,
                            icon: React.createElement(IconX, null),
                            withCloseButton: true,
                            position: 'bottom-right',
                        });
                    }
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error submitting form:', error_1);
                    return [3 /*break*/, 6];
                case 5:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
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
                        field.type === 'textbox' && isFieldVisible(field) && (React.createElement(TextInput, __assign({ label: field.title, placeholder: field.placeholder || field.title }, form.getInputProps(field.field), { required: field.required, maxLength: field.maxLength, minLength: field.minLength, style: config.fieldStyle ? config.fieldStyle : undefined }))),
                        field.type === 'textarea' && (React.createElement(Textarea, __assign({ label: field.title, placeholder: field.placeholder || field.title }, form.getInputProps(field.field), { required: field.required, maxLength: field.maxLength, autosize: (_a = field.autosize) !== null && _a !== void 0 ? _a : undefined, minRows: (_b = field.minRows) !== null && _b !== void 0 ? _b : 1, maxRows: (_c = field.maxRows) !== null && _c !== void 0 ? _c : 2, style: config.fieldStyle ? config.fieldStyle : undefined }))),
                        field.type === 'date' && (React.createElement(DatePickerInput, __assign({ label: field.title, placeholder: field.placeholder || field.title }, form.getInputProps(field.field), { onChange: function (value) {
                                if (value) {
                                    // Local tarih olarak formatla (timezone problemi olmadan)
                                    var localDate = dayjs(value).format('YYYY-MM-DD');
                                    form.setFieldValue(field.field, localDate);
                                }
                                else {
                                    form.setFieldValue(field.field, null);
                                }
                            }, required: field.required, error: form.errors[field.field], style: config.fieldStyle ? config.fieldStyle : undefined, valueFormat: field.valueFormat || "DD.MM.YYYY", locale: "tr", clearable: true }))),
                        field.type === 'datetime' && (React.createElement(DateTimePicker, __assign({ label: field.title, placeholder: field.placeholder || field.title }, form.getInputProps(field.field), { onChange: function (value) { return form.setFieldValue(field.field, value); }, required: field.required, error: form.errors[field.field], style: config.fieldStyle ? config.fieldStyle : undefined, valueFormat: field.valueFormat || "DD.MM.YYYY HH:mm", locale: "tr" }))),
                        field.type === 'checkbox' && (React.createElement(Checkbox, __assign({ label: field.title }, form.getInputProps(field.field, { type: 'checkbox' })))),
                        field.type === 'dropdown' && (React.createElement(DropdownField, { field: field, form: form, globalStyle: config.fieldStyle, onDropdownChange: handleDropdownChange, options: dropdownOptions[field.field] || field.options || [], setOptionsForField: setOptionsForField, getHeaders: getHeaders, baseUrl: baseUrl })),
                        field.type === 'maskinput' && (React.createElement(InputBase, __assign({ label: field.title, placeholder: field.placeholder || field.title, component: IMaskInput, mask: field.mask || '' }, form.getInputProps(field.field), { required: field.required, style: config.fieldStyle ? config.fieldStyle : undefined }))),
                        field.type === 'number' && (React.createElement(NumberInput, { required: field.required, min: field.min, max: field.max, step: field.step, prefix: field.prefix, suffix: field.suffix, defaultValue: field.defaultValue, label: field.title, placeholder: field.placeholder, value: form.values[field.field], onValueChange: function (val) {
                                var _a;
                                form.setFieldValue(field.field, (_a = val.floatValue) !== null && _a !== void 0 ? _a : null);
                            }, error: form.errors[field.field], thousandSeparator: field.thousandSeparator || ',', decimalSeparator: field.decimalSeparator || '.' })),
                        field.type === 'switch' && (React.createElement(SwitchField, { field: field, form: form, globalStyle: config.fieldStyle })),
                        field.type === 'multiselect' && (React.createElement(MultiSelectField, { field: field, form: form, globalStyle: config.fieldStyle, getHeaders: getHeaders, baseUrl: baseUrl })),
                        field.type === 'upload' && (React.createElement(DropField, { field: field, form: form, globalStyle: config.fieldStyle, getHeaders: getHeaders, baseUrl: baseUrl })),
                        field.type === 'uploadcollection' && (React.createElement(UploadCollection, { field: field, form: form, globalStyle: config.fieldStyle, getHeaders: getHeaders, baseUrl: baseUrl })),
                        field.type === 'tree' && (React.createElement(TreeField, { field: field, form: form, globalStyle: config.fieldStyle, getHeaders: getHeaders, baseUrl: baseUrl })),
                        field.type === 'sublistform' && 'subform' in field && field.subform && (React.createElement(SubListForm, { field: field, form: form, globalStyle: config.fieldStyle, baseUrl: baseUrl })),
                        field.type === 'htmleditor' && (React.createElement(HTMLEditorField, { field: field, form: form, globalStyle: config.fieldStyle })),
                        field.type === 'segmentedcontrol' && (React.createElement(SegmentedControlField, { field: field, form: form, globalStyle: config.fieldStyle, onDropdownChange: handleDropdownChange, options: dropdownOptions[field.field] || field.options || [], setOptionsForField: setOptionsForField, getHeaders: getHeaders, baseUrl: baseUrl })),
                        field.type === 'columnfield' && (React.createElement(ColumnField, { field: field, form: form, getHeaders: getHeaders, handleFieldChange: handleFieldChange, baseUrl: baseUrl })),
                        field.type === 'refresh' && (React.createElement(RefreshField, { field: field, form: form, globalStyle: config.fieldStyle }))));
                })));
            })))); }),
        React.createElement(Group, null,
            !hiddenCancel && (React.createElement(Button, __assign({ type: "button", variant: "outline" }, cancelProps, { onClick: function (event) {
                    form.reset();
                    cancelProps.onClick && cancelProps.onClick(event);
                } }), cancelProps.children || 'İptal')),
            React.createElement(Button, __assign({ type: noForm ? "button" : "submit", loading: isSubmitting }, submitProps, { onClick: function (event) {
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
                    if (submitProps.onClick) {
                        submitProps.onClick(event);
                    }
                } }), submitProps.children || 'Save')),
        showDebug === true && (React.createElement("div", { style: { marginTop: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' } },
            React.createElement(Text, { size: "sm", mb: 8 }, "Debug - Form Values:"),
            React.createElement("pre", { style: { margin: 0 } }, JSON.stringify(form.getValues(), null, 2)))))); };
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
                                fetch(getFullUrl(url, baseUrl), {
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
    // DynamicForm bileşeni içinde, diğer fonksiyonların yanına
    var handleFieldChange = function (fieldName, value) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("handleFieldChange", fieldName, value);
            // Tüm fieldları kontrol et
            config.rows.forEach(function (row) {
                row.columns.forEach(function (column) {
                    column.fields.forEach(function (field) { return __awaiter(void 0, void 0, void 0, function () {
                        var currentFormValues, _loop_1, _i, _a, changeConfig;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!(field.field === fieldName && field.changeto && field.changeto.length > 0)) return [3 /*break*/, 4];
                                    currentFormValues = form.getValues();
                                    _loop_1 = function (changeConfig) {
                                        var response, result_1, error_2;
                                        return __generator(this, function (_c) {
                                            switch (_c.label) {
                                                case 0:
                                                    _c.trys.push([0, 3, , 4]);
                                                    return [4 /*yield*/, fetch(getFullUrl(changeConfig.updateurl, baseUrl), {
                                                            method: 'POST',
                                                            headers: getHeaders(),
                                                            body: JSON.stringify(currentFormValues)
                                                        })];
                                                case 1:
                                                    response = _c.sent();
                                                    return [4 /*yield*/, response.json()];
                                                case 2:
                                                    result_1 = _c.sent();
                                                    if (result_1 && result_1.data) {
                                                        // Hedef field'ı bul ve güncelle
                                                        config.rows.forEach(function (r) {
                                                            r.columns.forEach(function (c) {
                                                                c.fields.forEach(function (f, index) {
                                                                    if (f.field === changeConfig.target) {
                                                                        if (initialData && initialData[f.field] !== undefined) {
                                                                            form.setFieldValue(f.field, initialData[f.field]);
                                                                        }
                                                                        else {
                                                                            form.setFieldValue(f.field, null);
                                                                        }
                                                                        c.fields[index] = __assign(__assign({}, result_1.data), { field: f.field });
                                                                    }
                                                                });
                                                            });
                                                        });
                                                    }
                                                    else {
                                                        // Hatalı response veya data field yoksa
                                                        config.rows.forEach(function (r) {
                                                            r.columns.forEach(function (c) {
                                                                c.fields.forEach(function (f, index) {
                                                                    if (f.field === changeConfig.target) {
                                                                        // Field'ı refresh field olarak güncelle
                                                                        c.fields[index] = __assign(__assign({}, f), { type: 'refresh', field: f.field });
                                                                        // initialData'da değer varsa onu kullan, yoksa sıfırla
                                                                        if (initialData && initialData[f.field] !== undefined) {
                                                                            form.setFieldValue(f.field, initialData[f.field]);
                                                                        }
                                                                        else {
                                                                            // Field tipine göre sıfırlama
                                                                            if (f.type === 'number') {
                                                                                form.setFieldValue(f.field, 0);
                                                                            }
                                                                            else if (f.type === 'checkbox' || f.type === 'switch') {
                                                                                form.setFieldValue(f.field, false);
                                                                            }
                                                                            else if (f.type === 'multiselect' || f.type === 'tree') {
                                                                                form.setFieldValue(f.field, []);
                                                                            }
                                                                            else if (f.type === 'date' || f.type === 'datetime') {
                                                                                form.setFieldValue(f.field, null);
                                                                            }
                                                                            else {
                                                                                form.setFieldValue(f.field, '');
                                                                            }
                                                                        }
                                                                    }
                                                                });
                                                            });
                                                        });
                                                    }
                                                    return [3 /*break*/, 4];
                                                case 3:
                                                    error_2 = _c.sent();
                                                    console.error('Field güncelleme hatası:', error_2);
                                                    return [3 /*break*/, 4];
                                                case 4: return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _i = 0, _a = field.changeto;
                                    _b.label = 1;
                                case 1:
                                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                                    changeConfig = _a[_i];
                                    return [5 /*yield**/, _loop_1(changeConfig)];
                                case 2:
                                    _b.sent();
                                    _b.label = 3;
                                case 3:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                });
            });
            return [2 /*return*/];
        });
    }); };
    return (React.createElement(MantineProvider, null,
        React.createElement(Notifications, null),
        noForm ? (
        // Form elementi OLMADAN içeriği render et
        React.createElement("div", { className: "dynamic-form-content" }, renderFormContent())) : (
        // Normal form elementi ile
        React.createElement("form", { onSubmit: handleSubmit }, renderFormContent()))));
};
export default DynamicForm;
