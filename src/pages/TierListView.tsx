import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import TierRow from "@/components/TierRow";
import ProductCardEnhanced from "@/components/ProductCardEnhanced";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ThumbsUp, Share2, Eye, Calendar, Award, Crown } from "lucide-react";

interface Parameter {
  id: string;
  name: string;
  parameter_type: string;
  options?: any;
}

interface Product {
  id: string;
  name: string;
  image_url: string | null;
  description: string | null;
  specifications?: any;
  parameter_values?: any;
  category?: {
    name: string;
  };
}

interface TierList {
  id: string;
  title: string;
  description: string | null;
  category: string;
  is_public: boolean;
  likes: number;
  views: number;
  created_at: string;
  tiers: {
    S: string[];
    A: string[];
    B: string[];
    C: string[];
    D: string[];
  };
}

const TierListView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hasLiked, setHasLiked] = useState(false);
  const [tierList, setTierList] = useState<TierList | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchTierList();
    }
  }, [id]);

  const fetchTierList = async () => {
    try {
      // Buscar tierlist
      const { data: tierListData, error: tierListError } = await supabase
        .from('tierlists')
        .select(`
          id,
          title,
          description,
          is_public,
          likes,
          views,
          created_at,
          tiers,
          categories:category_id (name)
        `)
        .eq('id', id)
        .single();

      if (tierListError) throw tierListError;

      if (!tierListData) {
        setLoading(false);
        return;
      }

      // Buscar produtos da categoria
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          image_url,
          description,
          specifications,
          parameter_values,
          categories:category_id (name)
        `)
        .eq('category_id', tierListData.category_id);

      if (productsError) throw productsError;

      // Buscar parâmetros da categoria
      const { data: parametersData, error: parametersError } = await supabase
        .from('category_parameters')
        .select(`
          parameters:parameter_id (
            id,
            name,
            parameter_type,
            options
          )
        `)
        .eq('category_id', tierListData.category_id);

      if (parametersError) throw parametersError;

      setTierList({
        ...tierListData,
        category: tierListData.categories?.name || 'Categoria',
        tiers: tierListData.tiers || { S: [], A: [], B: [], C: [], D: [] }
      });
      setProducts(productsData || []);
      setParameters(parametersData?.map(cp => cp.parameters).filter(Boolean) || []);

    } catch (error) {
      console.error('Erro ao buscar tierlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProductsForTier = (tier: keyof typeof tierList.tiers) => {
    if (!tierList) return [];
    return tierList.tiers[tier].map(productId => 
      products.find(p => p.id === productId)
    ).filter(Boolean);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Carregando Tier List...</h1>
        </div>
      </div>
    );
  }
  
  if (!tierList) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tier List não encontrada</h1>
          <Button onClick={() => navigate("/")} variant="hero">
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }
  
  const getProductsForTier = (tier: keyof typeof tierList.tiers) => {
    return tierList.tiers[tier].map(productId => 
      allProducts.find(p => p.id === productId)
    ).filter(Boolean);
  };
  
  const handleLike = () => {
    setHasLiked(!hasLiked);
  };
  
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TechTier
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleLike}>
                <ThumbsUp className={`w-4 h-4 mr-2 ${hasLiked ? 'fill-current text-primary' : ''}`} />
                {tierList.likes + (hasLiked ? 1 : 0)}
              </Button>
              <Button variant="premium">
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {tierList.category}
                </Badge>
                <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                  <Award className="w-3 h-3 mr-1" />
                  Premium Quality
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
                {tierList.title}
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6 max-w-3xl">
                {tierList.description}
              </p>
              
              {/* Author Info */}
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-12 h-12 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {tierList.author.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-foreground">{tierList.author}</div>
                  <div className="text-sm text-muted-foreground">Expert em Keyboards</div>
                </div>
              </div>
            </div>
            
            {/* Stats Card */}
            <Card className="bg-gradient-card backdrop-blur-sm border-border p-6 min-w-[280px]">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{tierList.likes + (hasLiked ? 1 : 0)}</div>
                  <div className="text-xs text-muted-foreground">Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">{tierList.views}</div>
                  <div className="text-xs text-muted-foreground">Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{tierList.products}</div>
                  <div className="text-xs text-muted-foreground">Produtos</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Jan 2024</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        {/* Tier List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Ranking Completo</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span>Baseado em especificações técnicas e reviews detalhadas</span>
            </div>
          </div>
          
          {(['S', 'A', 'B', 'C', 'D'] as const).map(tier => {
            const tierProducts = getProductsForTier(tier);
            return (
              <TierRow key={tier} tier={tier}>
                {tierProducts.map(product => (
                  product && (
                    <ProductCardEnhanced
                      key={product.id}
                      product={product}
                      parameters={parameters}
                      draggable={false}
                      size="large"
                      showDetails={true}
                    />
                  )
                ))}
              </TierRow>
            );
          })}
        </div>
        
        {/* Analysis Section */}
        <Card className="bg-gradient-card backdrop-blur-sm border-border p-8 mt-12">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" />
            Análise do Expert
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-3 text-primary">S-Tier: Os Lendários</h4>
              <p className="text-muted-foreground mb-4">
                Leopold FC660M e HHKB Pro 2 representam o ápice da qualidade em teclados mecânicos. 
                Construção premium, switches excepcionais e layout otimizado para produtividade.
              </p>
              
              <h4 className="text-lg font-semibold mb-3 text-secondary">A-Tier: Excelência Comprovada</h4>
              <p className="text-muted-foreground">
                Ducky One 2 Mini e SteelSeries Apex Pro oferecem qualidade premium com inovações 
                técnicas que justificam o investimento para enthusiasts.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-3 text-tier-b">B-Tier: Escolhas Sólidas</h4>
              <p className="text-muted-foreground mb-4">
                Keychron K2 e Corsair K95 são opções confiáveis com boa relação custo-benefício, 
                ideais para gamers que buscam qualidade sem pagar premium.
              </p>
              
              <h4 className="text-lg font-semibold mb-3 text-tier-c">C-D Tier: Para Iniciantes</h4>
              <p className="text-muted-foreground">
                Boas opções de entrada, mas com compromissos em qualidade de construção 
                ou features que podem não satisfazer usuários mais exigentes.
              </p>
            </div>
          </div>
        </Card>
        
        {/* Related Tier Lists */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-6">Rankings Relacionados</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Gaming Mice Ultimate 2024", author: "MouseMaster", category: "Gaming Mice" },
              { title: "Best Budget Keyboards", author: "BudgetTech", category: "Budget Keyboards" },
              { title: "Premium Audio Setup", author: "AudioExpert", category: "Headsets" }
            ].map((related, index) => (
              <Card key={index} className="bg-gradient-card backdrop-blur-sm border-border p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer">
                <Badge variant="outline" className="mb-3">{related.category}</Badge>
                <h4 className="font-semibold mb-2">{related.title}</h4>
                <p className="text-sm text-muted-foreground">por {related.author}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TierListView;