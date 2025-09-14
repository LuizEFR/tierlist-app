import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Crown, LogIn, User, ArrowRight, Trophy, Star, Zap, Target, BarChart3, Shield, Sparkles, Rocket, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import heroImage from "@/assets/hero-tech.jpg";

const Index = () => {
  const { user, profile, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 animate-fade-in">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow animate-glow">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">
                TechTier
              </span>
            </div>
            
            <div className="flex items-center gap-4 animate-fade-in">
              <Link to="/explore">
                <Button variant="ghost" size="sm" className="hover-lift">
                  Explore
                </Button>
              </Link>
              {user ? (
                <>
                  <Link to="/dashboard/analytics">
                    <Button variant="ghost" size="sm" className="hover-lift">
                      Dashboard
                    </Button>
                  </Link>
                  <div className="flex items-center gap-2 text-sm glass-effect px-3 py-2 rounded-full">
                    <User className="w-4 h-4" />
                    <span className="text-muted-foreground">
                      {profile?.full_name || user.email}
                    </span>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full capitalize animate-pulse">
                      {profile?.subscription_tier || 'standard'}
                    </span>
                  </div>
                  <Link to="/pricing">
                    <Button variant="outline" size="sm" className="hover-lift">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={signOut} className="hover-lift">
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/pricing">
                    <Button variant="outline" size="sm" className="hover-lift">
                      <Crown className="w-4 h-4 mr-2" />
                      Planos
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="sm" className="hover-lift animate-glow">
                      <LogIn className="w-4 h-4 mr-2" />
                      Entrar
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div 
          className="absolute inset-0 opacity-30 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="mb-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 glass-effect rounded-full px-6 py-3 border border-border mb-6 hover-lift">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium">Plataforma Premium de Rankings</span>
              <Rocket className="w-4 h-4 text-secondary animate-bounce" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text animate-scale-in">
            TechTier
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed animate-fade-in">
            Crie rankings definitivos de produtos tech baseados em especificações técnicas, 
            qualidade de construção e análises detalhadas. Para quem leva hardware a sério.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-up">
            <Link to={user ? "/dashboard/analytics" : "/auth"}>
              <Button variant="hero" size="lg" className="text-lg px-8 py-6 hover-lift animate-glow">
                {user ? "Ir ao Dashboard" : "Começar Agora"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/explore">
              <Button variant="premium" size="lg" className="text-lg px-8 py-6 hover-lift">
                Ver Rankings
                <Trophy className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
          
          {/* Enhanced Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="glass-effect rounded-xl p-6 border border-border hover-lift animate-scale-in">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow animate-float">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-2 gradient-text">500+</h3>
              <p className="text-muted-foreground">Produtos Avaliados</p>
            </div>
            
            <div className="glass-effect rounded-xl p-6 border border-border hover-lift animate-scale-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center shadow-glow animate-float" style={{animationDelay: '2s'}}>
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-2 gradient-text">1.2K+</h3>
              <p className="text-muted-foreground">Tier Lists Criadas</p>
            </div>
            
            <div className="glass-effect rounded-xl p-6 border border-border hover-lift animate-scale-in" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow animate-float" style={{animationDelay: '4s'}}>
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-2 gradient-text">25K+</h3>
              <p className="text-muted-foreground">Usuários Ativos</p>
            </div>
          </div>
        </div>
        
        {/* Enhanced floating elements */}
        <div className="absolute top-1/4 left-10 w-3 h-3 bg-primary rounded-full animate-pulse shadow-glow" />
        <div className="absolute top-1/3 right-20 w-4 h-4 bg-secondary rounded-full animate-pulse delay-1000 shadow-glow" />
        <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-accent rounded-full animate-pulse delay-500 shadow-glow" />
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-primary rounded-full animate-float" />
        <div className="absolute bottom-1/3 right-10 w-3 h-3 bg-accent rounded-full animate-float delay-1000" />
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4 gradient-text">
              Funcionalidades Principais
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tudo que você precisa para criar rankings profissionais e comparações detalhadas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-effect border-border p-6 hover-lift tier-card animate-scale-in">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-gradient-primary shadow-glow">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold ml-4">Tier Lists Personalizadas</h3>
              </div>
              <p className="text-muted-foreground">
                Crie rankings personalizados com drag & drop. Organize produtos em tiers S, A, B, C, D 
                com facilidade e compartilhe com a comunidade.
              </p>
            </Card>

            <Card className="glass-effect border-border p-6 hover-lift tier-card animate-scale-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-gradient-secondary shadow-glow">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold ml-4">Analytics Avançado</h3>
              </div>
              <p className="text-muted-foreground">
                Acompanhe o desempenho dos seus rankings com métricas detalhadas. 
                Visualizações, likes e engajamento da sua audiência.
              </p>
            </Card>

            <Card className="glass-effect border-border p-6 hover-lift tier-card animate-scale-in" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-gradient-primary shadow-glow">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold ml-4">Gestão Completa</h3>
              </div>
              <p className="text-muted-foreground">
                Sistema completo de cadastro de produtos, categorias e parâmetros técnicos. 
                Organize tudo de forma profissional.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 glass-effect" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6 gradient-text animate-fade-in">
            Pronto para criar rankings profissionais?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up">
            Junte-se a milhares de enthusiasts que já usam o TechTier para criar 
            os melhores rankings de produtos tech do mercado.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in">
            {!user ? (
              <>
                <Link to="/auth">
                  <Button variant="hero" size="lg" className="text-lg px-8 py-6 hover-lift animate-glow">
                    Criar Conta Grátis
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 hover-lift glass-effect">
                    <Crown className="w-5 h-5 mr-2" />
                    Ver Planos Premium
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard/tierlists/create">
                  <Button variant="hero" size="lg" className="text-lg px-8 py-6 hover-lift animate-glow">
                    Criar Tier List
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 hover-lift glass-effect">
                    <Crown className="w-5 h-5 mr-2" />
                    Upgrade Premium
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Floating elements for CTA section */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-primary rounded-full animate-float" />
        <div className="absolute bottom-10 right-10 w-3 h-3 bg-secondary rounded-full animate-float delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-accent rounded-full animate-pulse" />
      </section>
    </div>
  );
};

export default Index;