import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GradeBadge } from "./GradeBadge";
import { Heart, GitCompare, Lock, DollarSign, MapPin, Building2 } from "lucide-react";
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

  return (
    <Card className="group overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
            {logo ? (
              <img src={logo} alt={name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-8 h-8 text-muted-foreground" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-foreground truncate">{name}</h3>
              {isLoggedIn && grade ? (
                <GradeBadge grade={grade} size="sm" />
              ) : (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Lock className="w-3 h-3" />
                  <span>Sign in</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Badge variant="chip">{sector}</Badge>
              <Badge variant="chip">{category}</Badge>
            </div>

            <div className="flex items-center gap-1.5 mt-3 text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              <span>
                {formatCurrency(investmentMin)} – {formatCurrency(investmentMax)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0 flex gap-2">
        <Button
          variant="icon"
          size="icon"
          onClick={onSave}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="w-4 h-4" />
        </Button>
        <Button
          variant="icon"
          size="icon"
          onClick={onCompare}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GitCompare className="w-4 h-4" />
        </Button>
        <Link to={`/brand/${id}`} className="flex-1">
          <Button variant="soft" className="w-full">
            {isLoggedIn ? "View Details" : "Unlock Details"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
