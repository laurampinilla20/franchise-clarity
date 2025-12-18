import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GradeBadge } from "./GradeBadge";
import { Heart, GitCompare, MessageCircle, Check, X, MapPin, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

interface MatchCardProps {
  id: string;
  name: string;
  logo?: string;
  grade: "A" | "B" | "C" | "D";
  whyYes: string[];
  whyNot: string[];
  fitChips: {
    territory: boolean;
    lifestyle: boolean;
    budget: boolean;
  };
  onSave?: () => void;
  onCompare?: () => void;
}

export function MatchCard({
  id,
  name,
  logo,
  grade,
  whyYes,
  whyNot,
  fitChips,
  onSave,
  onCompare,
}: MatchCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Logo and Grade */}
          <div className="flex md:flex-col items-center gap-4 md:gap-3">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
              {logo ? (
                <img src={logo} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-muted-foreground">
                  {name.charAt(0)}
                </span>
              )}
            </div>
            <GradeBadge grade={grade} size="lg" />
          </div>

          {/* Middle: Content */}
          <div className="flex-1 space-y-4">
            <div>
              <Link to={`/best-franchises/brand/${id}`}>
                <h3 className="text-xl font-semibold text-foreground hover:text-primary transition-colors">
                  {name}
                </h3>
              </Link>

              {/* Fit Chips */}
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant={fitChips.territory ? "success" : "soft"} className="gap-1">
                  <MapPin className="w-3 h-3" />
                  Territory {fitChips.territory ? "Available" : "Limited"}
                </Badge>
                <Badge variant={fitChips.lifestyle ? "success" : "soft"} className="gap-1">
                  <Clock className="w-3 h-3" />
                  Lifestyle {fitChips.lifestyle ? "Match" : "Mismatch"}
                </Badge>
                <Badge variant={fitChips.budget ? "success" : "soft"} className="gap-1">
                  <DollarSign className="w-3 h-3" />
                  Budget {fitChips.budget ? "Aligned" : "Stretch"}
                </Badge>
              </div>
            </div>

            {/* Why Yes / Why Not */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-primary" />
                  Why Yes
                </h4>
                <ul className="space-y-1">
                  {whyYes.slice(0, 3).map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <X className="w-4 h-4 text-rose-500" />
                  Why Not
                </h4>
                <ul className="space-y-1">
                  {whyNot.slice(0, 3).map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex md:flex-col gap-2 justify-end">
            <Button variant="icon" size="icon" onClick={onSave}>
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="icon" size="icon" onClick={onCompare}>
              <GitCompare className="w-4 h-4" />
            </Button>
            <Button variant="navy" size="sm" className="gap-1.5">
              <MessageCircle className="w-4 h-4" />
              Advisor
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
