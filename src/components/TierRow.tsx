import { cn } from "@/lib/utils";

interface TierRowProps {
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  children: React.ReactNode;
  onDrop?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
}

const tierConfig = {
  S: { label: 'S-Tier', color: 'bg-tier-s', textColor: 'text-white', description: 'Excepcional' },
  A: { label: 'A-Tier', color: 'bg-tier-a', textColor: 'text-white', description: 'Excelente' },
  B: { label: 'B-Tier', color: 'bg-tier-b', textColor: 'text-white', description: 'Bom' },
  C: { label: 'C-Tier', color: 'bg-tier-c', textColor: 'text-white', description: 'Regular' },
  D: { label: 'D-Tier', color: 'bg-tier-d', textColor: 'text-white', description: 'Ruim' }
};

const TierRow = ({ tier, children, onDrop, onDragOver }: TierRowProps) => {
  const config = tierConfig[tier];
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver?.(e);
  };
  
  return (
    <div className="flex min-h-[120px] border border-border rounded-lg overflow-hidden bg-gradient-card backdrop-blur-sm">
      {/* Tier Label */}
      <div className={cn(
        "w-24 flex flex-col items-center justify-center text-center p-4",
        config.color,
        config.textColor
      )}>
        <div className="text-2xl font-bold mb-1">{config.label}</div>
        <div className="text-xs opacity-90">{config.description}</div>
      </div>
      
      {/* Drop Zone */}
      <div 
        className="flex-1 p-4 min-h-[120px] border-l border-border/50 transition-colors duration-200 hover:bg-muted/10"
        onDrop={onDrop}
        onDragOver={handleDragOver}
        data-tier={tier}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 h-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default TierRow;