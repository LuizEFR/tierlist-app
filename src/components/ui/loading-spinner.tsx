import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Crown className={cn(sizeClasses[size], "text-primary animate-spin mb-2")} />
      {text && (
        <p className="text-muted-foreground text-sm">{text}</p>
      )}
    </div>
  );
}

