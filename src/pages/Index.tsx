import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Crown, 
  LogIn, 
  User, 
  ArrowRight, 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  BarChart3, 
  Shield, 
  Sparkles, 
  Rocket, 
  Users,
  CheckCircle,
  Play,
  TrendingUp,
  Award,
  Layers,
  Settings,
  Download,
  Share2,
  Eye,
  Heart,
  MessageSquare
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard/analytics");
    } else {
      navigate("/auth");
    }
  };

  const handleStartTrial = () => {
    navigate("/auth?mode=signup");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center animate-pulse">
          <Crown className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground text-lg">Carregando TierForge Lab...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation Bar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow animate-glow">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold gradient-text">TierForge Lab</span>
                <div className="text-xs text-muted-foreground">Professional Tier Lists</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 animate-fade-in">
              <Link to="/explore">
                <Button variant="ghost" size="sm" className="hover-lift">
                  <Eye className="w-4 h-4 mr-2" />
                  Explorar
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="ghost" size="sm" className="hover-lift">
                  <Trophy className="w-4 h-4 mr-2" />
                  Planos
                </Button>
              </Link>
              {user ? (
                <div className="flex items-center gap-3">
                  <Link to="/dashboard/analytics">
                    <Button className="hover-lift">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <div className="flex items-center gap-2 text-sm glass-effect px-3 py-2 rounded-full">
                    <User className="w-4 h-4 text-primary" />
                    <span className="font-medium">{profile?.full_name || user.email}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/auth">
                    <Button variant="outline" size="sm" className="hover-lift">
                      <LogIn className="w-4 h-4 mr-2" />
                      Entrar
                    </Button>
                  </Link>
                  <Button onClick={handleGetStarted} className="hover-lift">
                    <Rocket className="w-4 h-4 mr-2" />
                    Começar Grátis
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float-delayed" />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center space-y-8 animate-fade-in">
            <Badge className="glass-effect text-sm px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Plataforma Premium de Tier Lists
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="gradient-text">Crie Tier Lists</span>
              <br />
              <span className="text-foreground">Profissionais</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A ferramenta mais avançada para criar, organizar e compartilhar tier lists de produtos. 
              <span className="text-primary font-semibold"> Transforme suas comparações em insights poderosos.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="text-lg px-8 py-6 hover-lift shadow-glow"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Começar Gratuitamente
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate("/explore")}
                className="text-lg px-8 py-6 hover-lift glass-effect"
              >
                <Play className="w-5 h-5 mr-2" />
                Ver Demonstração
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Teste grátis por 14 dias</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Cancele a qualquer momento</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2 animate-fade-in">
              <div className="text-3xl md:text-4xl font-bold gradient-text">10K+</div>
              <div className="text-muted-foreground">Tier Lists Criadas</div>
            </div>
            <div className="space-y-2 animate-fade-in animate-delay-100">
              <div className="text-3xl md:text-4xl font-bold gradient-text">5K+</div>
              <div className="text-muted-foreground">Usuários Ativos</div>
            </div>
            <div className="space-y-2 animate-fade-in animate-delay-200">
              <div className="text-3xl md:text-4xl font-bold gradient-text">50K+</div>
              <div className="text-muted-foreground">Produtos Avaliados</div>
            </div>
            <div className="space-y-2 animate-fade-in animate-delay-300">
              <div className="text-3xl md:text-4xl font-bold gradient-text">99%</div>
              <div className="text-muted-foreground">Satisfação</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16 animate-fade-in">
            <Badge variant="outline" className="glass-effect">
              <Zap className="w-4 h-4 mr-2" />
              Funcionalidades Premium
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold">
              Tudo que você precisa para criar
              <span className="gradient-text"> tier lists perfeitas</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ferramentas profissionais que transformam a forma como você organiza e compara produtos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Layers,
                title: "Drag & Drop Intuitivo",
                description: "Interface fluida para organizar produtos com facilidade total",
                color: "text-blue-500"
              },
              {
                icon: Settings,
                title: "Parâmetros Customizáveis",
                description: "Crie critérios únicos de avaliação para cada categoria",
                color: "text-purple-500"
              },
              {
                icon: BarChart3,
                title: "Analytics Avançado",
                description: "Insights detalhados sobre suas tier lists e engajamento",
                color: "text-green-500"
              },
              {
                icon: Share2,
                title: "Compartilhamento Fácil",
                description: "Exporte em múltiplos formatos e compartilhe com o mundo",
                color: "text-orange-500"
              },
              {
                icon: Users,
                title: "Colaboração em Tempo Real",
                description: "Trabalhe em equipe com sincronização instantânea",
                color: "text-pink-500"
              },
              {
                icon: Shield,
                title: "Backup Automático",
                description: "Seus dados sempre seguros na nuvem com versionamento",
                color: "text-cyan-500"
              }
            ].map((feature, index) => (
              <Card key={index} className="glass-effect hover-lift animate-fade-in group" style={{animationDelay: `${index * 100}ms`}}>
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${feature.color.split('-')[1]}-500/20 to-${feature.color.split('-')[1]}-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 animate-fade-in">
          <Badge className="glass-effect text-lg px-6 py-3">
            <Trophy className="w-5 h-5 mr-2" />
            Comece Hoje Mesmo
          </Badge>
          
          <h2 className="text-3xl md:text-5xl font-bold">
            Pronto para criar suas
            <span className="gradient-text"> tier lists profissionais?</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Junte-se a milhares de usuários que já transformaram suas comparações em insights valiosos
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button 
              size="lg" 
              onClick={handleStartTrial}
              className="text-lg px-8 py-6 hover-lift shadow-glow"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Teste Grátis por 14 Dias
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Link to="/pricing">
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 hover-lift glass-effect"
              >
                <Award className="w-5 h-5 mr-2" />
                Ver Planos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-bold gradient-text">TierForge Lab</span>
                <div className="text-xs text-muted-foreground">© 2024 - Todos os direitos reservados</div>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/pricing" className="hover:text-primary transition-colors">Planos</Link>
              <Link to="/explore" className="hover:text-primary transition-colors">Explorar</Link>
              <span>Suporte</span>
              <span>Privacidade</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

