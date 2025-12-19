import { PageLayout } from "@/components/layout";
import { GradeBadge } from "@/components/franchise";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  X,
  CheckCircle2,
  XCircle,
  DollarSign,
  TrendingUp,
  MapPin,
  Clock,
  Users,
  MessageCircle,
  Plus,
  FileText,
  Calendar,
  Building2,
} from "lucide-react";
import { useCompare } from "@/hooks/useCompare";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

export default function Compare() {
  const { isLoggedIn, user } = useAuth();
  const { compareItems, removeFromCompare } = useCompare();
  const [mounted, setMounted] = useState(false);
  
  // Force reload on mount to ensure we have latest data
  useEffect(() => {
    setMounted(true);
    // The useCompare hook will handle loading user-specific data
  }, []);
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Show empty state if not logged in or no items
  if (!isLoggedIn || compareItems.length === 0) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Compare Franchises</h1>
            <Card>
              <CardContent className="p-12">
                <p className="text-muted-foreground mb-6">
                  {!isLoggedIn
                    ? "Please sign in to compare franchises."
                    : "No franchises selected for comparison. Add franchises from the browse page to compare them."}
                </p>
                {!isLoggedIn ? (
                  <Link to="/best-franchises">
                    <Button variant="cta">Browse Franchises</Button>
                  </Link>
                ) : (
                  <Link to="/best-franchises">
                    <Button variant="cta">Browse Franchises</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Calculate if we should show "Add Franchise" column
  const canAddMore = compareItems.length < 4;
  const totalCols = compareItems.length + (canAddMore ? 1 : 0) + 1; // +1 for label column
  
  // Dynamic grid columns based on number of items
  const getGridCols = (cols: number) => {
    if (cols <= 2) return "grid-cols-2";
    if (cols <= 3) return "grid-cols-3";
    if (cols <= 4) return "grid-cols-4";
    if (cols <= 5) return "grid-cols-5";
    return "grid-cols-5"; // Max 4 compare items + 1 add + 1 label = 6, but we cap at 5
  };
  
  const gridCols = getGridCols(totalCols);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Compare Franchises</h1>
            <p className="text-muted-foreground">
              Side-by-side comparison of your selected franchises
            </p>
          </div>
          <Button variant="cta">
            Discuss with Advisor
          </Button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Franchise Headers */}
            <div className={`grid ${gridCols} gap-4 mb-6`}>
              <div className="font-medium text-muted-foreground">Franchise</div>
              {compareItems.map((franchise) => (
                <Card key={franchise.id} className="relative">
                  <button
                    onClick={() => removeFromCompare(franchise.id)}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors z-10"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 rounded-xl bg-muted mx-auto mb-3 flex items-center justify-center overflow-hidden">
                      {franchise.logo ? (
                        <img
                          src={franchise.logo}
                          alt={franchise.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-bold text-muted-foreground">
                          {franchise.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground">{franchise.name}</h3>
                    {franchise.grade && (
                      <div className="mt-2 flex justify-center">
                        <GradeBadge grade={franchise.grade} size="md" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              {/* Add Franchise Column */}
              {canAddMore && (
                <Card className="border-dashed">
                  <Link to="/best-franchises">
                    <CardContent className="p-4 text-center h-full flex flex-col items-center justify-center min-h-[140px] hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="w-12 h-12 rounded-xl bg-muted/50 mx-auto mb-3 flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                        <Plus className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold text-foreground text-sm mb-1">Add Franchise</h3>
                      <p className="text-xs text-muted-foreground">
                        {4 - compareItems.length} more available
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              )}
            </div>

            {/* Comparison Rows */}
            <div className="space-y-4">
              {/* Investment - Always shown */}
              <div className={`grid ${gridCols} gap-4 items-center py-4 border-b border-border`}>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  Investment
                </div>
                {compareItems.map((f) => (
                  <div key={f.id} className="text-center flex items-center justify-center">
                    {f.investmentMin && f.investmentMax ? (
                      <span className="font-semibold text-foreground">
                        {formatCurrency(f.investmentMin)} – {formatCurrency(f.investmentMax)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                ))}
                {canAddMore && <div className="text-center"></div>}
              </div>

                {/* Franchise Fee - Always shown */}
                <div className={`grid ${gridCols} gap-4 items-center py-4 border-b border-border`}>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    Franchise Fee
                  </div>
                  {compareItems.map((f) => (
                    <div key={f.id} className="text-center flex items-center justify-center">
                      {f.franchiseFee ? (
                        <span className="font-semibold text-foreground">{formatCurrency(f.franchiseFee)}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  ))}
                  {canAddMore && <div className="text-center"></div>}
                </div>

                {/* Royalty Fee - Always shown */}
                <div className={`grid ${gridCols} gap-4 items-center py-4 border-b border-border`}>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    Royalty Fee
                  </div>
                  {compareItems.map((f) => (
                    <div key={f.id} className="text-center flex items-center justify-center">
                      {f.royalty ? (
                        <span className="font-medium text-foreground">{f.royalty}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  ))}
                  {canAddMore && <div className="text-center"></div>}
                </div>

                {/* Marketing Fee - Always shown */}
                <div className={`grid ${gridCols} gap-4 items-center py-4 border-b border-border`}>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    Marketing Fee
                  </div>
                  {compareItems.map((f) => (
                    <div key={f.id} className="text-center flex items-center justify-center">
                      {f.marketingFee ? (
                        <span className="font-medium text-foreground">{f.marketingFee}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  ))}
                  {canAddMore && <div className="text-center"></div>}
                </div>

                {/* Initial Term - Always shown */}
                <div className={`grid ${gridCols} gap-4 items-center py-4 border-b border-border`}>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Initial Term
                  </div>
                  {compareItems.map((f) => (
                    <div key={f.id} className="text-center flex items-center justify-center">
                      {f.initialTerm ? (
                        <span className="font-medium text-foreground">{f.initialTerm}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  ))}
                  {canAddMore && <div className="text-center"></div>}
                </div>

                {/* Total Locations - Always shown */}
                <div className={`grid ${gridCols} gap-4 items-center py-4 border-b border-border`}>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    Total Locations
                  </div>
                  {compareItems.map((f) => (
                    <div key={f.id} className="text-center flex items-center justify-center">
                      {f.locations ? (
                        <span className="font-semibold text-foreground">{f.locations.toLocaleString()}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  ))}
                  {canAddMore && <div className="text-center"></div>}
                </div>

                {/* Revenue - Conditional */}
                {compareItems.some((f) => f.avgRevenue) && (
                  <div className={`grid ${gridCols} gap-4 items-center py-4 border-b border-border`}>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <TrendingUp className="w-4 h-4" />
                      Avg. Revenue
                    </div>
                    {compareItems.map((f) => (
                      <div key={f.id} className="text-center">
                        {f.avgRevenue ? (
                          <span className="font-semibold text-foreground">{formatCurrency(f.avgRevenue)}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </div>
                    ))}
                    {canAddMore && <div className="text-center"></div>}
                  </div>
                )}

                {/* Profit - Conditional */}
                {compareItems.some((f) => f.avgProfit) && (
                  <div className={`grid ${gridCols} gap-4 items-center py-4 border-b border-border`}>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                      Avg. Profit
                    </div>
                    {compareItems.map((f) => (
                      <div key={f.id} className="text-center">
                        {f.avgProfit ? (
                          <span className="font-semibold text-primary">{formatCurrency(f.avgProfit)}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </div>
                    ))}
                    {canAddMore && <div className="text-center"></div>}
                  </div>
                )}

                {/* Working Capital - Conditional */}
                {compareItems.some((f) => f.workingCapital) && (
                  <div className={`grid ${gridCols} gap-4 items-center py-4 border-b border-border`}>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                      Working Capital
                    </div>
                    {compareItems.map((f) => (
                      <div key={f.id} className="text-center">
                        {f.workingCapital ? (
                          <span className="font-semibold text-foreground">{formatCurrency(f.workingCapital)}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </div>
                    ))}
                    {canAddMore && <div className="text-center"></div>}
                  </div>
                )}

                {/* Lifestyle - Conditional */}
                {compareItems.some((f) => f.lifestyle) && (
                  <div className={`grid ${gridCols} gap-4 items-center py-4 border-b border-border`}>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      Lifestyle
                    </div>
                    {compareItems.map((f) => (
                      <div key={f.id} className="text-center">
                        {f.lifestyle ? (
                          <Badge variant="soft">{f.lifestyle}</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </div>
                    ))}
                    {canAddMore && <div className="text-center"></div>}
                  </div>
                )}

                {/* Territory - Conditional */}
                {compareItems.some((f) => f.territory) && (
                  <div className={`grid ${gridCols} gap-4 items-center py-4 border-b border-border`}>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      Territory
                    </div>
                    {compareItems.map((f) => (
                      <div key={f.id} className="text-center">
                        {f.territory ? (
                          <Badge variant={f.territory === "Available" ? "success" : "warning"}>
                            {f.territory}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </div>
                    ))}
                    {canAddMore && <div className="text-center"></div>}
                  </div>
                )}

                {/* Founded Year - Conditional */}
                {compareItems.some((f) => f.founded) && (
                  <div className={`grid ${gridCols} gap-4 items-center py-4 border-b border-border`}>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      Founded
                    </div>
                    {compareItems.map((f) => (
                      <div key={f.id} className="text-center">
                        {f.founded ? (
                          <span className="font-medium text-foreground">{f.founded}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </div>
                    ))}
                    {canAddMore && <div className="text-center"></div>}
                  </div>
                )}

                {/* Item 19 Disclosed - Conditional */}
                {compareItems.some((f) => f.item19Disclosed) && (
                  <div className={`grid ${gridCols} gap-4 items-center py-4 border-b border-border`}>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <FileText className="w-4 h-4" />
                      Item 19 Disclosed
                    </div>
                    {compareItems.map((f) => (
                      <div key={f.id} className="text-center">
                        {f.item19Disclosed ? (
                          <Badge variant={f.item19Disclosed === "Yes" ? "success" : "soft"}>
                            {f.item19Disclosed}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </div>
                    ))}
                    {canAddMore && <div className="text-center"></div>}
                  </div>
                )}

              {/* Why Yes - Always shown */}
              <div className={`grid ${gridCols} gap-4 py-4 border-b border-border`}>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Why Yes
                </div>
                {compareItems.map((f) => (
                  <div key={f.id} className="flex items-center justify-center min-h-[24px]">
                    {f.whyYes && f.whyYes.length > 0 ? (
                      <ul className="space-y-1 w-full">
                        {f.whyYes.map((item, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                            <span className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>
                ))}
                {canAddMore && <div></div>}
              </div>

              {/* Why Not - Always shown */}
              <div className={`grid ${gridCols} gap-4 py-4`}>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <XCircle className="w-4 h-4 text-rose-500" />
                  Why Not
                </div>
                {compareItems.map((f) => (
                  <div key={f.id} className="flex items-center justify-center min-h-[24px]">
                    {f.whyNot && f.whyNot.length > 0 ? (
                      <ul className="space-y-1 w-full">
                        {f.whyNot.map((item, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                            <span className="w-1 h-1 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>
                ))}
                {canAddMore && <div></div>}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Card className="mt-8">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">Made your decision?</h3>
            <p className="text-muted-foreground mb-6">
              Pick 1-2 franchises and talk to an advisor to take the next step.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="cta" size="lg">
                Talk to an Advisor
              </Button>
              <Link to="/ownership-path">
                <Button variant="navy-outline" size="lg">
                  View Ownership Path
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
