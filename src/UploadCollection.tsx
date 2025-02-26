'use client';

import React, { useState, useEffect } from 'react';
import { Dropzone } from '@mantine/dropzone';
import { 
  Text, 
  Group, 
  Progress, 
  Box, 
  Loader, 
  Overlay,
  Image as MantineImage,
  Button,
  ActionIcon,
  SimpleGrid,
  Card,
  Flex,
  ScrollArea,
  Paper
} from '@mantine/core';
import { IconUpload, IconTrash, IconArrowLeft, IconArrowRight, IconPlus, IconRefresh } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

interface ImageData {
  list: string;
  detail: string;
}

interface UploadResponse {
  data: {
    success: boolean;
    list_image_url?: string;
    detail_image_url?: string;
    error?: string;
  };
  message: string;
  status_code: number;
}

export interface UploadCollectionProps {
  field: {
    field: string;
    title: string;
    required?: boolean;
    uploadUrl?: string;
    maxSize?: number;
    acceptedFileTypes?: string[];
    width?: number | string;
    height?: number;
    uploadContext?: string;
    maxImages?: number;
  };
  form: ReturnType<typeof useForm>;
  globalStyle?: React.CSSProperties;
  getHeaders?: () => Record<string, string>;
}

// Tek bir resim yükleme kutusu için bileşen
const ImageUploadBox: React.FC<{
  index: number;
  imageData: ImageData | null;
  uploadUrl: string;
  maxSize?: number;
  acceptedFileTypes?: string[];
  width: number | string;
  height: number;
  uploadContext?: string;
  getHeaders?: () => Record<string, string>;
  onImageUploaded: (index: number, imageData: ImageData) => void;
  onImageRemoved: (index: number) => void;
  onMoveImage: (index: number, direction: 'left' | 'right') => void;
  totalImages: number;
}> = ({ 
  index, 
  imageData, 
  uploadUrl, 
  maxSize, 
  acceptedFileTypes, 
  width,
  height,
  uploadContext,
  getHeaders,
  onImageUploaded,
  onImageRemoved,
  onMoveImage,
  totalImages
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [preview, setPreview] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  
  const handleDrop = async (files: File[]): Promise<void> => {
    if (files.length === 0) return;
    
    const selectedFile = files[0];
    setFile(selectedFile);
    
    // Dosya önizlemesi oluştur
    const previewUrl = URL.createObjectURL(selectedFile);
    setPreview(previewUrl);
    
    setError('');
    
    await uploadImage(selectedFile);
  };

  const uploadImage = async (selectedFile: File): Promise<void> => {
    if (!selectedFile) {
      setError('Lütfen bir resim seçin');
      return;
    }

    if (!uploadUrl) {
      setError('Upload URL tanımlanmamış');
      return;
    }

    setLoading(true);
    setProgress(0);
    
    let progressInterval: NodeJS.Timeout | null = null;
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      formData.append('filename', selectedFile.name);
      formData.append('content_type', selectedFile.type);
      
      if (uploadContext) {
        formData.append('uploadcontext', uploadContext);
      }
      
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            if (progressInterval) clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: getHeaders ? {
          ...Object.fromEntries(
            Object.entries(getHeaders()).filter(([key]) => key !== 'Content-Type')
          )
        } : {},
        body: formData,
        credentials: 'include',
        mode: 'cors'
      });

      if (progressInterval) clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || 'Yükleme başarısız oldu');
      }

      setProgress(100);
      
      const responseData: UploadResponse = await response.json();
      
      if (responseData.data && responseData.data.list_image_url && responseData.data.detail_image_url) {
        const newImageData = {
          list: responseData.data.list_image_url,
          detail: responseData.data.detail_image_url
        };
        
        onImageUploaded(index, newImageData);
      } else {
        throw new Error('Görsel URL\'leri alınamadı');
      }
      
    } catch (err) {
      console.error('Yükleme hatası:', err);
      
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Resim yüklenirken bir hata oluştu');
      }
    } finally {
      if (progressInterval) clearInterval(progressInterval);
      setLoading(false);
    }
  };

  const resetUpload = (): void => {
    setFile(null);
    setPreview('');
    onImageRemoved(index);
  };

  // Bileşen kaldırıldığında önizleme URL'sini temizle
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <Paper
      shadow="xs"
      p="xs"
      withBorder
      radius="md"
      bg="#f9f9f9"
      pos="relative"
      w={typeof width === 'number' ? width : width}
      h={height}
      style={{ overflow: 'hidden', minWidth: typeof width === 'number' ? width : 'auto' }}
    >
      {!imageData && !preview && (
        <Dropzone
          onDrop={handleDrop}
          onReject={() => setError('Dosya reddedildi')}
          maxSize={maxSize || 5 * 1024 * 1024}
          accept={acceptedFileTypes || ['image/png', 'image/jpeg', 'image/webp']}
          multiple={false}
          disabled={loading}
          w="100%"
          h="100%"
          mx="auto"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Group justify="center" style={{ pointerEvents: 'none' }}>
            <Box ta="center">
              <IconUpload style={{ color: 'var(--mantine-color-gray-6)', marginBottom: '10px' }} />
              <Text size="xs" fw={500}>
                Görsel Yükle
              </Text>
            </Box>
          </Group>
        </Dropzone>
      )}

      {/* Yükleme sırasında önizleme göster */}
      {!imageData && preview && (
        <Box 
          ta="center" 
          mx="auto" 
          w="100%" 
          h="100%" 
          display="flex" 
          style={{ alignItems: 'center', justifyContent: 'center' }}
          pos="relative"
          onMouseEnter={() => setShowOverlay(true)}
          onMouseLeave={() => setShowOverlay(false)}
        >
          <MantineImage
            src={preview}
            alt={`Önizleme ${index + 1}`}
            fit="contain"
            w="auto"
            h="auto"
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%', 
              objectFit: 'contain',
              borderRadius: '5px'
            }}
            radius="md"
          />
          
          {showOverlay && (
            <Box 
              pos="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '5px'
              }}
            >
              <Button
                onClick={resetUpload}
                variant="outline" 
                color="white"
                size="xs"
              >
                <IconTrash size={16} />
              </Button>
            </Box>
          )}
        </Box>
      )}

      {/* Yükleme tamamlandığında sunucudan gelen görseli göster */}
      {imageData && (
        <Box 
          ta="center" 
          mx="auto" 
          w="100%" 
          h="100%" 
          display="flex" 
          style={{ alignItems: 'center', justifyContent: 'center' }}
          pos="relative"
          onMouseEnter={() => setShowOverlay(true)}
          onMouseLeave={() => setShowOverlay(false)}
        >
          <MantineImage
            src={imageData.list}
            alt={`Görsel ${index + 1}`}
            fit="contain"
            w="auto"
            h="auto"
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%', 
              objectFit: 'contain',
              borderRadius: '5px'
            }}
            radius="md"
          />
          
          {showOverlay && (
            <Box 
              pos="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '5px'
              }}
            >
              <Group gap={5}>
                <Dropzone
                  onDrop={handleDrop}
                  onReject={() => setError('Dosya reddedildi')}
                  maxSize={maxSize || 5 * 1024 * 1024}
                  accept={acceptedFileTypes || ['image/png', 'image/jpeg', 'image/webp']}
                  multiple={false}
                  disabled={loading}
                  p={0}
                  style={{
                    border: 'none',
                    background: 'transparent'
                  }}
                >
                  <Button
                    variant="outline" 
                    color="white"
                    size="xs"
                  >
                    <IconRefresh size={16} />
                  </Button>
                </Dropzone>
                <Button
                  onClick={resetUpload}
                  variant="outline" 
                  color="white"
                  size="xs"
                >
                  <IconTrash size={16} />
                </Button>
                {index > 0 && (
                  <ActionIcon 
                    size="xs" 
                    color="white" 
                    variant="outline"
                    onClick={() => onMoveImage(index, 'left')}
                  >
                    <IconArrowLeft size={16} />
                  </ActionIcon>
                )}
                {index < totalImages - 1 && (
                  <ActionIcon 
                    size="xs" 
                    color="white" 
                    variant="outline"
                    onClick={() => onMoveImage(index, 'right')}
                  >
                    <IconArrowRight size={16} />
                  </ActionIcon>
                )}
              </Group>
            </Box>
          )}
        </Box>
      )}

      {loading && (
        <Overlay 
          color="#fff" 
          backgroundOpacity={0.7} 
          center 
          pos="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={10}
        >
          <Loader color="blue" size="lg" />
        </Overlay>
      )}
      
      {loading && (
        <Progress 
          value={progress} 
          size="xs" 
          color={progress === 100 ? 'green' : 'blue'} 
          w="100%"
          pos="absolute"
          bottom={0}
          left={0}
          right={0}
        />
      )}
      
      {error && (
        <Text c="red" size="xs" ta="center" pos="absolute" bottom={5} left={0} right={0}>
          {error}
        </Text>
      )}
    </Paper>
  );
};

const UploadCollection: React.FC<UploadCollectionProps> = ({ field, form, globalStyle, getHeaders }) => {
  // Local state ekleyelim
  const [localImages, setLocalImages] = useState<ImageData[]>([]);
  
  // Form değerlerinden mevcut resimleri al
  const getImagesFromForm = (): ImageData[] => {
    const formValue = form.values[field.field];
    if (Array.isArray(formValue)) {
      return [...formValue]; // Dizinin kopyasını döndür
    }
    return [];
  };
  
  // Resimleri form değerlerine kaydet
  const saveImagesToForm = (images: ImageData[]) => {
    // Önce local state'i güncelle
    setLocalImages(images);
    
    // Birleştirme yapmak yerine doğrudan yeni images dizisini kullan
    // Mevcut form değerlerini al
    console.log('images to save------>', images);
    
    // Yeni değerleri ayarla - doğrudan images dizisini kullan
    form.setFieldValue(field.field, images);
  };
  
  // Bileşen yüklendiğinde form değerini başlat ve local state'i ayarla
  useEffect(() => {
    if (!form.values[field.field]) {
      form.setFieldValue(field.field, []);
    } else {
      // Form değeri varsa, local state'i başlat
      setLocalImages(getImagesFromForm());
    }
  }, []);

  const handleImageUploaded = (index: number, imageData: ImageData) => {
    // Local state'i kullanarak işlem yap
    const updatedImages = [...localImages]; // Dizinin kopyasını oluştur
    
    // Eğer bu indekste zaten bir resim varsa, güncelle
    if (index < updatedImages.length) {
      updatedImages[index] = {...imageData}; // Nesnenin kopyasını oluştur
    } else {
      // Yoksa ekle
      updatedImages.push({...imageData}); // Nesnenin kopyasını oluştur
    }
    
    // Local state'i güncelle ve form'a kaydet
    setLocalImages(updatedImages);
    saveImagesToForm(updatedImages);
  };

  const handleImageRemoved = (index: number) => {
    // Local state'i kullanarak işlem yap
    const updatedImages = [...localImages]; // Dizinin kopyasını oluştur
    updatedImages.splice(index, 1);
    
    // Local state'i güncelle ve form'a kaydet
    setLocalImages(updatedImages);
    saveImagesToForm(updatedImages);
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    // Local state'i kullanarak işlem yap
    const updatedImages = [...localImages]; // Dizinin kopyasını oluştur
    
    if (direction === 'left' && index > 0) {
      // Resmi sola taşı (önceki yukarı taşıma işlemiyle aynı)
      [updatedImages[index], updatedImages[index - 1]] = [
        {...updatedImages[index - 1]}, // Nesnenin kopyasını oluştur
        {...updatedImages[index]} // Nesnenin kopyasını oluştur
      ];
    } else if (direction === 'right' && index < updatedImages.length - 1) {
      // Resmi sağa taşı (önceki aşağı taşıma işlemiyle aynı)
      [updatedImages[index], updatedImages[index + 1]] = [
        {...updatedImages[index + 1]}, // Nesnenin kopyasını oluştur
        {...updatedImages[index]} // Nesnenin kopyasını oluştur
      ];
    }
    
    // Local state'i güncelle ve form'a kaydet
    setLocalImages(updatedImages);
    saveImagesToForm(updatedImages);
  };

  const width = field.width || 150;
  const height = field.height || 150;
  // Local state'i kullan
  const images = localImages;
  const maxImages = field.maxImages || 10;

  // Her zaman maxImages kadar kutu göster
  const totalBoxes = maxImages;

  return (
    <div>
      <ScrollArea type="scroll" scrollbarSize={6} offsetScrollbars>
        <Flex gap="md" wrap="nowrap" style={{ overflowX: 'auto', paddingBottom: '10px' }}>
          {Array.from({ length: totalBoxes }).map((_, index) => (
            <ImageUploadBox
              key={index}
              index={index}
              imageData={index < images.length ? images[index] : null}
              uploadUrl={field.uploadUrl || ''}
              maxSize={field.maxSize}
              acceptedFileTypes={field.acceptedFileTypes}
              width={width}
              height={height}
              uploadContext={field.uploadContext}
              getHeaders={getHeaders}
              onImageUploaded={handleImageUploaded}
              onImageRemoved={handleImageRemoved}
              onMoveImage={handleMoveImage}
              totalImages={images.length}
            />
          ))}
        </Flex>
      </ScrollArea>
      
      {form.errors[field.field] && (
        <Text c="red" size="xs" mt="xs">
          {form.errors[field.field]}
        </Text>
      )}
    </div>
  );
};

export default UploadCollection; 