import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Check, 
  Crown, 
  Star, 
  Zap, 
  ArrowLeft, 
  Sparkles, 
  Trophy, 
  Rocket,
  Shield,
  Users,
  BarChart3,
  Layers,
  Settings,
  Download,
  Share2,
  Clock,
  Headphones,
  Gift,
  TrendingUp
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Pricing = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "basic",
      name: "Básico",
      price: "Grátis",
      yearlyPrice: "Grátis",
      description: "Perfeito para começar sua jornada",
      features: [
        "3 Categorias",
        "25 Produtos por categoria", 
        "8 Parâmetros customizáveis",
        "5 Tierlists",
        "Exportação em PNG",
        "Suporte por email",
        "Templates básicos"
      ],
      limitations: [
        "Marca d'água nas exportações",
        "Sem analytics avançado",
        "Sem colaboração"
      ],
      buttonText: "Começar Grátis",
      highlighted: false,
      popular: false,
      tier: "basic" as const,
      icon: <Star className="w-6 h-6" />,
      color: "from-gray-500 to-gray-600",
      limits: {
        categories: 3,
        products: 25,
        parameters: 8,
        tierlists: 5
      }
    },
    {
      id: "pro",
      name: "Profissional", 
      price: "R$ 39,90",
      yearlyPrice: "R$ 29,90",
      period: "/mês",
      description: "Para criadores de conteúdo sérios",
      features: [
        "15 Categorias",
        "100 Produtos por categoria",
        "20 Parâmetros customizáveis", 
        "25 Tierlists",
        "Analytics detalhado",
        "Exportação HD sem marca d'água",
        "Templates premium",
        "Colaboração básica (3 usuários)",
        "Suporte prioritário",
        "Backup automático"
      ],
      buttonText: "Teste Grátis por 14 Dias",
      highlighted: true,
      popular: true,
      tier: "professional" as const,
      icon: <Zap className="w-6 h-6" />,
      color: "from-blue-500 to-purple-600",
      savings: isYearly ? "25%" : null,
      limits: {
        categories: 15,
        products: 100,
        parameters: 20,
        tierlists: 25
      }
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "R$ 99,90", 
      yearlyPrice: "R$ 79,90",
      period: "/mês",
      description: "Para equipes e empresas",
      features: [
        "Categorias ilimitadas",
        "Produtos ilimitados",
        "Parâmetros ilimitados",
        "Tierlists ilimitadas",
        "Analytics avançado + IA",
        "Exportação 4K + múltiplos formatos",
        "Templates exclusivos",
        "Colaboração ilimitada",
        "API personalizada",
        "Suporte 24/7",
        "Treinamento personalizado",
        "White-label disponível"
      ],
      buttonText: "Falar com Vendas",
      highlighted: false,
      popular: false,
      tier: "enterprise" as const,
      icon: <Crown className="w-6 h-6" />,
      color: "from-purple-500 to-pink-600",
      savings: isYearly ? "20%" : null,
      limits: {
        categories: -1,
        products: -1,
        parameters: -1,
        tierlists: -1
      }
    }
  ];

  const handlePlanSelect = async (planId: string) => {
    setSelectedPlan(planId);
    setLoading(planId);
    
    try {
      if (planId === "basic") {
        if (!user) {
          navigate("/auth?mode=signup");
        } else {
          navigate("/dashboard/analytics");
        }
      } else if (planId === "enterprise") {
        // Redirecionar para contato
        window.open("mailto:contato@tierforge.com?subject=Interesse no Plano Enterprise", "_blank");
      } else {
        // Redirecionar para checkout (implementar integração de pagamento)
        navigate("/auth?mode=signup&plan=" + planId);
      }
    } catch (error) {
      console.error("Erro ao processar plano:", error);
    } finally {
      setLoading(null);
      setSelectedPlan(null);
    }
  };

  const testimonials = [
    {
      name: "Carlos Silva",
      role: "YouTuber Tech",
      content: "Revolucionou como eu crio conteúdo. Minhas tier lists ficaram muito mais profissionais!",
      rating: 5
    },
    {
      name: "Ana Costa",
      role: "Product Manager",
      content: "Uso para comparar features de produtos. A equipe toda colabora em tempo real.",
      rating: 5
    },
    {
      name: "João Santos",
      role: "Streamer",
      content: "Meus viewers adoram as tier lists interativas. Engagement aumentou 300%!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 animate-fade-in">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">TierForge Lab</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="hover-lift">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              {user && (
                <Link to="/dashboard/analytics">
                  <Button size="sm" className="hover-lift">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-8 animate-fade-in">
            <Badge className="glass-effect text-lg px-6 py-3">
              <Trophy className="w-5 h-5 mr-2" />
              Planos Premium
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="gradient-text">Escolha seu plano</span>
              <br />
              <span className="text-foreground">e comece hoje</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Desbloqueie todo o potencial das suas tier lists com funcionalidades premium
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 pt-8">
              <span className={`text-sm ${!isYearly ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                Mensal
              </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-primary"
              />
              <span className={`text-sm ${isYearly ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                Anual
              </span>
              <Badge variant="secondary" className="ml-2">
                <Gift className="w-3 h-3 mr-1" />
                Economize até 25%
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {plans.map((plan, index) => (
              <Card 
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 animate-fade-in ${
                  plan.highlighted 
                    ? 'ring-2 ring-primary shadow-2xl shadow-primary/25' 
                    : 'hover:shadow-xl'
                }`}
                style={{animationDelay: `${index * 150}ms`}}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-secondary text-white text-center py-2 text-sm font-semibold">
                    <Sparkles className="w-4 h-4 inline mr-1" />
                    Mais Popular
                  </div>
                )}
                
                <CardHeader className={`text-center space-y-4 ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg`}>
                    {plan.icon}
                  </div>
                  
                  <div>
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {plan.description}
                    </CardDescription>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-bold">
                        {isYearly && plan.yearlyPrice !== plan.price ? plan.yearlyPrice : plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-muted-foreground">{plan.period}</span>
                      )}
                    </div>
                    
                    {isYearly && plan.savings && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Economize {plan.savings}
                      </Badge>
                    )}
                    
                    {isYearly && plan.yearlyPrice !== plan.price && (
                      <div className="text-sm text-muted-foreground">
                        <span className="line-through">{plan.price}/mês</span>
                        <span className="ml-2 text-green-600 font-semibold">
                          Pague anual e economize!
                        </span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <Button 
                    className={`w-full py-6 text-lg font-semibold transition-all ${
                      plan.highlighted 
                        ? 'bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/25' 
                        : ''
                    } ${loading === plan.id ? 'opacity-50' : 'hover-lift'}`}
                    variant={plan.highlighted ? "default" : "outline"}
                    onClick={() => handlePlanSelect(plan.id)}
                    disabled={loading === plan.id}
                  >
                    {loading === plan.id ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Processando...
                      </div>
                    ) : (
                      <>
                        {plan.id === "basic" ? <Star className="w-5 h-5 mr-2" /> : 
                         plan.id === "enterprise" ? <Crown className="w-5 h-5 mr-2" /> : 
                         <Rocket className="w-5 h-5 mr-2" />}
                        {plan.buttonText}
                      </>
                    )}
                  </Button>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                      Incluído no plano:
                    </h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {plan.limitations && (
                      <div className="pt-4 border-t border-border">
                        <h5 className="font-medium text-sm text-muted-foreground mb-2">
                          Limitações:
                        </h5>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                                <div className="w-2 h-2 bg-orange-400 rounded-full mt-1.5 mx-auto" />
                              </div>
                              <span className="text-sm text-muted-foreground">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16 animate-fade-in">
            <Badge variant="outline" className="glass-effect">
              <Settings className="w-4 h-4 mr-2" />
              Comparação Detalhada
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Compare todos os <span className="gradient-text">recursos</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-background/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-4 font-semibold">Recursos</th>
                  <th className="text-center p-4 font-semibold">Básico</th>
                  <th className="text-center p-4 font-semibold">Profissional</th>
                  <th className="text-center p-4 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { feature: "Categorias", basic: "3", pro: "15", enterprise: "Ilimitadas" },
                  { feature: "Produtos por categoria", basic: "25", pro: "100", enterprise: "Ilimitados" },
                  { feature: "Parâmetros", basic: "8", pro: "20", enterprise: "Ilimitados" },
                  { feature: "Tierlists", basic: "5", pro: "25", enterprise: "Ilimitadas" },
                  { feature: "Analytics", basic: "❌", pro: "✅", enterprise: "✅ + IA" },
                  { feature: "Colaboração", basic: "❌", pro: "3 usuários", enterprise: "Ilimitada" },
                  { feature: "Exportação HD", basic: "❌", pro: "✅", enterprise: "✅ 4K" },
                  { feature: "API", basic: "❌", pro: "❌", enterprise: "✅" },
                  { feature: "Suporte", basic: "Email", pro: "Prioritário", enterprise: "24/7" }
                ].map((row, index) => (
                  <tr key={index} className="hover:bg-muted/25 transition-colors">
                    <td className="p-4 font-medium">{row.feature}</td>
                    <td className="p-4 text-center">{row.basic}</td>
                    <td className="p-4 text-center">{row.pro}</td>
                    <td className="p-4 text-center">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16 animate-fade-in">
            <Badge variant="outline" className="glass-effect">
              <Users className="w-4 h-4 mr-2" />
              Depoimentos
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              O que nossos <span className="gradient-text">usuários dizem</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass-effect hover-lift animate-fade-in" style={{animationDelay: `${index * 200}ms`}}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16 animate-fade-in">
            <Badge variant="outline" className="glass-effect">
              <Headphones className="w-4 h-4 mr-2" />
              Dúvidas Frequentes
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Perguntas <span className="gradient-text">frequentes</span>
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "Posso cancelar a qualquer momento?",
                answer: "Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas adicionais."
              },
              {
                question: "Existe período de teste gratuito?",
                answer: "Sim, oferecemos 14 dias de teste gratuito para todos os planos pagos."
              },
              {
                question: "Meus dados ficam seguros?",
                answer: "Absolutamente! Utilizamos criptografia de ponta e backup automático para proteger seus dados."
              },
              {
                question: "Posso fazer upgrade do meu plano?",
                answer: "Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento."
              }
            ].map((faq, index) => (
              <Card key={index} className="glass-effect animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold">
            Pronto para <span className="gradient-text">começar?</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Junte-se a milhares de criadores que já transformaram suas tier lists
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              onClick={() => handlePlanSelect("pro")}
              className="text-lg px-8 py-6 hover-lift shadow-glow"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Começar Teste Grátis
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/")}
              className="text-lg px-8 py-6 hover-lift glass-effect"
            >
              Saber Mais
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;

