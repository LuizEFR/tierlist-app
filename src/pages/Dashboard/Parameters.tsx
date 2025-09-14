import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Settings, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Parameter {
  id: string;
  name: string;
  description: string | null;
  parameter_type: string;
  options: any;
  created_at: string;
}

export default function Parameters() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingParameter, setEditingParameter] = useState<Parameter | null>(null);
  const [deleteParameterId, setDeleteParameterId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parameter_type: 'text',
    options: ''
  });

  useEffect(() => {
    if (user) {
      fetchParameters();
    }
  }, [user]);

  const fetchParameters = async () => {
    try {
      const { data, error } = await supabase
        .from('parameters')
        .select(`
          id,
          name,
          description,
          parameter_type,
          options,
          created_at
        `)
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
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      parameter_type: 'text',
      options: ''
    });
    setEditingParameter(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      let optionsData = null;
      if (formData.parameter_type === 'select' && formData.options) {
        optionsData = formData.options.split(',').map(opt => opt.trim()).filter(opt => opt);
      }

      const parameterData = {
        name: formData.name,
        description: formData.description || null,
        parameter_type: formData.parameter_type,
        options: optionsData,
        user_id: user!.id
      };

      if (editingParameter) {
        const { error } = await supabase
          .from('parameters')
          .update(parameterData)
          .eq('id', editingParameter.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Parâmetro atualizado com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from('parameters')
          .insert(parameterData);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Parâmetro criado com sucesso!",
        });
      }

      resetForm();
      setIsCreateDialogOpen(false);
      fetchParameters();
    } catch (error) {
      console.error('Erro ao salvar parâmetro:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o parâmetro.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (parameter: Parameter) => {
    setEditingParameter(parameter);
    setFormData({
      name: parameter.name,
      description: parameter.description || '',
      parameter_type: parameter.parameter_type,
      options: parameter.options ? parameter.options.join(', ') : ''
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteParameterId) return;

    try {
      const { error } = await supabase
        .from('parameters')
        .delete()
        .eq('id', deleteParameterId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Parâmetro excluído com sucesso!",
      });

      fetchParameters();
    } catch (error) {
      console.error('Erro ao excluir parâmetro:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o parâmetro.",
        variant: "destructive",
      });
    } finally {
      setDeleteParameterId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Settings className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Parâmetros</h1>
          <p className="text-muted-foreground">
            Gerencie os parâmetros das suas categorias
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Parâmetro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingParameter ? 'Editar Parâmetro' : 'Criar Parâmetro'}
              </DialogTitle>
              <DialogDescription>
                {editingParameter 
                  ? 'Atualize as informações do parâmetro.'
                  : 'Adicione um novo parâmetro à categoria selecionada.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Sensor"
                  required
                />
              </div>

              <div>
                <Label htmlFor="parameter_type">Tipo</Label>
                <Select
                  value={formData.parameter_type}
                  onValueChange={(value) => setFormData({ ...formData, parameter_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="number">Número</SelectItem>
                    <SelectItem value="boolean">Sim/Não</SelectItem>
                    <SelectItem value="select">Seleção</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.parameter_type === 'select' && (
                <div>
                  <Label htmlFor="options">Opções (separadas por vírgula)</Label>
                  <Input
                    id="options"
                    value={formData.options}
                    onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                    placeholder="Ótico, Laser, Híbrido"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva este parâmetro..."
                />
              </div>

              <Button type="submit" className="w-full">
                {editingParameter ? 'Atualizar' : 'Criar'} Parâmetro
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {parameters.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Settings className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Nenhum parâmetro encontrado
            </h2>
            <p className="text-muted-foreground text-center mb-4">
              Crie seu primeiro parâmetro para começar a organizar seus produtos.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parameters.map((parameter) => (
            <Card key={parameter.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{parameter.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {parameter.parameter_type === 'text' && 'Texto'}
                        {parameter.parameter_type === 'number' && 'Número'}
                        {parameter.parameter_type === 'boolean' && 'Sim/Não'}
                        {parameter.parameter_type === 'select' && 'Seleção'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(parameter)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteParameterId(parameter.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {parameter.description && (
                  <CardDescription className="mb-3">
                    {parameter.description}
                  </CardDescription>
                )}
                {parameter.options && (
                  <div>
                    <p className="text-sm font-medium mb-2">Opções disponíveis:</p>
                    <div className="flex flex-wrap gap-1">
                      {parameter.options.map((option: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {option}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteParameterId} onOpenChange={() => setDeleteParameterId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este parâmetro? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}