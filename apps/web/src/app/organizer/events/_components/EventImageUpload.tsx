// components/EventImageUploader.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { storage } from '@/config';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  StorageError,
} from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import Image from 'next/image'; // Use Next.js Image for optimization

interface EventImageUploaderProps {
  currentImageUrl?: string | null;
  onUploadComplete: (url: string | null) => void;
}
}

export function EventImageUploader({
  currentImageUrl,
  onUploadComplete,
}: EventImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl || null
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewUrl(currentImageUrl || null);
    if (!isUploading) {
      setFile(null);
    }
  }, [currentImageUrl, isUploading]);

  useEffect(() => {
    let objectUrl: string | null = null;
    if (file) {
      objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }

    // Cleanup function
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        setPreviewUrl((prev) =>
          prev === objectUrl ? currentImageUrl || null : prev
        );
      }
    };
  }, [file, currentImageUrl]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];

      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file (e.g., JPG, PNG).');
        setFile(null);
        setPreviewUrl(currentImageUrl || null);
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit.');
        setFile(null);
        setPreviewUrl(currentImageUrl || null);
        return;
      }

      setFile(selectedFile);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!file) {
      setError('No file selected.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    // --- Storage Path Strategy ---
    const filePath = `event-images/${Date.now()}-${file.name}`;
    // TODO: Create a structured path for the event image after the event is created
    // const filePath = `events/${eventId}/flyer-${file.name}`; // Ensure eventId is passed as prop

    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (uploadError) => {
        console.error('Upload failed:', uploadError);
        // Handle specific Firebase storage errors if needed
        // https://firebase.google.com/docs/storage/web/handle-errors
        setError(`Upload failed: ${uploadError.message}`);
        setIsUploading(false);
        setFile(null);
        setPreviewUrl(currentImageUrl || null);
        setUploadProgress(0);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('File available at', downloadURL);
          setPreviewUrl(downloadURL);
          onUploadComplete(downloadURL);
          setFile(null);
        } catch (getUrlError: any) {
          console.error('Failed to get download URL:', getUrlError);
          setError(`Failed to get download URL: ${getUrlError.message}`);
          setPreviewUrl(currentImageUrl || null);
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
        }
      }
    );
  };

  useEffect(() => {
    if (file) {
      handleUpload();
    }
  }, [file]);

  const handleRemoveImage = async () => {
    setError(null);
    setFile(null);
    setPreviewUrl(null);
    setIsUploading(false);
    setUploadProgress(0);
    onUploadComplete(null);

    if (currentImageUrl) {
      try {
        const imageRef = ref(storage, currentImageUrl);
        await deleteObject(imageRef);
        console.log('Existing image deleted from Firebase Storage.');
      } catch (deleteError: unknown) {
        if (
          deleteError instanceof StorageError &&
          deleteError.code !== 'storage/object-not-found'
        ) {
          console.error(
            'Failed to delete existing image from Firebase:',
            deleteError
          );
          setError(
            'Could not remove existing image from storage, but cleared from form.'
          );
        }
      }
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />

      <div className="w-full aspect-video border-2 border-dashed rounded-md flex items-center justify-center relative overflow-hidden bg-muted/30">
        {previewUrl ? (
          <>
            <Image
              src={previewUrl}
              alt="Event flyer preview"
              fill
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {!isUploading && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 z-10 h-7 w-7"
                onClick={handleRemoveImage}
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </>
        ) : (
          <div className="text-center p-4 text-muted-foreground">
            <ImageIcon className="mx-auto h-12 w-12 mb-2" />
            <p className="text-sm">No image selected</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={triggerFileInput}
              disabled={isUploading}
            >
              <UploadCloud className="mr-2 h-4 w-4" /> Select Image
            </Button>
          </div>
        )}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-20">
            <p className="text-white text-sm mb-2">Uploading...</p>
            <Progress value={uploadProgress} className="w-3/4 h-2" />
            <p className="text-white text-xs mt-1">
              {Math.round(uploadProgress)}%
            </p>
          </div>
        )}
      </div>

      {previewUrl && !isUploading && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={triggerFileInput}
          className="w-full"
        >
          <UploadCloud className="mr-2 h-4 w-4" /> Change Image
        </Button>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Upload Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
