import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  Heart,
  Pencil,
  Trash2,
  Globe,
  Lock,
  Crown,
  Calendar,
  Layers,
  Download // Adicionado para a funcionalidade de exportação
} from "lucide-react";

interface TierList {
  id: string;
  title: string;
  description: string | null;
  is_public: boolean;
  views: number;
  likes: number;
  created_at: string;
  categories: {
    name: string;
  };
}

export default function TierLists() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tierLists, setTierLists] = useState<TierList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTierLists();
    }
  }, [user]);

  const fetchTierLists = async () => {
    try {
      const { data, error } = await supabase
        .from("tier_lists")
        .select(`
          id,
          title,
          description,
          is_public,
          views,
          likes,
          created_at,
          categories (
            name
          )
        `)
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setTierLists(data || []);
    } catch (error) {
      console.error("Erro ao buscar tierlists:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as tierlists.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublic = async (tierListId: string, isPublic: boolean) => {
    try {
      const { error } = await supabase
        .from("tier_lists")
        .update({ is_public: isPublic })
        .eq("id", tierListId);

      if (error) throw error;

      // Atualizar o estado local
      setTierLists(prev => 
        prev.map(tl => 
          tl.id === tierListId ? { ...tl, is_public: isPublic } : tl
        )
      );

      toast({
        title: "Sucesso",
        description: `Tierlist ${isPublic ? "publicada" : "despublicada"} com sucesso!`,
      });
    } catch (error) {
      console.error("Erro ao alterar visibilidade:", error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar a visibilidade da tierlist.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (tierListId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta tierlist? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("tier_lists")
        .delete()
        .eq("id", tierListId);

      if (error) throw error;

      setTierLists(prev => prev.filter(tl => tl.id !== tierListId));

      toast({
        title: "Sucesso",
        description: "Tierlist excluída com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao excluir tierlist:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a tierlist.",
        variant: "destructive",
      });
    }
  };

  const exportTierListsData = async () => {
    try {
      const { data, error } = await supabase
        .from("tier_lists")
        .select("*") // Seleciona todos os campos para exportação
        .eq("user_id", user!.id);

      if (error) throw error;

      if (data) {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "tierlists.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast({
          title: "Sucesso",
          description: "Tierlists exportadas com sucesso!",
        });
      }
    } catch (error) {
      console.error("Erro ao exportar tierlists:", error);
      toast({
        title: "Erro",
        description: "Não foi possível exportar as tierlists.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(dateString));
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
          <h1 className="text-3xl font-bold text-foreground">Minhas Tierlists</h1>
          <p className="text-muted-foreground">
            Gerencie suas tierlists e controle a visibilidade
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={exportTierListsData}>
            <Download className="w-4 h-4 mr-2" />
            Exportar Tierlists (JSON)
          </Button>
          <Link to="/dashboard/tierlists/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Tierlist
            </Button>
          </Link>
        </div>
      </div>

      {tierLists.length === 0 ? (
        <div className="text-center py-12">
          <Layers className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Nenhuma tierlist encontrada
          </h2>
          <p className="text-muted-foreground mb-4">
            Crie sua primeira tierlist para começar a organizar seus produtos.
          </p>
          <Link to="/dashboard/tierlists/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Criar Tierlist
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tierLists.map((tierList) => (
            <Card key={tierList.id} className="hover:shadow-card transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">
                      {tierList.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">
                        {tierList.categories.name}
                      </Badge>
                      <Badge variant={tierList.is_public ? "default" : "secondary"}>
                        {tierList.is_public ? (
                          <><Globe className="w-3 h-3 mr-1" /> Pública</>
                        ) : (
                          <><Lock className="w-3 h-3 mr-1" /> Privada</>
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {tierList.description && (
                  <CardDescription className="line-clamp-2">
                    {tierList.description}
                  </CardDescription>
                )}
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {tierList.views}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {tierList.likes}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(tierList.created_at)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`public-${tierList.id}`}
                      checked={tierList.is_public}
                      onCheckedChange={(checked) => 
                        handleTogglePublic(tierList.id, checked)
                      }
                    />
                    <Label htmlFor={`public-${tierList.id}`} className="text-sm">
                      Público
                    </Label>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Link to={`/tierlist/${tierList.id}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full">
                      <Eye className="w-4 h-4 mr-1" />
                      Visualizar
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      // TODO: Implementar edição
                      toast({
                        title: "Em desenvolvimento",
                        description: "Funcionalidade de edição em breve!",
                      });
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(tierList.id)}
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

