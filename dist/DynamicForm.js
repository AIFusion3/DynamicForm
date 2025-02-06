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
import { Button, TextInput, Textarea, Grid, Checkbox, Group, Select, Loader, Text, InputBase, NumberInput, Switch, MultiSelect, } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { MantineProvider } from '@mantine/core';
import '@mantine/dates/styles.css';
import { IMaskInput } from 'react-imask';
import { notifications, Notifications } from '@mantine/notifications';
var DropdownField = function (_a) {
    var field = _a.field, form = _a.form, globalStyle = _a.globalStyle, onDropdownChange = _a.onDropdownChange, _b = _a.options, options = _b === void 0 ? [] : _b, setOptionsForField = _a.setOptionsForField;
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
                fetch(url)
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
            fetch(field.optionsUrl)
                .then(function (res) { return res.json(); })
                .then(function (data) {
                var formattedData = data.map(function (item) { return (__assign(__assign({}, item), { value: String(item.value) })); });
                setOptionsForField === null || setOptionsForField === void 0 ? void 0 : setOptionsForField(field.field, formattedData);
                console.log("field.field2", field.field);
                if (field.field === "sector2") {
                    //form.initialize({ "sector2": "3" });
                    setThisValue(form.values[field.field] || '');
                }
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
                onDropdownChange === null || onDropdownChange === void 0 ? void 0 : onDropdownChange(field.field, val || '');
                setThisValue(val || '');
            }, error: form.errors[field.field], required: field.required, 
            //disabled={loading || (!!field.refField && !form.values[field.refField])}
            style: globalStyle ? globalStyle : undefined, allowDeselect: false, clearable: true, searchable: true })),
        loading && React.createElement(Loader, { size: "xs", mt: 5 })));
};
// MultiSelect için yeni bir bileşen oluşturuyoruz
var MultiSelectField = function (_a) {
    var field = _a.field, form = _a.form, globalStyle = _a.globalStyle;
    var _b = useState(field.options || []), options = _b[0], setOptions = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    useEffect(function () {
        if (field.options) {
            setOptions(field.options);
        }
        else if (field.optionsUrl) {
            setLoading(true);
            fetch(field.optionsUrl)
                .then(function (res) { return res.json(); })
                .then(function (data) {
                var formattedData = data.map(function (item) { return (__assign(__assign({}, item), { value: String(item.value) })); });
                setOptions(formattedData);
            })
                .finally(function () { return setLoading(false); });
        }
    }, [field.options, field.optionsUrl]);
    return (React.createElement(React.Fragment, null,
        React.createElement(MultiSelect, { label: field.title, placeholder: field.placeholder || "Select options", data: options.map(function (item) { return ({ value: String(item.value), label: item.label }); }), value: Array.isArray(form.values[field.field]) ? form.values[field.field].map(String) : [], onChange: function (value) { return form.setFieldValue(field.field, value); }, error: form.errors[field.field], required: field.required, disabled: loading, style: globalStyle ? globalStyle : undefined, searchable: true }),
        loading && React.createElement(Loader, { size: "xs", mt: 5 })));
};
/**
 * DynamicForm Bileşeni:
 * - JSON konfigürasyona göre form alanlarını oluşturur.
 * - useForm hook'unu uncontrolled mode'da kullanır.
 * - Form gönderildiğinde API çağrısı yapılır; yanıt başarılı ise onSuccess event'i tetiklenir.
 * - Submit ve Cancel butonları, dışarıdan detaylı buton ayarları ile kontrol edilebilir.
 */
var DynamicForm = function (_a) {
    var config = _a.config, baseUrl = _a.baseUrl, endpoint = _a.endpoint, initialData = _a.initialData, onSuccess = _a.onSuccess, submitButtonProps = _a.submitButtonProps, cancelButtonProps = _a.cancelButtonProps;
    // Form değerlerini takip etmek için state ekliyoruz
    var _b = useState({}), formValues = _b[0], setFormValues = _b[1];
    var _c = useState({}), dropdownOptions = _c[0], setDropdownOptions = _c[1];
    // initialValues: Her field için başlangıç değeri belirleniyor.
    // Checkbox için false, date için null, diğerleri için boş string
    var initialValues = {};
    config.rows.forEach(function (row) {
        row.columns.forEach(function (column) {
            column.fields.forEach(function (field) {
                if (initialData && initialData[field.field] !== undefined) {
                    // Number tipi için özel kontrol
                    if (field.type === 'number') {
                        initialValues[field.field] = Number(initialData[field.field]);
                    }
                    else if (field.type === 'dropdown') {
                        initialValues[field.field] = String(initialData[field.field]);
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
    // Form submit edildiğinde değerleri gönderiyoruz.
    var handleSubmit = form.onSubmit(function (values) { return __awaiter(void 0, void 0, void 0, function () {
        var response, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(baseUrl, "/").concat(endpoint), {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(values),
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
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
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error submitting form:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // Options güncelleme fonksiyonu
    var setOptionsForField = function (fieldName, options) {
        setDropdownOptions(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[fieldName] = options, _a)));
        });
    };
    // handleDropdownChange fonksiyonunu güncelle
    var handleDropdownChange = function (fieldName, value) {
        console.log("Dropdown ".concat(fieldName, " changed to:"), value);
        config.rows.forEach(function (row) {
            row.columns.forEach(function (column) {
                column.fields.forEach(function (field) {
                    if (field.refField === fieldName) {
                        console.log("Found dependent field: ".concat(field.field));
                        if (field.type === 'dropdown' && field.optionsUrl) {
                            form.setFieldValue(field.field, '');
                            setOptionsForField(field.field, []);
                            field.options = [];
                            if (value) {
                                var url = field.optionsUrl.replace('{0}', String(value));
                                console.log("Loading options for ".concat(field.field, " with URL:"), url);
                                fetch(url)
                                    .then(function (res) { return res.json(); })
                                    .then(function (data) {
                                    console.log("Setting options for ".concat(field.field, ":"), data);
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
    // Eğer cancelButtonProps veya submitButtonProps tanımlı değilse boş obje oluşturuyoruz.
    var cancelProps = cancelButtonProps || {};
    var submitProps = submitButtonProps || {};
    return (React.createElement(MantineProvider, null,
        React.createElement(Notifications, null),
        React.createElement("form", { onSubmit: handleSubmit },
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
                            field.type === 'date' && (React.createElement(DatePickerInput, { label: field.title, placeholder: field.placeholder || field.title, value: form.values[field.field], onChange: function (value) { return form.setFieldValue(field.field, value); }, required: field.required, error: form.errors[field.field], style: config.fieldStyle ? config.fieldStyle : undefined })),
                            field.type === 'checkbox' && (React.createElement(Checkbox, __assign({ label: field.title }, form.getInputProps(field.field, { type: 'checkbox' })))),
                            field.type === 'dropdown' && (React.createElement(DropdownField, { field: field, form: form, globalStyle: config.fieldStyle, onDropdownChange: handleDropdownChange, options: dropdownOptions[field.field] || field.options || [], setOptionsForField: setOptionsForField })),
                            field.type === 'maskinput' && (React.createElement(InputBase, __assign({ label: field.title, placeholder: field.placeholder || field.title, component: IMaskInput, mask: field.mask || '' }, form.getInputProps(field.field), { required: field.required, style: config.fieldStyle ? config.fieldStyle : undefined }))),
                            field.type === 'number' && (React.createElement(NumberInput, { required: field.required, min: field.min, max: field.max, step: field.step, prefix: field.prefix, suffix: field.suffix, defaultValue: field.defaultValue, label: field.title, placeholder: field.placeholder, value: form.values[field.field], onChange: function (val) {
                                    form.setFieldValue(field.field, val !== '' ? Number(val) : null);
                                }, error: form.errors[field.field], thousandSeparator: field.thousandSeparator || ',', decimalSeparator: field.decimalSeparator || '.' })),
                            field.type === 'switch' && (React.createElement(Switch, __assign({ label: field.title }, form.getInputProps(field.field, { type: 'checkbox' }), { defaultChecked: field.defaultChecked, style: config.fieldStyle ? config.fieldStyle : undefined }))),
                            field.type === 'multiselect' && (React.createElement(MultiSelectField, { field: field, form: form, globalStyle: config.fieldStyle }))));
                    })));
                })))); }),
            React.createElement(Group, null,
                React.createElement(Button, __assign({ type: "button" }, cancelProps, { onClick: function (event) {
                        form.reset();
                        cancelProps.onClick && cancelProps.onClick(event);
                    } }), cancelProps.children || 'Cancel'),
                React.createElement(Button, __assign({ type: "submit" }, submitProps), submitProps.children || 'Save')),
            React.createElement("div", { style: { marginTop: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' } },
                React.createElement(Text, { size: "sm", mb: 8 }, "Debug - Form Values:"),
                React.createElement("pre", { style: { margin: 0 } }, JSON.stringify(formValues, null, 2))))));
};
export default DynamicForm;
