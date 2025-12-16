import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

interface FranchiseCardProps {
  id: string;
  name: string;
  logo?: string;
  investmentMin: number;
  investmentMax: number;
  sector: string;
  category: string;
  grade?: "A" | "B" | "C" | "D";
  isLoggedIn?: boolean;
  onSave?: () => void;
  onCompare?: () => void;
}

export function FranchiseCard({
  id,
  name,
  logo,
  investmentMin,
  investmentMax,
  sector,
  category,
  grade,
  isLoggedIn = false,
  onSave,
  onCompare,
}: FranchiseCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Generate different blue colors based on card index or name using the color palette
  const blueColors = [
    "#446786",
    "#4F7AA5",
    "#A4C6E8",
    "#DEE8F2",
    "#F4F8FE",
  ];
  const colorIndex = (id.charCodeAt(0) + (id.charCodeAt(id.length - 1) || 0)) % blueColors.length;
  const selectedColor = blueColors[colorIndex];

  return (
    <Card className="!border-[1px] border-[#d5e0f2] overflow-hidden rounded-[20px] shadow-none hover:shadow-card-hover">
      {/* Image */}
      <div className="aspect-[545/232] w-full relative rounded-t-[20px] overflow-hidden">
        {logo ? (
          <img src={logo} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div 
            className="w-full h-full"
            style={{ backgroundColor: selectedColor }}
          />
        )}
      </div>

      <CardContent className="p-5 pt-0 flex flex-col gap-5">
        {/* Header with Category and Grade */}
        <div className="flex items-center justify-between border-b-[1px] border-[#eaeff9] py-2">
          <p className="text-xs font-normal text-foreground leading-normal">{category}</p>
          <div className="flex items-center gap-1 bg-[#dee8f2] px-1.5 py-0.5 rounded-full">
            <span className="text-sm font-bold text-[#446786]">Grade</span>
            <span className="text-sm font-bold text-[#446786]">*</span>
          </div>
        </div>

        {/* Title and Investment */}
        <div className="flex flex-col gap-2">
          <p className="text-base font-bold text-foreground leading-normal">{name}</p>
          <p className="text-base font-normal text-foreground leading-normal">
            Min. investment {formatCurrency(investmentMin)}
          </p>
        </div>

        {/* Primary CTA Button */}
        <Link to={`/brand/${id}`} className="w-full">
          <Button 
            variant="navy" 
            className="w-full rounded-[30px] py-2 px-5 text-base font-bold"
          >
            Learn more
          </Button>
        </Link>

        {/* Action Buttons */}
        <div className="flex gap-3 items-start">
          {/* Compare Button */}
          <Button
            variant="outline"
            onClick={onCompare}
            className="rounded-[30px] py-2 px-5 text-base font-normal border-[#8ba4bd] text-[#8ba4bd] hover:bg-[#8ba4bd]/10"
          >
            Compare
          </Button>
          
          {/* Thumbs Up */}
          <button
            type="button"
            onClick={() => {}}
            className="h-[38px] w-[40px] rounded-[30px] border border-[#8ba4bd] flex items-center justify-center hover:bg-[#8ba4bd]/10 transition-colors"
          >
            <ThumbsUp className="w-4 h-4 text-[#8ba4bd] fill-current" />
          </button>

          {/* Thumbs Down */}
          <button
            type="button"
            onClick={() => {}}
            className="h-[38px] w-[40px] rounded-[30px] border border-[#8ba4bd] flex items-center justify-center hover:bg-[#8ba4bd]/10 transition-colors"
          >
            <ThumbsDown className="w-4 h-4 text-[#8ba4bd] fill-current" />
          </button>

          {/* Bookmark */}
          <button
            type="button"
            onClick={onSave}
            className="h-[38px] w-[40px] rounded-[30px] border border-[#8ba4bd] flex items-center justify-center hover:bg-[#8ba4bd]/10 transition-colors"
          >
            <Bookmark className="w-4 h-4 text-[#8ba4bd] fill-current" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
