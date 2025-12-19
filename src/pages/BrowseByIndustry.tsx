import { PageLayout } from "@/components/layout";
import { FranchiseCard } from "@/components/franchise";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { Building2, X, Search, SlidersHorizontal, DollarSign, Home, TrendingUp, Star, Briefcase, Car, UtensilsCrossed, ShoppingBag, Heart, Stethoscope, Scissors, Wrench, Tag } from "lucide-react";
import { Slider } from "@/components/ui/slider";
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

const recommendations = [
  { id: "low-cost", label: "Low-Cost", icon: DollarSign },
  { id: "home-based", label: "Home-Based", icon: Home },
  { id: "high-margin", label: "High Margin", icon: TrendingUp },
  { id: "top-rated", label: "Top Rated", icon: Star },
];

const types = ["Passive", "Semi-Absentee", "Solo Operator"];

const states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

// HubSpot-ready: Industry Directory Data Structure
const industryDirectory = {
  sectors: [
    {
      id: "business-professional",
      name: "Business & Professional Services",
      icon: Briefcase,
      description: "Marketing, consulting, technology, and business support services...",
      categories: [
        "Marketing, Creative & Media Services",
        "Consulting, Advisory & Training Services",
        "Financial, Legal & Insurance Services",
        "Technology & IT Services",
        "Staffing, Recruiting & Employment Services",
        "Commercial Cleaning & Facility Maintenance",
        "Shipping, Packaging & Logistics Services",
        "Office Support & Administration",
        "Other Business Services",
        "Sales & Lead Generation Services"
      ]
    },
    {
      id: "automotive",
      name: "Automotive Services",
      icon: Car,
      description: "Auto repair, car wash, detailing, and automotive retail services...",
      categories: [
        "Auto Repair & Mechanical Services",
        "Oil Change & Quick Lube Services",
        "Tires, Wheels & Alignment Services",
        "Car Wash & Detailing Services",
        "Auto Glass, Windshield & Window Services",
        "Paint, Body & Dent Repair Services",
        "Customization & Specialty Services",
        "Emissions, Inspections & Compliance Services",
        "Fleet & Commercial Automotive Services",
        "Mobile Automotive Services",
        "Automotive Retail & Parts Services",
        "Other Automotive Services"
      ]
    },
    {
      id: "fast-food",
      name: "Fast Food & Fast Casual Restaurants",
      icon: UtensilsCrossed,
      description: "Quick service, burgers, pizza, coffee, and casual dining options...",
      categories: [
        "Meal Prep, Ghost Kitchens & Catering",
        "Specialty & Niche Fast Casual",
        "Burgers & American Grill",
        "Pizza, Pasta & Italian",
        "Chicken Concepts",
        "BBQ & Smoked Meats",
        "Seafood Concepts",
        "Mexican, Tex-Mex & Latin",
        "Asian, Mediterranean & Global Cuisine",
        "Coffee, Tea & Specialty Beverages",
        "Ice Cream, Frozen Yogurt & Desserts",
        "Breakfast, Brunch & Bakery",
        "Salads, Bowls & Healthy Concepts",
        "Sandwich, Sub & Deli Concepts"
      ]
    },
    {
      id: "full-service-restaurants",
      name: "Full Service Restaurants",
      icon: UtensilsCrossed,
      description: "Fine dining, family restaurants, and upscale dining experiences...",
      categories: [
        "Family Dining & Casual American",
        "Steakhouse, Upscale & Fine Dining",
        "Pizza & Italian Dining",
        "Bar, Pub & Grill",
        "Mexican, Tex-Mex & Latin Dining",
        "Seafood & Coastal Dining",
        "Asian, Mediterranean & International Dining",
        "BBQ, Smokehouse & Southern Dining",
        "Breakfast, Brunch & Café Restaurants",
        "Buffet & Family-Style",
        "Fusion & Modern Global Dining"
      ]
    },
    {
      id: "retail-food",
      name: "Retail Food & Convenience",
      icon: ShoppingBag,
      description: "Convenience stores, grocery, specialty food, and vending services...",
      categories: [
        "Convenience Stores & Fuel",
        "Grocery, Market & Specialty Food",
        "Beverage, Smoothie & Juice",
        "Bakery, Donut & Snack",
        "Frozen Foods, Ice Cream & Treat",
        "Candy, Chocolate & Sweet Shops",
        "Healthy Food, Vitamins & Nutrition",
        "Liquor, Wine & Specialty Alcohol",
        "Vending, Micro-Markets & Automated",
        "Food Trucks & Mobile",
        "Ethnic, Imported & Global Packaged Foods",
        "Specialty Food Gifts & Gourmet"
      ]
    },
    {
      id: "retail-products",
      name: "Retail Products & Services",
      icon: ShoppingBag,
      description: "Clothing, electronics, home goods, and specialty retail stores...",
      categories: [
        "Clothing, Fashion & Accessories",
        "Home Décor, Furniture & Household",
        "Electronics, Mobile Devices & Tech",
        "Tools, Equipment & Hardware",
        "Online Retail & E-Commerce Stores",
        "Pet Supply Stores",
        "Shipping, Packaging & Mailbox Services",
        "Photography, Printing & Creative Services",
        "Vape, Tobacco & Smoke Shop",
        "Specialty Retail Products & Gifts",
        "Automotive Products & Accessories",
        "Supplements, Vitamins & Wellness Products",
        "Office, School & Business Supply Stores",
        "Resale, Thrift & Consignment Stores"
      ]
    },
    {
      id: "healthcare",
      name: "Healthcare & Medical Services",
      icon: Stethoscope,
      description: "Medical clinics, therapy, diagnostics, and wellness services...",
      categories: [
        "Urgent Care & Primary Care Clinics",
        "Physical Therapy, Rehab & Chiropractic",
        "Medical Weight Loss & Metabolic Health",
        "IV Therapy, Hydration & Wellness Clinics",
        "Diagnostics, Labs & Imaging",
        "Mental Health, Behavioral Health & Counseling",
        "Specialty Medical Clinics",
        "Orthopedic, Pain & Spine Clinics",
        "Aesthetics, Dermatology & Skin Health Clinics"
      ]
    },
    {
      id: "personal-care",
      name: "Personal Care & Lifestyle Services",
      icon: Heart,
      description: "Beauty, fitness, education, childcare, and personal services...",
      categories: [
        "Beauty, Hair & Nail Services",
        "Spas, Massage & Bodywork",
        "Fitness, Training & Athletic Performance",
        "Non-Medical Wellness & Holistic Services",
        "Weight Loss, Nutrition & Healthy Living",
        "Family Entertainment, Games & Activities",
        "Sports, Recreation & Training Programs",
        "Pet Care, Grooming & Training",
        "Tutoring, Education & Enrichment",
        "Childcare, Preschool & Early Education",
        "Children's Activities & Development Services",
        "Laundry, Dry Cleaning & Home Convenience Services",
        "Travel, Tourism & Hospitality Services",
        "Senior Support & Home Care",
        "Personal Organization, Coaching & Lifestyle Management",
        "Specialty & Niche Personal Services"
      ]
    },
    {
      id: "real-estate",
      name: "Real Estate & Lodging",
      icon: Home,
      description: "Property management, hotels, vacation rentals, and real estate...",
      categories: [
        "Property Management & Rental Services",
        "Home Inspections, Appraisal & Valuation Services",
        "Hotels, Motels & Lodging Brands",
        "Vacation, Resort & Extended Stay Properties",
        "Rental, Leasing & Tenant Services",
        "Real Estate Investment, Financing & Advisory Services",
        "Disaster Recovery, Restoration & Insurance Support",
        "Moving, Relocation & Transition Services",
        "Real Estate Brokerage & Agency Services"
      ]
    },
    {
      id: "home-services",
      name: "Home & Property Services",
      icon: Wrench,
      description: "Cleaning, landscaping, HVAC, handyman, and home improvement...",
      categories: [
        "Cleaning, Maid & Home Care Services",
        "Lawn, Landscaping & Outdoor Services",
        "Pest Control & Wildlife Services",
        "Painting, Surface Finishing & Coatings",
        "HVAC, Plumbing & Electrical Services",
        "Handyman, Home Repair & Maintenance",
        "Restoration, Mitigation & Emergency Services",
        "Remodeling, Construction & Renovation",
        "Windows, Doors, Roofing & Exterior Improvements",
        "Flooring, Tile & Surface Installation",
        "Organization, Storage & Home Optimization",
        "Security, Smart Home & Technology Installation",
        "Moving, Junk Removal & Hauling Services",
        "Parking Lot, Pavement & Exterior Facility Services"
      ]
    }
  ],
  tags: {
    investment: [
      "Low-Cost",
      "Under $100K",
      "Under $50K",
      "High ROI",
      "No Royalty"
    ],
    lifestyle: [
      "Semi-Absentee",
      "Passive Income",
      "Home-Based",
      "Flexible Schedule",
      "Solo Operator"
    ],
    performance: [
      "High Margin",
      "Fastest Growing",
      "High Validation",
      "Recession Resistant",
      "Top Rated"
    ],
    experience: [
      "For Beginners",
      "For Retirees",
      "For Career Changers",
      "Turnkey"
    ],
    operation: [
      "Brick-and-Mortar",
      "Mobile",
      "Online",
      "Office-Free"
    ]
  }
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

export default function BrowseByIndustry() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedRecommendations, setSelectedRecommendations] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState<number[]>([50000, 1000000]);
  const [sectorOpen, setSectorOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [categorySearch, setCategorySearch] = useState<Record<string, string>>({});
  const searchSectionRef = useRef<HTMLDivElement>(null);

  // HubSpot-ready: Can be replaced with API data
  const directoryData = industryDirectory; // This can come from props or API

  // Helper function to create URL-friendly slugs
  const createSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry]
    );
  };

  const toggleRecommendation = (id: string) => {
    setSelectedRecommendations((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedIndustries([]);
    setSelectedSector("");
    setSelectedCategory("");
    setSelectedState("");
    setSelectedRecommendations([]);
    setSelectedType("");
    setSelectedTags([]);
    setBudgetRange([50000, 1000000]);
    setSearchQuery("");
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedIndustries.length > 0) count += selectedIndustries.length;
    if (selectedSector) count += 1;
    if (selectedCategory) count += 1;
    if (selectedState) count += 1;
    if (selectedRecommendations.length > 0) count += selectedRecommendations.length;
    if (selectedType) count += 1;
    if (selectedTags.length > 0) count += selectedTags.length;
    if (budgetRange[0] !== 50000 || budgetRange[1] !== 1000000) count += 1;
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
            Find the <span className="font-bold">right franchise industry for you</span>
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
                  {/* Sector, Category, and State */}
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
                  </div>

                  {/* Popular Industries */}
                  <div className="p-6 pt-4 pb-4 border-b">
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

                  {/* Recommended for you */}
                  <div className="p-6 pt-4 pb-4 border-b">
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
          <div className="flex flex-wrap items-center gap-2 mb-6">
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
            {selectedState && (
              <Badge variant="chipActive" className="gap-1">
                {selectedState}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => setSelectedState("")}
                />
              </Badge>
            )}
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="chipActive"
                onClick={() => toggleTag(tag)}
                className="gap-1 cursor-pointer"
              >
                {tag}
                <X className="w-3 h-3" />
              </Badge>
            ))}
          </div>
        )}

        {/* Industry Directory Section - Card Grid Layout */}
        <div className="mb-12">
          <div className="bg-white border-0 rounded-[20px] p-6 sm:p-8 lg:p-10 shadow-sm">

            {/* Sectors Grid - Card Layout */}
            <div className="mb-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {(directoryData?.sectors || industryDirectory.sectors).map((sector: any, sectorIndex: number) => {
                  const IconComponent = sector.icon || Building2;
                  const categoryCount = (sector.categories || []).length;
                  
                  const sectorSlug = sector.id || createSlug(sector.name);
                  
                  return (
                    <div
                      key={sector.id || sectorIndex}
                      className="bg-white border border-[#A4C6E8] rounded-[20px] p-6 shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col"
                    >
                      <div className="flex flex-col gap-4 flex-1">
                        {/* Clickable Icon and Title */}
                        <Link
                          to={`/best-franchises/category/${sectorSlug}`}
                          className="flex items-start gap-3 group cursor-pointer"
                        >
                          {/* Icon */}
                          <div className="w-12 h-12 rounded-[12px] bg-[#f4f8fe] flex items-center justify-center group-hover:bg-[#dee8f2] transition-colors duration-200 flex-shrink-0">
                            <IconComponent className="w-6 h-6 text-[#446786]" />
                          </div>
                          
                          {/* Title */}
                          <h3 className="font-bold text-foreground text-lg leading-tight group-hover:text-[#446786] transition-colors">
                            {sector.name}
                          </h3>
                        </Link>
                      
                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                        {sector.description || `${categoryCount} categories available`}
                      </p>
                      
                      {/* Accordion for Categories */}
                      {categoryCount > 0 && (
                        <Accordion type="single" collapsible className="w-full mt-auto">
                          <AccordionItem value={`sector-${sectorIndex}`} className="border-0">
                            <AccordionTrigger className="py-2 hover:no-underline">
                              <span className="text-xs font-medium text-[#446786]">
                                See the {categoryCount} {categoryCount === 1 ? 'category' : 'categories'}
                              </span>
                            </AccordionTrigger>
                              <AccordionContent className="pt-2 pb-0">
                                {/* Search Bar */}
                                <div className="mb-4">
                                  <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                      type="text"
                                      placeholder="Search categories..."
                                      value={categorySearch[sector.id || `sector-${sectorIndex}`] || ""}
                                      onChange={(e) => {
                                        const sectorKey = sector.id || `sector-${sectorIndex}`;
                                        setCategorySearch({
                                          ...categorySearch,
                                          [sectorKey]: e.target.value,
                                        });
                                      }}
                                      className="pl-9 h-9 text-sm border border-[#A4C6E8] rounded-[12px] focus:border-[#446786]"
                                    />
                                  </div>
                                </div>
                                
                                {/* Filtered Categories */}
                                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                  {(sector.categories || [])
                                    .filter((category: string) => {
                                      const searchTerm = categorySearch[sector.id || `sector-${sectorIndex}`] || "";
                                      return searchTerm === "" || category.toLowerCase().includes(searchTerm.toLowerCase());
                                    })
                                    .map((category: string, catIndex: number) => {
                                      const categorySlug = createSlug(category);
                                      return (
                                        <Link
                                          key={catIndex}
                                          to={`/best-franchises/category/${categorySlug}`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedSector(sector.name);
                                            setSelectedCategory(category);
                                            setShowFilters(false);
                                          }}
                                          className={`block w-full text-left px-4 py-2.5 rounded-[12px] text-sm font-normal transition-all duration-200 ${
                                            selectedSector === sector.name && selectedCategory === category
                                              ? "bg-[#f4f8fe] border border-[#446786] text-[#446786] font-semibold"
                                              : "bg-white border border-[#A4C6E8] text-foreground hover:bg-[#f4f8fe] hover:border-[#446786]"
                                          }`}
                                        >
                                          {category}
                                        </Link>
                                      );
                                    })}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tags Section - Highlighted */}
            <div className="border-t border-[#A4C6E8] pt-8 mt-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Hottest searches</h3>
              <p className="text-sm text-muted-foreground mb-8">Discover the most popular franchise opportunities</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Investment Tags */}
                <Link to="/best-franchises/category/investment" className="block">
                  <div className="bg-gradient-to-br from-white to-[#f4f8fe] border border-[#A4C6E8] rounded-[20px] p-6 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-[12px] bg-[#446786] flex items-center justify-center shadow-sm">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-bold text-foreground text-lg">Investment</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(directoryData?.tags?.investment || industryDirectory.tags.investment).map((tag: string, index: number) => (
                        <Badge
                          key={index}
                          variant={selectedTags.includes(tag) ? "chipActive" : "chip"}
                          className="cursor-pointer transition-all duration-200"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleTag(tag);
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Link>

                {/* Lifestyle Tags */}
                <Link to="/best-franchises/category/lifestyle" className="block">
                  <div className="bg-gradient-to-br from-white to-[#f4f8fe] border border-[#A4C6E8] rounded-[20px] p-6 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-[12px] bg-[#446786] flex items-center justify-center shadow-sm">
                        <Home className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-bold text-foreground text-lg">Lifestyle</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(directoryData?.tags?.lifestyle || industryDirectory.tags.lifestyle).map((tag: string, index: number) => (
                        <Badge
                          key={index}
                          variant={selectedTags.includes(tag) ? "chipActive" : "chip"}
                          className="cursor-pointer transition-all duration-200"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleTag(tag);
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Link>

                {/* Performance Tags */}
                <Link to="/best-franchises/category/performance" className="block">
                  <div className="bg-gradient-to-br from-white to-[#f4f8fe] border border-[#A4C6E8] rounded-[20px] p-6 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-[12px] bg-[#446786] flex items-center justify-center shadow-sm">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-bold text-foreground text-lg">Performance</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(directoryData?.tags?.performance || industryDirectory.tags.performance).map((tag: string, index: number) => (
                        <Badge
                          key={index}
                          variant={selectedTags.includes(tag) ? "chipActive" : "chip"}
                          className="cursor-pointer transition-all duration-200"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleTag(tag);
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Link>

                {/* Operation & Experience Type Tags - Top 5 Hottest for SEO */}
                <Link to="/best-franchises/category/business-setup" className="block">
                  <div className="bg-gradient-to-br from-white to-[#f4f8fe] border border-[#A4C6E8] rounded-[20px] p-6 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-[12px] bg-[#446786] flex items-center justify-center shadow-sm">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-bold text-foreground text-lg">Business Setup</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        // Combine experience and operation tags, then take top 5 hottest for SEO
                        const experienceTags = directoryData?.tags?.experience || industryDirectory.tags.experience || [];
                        const operationTags = directoryData?.tags?.operation || industryDirectory.tags.operation || [];
                        const allTags = [...experienceTags, ...operationTags];
                        // Top 5 hottest tags for SEO: For Beginners, Turnkey, Brick-and-Mortar, Mobile, Online
                        const hottestTags = [
                          "For Beginners",
                          "Turnkey",
                          "Brick-and-Mortar",
                          "Mobile",
                          "Online"
                        ].filter(tag => allTags.includes(tag));
                        
                        return hottestTags.map((tag: string, index: number) => (
                          <Badge
                            key={index}
                            variant={selectedTags.includes(tag) ? "chipActive" : "chip"}
                            className="cursor-pointer transition-all duration-200"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleTag(tag);
                            }}
                          >
                            {tag}
                          </Badge>
                        ));
                      })()}
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

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
