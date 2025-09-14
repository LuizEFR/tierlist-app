import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  Eye, 
  Layers, 
  Package, 
  TrendingUp, 
  Users,
  Crown
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AnalyticsData {
  totalTierLists: number;
  totalProducts: number;
  totalViews: number;
  totalLikes: number;
  categoryCount: number;
}

const TIER_LIMITS = {
  standard: { products: 50, tierlists: 5 },
  pro: { products: 200, tierlists: 25 },
  master: { products: 1000, tierlists: 100 }
};

export default function Analytics() {
  const { user, profile } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalTierLists: 0,
    totalProducts: 0,
    totalViews: 0,
    totalLikes: 0,
    categoryCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      const [tierListsResult, productsResult, categoriesResult] = await Promise.all([
        supabase
          .from('tier_lists')
          .select('views, likes')
          .eq('user_id', user!.id),
        supabase
          .from('products')
          .select('id')
          .eq('user_id', user!.id),
        supabase
          .from('categories')
          .select('id')
          .eq('user_id', user!.id)
      ]);

      const totalViews = tierListsResult.data?.reduce((sum, tl) => sum + (tl.views || 0), 0) || 0;
      const totalLikes = tierListsResult.data?.reduce((sum, tl) => sum + (tl.likes || 0), 0) || 0;

      setAnalytics({
        totalTierLists: tierListsResult.data?.length || 0,
        totalProducts: productsResult.data?.length || 0,
        totalViews,
        totalLikes,
        categoryCount: categoriesResult.data?.length || 0
      });
    } catch (error) {
      console.error('Erro ao buscar analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentTier = profile?.subscription_tier || 'standard';
  const limits = TIER_LIMITS[currentTier as keyof typeof TIER_LIMITS];
  const productUsagePercent = (analytics.totalProducts / limits.products) * 100;
  const tierlistUsagePercent = (analytics.totalTierLists / limits.tierlists) * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Crown className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">
            Acompanhe o desempenho das suas tierlists
          </p>
        </div>
        <Badge variant="outline" className="capitalize">
          <Crown className="w-3 h-3 mr-1" />
          {currentTier}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tierlists Criadas</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalTierLists}</div>
            <p className="text-xs text-muted-foreground">
              de {limits.tierlists} permitidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Cadastrados</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              de {limits.products} permitidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalViews}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              Engajamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Curtidas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalLikes}</div>
            <p className="text-xs text-muted-foreground">
              Interações positivas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Uso de Produtos</CardTitle>
            <CardDescription>
              Produtos cadastrados vs limite do plano
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Produtos utilizados</span>
                <span>{analytics.totalProducts}/{limits.products}</span>
              </div>
              <Progress value={productUsagePercent} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {productUsagePercent > 80 ? (
                  <span className="text-destructive">⚠️ Próximo do limite</span>
                ) : (
                  <span className="text-green-600">✓ Dentro do limite</span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uso de Tierlists</CardTitle>
            <CardDescription>
              Tierlists criadas vs limite do plano
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Tierlists utilizadas</span>
                <span>{analytics.totalTierLists}/{limits.tierlists}</span>
              </div>
              <Progress value={tierlistUsagePercent} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {tierlistUsagePercent > 80 ? (
                  <span className="text-destructive">⚠️ Próximo do limite</span>
                ) : (
                  <span className="text-green-600">✓ Dentro do limite</span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}