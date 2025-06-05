import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, File } from "lucide-react";

interface FileUploadProps {
  onUpload: (url: string) => void;
  accept?: string;
  maxSize?: number; // in bytes
  className?: string;
}

export default function FileUpload({ 
  onUpload, 
  accept = "*/*", 
  maxSize = 10 * 1024 * 1024, // 10MB default
  className 
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`,
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }

    // Simulate upload process
    simulateUpload(file);
  };

  const simulateUpload = async (file: File) => {
    setIsUploading(true);
    
    try {
      // In a real app, this would upload to a cloud storage service
      // For now, we'll create a mock URL
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate upload delay
      
      const mockUrl = `https://mock-cdn.com/uploads/${Date.now()}-${file.name}`;
      onUpload(mockUrl);
      
      toast({
        title: "Upload successful",
        description: "File has been uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`${className || ''}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
            isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">
            Click to upload or drag & drop
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {accept.includes('image') ? 'PNG, JPG' : 'Any file'} up to {Math.round(maxSize / (1024 * 1024))}MB
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {previewUrl ? (
            <div className="relative">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-32 object-cover rounded-lg border border-border"
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2 h-6 w-6 p-0"
                onClick={clearFile}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border">
              <div className="flex items-center space-x-2">
                <File className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate">{selectedFile.name}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={clearFile}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {isUploading && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>Uploading...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
