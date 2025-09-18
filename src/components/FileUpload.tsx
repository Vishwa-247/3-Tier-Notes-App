import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Upload, X, FileIcon, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  uploadProgress?: number;
  isUploading?: boolean;
  accept?: string;
  maxSize?: number; // in MB
}

export const FileUpload = ({
  onFileSelect,
  onFileRemove,
  selectedFile,
  uploadProgress = 0,
  isUploading = false,
  accept = "image/*,application/pdf,.doc,.docx,.txt",
  maxSize = 10,
}: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    onFileSelect(file);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-8 h-8 text-primary" />;
    }
    return <FileIcon className="w-8 h-8 text-muted-foreground" />;
  };

  const getFilePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      return (
        <img
          src={url}
          alt="Preview"
          className="w-20 h-20 object-cover rounded"
          onLoad={() => URL.revokeObjectURL(url)}
        />
      );
    }
    return getFileIcon(file);
  };

  if (selectedFile) {
    return (
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          {getFilePreview(selectedFile)}
          <div className="flex-1">
            <p className="font-medium text-sm truncate">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            {isUploading && (
              <div className="mt-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
          {!isUploading && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onFileRemove}
              className="text-destructive hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
        isDragOver ? "border-primary bg-accent" : "border-border hover:border-muted-foreground"
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleFileInputChange}
      />
      
      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">Upload a file</h3>
      <p className="text-muted-foreground mb-4">
        Drag and drop your file here, or click to browse
      </p>
      <p className="text-xs text-muted-foreground">
        Supports images, PDFs, and documents (max {maxSize}MB)
      </p>
      <Button variant="outline" className="mt-4">
        Choose File
      </Button>
    </div>
  );
};