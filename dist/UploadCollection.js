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
import { Dropzone } from '@mantine/dropzone';
import { Text, Group, Progress, Box, Loader, Overlay, Image as MantineImage, Button, ActionIcon, Flex, ScrollArea, Paper } from '@mantine/core';
import { IconUpload, IconTrash, IconArrowLeft, IconArrowRight, IconRefresh } from '@tabler/icons-react';
// Tek bir resim yükleme kutusu için bileşen
var ImageUploadBox = function (_a) {
    var index = _a.index, imageData = _a.imageData, uploadUrl = _a.uploadUrl, maxSize = _a.maxSize, acceptedFileTypes = _a.acceptedFileTypes, width = _a.width, height = _a.height, uploadContext = _a.uploadContext, getHeaders = _a.getHeaders, onImageUploaded = _a.onImageUploaded, onImageRemoved = _a.onImageRemoved, onMoveImage = _a.onMoveImage, totalImages = _a.totalImages;
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var _c = useState(0), progress = _c[0], setProgress = _c[1];
    var _d = useState(''), error = _d[0], setError = _d[1];
    var _e = useState(false), showOverlay = _e[0], setShowOverlay = _e[1];
    var _f = useState(''), preview = _f[0], setPreview = _f[1];
    var _g = useState(null), file = _g[0], setFile = _g[1];
    var handleDrop = function (files) { return __awaiter(void 0, void 0, void 0, function () {
        var selectedFile, previewUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (files.length === 0)
                        return [2 /*return*/];
                    selectedFile = files[0];
                    setFile(selectedFile);
                    previewUrl = URL.createObjectURL(selectedFile);
                    setPreview(previewUrl);
                    setError('');
                    return [4 /*yield*/, uploadImage(selectedFile)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var uploadImage = function (selectedFile) { return __awaiter(void 0, void 0, void 0, function () {
        var progressInterval, formData, response, errorData, responseData, newImageData, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedFile) {
                        setError('Lütfen bir resim seçin');
                        return [2 /*return*/];
                    }
                    if (!uploadUrl) {
                        setError('Upload URL tanımlanmamış');
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    setProgress(0);
                    progressInterval = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    formData = new FormData();
                    formData.append('file', selectedFile);
                    formData.append('filename', selectedFile.name);
                    formData.append('content_type', selectedFile.type);
                    if (uploadContext) {
                        formData.append('uploadcontext', uploadContext);
                    }
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
                    return [4 /*yield*/, fetch(uploadUrl, {
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
                    return [4 /*yield*/, response.json()];
                case 5:
                    responseData = _a.sent();
                    if (responseData.data && responseData.data.list_image_url && responseData.data.detail_image_url) {
                        newImageData = {
                            list: responseData.data.list_image_url,
                            detail: responseData.data.detail_image_url
                        };
                        onImageUploaded(index, newImageData);
                    }
                    else {
                        throw new Error('Görsel URL\'leri alınamadı');
                    }
                    return [3 /*break*/, 8];
                case 6:
                    err_1 = _a.sent();
                    console.error('Yükleme hatası:', err_1);
                    if (err_1 instanceof Error) {
                        setError(err_1.message);
                    }
                    else {
                        setError('Resim yüklenirken bir hata oluştu');
                    }
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
        onImageRemoved(index);
    };
    // Bileşen kaldırıldığında önizleme URL'sini temizle
    useEffect(function () {
        return function () {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);
    return (React.createElement(Paper, { shadow: "xs", p: "xs", withBorder: true, radius: "md", bg: "#f9f9f9", pos: "relative", w: typeof width === 'number' ? width : width, h: height, style: { overflow: 'hidden', minWidth: typeof width === 'number' ? width : 'auto' } },
        !imageData && !preview && (React.createElement(Dropzone, { onDrop: handleDrop, onReject: function () { return setError('Dosya reddedildi'); }, maxSize: maxSize || 5 * 1024 * 1024, accept: acceptedFileTypes || ['image/png', 'image/jpeg', 'image/webp'], multiple: false, disabled: loading, w: "100%", h: "100%", mx: "auto", style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            } },
            React.createElement(Group, { justify: "center", style: { pointerEvents: 'none' } },
                React.createElement(Box, { ta: "center" },
                    React.createElement(IconUpload, { style: { color: 'var(--mantine-color-gray-6)', marginBottom: '10px' } }),
                    React.createElement(Text, { size: "xs", fw: 500 }, "G\u00F6rsel Y\u00FCkle"))))),
        !imageData && preview && (React.createElement(Box, { ta: "center", mx: "auto", w: "100%", h: "100%", display: "flex", style: { alignItems: 'center', justifyContent: 'center' }, pos: "relative", onMouseEnter: function () { return setShowOverlay(true); }, onMouseLeave: function () { return setShowOverlay(false); } },
            React.createElement(MantineImage, { src: preview, alt: "\u00D6nizleme ".concat(index + 1), fit: "contain", w: "auto", h: "auto", style: {
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    borderRadius: '5px'
                }, radius: "md" }),
            showOverlay && (React.createElement(Box, { pos: "absolute", top: 0, left: 0, right: 0, bottom: 0, style: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '5px'
                } },
                React.createElement(Button, { onClick: resetUpload, variant: "outline", color: "white", size: "xs" },
                    React.createElement(IconTrash, { size: 16 })))))),
        imageData && (React.createElement(Box, { ta: "center", mx: "auto", w: "100%", h: "100%", display: "flex", style: { alignItems: 'center', justifyContent: 'center' }, pos: "relative", onMouseEnter: function () { return setShowOverlay(true); }, onMouseLeave: function () { return setShowOverlay(false); } },
            React.createElement(MantineImage, { src: imageData.list, alt: "G\u00F6rsel ".concat(index + 1), fit: "contain", w: "auto", h: "auto", style: {
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    borderRadius: '5px'
                }, radius: "md" }),
            showOverlay && (React.createElement(Box, { pos: "absolute", top: 0, left: 0, right: 0, bottom: 0, style: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '5px'
                } },
                React.createElement(Group, { gap: 5 },
                    React.createElement(Dropzone, { onDrop: handleDrop, onReject: function () { return setError('Dosya reddedildi'); }, maxSize: maxSize || 5 * 1024 * 1024, accept: acceptedFileTypes || ['image/png', 'image/jpeg', 'image/webp'], multiple: false, disabled: loading, p: 0, style: {
                            border: 'none',
                            background: 'transparent'
                        } },
                        React.createElement(Button, { variant: "outline", color: "white", size: "xs" },
                            React.createElement(IconRefresh, { size: 16 }))),
                    React.createElement(Button, { onClick: resetUpload, variant: "outline", color: "white", size: "xs" },
                        React.createElement(IconTrash, { size: 16 })),
                    index > 0 && (React.createElement(ActionIcon, { size: "xs", color: "white", variant: "outline", onClick: function () { return onMoveImage(index, 'left'); } },
                        React.createElement(IconArrowLeft, { size: 16 }))),
                    index < totalImages - 1 && (React.createElement(ActionIcon, { size: "xs", color: "white", variant: "outline", onClick: function () { return onMoveImage(index, 'right'); } },
                        React.createElement(IconArrowRight, { size: 16 })))))))),
        loading && (React.createElement(Overlay, { color: "#fff", backgroundOpacity: 0.7, center: true, pos: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 },
            React.createElement(Loader, { color: "blue", size: "lg" }))),
        loading && (React.createElement(Progress, { value: progress, size: "xs", color: progress === 100 ? 'green' : 'blue', w: "100%", pos: "absolute", bottom: 0, left: 0, right: 0 })),
        error && (React.createElement(Text, { c: "red", size: "xs", ta: "center", pos: "absolute", bottom: 5, left: 0, right: 0 }, error))));
};
var UploadCollection = function (_a) {
    var field = _a.field, form = _a.form, globalStyle = _a.globalStyle, getHeaders = _a.getHeaders;
    // Local state ekleyelim
    var _b = useState([]), localImages = _b[0], setLocalImages = _b[1];
    // Form değerlerinden mevcut resimleri al
    var getImagesFromForm = function () {
        var formValue = form.values[field.field];
        if (Array.isArray(formValue)) {
            return __spreadArray([], formValue, true); // Dizinin kopyasını döndür
        }
        return [];
    };
    // Resimleri form değerlerine kaydet
    var saveImagesToForm = function (images) {
        // Önce local state'i güncelle
        setLocalImages(images);
        // Birleştirme yapmak yerine doğrudan yeni images dizisini kullan
        // Mevcut form değerlerini al
        console.log('images to save------>', images);
        // Yeni değerleri ayarla - doğrudan images dizisini kullan
        form.setFieldValue(field.field, images);
    };
    // Bileşen yüklendiğinde form değerini başlat ve local state'i ayarla
    useEffect(function () {
        if (!form.values[field.field]) {
            form.setFieldValue(field.field, []);
        }
        else {
            // Form değeri varsa, local state'i başlat
            setLocalImages(getImagesFromForm());
        }
    }, []);
    var handleImageUploaded = function (index, imageData) {
        // Local state'i kullanarak işlem yap
        var updatedImages = __spreadArray([], localImages, true); // Dizinin kopyasını oluştur
        // Eğer bu indekste zaten bir resim varsa, güncelle
        if (index < updatedImages.length) {
            updatedImages[index] = __assign({}, imageData); // Nesnenin kopyasını oluştur
        }
        else {
            // Yoksa ekle
            updatedImages.push(__assign({}, imageData)); // Nesnenin kopyasını oluştur
        }
        // Local state'i güncelle ve form'a kaydet
        setLocalImages(updatedImages);
        saveImagesToForm(updatedImages);
    };
    var handleImageRemoved = function (index) {
        // Local state'i kullanarak işlem yap
        var updatedImages = __spreadArray([], localImages, true); // Dizinin kopyasını oluştur
        updatedImages.splice(index, 1);
        // Local state'i güncelle ve form'a kaydet
        setLocalImages(updatedImages);
        saveImagesToForm(updatedImages);
    };
    var handleMoveImage = function (index, direction) {
        var _a, _b;
        // Local state'i kullanarak işlem yap
        var updatedImages = __spreadArray([], localImages, true); // Dizinin kopyasını oluştur
        if (direction === 'left' && index > 0) {
            // Resmi sola taşı (önceki yukarı taşıma işlemiyle aynı)
            _a = [
                __assign({}, updatedImages[index - 1]),
                __assign({}, updatedImages[index])
            ], updatedImages[index] = _a[0], updatedImages[index - 1] = _a[1];
        }
        else if (direction === 'right' && index < updatedImages.length - 1) {
            // Resmi sağa taşı (önceki aşağı taşıma işlemiyle aynı)
            _b = [
                __assign({}, updatedImages[index + 1]),
                __assign({}, updatedImages[index])
            ], updatedImages[index] = _b[0], updatedImages[index + 1] = _b[1];
        }
        // Local state'i güncelle ve form'a kaydet
        setLocalImages(updatedImages);
        saveImagesToForm(updatedImages);
    };
    var width = field.width || 150;
    var height = field.height || 150;
    // Local state'i kullan
    var images = localImages;
    var maxImages = field.maxImages || 10;
    // Her zaman maxImages kadar kutu göster
    var totalBoxes = maxImages;
    return (React.createElement("div", null,
        React.createElement(ScrollArea, { type: "scroll", scrollbarSize: 6, offsetScrollbars: true },
            React.createElement(Flex, { gap: "md", wrap: "nowrap", style: { overflowX: 'auto', paddingBottom: '10px' } }, Array.from({ length: totalBoxes }).map(function (_, index) { return (React.createElement(ImageUploadBox, { key: index, index: index, imageData: index < images.length ? images[index] : null, uploadUrl: field.uploadUrl || '', maxSize: field.maxSize, acceptedFileTypes: field.acceptedFileTypes, width: width, height: height, uploadContext: field.uploadContext, getHeaders: getHeaders, onImageUploaded: handleImageUploaded, onImageRemoved: handleImageRemoved, onMoveImage: handleMoveImage, totalImages: images.length })); }))),
        form.errors[field.field] && (React.createElement(Text, { c: "red", size: "xs", mt: "xs" }, form.errors[field.field]))));
};
export default UploadCollection;
