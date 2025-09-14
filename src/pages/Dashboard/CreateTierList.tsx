import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { SearchInput } from "@/components/ui/search-input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { supabase } from "@/integrations/supabase/client";
import { Crown, ArrowLeft, Package, Filter, Sparkles } from "lucide-react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  image_url: string | null;
  description: string | null;
}

interface TierData {
  S: string[];
  A: string[];
  B: string[];
  C: string[];
  D: string[];
}

const tierColors = {
  S: "tier-s",
  A: "tier-a", 
  B: "tier-b",
  C: "tier-c",
  D: "tier-d"
};

export default function CreateTierList() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    is_public: true
  });
  
  const [tiers, setTiers] = useState<TierData>({
    S: [],
    A: [],
    B: [],
    C: [],
    D: []
  });
  
  const [unrankedProducts, setUnrankedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (user) {
      fetchCategories();
    }
  }, [user]);

  useEffect(() => {
    if (formData.category_id) {
      fetchProducts();
    }
  }, [formData.category_id]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('user_id', user!.id)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as categorias.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, image_url, description')
        .eq('category_id', formData.category_id)
        .order('name');

      if (error) throw error;
      
      const productData = data || [];
      setProducts(productData);
      setUnrankedProducts(productData.map(p => p.id));
      
      // Reset tiers when category changes
      setTiers({
        S: [],
        A: [],
        B: [],
        C: [],
        D: []
      });
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos.",
        variant: "destructive",
      });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find where the item currently is
    let sourceTier: string | null = null;
    let sourceIndex = -1;

    // Check unranked products
    if (unrankedProducts.includes(activeId)) {
      sourceTier = 'unranked';
      sourceIndex = unrankedProducts.indexOf(activeId);
    } else {
      // Check tiers
      Object.entries(tiers).forEach(([tier, items]) => {
        const index = items.indexOf(activeId);
        if (index !== -1) {
          sourceTier = tier;
          sourceIndex = index;
        }
      });
    }

    // Determine destination
    let destTier: string;
    let destIndex = 0;

    if (overId === 'unranked') {
      destTier = 'unranked';
      destIndex = unrankedProducts.length;
    } else if (Object.keys(tierColors).includes(overId)) {
      destTier = overId;
      destIndex = tiers[overId as keyof TierData].length;
    } else {
      // Dropping on an item, find which tier it belongs to
      const foundTier = Object.entries(tiers).find(([_, items]) => 
        items.includes(overId)
      );
      
      if (foundTier) {
        destTier = foundTier[0];
        destIndex = foundTier[1].indexOf(overId);
      } else if (unrankedProducts.includes(overId)) {
        destTier = 'unranked';
        destIndex = unrankedProducts.indexOf(overId);
      } else {
        setActiveId(null);
        return;
      }
    }

    // Remove from source
    if (sourceTier === 'unranked') {
      setUnrankedProducts(prev => prev.filter((_, i) => i !== sourceIndex));
    } else if (sourceTier) {
      setTiers(prev => ({
        ...prev,
        [sourceTier]: prev[sourceTier as keyof TierData].filter((_, i) => i !== sourceIndex)
      }));
    }

    // Add to destination
    if (destTier === 'unranked') {
      setUnrankedProducts(prev => {
        const newArray = [...prev];
        newArray.splice(destIndex, 0, activeId);
        return newArray;
      });
    } else {
      setTiers(prev => {
        const newArray = [...prev[destTier as keyof TierData]];
        newArray.splice(destIndex, 0, activeId);
        return {
          ...prev,
          [destTier]: newArray
        };
      });
    }

    setActiveId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category_id) {
      toast({
        title: "Erro",
        description: "Selecione uma categoria.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const { data, error } = await supabase
        .from('tier_lists')
        .insert({
          title: formData.title,
          description: formData.description || null,
          category_id: formData.category_id,
          is_public: formData.is_public,
          tiers: tiers as any,
          user_id: user!.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Tierlist criada com sucesso!",
      });

      // Show public URL if the tierlist is public
      if (formData.is_public) {
        const publicUrl = `${window.location.origin}/tierlist/${data.id}`;
        toast({
          title: "URL Pública Gerada",
          description: `Sua tierlist está disponível em: ${publicUrl}`,
        });
      }

      navigate(`/tierlist/${data.id}`);
    } catch (error) {
      console.error('Erro ao criar tierlist:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a tierlist.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getProduct = (id: string) => products.find(p => p.id === id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Carregando..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 animate-fade-in">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/dashboard/tierlists')}
          className="hover-lift"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground gradient-text">Criar Tierlist</h1>
          <p className="text-muted-foreground">
            Crie uma nova tierlist para organizar seus produtos
          </p>
        </div>
        <div className="ml-auto">
          <Badge variant="outline" className="glass-effect">
            <Sparkles className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário */}
        <div className="lg:col-span-1">
          <Card className="tier-card animate-scale-in">
            <CardHeader>
              <CardTitle className="gradient-text">Configurações</CardTitle>
              <CardDescription>
                Defina as informações básicas da tierlist
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Ex: Melhores Smartphones 2024"
                />
              </div>

              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva sua tierlist..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="public"
                  checked={formData.is_public}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, is_public: checked })
                  }
                />
                <Label htmlFor="public">Tierlist pública</Label>
              </div>

              <Button 
                onClick={handleSubmit} 
                className="w-full"
                disabled={!formData.title || !formData.category_id || saving}
              >
                {saving ? (
                  <>
                    <Crown className="w-4 h-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar Tierlist'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tierlist Builder */}
        <div className="lg:col-span-2">
          {!formData.category_id ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Selecione uma categoria
              </h2>
              <p className="text-muted-foreground">
                Escolha uma categoria para carregar os produtos disponíveis.
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Nenhum produto encontrado
              </h2>
              <p className="text-muted-foreground">
                Esta categoria não possui produtos cadastrados ainda.
              </p>
            </div>
          ) : (
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <div className="space-y-4">
                {/* Tiers */}
                {Object.entries(tierColors).map(([tierName, colorClass]) => (
                  <Card key={tierName} className="tier-card animate-fade-in">
                    <CardHeader>
                      <CardTitle className={`text-lg bg-${colorClass} text-white px-4 py-2 rounded shadow-glow`}>
                        Tier {tierName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SortableContext items={tiers[tierName as keyof TierData]}>
                        <div 
                          id={tierName}
                          className="min-h-[100px] p-4 border-2 border-dashed border-muted rounded-lg flex flex-wrap gap-2 transition-all duration-300 hover:border-primary/50"
                        >
                          {tiers[tierName as keyof TierData].map(productId => {
                            const product = getProduct(productId);
                            if (!product) return null;
                            
                            return (
                              <div
                                key={productId}
                                className="product-item w-20 h-20 bg-card border rounded-lg p-1 flex flex-col items-center justify-center text-center hover-lift"
                              >
                                {product.image_url ? (
                                  <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-8 h-8 object-cover rounded"
                                  />
                                ) : (
                                  <Package className="w-6 h-6 text-muted-foreground" />
                                )}
                                <span className="text-xs text-foreground truncate w-full">
                                  {product.name}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </SortableContext>
                    </CardContent>
                  </Card>
                ))}

                {/* Unranked Products */}
                <Card className="tier-card animate-fade-in">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Produtos não classificados</CardTitle>
                        <CardDescription>
                          Arraste os produtos para as categorias acima
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="glass-effect">
                        {unrankedProducts.length} produtos
                      </Badge>
                    </div>
                    <div className="pt-4">
                      <SearchInput
                        placeholder="Buscar produtos..."
                        value={searchTerm}
                        onSearch={setSearchTerm}
                        className="w-full"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SortableContext items={unrankedProducts}>
                      <div 
                        id="unranked"
                        className="min-h-[100px] p-4 border-2 border-dashed border-muted rounded-lg flex flex-wrap gap-2 transition-all duration-300 hover:border-primary/50"
                      >
                        {unrankedProducts
                          .filter(productId => {
                            const product = getProduct(productId);
                            if (!product) return false;
                            if (!searchTerm) return true;
                            return product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                   product.description?.toLowerCase().includes(searchTerm.toLowerCase());
                          })
                          .map(productId => {
                          const product = getProduct(productId);
                          if (!product) return null;
                          
                          return (
                            <div
                              key={productId}
                              className="product-item w-20 h-20 bg-card border rounded-lg p-1 flex flex-col items-center justify-center text-center hover-lift"
                            >
                              {product.image_url ? (
                                <img
                                  src={product.image_url}
                                  alt={product.name}
                                  className="w-8 h-8 object-cover rounded"
                                />
                              ) : (
                                <Package className="w-6 h-6 text-muted-foreground" />
                              )}
                              <span className="text-xs text-foreground truncate w-full">
                                {product.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </SortableContext>
                  </CardContent>
                </Card>
              </div>

              <DragOverlay>
                {activeId ? (
                  <div className="w-20 h-20 bg-card border rounded-lg p-1 flex flex-col items-center justify-center text-center shadow-lg">
                    {(() => {
                      const product = getProduct(activeId);
                      return product ? (
                        <>
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-8 h-8 object-cover rounded"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-muted-foreground" />
                          )}
                          <span className="text-xs text-foreground truncate w-full">
                            {product.name}
                          </span>
                        </>
                      ) : null;
                    })()}
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
}