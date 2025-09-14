import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface NavigationBreadcrumbsProps {
  className?: string;
  customItems?: BreadcrumbItem[];
}

export function NavigationBreadcrumbs({ className, customItems }: NavigationBreadcrumbsProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) return customItems;

    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    const breadcrumbs: BreadcrumbItem[] = [
      { label: "Início", href: "/" }
    ];

    // Mapeamento de rotas para labels amigáveis
    const routeLabels: Record<string, string> = {
      'dashboard': 'Dashboard',
      'analytics': 'Analytics',
      'categories': 'Categorias',
      'parameters': 'Parâmetros',
      'products': 'Produtos',
      'tierlists': 'Tierlists',
      'create': 'Criar',
      'explore': 'Explorar',
      'pricing': 'Planos',
      'auth': 'Autenticação'
    };

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      
      breadcrumbs.push({
        label: routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: currentPath,
        isActive: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)}>
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.href}>
          {index === 0 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(item.href)}
              className="h-8 px-2 text-muted-foreground hover:text-primary"
            >
              <Home className="w-4 h-4" />
            </Button>
          ) : (
            <>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              {item.isActive ? (
                <span className="px-2 py-1 text-foreground font-medium">
                  {item.label}
                </span>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(item.href)}
                  className="h-8 px-2 text-muted-foreground hover:text-primary"
                >
                  {item.label}
                </Button>
              )}
            </>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

