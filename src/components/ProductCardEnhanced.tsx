import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Package, Info, Eye } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  specifications?: any;
  parameter_values?: any;
  category?: {
    name: string;
  };
}

interface Parameter {
  id: string;
  name: string;
  parameter_type: string;
  options?: any;
}

interface ProductCardEnhancedProps {
  product: Product;
  parameters?: Parameter[];
  draggable?: boolean;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
  className?: string;
}

const ProductCardEnhanced = ({ 
  product, 
  parameters = [],
  draggable = false,
  size = 'medium',
  showDetails = true,
  className = ""
}: ProductCardEnhancedProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Função para obter o nome do parâmetro pelo ID
  const getParameterName = (paramId: string) => {
    const param = parameters.find(p => p.id === paramId);
    return param?.name || paramId;
  };

  // Função para formatar valor do parâmetro
  const formatParameterValue = (value: any, paramType?: string) => {
    if (paramType === 'boolean') {
      return value === 'true' || value === true ? 'Sim' : 'Não';
    }
    return String(value);
  };

  // Obter parâmetros principais para exibir no card
  const getMainParameters = () => {
    if (!product.parameter_values) return [];
    
    const entries = Object.entries(product.parameter_values);
    return entries.slice(0, 2); // Mostrar apenas os 2 primeiros parâmetros
  };

  // Configurações de tamanho
  const sizeConfig = {
    small: {
      container: "w-16 h-16",
      image: "w-6 h-6",
      text: "text-xs",
      padding: "p-1"
    },
    medium: {
      container: "w-20 h-20",
      image: "w-8 h-8", 
      text: "text-xs",
      padding: "p-1"
    },
    large: {
      container: "w-32 h-40",
      image: "w-12 h-12",
      text: "text-sm",
      padding: "p-2"
    }
  };

  const config = sizeConfig[size];
  const mainParams = getMainParameters();

  return (
    <>
      <Card 
        className={`${config.container} ${config.padding} bg-card border rounded-lg flex flex-col items-center justify-center text-center hover-lift transition-all duration-200 ${draggable ? 'cursor-grab active:cursor-grabbing' : ''} ${className}`}
        draggable={draggable}
        data-product-id={product.id}
      >
        {/* Imagem do produto */}
        <div className="flex-shrink-0 mb-1">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className={`${config.image} object-cover rounded`}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <Package className={`${config.image} text-muted-foreground`} />
          )}
        </div>

        {/* Nome do produto */}
        <span className={`${config.text} text-foreground truncate w-full font-medium mb-1`}>
          {product.name}
        </span>

        {/* Parâmetros principais (apenas para tamanho large) */}
        {size === 'large' && mainParams.length > 0 && (
          <div className="w-full space-y-1 mb-2">
            {mainParams.map(([paramId, value]) => (
              <div key={paramId} className="flex justify-between text-xs">
                <span className="text-muted-foreground truncate">
                  {getParameterName(paramId)}:
                </span>
                <span className="text-foreground font-medium truncate ml-1">
                  {formatParameterValue(value)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Badges para parâmetros (tamanho medium) */}
        {size === 'medium' && mainParams.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-center mb-1">
            {mainParams.slice(0, 1).map(([paramId, value]) => (
              <Badge key={paramId} variant="secondary" className="text-xs px-1 py-0">
                {formatParameterValue(value)}
              </Badge>
            ))}
          </div>
        )}

        {/* Botão de detalhes (apenas se showDetails for true e tamanho large) */}
        {showDetails && size === 'large' && (
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs h-6"
            onClick={(e) => {
              e.stopPropagation();
              setIsDetailsOpen(true);
            }}
          >
            <Eye className="w-3 h-3 mr-1" />
            Detalhes
          </Button>
        )}
      </Card>

      {/* Modal de detalhes */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Detalhes do Produto
            </DialogTitle>
            <DialogDescription>
              Informações completas sobre {product.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Imagem e informações básicas */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                    <Package className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                {product.category && (
                  <Badge variant="outline" className="mb-2">
                    {product.category.name}
                  </Badge>
                )}
                {product.description && (
                  <p className="text-muted-foreground">{product.description}</p>
                )}
              </div>
            </div>

            {/* Parâmetros */}
            {product.parameter_values && Object.keys(product.parameter_values).length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-3">Parâmetros</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(product.parameter_values).map(([paramId, value]) => (
                    <div key={paramId} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">{getParameterName(paramId)}:</span>
                      <Badge variant="secondary">
                        {formatParameterValue(value)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Especificações */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-3">Especificações</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">{key}:</span>
                      <span className="text-muted-foreground">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Caso não tenha parâmetros nem especificações */}
            {(!product.parameter_values || Object.keys(product.parameter_values).length === 0) &&
             (!product.specifications || Object.keys(product.specifications).length === 0) && (
              <div className="text-center py-8">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma informação adicional disponível para este produto.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCardEnhanced;

