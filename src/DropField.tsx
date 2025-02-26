'use client';

import React, { useState } from 'react';
import { Dropzone } from '@mantine/dropzone';
import { 
  Text, 
  Group, 
  rem, 
  Progress, 
  Paper, 
  Box, 
  Loader, 
  Overlay,
  Image as MantineImage,
  Button,
  ActionIcon
} from '@mantine/core';
import { IconUpload, IconRefresh } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

interface UploadResponse {
  data: {
    success: boolean;
    list_image_url?: string;
    detail_image_url?: string;
    error?: string;
  };
  message: string;
  status_code: number;
  total: number | null;
  page: number | null;
  page_size: number | null;
}

export interface DropFieldProps {
  field: {
    field: string;
    title: string;
    required?: boolean;
    uploadUrl?: string;
    maxSize?: number;
    acceptedFileTypes?: string[];
    imageWidth?: number;
    imageHeight?: number;
    uploadContext?: string;
  };
  form: ReturnType<typeof useForm>;
  globalStyle?: React.CSSProperties;
  getHeaders?: () => Record<string, string>;
}

const DropField: React.FC<DropFieldProps> = ({ field, form, globalStyle, getHeaders }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<{
    list: string;
    detail: string;
  } | null>(null);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);

  React.useEffect(() => {
    if (form.values[field.field] && typeof form.values[field.field] === 'object') {
      const imageData = form.values[field.field];
      if (imageData.list && imageData.detail) {
        setImageUrls({
          list: imageData.list,
          detail: imageData.detail
        });
      }
    }
  }, [form.values, field.field]);

  const handleDrop = async (files: File[]): Promise<void> => {
    setError('');
    setUploadSuccess(false);
    setImageUrls(null);
    
    const selectedFile = files[0];
    setFile(selectedFile);
    
    const previewUrl = URL.createObjectURL(selectedFile);
    setPreview(previewUrl);
    
    await uploadImage(selectedFile);
  };

  const uploadImage = async (selectedFile: File): Promise<void> => {
    if (!selectedFile) {
      setError('Lütfen bir resim seçin');
      return;
    }

    if (!field.uploadUrl) {
      setError('Upload URL tanımlanmamış');
      return;
    }

    setLoading(true);
    setProgress(0);
    setImageUrls(null);
    setShowOverlay(false);
    
    let progressInterval: NodeJS.Timeout | null = null;
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      formData.append('filename', selectedFile.name);
      formData.append('content_type', selectedFile.type);
      
      if (field.uploadContext) {
        formData.append('uploadcontext', field.uploadContext);
        console.log('Upload Context:', field.uploadContext);
      }
      
      console.log('Uploading file:', selectedFile.name, 'Size:', selectedFile.size, 'Type:', selectedFile.type);
      console.log('Upload URL:', field.uploadUrl);
      
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            if (progressInterval) clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);

      const response = await fetch(field.uploadUrl, {
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
      setUploadSuccess(true);
      
      const responseData: UploadResponse = await response.json();
      console.log('Upload response:', responseData);
      
      if (responseData.data && responseData.data.list_image_url && responseData.data.detail_image_url) {
        const imageData = {
          list: responseData.data.list_image_url,
          detail: responseData.data.detail_image_url
        };
        
        setImageUrls(imageData);
        
        form.setFieldValue(field.field, imageData);
      } else {
        console.error('API yanıtında beklenen URL\'ler bulunamadı:', responseData);
        throw new Error('Görsel URL\'leri alınamadı');
      }
      
    } catch (err) {
      console.error('Yükleme hatası:', err);
      
      if (err instanceof Error) {
        setError(err.message);
        console.error('Hata mesajı:', err.message);
      } else if (typeof err === 'object' && err !== null) {
        console.error('Hata detayları:', JSON.stringify(err));
        setError('Resim yüklenirken bir hata oluştu');
      } else {
        setError('Resim yüklenirken bir hata oluştu');
      }
      
      form.setFieldValue(field.field, null);
    } finally {
      if (progressInterval) clearInterval(progressInterval);
      setLoading(false);
    }
  };

  const resetUpload = (): void => {
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

  const imageWidth = field.imageWidth || 200;
  const imageHeight = field.imageHeight || 200;

  return (
    <div>
      <Paper
        shadow="xs"
        p="xs"
        withBorder
        radius="md"
        bg="#f9f9f9"
        pos="relative"
        w={imageWidth}
        h={imageHeight}
        style={{ overflow: 'hidden' }}
      >
        {!imageUrls && (
          <Dropzone
            onDrop={handleDrop}
            onReject={() => setError('Dosya reddedildi')}
            maxSize={field.maxSize || 5 * 1024 * 1024} // Varsayılan 5MB
            accept={field.acceptedFileTypes || ['image/png', 'image/jpeg', 'image/webp']}
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
                  {field.title}
                </Text>
              </Box>
            </Group>
          </Dropzone>
        )}

        {imageUrls && (
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
              src={imageUrls.list}
              alt={field.title}
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
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
                >
                  <IconRefresh size={16} />
                </Button>
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

        {error && (
          <Text c="red" ta="center" mt="sm" size="xs">
            {error}
          </Text>
        )}

        {uploadSuccess && !imageUrls && (
          <Text c="green" ta="center" mt="sm" size="xs">
            Resim başarıyla işlendi, URL'ler alınıyor...
          </Text>
        )}
      </Paper>
      
      {loading && (
        <Progress 
          value={progress} 
          mt="xs" 
          size="sm" 
          color={progress === 100 ? 'green' : 'blue'} 
          w={imageWidth}
        />
      )}
    </div>
  );
};

export default DropField;
