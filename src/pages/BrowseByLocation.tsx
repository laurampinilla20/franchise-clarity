import { PageLayout } from "@/components/layout";
import { FranchiseCard } from "@/components/franchise";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, X } from "lucide-react";
import { useState } from "react";

const locations = [
  "California",
  "Texas",
  "Florida",
  "New York",
  "Illinois",
  "Pennsylvania",
  "Ohio",
  "Georgia",
  "North Carolina",
  "Michigan",
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

export default function BrowseByLocation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]
    );
  };

  const clearFilters = () => {
    setSelectedLocations([]);
    setSearchQuery("");
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Franchises by Location</h1>
          <p className="mt-2 text-muted-foreground">
            Find franchise opportunities available in your area
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by location or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-2xl bg-muted border-transparent focus:border-primary"
            />
          </div>
        </div>

        {/* Location Filters */}
        <div className="mb-8 p-6 rounded-2xl bg-muted/50 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Filter by State</h3>
            {selectedLocations.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {locations.map((location) => (
              <Badge
                key={location}
                variant={selectedLocations.includes(location) ? "chipActive" : "chip"}
                onClick={() => toggleLocation(location)}
                className="cursor-pointer"
              >
                {location}
              </Badge>
            ))}
          </div>
        </div>

        {/* Active Filters Display */}
        {selectedLocations.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedLocations.map((location) => (
              <Badge
                key={location}
                variant="chipActive"
                onClick={() => toggleLocation(location)}
                className="gap-1 cursor-pointer"
              >
                {location}
                <X className="w-3 h-3" />
              </Badge>
            ))}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{franchises.length}</span> franchises
            {selectedLocations.length > 0 && ` in ${selectedLocations.join(", ")}`}
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
