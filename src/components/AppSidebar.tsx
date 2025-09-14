import { useState } from "react";
import { 
  BarChart3, 
  Crown, 
  Plus, 
  List,
  LogOut,
  User,
  FolderPlus,
  Package,
  Layers,
  Settings
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  { 
    title: "Analytics", 
    url: "/dashboard/analytics", 
    icon: BarChart3,
    description: "Métricas e relatórios" 
  },
];

const cadastroItems = [
  { 
    title: "Categorias", 
    url: "/dashboard/categories", 
    icon: FolderPlus,
    description: "Gerenciar categorias"
  },
  { 
    title: "Parâmetros", 
    url: "/dashboard/parameters", 
    icon: Settings,
    description: "Gerenciar parâmetros"
  },
  { 
    title: "Produtos", 
    url: "/dashboard/products", 
    icon: Package,
    description: "Cadastrar produtos"
  },
  { 
    title: "Tierlists", 
    url: "/dashboard/tierlists/create", 
    icon: Plus,
    description: "Criar nova tierlist"
  },
];

const tierlistItems = [
  { 
    title: "Minhas Tierlists", 
    url: "/dashboard/tierlists", 
    icon: Layers,
    description: "Gerenciar tierlists"
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/50";

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
            <Crown className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-sidebar-foreground bg-gradient-primary bg-clip-text text-transparent">TechTier</h2>
              <p className="text-xs text-sidebar-foreground/60">Dashboard</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass}>
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Cadastros</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {cadastroItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass}>
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tierlists</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tierlistItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass}>
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {!collapsed && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-sidebar-accent rounded-lg border border-sidebar-border/50">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {profile?.full_name || user?.email}
                </p>
                <p className="text-xs text-primary/80 capitalize font-medium">
                  {profile?.subscription_tier || 'básico'}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={signOut}
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-primary transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        )}
        {collapsed && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={signOut}
            className="w-full justify-center text-sidebar-foreground hover:bg-sidebar-accent hover:text-primary transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        )}
        <SidebarTrigger className="ml-auto" />
      </SidebarFooter>
    </Sidebar>
  );
}