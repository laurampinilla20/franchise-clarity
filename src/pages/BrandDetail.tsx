import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  DollarSign,
  BarChart3,
  PieChart,
  FileText,
  MapPin,
  Lock,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { fetchBrandBySlug, type BrandData } from "@/api/brands";

const sections = [
  { id: "snapshot", label: "Snapshot" },
  { id: "investment", label: "Investment" },
  { id: "profitability", label: "Profitability" },
  { id: "comparison", label: "Comparison" },
  { id: "territories", label: "Territories" },
  { id: "requirements", label: "Requirements" },
  { id: "next-steps", label: "Next Steps" },
  { id: "faqs", label: "FAQs" },
];

export default function BrandDetail() {
  const { slug } = useParams();
  const [activeSection, setActiveSection] = useState("snapshot");
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const navRef = useRef<HTMLDivElement>(null);
  const advisorCardBottomRef = useRef<HTMLDivElement>(null);
  const [isNavSticky, setIsNavSticky] = useState(false);
  const isNavStickyRef = useRef(false);
  const [isAdvisorCardBottomSticky, setIsAdvisorCardBottomSticky] = useState(false);
  
  // Brand data state
  const [currentBrandData, setCurrentBrandData] = useState<BrandData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch brand data when slug changes - slug is the single source of truth
  // This effect handles both resetting state and loading new data when slug changes
  useEffect(() => {
    // Reset component state when slug changes to ensure full re-render
    setActiveSection("snapshot");
    setIsNavSticky(false);
    setIsAdvisorCardBottomSticky(false);
    setCurrentBrandData(null);
    setError(null);

    const loadBrandData = async () => {
      // Don't fetch if slug is not available - no default brand assumption
      if (!slug) {
        setError('Brand slug is required');
        setIsLoading(false);
        setCurrentBrandData(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchBrandBySlug(slug);
        setCurrentBrandData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load brand data');
        setCurrentBrandData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadBrandData();
  }, [slug]);

  // Keep ref in sync with state for use in handleScroll closure
  useEffect(() => {
    isNavStickyRef.current = isNavSticky;
  }, [isNavSticky]);

  useEffect(() => {
    const handleScroll = () => {
      // Check if nav should be sticky
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect();
        setIsNavSticky(rect.top <= 64);
      }

      // Check if second advisor card should be sticky (only on desktop/iPad - lg breakpoint)
      // Calculate top offset: navbar (64px) + nav bar height (if sticky, ~56px with padding) + 12px gap = 132px when nav is sticky, or 76px when nav is not sticky
      const stickyNavHeight = isNavStickyRef.current ? 56 : 0; // Approximate nav bar height with padding
      const stickyTopOffset = 64 + stickyNavHeight + 12; // navbar + sticky nav + 12px gap
      
      if (window.innerWidth >= 1024) {
        if (advisorCardBottomRef.current) {
          const rect = advisorCardBottomRef.current.getBoundingClientRect();
          setIsAdvisorCardBottomSticky(rect.top <= stickyTopOffset);
        }
      } else {
        setIsAdvisorCardBottomSticky(false);
      }

      // Update active section based on scroll position
      const scrollPosition = window.scrollY + 200; // Offset for navbar + nav bar
      
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
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

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

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  // Memoized investment pie chart data
  const investmentPieData = useMemo(() => {
    if (!currentBrandData) return [];
    
    const investment = currentBrandData.investment;
    return [
      {
        name: "Franchise Fee",
        value: investment.franchiseFee || 0,
        color: "#446786",
      },
      {
        name: "Working Capital",
        value: investment.workingCapital || 0,
        color: "#54b936",
      },
      {
        name: "Other startup costs",
        value: Math.max(
          (investment.min || 0) -
            (investment.franchiseFee || 0) -
            (investment.workingCapital || 0),
          0
        ),
        color: "#a4c6e8",
      },
    ];
  }, [currentBrandData]);

  // Memoized royalty comparison chart data
  const royaltyComparisonData = useMemo(() => {
    if (!currentBrandData) return [];
    
    return [
      { 
        name: "Royalty Rate", 
        brand: parseFloat((currentBrandData.investment.royalty || "0%").replace('%', '')),
        competitors: currentBrandData.competitorsRoyaltyRate || 6
      },
    ];
  }, [currentBrandData]);

  // Memoized initial term comparison chart data
  const initialTermComparisonData = useMemo(() => {
    if (!currentBrandData) return [];
    
    return [
      { 
        name: "Initial Term (Years)", 
        brand: parseInt((currentBrandData.investment.initialTerm || "0 Years").replace(' Years', '')),
        competitors: currentBrandData.competitorsInitialTerm || 15
      },
    ];
  }, [currentBrandData]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 pt-16 w-full">
          <div className="bg-white w-full">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-base text-muted-foreground">Loading brand information...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error || !currentBrandData) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 pt-16 w-full">
          <div className="bg-white w-full">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-base text-muted-foreground">
                  {error || 'Brand not found'}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16 w-full">
        <div className="bg-white w-full">
        {/* Sticky Navigation */}
        <div
          ref={navRef}
          className={`w-full bg-white transition-all ${
            isNavSticky 
              ? "sticky top-16 z-40" 
              : ""
          }`}
        >
          <div className="flex items-center gap-8 overflow-x-auto border-b border-[#dee8f2] pb-2 scrollbar-hide px-4 sm:px-6 lg:px-8 max-w-[1270px] mx-auto w-full">
          <button
            onClick={() => scrollToSection("snapshot")}
            className={`px-[14px] py-[6px] rounded-[30px] text-sm transition-all whitespace-nowrap flex-shrink-0 ${
              activeSection === "snapshot"
                ? "bg-[#203d57] text-white font-bold"
                : "bg-transparent border border-[#4f7aa5]/50 text-[#4f7aa5] font-normal"
            }`}
          >
            Snapshot
          </button>
          {sections.slice(1).map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`px-[14px] py-[6px] rounded-[30px] text-sm transition-all whitespace-nowrap flex-shrink-0 ${
                activeSection === section.id
                  ? "bg-[#203d57] text-white font-bold"
                  : "bg-transparent border border-[#4f7aa5]/50 text-[#4f7aa5] font-normal"
              }`}
            >
              {section.label}
            </button>
          ))}
          </div>
        </div>

        {/* Main Content - Mobile: Single flex column with all items, Desktop: Two columns */}
        <div className="flex flex-col gap-5 pb-8 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 max-w-[1270px] mx-auto w-full lg:flex-row lg:gap-6 lg:gap-8">
          {/* Mobile: All content flows in single column, Desktop: Left Column */}
          <div className="contents lg:flex lg:flex-col gap-5 flex-1 w-full lg:w-1/2">
            {/* Franchise Review Card */}
            <div className="bg-[#f4f8fe] flex flex-col rounded-[20px] order-1">
              <div className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col">
                {/* Image */}
                <div className="h-[180px] sm:h-[200px] lg:h-[220px] rounded-t-[20px] bg-gradient-to-br from-[#446786] to-[#4f7aa5] relative">
                  {/* Grade Badge */}
                  <div className="absolute right-4 sm:right-6 lg:right-8 bottom-[-50px] sm:bottom-[-56px] lg:bottom-[-62px] flex flex-col items-center">
                    <div className="bg-white border-[4.493px] border-[#dee8f2] rounded-full size-[100px] sm:size-[112px] lg:size-[124px] flex items-center justify-center">
                      <div className="flex flex-col items-center text-center">
                        <div className="text-[58px] sm:text-[64px] lg:text-[71.884px] font-extrabold leading-none text-[#446786]">
                          {currentBrandData.grade || "?"}
                        </div>
                        <p className="text-xs sm:text-sm lg:text-[14.377px] font-medium text-foreground">GRADE</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 lg:p-8 pt-0 flex flex-col gap-5">
                  <div className="flex gap-5">
                    <div className="flex flex-col gap-2 flex-1">
                      <p className="text-sm sm:text-base font-bold text-foreground">Franchise Review</p>
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{currentBrandData.name}</h1>
                      <p className="text-sm sm:text-base font-normal text-foreground">
                        Franchise Cost, Profitability & Investment
                      </p>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="flex flex-wrap sm:flex-nowrap gap-4 sm:gap-8 lg:gap-16 items-center">
                    <div className="flex gap-2 items-center">
                      <div className="bg-[#a6a6a6] h-[68px] w-[2px] rounded-full" />
                      <div className="flex flex-col gap-1 px-1 py-5">
                        <p className="text-2xl font-bold text-left">
                          {formatCurrency(currentBrandData.investment.min)}
                        </p>
                        <p className="text-base font-normal">Investment starts at</p>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="bg-[#a6a6a6] h-[68px] w-[2px] rounded-full" />
                      <div className="flex flex-col gap-1 px-1 py-5">
                        <p className="text-2xl font-bold text-left">{currentBrandData.locations || 0}+</p>
                        <p className="text-base font-normal">Locations</p>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="bg-[#a6a6a6] h-[68px] w-[2px] rounded-full" />
                      <div className="flex flex-col gap-1 justify-center">
                        <p className="text-2xl font-bold">{currentBrandData.item19Disclosed || "N/A"}</p>
                        <p className="text-base font-normal">Item 19 Disclosure</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-stretch sm:items-start">
                    <Button className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-5 py-2 text-base font-bold text-white">
                      Unlock for the Full Report
                    </Button>
                    <Button
                      variant="outline"
                      className="border-foreground rounded-[30px] px-5 py-2 text-base font-bold text-foreground"
                    >
                      Compare to similar franchises
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Snapshot Section */}
            <div
              ref={(el) => (sectionRefs.current.snapshot = el)}
              className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col gap-5 p-4 sm:p-6 lg:p-8 order-2"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-[#203d57]" />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Snapshot</h2>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-base font-normal text-foreground mb-4">
                  {currentBrandData.snapshot || `Learn more about ${currentBrandData.name} franchise opportunities.`}
                </p>
                <p className="text-base font-bold text-foreground mb-4">Franchise Facts & Key Statistics</p>
              </div>

              {/* Facts List */}
              <div className="flex flex-col items-start gap-1">
                {[
                  { label: "Total Investment:", value: `${formatCurrency(currentBrandData.investment.min)} - ${formatCurrency(currentBrandData.investment.max)}` },
                  { label: "Founded:", value: currentBrandData.founded || "N/A" },
                  { label: "Franchised Since:", value: currentBrandData.franchisedSince || "N/A" },
                  { label: "Item 19 Disclosed:", value: `${currentBrandData.locations || 0}+` },
                  { label: "Sector:", value: currentBrandData.sector || "N/A", highlight: true },
                  { label: "Category:", value: currentBrandData.category || "N/A", highlight: true },
                ].map((fact, index) => (
                  <div key={index} className="bg-white flex gap-2 items-center justify-center pl-0 pr-6 py-1 rounded-[30px]">
                    <img src="/check-filled.svg" alt="" className="w-4 h-4 flex-shrink-0" />
                    <p className="text-base font-normal text-foreground">
                      <span className="font-bold">{fact.label}</span>{" "}
                      <span className={fact.highlight ? "underline text-[#54b936]" : ""}>{fact.value}</span>
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-base font-normal text-foreground">
                The initial cost of a franchise includes several fees --{" "}
                <Link to="/unlock" className="font-bold text-[#54b936] underline">
                  Unlock this franchise
                </Link>{" "}
                to better understand the costs such as training and territory fees.{" "}
                <span className="font-bold">Sign Up to Unlock Full Cost Breakdown:</span>
              </p>

              <Button className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-5 py-2 text-base font-bold text-white w-fit">
                Unlock for the Full Report
              </Button>

              <div className="flex flex-col gap-5">
                <p className="text-lg font-bold">Top Advantages</p>
                <p className="text-base font-normal text-foreground">
                  {currentBrandData.topAdvantages || `${currentBrandData.name} stands out because it's a recognizable brand in a growing category, supported by years of steady system performance. Buyers appreciate the structured onboarding, predictable startup path, and long-term stability indicators. Its model works well for owners who want a reliable business with strong support from day one.`}
                  <br />
                  <br />
                  This franchise is expanding into new markets and might be available near you. One of our franchise experts will have detailed knowledge about this brand.{" "}
                  <Link to="/unlock" className="font-bold text-[#54b936] underline">
                    Unlock to learn more
                  </Link>{" "}
                  and connect with our experts.
                </p>
              </div>
            </div>

            {/* Investment Overview Section */}
            <div
              ref={(el) => (sectionRefs.current.investment = el)}
              className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col gap-4 p-4 sm:p-6 lg:p-8 order-4"
            >
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-[#203d57]" />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Investment Overview</h2>
              </div>
              
              <div className="text-base font-normal text-foreground w-full">
                <p className="font-bold mb-2">How much does a {currentBrandData.name} franchise cost?</p>
                <p>
                  The initial cost of a franchise includes several fees --{" "}
                  <Link to="/unlock" className="font-bold text-[#54b936] underline">
                    Unlock this franchise
                  </Link>{" "}
                  to better understand the costs such as training and territory fees.
                </p>
              </div>
              
              {/* Investment Content: Cards on left, Chart on right */}
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Left side: Data Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 flex-1 w-full lg:w-auto">
                {/* Total Investment */}
                <div className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col items-start justify-center p-3 w-full">
                  <div className="flex flex-col gap-2 items-start justify-center w-full">
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: "#a4c6e8" }} />
                      <p className="text-sm sm:text-base font-bold text-foreground">Total Investment</p>
                    </div>
                    <div className="flex gap-2 items-baseline">
                      <p className="text-[23.855px] font-normal text-foreground">{formatCurrency(currentBrandData.investment.min)}</p>
                      <p className="text-base font-normal text-foreground">-</p>
                      <p className="text-[23.855px] font-normal text-foreground">{formatCurrency(currentBrandData.investment.max)}</p>
                    </div>
                  </div>
                </div>

                {/* Franchise Fee */}
                <div className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col items-start justify-center p-3 w-full">
                  <div className="flex flex-col gap-2 items-start justify-center w-full">
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: "#446786" }} />
                      <p className="text-sm sm:text-base font-bold text-foreground">Franchise Fee</p>
                    </div>
                    <p className="text-[23.855px] font-normal text-foreground">{formatCurrency(currentBrandData.investment.franchiseFee)}</p>
                  </div>
                </div>

                {/* Working Capital */}
                <div className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col items-start justify-center p-3 w-full">
                  <div className="flex flex-col gap-2 items-start justify-center w-full">
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: "#54b936" }} />
                      <p className="text-sm sm:text-base font-bold text-foreground">Working Capital</p>
                    </div>
                    <p className="text-[23.855px] font-normal text-foreground">{formatCurrency(currentBrandData.investment.workingCapital)}</p>
                  </div>
                </div>

                </div>

                {/* Right side: Investment Breakdown Chart */}
                <div className="w-full lg:w-[400px] lg:flex-shrink-0 h-[300px] sm:h-[350px] lg:h-[350px]">
                  <ChartContainer
                    config={{
                      franchiseFee: { label: "Franchise Fee", color: "#446786" },
                      workingCapital: { label: "Working Capital", color: "#54b936" },
                      otherCosts: { label: "Other Startup Costs", color: "#a4c6e8" },
                    }}
                    className="h-full w-full"
                  >
                    <RechartsPieChart>
                      <Pie
                        data={investmentPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="#ffffff"
                        strokeWidth={2}
                      >
                        {investmentPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </RechartsPieChart>
                  </ChartContainer>
                </div>
              </div>

              {/* Additional Investment Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Ongoing Fees */}
                <div className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col items-start justify-center px-4 sm:px-6 lg:px-[29px] py-6 sm:py-8 w-full">
                  <div className="flex flex-col gap-2 items-start justify-center w-full">
                    <p className="text-sm sm:text-base font-bold text-foreground w-full">Ongoing Fees</p>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start w-full">
                      <div className="flex flex-col items-start">
                        <p className="text-[23.855px] font-normal text-foreground">{currentBrandData.investment.royalty || "N/A"}</p>
                        <p className="text-base font-bold text-[#4f7aa5]">Royalty Fees</p>
                      </div>
                      <div className="border-t-2 sm:border-t-0 sm:border-l-2 border-[#dee8f2] flex flex-col items-start pt-4 sm:pt-0 sm:pl-8 w-full sm:w-auto">
                        <p className="text-[23.855px] font-normal text-foreground">{currentBrandData.investment.marketing || "N/A"}</p>
                        <p className="text-base font-bold text-[#4f7aa5]">Marketing Fees</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Franchise Agreement */}
                <div className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col items-start justify-center px-4 sm:px-6 lg:px-[29px] py-6 sm:py-8 w-full">
                  <div className="flex flex-col gap-2 items-start justify-center w-full">
                    <p className="text-sm sm:text-base font-bold text-foreground w-full">Franchise Agreement</p>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start w-full">
                      <div className="flex flex-col items-start">
                        <p className="text-[23.855px] font-normal text-foreground">{currentBrandData.investment.initialTerm || "N/A"}</p>
                        <p className="text-base font-bold text-[#4f7aa5]">Initial Term</p>
                      </div>
                      <div className="border-t-2 sm:border-t-0 sm:border-l-2 border-[#dee8f2] flex flex-col items-start pt-4 sm:pt-0 sm:pl-8 w-full sm:w-auto">
                        <p className="text-[23.855px] font-normal text-foreground">{currentBrandData.investment.renewalTerm || "N/A"}</p>
                        <p className="text-base font-bold text-[#4f7aa5]">Renewal Term</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profitability Section */}
            <div
              ref={(el) => (sectionRefs.current.profitability = el)}
              className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col gap-6 p-4 sm:p-6 lg:p-8 lg:order-[16] order-[16]"
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-[#203d57]" />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Profitability & Earnings</h2>
              </div>
              
              <div className="text-base font-normal text-foreground w-full">
                <p className="font-bold mb-2">How much does a {currentBrandData.name} franchise make?</p>
                <p>
                  Franchise revenue and profits depend on a number of unique variables, including local demand for your product, labor costs, commercial lease rates and several other factors. We can help you figure out how much money you can make by reviewing your specific situation. Please{" "}
                  <Link to="/unlock" className="font-bold text-[#54b936] underline">
                    unlock this franchise
                  </Link>{" "}
                  for more information.
                </p>
              </div>
              
              {/* Profitability Metrics - 3 boxes aligned */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                {/* Item 19 Disclosure */}
                <div className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col items-start justify-center px-4 sm:px-6 lg:px-[29px] py-6 sm:py-8 w-full">
                  <div className="flex flex-col gap-2 items-start justify-center w-full">
                    <p className="text-sm sm:text-base font-bold text-foreground w-full">Item 19 Disclosure</p>
                    <p className="text-[23.855px] font-normal text-foreground">{currentBrandData.profitability?.item19Disclosed || "N/A"}</p>
                  </div>
                </div>

                {/* Benchmark */}
                <div className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col items-start justify-center px-4 sm:px-6 lg:px-[29px] py-6 sm:py-8 w-full">
                  <div className="flex flex-col gap-2 items-start justify-center w-full">
                    <p className="text-sm sm:text-base font-bold text-foreground w-full">Benchmark vs Category</p>
                    <p className="text-[23.855px] font-normal text-foreground">{currentBrandData.profitability?.benchmarkVsCategory || "N/A"}</p>
                  </div>
                </div>

                {/* Owner Workload Impact */}
                <div className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col items-start justify-center px-4 sm:px-6 lg:px-[29px] py-6 sm:py-8 w-full">
                  <div className="flex flex-col gap-2 items-start justify-center w-full">
                    <p className="text-sm sm:text-base font-bold text-foreground w-full">Owner Workload Impact</p>
                    <p className="text-[23.855px] font-normal text-foreground">{currentBrandData.profitability?.ownerWorkloadImpact || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Section */}
            <div
              ref={(el) => (sectionRefs.current.comparison = el)}
              className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col gap-6 p-4 sm:p-6 lg:p-8 order-10"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-6 sm:gap-4">
                <div className="flex flex-col gap-4 sm:gap-5 items-start w-full sm:max-w-[488px]">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-[#203d57]" />
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">Comparison & Analysis</h2>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-foreground">Where {currentBrandData.name} stands out:</p>
                  
                  <div className="flex flex-col items-start w-full">
                    {(currentBrandData.comparisonStrengths || [
                      "Performs above category benchmarks in {top strengths}",
                      "Stronger growth and more consistent performance in {top strengths}",
                      "Lower risk indicators than similar brands in {top strengths}",
                    ]).map((item, index) => (
                      <div key={index} className="bg-transparent flex gap-2 items-center pl-2 sm:pl-4 pr-4 sm:pr-6 py-2 rounded-[30px] w-full">
                        <img src="/check-filled.svg" alt="" className="w-4 h-4 flex-shrink-0" />
                        <p className="text-sm sm:text-base font-normal text-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6 items-start w-full">
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  {currentBrandData.industryBenchmarking || `${currentBrandData.category || "Industry"} Benchmarking`}
                </h3>
                
                {/* Royalty Comparison Chart */}
                <div className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col gap-4 p-4 sm:p-6 w-full">
                  <p className="text-base sm:text-lg font-bold text-foreground">Royalty Rate</p>
                  <ChartContainer
                    config={{
                      brand: {
                        label: currentBrandData.name,
                        color: "#446786",
                      },
                      competitors: {
                        label: "Competitors",
                        color: "#54b936",
                      },
                    }}
                    className="h-[200px] sm:h-[250px] w-full"
                  >
                    <BarChart
                      data={royaltyComparisonData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#dee8f2" />
                      <XAxis dataKey="name" stroke="#8c9aa5" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#8c9aa5" style={{ fontSize: '12px' }} domain={[0, 8]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="brand" fill="#446786" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="competitors" fill="#54b936" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                  <p className="text-sm text-muted-foreground">Note(s): {currentBrandData.investment.royalty || "N/A"} of Gross Revenues</p>
                </div>

                {/* Initial Term Comparison Chart */}
                <div className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col gap-4 p-4 sm:p-6 w-full">
                  <p className="text-base sm:text-lg font-bold text-foreground">Initial Term</p>
                  <ChartContainer
                    config={{
                      brand: {
                        label: currentBrandData.name,
                        color: "#446786",
                      },
                      competitors: {
                        label: "Competitors",
                        color: "#54b936",
                      },
                    }}
                    className="h-[200px] sm:h-[250px] w-full"
                  >
                    <BarChart
                      data={initialTermComparisonData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#dee8f2" />
                      <XAxis dataKey="name" stroke="#8c9aa5" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#8c9aa5" style={{ fontSize: '12px' }} domain={[0, 25]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="brand" fill="#446786" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="competitors" fill="#54b936" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                  <p className="text-sm text-muted-foreground">Note(s): {currentBrandData.investment.initialTerm || "N/A"}</p>
                </div>

                {/* Unlock CTA */}
                <Button className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-8 py-2 text-base font-bold text-white w-full">
                  Unlock to see the complete comparison
                </Button>
              </div>

              <div className="text-base font-normal text-foreground w-full">
                <p className="font-bold">What buyers compare most</p>
                <p>
                  <br />
                  Buyers commonly look at how {currentBrandData.name} stacks up against direct competitors, focusing on cost structure, transparency, growth quality, long-term stability, and territory availability.
                  <br />
                  <br />
                  A brand that performs well across these areas typically attracts more serious candidates and offers a more predictable ownership experience.
                </p>
              </div>
            </div>

            {/* Territories Section */}
            <div
              ref={(el) => (sectionRefs.current.territories = el)}
              className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col gap-5 p-4 sm:p-6 lg:p-8 order-12"
            >
              <div className="flex flex-col sm:flex-row gap-5 items-start w-full">
                <div className="flex flex-col gap-5 items-start w-full sm:w-2/3">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-[#203d57]" />
                    <h2 className="text-2xl font-bold text-foreground">Available Territories</h2>
                  </div>
                  <div className="flex flex-col gap-3 items-start text-base text-foreground w-full">
                    <p className="font-bold w-full">What makes a strong territory</p>
                    <p className="font-normal leading-6 w-full">
                      A strong franchise territory blends ideal demographics, good visibility, low saturation, and strong demand trends. These factors influence how quickly a location ramps up, how stable it becomes, and how well it performs over time.
                    </p>
                  </div>
                </div>
                <div className="w-full sm:w-1/3 flex-shrink-0">
                  <img 
                    src="https://mvp.franchisegrade.com/hubfs/Website/Location/us-map.png" 
                    alt="US Map" 
                    className="w-full h-auto object-contain rounded-[30px]"
                  />
                </div>
              </div>

              <div className="text-base font-normal text-foreground w-full">
                <p className="font-bold mb-4">How many franchise locations do they have?</p>
                <p className="mb-4">
                  As of the {currentBrandData.territories?.fddYear || 2024} Franchise Disclosure Document, there {currentBrandData.territories?.locationsInUSA ? `are ${currentBrandData.territories.locationsInUSA} franchised` : 'are franchised'} {currentBrandData.name} locations in the USA.
                  <br />
                  <br />
                </p>
                <p className="font-bold mb-4">Are there any {currentBrandData.name} franchise opportunities near me?</p>
                <p className="mb-4">
                  Based on {currentBrandData.territories?.fddYear || 2024} FDD data, {currentBrandData.name} has franchise locations in {currentBrandData.territories?.statesWithLocations || 0} {(currentBrandData.territories?.statesWithLocations || 0) === 1 ? 'state' : 'states'}. {currentBrandData.territories?.largestRegion ? `The largest region is the ${currentBrandData.territories.largestRegion} with ${currentBrandData.territories.regionLocationsCount || 0} franchise locations.` : ''}
                </p>
                <p>
                  <br />
                  This franchise is expanding into new markets and might be available near you. One of our franchise experts will have detailed knowledge about this brand.{" "}
                  <Link to="/unlock" className="font-bold text-[#54b936] underline">
                    Unlock to learn more
                  </Link>{" "}
                  and connect with our experts.
                </p>
              </div>
            </div>

            {/* Requirements Section - Placeholder */}
            <div
              ref={(el) => (sectionRefs.current.requirements = el)}
              className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col gap-5 p-4 sm:p-6 lg:p-8 order-13"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <Lock className="w-6 h-6 text-[#203d57]" />
                  <h2 className="text-2xl font-bold text-foreground">Requirements</h2>
                </div>
                <Button className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-5 py-2 text-base font-bold text-white">
                  Unlock This Brand
                </Button>
              </div>
              {/* Add requirements content here */}
            </div>

            {/* Next Steps Section - Placeholder */}
            <div
              ref={(el) => (sectionRefs.current["next-steps"] = el)}
              className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col gap-5 p-4 sm:p-6 lg:p-8 order-14"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <Lock className="w-6 h-6 text-[#203d57]" />
                  <h2 className="text-2xl font-bold text-foreground">Next Steps</h2>
                </div>
                <Button className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-5 py-2 text-base font-bold text-white">
                  Unlock This Brand
                </Button>
              </div>
              {/* Add next steps content here */}
            </div>

            {/* FAQs Section - Placeholder */}
            <div
              ref={(el) => (sectionRefs.current.faqs = el)}
              className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col gap-5 p-4 sm:p-6 lg:p-8 order-15"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <Lock className="w-6 h-6 text-[#203d57]" />
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">Additional Questions</h2>
                </div>
                <Button className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-5 py-2 text-base font-bold text-white">
                  Unlock This Brand
                </Button>
              </div>
              {/* Add FAQs content here */}
            </div>
          </div>

          {/* Mobile: Same wrapper (content flows after left), Desktop: Right Column */}
          <div className="contents lg:flex lg:flex-col gap-5 items-start justify-start w-full lg:w-1/2">
            {/* Talk to Advisor Card */}
            <div className="bg-[#203d57] flex flex-col items-start px-[29px] py-8 rounded-[20px] w-full lg:order-3 order-3">
              <div className="flex flex-col gap-8 items-center justify-center w-full">
                <div className="flex flex-col gap-5 items-center w-full">
                  {/* Profile Images */}
                  <div className="flex items-center justify-center w-full">
                    <img 
                      src="https://mvp.franchisegrade.com/hubfs/Website/Home/best-advisors-franchises.png" 
                      alt="Best Advisors" 
                      className="w-[220px] h-auto object-contain"
                    />
                  </div>
                  <p className="text-2xl text-center text-white max-w-[375px]">
                    <span className="font-bold">Leave it to the experts,</span>
                    <span> a wrong choice could cost you thousands</span>
                  </p>
                </div>
                <Button className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-8 py-2 text-base font-bold text-white w-full">
                  Talk With an Advisor
                </Button>
              </div>
            </div>

            {/* Why buyers like this brand */}
            <div className="bg-[#fdfdfd] border-2 border-[#dee8f2] flex flex-col gap-2 items-start px-[29px] py-8 rounded-[20px] w-full lg:order-5 order-5">
              <p className="text-lg font-bold text-foreground">Why buyers like this brand</p>
              {(currentBrandData.whyBuyersLike || []).map((item, index) => (
                <div key={index} className="w-full">
                  <div className="bg-white flex gap-2 items-center justify-start pl-0 pr-6 py-1 rounded-[30px] w-full">
                    <img src="/check-filled.svg" alt="" className="w-4 h-4 flex-shrink-0" />
                    <p className="text-base font-normal text-left text-foreground">{item}</p>
                  </div>
                  {index < (currentBrandData.whyBuyersLike?.length || 0) - 1 && (
                    <div className="h-px w-full bg-[#dee8f2]" />
                  )}
                </div>
              ))}
            </div>

            {/* Similar Brands */}
            <div className="bg-[#fdfdfd] border-2 border-[#dee8f2] flex flex-col gap-2 items-start px-[29px] py-8 rounded-[20px] w-full lg:order-7 order-7">
              <p className="text-lg font-bold text-foreground">Similar Brands</p>
              {(currentBrandData.similarBrands || []).map((brand, index) => (
                <div key={index} className="w-full">
                  <div className="bg-white flex gap-5 items-start pl-0 pr-6 py-1 rounded-[30px] w-full">
                    <div className="size-[66px] rounded-full flex-shrink-0" style={{ backgroundColor: brand.logoColor || "#dee8f2" }} />
                    <div className="flex flex-col gap-5 items-start justify-center flex-1 max-w-[293px]">
                      <div className="text-base text-foreground">
                        <p className="font-bold mb-0">{brand.name}</p>
                        <p className="font-normal">{brand.description}</p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-foreground rounded-[30px] px-5 py-2 text-base font-bold text-foreground w-full"
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                  {index < (currentBrandData.similarBrands?.length || 0) - 1 && (
                    <div className="h-px w-full bg-[#dee8f2] my-3" />
                  )}
                </div>
              ))}
            </div>

            {/* How Franchise Grade helps you */}
            <div className="hidden lg:flex bg-[#f4f8fe] border-2 border-[#dee8f2] flex-col gap-8 items-start px-[29px] py-8 rounded-[20px] w-full">
              <div className="flex flex-col gap-0">
                <p className="text-[24px] font-bold text-[#446786] mb-0">How Franchise Grade helps you</p>
                <p className="text-base font-normal text-foreground mt-4">
                  We help you evaluate {currentBrandData.name} with data, not emotions. We show you the numbers that matter: financial transparency, profitability indicators, territory saturation, owner turnover, growth quality, and day-to-day operational expectations.
                </p>
              </div>
              <Button className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-8 py-2 text-base font-bold text-white w-full">
                Talk With an Advisor
              </Button>
            </div>

            {/* Ongoing Fees & Recurring Costs */}
            <div className="bg-[#fdfdfd] border-2 border-[#dee8f2] flex flex-col gap-2 items-start px-[29px] py-8 rounded-[20px] w-full lg:order-6 order-6">
              <p className="text-lg font-bold text-foreground h-[40px]">Ongoing Fees & Recurring Costs</p>
              <div className="flex gap-20 items-center w-full">
                <div className="bg-white flex gap-2 items-center pl-0 pr-6 py-1 rounded-[30px] w-[164px]">
                  <div className="bg-[#203d57] rounded-full size-[15px] flex items-center justify-center flex-shrink-0 ">
                    <p className="text-[#dee8f2] text-[9.37px] font-semibold leading-[14.055px]">$</p>
                  </div>
                  <p className="text-base font-normal text-foreground whitespace-nowrap w-[104px]">Royalty fees</p>
                </div>
                <div className="bg-white flex gap-2 items-center pl-0 pr-6 py-1 rounded-[30px] w-[164px]">
                  <div className="bg-[#203d57] rounded-full size-[15px] flex items-center justify-center flex-shrink-0">
                    <p className="text-[#dee8f2] text-[9.37px] font-semibold leading-[14.055px]">$</p>
                  </div>
                  <p className="text-base font-normal text-[#203d57] whitespace-nowrap w-[104px]">Marketing fund</p>
                </div>
              </div>
              <div className="h-px w-full bg-[#dee8f2] my-2" />
              <div className="flex gap-20 items-center w-full">
                <div className="bg-white flex gap-2 items-center pl-0 pr-6 py-1 rounded-[30px] w-[164px]">
                  <div className="bg-[#203d57] rounded-full size-[15px] flex items-center justify-center flex-shrink-0">
                    <p className="text-[#dee8f2] text-[9.37px] font-semibold leading-[14.055px]">$</p>
                  </div>
                  <p className="text-base font-normal text-[#203d57] whitespace-nowrap w-[104px]">Tech subscriptions</p>
                </div>
                <div className="bg-white flex gap-2 items-center pl-0 pr-6 py-1 rounded-[30px] w-[164px]">
                  <div className="bg-[#203d57] rounded-full size-[15px] flex items-center justify-center flex-shrink-0">
                    <p className="text-[#dee8f2] text-[9.37px] font-semibold leading-[14.055px]">$</p>
                  </div>
                  <p className="text-base font-normal text-[#203d57] whitespace-nowrap w-[104px]">Renewal fees</p>
                </div>
              </div>
              <div className="h-px w-full bg-[#dee8f2] my-2" />
              <div className="flex gap-20 items-center w-full">
                <div className="bg-white flex gap-2 items-center pl-0 pr-6 py-1 rounded-[30px] w-[164px]">
                  <div className="bg-[#203d57] rounded-full size-[15px] flex items-center justify-center flex-shrink-0">
                    <p className="text-[#dee8f2] text-[9.37px] font-semibold leading-[14.055px]">$</p>
                  </div>
                  <p className="text-base font-normal text-[#203d57] whitespace-nowrap w-[104px]">Compliance costs</p>
                </div>
                <div className="bg-white flex gap-2 items-center pl-0 pr-6 py-1 rounded-[30px] w-[164px]">
                  <div className="bg-[#203d57] rounded-full size-[15px] flex items-center justify-center flex-shrink-0">
                    <p className="text-[#dee8f2] text-[9.37px] font-semibold leading-[14.055px]">$</p>
                  </div>
                  <p className="text-base font-normal text-[#203d57] whitespace-nowrap w-[104px]">Training fees</p>
                </div>
              </div>
            </div>

            {/* Not sure you can afford this franchise? */}
            <div className="border-2 border-[#54b936] flex flex-col items-start px-[29px] py-8 rounded-[20px] w-full lg:order-8 order-8">
              {/* Title - 1 column */}
              <p className="text-[24px] font-bold text-[#26780e] mb-6 w-full">
                Not sure you can afford this franchise?
              </p>
              
              {/* Content - 2 columns */}
              <div className="flex flex-col md:flex-row gap-6 items-start w-full mb-6">
                <div className="flex flex-col gap-4 items-start justify-center flex-1">
                  <div className="text-base font-normal text-foreground">
                    <p className="font-bold mb-2">Try our Franchise Affordability Calculator.</p>
                    <p className="mb-0">Figuring out the type of franchise you can afford doesn't have to be rocket science.</p>
                  </div>
                </div>
                <div className="w-full md:w-[145px] flex-shrink-0">
                  <img 
                    src="https://mvp.franchisegrade.com/hubfs/Website/Listing/person-affod-cal-cta.png" 
                    alt="Affordability Calculator" 
                    className="w-full h-auto object-contain -mt-10"
                  />
                </div>
              </div>
              
              {/* Button - 1 column */}
              <Button className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-8 py-2 text-base font-bold text-white w-full">
                Try it now!
              </Button>
            </div>

            {/* Common Cost Drivers */}
            <div className="hidden lg:flex bg-[#fdfdfd] border-2 border-[#dee8f2] flex-col gap-2 items-start px-[29px] py-8 rounded-[20px] w-full">
              <p className="text-lg font-bold text-foreground h-[40px]">Common Cost Drivers</p>
              <div className="flex gap-20 items-center w-full">
                <div className="bg-white flex gap-2 items-center pl-0 pr-6 py-1 rounded-[30px] w-[164px]">
                  <div className="bg-[#203d57] rounded-full size-[15px] flex items-center justify-center flex-shrink-0">
                    <p className="text-[#dee8f2] text-[9.37px] font-extrabold leading-[14.055px]">!</p>
                  </div>
                  <p className="text-base font-normal text-[#203d57] whitespace-nowrap w-[104px]">Real estate</p>
                </div>
                <div className="bg-white flex gap-2 items-center pl-0 pr-6 py-1 rounded-[30px] w-[164px]">
                  <div className="bg-[#203d57] rounded-full size-[15px] flex items-center justify-center flex-shrink-0">
                    <p className="text-[#dee8f2] text-[9.37px] font-extrabold leading-[14.055px]">!</p>
                  </div>
                  <p className="text-base font-normal text-[#203d57] whitespace-nowrap w-[104px]">Staffing costs</p>
                </div>
              </div>
              <div className="h-px w-full bg-[#dee8f2] my-2" />
              <div className="flex gap-20 items-center w-full">
                <div className="bg-white flex gap-2 items-center pl-0 pr-6 py-1 rounded-[30px] w-[164px]">
                  <div className="bg-[#203d57] rounded-full size-[15px] flex items-center justify-center flex-shrink-0">
                    <p className="text-[#dee8f2] text-[9.37px] font-extrabold leading-[14.055px]">!</p>
                  </div>
                  <p className="text-base font-normal text-[#203d57] whitespace-nowrap w-[104px]">Build-out</p>
                </div>
                <div className="bg-white flex gap-2 items-center pl-0 pr-6 py-1 rounded-[30px] w-[164px]">
                  <div className="bg-[#203d57] rounded-full size-[15px] flex items-center justify-center flex-shrink-0">
                    <p className="text-[#dee8f2] text-[9.37px] font-extrabold leading-[14.055px]">!</p>
                  </div>
                  <p className="text-base font-normal text-[#203d57] whitespace-nowrap w-[104px]">Local demand</p>
                </div>
              </div>
              <div className="h-px w-full bg-[#dee8f2] my-2" />
              <div className="flex gap-20 items-center w-full">
                <div className="bg-white flex gap-2 items-center pl-0 pr-6 py-1 rounded-[30px] w-[164px]">
                  <div className="bg-[#203d57] rounded-full size-[15px] flex items-center justify-center flex-shrink-0">
                    <p className="text-[#dee8f2] text-[9.37px] font-extrabold leading-[14.055px]">!</p>
                  </div>
                  <p className="text-base font-normal text-[#203d57] whitespace-nowrap w-[104px]">Equipment</p>
                </div>
                <div className="bg-white flex gap-2 items-center pl-0 pr-6 py-1 rounded-[30px] w-[164px]">
                  <div className="bg-[#203d57] rounded-full size-[15px] flex items-center justify-center flex-shrink-0">
                    <p className="text-[#dee8f2] text-[9.37px] font-extrabold leading-[14.055px]">!</p>
                  </div>
                  <p className="text-base font-normal text-[#203d57] whitespace-nowrap w-[104px]">Licensing</p>
                </div>
              </div>
            </div>

            {/* Unlock full profitability analysis */}
            <div className="bg-[#fdfdfd] border-2 border-[#54b936] flex flex-col items-start px-[29px] py-8 rounded-[20px] w-full lg:order-9 order-9">
              <div className="flex flex-col gap-5 items-start w-full">
                <p className="text-[24px] font-bold text-[#26780e] whitespace-pre-wrap">
                  Unlock full profitability analysis
                </p>
                <div className="text-base font-normal text-foreground leading-6">
                  <p className="mb-0">We show what matters most when evaluating earnings, based on the FDD and real owner data.</p>
                  <p className="mb-0">&nbsp;</p>
                  <p className="font-bold text-lg mb-4">You will get when you sign up:</p>
                </div>
                <div className="flex flex-col items-start w-full gap-2">
                  {[
                    "Break-even timelines by market type",
                    "What profit margins typically look like",
                    "What Item 19 does and does not reveal",
                    "How to model earnings based on your market",
                    "Risks, red flags, and early warning indicators",
                  ].map((item, index) => (
                    <div key={index} className="bg-white flex gap-2 items-center justify-left pl-0 pr-6 py-2 rounded-[30px] w-full">
                      <img src="/check-filled.svg" alt="" className="w-4 h-4 flex-shrink-0" style={{ filter: "none" }} />
                      <p className="text-base font-normal text-[#203d57] items-start">{item}</p>
                    </div>
                  ))}
                </div>
                <Button className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-5 py-2 text-base font-bold text-white w-full mt-4">
                  Talk With an Advisor
                </Button>
              </div>
            </div>

            {/* Extended Similar Brands */}
            <div className="hidden lg:flex bg-[#fdfdfd] border-2 border-[#dee8f2] flex-col gap-2 items-start px-[29px] py-8 rounded-[20px] w-full">
              <p className="text-lg font-bold text-foreground">Similar Brands</p>
              {(currentBrandData.similarBrands || []).map((brand, index) => (
                <div key={index} className="w-full">
                  <div className="bg-white flex gap-5 items-start pl-0 pr-6 py-1 rounded-[30px] w-full">
                    <div className="size-[66px] rounded-full flex-shrink-0" style={{ backgroundColor: brand.logoColor || "#dee8f2" }} />
                    <div className="flex flex-col gap-5 items-start justify-center flex-1 max-w-[293px]">
                      <div className="text-base text-foreground">
                        <p className="font-bold mb-0">{brand.name}</p>
                        <p className="font-normal">{brand.description}</p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-foreground rounded-[30px] px-5 py-2 text-base font-bold text-foreground w-full"
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                  {index < (currentBrandData.similarBrands?.length || 0) - 1 && (
                    <div className="h-px w-full bg-[#dee8f2] my-2" />
                  )}
                </div>
              ))}
            </div>

            {/* Talk to Advisor Card - Bottom */}
            <div 
              ref={advisorCardBottomRef}
              className={`bg-[#203d57] flex flex-col items-start px-[29px] py-8 rounded-[20px] w-full transition-all lg:order-11 order-11 ${
                isAdvisorCardBottomSticky ? `lg:sticky lg:z-30 ${isNavSticky ? "lg:top-[132px]" : "lg:top-[76px]"}` : ""
              }`}
            >
              <div className="flex flex-col gap-8 items-center justify-center w-full">
                <div className="flex flex-col gap-5 items-center w-full">
                  {/* Profile Images */}
                  <div className="flex items-center justify-center w-full">
                    <img 
                      src="https://mvp.franchisegrade.com/hubfs/Website/Home/best-advisors-franchises.png" 
                      alt="Best Advisors" 
                      className="w-[220px] h-auto object-contain"
                    />
                  </div>
                  <p className="text-2xl text-center text-white max-w-[375px]">
                    <span className="font-bold">Leave it to the experts,</span>
                    <span> a wrong choice could cost you thousands</span>
                  </p>
                </div>
                <Button className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-8 py-2 text-base font-bold text-white w-full">
                  Talk With an Advisor
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}
