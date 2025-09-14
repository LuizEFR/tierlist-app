import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, X, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  description?: string;
  color?: string;
}

interface AdvancedSelectProps {
  options: Option[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  multiple?: boolean;
  creatable?: boolean;
  onCreateOption?: (label: string) => void;
  className?: string;
  disabled?: boolean;
  maxHeight?: number;
}

export function AdvancedSelect({
  options,
  value,
  onChange,
  placeholder = "Selecione uma opção...",
  searchPlaceholder = "Buscar opções...",
  multiple = false,
  creatable = false,
  onCreateOption,
  className,
  disabled = false,
  maxHeight = 200
}: AdvancedSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedValues = multiple 
    ? (Array.isArray(value) ? value : [])
    : (value ? [value as string] : []);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canCreateNew = creatable && searchTerm && 
    !filteredOptions.some(opt => opt.label.toLowerCase() === searchTerm.toLowerCase());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValue = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange(newValue);
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearchTerm("");
    }
    setHighlightedIndex(-1);
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple) {
      const newValue = selectedValues.filter(v => v !== optionValue);
      onChange(newValue);
    } else {
      onChange("");
    }
  };

  const handleCreateNew = () => {
    if (canCreateNew && onCreateOption) {
      onCreateOption(searchTerm);
      setSearchTerm("");
      setHighlightedIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    const totalOptions = filteredOptions.length + (canCreateNew ? 1 : 0);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < totalOptions - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : totalOptions - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          if (highlightedIndex < filteredOptions.length) {
            handleSelect(filteredOptions[highlightedIndex].value);
          } else if (canCreateNew) {
            handleCreateNew();
          }
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
        break;
    }
  };

  const getSelectedLabels = () => {
    return selectedValues.map(val => 
      options.find(opt => opt.value === val)?.label || val
    );
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Button
        type="button"
        variant="outline"
        className={cn(
          "w-full justify-between text-left font-normal",
          !selectedValues.length && "text-muted-foreground",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      >
        <div className="flex flex-wrap gap-1 flex-1 min-w-0">
          {selectedValues.length === 0 ? (
            <span className="truncate">{placeholder}</span>
          ) : multiple ? (
            selectedValues.map(val => {
              const option = options.find(opt => opt.value === val);
              return (
                <Badge
                  key={val}
                  variant="secondary"
                  className="text-xs"
                  style={option?.color ? { backgroundColor: option.color + "20", color: option.color } : {}}
                >
                  {option?.label || val}
                  <X
                    className="w-3 h-3 ml-1 hover:bg-muted-foreground/20 rounded-full cursor-pointer"
                    onClick={(e) => handleRemove(val, e)}
                  />
                </Badge>
              );
            })
          ) : (
            <span className="truncate">{getSelectedLabels()[0]}</span>
          )}
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </Button>

      {isOpen && (
        <Card className="absolute z-50 w-full mt-1 p-0 shadow-lg border">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setHighlightedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                className="pl-8 h-8"
              />
            </div>
          </div>

          <div 
            className="max-h-60 overflow-y-auto"
            style={{ maxHeight: `${maxHeight}px` }}
          >
            {filteredOptions.length === 0 && !canCreateNew ? (
              <div className="p-3 text-sm text-muted-foreground text-center">
                Nenhuma opção encontrada
              </div>
            ) : (
              <>
                {filteredOptions.map((option, index) => {
                  const isSelected = selectedValues.includes(option.value);
                  const isHighlighted = index === highlightedIndex;
                  
                  return (
                    <div
                      key={option.value}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 cursor-pointer text-sm transition-colors",
                        isHighlighted && "bg-accent",
                        isSelected && "bg-primary/10"
                      )}
                      onClick={() => handleSelect(option.value)}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {option.color && (
                          <div 
                            className="w-3 h-3 rounded-full border"
                            style={{ backgroundColor: option.color }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{option.label}</div>
                          {option.description && (
                            <div className="text-xs text-muted-foreground truncate">
                              {option.description}
                            </div>
                          )}
                        </div>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  );
                })}

                {canCreateNew && (
                  <div
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 cursor-pointer text-sm transition-colors border-t",
                      highlightedIndex === filteredOptions.length && "bg-accent"
                    )}
                    onClick={handleCreateNew}
                  >
                    <Plus className="h-4 w-4 text-primary" />
                    <span>Criar "<strong>{searchTerm}</strong>"</span>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

