import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, FolderPlus, Crown } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  _count?: { products: number };
}

interface Parameter {
  id: string;
  name: string;
  description: string | null;
  parameter_type: string;
}

export default function Categories() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedParameters, setSelectedParameters] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (user) {
      fetchCategories();
      fetchParameters();
    }
  }, [user]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          id,
          name,
          description,
          created_at
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Buscar contagem de produtos para cada categoria
      const categoriesWithCount = await Promise.all(
        (data || []).map(async (category) => {
          const { count } = await supabase
            .from('products')
            .select('id', { count: 'exact', head: true })
            .eq('category_id', category.id);
          
          return {
            ...category,
            _count: { products: count || 0 }
          };
        })
      );

      setCategories(categoriesWithCount);
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

  const fetchParameters = async () => {
    try {
      const { data, error } = await supabase
        .from('parameters')
        .select('id, name, description, parameter_type')
        .eq('user_id', user!.id)
        .order('name');

      if (error) throw error;
      setParameters(data || []);
    } catch (error) {
      console.error('Erro ao buscar parâmetros:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os parâmetros.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        // Update category
        const { error: categoryError } = await supabase
          .from('categories')
          .update({
            name: formData.name,
            description: formData.description
          })
          .eq('id', editingCategory.id);

        if (categoryError) throw categoryError;

        // Update category parameters
        await updateCategoryParameters(editingCategory.id);

        toast({
          title: "Sucesso",
          description: "Categoria atualizada com sucesso!",
        });
      } else {
        // Create category
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .insert({
            name: formData.name,
            description: formData.description,
            user_id: user!.id
          })
          .select()
          .single();

        if (categoryError) throw categoryError;

        // Add category parameters
        if (selectedParameters.length > 0) {
          await updateCategoryParameters(categoryData.id);
        }

        toast({
          title: "Sucesso",
          description: "Categoria criada com sucesso!",
        });
      }

      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a categoria.",
        variant: "destructive",
      });
    }
  };

  const updateCategoryParameters = async (categoryId: string) => {
    // Remove existing associations
    const { error: deleteError } = await supabase
      .from('category_parameters')
      .delete()
      .eq('category_id', categoryId);

    if (deleteError) throw deleteError;

    // Add new associations
    if (selectedParameters.length > 0) {
      const { error: insertError } = await supabase
        .from('category_parameters')
        .insert(
          selectedParameters.map(parameterId => ({
            category_id: categoryId,
            parameter_id: parameterId
          }))
        );

      if (insertError) throw insertError;
    }
  };

  const handleEdit = async (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    
    // Fetch current category parameters
    const { data, error } = await supabase
      .from('category_parameters')
      .select('parameter_id')
      .eq('category_id', category.id);

    if (!error && data) {
      setSelectedParameters(data.map(cp => cp.parameter_id));
    }
    
    setIsDialogOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Categoria excluída com sucesso!",
      });

      fetchCategories();
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a categoria.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setSelectedParameters([]);
    setEditingCategory(null);
    setIsDialogOpen(false);
  };

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
          <h1 className="text-3xl font-bold text-foreground">Categorias</h1>
          <p className="text-muted-foreground">
            Gerencie suas categorias de produtos
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </DialogTitle>
              <DialogDescription>
                {editingCategory 
                  ? 'Edite os dados da categoria abaixo.'
                  : 'Preencha os dados da nova categoria.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Categoria</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Ex: Smartphones, Laptops, Periféricos..."
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva a categoria..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Parâmetros da Categoria</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                  {parameters.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nenhum parâmetro encontrado. Crie parâmetros primeiro.
                    </p>
                  ) : (
                    parameters.map((parameter) => (
                      <div key={parameter.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={parameter.id}
                          checked={selectedParameters.includes(parameter.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedParameters([...selectedParameters, parameter.id]);
                            } else {
                              setSelectedParameters(selectedParameters.filter(id => id !== parameter.id));
                            }
                          }}
                        />
                        <Label htmlFor={parameter.id} className="text-sm font-normal">
                          {parameter.name}
                          <span className="text-muted-foreground ml-1">
                            ({parameter.parameter_type === 'text' && 'Texto'}
                             {parameter.parameter_type === 'number' && 'Número'}
                             {parameter.parameter_type === 'boolean' && 'Sim/Não'}
                             {parameter.parameter_type === 'select' && 'Seleção'})
                          </span>
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingCategory ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <FolderPlus className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Nenhuma categoria encontrada
          </h2>
          <p className="text-muted-foreground mb-4">
            Crie sua primeira categoria para organizar seus produtos.
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Categoria
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="hover:shadow-card transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <Badge variant="outline">
                    {category._count?.products || 0} produtos
                  </Badge>
                </div>
                {category.description && (
                  <CardDescription>{category.description}</CardDescription>
                )}
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(category)}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Excluir
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