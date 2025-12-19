import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GradeBadge } from "./GradeBadge";
import { GitCompare, MessageCircle, Check, X, MapPin, Clock, DollarSign } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCompare } from "@/hooks/useCompare";
import { generateMatchReasons } from "@/utils/matchReasons";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useMemo } from "react";

interface MatchCardProps {
  id: string;
  name: string;
  logo?: string;
  grade: "A" | "B" | "C" | "D";
  whyYes?: string[]; // Optional - will be generated if not provided
  whyNot?: string[]; // Optional - will be generated if not provided
  investmentMin?: number; // For personalized reasons
  investmentMax?: number; // For personalized reasons
  sector?: string; // For personalized reasons
  category?: string; // For personalized reasons
  fitChips: {
    territory: boolean;
    lifestyle: boolean;
    budget: boolean;
  };
  onCompare?: () => void;
}

export function MatchCard({
  id,
  name,
  logo,
  grade,
  whyYes: providedWhyYes,
  whyNot: providedWhyNot,
  investmentMin,
  investmentMax,
  sector,
  category,
  fitChips,
  onCompare,
}: MatchCardProps) {
  const navigate = useNavigate();
  const { addToCompare, isInCompare } = useCompare();
  const { profile } = useUserProfile();

  // Generate personalized reasons based on user profile vs brand
  // Only generate personalized reasons if user is logged in and has profile data
  const { whyYes, whyNot } = useMemo(() => {
    // If personalized reasons are provided, use them
    if (providedWhyYes && providedWhyYes.length > 0 && providedWhyNot && providedWhyNot.length > 0) {
      return {
        whyYes: providedWhyYes,
        whyNot: providedWhyNot,
      };
    }

    // Generate personalized reasons only if user is logged in and has profile
    // For public users, use generic reasons
    const hasProfile = profile && (profile.budget || profile.location || profile.industries);
    if (hasProfile) {
      return generateMatchReasons(
        profile,
        {
          investmentMin,
          investmentMax,
          sector,
          category,
          territory: fitChips.territory ? "Available" : "Limited",
          lifestyle: fitChips.lifestyle ? profile.lifestyle : undefined,
          name,
        },
        fitChips
      );
    }

    // Default generic reasons for public users
    return {
      whyYes: [
        "Proven business model",
        "Strong brand recognition",
        "Comprehensive training and support",
      ],
      whyNot: [
        "Consider market competition",
      ],
    };
  }, [profile, fitChips, name, investmentMin, investmentMax, sector, category, providedWhyYes, providedWhyNot]);

  const handleCompare = async () => {
    // Check if already in compare list
    const alreadyInCompare = isInCompare(id);
    
    if (alreadyInCompare) {
      // If already in compare, just navigate to compare page
      navigate("/compare");
      if (onCompare) {
        onCompare();
      }
      return;
    }

    // If not in compare, add it first
    const franchiseData = {
      id,
      name,
      logo: logo || null,
      grade,
      whyYes,
      whyNot,
    };
    
    // Add to compare (fetches full brand data from API)
    const added = await addToCompare(franchiseData);
    
    // Navigate to compare page if successfully added
    // addToCompare returns true if added OR if already in list
    if (added) {
      // Small delay to ensure localStorage is written before navigation
      setTimeout(() => {
        navigate("/compare");
      }, 50);
    }
    
    // Call original onCompare if provided
    if (onCompare) {
      onCompare();
    }
  };

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
            <div className="flex flex-col items-center gap-1.5">
              <GradeBadge grade={grade} size="lg" />
              <span className="text-xs font-medium text-muted-foreground text-center">
                Grade
              </span>
            </div>
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
                  {(() => {
                    // Always show 2-3 items (prefer 3, but at least 2)
                    const displayItems = whyYes.length >= 3 
                      ? whyYes.slice(0, 3) 
                      : whyYes.length >= 2 
                        ? whyYes.slice(0, 2)
                        : whyYes.length === 1
                          ? [...whyYes, "Strong business fundamentals"] // Add default if only 1
                          : ["Proven business model", "Strong brand recognition"]; // Default if empty
                    
                    return displayItems.map((item, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ));
                  })()}
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <X className="w-4 h-4 text-rose-500" />
                  Why Not
                </h4>
                <ul className="space-y-1">
                  {(() => {
                    // Always show 1-2 items (prefer 2, but at least 1)
                    const displayItems = whyNot.length >= 2 
                      ? whyNot.slice(0, 2) 
                      : whyNot.length === 1
                        ? whyNot
                        : ["Consider market competition"]; // Default if empty
                    
                    return displayItems.map((item, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ));
                  })()}
                </ul>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex md:flex-col gap-2 justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCompare}
              className={isInCompare(id) ? "bg-muted" : ""}
            >
              {isInCompare(id) ? "In Compare" : "Compare"}
            </Button>
            <Button variant="navy" size="sm">
              Talk to an Advisor
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
