import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { ArrowLeft, Heart, Eye, Share2, Sparkles, Package } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

interface TierList {
  id: string;
  title: string;
  description: string | null;
  category_id: string;
  is_public: boolean;
  tiers: any;
  user_id: string;
  created_at: string;
  likes: number;
  views: number;
  liked_by?: string[];
  expert_analysis?: {
    methodology?: string;
    evaluation_criteria?: string;
    key_insights?: string;
    market_context?: string;
    recommendations?: string;
    limitations?: string;
  };
}

interface Product {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
}

const TierListViewSimple = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [tierList, setTierList] = useState<TierList | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);

  const getProduct = (productId: string): Product | null => {
    return products.find(p => p.id === productId) || null;
  };

  const fetchProducts = async (categoryId: string) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", categoryId);

      if (error) {
        console.error("Erro ao buscar produtos:", error);
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  useEffect(() => {
    const fetchTierList = async () => {
      if (!id) {
        setError("ID da tierlist não encontrado");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("tier_lists")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error("Tierlist não encontrada");
        }

        setTierList(data);
        setLikesCount(data.likes || 0);
        setViewsCount(data.views || 0);
        
        // Buscar produtos da categoria
        await fetchProducts(data.category_id);
        
        // Incrementar views
        await incrementViews();
        
        // Verificar se o usuário já curtiu
        if (user) {
          await checkIfLiked();
        }
      } catch (err: any) {
        console.error("Erro ao buscar tierlist:", err);
        setError(err.message || "Erro ao carregar tierlist");
      } finally {
        setLoading(false);
      }
    };

    fetchTierList();
  }, [id, user]);

  const incrementViews = async () => {
    if (!id) return;
    
    try {
      // Incrementar views diretamente na tabela tier_lists
      const { error } = await supabase
        .from('tier_lists')
        .update({ views: (tierList?.views || 0) + 1 })
        .eq('id', id);
      
      if (error) {
        console.error('Erro ao incrementar views:', error);
      } else {
        setViewsCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Erro ao incrementar views:', error);
    }
  };

  const checkIfLiked = async () => {
    if (!id || !user) return;
    
    try {
      // Por enquanto, vamos simular o estado de like baseado no localStorage
      const likedTierlists = JSON.parse(localStorage.getItem('likedTierlists') || '[]');
      setIsLiked(likedTierlists.includes(id));
    } catch (error) {
      console.error('Erro ao verificar like:', error);
      setIsLiked(false);
    }
  };

  const handleLike = async () => {
    if (!user || !id || !tierList) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para curtir.",
        variant: "destructive",
      });
      return;
    }

    try {
      const likedTierlists = JSON.parse(localStorage.getItem('likedTierlists') || '[]');
      let newLikesCount;

      if (isLiked) {
        // Remover like
        const updatedLiked = likedTierlists.filter((tierlistId: string) => tierlistId !== id);
        localStorage.setItem('likedTierlists', JSON.stringify(updatedLiked));
        newLikesCount = Math.max((tierList.likes || 0) - 1, 0);
        
        setIsLiked(false);
        setLikesCount(newLikesCount);
      } else {
        // Adicionar like
        const updatedLiked = [...likedTierlists, id];
        localStorage.setItem('likedTierlists', JSON.stringify(updatedLiked));
        newLikesCount = (tierList.likes || 0) + 1;
        
        setIsLiked(true);
        setLikesCount(newLikesCount);
      }

      // Atualizar contador no banco de dados
      const { error } = await supabase
        .from('tier_lists')
        .update({ likes: newLikesCount })
        .eq('id', id);
        
      if (error) {
        throw error;
      }

      // Atualizar estado local
      setTierList(prev => prev ? {
        ...prev,
        likes: newLikesCount
      } : null);

      toast({
        title: isLiked ? "Like removido!" : "Tierlist curtida!",
        description: isLiked ? "Você removeu seu like desta tierlist." : "Obrigado por curtir esta tierlist!",
      });

    } catch (error) {
      console.error('Erro ao curtir:', error);
      
      // Reverter estado em caso de erro
      setIsLiked(!isLiked);
      setLikesCount(tierList.likes || 0);
      
      toast({
        title: "Erro",
        description: "Não foi possível curtir a tierlist. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Carregando...</h2>
          <p className="text-muted-foreground">Aguarde enquanto carregamos sua tierlist</p>
        </div>
      </div>
    );
  }

  if (error || !tierList) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Erro</h2>
          <p className="text-muted-foreground mb-4">{error || "Tierlist não encontrada"}</p>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <h1 className="text-4xl font-bold mb-4">{tierList.title}</h1>
          
          {tierList.description && (
            <p className="text-lg text-muted-foreground mb-6">
              {tierList.description}
            </p>
          )}
          
          <div className="flex items-center gap-6 text-sm">
            <Button
              variant={isLiked ? "default" : "outline"}
              size="sm"
              onClick={handleLike}
              className="flex items-center gap-2"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
            </Button>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye className="w-4 h-4" />
              {viewsCount} {viewsCount === 1 ? 'Visualização' : 'Visualizações'}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast({
                  title: "Link copiado!",
                  description: "O link da tierlist foi copiado para a área de transferência.",
                });
              }}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Compartilhar
            </Button>
            
            <span className="text-muted-foreground">
              Criado em: {new Date(tierList.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Análise de Especialista */}
        {tierList.expert_analysis && Object.values(tierList.expert_analysis).some(value => value && value.trim()) && (
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              Análise de Especialista
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tierList.expert_analysis.methodology && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-primary">Metodologia de Avaliação</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {tierList.expert_analysis.methodology}
                  </p>
                </div>
              )}
              
              {tierList.expert_analysis.evaluation_criteria && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-primary">Critérios de Avaliação</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {tierList.expert_analysis.evaluation_criteria}
                  </p>
                </div>
              )}
              
              {tierList.expert_analysis.key_insights && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-primary">Insights Principais</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {tierList.expert_analysis.key_insights}
                  </p>
                </div>
              )}
              
              {tierList.expert_analysis.market_context && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-primary">Contexto de Mercado</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {tierList.expert_analysis.market_context}
                  </p>
                </div>
              )}
              
              {tierList.expert_analysis.recommendations && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-primary">Recomendações</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {tierList.expert_analysis.recommendations}
                  </p>
                </div>
              )}
              
              {tierList.expert_analysis.limitations && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-primary">Limitações da Análise</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {tierList.expert_analysis.limitations}
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Renderização Visual dos Tiers */}
        <div className="space-y-4 mb-8">
          {Object.entries(tierList.tiers || {}).map(([tierName, productIds]) => {
            const tierColors = {
              S: "bg-blue-500",
              A: "bg-green-500", 
              B: "bg-yellow-500",
              C: "bg-orange-500",
              D: "bg-red-500"
            };
            
            const colorClass = tierColors[tierName as keyof typeof tierColors] || "bg-gray-500";
            
            return (
              <Card key={tierName} className="overflow-hidden">
                <div className="flex">
                  <div className={`${colorClass} text-white font-bold text-2xl flex items-center justify-center w-20 min-h-[120px]`}>
                    {tierName}
                  </div>
                  <div className="flex-1 p-4 min-h-[120px] flex flex-wrap gap-2 items-start content-start">
                    {Array.isArray(productIds) && productIds.length > 0 ? (
                      productIds.map((productId: string, index: number) => {
                        const product = getProduct(productId);
                        return (
                          <div
                            key={`${productId}-${index}`}
                            className="w-20 h-20 bg-card border rounded-lg p-1 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow"
                          >
                            {product?.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-8 h-8 object-cover rounded mb-1"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-muted rounded flex items-center justify-center mb-1">
                                <Package className="w-4 h-4 text-muted-foreground" />
                              </div>
                            )}
                            <span className="text-xs text-foreground truncate w-full" title={product?.name || `Produto ${productId.slice(-4)}`}>
                              {product?.name || `Produto ${productId.slice(-4)}`}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                        Nenhum produto neste tier
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Dados Técnicos Expandidos */}
        <Card className="p-6">
          <details className="group">
            <summary className="cursor-pointer text-xl font-bold mb-4 flex items-center gap-2">
              <span className="group-open:rotate-90 transition-transform">▶</span>
              Dados Técnicos da Tierlist
            </summary>
            <div className="space-y-6 mt-4">
              
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-primary">Informações Básicas</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>ID:</strong> <code className="bg-muted px-1 rounded">{tierList.id}</code></p>
                    <p><strong>Categoria ID:</strong> <code className="bg-muted px-1 rounded">{tierList.category_id}</code></p>
                    <p><strong>Usuário ID:</strong> <code className="bg-muted px-1 rounded">{tierList.user_id}</code></p>
                    <p><strong>Visibilidade:</strong> <span className={`px-2 py-1 rounded text-xs ${tierList.is_public ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {tierList.is_public ? 'Pública' : 'Privada'}
                    </span></p>
                    <p><strong>Data de Criação:</strong> {new Date(tierList.created_at).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-primary">Estatísticas</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Total de Likes:</strong> <span className="text-blue-600 font-medium">{likesCount}</span></p>
                    <p><strong>Total de Visualizações:</strong> <span className="text-green-600 font-medium">{viewsCount}</span></p>
                    <p><strong>Produtos Classificados:</strong> <span className="text-purple-600 font-medium">
                      {Object.values(tierList.tiers || {}).flat().length}
                    </span></p>
                    <p><strong>Tiers Utilizados:</strong> <span className="text-orange-600 font-medium">
                      {Object.entries(tierList.tiers || {}).filter(([_, products]) => Array.isArray(products) && products.length > 0).length}
                    </span></p>
                    <p><strong>Taxa de Engajamento:</strong> <span className="text-indigo-600 font-medium">
                      {viewsCount > 0 ? ((likesCount / viewsCount) * 100).toFixed(1) : 0}%
                    </span></p>
                  </div>
                </div>
              </div>

              {/* Distribuição por Tiers */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary">Distribuição por Tiers</h3>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(tierList.tiers || {}).map(([tierName, productIds]) => {
                    const count = Array.isArray(productIds) ? productIds.length : 0;
                    const tierColors = {
                      S: "bg-blue-500",
                      A: "bg-green-500", 
                      B: "bg-yellow-500",
                      C: "bg-orange-500",
                      D: "bg-red-500"
                    };
                    const colorClass = tierColors[tierName as keyof typeof tierColors] || "bg-gray-500";
                    
                    return (
                      <div key={tierName} className="text-center">
                        <div className={`${colorClass} text-white font-bold text-lg rounded-t px-2 py-1`}>
                          {tierName}
                        </div>
                        <div className="bg-muted rounded-b px-2 py-1 text-sm">
                          {count} {count === 1 ? 'produto' : 'produtos'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Produtos por Categoria */}
              {products.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-primary">Produtos da Categoria</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {products.slice(0, 6).map((product) => (
                      <div key={product.id} className="bg-muted rounded-lg p-3 text-sm">
                        <div className="flex items-center gap-2 mb-2">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-8 h-8 object-cover rounded"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-background rounded flex items-center justify-center">
                              <Package className="w-4 h-4 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground truncate">ID: {product.id.slice(-8)}</p>
                          </div>
                        </div>
                        {product.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                        )}
                      </div>
                    ))}
                    {products.length > 6 && (
                      <div className="bg-muted rounded-lg p-3 text-sm flex items-center justify-center text-muted-foreground">
                        +{products.length - 6} produtos adicionais
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Estrutura JSON dos Tiers */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary">Estrutura dos Tiers (JSON)</h3>
                <pre className="bg-muted p-4 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(tierList.tiers, null, 2)}
                </pre>
              </div>

              {/* Informações de Debug */}
              <details className="border-t pt-4">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground mb-2">
                  Informações de Debug
                </summary>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><strong>Timestamp de Carregamento:</strong> {new Date().toISOString()}</p>
                  <p><strong>Produtos Carregados:</strong> {products.length}</p>
                  <p><strong>Estado de Like:</strong> {isLiked ? 'Curtido' : 'Não curtido'}</p>
                  <p><strong>Usuário Logado:</strong> {user ? 'Sim' : 'Não'}</p>
                  <p><strong>ID do Usuário:</strong> {user?.id || 'N/A'}</p>
                  <p><strong>Likes Locais:</strong> {JSON.parse(localStorage.getItem('likedTierlists') || '[]').length} tierlists curtidas</p>
                </div>
              </details>
            </div>
          </details>
        </Card>
      </div>
    </div>
  );
};

export default TierListViewSimple;

