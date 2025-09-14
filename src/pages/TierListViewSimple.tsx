import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { ArrowLeft, Heart, Eye, Share2, Sparkles } from "lucide-react";
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
  expert_analysis?: {
    methodology?: string;
    evaluation_criteria?: string;
    key_insights?: string;
    market_context?: string;
    recommendations?: string;
    limitations?: string;
  };
}

const TierListViewSimple = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [tierList, setTierList] = useState<TierList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);

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
      const { error } = await supabase.rpc('increment_views', {
        tierlist_id: id
      });
      
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
      const { data, error } = await supabase
        .from('tierlist_likes')
        .select('id')
        .eq('tierlist_id', id)
        .eq('user_id', user.id)
        .single();
        
      if (!error && data) {
        setIsLiked(true);
      }
    } catch (error) {
      // Usuário não curtiu ainda
      setIsLiked(false);
    }
  };

  const handleLike = async () => {
    if (!user || !id) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para curtir.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isLiked) {
        // Remover like
        const { error } = await supabase
          .from('tierlist_likes')
          .delete()
          .eq('tierlist_id', id)
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        setIsLiked(false);
        setLikesCount(prev => prev - 1);
        
        // Decrementar contador na tabela tier_lists
        await supabase.rpc('decrement_likes', { tierlist_id: id });
      } else {
        // Adicionar like
        const { error } = await supabase
          .from('tierlist_likes')
          .insert({
            tierlist_id: id,
            user_id: user.id
          });
          
        if (error) throw error;
        
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
        
        // Incrementar contador na tabela tier_lists
        await supabase.rpc('increment_likes', { tierlist_id: id });
      }
    } catch (error) {
      console.error('Erro ao curtir:', error);
      toast({
        title: "Erro",
        description: "Não foi possível curtir a tierlist.",
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

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Dados da Tierlist</h2>
          <div className="space-y-2">
            <p><strong>ID:</strong> {tierList.id}</p>
            <p><strong>Categoria ID:</strong> {tierList.category_id}</p>
            <p><strong>Usuário ID:</strong> {tierList.user_id}</p>
            <p><strong>Pública:</strong> {tierList.is_public ? 'Sim' : 'Não'}</p>
            <p><strong>Tiers:</strong></p>
            <pre className="bg-muted p-4 rounded text-sm overflow-auto">
              {JSON.stringify(tierList.tiers, null, 2)}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TierListViewSimple;

