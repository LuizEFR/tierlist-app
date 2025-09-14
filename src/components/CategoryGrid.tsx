import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mouse, Keyboard, Headphones, Monitor, Gamepad2, Cpu } from "lucide-react";

const categories = [
  {
    id: "mice",
    name: "Gaming Mice",
    icon: Mouse,
    count: 156,
    description: "Precision gaming mice with advanced sensors",
    color: "text-primary",
    gradient: "from-primary/20 to-transparent"
  },
  {
    id: "keyboards", 
    name: "Mechanical Keyboards",
    icon: Keyboard,
    count: 89,
    description: "Premium mechanical keyboards for gaming",
    color: "text-secondary",
    gradient: "from-secondary/20 to-transparent"
  },
  {
    id: "headsets",
    name: "Gaming Headsets", 
    icon: Headphones,
    count: 124,
    description: "Immersive audio for competitive gaming",
    color: "text-accent",
    gradient: "from-accent/20 to-transparent"
  },
  {
    id: "monitors",
    name: "Gaming Monitors",
    icon: Monitor, 
    count: 67,
    description: "High refresh rate displays",
    color: "text-primary",
    gradient: "from-primary/20 to-transparent"
  },
  {
    id: "controllers",
    name: "Game Controllers",
    icon: Gamepad2,
    count: 45,
    description: "Precision game controllers",
    color: "text-secondary", 
    gradient: "from-secondary/20 to-transparent"
  },
  {
    id: "cpus",
    name: "Processors (CPU)",
    icon: Cpu,
    count: 78,
    description: "High-performance processors",
    color: "text-accent",
    gradient: "from-accent/20 to-transparent"
  }
];

const CategoryGrid = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Categorias de Produtos
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore rankings especializados criados por nossa comunidade de enthusiasts
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.id}
                className="bg-gradient-card backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 group cursor-pointer overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-muted/20 ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary" className="bg-background/50 backdrop-blur-xs">
                      {category.count} produtos
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-6">
                    {category.description}
                  </p>
                  
                  <Button variant="tier" className="w-full group-hover:border-primary/70">
                    Ver Rankings
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;