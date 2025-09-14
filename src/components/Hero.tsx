import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Star, Zap } from "lucide-react";
import heroImage from "@/assets/hero-tech.jpg";

const Hero = () => {
  return (
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
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-card backdrop-blur-sm rounded-full px-4 py-2 border border-border mb-6">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Plataforma Premium de Rankings</span>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
          Tech Tier Lists
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
          Crie rankings definitivos de produtos tech baseados em especificações técnicas, 
          qualidade de construção e análises detalhadas. Para quem leva hardware a sério.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button variant="hero" size="lg" className="text-lg px-8 py-6">
            Começar Agora
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button variant="premium" size="lg" className="text-lg px-8 py-6">
            Ver Rankings
            <Trophy className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-gradient-card backdrop-blur-sm rounded-xl p-6 border border-border">
            <div className="flex items-center justify-center mb-3">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">500+</h3>
            <p className="text-muted-foreground">Produtos Avaliados</p>
          </div>
          
          <div className="bg-gradient-card backdrop-blur-sm rounded-xl p-6 border border-border">
            <div className="flex items-center justify-center mb-3">
              <Star className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">1.2K+</h3>
            <p className="text-muted-foreground">Tier Lists Criadas</p>
          </div>
          
          <div className="bg-gradient-card backdrop-blur-sm rounded-xl p-6 border border-border">
            <div className="flex items-center justify-center mb-3">
              <Zap className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-2xl font-bold mb-2">25K+</h3>
            <p className="text-muted-foreground">Usuários Ativos</p>
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-primary rounded-full animate-pulse" />
      <div className="absolute top-1/3 right-20 w-3 h-3 bg-secondary rounded-full animate-pulse delay-1000" />
      <div className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-accent rounded-full animate-pulse delay-500" />
    </section>
  );
};

export default Hero;