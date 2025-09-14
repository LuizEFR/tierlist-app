import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Package, Trash2, Edit, ExternalLink, Settings } from "lucide-react";

interface Parameter {
  id: string;
  name: string;
  parameter_type: string;
  options: any;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  specifications: any;
  parameter_values: any;
  category_id: string;
  created_at: string;
  category?: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

export default function Products() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    specifications: '',
    category_id: '',
    parameter_values: {} as Record<string, any>
  });

  useEffect(() => {
    if (user) {
      fetchCategories();
      fetchProducts();
    }
  }, [user]);

  useEffect(() => {
    if (formData.category_id) {
      fetchParameters();
    }
  }, [formData.category_id]);

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
    }
  };

  const fetchParameters = async () => {
    if (!formData.category_id) {
      setParameters([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('category_parameters')
        .select(`
          parameters:parameter_id (
            id,
            name,
            parameter_type,
            options
          )
        `)
        .eq('category_id', formData.category_id);

      if (error) throw error;
      
      const parametersData = data?.map(cp => cp.parameters).filter(Boolean) || [];
      setParameters(parametersData);
    } catch (error) {
      console.error('Erro ao buscar parâmetros:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os parâmetros.",
        variant: "destructive",
      });
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          image_url,
          specifications,
          parameter_values,
          category_id,
          created_at,
          categories:category_id (name)
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image_url: '',
      specifications: '',
      category_id: '',
      parameter_values: {}
    });
    setEditingProduct(null);
    setParameters([]);
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

    try {
      let specificationsData = null;
      if (formData.specifications) {
        const lines = formData.specifications.split('\n').filter(line => line.trim());
        specificationsData = {};
        lines.forEach(line => {
          const [key, ...valueParts] = line.split(':');
          if (key && valueParts.length > 0) {
            specificationsData[key.trim()] = valueParts.join(':').trim();
          }
        });
      }

      const productData = {
        name: formData.name,
        description: formData.description || null,
        image_url: formData.image_url || null,
        specifications: specificationsData,
        parameter_values: formData.parameter_values,
        category_id: formData.category_id,
        user_id: user!.id
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Produto atualizado com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Produto criado com sucesso!",
        });
      }

      resetForm();
      setIsCreateDialogOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o produto.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      image_url: product.image_url || '',
      specifications: product.specifications ? Object.entries(product.specifications).map(([key, value]) => `${key}: ${value}`).join('\n') : '',
      category_id: product.category_id,
      parameter_values: product.parameter_values || {}
    });
    
    // Load parameters for the product's category
    try {
      const { data, error } = await supabase
        .from('category_parameters')
        .select(`
          parameters:parameter_id (
            id,
            name,
            parameter_type,
            options
          )
        `)
        .eq('category_id', product.category_id);

      if (error) throw error;
      
      const parametersData = data?.map(cp => cp.parameters).filter(Boolean) || [];
      setParameters(parametersData);
    } catch (error) {
      console.error('Erro ao buscar parâmetros:', error);
    }
    
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteProductId) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', deleteProductId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Produto excluído com sucesso!",
      });

      fetchProducts();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o produto.",
        variant: "destructive",
      });
    } finally {
      setDeleteProductId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Package className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Produtos</h1>
          <p className="text-muted-foreground">
            Gerencie os produtos das suas categorias
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingProduct(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Editar Produto' : 'Criar Produto'}
              </DialogTitle>
              <DialogDescription>
                {editingProduct 
                  ? 'Atualize as informações do produto.'
                  : 'Adicione um novo produto à categoria selecionada.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Mouse Logitech G Pro"
                  required
                />
              </div>

              <div>
                <Label htmlFor="image_url">URL da Imagem (opcional)</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o produto..."
                  rows={3}
                />
              </div>

              {/* Parameters */}
              {parameters.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    <Label className="text-base font-medium">Parâmetros da Categoria</Label>
                  </div>
                  {parameters.map((param) => (
                    <div key={param.id}>
                      <Label htmlFor={`param-${param.id}`}>{param.name}</Label>
                      {param.parameter_type === 'text' && (
                        <Input
                          id={`param-${param.id}`}
                          value={formData.parameter_values[param.id] || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            parameter_values: {
                              ...formData.parameter_values,
                              [param.id]: e.target.value
                            }
                          })}
                          placeholder={`Informe ${param.name.toLowerCase()}`}
                        />
                      )}
                      {param.parameter_type === 'number' && (
                        <Input
                          id={`param-${param.id}`}
                          type="number"
                          value={formData.parameter_values[param.id] || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            parameter_values: {
                              ...formData.parameter_values,
                              [param.id]: e.target.value
                            }
                          })}
                          placeholder={`Informe ${param.name.toLowerCase()}`}
                        />
                      )}
                      {param.parameter_type === 'select' && param.options && (
                        <Select
                          value={formData.parameter_values[param.id] || ''}
                          onValueChange={(value) => setFormData({
                            ...formData,
                            parameter_values: {
                              ...formData.parameter_values,
                              [param.id]: value
                            }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Selecione ${param.name.toLowerCase()}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {param.options.map((option: string, index: number) => (
                              <SelectItem key={index} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {param.parameter_type === 'boolean' && (
                        <Select
                          value={formData.parameter_values[param.id] || ''}
                          onValueChange={(value) => setFormData({
                            ...formData,
                            parameter_values: {
                              ...formData.parameter_values,
                              [param.id]: value
                            }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Selecione ${param.name.toLowerCase()}`} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Sim</SelectItem>
                            <SelectItem value="false">Não</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div>
                <Label htmlFor="specifications">Especificações (opcional)</Label>
                <Textarea
                  id="specifications"
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  placeholder="Ex: Resolução: 1600 DPI&#10;Conectividade: USB"
                  rows={4}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Use o formato "chave: valor" (uma por linha)
                </p>
              </div>

              <Button type="submit" className="w-full">
                {editingProduct ? 'Atualizar' : 'Criar'} Produto
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Crie uma categoria primeiro
            </h2>
            <p className="text-muted-foreground text-center mb-4">
              Você precisa ter pelo menos uma categoria antes de cadastrar produtos.
            </p>
          </CardContent>
        </Card>
      ) : products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Nenhum produto encontrado
            </h2>
            <p className="text-muted-foreground text-center mb-4">
              Crie seu primeiro produto para começar a organizar suas tierlists.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-card transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">
                      {product.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">
                        {product.category?.name || 'Sem categoria'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {product.description && (
                  <CardDescription className="line-clamp-2">
                    {product.description}
                  </CardDescription>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                {product.image_url && (
                  <div className="w-full h-32 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                {product.parameter_values && Object.keys(product.parameter_values).length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Parâmetros:</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(product.parameter_values).map(([key, value]) => (
                        <Badge key={key} variant="secondary" className="text-xs">
                          {String(value)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(product)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteProductId(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}