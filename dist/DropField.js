'use client';
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
import React, { useState } from 'react';
import { Dropzone } from '@mantine/dropzone';
import { Text, Group, Progress, Paper, Box, Loader, Overlay, Image as MantineImage, Button } from '@mantine/core';
import { IconUpload, IconRefresh, IconTrash, IconFile } from '@tabler/icons-react';
import { getFullUrl } from './DynamicForm';
var DropField = function (_a) {
    var field = _a.field, form = _a.form, globalStyle = _a.globalStyle, getHeaders = _a.getHeaders, _b = _a.baseUrl, baseUrl = _b === void 0 ? '' : _b;
    var _c = useState(null), file = _c[0], setFile = _c[1];
    var _d = useState(''), preview = _d[0], setPreview = _d[1];
    var _e = useState(false), loading = _e[0], setLoading = _e[1];
    var _f = useState(0), progress = _f[0], setProgress = _f[1];
    var _g = useState(false), uploadSuccess = _g[0], setUploadSuccess = _g[1];
    var _h = useState(''), error = _h[0], setError = _h[1];
    var _j = useState(null), imageUrls = _j[0], setImageUrls = _j[1];
    var _k = useState(false), showOverlay = _k[0], setShowOverlay = _k[1];
    var isImageUpload = React.useMemo(function () {
        var _a, _b;
        var imageTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/jpg'];
        return (_b = (_a = field.acceptedFileTypes) === null || _a === void 0 ? void 0 : _a.some(function (type) { return imageTypes.includes(type); })) !== null && _b !== void 0 ? _b : true;
    }, [field.acceptedFileTypes]);
    React.useEffect(function () {
        if (form.values[field.field] && typeof form.values[field.field] === 'object') {
            var imageData = form.values[field.field];
            if (imageData.list && imageData.detail) {
                setImageUrls({
                    list: imageData.list,
                    detail: imageData.detail
                });
            }
        }
    }, [form.values, field.field]);
    var handleDrop = function (files) { return __awaiter(void 0, void 0, void 0, function () {
        var selectedFile, previewUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setError('');
                    setUploadSuccess(false);
                    setImageUrls(null);
                    selectedFile = files[0];
                    setFile(selectedFile);
                    previewUrl = URL.createObjectURL(selectedFile);
                    setPreview(previewUrl);
                    return [4 /*yield*/, uploadImage(selectedFile)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var uploadImage = function (selectedFile) { return __awaiter(void 0, void 0, void 0, function () {
        var progressInterval, formData, response, errorData, responseData, imageData, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedFile) {
                        setError('Lütfen bir resim seçin');
                        return [2 /*return*/];
                    }
                    if (!field.uploadUrl) {
                        setError('Upload URL tanımlanmamış');
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    setProgress(0);
                    setImageUrls(null);
                    setShowOverlay(false);
                    progressInterval = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    formData = new FormData();
                    formData.append('file', selectedFile);
                    formData.append('filename', selectedFile.name);
                    formData.append('content_type', selectedFile.type);
                    if (field.uploadContext) {
                        formData.append('uploadcontext', field.uploadContext);
                        console.log('Upload Context:', field.uploadContext);
                    }
                    console.log('Uploading file:', selectedFile.name, 'Size:', selectedFile.size, 'Type:', selectedFile.type);
                    console.log('Upload URL:', field.uploadUrl);
                    progressInterval = setInterval(function () {
                        setProgress(function (prev) {
                            if (prev >= 95) {
                                if (progressInterval)
                                    clearInterval(progressInterval);
                                return 95;
                            }
                            return prev + 5;
                        });
                    }, 100);
                    return [4 /*yield*/, fetch(getFullUrl(field.uploadUrl, baseUrl), {
                            method: 'POST',
                            headers: getHeaders ? __assign({}, Object.fromEntries(Object.entries(getHeaders()).filter(function (_a) {
                                var key = _a[0];
                                return key !== 'Content-Type';
                            }))) : {},
                            body: formData,
                            credentials: 'include',
                            mode: 'cors'
                        })];
                case 2:
                    response = _a.sent();
                    if (progressInterval)
                        clearInterval(progressInterval);
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    errorData = _a.sent();
                    throw new Error(errorData.detail || errorData.message || 'Yükleme başarısız oldu');
                case 4:
                    setProgress(100);
                    setUploadSuccess(true);
                    return [4 /*yield*/, response.json()];
                case 5:
                    responseData = _a.sent();
                    console.log('Upload response:', responseData);
                    if (isImageUpload) {
                        if (responseData.data && responseData.data.list_image_url && responseData.data.detail_image_url) {
                            imageData = {
                                list: responseData.data.list_image_url,
                                detail: responseData.data.detail_image_url
                            };
                            setImageUrls(imageData);
                            form.setFieldValue(field.field, imageData);
                        }
                        else {
                            console.error('API yanıtında beklenen URL\'ler bulunamadı:', responseData);
                            throw new Error('Görsel URL\'leri alınamadı');
                        }
                    }
                    else {
                        if (responseData.data && responseData.data.file_url) {
                            form.setFieldValue(field.field, responseData.data.file_url);
                            setImageUrls({ list: '__FILE__', detail: responseData.data.file_url });
                        }
                        else {
                            console.error('API yanıtında beklenen dosya URL\'si bulunamadı:', responseData);
                            throw new Error('Dosya URL\'si alınamadı');
                        }
                    }
                    return [3 /*break*/, 8];
                case 6:
                    err_1 = _a.sent();
                    console.error('Yükleme hatası:', err_1);
                    if (err_1 instanceof Error) {
                        setError(err_1.message);
                        console.error('Hata mesajı:', err_1.message);
                    }
                    else if (typeof err_1 === 'object' && err_1 !== null) {
                        console.error('Hata detayları:', JSON.stringify(err_1));
                        setError('Resim yüklenirken bir hata oluştu');
                    }
                    else {
                        setError('Resim yüklenirken bir hata oluştu');
                    }
                    form.setFieldValue(field.field, null);
                    return [3 /*break*/, 8];
                case 7:
                    if (progressInterval)
                        clearInterval(progressInterval);
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var resetUpload = function () {
        setFile(null);
        setPreview('');
        setLoading(false);
        setProgress(0);
        setUploadSuccess(false);
        setError('');
        setImageUrls(null);
        setShowOverlay(false);
        form.setFieldValue(field.field, null);
    };
    var width = field.width || 200;
    var height = field.height || 200;
    return (React.createElement("div", null,
        React.createElement(Paper, { shadow: "xs", p: "xs", withBorder: true, radius: "md", bg: "#f9f9f9", pos: "relative", w: typeof width === 'number' ? width : '100%', h: typeof height === 'number' ? height : '100%', style: { overflow: 'hidden' } },
            !imageUrls && (React.createElement(Dropzone, { onDrop: handleDrop, onReject: function () { return setError('Dosya reddedildi'); }, maxSize: field.maxSize || 5 * 1024 * 1024, accept: field.acceptedFileTypes || ['image/png', 'image/jpeg', 'image/webp'], multiple: false, disabled: loading, w: "100%", h: "100%", mx: "auto", style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                } },
                React.createElement(Group, { justify: "center", style: { pointerEvents: 'none' } },
                    React.createElement(Box, { ta: "center" },
                        React.createElement(IconUpload, { style: { color: 'var(--mantine-color-gray-6)', marginBottom: '10px' } }),
                        React.createElement(Text, { size: "xs", fw: 500 }, field.title),
                        field.acceptedFileTypes && (React.createElement(Text, { size: "xs", c: "dimmed" },
                            "Kabul edilen dosya tipleri: ",
                            field.acceptedFileTypes.join(', '))))))),
            imageUrls && (React.createElement(Box, { ta: "center", mx: "auto", w: "100%", h: "100%", display: "flex", style: { alignItems: 'center', justifyContent: 'center' }, pos: "relative", onMouseEnter: function () { return setShowOverlay(true); }, onMouseLeave: function () { return setShowOverlay(false); } },
                isImageUpload && imageUrls.list !== '__FILE__' ? (React.createElement(MantineImage, { src: imageUrls.list, alt: field.title, fit: "contain", w: "auto", h: "auto", style: {
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        borderRadius: '5px'
                    }, radius: "md" })) : (React.createElement(Box, { ta: "center" },
                    React.createElement(IconFile, { size: 48, style: { color: 'var(--mantine-color-blue-6)' } }),
                    React.createElement(Text, { size: "sm", mt: 5, style: { wordBreak: 'break-word' } }, (file === null || file === void 0 ? void 0 : file.name) || 'Yüklenen Dosya'),
                    React.createElement(Text, { size: "xs", c: "dimmed", mt: 2 },
                        React.createElement("a", { href: imageUrls.detail, target: "_blank", rel: "noopener noreferrer" }, "Dosyay\u0131 G\u00F6r\u00FCnt\u00FCle")))),
                showOverlay && (React.createElement(Box, { pos: "absolute", top: 0, left: 0, right: 0, bottom: 0, style: {
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '5px'
                    } },
                    React.createElement(Group, { gap: 5 },
                        React.createElement(Dropzone, { onDrop: handleDrop, onReject: function () { return setError('Dosya reddedildi'); }, maxSize: field.maxSize || 5 * 1024 * 1024, accept: field.acceptedFileTypes || ['image/png', 'image/jpeg', 'image/webp'], multiple: false, disabled: loading, p: 0, style: {
                                border: 'none',
                                background: 'transparent'
                            } },
                            React.createElement(Button, { variant: "outline", color: "white", size: "xs" },
                                React.createElement(IconRefresh, { size: 16 }))),
                        React.createElement(Button, { onClick: resetUpload, variant: "outline", color: "white", size: "xs" },
                            React.createElement(IconTrash, { size: 16 }))))))),
            loading && (React.createElement(Overlay, { color: "#fff", backgroundOpacity: 0.7, center: true, pos: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 },
                React.createElement(Loader, { color: "blue", size: "lg" }))),
            error && (React.createElement(Text, { c: "red", ta: "center", mt: "sm", size: "xs" }, error)),
            uploadSuccess && !imageUrls && (React.createElement(Text, { c: "green", ta: "center", mt: "sm", size: "xs" }, "Resim ba\u015Far\u0131yla i\u015Flendi, URL'ler al\u0131n\u0131yor..."))),
        loading && (React.createElement(Progress, { value: progress, mt: "xs", size: "xs", color: progress === 100 ? 'green' : 'blue', w: typeof width === 'number' ? width : '100%' }))));
};
export default DropField;
