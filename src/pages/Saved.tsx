import { PageLayout } from "@/components/layout";
import { MatchCard } from "@/components/franchise";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Bookmark, Filter, ArrowUpDown, Trash2 } from "lucide-react";
import { PreferencesSection } from "@/components/PreferencesSection";
import { useSaved } from "@/hooks/useSaved";
import { fetchBrandBySlug, type BrandData } from "@/api/brands";
import { useEffect, useState } from "react";

export default function Saved() {
  const { savedItems, removeSaved } = useSaved();
  const [enrichedSavedItems, setEnrichedSavedItems] = useState<any[]>([]);

  // Enrich saved items with full data (HubSpot-friendly: can fetch from database)
  useEffect(() => {
    const enrichSavedItems = async () => {
      const enriched = await Promise.all(
        savedItems.map(async (item) => {
          try {
            // Try to fetch full brand data from API
            const slug = item.id.split('-').slice(0, -1).join('-') || item.id;
            const brandData: BrandData = await fetchBrandBySlug(slug);
            
            // Check if API returned correct brand
            if (brandData.id === item.id || brandData.name.toLowerCase() === item.name.toLowerCase()) {
            return {
              id: brandData.id || item.id,
              name: brandData.name || item.name,
              grade: (brandData.grade as "A" | "B" | "C" | "D") || item.grade || "A",
              investmentMin: brandData.investment.min || item.investmentMin,
              investmentMax: brandData.investment.max || item.investmentMax,
              sector: brandData.sector || item.sector,
              category: brandData.category || item.category,
              fitChips: item.fitChips || { territory: true, lifestyle: true, budget: true },
            };
            }
          } catch (error) {
            console.log(`Using saved item data for ${item.name}`);
          }
          
          // Fallback to saved item data
          return {
            id: item.id,
            name: item.name,
            grade: item.grade || "A",
            investmentMin: item.investmentMin,
            investmentMax: item.investmentMax,
            sector: item.sector,
            category: item.category,
            fitChips: item.fitChips || { territory: true, lifestyle: true, budget: true },
          };
        })
      );
      
      setEnrichedSavedItems(enriched);
    };

    if (savedItems.length > 0) {
      enrichSavedItems();
    } else {
      setEnrichedSavedItems([]);
    }
  }, [savedItems]);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Bookmark className="w-8 h-8 text-primary" />
                Saved Franchises
              </h1>
              <p className="text-muted-foreground mt-1">
                {enrichedSavedItems.length} {enrichedSavedItems.length === 1 ? "franchise" : "franchises"} saved
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Sort
              </Button>
            </div>
          </div>

          {enrichedSavedItems.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bookmark className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No saved franchises yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start exploring franchises and save the ones you're interested in.
                </p>
                <Link to="/best-franchises">
                  <Button variant="cta">Browse Franchises</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Saved Franchises List */}
              <div className="space-y-4">
                {enrichedSavedItems.map((franchise, i) => (
                  <div
                    key={franchise.id}
                    className="relative animate-fade-up"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="absolute top-4 right-4 z-10">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={async () => {
                          await removeSaved(franchise.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <MatchCard {...franchise} />
                  </div>
                ))}
              </div>

              {/* Compare CTA */}
              {enrichedSavedItems.length > 1 && (
                <Card className="mt-8 border-dashed">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-foreground mb-2">
                      Ready to compare your saved franchises?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select up to 4 franchises to compare side-by-side
                    </p>
                    <Link to="/compare">
                      <Button variant="navy">Open Comparison Tool</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Likes and Dislikes Section */}
          <PreferencesSection />
        </div>
      </div>
    </PageLayout>
  );
}



