import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
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
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

export default function IndustryDetail() {
  const { categorySlug } = useParams();
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [franchises, setFranchises] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <main className="flex-1 w-full overflow-x-hidden pt-[43px]">
        {/* Hero Section */}
        <div className="px-8 max-w-[1448px] mx-auto mt-8">
          <div className="bg-[#163552] text-white py-16 sm:py-20 lg:py-24 rounded-[30px]">
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12">
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
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                    Why Choose {categoryData.name}?
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed mb-2">
                    {categoryData.franchises && categoryData.franchises.length > 0 ? (
                      <>With {categoryData.franchises.length} franchise systems, there are several great business opportunities that fit your investment range.</>
                    ) : (
                      <>There are several great business opportunities in the {categoryData.name.toLowerCase()} industry that fit your investment range.</>
                    )}{' '}
                    The {categoryData.name.toLowerCase()} industry includes diverse franchise opportunities across various business models and investment levels.
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    This industry offers proven systems, comprehensive support, and strong growth potential for franchisees looking to invest in a stable and expanding market.
                  </p>
                </div>
              </div>

              {/* Feature Icons */}
              {categoryData.features && categoryData.features.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {categoryData.features.map((feature, index) => {
                    const IconComponent = iconMap[feature.icon] || DollarSign;
                    return (
                      <div key={index} className="text-center">
                        <div className="w-16 h-16 rounded-full bg-[#f4f8fe] flex items-center justify-center mx-auto mb-4">
                          <IconComponent className="w-8 h-8 text-[#446786]" />
                        </div>
                        <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Industry Snapshot Section */}
            {categoryData.sectorMetrics ? (
              <div className="mb-16">
                <div className="bg-[#F4F8FE] rounded-[30px] overflow-hidden shadow-sm py-10 px-8 max-w-[1448px] mx-auto">
                  <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8 text-center">
                    Industry Snapshot
                  </h2>
                  <div className="max-w-[1136px] mx-auto">
                    <table className="w-full border-collapse">
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
                  </div>
                </div>
              </div>
            ) : null}

            {/* Key Metrics Visualizations */}
            {categoryData.sectorMetrics ? (
              <div className="mb-16 space-y-16">
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
                          The initial investment includes all costs associated with opening a new franchised location. 
                          These costs include things like leasehold improvements, training, grand opening advertising and additional funds.
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
                          Should be a primary revenue stream for franchisor. Royalties are fees you pay to the franchisor on a regular basis.
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
                <div className="max-w-[1136px] mx-auto">
                  <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">Growth Rate</h3>
                    <p className="text-base text-muted-foreground mb-6">
                      The average franchisee growth rate in the {categoryData.name} industry is {categoryData.sectorMetrics.growthRate.average}%. 
                      This average masks significant variation, with some franchise systems growing and others shrinking. 
                      Compare and review growth rates from several franchises before making an investment decision.
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
                <div className="max-w-[1136px] mx-auto">
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
                      Territory rights are specific to a franchise and should include definitions of customer types or geographic boundaries. 
                      In the {categoryData.name} industry, {categoryData.sectorMetrics.territoryRights.percentage}% of franchises offer 
                      exclusive or protected territories for their franchisees. Review Item 12 of the FDD to ensure territory protections are reasonable.
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

            {/* Comparison Section */}
            <div className="mb-16 max-w-[1448px] mx-auto">
              <div className="bg-[#f4f8fe] rounded-[20px] ">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8 text-center">
                  Why Choose {categoryData.name}?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 justify-items-center ">
                <div className="w-full">
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
                <div className="w-full">
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
                            <p className="text-base text-muted-foreground">Limited benefits</p>
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

                {/* Franchisee Turnover Rate Chart */}
                <div className="space-y-8">
                  {/* 1. Title and Description */}
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">Franchisee Turnover Rate</h3>
                    <p className="text-base text-muted-foreground mb-6">
                      The Franchisee Turnover Rate (FTR) is the percentage of franchised outlets that turn over every year. 
                      The average FTR in the {categoryData.name} industry is {categoryData.sectorMetrics.franchiseeTurnoverRate.average}%. 
                      Franchisee turnover includes five key attributes: Transfers, Terminations, Non-Renewals, Reacquired and Ceased Operations.
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
            ) : null}

            {/* Benefits/Growth Section */}
            <div className="mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
                    Why Invest in a {categoryData.name} Franchise?
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed mb-6">
                    {categoryData.name} franchises offer exceptional opportunities for growth and success. With proven systems, comprehensive training, and ongoing support, you'll have everything you need to build a thriving business.
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed mb-8">
                    Our franchisees benefit from strong brand recognition, marketing support, and a network of successful operators. Join a community of entrepreneurs who are building their futures with {categoryData.name.toLowerCase()} franchises.
                  </p>
                  <Button
                    size="lg"
                    className="bg-[#54b936] hover:bg-[#54b936]/90 text-white rounded-[30px] px-8 py-6 text-base font-bold"
                  >
                    Talk to a Franchise Industry Advisor <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
                <div className="bg-white border border-[#A4C6E8] rounded-[20px] p-6">
                  <ChartContainer
                    config={{
                      value: { label: "Growth", color: "#446786" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={growthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#A4C6E8" />
                        <XAxis dataKey="year" stroke="#446786" />
                        <YAxis stroke="#446786" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="value" fill="#446786" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </div>

            {/* Industry Franchise Recommendation Section */}
            <div className="mb-16">
              <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-8 text-center">
                Industry Franchise Recommendation
              </h3>
              <Carousel
                opts={{
                  align: "start",
                  loop: false,
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
                      <CarouselItem key={franchise.id || index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                        <FranchiseCard
                          id={franchise.id || `franchise-${index}`}
                          name={franchise.name}
                          logo={franchise.logo}
                          investmentMin={franchise.investmentMin || categoryData.stats.totalInvestment.min}
                          investmentMax={franchise.investmentMax || categoryData.stats.totalInvestment.max}
                          sector={franchise.sector || categoryData.name}
                          category={franchise.category || categoryData.name}
                          grade={franchise.grade || "B"}
                          isLoggedIn={false}
                        />
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className="left-0 md:-left-12" />
                <CarouselNext className="right-0 md:-right-12" />
              </Carousel>
            </div>

            {/* Franchise Opportunities Section */}
            {franchises.length > 0 && (
              <div className="mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8 text-center">
                  Our {categoryData.name} Franchise Opportunities
                </h2>
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

          </div>
        </div>
      </main>
      <Footer 
        customCTA={
          <>
            <h2 className="text-3xl sm:text-4xl font-normal text-white mb-4 text-center">
              Ready to Start Your Journey?
            </h2>
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

