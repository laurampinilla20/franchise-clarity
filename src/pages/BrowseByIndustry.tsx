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
import { Building2, X, Search, SlidersHorizontal } from "lucide-react";
import { useState, useEffect, useRef } from "react";

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
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sectorOpen, setSectorOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const searchSectionRef = useRef<HTMLDivElement>(null);

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry]
    );
  };

  const clearFilters = () => {
    setSelectedIndustries([]);
    setSelectedSector("");
    setSelectedCategory("");
    setSearchQuery("");
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedIndustries.length > 0) count += selectedIndustries.length;
    if (selectedSector) count += 1;
    if (selectedCategory) count += 1;
    return count;
  };

  const sectors = ["Food & Beverage", "Health & Fitness", "Home Services", "Retail", "Automotive", "Education"];
  const categories = ["Quick Service", "Fitness Studio", "Restoration", "Hair Salon", "Tutoring", "Repair"];

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
            <span className="font-normal">Find the best franchise</span> <span className="font-bold">for you</span>
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
                  placeholder="Search a franchise for    |    Industry    "
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
                  {/* Sector and Category */}
                  <div className="p-6 pb-4 border-b">
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
                                  {sectors.map((sector) => (
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
                      {/* Category */}
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
                                  {categories.map((category) => (
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
                      <div></div>
                    </div>
                  </div>

                  {/* Popular Industries */}
                  <div className="p-6 pt-4">
                    <h3 className="font-semibold text-foreground mb-4">Popular Industries</h3>
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
