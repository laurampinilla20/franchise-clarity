import { PageLayout } from "@/components/layout";
import { FranchiseCard } from "@/components/franchise";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Building2, X } from "lucide-react";
import { useState } from "react";

const industries = [
  "Food & Beverage",
  "Health & Fitness",
  "Home Services",
  "Retail",
  "Automotive",
  "Education",
  "Personal Services",
  "Business Services",
  "Travel & Hospitality",
  "Real Estate",
];

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

export default function BrowseByIndustry() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry]
    );
  };

  const clearFilters = () => {
    setSelectedIndustries([]);
    setSearchQuery("");
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Franchises by Industry</h1>
          <p className="mt-2 text-muted-foreground">
            Explore franchise opportunities across different industries
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by industry or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-2xl bg-muted border-transparent focus:border-primary"
            />
          </div>
        </div>

        {/* Industry Filters */}
        <div className="mb-8 p-6 rounded-2xl bg-muted/50 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Filter by Industry</h3>
            {selectedIndustries.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {industries.map((industry) => (
              <Badge
                key={industry}
                variant={selectedIndustries.includes(industry) ? "chipActive" : "chip"}
                onClick={() => toggleIndustry(industry)}
                className="cursor-pointer"
              >
                {industry}
              </Badge>
            ))}
          </div>
        </div>

        {/* Active Filters Display */}
        {selectedIndustries.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedIndustries.map((industry) => (
              <Badge
                key={industry}
                variant="chipActive"
                onClick={() => toggleIndustry(industry)}
                className="gap-1 cursor-pointer"
              >
                {industry}
                <X className="w-3 h-3" />
              </Badge>
            ))}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{franchises.length}</span> franchises
            {selectedIndustries.length > 0 && ` in ${selectedIndustries.join(", ")}`}
          </p>
        </div>

        {/* Franchise Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {franchises.map((franchise) => (
            <FranchiseCard key={franchise.id} {...franchise} isLoggedIn={false} />
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
