import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import TierRow from "./TierRow";
import ProductCard from "./ProductCard";
import { Save, Share2, RotateCcw, Plus } from "lucide-react";

// Mock data for demonstration
const mockProducts = [
  {
    id: "1",
    name: "Logitech MX Master 3S",
    brand: "Logitech",
    image: "/placeholder.svg",
    price: "$99",
    rating: 4.8,
    category: "Mouse",
    specs: [
      { label: "DPI", value: "8000" },
      { label: "Conexão", value: "Wireless" }
    ]
  },
  {
    id: "2", 
    name: "SteelSeries Rival 650",
    brand: "SteelSeries",
    image: "/placeholder.svg",
    price: "$89",
    rating: 4.6,
    category: "Mouse",
    specs: [
      { label: "DPI", value: "12000" },
      { label: "Peso", value: "121g" }
    ]
  },
  {
    id: "3",
    name: "Razer DeathAdder V3",
    brand: "Razer", 
    image: "/placeholder.svg",
    price: "$79",
    rating: 4.7,
    category: "Mouse",
    specs: [
      { label: "DPI", value: "30000" },
      { label: "Sensor", value: "Focus Pro" }
    ]
  }
];

const TierListMaker = () => {
  const [tierList, setTierList] = useState<{[key: string]: any[]}>({
    S: [],
    A: [], 
    B: [],
    C: [],
    D: []
  });
  
  const [availableProducts, setAvailableProducts] = useState(mockProducts);
  const [listTitle, setListTitle] = useState("Meu Ranking de Gaming Mice 2024");
  
  const handleDragStart = (e: React.DragEvent, productId: string) => {
    e.dataTransfer.setData("text/plain", productId);
  };
  
  const handleDrop = (e: React.DragEvent, targetTier: string) => {
    e.preventDefault();
    const productId = e.dataTransfer.getData("text/plain");
    
    // Find product in available products or other tiers
    let product = availableProducts.find(p => p.id === productId);
    let sourceTier = null;
    
    if (!product) {
      // Find in tiers
      for (const [tier, products] of Object.entries(tierList)) {
        const found = products.find(p => p.id === productId);
        if (found) {
          product = found;
          sourceTier = tier;
          break;
        }
      }
    }
    
    if (!product) return;
    
    // Remove from source
    if (sourceTier) {
      setTierList(prev => ({
        ...prev,
        [sourceTier]: prev[sourceTier].filter(p => p.id !== productId)
      }));
    } else {
      setAvailableProducts(prev => prev.filter(p => p.id !== productId));
    }
    
    // Add to target tier
    setTierList(prev => ({
      ...prev,
      [targetTier]: [...prev[targetTier], product]
    }));
  };
  
  const resetTierList = () => {
    setAvailableProducts(mockProducts);
    setTierList({ S: [], A: [], B: [], C: [], D: [] });
  };
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <Input 
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              className="text-2xl font-bold bg-transparent border-none p-0 h-auto focus-visible:ring-0"
            />
            <p className="text-muted-foreground mt-1">
              Arraste os produtos para as categorias correspondentes
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetTierList}>
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            <Button variant="premium">
              <Save className="w-4 h-4" />
              Salvar
            </Button>
            <Button variant="hero">
              <Share2 className="w-4 h-4" />
              Compartilhar
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline">Gaming Mice</Badge>
          <Badge variant="outline">2024</Badge>
          <Badge variant="outline">Performance</Badge>
        </div>
      </div>
      
      {/* Tier List */}
      <div className="space-y-4 mb-8">
        {(['S', 'A', 'B', 'C', 'D'] as const).map(tier => (
          <TierRow 
            key={tier}
            tier={tier}
            onDrop={(e) => handleDrop(e, tier)}
          >
            {tierList[tier].map(product => (
              <div key={product.id} onDragStart={(e) => handleDragStart(e, product.id)}>
                <ProductCard {...product} draggable />
              </div>
            ))}
          </TierRow>
        ))}
      </div>
      
      {/* Available Products */}
      <Card className="bg-gradient-card backdrop-blur-sm border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Produtos Disponíveis</h3>
          <Badge variant="secondary">{availableProducts.length}</Badge>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {availableProducts.map(product => (
            <div key={product.id} onDragStart={(e) => handleDragStart(e, product.id)}>
              <ProductCard {...product} draggable />
            </div>
          ))}
        </div>
        
        {availableProducts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Todos os produtos foram classificados! 🎉</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TierListMaker;