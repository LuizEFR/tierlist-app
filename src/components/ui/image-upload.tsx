import React, { useState, useRef, useCallback } from "react";
import { Upload, X, Image, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onValidation?: (isValid: boolean) => void;
  className?: string;
  label?: string;
  placeholder?: string;
  multiple?: boolean;
}

export function ImageUpload({ 
  value = "", 
  onChange, 
  onValidation,
  className,
  label = "Imagem",
  placeholder = "Cole a URL da imagem ou arraste uma imagem aqui",
  multiple = false
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [previewUrl, setPreviewUrl] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateImageUrl = useCallback(async (url: string) => {
    if (!url) {
      setIsValid(null);
      setPreviewUrl("");
      onValidation?.(false);
      return;
    }

    setIsValidating(true);
    
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      const isValidImage = await new Promise((resolve) => {
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });

      if (isValidImage) {
        setIsValid(true);
        setPreviewUrl(url);
        onValidation?.(true);
      } else {
        setIsValid(false);
        setPreviewUrl("");
        onValidation?.(false);
      }
    } catch (error) {
      setIsValid(false);
      setPreviewUrl("");
      onValidation?.(false);
    } finally {
      setIsValidating(false);
    }
  }, [onValidation]);

  const handleUrlChange = (url: string) => {
    onChange(url);
    validateImageUrl(url);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        handleUrlChange(result);
      };
      reader.readAsDataURL(imageFile);
    }
  }, []);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        handleUrlChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    onChange("");
    setPreviewUrl("");
    setIsValid(null);
    onValidation?.(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {label && <Label className="text-sm font-medium">{label}</Label>}
      
      {/* URL Input */}
      <div className="relative">
        <Input
          type="url"
          placeholder="https://exemplo.com/imagem.jpg"
          value={value}
          onChange={(e) => handleUrlChange(e.target.value)}
          className={cn(
            "pr-10",
            isValid === true && "border-green-500",
            isValid === false && "border-red-500"
          )}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isValidating ? (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : isValid === true ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : isValid === false ? (
            <AlertCircle className="w-4 h-4 text-red-500" />
          ) : null}
        </div>
      </div>

      {/* Drag & Drop Area */}
      <Card
        className={cn(
          "relative border-2 border-dashed transition-all duration-300 cursor-pointer hover:border-primary/50",
          isDragging && "border-primary bg-primary/5",
          "min-h-[200px] flex flex-col items-center justify-center p-6"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleFileSelect}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          multiple={multiple}
        />

        {previewUrl ? (
          <div className="relative w-full h-full min-h-[150px] group">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileSelect();
                  }}
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Alterar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearImage();
                  }}
                >
                  <X className="w-4 h-4 mr-1" />
                  Remover
                </Button>
              </div>
            </div>
            {isValid === true && (
              <Badge className="absolute top-2 right-2 bg-green-500">
                <Check className="w-3 h-3 mr-1" />
                Válida
              </Badge>
            )}
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center mx-auto transition-colors",
              isDragging ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              <Image className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {isDragging ? "Solte a imagem aqui" : placeholder}
              </p>
              <p className="text-xs text-muted-foreground">
                Suporta: JPG, PNG, GIF, WebP (máx. 10MB)
              </p>
            </div>
            <Button variant="outline" size="sm" type="button">
              <Upload className="w-4 h-4 mr-2" />
              Selecionar Arquivo
            </Button>
          </div>
        )}
      </Card>

      {/* Validation Messages */}
      {isValid === false && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span>URL de imagem inválida ou inacessível</span>
        </div>
      )}
    </div>
  );
}

