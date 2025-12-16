import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  ArrowUp,
  ArrowDown,
  DollarSign,
  TrendingUp,
  BarChart3,
  PieChart,
  FileText,
  Route,
  HelpCircle,
  Camera,
  GitCompare,
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
  AreaChart,
  Area,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const brandData = {
  id: "subway-1",
  name: "Subway",
  tagline: "Eat Fresh",
  description: "Subway is the world's largest submarine sandwich franchise, with more than 37,000 locations in over 100 countries.",
  logo: null,
  grade: "B" as const,
  sector: "Food & Beverage",
  category: "Quick Service",
  investment: {
    min: 4926000,
    max: 7136000,
    franchiseFee: 115000,
    workingCapital: 321000,
    royalty: "5%",
    marketing: "3%",
    initialTerm: "20 Years",
    renewalTerm: "0 Years",
  },
  profitability: {
    item19Disclosed: "Yes",
    benchmarkVsCategory: "A - Strong",
    ownerWorkloadImpact: "18 - 24 months",
  },
  locations: 50,
  founded: 1986,
  franchisedSince: 2004,
  item19Disclosed: "Yes",
  snapshot: "Moxie's is a full service, premium casual restaurant and lounge that offers a wide variety of food products and services.",
  whyBuyersLike: [
    "Simple and proven operating model",
    "Strong category demand in Bar and Grill",
    "Predictable owner role and support",
  ],
  similarBrands: [
    {
      name: "All American Pet Resort",
      description: "All American Pet Resorts offer pet boarding, daycare, and grooming...",
    },
    {
      name: "Celebree School",
      description: "Infant care, pre-school, before and after-school programs for school...",
    },
  ],
  comparison: {
    openUnitsLastYear: { average: "5 Units", moxies: "17 Units", percentage: "+45%" },
    marketingFees: { average: "6.5%", moxies: "3%", percentage: "-25%" },
  },
};

const investmentPieData = [
  {
    name: "Franchise Fee",
    value: brandData.investment.franchiseFee,
    color: "#446786",
  },
  {
    name: "Working Capital",
    value: brandData.investment.workingCapital,
    color: "#54b936",
  },
  {
    name: "Other startup costs",
    value: Math.max(
      brandData.investment.min -
        brandData.investment.franchiseFee -
        brandData.investment.workingCapital,
      0
    ),
    color: "#a4c6e8",
  },
];

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
  const [isNavSticky, setIsNavSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if nav should be sticky
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect();
        setIsNavSticky(rect.top <= 64);
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
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
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

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 pb-8 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 max-w-[1270px] mx-auto w-full">
          {/* Left Column - Main Content */}
          <div className="flex flex-col gap-5 flex-1 w-full lg:max-w-[801px]">
            {/* Franchise Review Card */}
            <div className="bg-[#f4f8fe] flex flex-col rounded-[20px]">
              <div className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col">
                {/* Image */}
                <div className="h-[180px] sm:h-[200px] lg:h-[220px] rounded-t-[20px] bg-gradient-to-br from-[#446786] to-[#4f7aa5] relative">
                  {/* Grade Badge */}
                  <div className="absolute right-4 sm:right-6 lg:right-8 bottom-[-50px] sm:bottom-[-56px] lg:bottom-[-62px] flex flex-col items-center">
                    <div className="bg-white border-[4.493px] border-[#dee8f2] rounded-full size-[100px] sm:size-[112px] lg:size-[124px] flex items-center justify-center">
                      <div className="flex flex-col items-center text-center">
                        <div className="text-[58px] sm:text-[64px] lg:text-[71.884px] font-extrabold leading-none text-[#446786]">?</div>
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
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{brandData.name}</h1>
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
                          {formatCurrency(brandData.investment.min)}
                        </p>
                        <p className="text-base font-normal">Investment starts at</p>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="bg-[#a6a6a6] h-[68px] w-[2px] rounded-full" />
                      <div className="flex flex-col gap-1 px-1 py-5">
                        <p className="text-2xl font-bold text-left">{brandData.locations}+</p>
                        <p className="text-base font-normal">Locations</p>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="bg-[#a6a6a6] h-[68px] w-[2px] rounded-full" />
                      <div className="flex flex-col gap-1 justify-center">
                        <p className="text-2xl font-bold">Yes</p>
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
              className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col gap-5 p-4 sm:p-6 lg:p-8"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-[#203d57]" />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Snapshot</h2>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-base font-normal text-foreground mb-4">
                  {brandData.snapshot}
                </p>
                <p className="text-base font-bold text-foreground mb-4">Franchise Facts & Key Statistics</p>
              </div>

              {/* Facts List */}
              <div className="flex flex-col items-start gap-1">
                {[
                  { label: "Total Investment:", value: `${formatCurrency(brandData.investment.min)} - ${formatCurrency(brandData.investment.max)}` },
                  { label: "Founded:", value: brandData.founded },
                  { label: "Franchised Since:", value: brandData.franchisedSince },
                  { label: "Item 19 Disclosed:", value: `${brandData.locations}+` },
                  { label: "Sector:", value: brandData.sector, highlight: true },
                  { label: "Category:", value: brandData.category, highlight: true },
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
                  Moxies stands out because it's a recognizable brand in a growing category, supported by years of steady system performance. Buyers appreciate the structured onboarding, predictable startup path, and long-term stability indicators. Its model works well for owners who want a reliable business with strong support from day one.
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
              className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col gap-4 p-4 sm:p-6 lg:p-8"
            >
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-[#203d57]" />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Investment Overview</h2>
              </div>
              
              <div className="text-base font-normal text-foreground w-full">
                <p className="font-bold mb-2">How much does a Moxies franchise cost?</p>
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
                      <p className="text-[23.855px] font-normal text-foreground">{formatCurrency(brandData.investment.min)}</p>
                      <p className="text-base font-normal text-foreground">-</p>
                      <p className="text-[23.855px] font-normal text-foreground">{formatCurrency(brandData.investment.max)}</p>
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
                    <p className="text-[23.855px] font-normal text-foreground">{formatCurrency(brandData.investment.franchiseFee)}</p>
                  </div>
                </div>

                {/* Working Capital */}
                <div className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col items-start justify-center p-3 w-full">
                  <div className="flex flex-col gap-2 items-start justify-center w-full">
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: "#54b936" }} />
                      <p className="text-sm sm:text-base font-bold text-foreground">Working Capital</p>
                    </div>
                    <p className="text-[23.855px] font-normal text-foreground">{formatCurrency(brandData.investment.workingCapital)}</p>
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
                        <p className="text-[23.855px] font-normal text-foreground">{brandData.investment.royalty}</p>
                        <p className="text-base font-bold text-[#4f7aa5]">Royalty Fees</p>
                      </div>
                      <div className="border-t-2 sm:border-t-0 sm:border-l-2 border-[#dee8f2] flex flex-col items-start pt-4 sm:pt-0 sm:pl-8 w-full sm:w-auto">
                        <p className="text-[23.855px] font-normal text-foreground">{brandData.investment.marketing}</p>
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
                        <p className="text-[23.855px] font-normal text-foreground">{brandData.investment.initialTerm}</p>
                        <p className="text-base font-bold text-[#4f7aa5]">Initial Term</p>
                      </div>
                      <div className="border-t-2 sm:border-t-0 sm:border-l-2 border-[#dee8f2] flex flex-col items-start pt-4 sm:pt-0 sm:pl-8 w-full sm:w-auto">
                        <p className="text-[23.855px] font-normal text-foreground">{brandData.investment.renewalTerm}</p>
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
              className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col gap-6 p-4 sm:p-6 lg:p-8"
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-[#203d57]" />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Profitability & Earnings</h2>
              </div>
              
              <div className="text-base font-normal text-foreground w-full">
                <p className="font-bold mb-2">How much does a Moxies franchise make?</p>
                <p>
                  Franchise revenue and profits depend on a number of unique variables, including local demand for your product, labor costs, commercial lease rates and several other factors. We can help you figure out how much money you can make by reviewing your specific situation. Please{" "}
                  <Link to="/unlock" className="font-bold text-[#54b936] underline">
                    unlock this franchise
                  </Link>{" "}
                  for more information.
                </p>
              </div>
              
              {/* Earnings Chart - Full Width */}
              <div className="bg-white border-2 border-[#dee8f2] rounded-[20px] p-6 w-full">
                <ChartContainer
                  config={{
                    earnings: {
                      label: "Earnings ($)",
                      color: "#4f7aa5",
                    },
                    benchmark: {
                      label: "Category Average",
                      color: "#a4c6e8",
                    },
                  }}
                  className="h-[300px] sm:h-[350px] lg:h-[400px] w-full"
                >
                  <AreaChart
                    data={[
                      { year: "Y1", earnings: 250000, benchmark: 200000 },
                      { year: "Y2", earnings: 320000, benchmark: 240000 },
                      { year: "Y3", earnings: 380000, benchmark: 280000 },
                      { year: "Y4", earnings: 450000, benchmark: 320000 },
                      { year: "Y5", earnings: 520000, benchmark: 360000 },
                    ]}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f7aa5" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4f7aa5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#dee8f2" />
                    <XAxis dataKey="year" stroke="#8c9aa5" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#8c9aa5" style={{ fontSize: '12px' }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="benchmark" stroke="#a4c6e8" fillOpacity={0.1} fill="#a4c6e8" strokeWidth={2} />
                    <Area type="monotone" dataKey="earnings" stroke="#4f7aa5" fillOpacity={1} fill="url(#colorEarnings)" strokeWidth={2} />
                  </AreaChart>
                </ChartContainer>
              </div>

              {/* Profitability Metrics - 3 boxes aligned */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                {/* Item 19 Disclosure */}
                <div className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col items-start justify-center px-4 sm:px-6 lg:px-[29px] py-6 sm:py-8 w-full">
                  <div className="flex flex-col gap-2 items-start justify-center w-full">
                    <p className="text-sm sm:text-base font-bold text-foreground w-full">Item 19 Disclosure</p>
                    <p className="text-[23.855px] font-normal text-foreground">{brandData.profitability.item19Disclosed}</p>
                  </div>
                </div>

                {/* Benchmark */}
                <div className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col items-start justify-center px-4 sm:px-6 lg:px-[29px] py-6 sm:py-8 w-full">
                  <div className="flex flex-col gap-2 items-start justify-center w-full">
                    <p className="text-sm sm:text-base font-bold text-foreground w-full">Benchmark vs Category</p>
                    <p className="text-[23.855px] font-normal text-foreground">{brandData.profitability.benchmarkVsCategory}</p>
                  </div>
                </div>

                {/* Owner Workload Impact */}
                <div className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col items-start justify-center px-4 sm:px-6 lg:px-[29px] py-6 sm:py-8 w-full">
                  <div className="flex flex-col gap-2 items-start justify-center w-full">
                    <p className="text-sm sm:text-base font-bold text-foreground w-full">Owner Workload Impact</p>
                    <p className="text-[23.855px] font-normal text-foreground">{brandData.profitability.ownerWorkloadImpact}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Section */}
            <div
              ref={(el) => (sectionRefs.current.comparison = el)}
              className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col gap-6 p-4 sm:p-6 lg:p-8"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-6 sm:gap-4">
                <div className="flex flex-col gap-4 sm:gap-5 items-start w-full sm:max-w-[488px]">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-[#203d57]" />
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">Comparison & Analysis</h2>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-foreground">Where Moxies stands out:</p>
                  
                  <div className="flex flex-col items-start w-full">
                    {[
                      "Performs above category benchmarks in {top strengths}",
                      "Stronger growth and more consistent performance in {top strengths}",
                      "Lower risk indicators than similar brands in {top strengths}",
                    ].map((item, index) => (
                      <div key={index} className="bg-transparent flex gap-2 items-center pl-2 sm:pl-4 pr-4 sm:pr-6 py-2 rounded-[30px] w-full">
                        <img src="/check-filled.svg" alt="" className="w-4 h-4 flex-shrink-0" />
                        <p className="text-sm sm:text-base font-normal text-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-[180px] sm:h-[228px] rounded-[30px] w-full sm:w-[232px] bg-[#f4f8fe] flex-shrink-0" />
              </div>

              <div className="flex flex-col gap-5 items-start w-full">
                <h3 className="text-base sm:text-lg font-bold text-foreground">Grill & Bar Industry Benchmarking</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  {/* Open Units Last Year */}
                  <div className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col items-start justify-center px-4 sm:px-6 lg:px-[29px] py-6 sm:py-8 w-full">
                    <div className="flex flex-col gap-2 items-start justify-center w-full">
                      <p className="text-sm sm:text-base font-bold text-foreground w-full">Open Units Last Year</p>
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start w-full">
                        <div className="flex flex-col items-start">
                          <p className="text-[23.855px] font-normal text-foreground">{brandData.comparison.openUnitsLastYear.average}</p>
                          <p className="text-base font-bold text-[#4f7aa5]">Average</p>
                        </div>
                        <div className="border-t-2 sm:border-t-0 sm:border-l-2 border-[#dee8f2] flex flex-col items-start pt-4 sm:pt-0 sm:pl-8 w-full sm:w-auto">
                          <div className="flex items-baseline gap-2">
                            <p className="text-[23.855px] font-normal text-foreground">{brandData.comparison.openUnitsLastYear.moxies}</p>
                            <div className="flex items-center gap-1 bg-[#54b936]/10 px-2 py-0.5 rounded-full">
                              <ArrowUp className="w-3 h-3 text-[#54b936]" />
                              <p className="text-xs font-bold text-[#54b936]">{brandData.comparison.openUnitsLastYear.percentage}</p>
                            </div>
                          </div>
                          <p className="text-base font-bold text-[#4f7aa5]">Moxies</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Marketing Fees */}
                  <div className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col items-start justify-center px-4 sm:px-6 lg:px-[29px] py-6 sm:py-8 w-full">
                    <div className="flex flex-col gap-2 items-start justify-center w-full">
                      <p className="text-sm sm:text-base font-bold text-foreground w-full">Marketing Fees</p>
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start w-full">
                        <div className="flex flex-col items-start">
                          <p className="text-[23.855px] font-normal text-foreground">{brandData.comparison.marketingFees.average}</p>
                          <p className="text-base font-bold text-[#4f7aa5]">Average</p>
                        </div>
                        <div className="border-t-2 sm:border-t-0 sm:border-l-2 border-[#dee8f2] flex flex-col items-start pt-4 sm:pt-0 sm:pl-8 w-full sm:w-auto">
                          <div className="flex items-baseline gap-2">
                            <p className="text-[23.855px] font-normal text-foreground">{brandData.comparison.marketingFees.moxies}</p>
                            <div className="flex items-center gap-1 bg-[#ee2524]/10 px-2 py-0.5 rounded-full">
                              <ArrowDown className="w-3 h-3 text-[#ee2524]" />
                              <p className="text-xs font-bold text-[#ee2524]">{brandData.comparison.marketingFees.percentage}</p>
                            </div>
                          </div>
                          <p className="text-base font-bold text-[#4f7aa5]">Moxies</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-base font-normal text-foreground w-full">
                <p className="font-bold">What buyers compare most</p>
                <p>
                  <br />
                  Buyers commonly look at how Moxies stacks up against direct competitors, focusing on cost structure, transparency, growth quality, long-term stability, and territory availability.
                  <br />
                  <br />
                  A brand that performs well across these areas typically attracts more serious candidates and offers a more predictable ownership experience.
                </p>
              </div>
            </div>

            {/* Territories Section */}
            <div
              ref={(el) => (sectionRefs.current.territories = el)}
              className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col gap-5 p-4 sm:p-6 lg:p-8"
            >
              <div className="flex gap-5 items-start justify-center w-full max-w-[739px]">
                <div className="flex flex-col gap-5 items-start max-w-[370px]">
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
                <div className="h-[204px] rounded-[30px] w-[348px] bg-[#f4f8fe]" />
              </div>

              <div className="text-base font-normal text-foreground w-full">
                <p className="font-bold mb-4">How many franchise locations do they have?</p>
                <p className="mb-4">
                  As of the 2024 Franchise Disclosure Document, there are franchised Moxies locations in the USA.
                  <br />
                  <br />
                </p>
                <p className="font-bold mb-4">Are there any Moxies franchise opportunities near me?</p>
                <p className="mb-4">
                  Based on 2024 FDD data, Moxies has franchise locations in 0 states. The largest region is the West with 0 franchise locations
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
              className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col gap-5 p-4 sm:p-6 lg:p-8"
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
              className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col gap-5 p-4 sm:p-6 lg:p-8"
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
              className="bg-white border-2 border-[#dee8f2] rounded-[20px] flex flex-col gap-5 p-4 sm:p-6 lg:p-8"
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

          {/* Right Column - Sidebar */}
          <div className="hidden lg:flex flex-col gap-5 items-start justify-start min-w-[437px]">
            {/* Talk to Advisor Card */}
            <div className="bg-[#203d57] flex flex-col items-start px-[29px] py-8 rounded-[20px] w-full">
              <div className="flex flex-col gap-8 items-center justify-center w-full">
                <div className="flex flex-col gap-5 items-center w-full">
                  {/* Profile Images */}
                  <div className="flex items-center">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`size-[70.297px] rounded-full border-2 border-white ${i > 1 ? "-ml-[53.69px]" : ""}`}
                        style={{ backgroundColor: "#acacac" }}
                      />
                    ))}
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
            <div className="bg-[#fdfdfd] border-2 border-[#dee8f2] flex flex-col gap-2 items-start px-[29px] py-8 rounded-[20px] w-full">
              <p className="text-lg font-bold text-foreground">Why buyers like this brand</p>
              {brandData.whyBuyersLike.map((item, index) => (
                <div key={index} className="w-full">
                  <div className="bg-white flex gap-2 items-center justify-start pl-0 pr-6 py-1 rounded-[30px] w-full">
                    <img src="/check-filled.svg" alt="" className="w-4 h-4 flex-shrink-0" />
                    <p className="text-base font-normal text-left text-foreground">{item}</p>
                  </div>
                  {index < brandData.whyBuyersLike.length - 1 && (
                    <div className="h-px w-full bg-[#dee8f2]" />
                  )}
                </div>
              ))}
            </div>

            {/* Similar Brands */}
            <div className="bg-[#fdfdfd] border-2 border-[#dee8f2] flex flex-col gap-2 items-start px-[29px] py-8 rounded-[20px] w-full">
              <p className="text-lg font-bold text-foreground">Similar Brands</p>
              {brandData.similarBrands.map((brand, index) => (
                <div key={index}>
                  <div className="bg-white flex gap-5 items-start pl-0 pr-6 py-1 rounded-[30px] w-full">
                    <div className="size-[66px] rounded-full bg-[#dee8f2]" />
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
                  {index < brandData.similarBrands.length - 1 && (
                    <div className="h-px w-[379px] bg-[#dee8f2]" />
                  )}
                </div>
              ))}
            </div>

            {/* More sidebar components would go here */}
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}
