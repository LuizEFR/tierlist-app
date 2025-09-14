import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown, Search, Filter, ThumbsUp, Eye, Calendar, TrendingUp, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";

type TierList = Tables<"tier_lists"> & {
  categories: {
    name: string;
  } | null;
};

const ExploreTierLists = () => {
  const [tierLists, setTierLists] = useState<TierList[]>([]);
  const [filteredTierLists, setFilteredTierLists] = useState<TierList[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");
  const [categories, setCategories] = useState<Tables<"categories">[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTierLists();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterAndSortTierLists();
  }, [tierLists, searchQuery, selectedCategory, sortBy]);

  const fetchTierLists = async () => {
    try {
      const { data, error } = await supabase
        .from("tier_lists")
        .select(`
          *,
          categories!inner (name)
        `)
        .eq("is_public", true);

      if (error) throw error;
      setTierLists(data || []);
    } catch (error) {
      console.error("Error fetching tier lists:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const filterAndSortTierLists = () => {
    let filtered = [...tierLists];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (tierList) =>
          tierList.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tierList.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tierList.categories?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((tierList) => tierList.category_id === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => (b.likes + b.views) - (a.likes + a.views));
        break;
      case "likes":
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case "views":
        filtered.sort((a, b) => b.views - a.views);
        break;
      case "recent":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default:
        break;
    }

    setFilteredTierLists(filtered);
  };

  const incrementViews = async (tierListId: string) => {
    try {
      await supabase
        .from("tier_lists")
        .update({ views: 1 })
        .eq("id", tierListId)
        .single();
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  const handleTierListClick = (tierListId: string) => {
    incrementViews(tierListId);
    navigate(`/tierlist/${tierListId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Carregando tier lists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TechTier
              </span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  Início
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="sm">
                  <Crown className="w-4 h-4 mr-2" />
                  Planos
                </Button>
              </Link>
              {!user && (
                <Link to="/auth">
                  <Button size="sm">
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
            Explore Tier Lists
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Descubra os melhores rankings criados pela comunidade. Encontre tier lists de tecnologia, 
            gaming e muito mais, baseados em análises detalhadas.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="bg-gradient-card backdrop-blur-sm border-border mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Pesquisar Tier Lists
            </CardTitle>
            <CardDescription>
              Use os filtros abaixo para encontrar exatamente o que procura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Pesquisar por título, descrição ou categoria..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Mais Populares</SelectItem>
                  <SelectItem value="likes">Mais Curtidas</SelectItem>
                  <SelectItem value="views">Mais Visualizadas</SelectItem>
                  <SelectItem value="recent">Mais Recentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Stats */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">
              {filteredTierLists.length} {filteredTierLists.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
            </h2>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <TrendingUp className="w-3 h-3 mr-1" />
              Em alta
            </Badge>
          </div>
        </div>

        {/* Tier Lists Grid */}
        {filteredTierLists.length === 0 ? (
          <Card className="bg-gradient-card backdrop-blur-sm border-border p-12 text-center">
            <div className="max-w-md mx-auto">
              <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma tier list encontrada</h3>
              <p className="text-muted-foreground mb-6">
                Tente ajustar seus filtros de pesquisa ou explorar diferentes categorias.
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}>
                Limpar Filtros
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTierLists.map((tierList) => (
              <Card
                key={tierList.id}
                className="bg-gradient-card backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 cursor-pointer group"
                onClick={() => handleTierListClick(tierList.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                      {tierList.categories?.name || "Categoria"}
                    </Badge>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {tierList.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {tierList.views}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {tierList.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {tierList.description || "Uma análise detalhada dos melhores produtos da categoria."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          U
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        Usuário
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(tierList.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreTierLists;