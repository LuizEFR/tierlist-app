import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Home, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
  showBackButton?: boolean;
  backTo?: string;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
  className?: string;
}

export function PageHeader({
  title,
  description,
  children,
  breadcrumbs,
  showBackButton = true,
  backTo,
  badge,
  className
}: PageHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      // Lógica inteligente para voltar
      const currentPath = location.pathname;
      
      if (currentPath.includes('/dashboard/tierlists/create')) {
        navigate('/dashboard/tierlists');
      } else if (currentPath.includes('/dashboard/')) {
        // Se estiver em uma página de dashboard, volta para analytics
        navigate('/dashboard/analytics');
      } else if (currentPath.includes('/tierlist/')) {
        navigate('/explore');
      } else {
        // Fallback para página inicial
        navigate('/');
      }
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className={cn("space-y-4 animate-fade-in", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHome}
            className="h-6 px-2 hover:text-primary"
          >
            <Home className="w-3 h-3" />
          </Button>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <span>/</span>
              {crumb.href ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(crumb.href!)}
                  className="h-6 px-2 hover:text-primary"
                >
                  {crumb.label}
                </Button>
              ) : (
                <span className="text-foreground font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Header Content */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="hover-lift mt-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground gradient-text">
                {title}
              </h1>
              {badge && (
                <Badge 
                  variant={badge.variant || "outline"} 
                  className="glass-effect"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {badge.text}
                </Badge>
              )}
            </div>
            {description && (
              <p className="text-muted-foreground max-w-2xl">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        {children && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

