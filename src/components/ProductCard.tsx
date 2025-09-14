import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Award, DollarSign } from "lucide-react";

interface ProductSpec {
  label: string;
  value: string;
}

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: string;
  rating: number;
  category: string;
  specs: ProductSpec[];
  draggable?: boolean;
}

const ProductCard = ({ 
  id, 
  name, 
  brand, 
  image, 
  price, 
  rating, 
  category, 
  specs,
  draggable = false 
}: ProductCardProps) => {
  return (
    <Card 
      className="bg-gradient-card backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group cursor-pointer"
      draggable={draggable}
      data-product-id={id}
    >
      {/* Image Section */}
      <div className="relative h-32 bg-muted/20 overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-xs">
            {category}
          </Badge>
        </div>
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-background/80 backdrop-blur-xs rounded-md px-2 py-1">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span className="text-xs font-medium">{rating}</span>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="text-xs text-muted-foreground">{brand}</p>
          </div>
          <div className="flex items-center gap-1 text-primary">
            <DollarSign className="w-3 h-3" />
            <span className="text-xs font-medium">{price}</span>
          </div>
        </div>
        
        {/* Specs */}
        <div className="space-y-1 mb-3">
          {specs.slice(0, 2).map((spec, index) => (
            <div key={index} className="flex justify-between text-xs">
              <span className="text-muted-foreground">{spec.label}:</span>
              <span className="text-foreground font-medium">{spec.value}</span>
            </div>
          ))}
        </div>
        
        {/* Premium indicator */}
        <div className="flex items-center justify-center mt-2 pt-2 border-t border-border/50">
          <Award className="w-3 h-3 text-primary mr-1" />
          <span className="text-xs text-primary font-medium">Verified Review</span>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;