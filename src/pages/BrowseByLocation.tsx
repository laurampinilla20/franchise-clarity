import { PageLayout } from "@/components/layout";
import { FranchiseCard } from "@/components/franchise";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { MapPin, X, Search, SlidersHorizontal } from "lucide-react";
import { useState, useEffect, useRef } from "react";

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

const states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

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
  const [selectedState, setSelectedState] = useState<string>("");
  const [stateOpen, setStateOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const searchSectionRef = useRef<HTMLDivElement>(null);

  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]
    );
  };

  const clearFilters = () => {
    setSelectedLocations([]);
    setSelectedState("");
    setSearchQuery("");
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedLocations.length > 0) count += selectedLocations.length;
    if (selectedState) count += 1;
    return count;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (searchSectionRef.current) {
        const rect = searchSectionRef.current.getBoundingClientRect();
        const shouldBeSticky = rect.top <= 64; // 64px is pt-16 (navbar height)
        setIsSticky(shouldBeSticky);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-[32px] text-foreground tracking-normal">
            <span className="font-normal">Find the best franchise</span> <span className="font-bold">near you</span>
          </h1>
        </div>

        {/* Search Bar */}
        <div 
          ref={searchSectionRef}
          className={`flex flex-col md:flex-row gap-4 mb-6 transition-all ${
            isSticky 
              ? "sticky top-16 z-40 bg-white -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 border-b border-border" 
              : ""
          }`}
        >
          <div className={`relative flex-1 h-[48px] min-w-[160px] border border-[#DDDDDD] rounded-[32px] transition-colors ${isSearchFocused || searchQuery ? "bg-[#F2F8FF]" : "bg-white"}`}>
            <div className="relative flex items-center h-full rounded-[32px]">
              {/* Input Field */}
              <div className="flex-1 h-full rounded-l-[32px] px-4 py-2 flex items-center bg-transparent">
                <input
                  type="text"
                  placeholder="Search a franchise in   |    Location  "
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full text-base font-normal text-[#8c9aa5] placeholder:text-[#8c9aa5] bg-transparent border-0 outline-none focus:outline-none"
                />
              </div>
              
              {/* Search Button */}
              <button
                type="button"
                className="h-full w-14 rounded-r-[32px] flex items-center justify-center shrink-0 bg-transparent hover:opacity-80 transition-opacity"
                onClick={() => {
                  console.log({ searchQuery });
                }}
              >
                <div className="w-[34px] h-[34px] bg-primary rounded-full flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </div>
              </button>
            </div>
          </div>
          
          <Dialog open={showFilters} onOpenChange={setShowFilters}>
            <DialogTrigger asChild>
              <Button
                variant={showFilters ? "secondary" : "outline"}
                className="h-12 gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {getActiveFilterCount() > 0 && (
                  <Badge variant="default" className="ml-1">
                    {getActiveFilterCount()}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
              {/* Sticky Header */}
              <DialogHeader className="flex-shrink-0 bg-background border-b px-6 pt-6 pb-4 rounded-t-[33px]">
                <DialogTitle className="text-2xl font-bold">Filters</DialogTitle>
              </DialogHeader>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-4 min-h-0 relative" style={{ boxShadow: "inset 0 -10px 20px -10px rgba(0, 0, 0, 0.1)" }}>
                <div className="space-y-4">
                  {/* State Selection */}
                  <div className="p-6 pb-4 border-b">
                    <h3 className="font-semibold text-foreground mb-4">Find in</h3>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        State
                      </label>
                      <Popover open={stateOpen} onOpenChange={setStateOpen}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {selectedState || "Type here"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search state..." />
                            <CommandList>
                              <CommandEmpty>No state found.</CommandEmpty>
                              <CommandGroup>
                                {states.map((state) => (
                                  <CommandItem
                                    key={state}
                                    value={state}
                                    onSelect={() => {
                                      setSelectedState(state === selectedState ? "" : state);
                                      setStateOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={`
                                        mr-2 h-4 w-4
                                        ${selectedState === state ? "opacity-100" : "opacity-0"}
                                      `}
                                    />
                                    {state}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Popular Locations */}
                  <div className="p-6 pt-4">
                    <h3 className="font-semibold text-foreground mb-4">Popular Locations</h3>
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
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="flex-shrink-0 bg-background border-t flex items-center justify-between px-6 py-4 rounded-b-[33px]">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-medium text-foreground hover:underline"
                >
                  Clear all
                </button>
                <Button
                  onClick={() => setShowFilters(false)}
                  className="px-6"
                >
                  Show results
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Active Filters Display */}
        {getActiveFilterCount() > 0 && !showFilters && (
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
            {selectedState && (
              <Badge variant="chipActive" className="gap-1">
                {selectedState}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => setSelectedState("")}
                />
              </Badge>
            )}
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
