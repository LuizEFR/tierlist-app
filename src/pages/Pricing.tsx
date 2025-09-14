import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star, Zap, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Pricing = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

const plans = [
  {
    name: "Básico",
    price: "Grátis",
    description: "Para começar a criar suas tierlists",
    features: [
      "2 Categorias",
      "20 Produtos", 
      "6 Parâmetros",
      "2 Tierlists",
      "Suporte por email"
    ],
    buttonText: "Começar grátis",
    highlighted: false,
    popular: false,
    tier: "standard" as const,
    icon: <Star className="w-6 h-6" />,
    limits: {
      categories: 2,
      products: 20,
      parameters: 6,
      tierlists: 2
    }
  },
  {
    name: "Profissional", 
    price: "R$ 29,99",
    period: "/mês",
    description: "Para criadores de conteúdo",
    features: [
      "10 Categorias",
      "50 Produtos",
      "10 Parâmetros", 
      "10 Tierlists",
      "Analytics avançado",
      "Suporte prioritário"
    ],
    buttonText: "Assinar Profissional",
    highlighted: true,
    popular: true,
    tier: "professional" as const,
    icon: <Zap className="w-6 h-6" />,
    limits: {
      categories: 10,
      products: 50,
      parameters: 10,
      tierlists: 10
    }
  },
  {
    name: "Master",
    price: "R$ 39,99", 
    period: "/mês",
    description: "Para equipes e empresas",
    features: [
      "30 Categorias",
      "50 Produtos",
      "15 Parâmetros",
      "50 Tierlists", 
      "Colaboração em equipe",
      "API personalizada",
      "Suporte dedicado"
    ],
    buttonText: "Assinar Master",
    highlighted: false,
    popular: false,
    tier: "master" as const,
    icon: <Crown className="w-6 h-6" />,
    limits: {
      categories: 30,
      products: 50,
      parameters: 15,
      tierlists: 50
    }
  }
];

  const handleSubscribe = async (tier: 'professional' | 'master') => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setLoading(tier);
    // TODO: Implement Stripe integration
    console.log(`Subscribe to ${tier}`);
    setLoading(null);
  };

  const getCurrentPlan = () => {
    return profile?.subscription_tier || 'standard';
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
            
            <Link to="/" className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TechTier
              </span>
            </Link>
            
            <div className="w-20" /> {/* Spacer */}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
            Escolha seu Plano
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Desbloqueie todo o potencial da plataforma TechTier com nossos planos flexíveis
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const isCurrentPlan = getCurrentPlan() === plan.tier;
            const isUpgrade = ['pro', 'master'].includes(plan.tier) && getCurrentPlan() === 'standard';
            
            return (
              <Card 
                key={plan.name}
                className={`relative bg-gradient-card backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 ${
                  plan.popular ? 'scale-105 border-primary/30' : ''
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    Mais Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    {plan.price !== 'Grátis' && (
                      <span className="text-muted-foreground">/mês</span>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className="w-full"
                    variant={isCurrentPlan ? "outline" : plan.popular ? "premium" : "default"}
                    disabled={isCurrentPlan || loading === plan.tier}
                    onClick={() => plan.tier !== 'standard' && handleSubscribe(plan.tier)}
                  >
                    {loading === plan.tier ? 'Processando...' : 
                     isCurrentPlan ? 'Plano Atual' :
                     isUpgrade ? `Fazer Upgrade para ${plan.name}` :
                     plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 text-center">
          <h3 className="text-2xl font-bold mb-8">Perguntas Frequentes</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h4 className="font-semibold mb-2">Posso cancelar a qualquer momento?</h4>
              <p className="text-muted-foreground text-sm">
                Sim, você pode cancelar sua assinatura a qualquer momento sem taxas de cancelamento.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">O que acontece com meus dados?</h4>
              <p className="text-muted-foreground text-sm">
                Seus dados ficam seguros. Ao fazer downgrade, apenas as funcionalidades premium são removidas.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Posso fazer upgrade depois?</h4>
              <p className="text-muted-foreground text-sm">
                Claro! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Há desconto anual?</h4>
              <p className="text-muted-foreground text-sm">
                Sim, oferecemos 20% de desconto para assinaturas anuais. Entre em contato conosco.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;