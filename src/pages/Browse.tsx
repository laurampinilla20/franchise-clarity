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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Slider } from "@/components/ui/slider";
import {
  Search,
  SlidersHorizontal,
  X,
  DollarSign,
  Home,
  TrendingUp,
  Star,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

const filters = {
  budget: ["Under $50K", "$50K–$100K", "$100K–$250K", "$250K–$500K", "$500K+"],
  lifestyle: ["Part-time", "Full-time", "Semi-absentee", "Absentee"],
  sector: ["Food & Beverage", "Health & Fitness", "Home Services", "Retail", "Automotive", "Education"],
  category: ["Quick Service", "Fitness Studio", "Restoration", "Hair Salon", "Tutoring", "Repair"],
  states: ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"],
};

const recommendations = [
  { id: "low-cost", label: "Low-Cost", icon: DollarSign },
  { id: "home-based", label: "Home-Based", icon: Home },
  { id: "high-margin", label: "High Margin", icon: TrendingUp },
  { id: "top-rated", label: "Top Rated", icon: Star },
];

const types = ["Passive", "Semi-Absentee", "Solo Operator"];

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
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRecommendations, setSelectedRecommendations] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [budgetRange, setBudgetRange] = useState<number[]>([50000, 1000000]);
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [sectorOpen, setSectorOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const searchSectionRef = useRef<HTMLDivElement>(null);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const toggleRecommendation = (id: string) => {
    setSelectedRecommendations((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setSearchQuery("");
    setLocation("");
    setIndustry("");
    setSelectedRecommendations([]);
    setSelectedType("");
    setBudgetRange([50000, 1000000]);
    setSelectedSector("");
    setSelectedCategory("");
    setSelectedState("");
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const getActiveFilterCount = () => {
    let count = activeFilters.length;
    if (selectedRecommendations.length > 0) count += selectedRecommendations.length;
    if (selectedType) count += 1;
    if (budgetRange[0] !== 50000 || budgetRange[1] !== 1000000) count += 1;
    if (selectedSector) count += 1;
    if (selectedCategory) count += 1;
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

  // Scroll to franchise grid on mount if hash is present
  useEffect(() => {
    if (window.location.hash === "#franchise-grid") {
      const element = document.getElementById("franchise-grid");
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, []);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-[32px] text-foreground tracking-normal">
            <span className="font-normal">Find the best franchise</span> <span className="font-bold">for you</span>
          </h1>
        </div>

        {/* Search and Filter Bar */}
        <div 
          ref={searchSectionRef}
          className={`flex flex-col md:flex-row gap-4 mb-6 transition-all ${
            isSticky 
              ? "sticky top-16 z-40 bg-white -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 border-b border-border" 
              : ""
          }`}
        >
          {/* Single Input Search Bar */}
          <div className={`relative flex-1 h-[48px] min-w-[160px] border border-[#DDDDDD] rounded-[32px] transition-colors ${isSearchFocused || searchQuery ? "bg-[#F2F8FF]" : "bg-white"}`}>
            <div className="relative flex items-center h-full rounded-[32px]">
              {/* Input Field */}
              <div className="flex-1 h-full rounded-l-[32px] px-4 py-2 flex items-center bg-transparent">
                <input
                  type="text"
                  placeholder="Search a franchise    |    Location    |    Industry    |    Investment   |   Keywords"
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
                  // Handle search logic here
                  console.log({ searchQuery, location, industry });
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
                {/* Recommended for you */}
                <div className="p-6 pb-4 border-b">
                  <h3 className="font-semibold text-foreground mb-4">Recommended for you</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {recommendations.map((rec) => {
                      const Icon = rec.icon;
                      const isSelected = selectedRecommendations.includes(rec.id);
                      return (
                        <button
                          key={rec.id}
                          type="button"
                          onClick={() => toggleRecommendation(rec.id)}
                          className={`
                            flex flex-col items-center justify-center p-4 rounded-xl border transition-all
                            ${isSelected 
                              ? "border-primary bg-primary/10" 
                              : "border-border bg-background hover:border-primary/50"
                            }
                          `}
                        >
                          <div className={`
                            w-12 h-12 rounded-full flex items-center justify-center mb-2
                            ${isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground"}
                          `}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <span className="text-sm font-medium text-foreground">{rec.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sector, Category, and State */}
                <div className="p-6 pt-4 pb-4 border-b">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Find for - Sector */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-4 md:mb-2">Find for</h3>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Sector
                      </label>
                      <Popover open={sectorOpen} onOpenChange={setSectorOpen}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {selectedSector || "Type here"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search sector..." />
                            <CommandList>
                              <CommandEmpty>No sector found.</CommandEmpty>
                              <CommandGroup>
                                {filters.sector.map((sector) => (
                                  <CommandItem
                                    key={sector}
                                    value={sector}
                                    onSelect={() => {
                                      setSelectedSector(sector === selectedSector ? "" : sector);
                                      setSectorOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={`
                                        mr-2 h-4 w-4
                                        ${selectedSector === sector ? "opacity-100" : "opacity-0"}
                                      `}
                                    />
                                    {sector}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    {/* Category (no title on desktop, shows between Sector and State on mobile) */}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block md:mt-7">
                        Category
                      </label>
                      <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {selectedCategory || "Type here"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search category..." />
                            <CommandList>
                              <CommandEmpty>No category found.</CommandEmpty>
                              <CommandGroup>
                                {filters.category.map((category) => (
                                  <CommandItem
                                    key={category}
                                    value={category}
                                    onSelect={() => {
                                      setSelectedCategory(category === selectedCategory ? "" : category);
                                      setCategoryOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={`
                                        mr-2 h-4 w-4
                                        ${selectedCategory === category ? "opacity-100" : "opacity-0"}
                                      `}
                                    />
                                    {category}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    {/* Find in - State */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-4 md:mb-2">Find in</h3>
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
                                {filters.states.map((state) => (
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
                </div>

                {/* Budget Range */}
                <div className="p-6 pt-4 pb-4 border-b">
                  <h3 className="font-semibold text-foreground mb-2">Budget</h3>
                  <div className="space-y-4">
                    <Slider
                      value={budgetRange}
                      onValueChange={setBudgetRange}
                      min={50000}
                      max={1000000}
                      step={10000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{formatCurrency(budgetRange[0])}</span>
                      <span>{formatCurrency(budgetRange[1])}+</span>
                    </div>
                  </div>
                </div>

                {/* Type of place */}
                <div className="p-6 pt-4">
                  <h3 className="font-semibold text-foreground mb-4">Type</h3>
                  <div className="flex border border-border rounded-lg overflow-hidden bg-background">
                    {types.map((type, index) => {
                      const isSelected = selectedType === type;
                      const isFirst = index === 0;
                      const isLast = index === types.length - 1;
                      const prevSelected = index > 0 && selectedType === types[index - 1];
                      const nextSelected = index < types.length - 1 && selectedType === types[index + 1];
                      
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setSelectedType(isSelected ? "" : type)}
                          className={`
                            flex-1 px-4 py-3 text-sm font-medium transition-all relative
                            ${isSelected
                              ? "bg-primary/10 border-2 border-primary text-foreground z-10"
                              : "bg-background text-foreground"
                            }
                            ${!isLast && !isSelected && !nextSelected ? "border-r border-border" : ""}
                          `}
                          style={{
                            borderRadius: isSelected 
                              ? (isFirst ? "0.5rem 0 0 0.5rem" : isLast ? "0 0.5rem 0.5rem 0" : "0")
                              : (isFirst ? "0.5rem 0 0 0.5rem" : isLast ? "0 0.5rem 0.5rem 0" : "0"),
                            margin: isSelected ? "-1px" : "0",
                          }}
                        >
                          {type}
                        </button>
                      );
                    })}
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
          <div className={`flex flex-wrap items-center gap-2 mb-6 transition-all ${
            isSticky 
              ? "sticky top-[200px] md:top-[144px] z-40 bg-white -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-2 border-b border-border" 
              : ""
          }`}>
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedRecommendations.map((recId) => {
              const rec = recommendations.find((r) => r.id === recId);
              return rec ? (
                <Badge key={recId} variant="chipActive" className="gap-1">
                  {rec.label}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => toggleRecommendation(recId)}
                  />
                </Badge>
              ) : null;
            })}
            {selectedType && (
              <Badge variant="chipActive" className="gap-1">
                {selectedType}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => setSelectedType("")}
                />
              </Badge>
            )}
            {(budgetRange[0] !== 50000 || budgetRange[1] !== 1000000) && (
              <Badge variant="chipActive" className="gap-1">
                {formatCurrency(budgetRange[0])} - {formatCurrency(budgetRange[1])}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => setBudgetRange([50000, 1000000])}
                />
              </Badge>
            )}
            {selectedSector && (
              <Badge variant="chipActive" className="gap-1">
                {selectedSector}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => setSelectedSector("")}
                />
              </Badge>
            )}
            {selectedCategory && (
              <Badge variant="chipActive" className="gap-1">
                {selectedCategory}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => setSelectedCategory("")}
                />
              </Badge>
            )}
            {selectedState && (
              <Badge variant="chipActive" className="gap-1">
                {selectedState}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => setSelectedState("")}
                />
              </Badge>
            )}
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
        <div id="franchise-grid" className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 scroll-mt-32">
          {franchises.slice(0, Math.max(12, franchises.length)).map((franchise) => (
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
