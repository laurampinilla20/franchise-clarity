import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getCategoryBySlug, getFranchisesByCategory, type CategoryData } from "@/lib/services/categories.service";
import {
  DollarSign,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  X,
  Shield,
  Home,
  Clock,
  Heart,
  GraduationCap,
  Package,
  Building,
  Book,
  Star,
  Download,
  ArrowRight,
  List,
  Lock,
  HelpCircle,
  ChevronRight,
  Target,
  Users,
  RefreshCw,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { FranchiseCard } from "@/components/franchise";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Icon mapping for features
const iconMap: Record<string, any> = {
  DollarSign,
  TrendingUp,
  Shield,
  Users: Home,
  Home,
  Clock,
  Heart,
  GraduationCap,
  Package,
  Building,
  Book,
  Star,
  BarChart: BarChart3,
};

const sections = [
  { id: "snapshot", label: "Snapshot" },
  { id: "opportunities", label: "Opportunities" },
  { id: "investment", label: "Investment" },
  { id: "comparison", label: "Comparison" },
  { id: "ideal-candidate", label: "Ideal candidate" },
  { id: "next-steps", label: "Next Steps" },
  { id: "faqs", label: "FAQs" },
];

// Helper function to create slug from category/industry name
const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function IndustryDetail() {
  const { categorySlug } = useParams();
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [franchises, setFranchises] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("snapshot");
  const [activeStep, setActiveStep] = useState<string>("step-1");
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const navRef = useRef<HTMLDivElement>(null);
  const [isNavSticky, setIsNavSticky] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Track carousel slide changes
  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    setCurrent(carouselApi.selectedScrollSnap());

    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  // Fetch category data
  useEffect(() => {
    const loadCategoryData = async () => {
      if (!categorySlug) {
        setError("Category slug is required");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await getCategoryBySlug(categorySlug);
        if (!data) {
          setError("Category not found");
          setIsLoading(false);
          return;
        }

        setCategoryData(data);

        // Fetch franchises for this category
        const franchiseList = await getFranchisesByCategory(categorySlug);
        setFranchises(franchiseList);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load category data");
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoryData();
  }, [categorySlug]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      const offset = 64 + (isNavSticky ? 88 : 0); // navbar + nav height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      // Check if nav should be sticky
      if (navRef.current) {
        const navTop = navRef.current.getBoundingClientRect().top + window.scrollY;
        setIsNavSticky(window.scrollY > navTop - 64);
      }

      // Find which section is currently in view
      for (const section of sections) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categoryData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Loading category data...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !categoryData) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-foreground font-semibold mb-2">Error</p>
            <p className="text-muted-foreground">{error || "Category not found"}</p>
            <Button asChild className="mt-4">
              <Link to="/best-franchises/for">Back to Browse</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Prepare chart data for performance comparison
  const performanceData = [
    {
      name: categoryData.name,
      revenue: categoryData.performanceMetrics.revenue,
      profit: categoryData.performanceMetrics.profit,
      roi: categoryData.performanceMetrics.roi,
    },
    {
      name: "Industry Average",
      revenue: categoryData.performanceMetrics.revenue * 0.65,
      profit: categoryData.performanceMetrics.profit * 0.6,
      roi: categoryData.performanceMetrics.roi * 0.7,
    },
  ];

  // Growth chart data
  const growthData = [
    { year: "Year 1", value: 200 },
    { year: "Year 2", value: 350 },
    { year: "Year 3", value: 500 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      {/* Sticky Navigation */}
      <div
        ref={navRef}
        className={`w-full bg-white transition-all sticky top-16 z-40 ${
          isNavSticky ? "shadow-sm" : ""
        }`}
      >
        <div className="flex items-center gap-8 overflow-x-auto border-b border-[#A4C6E8] pb-2 scrollbar-hide px-4 sm:px-6 lg:px-8 max-w-[1350px] mx-auto w-full">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`px-4 py-2 rounded-[30px] text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                activeSection === section.id
                  ? "bg-[#203d57] text-white font-bold shadow-md"
                  : "bg-transparent border border-[#4f7aa5]/50 text-[#4f7aa5] font-normal hover:bg-[#4f7aa5]/10 hover:border-[#4f7aa5]"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
      <main className="flex-1 w-full overflow-x-hidden pt-[43px]">
        {/* Hero Section */}
        <div className="px-8 max-w-[1448px] mx-auto mt-8">
          <div className="bg-[#163552] text-white pt-[60px] pb-8 rounded-[30px]">
            <div className="px-8">
              <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
                {categoryData.name}
              </h1>
              <p className="text-xl sm:text-2xl text-white/90 mb-8">
                Franchise Your Future Investment
              </p>
              
              {/* Statistics Table */}
              <div className="max-w-4xl mx-auto mb-8">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border-r border-white/20 p-6 text-center">
                        <p className="text-sm text-white/80 mb-2">Total Investment</p>
                        <p className="text-2xl sm:text-3xl font-bold text-white">
                          {formatCurrency(categoryData.stats.totalInvestment.min)} - {formatCurrency(categoryData.stats.totalInvestment.max)}
                        </p>
                      </td>
                      <td className="border-r border-white/20 p-6 text-center">
                        <p className="text-sm text-white/80 mb-2">Avg. Revenue</p>
                        <p className="text-2xl sm:text-3xl font-bold text-white">
                          {formatCurrency(categoryData.stats.avgRevenue.min)} - {formatCurrency(categoryData.stats.avgRevenue.max)}
                        </p>
                      </td>
                      <td className="p-6 text-center">
                        <p className="text-sm text-white/80 mb-2">Avg. Profit</p>
                        <p className="text-2xl sm:text-3xl font-bold text-white">
                          {formatCurrency(categoryData.stats.avgProfit.min)} - {formatCurrency(categoryData.stats.avgProfit.max)}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-[#54b936] hover:bg-[#54b936]/90 text-white rounded-[30px] px-8 py-6 text-base font-bold"
                >
                  Find Franchises in this Industry
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-[30px] px-8 py-6 text-base font-bold"
                >
                  Talk to a Franchise Industry Advisor
                </Button>
              </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white w-full overflow-x-hidden">
          <div className="px-8 max-w-[1448px] mx-auto">
            {/* Introduction Section */}
            <div className="mb-16 mt-10 max-w-[1136px] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                {/* Left Column - Image */}
                <div className="rounded-[20px] overflow-hidden">
                  {categoryData.heroImage ? (
                    <img
                      src={categoryData.heroImage}
                      alt={categoryData.name}
                      className="w-full h-auto"
                    />
                  ) : (
                    <div className="w-full h-[400px] bg-gradient-to-br from-[#f4f8fe] to-[#dee8f2] rounded-[20px] flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Building className="w-24 h-24 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Category Image</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Content */}
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-8">
                    Why Buyers Are Attracted to {categoryData.name} Opportunities
                  </h3>
                  <div className="mb-8">
                    <div className="space-y-2">
                      {(categoryData.buyerAttractionReasons || [
                        "Recurring Revenue Models (e.g., subscriptions, memberships)",
                        "High Profit Margins or Low Overhead",
                        "Simple, Scalable Operations without complex staffing",
                        "Owner-Operated or Semi-Absentee Friendly"
                      ]).map((reason, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-6 h-6 text-[#54b936] flex-shrink-0 mt-0.5" />
                          <p className="text-base text-foreground">
                            {reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-base font-bold text-foreground mb-6">
                      Get your fit score, compare models, and see real data — before you talk to a salesperson.
                    </p>
                    <Link to="/best-franchises">
                      <Button
                        size="lg"
                        className="bg-[#54b936] hover:bg-[#54b936]/90 text-white rounded-[30px] px-8 py-6 text-base font-bold"
                      >
                        Start with Your Free Franchise Fit Quiz
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Industry Snapshot Section */}
            {categoryData.sectorMetrics ? (
              <div ref={(el) => (sectionRefs.current["snapshot"] = el)} className="mb-16">
                <div className="bg-[#F4F8FE] rounded-[30px] overflow-hidden shadow-sm py-10 px-8 max-w-[1448px] mx-auto">
                  <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
                    Industry Snapshot
                  </h3>
                  <div className="max-w-[1136px] mx-auto">
                    {/* Desktop Table - Original Structure */}
                    <table className="w-full border-collapse table-desktop-only">
                    <tbody>
                      <tr>
                        {/* 1. Average Total Investment */}
                        <td className="border-r border-b border-[#A4C6E8] p-6 md:p-8 align-top">
                          <p className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                            Average Total Investment
                          </p>
                          <p className="text-2xl sm:text-3xl font-bold text-foreground">
                            {formatCurrency(categoryData.stats.totalInvestment.min)} - {formatCurrency(categoryData.stats.totalInvestment.max)}
                          </p>
                        </td>

                        {/* 2. Average Initial Franchise Fee */}
                        <td className="border-r border-b border-[#A4C6E8] p-6 md:p-8 align-top">
                          <p className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                            Average Initial Franchise Fee
                          </p>
                          <p className="text-2xl sm:text-3xl font-bold text-foreground">
                            {formatCurrency(categoryData.sectorMetrics.initialFranchiseFee.average)}
                          </p>
                        </td>

                        {/* 3. Average Agreement Terms */}
                        <td className="border-b border-[#A4C6E8] p-6 md:p-8 align-top">
                          <p className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                            Average Agreement Terms
                          </p>
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <p className="text-xs text-muted-foreground mb-1">Initial Term</p>
                              <p className="text-xl sm:text-2xl font-bold text-foreground">
                                {categoryData.sectorMetrics.initialTerm.average} {categoryData.sectorMetrics.initialTerm.average === 1 ? 'Year' : 'Years'}
                              </p>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-muted-foreground mb-1">Renewal Term</p>
                              <p className="text-xl sm:text-2xl font-bold text-foreground">
                                {categoryData.sectorMetrics.renewalTerm.average} {categoryData.sectorMetrics.renewalTerm.average === 1 ? 'Year' : 'Years'}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        {/* 4. Total Franchisee Outlet Growth */}
                        <td className="border-r border-[#A4C6E8] p-6 md:p-8 align-top">
                          <p className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                            Total Franchisee Outlet Growth
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-2xl sm:text-3xl font-bold text-foreground">
                              {categoryData.sectorMetrics.totalOutlets.growth5Year > 0 ? '+' : ''}{categoryData.sectorMetrics.totalOutlets.growth5Year}
                            </p>
                            {categoryData.sectorMetrics.totalOutlets.growth5Year > 0 && (
                              <TrendingUp className="w-5 h-5 text-[#54b936]" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">5 Year Growth</p>
                        </td>

                        {/* 5. Average Ongoing Fees */}
                        <td className="border-r border-[#A4C6E8] p-6 md:p-8 align-top">
                          <p className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                            Average Ongoing Fees
                          </p>
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <p className="text-xs text-muted-foreground mb-1">Royalty Rate</p>
                              <p className="text-xl sm:text-2xl font-bold text-foreground">
                                {categoryData.sectorMetrics.royaltyRate.average}%
                              </p>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-muted-foreground mb-1">Advertising Rate</p>
                              <p className="text-xl sm:text-2xl font-bold text-foreground">
                                {categoryData.sectorMetrics.nationalAdvertisingRate.average}%
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* 6. Number of Franchised Outlets */}
                        <td className="border-[#A4C6E8] p-6 md:p-8 align-top">
                          <p className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                            Number of Franchised Outlets
                          </p>
                          <p className="text-2xl sm:text-3xl font-bold text-foreground">
                            {categoryData.sectorMetrics.totalOutlets.current.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">Start {new Date().getFullYear()}</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                    {/* Mobile 2-Column Grid */}
                    <div className="md:hidden grid grid-cols-2 gap-4">
                      {/* 1. Average Total Investment */}
                      <div className="border border-[#A4C6E8] rounded-[12px] p-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Average Total Investment
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          {formatCurrency(categoryData.stats.totalInvestment.min)} - {formatCurrency(categoryData.stats.totalInvestment.max)}
                        </p>
                      </div>

                      {/* 2. Average Initial Franchise Fee */}
                      <div className="border border-[#A4C6E8] rounded-[12px] p-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Average Initial Franchise Fee
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          {formatCurrency(categoryData.sectorMetrics.initialFranchiseFee.average)}
                        </p>
                      </div>

                      {/* 3. Average Agreement Terms */}
                      <div className="border border-[#A4C6E8] rounded-[12px] p-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Average Agreement Terms
                        </p>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Initial Term</p>
                            <p className="text-base font-bold text-foreground">
                              {categoryData.sectorMetrics.initialTerm.average} {categoryData.sectorMetrics.initialTerm.average === 1 ? 'Year' : 'Years'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Renewal Term</p>
                            <p className="text-base font-bold text-foreground">
                              {categoryData.sectorMetrics.renewalTerm.average} {categoryData.sectorMetrics.renewalTerm.average === 1 ? 'Year' : 'Years'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 4. Total Franchisee Outlet Growth */}
                      <div className="border border-[#A4C6E8] rounded-[12px] p-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Total Franchisee Outlet Growth
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-bold text-foreground">
                            {categoryData.sectorMetrics.totalOutlets.growth5Year > 0 ? '+' : ''}{categoryData.sectorMetrics.totalOutlets.growth5Year}
                          </p>
                          {categoryData.sectorMetrics.totalOutlets.growth5Year > 0 && (
                            <TrendingUp className="w-4 h-4 text-[#54b936]" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">5 Year Growth</p>
                      </div>

                      {/* 5. Average Ongoing Fees */}
                      <div className="border border-[#A4C6E8] rounded-[12px] p-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Average Ongoing Fees
                        </p>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Royalty Rate</p>
                            <p className="text-base font-bold text-foreground">
                              {categoryData.sectorMetrics.royaltyRate.average}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Advertising Rate</p>
                            <p className="text-base font-bold text-foreground">
                              {categoryData.sectorMetrics.nationalAdvertisingRate.average}%
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 6. Number of Franchised Outlets */}
                      <div className="border border-[#A4C6E8] rounded-[12px] p-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Number of Franchised Outlets
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          {categoryData.sectorMetrics.totalOutlets.current.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Start {new Date().getFullYear()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Industry Franchise Recommendation Section */}
            <div ref={(el) => (sectionRefs.current["opportunities"] = el)} className="mb-16 max-w-[1136px] mx-auto">
              <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-8 text-center">
              Featured Opportunities
              </h3>
              <Carousel
                opts={{
                  align: "start",
                  loop: false,
                }}
                setApi={(api) => {
                  if (api) {
                    setCarouselApi(api);
                  }
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {/* Generate 8 franchise cards for the carousel */}
                  {Array.from({ length: 8 }).map((_, index) => {
                    // Use existing franchises or create sample data
                    const franchise = franchises[index] || {
                      id: `recommended-${index}`,
                      name: `${categoryData.name} Franchise ${index + 1}`,
                      logo: undefined,
                      investmentMin: categoryData.stats.totalInvestment.min,
                      investmentMax: categoryData.stats.totalInvestment.max,
                      sector: categoryData.name,
                      category: categoryData.name,
                      grade: "B",
                      slug: `${categoryData.slug}-franchise-${index + 1}`,
                    };
                    
                    return (
                      <CarouselItem key={franchise.id || index} className="pl-2 md:pl-4 basis-2/3 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                        <FranchiseCard
                          id={franchise.id || `franchise-${index}`}
                          name={franchise.name}
                          logo={franchise.logo}
                          investmentMin={franchise.investmentMin || categoryData.stats.totalInvestment.min}
                          investmentMax={franchise.investmentMax || categoryData.stats.totalInvestment.max}
                          sector={franchise.sector || categoryData.name}
                          category={franchise.category || categoryData.name}
                          categorySlug={categoryData.slug}
                          grade={franchise.grade || "B"}
                          isLoggedIn={false}
                        />
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                {/* Dots Navigation */}
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => carouselApi?.scrollTo(index)}
                      className={`h-2 rounded-full transition-all ${
                        current === index ? "w-8 bg-[#446786]" : "w-2 bg-[#A4C6E8]"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </Carousel>
            </div>

            {/* Key Metrics Visualizations */}
            {categoryData.sectorMetrics ? (
              <div ref={(el) => (sectionRefs.current["investment"] = el)} className="mb-16 space-y-16">
                {/* Initial Investment and Royalty Rate - Side by Side */}
                <div className="max-w-[1136px] mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start lg:items-center">
                  {/* Initial Investment Section */}
                  <div className="flex flex-col space-y-6 h-full">
                    {/* 1. Title */}
                    <h3 className="text-2xl font-bold text-foreground min-h-[40px] flex items-center">Initial Investment</h3>
                    
                    {/* 2. Description */}
                    <p className="text-base text-muted-foreground min-h-[72px] leading-relaxed">
                      The {categoryData.name} industry has a wide range of franchise investments that suit any budget. 
                      The average initial investment is {formatCurrency(categoryData.stats.totalInvestment.min)} to {formatCurrency(categoryData.stats.totalInvestment.max)}. 
                      Make sure you compare franchises that fit your personal budget.
                    </p>
                    
                    {/* 3. Graphic */}
                    <div className="bg-white border border-[#A4C6E8] rounded-[20px] p-6 flex-1 flex flex-col">
                      <h4 className="text-lg font-bold text-foreground mb-4 text-center min-h-[28px] flex items-center justify-center">Initial Investment</h4>
                      <ChartContainer
                        config={{
                          average: { label: "Average", color: "#446786" },
                          median: { label: "Median", color: "#203d57" },
                        }}
                        className="h-[300px] flex-shrink-0"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              {
                                name: "Average",
                                value: (categoryData.stats.totalInvestment.min + categoryData.stats.totalInvestment.max) / 2,
                                fill: "#446786",
                              },
                              {
                                name: "Median",
                                value: (categoryData.stats.totalInvestment.min + categoryData.stats.totalInvestment.max) / 2 * 0.65,
                                fill: "#203d57",
                              },
                            ]}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#A4C6E8" />
                            <XAxis dataKey="name" stroke="#446786" />
                            <YAxis stroke="#446786" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                              {[
                                { name: "Average", value: (categoryData.stats.totalInvestment.min + categoryData.stats.totalInvestment.max) / 2 },
                                { name: "Median", value: (categoryData.stats.totalInvestment.min + categoryData.stats.totalInvestment.max) / 2 * 0.65 },
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? "#446786" : "#203d57"} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                      <div className="flex justify-center gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-[#446786]"></div>
                          <span className="text-xs text-muted-foreground">
                            Average
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-[#203d57]"></div>
                          <span className="text-xs text-muted-foreground">
                            Median
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        Figure: Average initial investment
                      </p>
                    </div>
                    
                    {/* 4. Why it's important and What to look for */}
                    <div className="space-y-4 flex-1 flex flex-col">
                      <div className="bg-[#f4f8fe] border-l-4 border-[#54b936] p-4 rounded-lg min-h-[100px]">
                        <p className="text-sm font-medium text-foreground mb-2">Why it's important</p>
                        <p className="text-sm text-muted-foreground">
                          {categoryData.sectionDescriptions?.initialInvestment || "The initial investment includes all costs associated with opening a new franchised location. These costs include things like leasehold improvements, training, grand opening advertising and additional funds."}
                        </p>
                      </div>
                      <div className="bg-[#f4f8fe] border-l-4 border-[#446786] p-4 rounded-lg min-h-[100px]">
                        <p className="text-sm font-medium text-foreground mb-2">What to look for</p>
                        <p className="text-sm text-muted-foreground">
                          Initial investments that have minimal estimates, or exact numbers means that they may be underestimating 
                          the amount required for the franchisee to operate the outlet.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Royalty Rate Section */}
                  <div className="flex flex-col space-y-6 h-full">
                    {/* 1. Title */}
                    <h3 className="text-2xl font-bold text-foreground min-h-[40px] flex items-center">Royalty Rate</h3>
                    
                    {/* 2. Description */}
                    <p className="text-base text-muted-foreground min-h-[72px] leading-relaxed">
                      The average royalty rate in the {categoryData.name} industry is {categoryData.sectorMetrics.royaltyRate.average}%. 
                      Franchises within the industry set their own royalty rates, ranging from {categoryData.sectorMetrics.royaltyRate.range.min}% 
                      (lowest) to {categoryData.sectorMetrics.royaltyRate.range.max}% (highest).
                    </p>
                    
                    {/* 3. Graphic */}
                    <div className="bg-white border border-[#A4C6E8] rounded-[20px] p-6 flex-1 flex flex-col">
                      <h4 className="text-lg font-bold text-foreground mb-4 text-center min-h-[28px] flex items-center justify-center">Royalty Rate</h4>
                      <ChartContainer
                        config={{
                          average: { label: "Average", color: "#446786" },
                          median: { label: "Median", color: "#54b936" },
                        }}
                        className="h-[300px] flex-shrink-0"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { name: "Average", value: categoryData.sectorMetrics.royaltyRate.average },
                              { name: "Median", value: categoryData.sectorMetrics.royaltyRate.median },
                            ]}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#A4C6E8" />
                            <XAxis dataKey="name" stroke="#446786" />
                            <YAxis stroke="#446786" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                              {[
                                { name: "Average", value: categoryData.sectorMetrics.royaltyRate.average },
                                { name: "Median", value: categoryData.sectorMetrics.royaltyRate.median },
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? "#446786" : "#203d57"} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                      <div className="flex justify-center gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-[#446786]"></div>
                          <span className="text-xs text-muted-foreground">
                            Average: {categoryData.sectorMetrics.royaltyRate.average}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-[#203d57]"></div>
                          <span className="text-xs text-muted-foreground">
                            Median: {categoryData.sectorMetrics.royaltyRate.median}%
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        Figure: Average royalty rate
                      </p>
                    </div>
                    
                    {/* 4. Why it's important and What to look for */}
                    <div className="space-y-4 flex-1 flex flex-col">
                      <div className="bg-[#f4f8fe] border-l-4 border-[#54b936] p-4 rounded-lg min-h-[100px]">
                        <p className="text-sm font-medium text-foreground mb-2">Why it's important</p>
                        <p className="text-sm text-muted-foreground">
                          {categoryData.sectionDescriptions?.royaltyRate || "Should be a primary revenue stream for franchisor. Royalties are fees you pay to the franchisor on a regular basis."}
                        </p>
                      </div>
                      <div className="bg-[#f4f8fe] border-l-4 border-[#446786] p-4 rounded-lg min-h-[100px]">
                        <p className="text-sm font-medium text-foreground mb-2">What to look for</p>
                        <p className="text-sm font-semibold text-foreground mb-1">Fair, reasonable rates.</p>
                        <p className="text-sm text-muted-foreground">
                          These fees must be paid on top of operating costs like payroll, utilities, telephone and monthly lease payments.
                        </p>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>

                {/* Growth Rate Chart */}
                <div ref={(el) => (sectionRefs.current["growth"] = el)} className="max-w-[1136px] mx-auto">
                  <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">Growth Rate</h3>
                    <p className="text-base text-muted-foreground mb-6">
                      {(categoryData.sectionDescriptions?.growthRate || `The average franchisee growth rate in the ${categoryData.name} industry is ${categoryData.sectorMetrics.growthRate.average}%. This average masks significant variation, with some franchise systems growing and others shrinking. Compare and review growth rates from several franchises before making an investment decision.`).replace(/{name}/g, categoryData.name).replace(/{average}/g, categoryData.sectorMetrics.growthRate.average.toString())}
                    </p>
                  </div>
                  <div className="bg-white border border-[#A4C6E8] rounded-[20px] p-6 w-full">
                    <h4 className="text-lg font-bold text-foreground mb-4 text-center">Growth Rate</h4>
                    <ChartContainer
                      config={{
                        rate: { label: "Growth Rate %", color: "#446786" },
                      }}
                      className="h-[300px] w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={categoryData.sectorMetrics.growthRate.data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#A4C6E8" />
                          <XAxis dataKey="year" stroke="#446786" />
                          <YAxis stroke="#446786" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line type="monotone" dataKey="rate" stroke="#446786" strokeWidth={2} dot={{ fill: "#446786" }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Figure: Growth rate over time
                    </p>
                  </div>
                  </div>
                </div>

                {/* Territory Rights Chart */}
                <div ref={(el) => (sectionRefs.current["territory"] = el)} className="max-w-[1136px] mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <div className="bg-white border border-[#A4C6E8] rounded-[20px] p-6 flex flex-col items-center">
                    <h4 className="text-lg font-bold text-foreground mb-4 text-center">Territory Rights</h4>
                    <ChartContainer
                      config={{
                        value: { label: "Percentage", color: "#446786" },
                      }}
                      className="h-[300px] w-full flex items-center justify-center"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "With Territory Rights", value: categoryData.sectorMetrics.territoryRights.percentage },
                              { name: "Without Territory Rights", value: 100 - categoryData.sectorMetrics.territoryRights.percentage },
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            innerRadius={60}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell fill="#446786" />
                            <Cell fill="#A4C6E8" />
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    <div className="flex justify-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-[#446786]"></div>
                        <span className="text-xs text-muted-foreground">
                          {categoryData.sectorMetrics.territoryRights.percentage}% have territory rights
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Figure: Percent of systems with territory rights
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">Territory Rights</h3>
                    <p className="text-base text-muted-foreground mb-6">
                      {(categoryData.sectionDescriptions?.territoryRights || `Territory rights are specific to a franchise and should include definitions of customer types or geographic boundaries. In the ${categoryData.name} industry, ${categoryData.sectorMetrics.territoryRights.percentage}% of franchises offer exclusive territory rights.`).replace(/{name}/g, categoryData.name).replace(/{percentage}/g, categoryData.sectorMetrics.territoryRights.percentage.toString())}
                    </p>
                    <div className="bg-[#f4f8fe] border-l-4 border-[#54b936] p-4 rounded-lg mb-4">
                      <p className="text-sm font-medium text-foreground mb-2">Why it's important</p>
                      <p className="text-sm text-muted-foreground">
                        Larger protected territory means larger customer base.
                      </p>
                    </div>
                    <div className="bg-[#f4f8fe] border-l-4 border-[#446786] p-4 rounded-lg">
                      <p className="text-sm font-medium text-foreground mb-2">What to look for</p>
                      <p className="text-sm text-muted-foreground">
                        Look for quality territory rights and compare one franchise to several others. Some franchises have minimum sales 
                        quotas you need to achieve each year to maintain territory protections.
                      </p>
                    </div>
                  </div>
                  </div>
                </div>

                {/* Franchisee Turnover Rate Chart */}
                <div ref={(el) => (sectionRefs.current["turnover"] = el)} className="max-w-[1136px] mx-auto">
                  <div className="space-y-8">
                  {/* 1. Title and Description */}
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">Franchisee Turnover Rate</h3>
                    <p className="text-base text-muted-foreground mb-6">
                      {(categoryData.sectionDescriptions?.franchiseeTurnoverRate || `The Franchisee Turnover Rate (FTR) is the percentage of franchised outlets that turn over every year. The average FTR in the ${categoryData.name} industry is ${categoryData.sectorMetrics.franchiseeTurnoverRate.average}%. Franchisee turnover is an important indicator of franchisee satisfaction and system health.`).replace(/{name}/g, categoryData.name).replace(/{average}/g, categoryData.sectorMetrics.franchiseeTurnoverRate.average.toString())}
                    </p>
                  </div>

                  {/* 2. Full-width Graphic */}
                  <div className="bg-white border border-[#A4C6E8] rounded-[20px] p-6 w-full">
                    <h4 className="text-lg font-bold text-foreground mb-4 text-center">Franchisee Turnover Rate</h4>
                    <ChartContainer
                      config={{
                        rate: { label: "Turnover Rate %", color: "#446786" },
                      }}
                      className="h-[300px] w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={categoryData.sectorMetrics.franchiseeTurnoverRate.data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#A4C6E8" />
                          <XAxis dataKey="year" stroke="#446786" />
                          <YAxis stroke="#446786" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line type="monotone" dataKey="rate" stroke="#446786" strokeWidth={2} dot={{ fill: "#446786" }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Figure: Average of {categoryData.sectorMetrics.franchiseeTurnoverRate.average}% FTR between 2015-2020
                    </p>
                  </div>

                  {/* 3. Two columns: Why and What */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#f4f8fe] border-l-4 border-[#54b936] p-4 rounded-lg">
                      <p className="text-sm font-medium text-foreground mb-2">Why it's important</p>
                      <p className="text-sm text-muted-foreground">
                        The Franchisee Turnover Rate shows the stability and success of outlets.
                      </p>
                    </div>
                    <div className="bg-[#f4f8fe] border-l-4 border-[#446786] p-4 rounded-lg">
                      <p className="text-sm font-medium text-foreground mb-2">What to look for</p>
                      <p className="text-sm text-muted-foreground">
                        A low turnover rate is an indication of a stable franchise system. A high turnover rate raises red flags 
                        on the value of the investment. Look for consistency year over year.
                      </p>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Comparison Section */}
            <div ref={(el) => (sectionRefs.current["comparison"] = el)} className="mb-16 max-w-[1448px] mx-auto">
              <div className="bg-[#f4f8fe] rounded-[20px] p-10">
                <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
                  Why Choose {categoryData.name}?
                </h3>
                <div className="flex flex-col md:flex-row gap-32 justify-center items-start max-w-[1200px] mx-auto">
                  {/* left column */}
                  <div className="w-fit px-6">
                    <h3 className="text-xl font-bold text-foreground mb-6 text-left">
                      {categoryData.name}
                    </h3>
                    <div className="space-y-4">
                      {categoryData.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle2 className="w-6 h-6 text-[#54b936] flex-shrink-0" />
                          <p className="text-base text-foreground">{benefit}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* right column */}
                  <div className="w-fit px-6">
                    <h3 className="text-xl font-bold text-foreground mb-6 text-left">
                      Other Franchises
                    </h3>
                    <div className="space-y-4">
                      {categoryData.alternatives?.map((alt, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <X className="w-6 h-6 text-red-500 flex-shrink-0" />
                          <p className="text-base text-foreground">{alt}</p>
                        </div>
                      )) || (
                        <div className="space-y-4">
                          {categoryData.benefits.map((_, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <X className="w-6 h-6 text-red-500 flex-shrink-0" />
                              <p className="text-base text-muted-foreground">
                                Limited benefits
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <Button
                    size="lg"
                    className="bg-[#54b936] hover:bg-[#54b936]/90 text-white rounded-[30px] px-8 py-6 text-base font-bold"
                  >
                    Find Franchises in this Industry
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border border-[#A4C6E8] text-foreground hover:bg-[#f4f8fe] rounded-[30px] px-8 py-6 text-base font-bold"
                  >
                    Talk to a Franchise Industry Advisor
                  </Button>
                </div>
              </div>
            </div>

            {/* Ideal Candidate Section */}
            <div ref={(el) => (sectionRefs.current["ideal-candidate"] = el)} className="mb-16 max-w-[1136px] mx-auto">
              <div className="space-y-12">
                {/* Ideal Buyer Profile */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                  {/* Left Column - Image */}
                  <div className="rounded-[20px] overflow-hidden">
                    {categoryData.heroImage ? (
                      <img
                        src={categoryData.heroImage}
                        alt={`Ideal Buyer Profile for ${categoryData.name}`}
                        className="w-full h-auto"
                      />
                    ) : (
                      <div className="w-full h-[400px] bg-gradient-to-br from-[#f4f8fe] to-[#dee8f2] rounded-[20px] flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <Building className="w-24 h-24 mx-auto mb-4 opacity-50" />
                          <p className="text-lg">Ideal Buyer Profile</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Content */}
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-6">
                      Ideal Buyer Profile for {categoryData.name}
                    </h3>
                    <p className="text-base text-muted-foreground mb-6">
                      {(categoryData.idealBuyerProfile?.description || `Strong candidates for ${categoryData.name}, aligned franchises typically demonstrate:`).replace(/{name}/g, categoryData.name)}
                    </p>
                    <ul className="space-y-4 mb-6">
                      {(categoryData.idealBuyerProfile?.traits || [
                        "Strategic thinking and the ability to understand how this business model operates within its market",
                        "Operational discipline, ensuring systems and processes are consistently followed",
                        "Adaptability, as some {name} groups evolve quickly due to consumer or technology trends"
                      ]).map((trait, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-[#54b936] flex-shrink-0 mt-0.5" />
                          <p className="text-base text-foreground">
                            {trait.replace(/{name}/g, categoryData.name)}
                          </p>
                        </li>
                      ))}
                    </ul>
                    <p className="text-base text-muted-foreground">
                      {(categoryData.idealBuyerProfile?.closingText || `Buyers who resonate with these traits often find the ${categoryData.name} category to be both manageable and rewarding.`).replace(/{name}/g, categoryData.name)}
                    </p>
                  </div>
                </div>

                {/* Who Thrives Section */}
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-6">
                    Who Thrives in {categoryData.name}-Aligned Franchises?
                  </h3>
                  <p className="text-base text-muted-foreground mb-8">
                    Top performers in this category tend to share four core traits:
                  </p>
                  
                  {/* Traits Boxes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(categoryData.whoThrivesTraits || [
                      {
                        icon: "Heart",
                        title: "Customer Focus",
                        description: "If the model involves direct service or community engagement, owners who lead with empathy and responsiveness often outperform."
                      },
                      {
                        icon: "Target",
                        title: "Operational Discipline",
                        description: `Following playbooks matters, ${categoryData.name} brands succeed when SOPs and KPIs are taken seriously.`
                      },
                      {
                        icon: "Users",
                        title: "Team Leadership",
                        description: "Many models depend on small but efficient teams, so the ability to lead, train, and retain people is key."
                      },
                      {
                        icon: "RefreshCw",
                        title: "Adaptability",
                        description: "Especially in evolving markets (tech, wellness, or mobile), the best owners stay responsive and coachable."
                      }
                    ]).map((trait, index) => {
                      const IconComponent = iconMap[trait.icon] || Heart;
                      return (
                        <div key={index} className="bg-white border border-[#A4C6E8] rounded-[20px] p-6 shadow-sm hover:shadow-md transition-all duration-200">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-[12px] bg-[#f4f8fe] flex items-center justify-center flex-shrink-0">
                              <IconComponent className="w-6 h-6 text-[#446786]" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-foreground mb-2">
                                {trait.title}
                              </h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {trait.description.replace(/{name}/g, categoryData.name)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* CTA Section */}
                  <div className="mt-8 bg-[#f4f8fe] border-l-4 border-[#54b936] p-6 rounded-lg">
                    <p className="text-base text-foreground mb-6">
                      💡 Not sure where you stand? Our advisors will walk you through what "fit" really means in your case.
                    </p>
                    <Button
                      size="lg"
                      className="bg-[#54b936] hover:bg-[#54b936]/90 text-white rounded-[30px] px-8 py-6 text-base font-bold"
                      asChild
                    >
                      <Link to="/best-franchises">Talk to an advisor</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise Opportunities Section */}
            {franchises.length > 0 && (
              <div className="mb-16">
                <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
                  Our {categoryData.name} Franchise Opportunities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {franchises.map((franchise) => (
                    <div
                      key={franchise.id || franchise.slug}
                      className="bg-white border border-[#A4C6E8] rounded-[20px] p-6 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      {franchise.logo && (
                        <img
                          src={franchise.logo}
                          alt={franchise.name}
                          className="w-full h-48 object-cover rounded-[12px] mb-4"
                        />
                      )}
                      <h3 className="font-bold text-foreground text-lg mb-2">{franchise.name}</h3>
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-muted-foreground">
                          Investment: {formatCurrency(franchise.investmentMin || 0)} - {formatCurrency(franchise.investmentMax || 0)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Revenue: {formatCurrency(franchise.revenue || 0)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Profit: {formatCurrency(franchise.profit || 0)}
                        </p>
                      </div>
                      <Button
                        asChild
                        className="w-full bg-[#446786] hover:bg-[#446786]/90 text-white rounded-[30px] font-bold"
                      >
                        <Link to={`/best-franchises/brand/${franchise.slug || franchise.id}`}>
                          Learn More
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps Section */}
            <div
              ref={(el) => (sectionRefs.current["next-steps"] = el)}
              className="mb-16 max-w-[1136px] mx-auto"
            >
              {/* Title */}
              <h3 className="text-2xl font-bold text-foreground mb-8">Next Steps</h3>

              {/* Step-by-step guide */}
              {(() => {
                const industryName = categoryData.name || "Franchise";

                return (
                  <div className="flex flex-col gap-8">
                    {/* Header */}
                    <div className="space-y-3">
                      <p className="font-bold text-foreground leading-tight">
                        How to Become a {industryName} Franchise Owner
                      </p>
                      <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
                        A step-by-step guide to evaluating the opportunity, preparing for franchisor conversations, and navigating the approval process, with expert support along the way.
                      </p>
                    </div>

                    {/* Timeline Accordion */}
                    <div className="relative">
                      <Accordion
                        type="single"
                        collapsible
                        value={activeStep}
                        onValueChange={(value) => {
                          if (value) setActiveStep(value);
                          else setActiveStep("step-1");
                        }}
                        className="w-full"
                      >
                        {/* Step 1 */}
                        <AccordionItem value="step-1" className="border-0">
                          <div className="relative flex gap-6 items-start">
                            {/* Timeline Line & Number */}
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-[#54b936] flex items-center justify-center border-4 border-white shadow-md z-10 mt-0.5">
                                <span className="text-white font-bold text-lg">1</span>
                              </div>
                              <div className="w-0.5 h-full bg-[#dee8f2] flex-1 mt-2" />
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1">
                              <AccordionTrigger className="text-left hover:no-underline p-0 [&>svg]:hidden">
                                <div className="flex-1 flex items-center gap-3">
                                  <ChevronRight className="w-5 h-5 text-[#446786] flex-shrink-0" />
                                  <p className="font-bold text-foreground">
                                    Create Your Free Franchise Grade Account
                                  </p>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pt-4 pb-6 text-base text-foreground space-y-5">
                                <div>
                                  <p className="font-semibold text-foreground mb-3">What you'll get:</p>
                                  <ul className="space-y-2.5">
                                    {[
                                      "Full system report & FI™ Score",
                                      "Territory availability insights",
                                      "Investment ranges and risk indicators",
                                      "Benchmark comparisons against similar franchises",
                                      `A clear view of how ${industryName} aligns with your goals`
                                    ].map((item, idx) => (
                                      <li key={idx} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-[#54b936] mt-0.5 flex-shrink-0" />
                                        <span className="text-muted-foreground">{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="bg-[#f4f8fe] border-l-4 border-[#54b936] p-6 rounded-lg shadow-sm">
                                  <p className="text-sm font-medium text-foreground">
                                    <strong className="text-foreground">Why this matters:</strong> Most buyers waste weeks chasing franchise reps before they understand their fit. Our tools help you focus on the right brands, and avoid costly mismatches.
                                  </p>
                                </div>
                                <Button className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-8 py-3 text-base font-bold text-white" asChild>
                                  <Link to="/best-franchises">Unlock Your {industryName} Ownership Insights → Sign Up Free</Link>
                                </Button>
                              </AccordionContent>
                            </div>
                          </div>
                        </AccordionItem>

                        {/* Step 2 */}
                        <AccordionItem value="step-2" className="border-0">
                          <div className="relative flex gap-6">
                            {/* Timeline Line & Number */}
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-[#446786] flex items-center justify-center border-4 border-white shadow-md z-10">
                                <span className="text-white font-bold text-lg">2</span>
                              </div>
                              <div className="w-0.5 h-full bg-[#dee8f2] flex-1 mt-2" />
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 pt-1">
                              <AccordionTrigger className="text-left hover:no-underline p-0 [&>svg]:hidden">
                                <div className="flex-1 flex items-center gap-3">
                                  <ChevronRight className="w-5 h-5 text-[#446786] flex-shrink-0" />
                                  <p className="font-bold text-foreground">
                                    Speak With a Franchise Grade Advisor
                                  </p>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pt-4 pb-6 text-base text-foreground space-y-5">
                                <div>
                                  <p className="font-semibold text-foreground mb-3">We help you understand:</p>
                                  <ul className="space-y-2.5">
                                    {[
                                      `If ${industryName} matches your goals and skills`,
                                      "Which questions to ask the franchisor",
                                      "How competitive your territory is",
                                      "What the FDD reveals about risk and scalability",
                                      "Whether you should consider alternative brands"
                                    ].map((item, idx) => (
                                      <li key={idx} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-[#54b936] mt-0.5 flex-shrink-0" />
                                        <span className="text-muted-foreground">{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="bg-[#f4f8fe] border-l-4 border-[#54b936] p-6 rounded-lg shadow-sm">
                                  <p className="text-sm font-medium text-foreground">
                                    <strong className="text-foreground">Why this matters:</strong> This step significantly improves your odds of choosing the right franchise, not just the one that calls you back first.
                                  </p>
                                </div>
                              </AccordionContent>
                            </div>
                          </div>
                        </AccordionItem>

                        {/* Step 3 - Pre-Franchisor Checklist */}
                        <AccordionItem value="step-3" className="border-0">
                          <div className="relative flex gap-6">
                            {/* Timeline Line & Number */}
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-[#446786] flex items-center justify-center border-4 border-white shadow-md z-10">
                                <span className="text-white font-bold text-lg">3</span>
                              </div>
                              <div className="w-0.5 h-full bg-[#dee8f2] flex-1 mt-2" />
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 pt-1">
                              <AccordionTrigger className="text-left hover:no-underline p-0 [&>svg]:hidden">
                                <div className="flex-1 flex items-center gap-3">
                                  <ChevronRight className="w-5 h-5 text-[#446786] flex-shrink-0" />
                                  <p className="font-bold text-foreground">
                                    Determine Your Financial Readiness & Ownership Model
                                  </p>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pt-4 pb-6 text-base text-foreground space-y-5">
                                <div className="bg-[#f4f8fe] border border-[#A4C6E8] rounded-[20px] p-5 mb-4">
                                  <div className="flex items-center gap-2 mb-3">
                                    <CheckCircle2 className="w-5 h-5 text-[#54b936]" />
                                    <p className="font-bold text-foreground">Pre-Franchisor Engagement Checklist</p>
                                  </div>
                                  <p className="font-semibold mb-3 text-foreground">Are You Ready to Speak With the Franchisor?</p>
                                  <p className="text-sm mb-4 text-muted-foreground">Before moving to Step 4, make sure you can answer:</p>
                                  <ul className="space-y-2.5">
                                    {[
                                      "Your financial qualifications",
                                      "Why you're choosing this industry",
                                      "What makes your territory a strong fit",
                                      "Your preferred ownership structure",
                                      "Whether you've reviewed FDD basics"
                                    ].map((item, idx) => (
                                      <li key={idx} className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-[#54b936] mt-1 flex-shrink-0" />
                                        <span className="text-sm text-muted-foreground">{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                  <p className="text-sm italic text-muted-foreground mt-4">
                                    "Most franchisors quietly disqualify unprepared candidates. Franchise Grade helps you start strong."
                                  </p>
                                </div>
                                <div>
                                  <p className="font-semibold text-foreground mb-3">Before reaching out to {industryName}, be prepared to explain:</p>
                                  <ul className="space-y-2.5">
                                    {[
                                      "Liquidity and net worth",
                                      "Estimated total investment",
                                      "Working capital needs",
                                      "Financing strategy (SBA, ROBS, lender network)",
                                      "Preferred model: owner-operator, semi-absentee, or multi-unit"
                                    ].map((item, idx) => (
                                      <li key={idx} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-[#54b936] mt-0.5 flex-shrink-0" />
                                        <span className="text-muted-foreground">{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="bg-[#f4f8fe] border-l-4 border-[#54b936] p-6 rounded-lg shadow-sm">
                                  <p className="text-sm font-medium text-foreground">
                                    <strong className="text-foreground">Why it matters:</strong> Franchisors pre-screen based on financial and operational fit, this prep increases your approval odds.
                                  </p>
                                </div>
                              </AccordionContent>
                            </div>
                          </div>
                        </AccordionItem>

                        {/* Step 4 */}
                        <AccordionItem value="step-4" className="border-0">
                          <div className="relative flex gap-6">
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-[#446786] flex items-center justify-center border-4 border-white shadow-md z-10">
                                <span className="text-white font-bold text-lg">4</span>
                              </div>
                              <div className="w-0.5 h-full bg-[#dee8f2] flex-1 mt-2" />
                            </div>
                            <div className="flex-1 pt-1">
                              <AccordionTrigger className="text-left hover:no-underline p-0 [&>svg]:hidden">
                                <div className="flex-1 flex items-center gap-3">
                                  <ChevronRight className="w-5 h-5 text-[#446786] flex-shrink-0" />
                                  <p className="font-bold text-foreground">
                                    Submit the Initial Contact Form to {industryName}
                                  </p>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pt-4 pb-6 text-base text-foreground space-y-5">
                                <div>
                                  <p className="font-semibold text-foreground mb-3">You'll typically submit:</p>
                                  <ul className="space-y-2.5">
                                    {["Contact details", "Financial snapshot", "Desired territory", "Estimated launch timeline"].map((item, idx) => (
                                      <li key={idx} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-[#54b936] mt-0.5 flex-shrink-0" />
                                        <span className="text-muted-foreground">{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <p className="text-muted-foreground">This triggers your introductory call.</p>
                              </AccordionContent>
                            </div>
                          </div>
                        </AccordionItem>

                        {/* Step 5 */}
                        <AccordionItem value="step-5" className="border-0">
                          <div className="relative flex gap-6">
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-[#446786] flex items-center justify-center border-4 border-white shadow-md z-10">
                                <span className="text-white font-bold text-lg">5</span>
                              </div>
                              <div className="w-0.5 h-full bg-[#dee8f2] flex-1 mt-2" />
                            </div>
                            <div className="flex-1 pt-1">
                              <AccordionTrigger className="text-left hover:no-underline p-0 [&>svg]:hidden">
                                <div className="flex-1 flex items-center gap-3">
                                  <ChevronRight className="w-5 h-5 text-[#446786] flex-shrink-0" />
                                  <p className="font-bold text-foreground">
                                    Attend the Introductory Call With {industryName}
                                  </p>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pt-4 pb-6 text-base text-foreground space-y-5">
                                <div>
                                  <p className="font-semibold text-foreground mb-3">You'll cover:</p>
                                  <ul className="space-y-2.5">
                                    {["Business model overview", "Owner role and responsibilities", "Investment highlights", "Growth and territory strategy"].map((item, idx) => (
                                      <li key={idx} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-[#54b936] mt-0.5 flex-shrink-0" />
                                        <span className="text-muted-foreground">{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="bg-[#f4f8fe] border-l-4 border-[#54b936] p-6 rounded-lg shadow-sm">
                                  <p className="text-sm font-medium text-foreground">
                                    Inside your Franchise Grade account, we give you a "Questions to Ask the Franchisor" guide so you get meaningful answers, not marketing fluff.
                                  </p>
                                </div>
                              </AccordionContent>
                            </div>
                          </div>
                        </AccordionItem>

                        {/* Step 6 */}
                        <AccordionItem value="step-6" className="border-0">
                          <div className="relative flex gap-6">
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-[#446786] flex items-center justify-center border-4 border-white shadow-md z-10">
                                <span className="text-white font-bold text-lg">6</span>
                              </div>
                              <div className="w-0.5 h-full bg-[#dee8f2] flex-1 mt-2" />
                            </div>
                            <div className="flex-1 pt-1">
                              <AccordionTrigger className="text-left hover:no-underline p-0 [&>svg]:hidden">
                                <div className="flex-1 flex items-center gap-3">
                                  <ChevronRight className="w-5 h-5 text-[#446786] flex-shrink-0" />
                                  <p className="font-bold text-foreground">
                                    Review the Franchise Disclosure Document (FDD)
                                  </p>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pt-4 pb-6 text-base text-foreground space-y-5">
                                <div>
                                  <p className="font-semibold text-foreground mb-3">Inside your account, we help you:</p>
                                  <ul className="space-y-2.5">
                                    {["Decode Item 19 financials", "Compare unit performance", "Flag legal or operational red flags", "Gauge system scalability"].map((item, idx) => (
                                      <li key={idx} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-[#54b936] mt-0.5 flex-shrink-0" />
                                        <span className="text-muted-foreground">{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="bg-[#f4f8fe] border-l-4 border-[#54b936] p-6 rounded-lg shadow-sm">
                                  <p className="text-sm font-medium text-foreground">
                                    Use our FDD Study Guide + Advisor support to understand what most buyers overlook.
                                  </p>
                                </div>
                              </AccordionContent>
                            </div>
                          </div>
                        </AccordionItem>

                        {/* Step 7 */}
                        <AccordionItem value="step-7" className="border-0">
                          <div className="relative flex gap-6">
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-[#446786] flex items-center justify-center border-4 border-white shadow-md z-10">
                                <span className="text-white font-bold text-lg">7</span>
                              </div>
                              <div className="w-0.5 h-full bg-[#dee8f2] flex-1 mt-2" />
                            </div>
                            <div className="flex-1 pt-1">
                              <AccordionTrigger className="text-left hover:no-underline p-0 [&>svg]:hidden">
                                <div className="flex-1 flex items-center gap-3">
                                  <ChevronRight className="w-5 h-5 text-[#446786] flex-shrink-0" />
                                  <p className="font-bold text-foreground">
                                    Validate With Current Franchisees
                                  </p>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pt-4 pb-6 text-base text-foreground space-y-5">
                                <div>
                                  <p className="font-semibold text-foreground mb-3">You'll ask existing owners about:</p>
                                  <ul className="space-y-2.5">
                                    {["Ramp-up vs expectations", "Actual margins", "Support quality", "Day-to-day realities", "Whether they'd buy again"].map((item, idx) => (
                                      <li key={idx} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-[#54b936] mt-0.5 flex-shrink-0" />
                                        <span className="text-muted-foreground">{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="bg-[#f4f8fe] border-l-4 border-[#54b936] p-6 rounded-lg shadow-sm">
                                  <p className="text-sm font-medium text-foreground">
                                    Get our Franchisee Validation Question Guide to go beyond surface-level questions and uncover the full story.
                                  </p>
                                </div>
                              </AccordionContent>
                            </div>
                          </div>
                        </AccordionItem>

                        {/* Step 8 */}
                        <AccordionItem value="step-8" className="border-0">
                          <div className="relative flex gap-6">
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-[#446786] flex items-center justify-center border-4 border-white shadow-md z-10">
                                <span className="text-white font-bold text-lg">8</span>
                              </div>
                              <div className="w-0.5 h-full bg-[#dee8f2] flex-1 mt-2" />
                            </div>
                            <div className="flex-1 pt-1">
                              <AccordionTrigger className="text-left hover:no-underline p-0 [&>svg]:hidden">
                                <div className="flex-1 flex items-center gap-3">
                                  <ChevronRight className="w-5 h-5 text-[#446786] flex-shrink-0" />
                                  <p className="font-bold text-foreground">
                                    Attend Discovery Day
                                  </p>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pt-4 pb-6 text-base text-foreground space-y-5">
                                <div>
                                  <p className="font-semibold text-foreground mb-3">This is your chance to meet:</p>
                                  <ul className="space-y-2.5">
                                    {["Executive leadership", "Ops, training, and marketing teams", "Fellow candidates"].map((item, idx) => (
                                      <li key={idx} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-[#54b936] mt-0.5 flex-shrink-0" />
                                        <span className="text-muted-foreground">{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="bg-[#f4f8fe] border-l-4 border-[#54b936] p-6 rounded-lg shadow-sm">
                                  <p className="text-sm font-medium text-foreground">
                                    We provide a Discovery Day Prep Call to help you show up informed, confident, and ready to make a great impression.
                                  </p>
                                </div>
                              </AccordionContent>
                            </div>
                          </div>
                        </AccordionItem>

                        {/* Step 9 */}
                        <AccordionItem value="step-9" className="border-0">
                          <div className="relative flex gap-6">
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-[#446786] flex items-center justify-center border-4 border-white shadow-md z-10">
                                <span className="text-white font-bold text-lg">9</span>
                              </div>
                              <div className="w-0.5 h-full bg-[#dee8f2] flex-1 mt-2" />
                            </div>
                            <div className="flex-1 pt-1">
                              <AccordionTrigger className="text-left hover:no-underline p-0 [&>svg]:hidden">
                                <div className="flex-1 flex items-center gap-3">
                                  <ChevronRight className="w-5 h-5 text-[#446786] flex-shrink-0" />
                                  <p className="font-bold text-foreground">
                                    Receive Approval & Lock In Your Territory
                                  </p>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pt-4 pb-6 text-base text-foreground space-y-5">
                                <div>
                                  <p className="font-semibold text-foreground mb-3">If both sides say yes:</p>
                                  <ul className="space-y-2.5">
                                    {["You're officially approved", "You secure your desired market", "Onboarding begins"].map((item, idx) => (
                                      <li key={idx} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-[#54b936] mt-0.5 flex-shrink-0" />
                                        <span className="text-muted-foreground">{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="bg-[#f4f8fe] border-l-4 border-[#54b936] p-6 rounded-lg shadow-sm">
                                  <p className="text-sm font-medium text-foreground">
                                    Franchisors often have multiple candidates per territory, your prep sets you apart.
                                  </p>
                                </div>
                              </AccordionContent>
                            </div>
                          </div>
                        </AccordionItem>

                        {/* Step 10 */}
                        <AccordionItem value="step-10" className="border-0">
                          <div className="relative flex gap-6">
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-[#54b936] flex items-center justify-center border-4 border-white shadow-md z-10">
                                <span className="text-white font-bold text-lg">10</span>
                              </div>
                            </div>
                            <div className="flex-1 pt-1">
                              <AccordionTrigger className="text-left hover:no-underline p-0 [&>svg]:hidden">
                                <div className="flex-1 flex items-center gap-3">
                                  <ChevronRight className="w-5 h-5 text-[#446786] flex-shrink-0" />
                                  <p className="font-bold text-foreground">
                                    Sign the Franchise Agreement & Begin Training
                                  </p>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pt-4 pb-6 text-base text-foreground space-y-5">
                                <div>
                                  <p className="font-semibold text-foreground mb-3">Once signed:</p>
                                  <ul className="space-y-2.5">
                                    {["Training kicks off", "Site selection (if applicable) begins", "Pre-opening marketing starts", "Your launch timeline is set"].map((item, idx) => (
                                      <li key={idx} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-[#54b936] mt-0.5 flex-shrink-0" />
                                        <span className="text-muted-foreground">{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="bg-[#f4f8fe] border-l-4 border-[#54b936] p-6 rounded-lg shadow-sm">
                                  <p className="text-sm font-medium text-foreground">
                                    Welcome, you're now a {industryName} franchise owner.
                                  </p>
                                </div>
                              </AccordionContent>
                            </div>
                          </div>
                        </AccordionItem>
                      </Accordion>
                    </div>

                    {/* Intro Section */}
                    <div className="bg-[#163552] rounded-[20px] p-8 lg:p-10">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                        {/* Left Column - Image */}
                        <div className="rounded-[20px] overflow-hidden">
                          {categoryData.heroImage ? (
                            <img
                              src={categoryData.heroImage}
                              alt={`How to become a ${industryName} Franchise`}
                              className="w-full h-auto"
                            />
                          ) : (
                            <div className="w-full h-[400px] bg-gradient-to-br from-[#203d57] to-[#163552] rounded-[20px] flex items-center justify-center">
                              <div className="text-center text-white">
                                <Building className="w-24 h-24 mx-auto mb-4 opacity-50" />
                                <p className="text-lg">Franchise Image</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right Column - Content */}
                        <div className="space-y-4">
                          <h3 className="text-2xl font-bold text-white leading-tight">
                            How to become a {industryName} Franchise?
                          </h3>
                          <p className="text-base text-white">
                            It's not just about money.
                          </p>
                          <p className="text-base font-semibold text-white">
                            You need to be a match:
                          </p>
                          <ul className="space-y-2.5">
                            {[
                              "Geographically (open territory)",
                              "Financially (meets investment range)",
                              "Operationally (can lead a team or manage performance)",
                              "Culturally (aligns with franchisor values)"
                            ].map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                                <span className="text-base text-white">{item}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="pt-4">
                            <Button
                              size="lg"
                              className="bg-[#54b936] hover:bg-[#54b936]/90 text-white rounded-[30px] px-8 py-6 text-base font-bold"
                              asChild
                            >
                              <Link to="/best-franchises">Talk to an advisor</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* FAQs Section */}
            <div
              ref={(el) => (sectionRefs.current["faqs"] = el)}
              className="mb-16 max-w-[1136px] mx-auto"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-3 w-full mb-8">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-6 h-6 text-[#203d57] flex-shrink-0" />
                  <h3 className="text-2xl font-bold text-foreground">FAQs</h3>
                </div>
              </div>

              {/* FAQs Accordion */}
              {(() => {
                const industryName = categoryData.name || "Franchise";
                const investmentLow = formatCurrency(categoryData.stats.totalInvestment.min);
                const investmentHigh = formatCurrency(categoryData.stats.totalInvestment.max);

                return (
                  <Accordion type="single" collapsible className="w-full space-y-2">
                    {/* FAQ 1: How much does a {Industry} franchise cost? */}
                    <AccordionItem value="faq-1" className="border border-[#A4C6E8] rounded-[12px] px-4 py-2">
                      <AccordionTrigger className="text-left hover:no-underline py-3">
                        <p className="font-bold text-foreground text-base">
                          How much does a {industryName} franchise cost?
                        </p>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <p className="text-base text-foreground">
                          Investment range: {investmentLow} - {investmentHigh}.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    {/* FAQ 2: Do I need experience? */}
                    <AccordionItem value="faq-2" className="border border-[#A4C6E8] rounded-[12px] px-4 py-2">
                      <AccordionTrigger className="text-left hover:no-underline py-3">
                        <p className="font-bold text-foreground text-base">
                          Do I need experience?
                        </p>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <p className="text-base text-foreground">
                          No. Most owners come from management, operations, or sales backgrounds.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    {/* FAQ 3: How long does it take to open? */}
                    <AccordionItem value="faq-3" className="border border-[#A4C6E8] rounded-[12px] px-4 py-2">
                      <AccordionTrigger className="text-left hover:no-underline py-3">
                        <p className="font-bold text-foreground text-base">
                          How long does it take to open?
                        </p>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <p className="text-base text-foreground">
                          Typical timeline: 4–9 months, depending on location and setup.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    {/* FAQ 4: Is my area available? */}
                    <AccordionItem value="faq-4" className="border border-[#A4C6E8] rounded-[12px] px-4 py-2">
                      <AccordionTrigger className="text-left hover:no-underline py-3">
                        <p className="font-bold text-foreground text-base">
                          Is my area available?
                        </p>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4 space-y-3">
                        <p className="text-base text-foreground">
                          Availability varies, check your ZIP inside your account.
                        </p>
                        <Button className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-6 py-2 text-base font-bold text-white w-full sm:w-auto" asChild>
                          <Link to="/best-franchises">Check your ZIP availability</Link>
                        </Button>
                      </AccordionContent>
                    </AccordionItem>

                    {/* FAQ 5: What happens after you sign the franchise agreement? */}
                    <AccordionItem value="faq-5" className="border border-[#A4C6E8] rounded-[12px] px-4 py-2">
                      <AccordionTrigger className="text-left hover:no-underline py-3">
                        <p className="font-bold text-foreground text-base">
                          What happens after you sign the franchise agreement?
                        </p>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <p className="text-base text-foreground">
                          Training begins, onboarding starts, and your setup timeline is confirmed.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    {/* FAQ 6: How do I become a {industry} franchise owner? */}
                    <AccordionItem value="faq-6" className="border border-[#A4C6E8] rounded-[12px] px-4 py-2">
                      <AccordionTrigger className="text-left hover:no-underline py-3">
                        <p className="font-bold text-foreground text-base">
                          How do I become a {industryName} franchise owner?
                        </p>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <p className="text-base text-foreground">
                          Follow the evaluation steps, confirm territory, speak to the franchisor, and complete the approval process.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    {/* FAQ 7: How do I complete the {industry} application? */}
                    <AccordionItem value="faq-7" className="border border-[#A4C6E8] rounded-[12px] px-4 py-2">
                      <AccordionTrigger className="text-left hover:no-underline py-3">
                        <p className="font-bold text-foreground text-base">
                          How do I complete the {industryName} application?
                        </p>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4 space-y-3">
                        <p className="text-base text-foreground">
                          We guide you through what to include, what to avoid, and how to present your profile clearly.
                        </p>
                        <Button className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-6 py-2 text-base font-bold text-white w-full sm:w-auto" asChild>
                          <Link to="/best-franchises">Talk to an advisor</Link>
                        </Button>
                      </AccordionContent>
                    </AccordionItem>

                    {/* FAQ 8: I've reached out but haven't heard back from {industry}. Why? */}
                    <AccordionItem value="faq-8" className="border border-[#A4C6E8] rounded-[12px] px-4 py-2">
                      <AccordionTrigger className="text-left hover:no-underline py-3">
                        <p className="font-bold text-foreground text-base">
                          I've reached out but haven't heard back from {industryName}. Why?
                        </p>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4 space-y-3">
                        <p className="text-base text-foreground">
                          Brands prioritize prepared, qualified candidates. We help you present yourself properly.
                        </p>
                        <Button className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-6 py-2 text-base font-bold text-white w-full sm:w-auto" asChild>
                          <Link to="/best-franchises">Talk to an advisor</Link>
                        </Button>
                      </AccordionContent>
                    </AccordionItem>

                    {/* FAQ 9: Why do franchisors reject candidates? */}
                    <AccordionItem value="faq-9" className="border border-[#A4C6E8] rounded-[12px] px-4 py-2">
                      <AccordionTrigger className="text-left hover:no-underline py-3">
                        <p className="font-bold text-foreground text-base">
                          Why do franchisors reject candidates?
                        </p>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <p className="text-base text-foreground">
                          Financial mismatch, unclear motivation, or lack of understanding of the model. We help you avoid these issues early.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    {/* FAQ 10: What do buyers get wrong during the franchise process? */}
                    <AccordionItem value="faq-10" className="border border-[#A4C6E8] rounded-[12px] px-4 py-2">
                      <AccordionTrigger className="text-left hover:no-underline py-3">
                        <p className="font-bold text-foreground text-base">
                          What do buyers get wrong during the franchise process?
                        </p>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <p className="text-base text-foreground">
                          Most rush through validation, ignore turnover data, or rely on marketing. We help you focus on facts.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    {/* FAQ 11: How does Franchise Grade help through each phase? */}
                    <AccordionItem value="faq-11" className="border border-[#A4C6E8] rounded-[12px] px-4 py-2">
                      <AccordionTrigger className="text-left hover:no-underline py-3">
                        <p className="font-bold text-foreground text-base">
                          How does Franchise Grade help through each phase?
                        </p>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <p className="text-base text-foreground">
                          Fit, evaluation, FDD, validation, territory planning, and decision, start to finish.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    {/* FAQ 12: How much does FranchiseGrade charge for its advisory services? */}
                    <AccordionItem value="faq-12" className="border border-[#A4C6E8] rounded-[12px] px-4 py-2">
                      <AccordionTrigger className="text-left hover:no-underline py-3">
                        <p className="font-bold text-foreground text-base">
                          How much does FranchiseGrade charge for its advisory services?
                        </p>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <p className="text-base text-foreground">
                          FranchiseGrade does not charge investors for advisory services. Our fees are paid by the franchisor, allowing us to guide you through the process at no cost to you.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              })()}
            </div>

          </div>
        </div>
      </main>
      <Footer 
        customCTA={
          <>
            <h3 className="text-2xl font-normal text-white mb-4 text-center">
              Ready to Start Your Journey?
            </h3>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto text-center">
              Join thousands of successful franchise owners who chose {categoryData.name} franchises. Get started today and take the first step toward building your future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#54b936] hover:bg-[#54b936]/90 text-white rounded-[30px] px-8 py-6 text-base font-bold"
              >
                Find Franchises in this Industry
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-[30px] px-8 py-6 text-base font-bold"
              >
                Talk to a Franchise Industry Advisor
              </Button>
            </div>
          </>
        }
      />
    </div>
  );
}

