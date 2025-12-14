import { PageLayout } from "@/components/layout";
import { FranchiseCard } from "@/components/franchise";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

const filters = {
  budget: ["Under $50K", "$50K–$100K", "$100K–$250K", "$250K–$500K", "$500K+"],
  lifestyle: ["Part-time", "Full-time", "Semi-absentee", "Absentee"],
  sector: ["Food & Beverage", "Health & Fitness", "Home Services", "Retail", "Automotive", "Education"],
};

const franchises = [
  {
    id: "subway-1",
    name: "Subway",
    investmentMin: 150000,
    investmentMax: 350000,
    sector: "Food & Beverage",
    category: "Quick Service",
  },
  {
    id: "orangetheory-1",
    name: "Orangetheory Fitness",
    investmentMin: 500000,
    investmentMax: 1000000,
    sector: "Health & Fitness",
    category: "Fitness Studio",
  },
  {
    id: "servpro-1",
    name: "SERVPRO",
    investmentMin: 180000,
    investmentMax: 225000,
    sector: "Home Services",
    category: "Restoration",
  },
  {
    id: "greatclips-1",
    name: "Great Clips",
    investmentMin: 150000,
    investmentMax: 300000,
    sector: "Personal Services",
    category: "Hair Salon",
  },
  {
    id: "mathnasium-1",
    name: "Mathnasium",
    investmentMin: 100000,
    investmentMax: 150000,
    sector: "Education",
    category: "Tutoring",
  },
  {
    id: "jerseymikes-1",
    name: "Jersey Mike's Subs",
    investmentMin: 200000,
    investmentMax: 700000,
    sector: "Food & Beverage",
    category: "Quick Service",
  },
  {
    id: "handyman-1",
    name: "Handyman Connection",
    investmentMin: 90000,
    investmentMax: 150000,
    sector: "Home Services",
    category: "Repair",
  },
  {
    id: "kumon-1",
    name: "Kumon",
    investmentMin: 70000,
    investmentMax: 150000,
    sector: "Education",
    category: "Tutoring",
  },
];

export default function Browse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setSearchQuery("");
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Browse Franchises</h1>
          <p className="mt-2 text-muted-foreground">
            Explore our curated catalog of franchise opportunities
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, industry, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-2xl bg-muted border-transparent focus:border-primary"
            />
          </div>
          <Button
            variant={showFilters ? "secondary" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="h-12 gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilters.length > 0 && (
              <Badge variant="default" className="ml-1">
                {activeFilters.length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-8 p-6 rounded-2xl bg-muted/50 border border-border animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Filters</h3>
              {activeFilters.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              )}
            </div>

            <div className="space-y-6">
              {/* Budget */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Budget</h4>
                <div className="flex flex-wrap gap-2">
                  {filters.budget.map((budget) => (
                    <Badge
                      key={budget}
                      variant={activeFilters.includes(budget) ? "chipActive" : "chip"}
                      onClick={() => toggleFilter(budget)}
                    >
                      {budget}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Lifestyle */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Lifestyle</h4>
                <div className="flex flex-wrap gap-2">
                  {filters.lifestyle.map((lifestyle) => (
                    <Badge
                      key={lifestyle}
                      variant={activeFilters.includes(lifestyle) ? "chipActive" : "chip"}
                      onClick={() => toggleFilter(lifestyle)}
                    >
                      {lifestyle}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Sector */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Sector</h4>
                <div className="flex flex-wrap gap-2">
                  {filters.sector.map((sector) => (
                    <Badge
                      key={sector}
                      variant={activeFilters.includes(sector) ? "chipActive" : "chip"}
                      onClick={() => toggleFilter(sector)}
                    >
                      {sector}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {activeFilters.length > 0 && !showFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {activeFilters.map((filter) => (
              <Badge key={filter} variant="chipActive" onClick={() => toggleFilter(filter)} className="gap-1">
                {filter}
                <X className="w-3 h-3" />
              </Badge>
            ))}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{franchises.length}</span> franchises
          </p>
        </div>

        {/* Franchise Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {franchises.map((franchise) => (
            <FranchiseCard
              key={franchise.id}
              {...franchise}
              isLoggedIn={false}
            />
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg">
            Load More
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
