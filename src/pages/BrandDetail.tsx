import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useEngagementTracking } from "@/hooks/useEngagementTracking";
import { useSignInModal } from "@/contexts/SignInModalContext";
import { getBrandService } from "@/lib/services";
import type { BrandGrade } from "@/lib/services/types";
import {
  DollarSign,
  BarChart3,
  PieChart,
  FileText,
  MapPin,
  Lock,
  List,
  CheckCircle2,
  UserCheck,
  HelpCircle,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  const { isLoggedIn } = useAuth();
  const { trackPageView, trackUnlock } = useEngagementTracking();
  const { openModal, pendingSectionId, clearPendingSection } = useSignInModal();
  const [activeSection, setActiveSection] = useState("snapshot");
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const navRef = useRef<HTMLDivElement>(null);
  const navInitialTopRef = useRef<number>(0);
  const advisorCardBottomRef = useRef<HTMLDivElement>(null);
  const advisorCardInitialTopRef = useRef<number>(0);
  const advisorCardInitialWidthRef = useRef<number>(0);
  const advisorCardInitialLeftRef = useRef<number>(0);
  const footerRef = useRef<HTMLDivElement>(null);
  const [isNavSticky, setIsNavSticky] = useState(false);
  const isNavStickyRef = useRef(false);
  const [isAdvisorCardBottomSticky, setIsAdvisorCardBottomSticky] = useState(false);
  
  // Brand data state
  const [currentBrandData, setCurrentBrandData] = useState<BrandData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brandGrade, setBrandGrade] = useState<BrandGrade>("A"); // Default to "A"
  const [activeStep, setActiveStep] = useState<string>("step-1"); // For Requirements accordion
  const [headerImageError, setHeaderImageError] = useState(false); // For header image error handling
  
  // Franchisee Turnover Rate - HubSpot-ready, can be fetched from brand data
  const turnoverScore = (currentBrandData as any)?.profitability?.turnoverScore ?? 90; // Default to 90, can be replaced with API data

  // Fetch brand data when slug changes - slug is the single source of truth
  // This effect handles both resetting state and loading new data when slug changes
  useEffect(() => {
    // Reset component state when slug changes to ensure full re-render
    setActiveSection("snapshot");
    setIsNavSticky(false);
    setIsAdvisorCardBottomSticky(false);
    setCurrentBrandData(null);
    setError(null);
    setHeaderImageError(false); // Reset image error state when slug changes

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
        
        // Fetch grade from brand service (HubSpot-ready)
        const brandService = getBrandService();
        const grade = await brandService.getGrade(slug);
        if (grade) {
          setBrandGrade(grade);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load brand data');
        setCurrentBrandData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadBrandData();
  }, [slug]);

  // Track page view and unlock when brand data is loaded and user is logged in
  useEffect(() => {
    if (currentBrandData && isLoggedIn && slug) {
      // Track page view
      trackPageView(slug, currentBrandData.name);
      // Track unlock since user is viewing unlocked content
      trackUnlock(slug, currentBrandData.name);
    }
    // Only track once when brand data loads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBrandData?.name, slug]);

  // Keep ref in sync with state for use in handleScroll closure
  useEffect(() => {
    isNavStickyRef.current = isNavSticky;
  }, [isNavSticky]);

  // Scroll to pending section after sign-in
  useEffect(() => {
    if (isLoggedIn && pendingSectionId) {
      // Wait a bit for the page to update after login
      setTimeout(() => {
        const element = sectionRefs.current[pendingSectionId];
        if (element) {
          const offset = 64 + (isNavSticky ? 88 : 0); // navbar + nav height
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
        clearPendingSection();
      }, 300);
    }
  }, [isLoggedIn, pendingSectionId, clearPendingSection, isNavSticky]);

  // Store initial nav position on mount
  useEffect(() => {
    const updateNavInitialTop = () => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;
        navInitialTopRef.current = rect.top + scrollY;
      }
    };
    
    const updateAdvisorCardInitialTop = () => {
      if (advisorCardBottomRef.current) {
        const rect = advisorCardBottomRef.current.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;
        advisorCardInitialTopRef.current = rect.top + scrollY;
        advisorCardInitialWidthRef.current = rect.width;
        advisorCardInitialLeftRef.current = rect.left;
      }
    };
    
    if (currentBrandData) {
      // Wait for layout to complete, then update
      const timer = setTimeout(() => {
        updateNavInitialTop();
        updateAdvisorCardInitialTop();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [currentBrandData]);

  useEffect(() => {
    const handleScroll = () => {
      // Nav is always sticky, but we track when it's "active" (scrolled past initial position)
      if (navRef.current) {
        const scrollY = window.scrollY || window.pageYOffset;
        
        // Update initial position on first scroll or if not set
        if (navInitialTopRef.current === 0 && scrollY === 0) {
          const rect = navRef.current.getBoundingClientRect();
          navInitialTopRef.current = rect.top + scrollY;
        }
        
        // Nav is "active" (shows shadow) when scrolled past its initial position
        // Since nav is always sticky, we just need to check if we've scrolled
        const shouldBeActive = navInitialTopRef.current > 0 
          ? scrollY > navInitialTopRef.current - 64
          : scrollY > 0;
        
        setIsNavSticky(shouldBeActive);
      }

      // Check if second advisor card should be sticky (only on desktop/iPad - lg breakpoint)
      if (window.innerWidth >= 1024 && advisorCardBottomRef.current && advisorCardInitialTopRef.current > 0) {
        // Calculate top offset: navbar (64px) + sticky nav height (43px) + 12px gap = 119px
        const stickyNavHeight = navRef.current?.offsetHeight || 43; // Sticky nav height
        const stickyTopOffset = 64 + stickyNavHeight + 12; // navbar (64px) + sticky nav (43px) + gap (12px) = 119px
        
        const scrollY = window.scrollY || window.pageYOffset;
        const rect = advisorCardBottomRef.current.getBoundingClientRect();
        
        // Check if footer is visible or near
        let footerTop = Infinity;
        if (footerRef.current) {
          const footerRect = footerRef.current.getBoundingClientRect();
          footerTop = footerRect.top;
        }
        
        // Make sticky when:
        // 1. We've scrolled past the element's initial position
        // 2. Footer is not visible or not near (footer top should be below the sticky position + card height)
        const cardHeight = advisorCardInitialWidthRef.current > 0 ? 293 : rect.height; // Approximate card height
        const shouldBeSticky = scrollY >= advisorCardInitialTopRef.current - stickyTopOffset && 
                                footerTop > (stickyTopOffset + cardHeight);
        setIsAdvisorCardBottomSticky(shouldBeSticky);
        
        // Update fixed position styles when sticky to maintain width and position
        if (shouldBeSticky && advisorCardBottomRef.current) {
          const card = advisorCardBottomRef.current;
          // Use stored initial values to maintain consistent size and position
          // Disable transitions for position changes to avoid weird animations
          card.style.transition = 'none';
          card.style.position = 'fixed';
          card.style.top = `${stickyTopOffset}px`;
          card.style.left = `${advisorCardInitialLeftRef.current}px`;
          card.style.width = `${advisorCardInitialWidthRef.current}px`;
          // Re-enable transition for shadow after a brief moment
          setTimeout(() => {
            if (card) {
              card.style.transition = '';
            }
          }, 0);
        } else if (advisorCardBottomRef.current) {
          // Reset styles when not sticky
          const card = advisorCardBottomRef.current;
          // Disable transitions for position changes
          card.style.transition = 'none';
          card.style.position = '';
          card.style.top = '';
          card.style.left = '';
          card.style.width = '';
          // Re-enable transition after a brief moment
          setTimeout(() => {
            if (card) {
              card.style.transition = '';
            }
          }, 0);
          // Update initial values when not sticky
          advisorCardInitialLeftRef.current = rect.left;
          advisorCardInitialWidthRef.current = rect.width;
        }
      } else if (window.innerWidth < 1024) {
        // Mobile: never sticky, reset styles
        setIsAdvisorCardBottomSticky(false);
        if (advisorCardBottomRef.current) {
          const card = advisorCardBottomRef.current;
          card.style.position = '';
          card.style.top = '';
          card.style.left = '';
          card.style.width = '';
        }
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

    const handleResize = () => {
      // Update initial values on resize when not sticky
      if (advisorCardBottomRef.current && !isAdvisorCardBottomSticky) {
        const rect = advisorCardBottomRef.current.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;
        advisorCardInitialTopRef.current = rect.top + scrollY;
        advisorCardInitialWidthRef.current = rect.width;
        advisorCardInitialLeftRef.current = rect.left;
      }
      handleScroll();
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
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

  // Smart unlock function that tracks section and opens sign-in modal
  const handleUnlockClick = (e: React.MouseEvent, sectionId?: string) => {
    e.preventDefault();
    if (sectionId) {
      openModal(sectionId);
    } else {
      openModal();
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

  // Memoized comprehensive royalties chart data (HubSpot-ready) - For logged in users
  const royaltiesComparisonData = useMemo(() => {
    if (!currentBrandData) return [];
    
    // HubSpot-friendly: Can be replaced with actual data from brandData.investment
    const brandRoyalty = parseFloat((currentBrandData.investment.royalty || "0%").replace('%', ''));
    const competitorsRoyalty = currentBrandData.competitorsRoyaltyRate || 6;
    
    return [
      { 
        name: "Royalty\nRate", 
        brand: brandRoyalty,
        competitors: competitorsRoyalty
      },
      { 
        name: "National\nAdvertising", 
        brand: (currentBrandData as any)?.investment?.nationalAdvertisingRate || 2,
        competitors: 2
      },
      { 
        name: "Local\nAdvertising", 
        brand: (currentBrandData as any)?.investment?.localAdvertisingRate || 1,
        competitors: 2.5
      },
      { 
        name: "Cooperative\nAdvertising", 
        brand: (currentBrandData as any)?.investment?.cooperativeAdvertisingRate || 0,
        competitors: 2.5
      },
    ];
  }, [currentBrandData]);

  // Simple royalty comparison for non-logged-in users (single comparison)
  const simpleRoyaltyComparisonData = useMemo(() => {
    if (!currentBrandData) return [];
    
    return [
      { 
        name: "Royalty\nRate", 
        brand: parseFloat((currentBrandData.investment.royalty || "0%").replace('%', '')),
        competitors: (currentBrandData as any)?.competitorsRoyaltyRate || 6
      },
    ];
  }, [currentBrandData]);

  // Memoized initial and renewal terms chart data (HubSpot-ready) - For logged in users
  const termsComparisonData = useMemo(() => {
    if (!currentBrandData) return [];
    
    const brandInitialTerm = parseInt((currentBrandData.investment.initialTerm || "0 Years").replace(' Years', '').replace(' Years', ''));
    const brandRenewalTerm = parseInt((currentBrandData.investment.renewalTerm || "0 Years").replace(' Years', '').replace(' Years', ''));
    const competitorsInitialTerm = currentBrandData.competitorsInitialTerm || 15;
    const competitorsRenewalTerm = 5; // Default competitor renewal term
    
    return [
      { 
        name: "Initial\nTerm", 
        brand: brandInitialTerm,
        competitors: competitorsInitialTerm
      },
      { 
        name: "Renewal\nTerm", 
        brand: brandRenewalTerm,
        competitors: competitorsRenewalTerm
      },
      { 
        name: "Number\nof Renewals", 
        brand: (currentBrandData as any)?.investment?.numberOfRenewals || 0,
        competitors: 1
      },
    ];
  }, [currentBrandData]);

  // Simple initial term comparison for non-logged-in users (single comparison)
  const simpleInitialTermComparisonData = useMemo(() => {
    if (!currentBrandData) return [];
    
    return [
      { 
        name: "Initial\nTerm", 
        brand: parseInt((currentBrandData.investment.initialTerm || "0 Years").replace(' Years', '')),
        competitors: (currentBrandData as any)?.competitorsInitialTerm || 15
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
      {/* Sticky Navigation - Sticky on all screens, positioned below navbar */}
      <div
        ref={navRef}
        className={`w-full bg-white transition-all sticky top-16 z-40 ${
          isNavSticky ? "shadow-sm" : ""
        }`}
      >
        <div className="flex items-center gap-8 overflow-x-auto border-b border-[#A4C6E8] pb-2 scrollbar-hide px-4 sm:px-6 lg:px-8 max-w-[1350px] mx-auto w-full">
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
        <div className="bg-white w-full overflow-x-hidden">
          {/* Main Content - Mobile: Single flex column with all items, Desktop: Two columns */}
          <div className="flex flex-col gap-5 pb-8 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 max-w-[1350px] mx-auto w-full lg:flex-row lg:gap-6 lg:gap-8 overflow-x-hidden">
          {/* Mobile: All content flows in single column, Desktop: Left Column */}
          <div className="[display:contents] lg:flex lg:flex-col gap-5 w-full lg:flex-[1_1_50%] lg:min-w-0 xl:flex-[0_0_65%] xl:min-w-0">
            {/* Franchise Review Card */}
            <div className="bg-[#f4f8fe] flex flex-col rounded-[20px] order-1">
              <div className="bg-white border border-[#A4C6E8] rounded-[20px] flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200">
                {/* Image */}
                <div className="h-[180px] sm:h-[200px] lg:h-[220px] rounded-t-[20px] relative overflow-hidden">
                  {/* HubSpot-ready: Dynamic header image with default fallback */}
                  {(() => {
                    // HubSpot-ready: Access headerImage from brand data, fallback to default
                    const headerImage = (currentBrandData as any)?.headerImage || "/default-brand-header.jpg";
                    
                    return (
                      <>
                        {!headerImageError ? (
                          <img
                            src={headerImage}
                            alt={currentBrandData?.name || "Brand header"}
                            className="w-full h-full object-cover"
                            onError={() => setHeaderImageError(true)}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#446786] to-[#4f7aa5] relative z-0" />
                        )}
                      </>
                    );
                  })()}
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 lg:p-10 pt-0 flex flex-col gap-6 relative">
                  {/* Grade Badge */}
                  <div className="absolute right-4 sm:right-6 lg:right-8 -top-[50px] sm:-top-[56px] lg:-top-[62px] flex flex-col items-center z-[100]">
                    {isLoggedIn ? (
                      // Logged-in: Display grade (HubSpot-friendly, already dynamic)
                      <div className="bg-white border border-[#A4C6E8] rounded-full size-[100px] sm:size-[112px] lg:size-[124px] flex items-center justify-center">
                        <div className="flex flex-col items-center text-center">
                          <div className="text-[58px] sm:text-[64px] lg:text-[71.884px] font-extrabold leading-none text-[#446786]">
                            {brandGrade}
                          </div>
                          <p className="text-xs sm:text-sm lg:text-[14.377px] font-medium text-foreground">GRADE</p>
                        </div>
                      </div>
                    ) : (
                      // Non-logged-in: Button with "?" that links to sign in
                      <button
                        onClick={(e) => handleUnlockClick(e)}
                        className="bg-white border border-[#A4C6E8] rounded-full size-[100px] sm:size-[112px] lg:size-[124px] flex items-center justify-center p-0 hover:scale-110 transition-transform duration-200 cursor-pointer"
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="text-[58px] sm:text-[64px] lg:text-[71.884px] font-extrabold leading-none text-[#446786]">
                            ?
                          </div>
                          <p className="text-xs sm:text-sm lg:text-[14.377px] font-medium text-foreground">GRADE</p>
                        </div>
                      </button>
                    )}
                  </div>
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
                  <div className="flex flex-wrap sm:flex-nowrap gap-6 sm:gap-8 lg:gap-12 items-center">
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
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 items-stretch sm:items-start">
                    {!isLoggedIn && (
                      <Button 
                        className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-6 py-3 text-base font-bold text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        onClick={(e) => handleUnlockClick(e, "snapshot")}
                      >
                        Unlock for the Full Report
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="border border-[#446786] rounded-[30px] px-6 py-3 text-base font-bold text-[#446786] hover:bg-[#446786] hover:text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                      asChild
                    >
                      <Link to="/compare">Compare to similar franchises</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Snapshot Section */}
            <div
              ref={(el) => (sectionRefs.current.snapshot = el)}
              className="bg-white border border-[#A4C6E8] rounded-[20px] flex flex-col gap-6 p-6 sm:p-8 lg:p-10 order-2 shadow-sm hover:shadow-md transition-all duration-200"
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
                The initial cost of a franchise includes several fees{!isLoggedIn && (
                  <>
                    {" "}
                    --{" "}
                    <button
                      onClick={(e) => handleUnlockClick(e, "snapshot")}
                      className="font-bold text-[#54b936] underline hover:text-[#54b936]/80"
                    >
                      Unlock this franchise
                    </button>{" "}
                    to better understand the costs such as training and territory fees.{" "}
                    <span className="font-bold">Sign Up to Unlock Full Cost Breakdown:</span>
                  </>
                )}
                {isLoggedIn && " such as training and territory fees."}
              </p>

              {!isLoggedIn && (
                <Button 
                  className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-6 py-3 text-base font-bold text-white w-fit shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  onClick={(e) => handleUnlockClick(e, "snapshot")}
                >
                  Unlock for the Full Report
                </Button>
              )}

              <div className="flex flex-col gap-5">
                <p className=" font-bold">Top Advantages</p>
                <p className="text-base font-normal text-foreground">
                  {currentBrandData.topAdvantages || `${currentBrandData.name} stands out because it's a recognizable brand in a growing category, supported by years of steady system performance. Buyers appreciate the structured onboarding, predictable startup path, and long-term stability indicators. Its model works well for owners who want a reliable business with strong support from day one.`}
                  <br />
                  <br />
                  This franchise is expanding into new markets and might be available near you. One of our franchise experts will have detailed knowledge about this brand.
                  {!isLoggedIn && (
                    <>
                      {" "}
                      <button
                        onClick={(e) => handleUnlockClick(e, "territories")}
                        className="font-bold text-[#54b936] underline hover:text-[#54b936]/80"
                      >
                        Unlock to learn more
                      </button>{" "}
                      and connect with our experts.
                    </>
                  )}
                  {isLoggedIn && " Connect with our experts to learn more."}
                </p>
              </div>
            </div>

            {/* Investment Overview Section */}
            <div
              ref={(el) => (sectionRefs.current.investment = el)}
              className="bg-white border border-[#A4C6E8] rounded-[20px] flex flex-col gap-6 p-6 sm:p-8 lg:p-10 lg:order-3 order-5 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-[#203d57]" />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Investment Overview</h2>
              </div>
              
              <div className="text-base font-normal text-foreground w-full">
                <p className="font-bold mb-2">How much does a {currentBrandData.name} franchise cost?</p>
                <p>
                  The initial cost of a franchise includes several fees{!isLoggedIn && (
                    <>
                      {" "}
                      --{" "}
                      <button
                        onClick={(e) => handleUnlockClick(e, "investment")}
                        className="font-bold text-[#54b936] underline hover:text-[#54b936]/80"
                      >
                        Unlock this franchise
                      </button>{" "}
                      to better understand the costs such as training and territory fees.
                    </>
                  )}
                  {isLoggedIn && " such as training and territory fees."}
                </p>
              </div>
              
              {/* Investment Content: Cards on left, Chart on right */}
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Left side: Data Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 flex-1 w-full lg:w-auto">
                {/* Total Investment */}
                <div className="bg-white border border-[#A4C6E8] rounded-[20px] flex flex-col items-start justify-center p-4 w-full shadow-sm hover:shadow-md transition-all duration-200">
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
                <div className="bg-white border border-[#A4C6E8] rounded-[20px] flex flex-col items-start justify-center p-4 w-full shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex flex-col gap-2 items-start justify-center w-full">
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: "#446786" }} />
                      <p className="text-sm sm:text-base font-bold text-foreground">Franchise Fee</p>
                    </div>
                    <p className="text-[23.855px] font-normal text-foreground">{formatCurrency(currentBrandData.investment.franchiseFee)}</p>
                  </div>
                </div>

                {/* Working Capital */}
                <div className="bg-white border border-[#A4C6E8] rounded-[20px] flex flex-col items-start justify-center p-4 w-full shadow-sm hover:shadow-md transition-all duration-200">
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
                <div className="w-full lg:max-w-[400px] lg:flex-shrink-0 h-[300px] sm:h-[350px] lg:h-[350px]">
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
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="#ffffff"
                        strokeWidth={3}
                      >
                        {investmentPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                      />
                    </RechartsPieChart>
                  </ChartContainer>
                </div>
              </div>

              {/* Additional Investment Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Ongoing Fees */}
                <div className="bg-white border border-[#A4C6E8] rounded-[20px] flex flex-col items-start justify-center px-6 sm:px-8 lg:px-10 py-6 sm:py-8 w-full shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex flex-col gap-2 items-start justify-center w-full">
                    <p className="text-sm sm:text-base font-bold text-foreground w-full">Ongoing Fees</p>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start w-full">
                      <div className="flex flex-col items-start">
                        <p className="text-[23.855px] font-normal text-foreground">{currentBrandData.investment.royalty || "N/A"}</p>
                        <p className="text-base font-bold text-[#4f7aa5]">Royalty Fees</p>
                      </div>
                      <div className="border-t sm:border-t-0 sm:border-l border-[#A4C6E8] flex flex-col items-start pt-4 sm:pt-0 sm:pl-8 w-full sm:w-auto">
                        <p className="text-[23.855px] font-normal text-foreground">{currentBrandData.investment.marketing || "N/A"}</p>
                        <p className="text-base font-bold text-[#4f7aa5]">Marketing Fees</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Franchise Agreement */}
                <div className="bg-white border border-[#A4C6E8] rounded-[20px] flex flex-col items-start justify-center px-6 sm:px-8 lg:px-10 py-6 sm:py-8 w-full shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex flex-col gap-2 items-start justify-center w-full">
                    <p className="text-sm sm:text-base font-bold text-foreground w-full">Franchise Agreement</p>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start w-full">
                      <div className="flex flex-col items-start">
                        <p className="text-[23.855px] font-normal text-foreground">{currentBrandData.investment.initialTerm || "N/A"}</p>
                        <p className="text-base font-bold text-[#4f7aa5]">Initial Term</p>
                      </div>
                      <div className="border-t sm:border-t-0 sm:border-l border-[#A4C6E8] flex flex-col items-start pt-4 sm:pt-0 sm:pl-8 w-full sm:w-auto">
                        <p className="text-[23.855px] font-normal text-foreground">{currentBrandData.investment.renewalTerm || "N/A"}</p>
                        <p className="text-base font-bold text-[#4f7aa5]">Renewal Term</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Investment Summary Table - Only for logged in users */}
              {isLoggedIn ? (
                <div className="mt-6">
                  <h3 className=" sm:text-xl font-bold text-foreground mb-4">
                    Complete Investment Summary
                  </h3>
                  <div className="bg-[#f4f8fe] border border-[#A4C6E8] rounded-[20px] overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-white border-b border-[#A4C6E8]">
                          <th className="px-6 sm:px-8 py-4 text-left text-sm sm:text-base font-bold text-foreground">
                            Investment Category
                          </th>
                          <th className="px-6 sm:px-8 py-4 text-left text-sm sm:text-base font-bold text-foreground">
                            Details
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#A4C6E8]">
                        {/* Total Investment */}
                        <tr className="bg-white hover:bg-[#f4f8fe] transition-colors duration-150">
                          <td className="px-6 sm:px-8 py-4 text-sm sm:text-base font-semibold text-foreground">
                            Total Investment Range
                          </td>
                          <td className="px-6 sm:px-8 py-4 text-sm sm:text-base text-foreground">
                            {formatCurrency(currentBrandData.investment.min)} - {formatCurrency(currentBrandData.investment.max)}
                          </td>
                        </tr>
                        
                        {/* Franchise Fee */}
                        <tr className="bg-white hover:bg-[#f4f8fe] transition-colors duration-150">
                          <td className="px-6 sm:px-8 py-4 text-sm sm:text-base font-semibold text-foreground">
                            Franchise Fee
                          </td>
                          <td className="px-6 sm:px-8 py-4 text-sm sm:text-base text-foreground">
                            {formatCurrency(currentBrandData.investment.franchiseFee)}
                          </td>
                        </tr>
                        
                        {/* Working Capital */}
                        <tr className="bg-white hover:bg-[#f4f8fe] transition-colors duration-150">
                          <td className="px-6 sm:px-8 py-4 text-sm sm:text-base font-semibold text-foreground">
                            Working Capital
                          </td>
                          <td className="px-6 sm:px-8 py-4 text-sm sm:text-base text-foreground">
                            {formatCurrency(currentBrandData.investment.workingCapital)}
                          </td>
                        </tr>
                        
                        {/* Royalty Fees */}
                        <tr className="bg-white hover:bg-[#f4f8fe] transition-colors duration-150">
                          <td className="px-6 sm:px-8 py-4 text-sm sm:text-base font-semibold text-foreground">
                            Royalty Fees (Ongoing)
                          </td>
                          <td className="px-6 sm:px-8 py-4 text-sm sm:text-base text-foreground">
                            {currentBrandData.investment.royalty || "N/A"}
                          </td>
                        </tr>
                        
                        {/* Marketing Fees */}
                        <tr className="bg-white hover:bg-[#f4f8fe] transition-colors duration-150">
                          <td className="px-6 sm:px-8 py-4 text-sm sm:text-base font-semibold text-foreground">
                            Marketing/Advertising Fees
                          </td>
                          <td className="px-6 sm:px-8 py-4 text-sm sm:text-base text-foreground">
                            {currentBrandData.investment.marketing || "N/A"}
                          </td>
                        </tr>
                        
                        {/* Initial Term */}
                        <tr className="bg-white hover:bg-[#f4f8fe] transition-colors duration-150">
                          <td className="px-6 sm:px-8 py-4 text-sm sm:text-base font-semibold text-foreground">
                            Initial Franchise Term
                          </td>
                          <td className="px-6 sm:px-8 py-4 text-sm sm:text-base text-foreground">
                            {currentBrandData.investment.initialTerm || "N/A"}
                          </td>
                        </tr>
                        
                        {/* Renewal Term */}
                        <tr className="bg-white hover:bg-[#f4f8fe] transition-colors duration-150">
                          <td className="px-6 sm:px-8 py-4 text-sm sm:text-base font-semibold text-foreground">
                            Renewal Term
                          </td>
                          <td className="px-6 sm:px-8 py-4 text-sm sm:text-base text-foreground">
                            {currentBrandData.investment.renewalTerm || "N/A"}
                          </td>
                        </tr>
                        
                        {/* Training & Support Costs - New */}
                        <tr className="bg-white hover:bg-[#f4f8fe] transition-colors border-t border-[#A4C6E8]">
                          <td className="px-4 sm:px-6 py-4 text-sm sm:text-base font-semibold text-foreground">
                            Training & Support Costs
                          </td>
                          <td className="px-6 sm:px-8 py-4 text-sm sm:text-base text-foreground">
                            Included in franchise fee or varies by location
                          </td>
                        </tr>
                        
                        {/* Real Estate/Lease Requirements - New */}
                        <tr className="bg-white hover:bg-[#f4f8fe] transition-colors duration-150">
                          <td className="px-6 sm:px-8 py-4 text-sm sm:text-base font-semibold text-foreground">
                            Real Estate & Lease Requirements
                          </td>
                          <td className="px-6 sm:px-8 py-4 text-sm sm:text-base text-foreground">
                            Varies by location and market conditions
                          </td>
                        </tr>
                        
                        {/* Equipment & Inventory - New */}
                        <tr className="bg-white hover:bg-[#f4f8fe] transition-colors duration-150">
                          <td className="px-6 sm:px-8 py-4 text-sm sm:text-base font-semibold text-foreground">
                            Equipment & Initial Inventory
                          </td>
                          <td className="px-6 sm:px-8 py-4 text-sm sm:text-base text-foreground">
                            Included in total investment range
                          </td>
                        </tr>
                        
                        {/* Liquid Capital Requirements - New */}
                        <tr className="bg-white hover:bg-[#f4f8fe] transition-colors duration-150">
                          <td className="px-6 sm:px-8 py-4 text-sm sm:text-base font-semibold text-foreground">
                            Liquid Capital Required
                          </td>
                          <td className="px-6 sm:px-8 py-4 text-sm sm:text-base text-foreground">
                            Typically 20-30% of total investment
                          </td>
                        </tr>
                        
                        {/* Net Worth Requirements - New */}
                        <tr className="bg-white hover:bg-[#f4f8fe] transition-colors duration-150">
                          <td className="px-6 sm:px-8 py-4 text-sm sm:text-base font-semibold text-foreground">
                            Minimum Net Worth Required
                          </td>
                          <td className="px-6 sm:px-8 py-4 text-sm sm:text-base text-foreground">
                            Varies by franchise system
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                    {/* Expert Note */}
                    <div className="mt-6 p-6 bg-[#f4f8fe] border-l-4 border-[#54b936] rounded-r-[20px] shadow-sm">
                      <p className="text-sm sm:text-base text-foreground">
                        <span className="font-bold">Expert Note:</span> This summary provides key investment metrics that franchise experts review. 
                        Additional costs may include legal fees, accounting services, insurance, and local permits. 
                        Always review the Franchise Disclosure Document (FDD) for complete details and consult with a franchise advisor.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 p-6 bg-[#f4f8fe] border border-[#A4C6E8] rounded-[20px] text-center">
                    <p className="text-base font-semibold text-foreground mb-2">
                      Unlock Complete Investment Summary
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Sign in to view the comprehensive investment breakdown including training costs, real estate requirements, equipment needs, and capital requirements.
                    </p>
                    <Button 
                      className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-6 py-3 text-base font-bold text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                      onClick={(e) => handleUnlockClick(e, "profitability")}
                    >
                      Unlock for the Full Report
                    </Button>
                  </div>
                )}
            </div>

            {/* Net Franchisee Growth Section - Only for logged in users */}
            {isLoggedIn && (
              <div className="bg-white border border-[#A4C6E8] rounded-[20px] flex flex-col gap-6 p-6 sm:p-8 lg:p-10 lg:order-4 order-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-[#203d57]" />
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">Net Franchisee Growth</h2>
                </div>

                {/* Growth Comparison Chart */}
                <div className="bg-[#f4f8fe] border border-[#A4C6E8] rounded-[20px] p-6 sm:p-8 shadow-sm">
                  <div className="mb-6">
                    <p className="text-base sm: font-bold text-foreground mb-2">
                      {currentBrandData.name} vs Competitors
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Net Franchisee Growth Score
                    </p>
                  </div>
                  
                  <ChartContainer
                    config={{
                      brand: {
                        label: currentBrandData.name,
                        color: "#446786",
                      },
                      competitors: {
                        label: "Competitors Average",
                        color: "#54b936",
                      },
                    }}
                    className="h-[250px] sm:h-[300px] w-full"
                  >
                    <BarChart
                      data={[
                        {
                          name: "Net Growth",
                          brand: (currentBrandData as any)?.profitability?.netGrowthScore ?? 20,
                          competitors: (currentBrandData as any)?.profitability?.competitorsAverage ?? 15,
                        },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#dee8f2" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#8c9aa5" 
                        style={{ fontSize: '12px' }}
                        tick={{ fill: '#8c9aa5' }}
                      />
                      <YAxis 
                        stroke="#8c9aa5" 
                        style={{ fontSize: '12px' }}
                        tick={{ fill: '#8c9aa5' }}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        cursor={{ fill: 'rgba(68, 103, 134, 0.1)' }}
                      />
                      <Bar dataKey="brand" fill="#446786" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="competitors" fill="#54b936" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ChartContainer>

                  {/* Growth Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    <div className="bg-white border border-[#A4C6E8] rounded-[20px] p-6 text-center shadow-sm hover:shadow-md transition-all duration-200">
                      <p className="text-2xl sm:text-3xl font-bold text-[#446786] mb-1">
                        {(currentBrandData as any)?.profitability?.netGrowthScore ?? 20}
                      </p>
                      <p className="text-sm font-semibold text-foreground">{currentBrandData?.name || "Brand"}</p>
                    </div>
                    <div className="bg-white border border-[#A4C6E8] rounded-[20px] p-6 text-center shadow-sm hover:shadow-md transition-all duration-200">
                      <p className="text-2xl sm:text-3xl font-bold text-[#54b936] mb-1">
                        {(currentBrandData as any)?.profitability?.competitorsAverage ?? 15}
                      </p>
                      <p className="text-sm font-semibold text-foreground">Competitors Average</p>
                    </div>
                    <div className="bg-white border border-[#A4C6E8] rounded-[20px] p-6 text-center shadow-sm hover:shadow-md transition-all duration-200">
                      <p className="text-2xl sm:text-3xl font-bold text-[#203d57] mb-1">
                        +{((currentBrandData as any)?.profitability?.netGrowthScore ?? 20) - ((currentBrandData as any)?.profitability?.competitorsAverage ?? 15)}
                      </p>
                      <p className="text-sm font-semibold text-foreground">Above Average</p>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="bg-[#f4f8fe] border-l-4 border-[#54b936] rounded-r-[20px] p-6 sm:p-8 shadow-sm">
                  <p className="text-base font-semibold text-foreground mb-2">
                    What is Net Franchisee Growth?
                  </p>
                  <p className="text-sm sm:text-base text-foreground leading-relaxed">
                    Net Franchisee Growth is the total number of new franchise locations opened minus the number of existing locations that were closed during the same period.
                  </p>
                </div>

                {/* Questions to Ask */}
                <div className="bg-white border border-[#A4C6E8] rounded-[20px] p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-200">
                  <p className="text-base sm: font-bold text-foreground mb-4">
                    Make sure to ask...
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#54b936] mt-2 flex-shrink-0" />
                      <p className="text-sm sm:text-base text-foreground">
                        <span className="font-semibold">How many outlets closed?</span> Understanding closures helps assess system health and potential issues.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#54b936] mt-2 flex-shrink-0" />
                      <p className="text-sm sm:text-base text-foreground">
                        <span className="font-semibold">How many opened?</span> New openings indicate growth momentum and franchisee confidence.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#54b936] mt-2 flex-shrink-0" />
                      <p className="text-sm sm:text-base text-foreground">
                        <span className="font-semibold">Is the Net Franchisee Growth positive or negative?</span> Positive growth suggests a healthy, expanding system.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#54b936] mt-2 flex-shrink-0" />
                      <p className="text-sm sm:text-base text-foreground">
                        <span className="font-semibold">How do the different franchise systems compare?</span> Compare growth rates across similar brands in the industry.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Did You Know Section */}
                <div className="bg-[#f4f8fe] border border-[#A4C6E8] rounded-[20px] p-6 sm:p-8 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#54b936] rounded-full p-2 flex-shrink-0">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base sm: font-bold text-foreground mb-2">
                        Did you know?
                      </p>
                      <p className="text-sm sm:text-base text-foreground leading-relaxed">
                        One of the most important measures of the health of any franchise system is the growth of the franchise network. Positive franchise outlet growth sustained over time is a major difference between healthy and unhealthy franchise systems. However, some franchise systems can demonstrate dynamic outlet growth, despite being labeled as unsuccessful systems.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profitability Section */}
            <div
              ref={(el) => (sectionRefs.current.profitability = el)}
              className="bg-white border border-[#A4C6E8] rounded-[20px] flex flex-col gap-6 p-6 sm:p-8 lg:p-10 lg:order-5 order-8 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-[#203d57]" />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Profitability & Earnings</h2>
              </div>
              
              <div className="text-base font-normal text-foreground w-full">
                <p className="font-bold mb-2">How much does a {currentBrandData.name} franchise make?</p>
                <p>
                  Franchise revenue and profits depend on a number of unique variables, including local demand for your product, labor costs, commercial lease rates and several other factors. We can help you figure out how much money you can make by reviewing your specific situation.
                  {!isLoggedIn && (
                    <>
                      {" "}
                      Please{" "}
                      <button
                        onClick={(e) => handleUnlockClick(e, "profitability")}
                        className="font-bold text-[#54b936] underline hover:text-[#54b936]/80"
                      >
                        unlock this franchise
                      </button>{" "}
                      for more information.
                    </>
                  )}
                </p>
              </div>
              
              {/* Profitability Metrics - 3 boxes aligned */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                {/* Item 19 Disclosure */}
                <div className="bg-white border border-[#A4C6E8] rounded-[20px] flex flex-col items-start justify-center px-6 sm:px-8 lg:px-10 py-6 sm:py-8 w-full shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex flex-col gap-2 items-start justify-center w-full">
                    <p className="text-sm sm:text-base font-bold text-foreground w-full">Item 19 Disclosure</p>
                    <p className="text-[23.855px] font-normal text-foreground">{currentBrandData.profitability?.item19Disclosed || "N/A"}</p>
                  </div>
                </div>

                {/* Benchmark */}
                <div className="bg-white border border-[#A4C6E8] rounded-[20px] flex flex-col items-start justify-center px-6 sm:px-8 lg:px-10 py-6 sm:py-8 w-full shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex flex-col gap-2 items-start justify-center w-full">
                    <p className="text-sm sm:text-base font-bold text-foreground w-full">Benchmark vs Category</p>
                    <p className="text-[23.855px] font-normal text-foreground">{currentBrandData.profitability?.benchmarkVsCategory || "N/A"}</p>
                  </div>
                </div>

                {/* Owner Workload Impact */}
                <div className="bg-white border border-[#A4C6E8] rounded-[20px] flex flex-col items-start justify-center px-6 sm:px-8 lg:px-10 py-6 sm:py-8 w-full shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex flex-col gap-2 items-start justify-center w-full">
                    <p className="text-sm sm:text-base font-bold text-foreground w-full">Owner Workload Impact</p>
                    <p className="text-[23.855px] font-normal text-foreground">{currentBrandData.profitability?.ownerWorkloadImpact || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Franchisee Turnover Rate - Only for logged in users */}
              {isLoggedIn && (
                <div className="mt-4 border-t border-[#A4C6E8] pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <BarChart3 className="w-5 h-5 text-[#203d57]" />
                    <h3 className=" sm:text-xl font-bold text-foreground">
                      Franchisee Turnover Rate (Average)
                    </h3>
                  </div>

                  {/* Turnover Score with Visual Gauge */}
                  <div className="bg-[#f4f8fe] border border-[#A4C6E8] rounded-[20px] p-6 mb-4">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      {/* Visual Gauge */}
                      <div className="flex-shrink-0">
                        <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                          {/* Background Circle */}
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            {/* Green range (0-30) */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#54b936"
                              strokeWidth="8"
                              strokeDasharray={`${(30 / 100) * 251.2} 251.2`}
                              className="opacity-30"
                            />
                            {/* Yellow range (30-60) */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#fbbf24"
                              strokeWidth="8"
                              strokeDasharray={`${(30 / 100) * 251.2} 251.2`}
                              strokeDashoffset={`-${(30 / 100) * 251.2}`}
                              className="opacity-30"
                            />
                            {/* Red range (60-100) */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#ef4444"
                              strokeWidth="8"
                              strokeDasharray={`${(40 / 100) * 251.2} 251.2`}
                              strokeDashoffset={`-${(60 / 100) * 251.2}`}
                              className="opacity-30"
                            />
                            {/* Score indicator */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke={turnoverScore <= 30 ? "#54b936" : turnoverScore <= 60 ? "#fbbf24" : "#ef4444"}
                              strokeWidth="8"
                              strokeDasharray={`${(turnoverScore / 100) * 251.2} 251.2`}
                              strokeLinecap="round"
                            />
                          </svg>
                          {/* Score Text */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl sm:text-4xl font-bold text-foreground">{turnoverScore}</span>
                            <span className="text-xs text-muted-foreground">Score</span>
                          </div>
                        </div>
                      </div>

                      {/* Score Info */}
                      <div className="flex-1">
                        <div className="mb-3">
                          <p className="text-sm text-muted-foreground mb-1">Turnover Score</p>
                          <p className="text-2xl sm:text-3xl font-bold text-foreground">{turnoverScore}</p>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-3 h-3 rounded-full ${turnoverScore <= 30 ? "bg-[#54b936]" : turnoverScore <= 60 ? "bg-[#fbbf24]" : "bg-[#ef4444]"}`} />
                          <p className="text-sm text-foreground">
                            {turnoverScore <= 30 ? "Healthy Range" : turnoverScore <= 60 ? "Moderate Range" : "High Range"}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Based on data from 2021 - 2023
                        </p>
                      </div>
                    </div>

                    {/* Range Legend */}
                    <div className="mt-6 flex flex-wrap gap-4 justify-center text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[#54b936] opacity-30" />
                        <span className="text-muted-foreground">Green (0-30): Healthy</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[#fbbf24] opacity-30" />
                        <span className="text-muted-foreground">Yellow (30-60): Moderate</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[#ef4444] opacity-30" />
                        <span className="text-muted-foreground">Red (60-100): High</span>
                      </div>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="bg-white border border-[#A4C6E8] rounded-[20px] p-6 sm:p-8 mb-6 shadow-sm hover:shadow-md transition-all duration-200">
                    <p className="text-sm sm:text-base text-foreground leading-relaxed mb-3">
                      <span className="font-semibold">Franchisee Turnover Rate</span> is calculated by adding transfers, terminations, non-renewals, reacquired and ceased operations, then dividing by currently operating outlets. This is a key indicator of system health.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Our Franchise Analysts look for turnover rates in the <span className="font-semibold text-[#54b936]">green range</span> when identifying healthy systems.
                    </p>
                  </div>

                  {/* Did You Know */}
                  <div className="bg-[#f4f8fe] border-l-4 border-[#54b936] rounded-r-[20px] p-6 sm:p-8 shadow-sm">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-[#54b936] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm sm:text-base font-bold text-foreground mb-2">Did you know?</p>
                        <p className="text-sm text-foreground leading-relaxed">
                          Turnover can be both good and bad. <span className="font-semibold">Transfers are good</span> - franchisees selling profitable businesses. <span className="font-semibold">Terminations and closures are red flags</span> - indicating franchisees aren't making money. Pay attention to the <span className="font-semibold">types of turnover</span> when selecting a franchise.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Comparison Section */}
            <div
              ref={(el) => (sectionRefs.current.comparison = el)}
              className="bg-white border border-[#A4C6E8] rounded-[20px] flex flex-col gap-6 p-6 sm:p-8 lg:p-10 lg:order-5 order-10 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-6 sm:gap-4">
                <div className="flex flex-col gap-4 sm:gap-5 items-start w-full min-w-0">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-[#203d57] flex-shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">Comparison & Analysis</h2>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-foreground w-full">Where {currentBrandData.name} stands out:</p>
                  
                  <div className="flex flex-col items-start w-full min-w-0">
                    {(currentBrandData.comparisonStrengths || [
                      "Performs above category benchmarks in {top strengths}",
                      "Stronger growth and more consistent performance in {top strengths}",
                      "Lower risk indicators than similar brands in {top strengths}",
                    ]).map((item, index) => (
                      <div key={index} className="bg-transparent flex gap-2 items-start sm:items-center pl-2 sm:pl-4 pr-4 sm:pr-6 py-2 rounded-[30px] w-full min-w-0">
                        <img src="/check-filled.svg" alt="" className="w-4 h-4 flex-shrink-0 mt-0.5 sm:mt-0" />
                        <p className="text-sm sm:text-base font-normal text-foreground break-words w-full">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Royalties Section - Only for logged in users */}
              {isLoggedIn && (
                <div className="flex flex-col gap-6 items-start w-full">
                  <div>
                    <h3 className="text-base sm: font-bold text-foreground mb-2">ROYALTIES</h3>
                    <p className="text-sm sm:text-base text-foreground leading-relaxed">
                      Royalties are fees you pay to the franchisor on a regular basis. Franchisors make you pay royalty fees and other fees. These fees must be paid on top of operating costs like payroll, utilities, telephone and monthly lease payments.
                    </p>
                  </div>

                  {/* Royalties Chart */}
                  <div className="bg-white border border-[#A4C6E8] rounded-[20px] flex flex-col gap-4 p-6 sm:p-8 w-full shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[#446786]" />
                        <span className="text-sm font-medium text-foreground">{currentBrandData.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[#54b936]" />
                        <span className="text-sm font-medium text-foreground">Competitors</span>
                      </div>
                    </div>
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
                      className="h-[250px] sm:h-[300px] w-full"
                    >
                      <BarChart
                        data={royaltiesComparisonData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#dee8f2" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          stroke="#8c9aa5" 
                          style={{ fontSize: '12px' }}
                          tick={{ fill: '#8c9aa5' }}
                          height={60}
                          interval={0}
                        />
                        <YAxis 
                          stroke="#8c9aa5" 
                          style={{ fontSize: '12px' }} 
                          domain={[0, 8]}
                          tick={{ fill: '#8c9aa5' }}
                        />
                        <ChartTooltip 
                          content={<ChartTooltipContent />}
                          cursor={{ fill: 'rgba(68, 103, 134, 0.1)' }}
                        />
                        <Bar dataKey="brand" fill="#446786" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="competitors" fill="#54b936" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                    <p className="text-sm text-muted-foreground break-words">
                      Note(s): {currentBrandData.investment.royalty || "N/A"} of Gross Revenues
                    </p>
                  </div>

                  {/* Key Considerations */}
                  <div className="bg-[#f4f8fe] border border-[#A4C6E8] rounded-[20px] p-4 sm:p-6 w-full">
                    <p className="text-sm sm:text-base font-bold text-foreground mb-3">Key considerations include...</p>
                    <div className="space-y-2">
                      {[
                        "What ongoing fees will you be paying?",
                        "How often do you have to pay these fees?",
                        "What percentage (%) of your gross revenue will be used to pay these fees?",
                        "Is there a minimum fee amount you have to pay?",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#54b936] mt-2 flex-shrink-0" />
                          <p className="text-sm text-foreground">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Initial and Renewal Terms Section - Only for logged in users */}
              {isLoggedIn && (
                <div className="flex flex-col gap-6 items-start w-full">
                  <div>
                    <h3 className="text-base sm: font-bold text-foreground mb-2">INITIAL AND RENEWAL TERMS</h3>
                    <p className="text-sm sm:text-base text-foreground leading-relaxed">
                      This graph shows how long the initial and renewal franchise terms are in years. The longer the initial franchise term is, the more stable the business will be and the longer you will be able to operate it under the original terms & conditions.
                    </p>
                  </div>

                  {/* Terms Chart */}
                  <div className="bg-white border border-[#A4C6E8] rounded-[20px] flex flex-col gap-4 p-6 sm:p-8 w-full shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[#446786]" />
                        <span className="text-sm font-medium text-foreground">{currentBrandData.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[#54b936]" />
                        <span className="text-sm font-medium text-foreground">Competitors</span>
                      </div>
                    </div>
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
                      className="h-[250px] sm:h-[300px] w-full"
                    >
                      <BarChart
                        data={termsComparisonData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#dee8f2" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          stroke="#8c9aa5" 
                          style={{ fontSize: '12px' }}
                          tick={{ fill: '#8c9aa5' }}
                          height={60}
                          interval={0}
                        />
                        <YAxis 
                          stroke="#8c9aa5" 
                          style={{ fontSize: '12px' }} 
                          domain={[0, 25]}
                          tick={{ fill: '#8c9aa5' }}
                        />
                        <ChartTooltip 
                          content={<ChartTooltipContent />}
                          cursor={{ fill: 'rgba(68, 103, 134, 0.1)' }}
                        />
                        <Bar dataKey="brand" fill="#446786" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="competitors" fill="#54b936" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                    <p className="text-sm text-muted-foreground break-words">
                      Note(s): {currentBrandData.investment.initialTerm || "N/A"}. {currentBrandData.investment.renewalTerm ? `If you are in good standing, you can add "unlimited additional terms" of ${currentBrandData.investment.renewalTerm} each.` : "Renewal terms vary by franchise system."}
                    </p>
                  </div>

                  {/* Remember to Check */}
                  <div className="bg-[#f4f8fe] border border-[#A4C6E8] rounded-[20px] p-4 sm:p-6 w-full">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-[#203d57]" />
                      <p className="text-sm sm:text-base font-bold text-foreground">Remember to check...</p>
                    </div>
                    <div className="space-y-2">
                      {[
                        "How much does it cost to renew the franchise?",
                        "How many times can the franchise be renewed?",
                        "How can the franchise agreement be terminated?",
                        "What do you need to do if you want to renew?",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#54b936] mt-2 flex-shrink-0" />
                          <p className="text-sm text-foreground">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Simple charts for non-logged in users */}
              {!isLoggedIn && (
                <div className="flex flex-col gap-6 items-start w-full">
                  <h3 className="text-base sm: font-bold text-foreground w-full">
                    {currentBrandData.industryBenchmarking || `${currentBrandData.category || "Industry"} Benchmarking`}
                  </h3>
                  
                  {/* Charts Grid - 1 column on mobile, 2 columns on larger screens */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
                    {/* Royalty Comparison Chart */}
                    <div className="bg-white border border-[#A4C6E8] rounded-[20px] flex flex-col gap-4 p-6 sm:p-8 w-full min-w-0 shadow-sm hover:shadow-md transition-all duration-200">
                      <p className="text-base sm: font-bold text-foreground">Royalty Rate</p>
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
                          data={simpleRoyaltyComparisonData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#dee8f2" vertical={false} />
                          <XAxis 
                            dataKey="name" 
                            stroke="#8c9aa5" 
                            style={{ fontSize: '12px' }}
                            tick={{ fill: '#8c9aa5' }}
                          />
                          <YAxis 
                            stroke="#8c9aa5" 
                            style={{ fontSize: '12px' }} 
                            domain={[0, 8]}
                            tick={{ fill: '#8c9aa5' }}
                          />
                          <ChartTooltip 
                            content={<ChartTooltipContent />}
                            cursor={{ fill: 'rgba(68, 103, 134, 0.1)' }}
                          />
                          <Bar dataKey="brand" fill="#446786" radius={[8, 8, 0, 0]} />
                          <Bar dataKey="competitors" fill="#54b936" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ChartContainer>
                      <p className="text-sm text-muted-foreground break-words">Note(s): {currentBrandData.investment.royalty || "N/A"} of Gross Revenues</p>
                    </div>

                    {/* Initial Term Comparison Chart */}
                    <div className="bg-white border border-[#A4C6E8] rounded-[20px] flex flex-col gap-4 p-6 sm:p-8 w-full min-w-0 shadow-sm hover:shadow-md transition-all duration-200">
                      <p className="text-base sm: font-bold text-foreground">Initial Term</p>
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
                          data={simpleInitialTermComparisonData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#dee8f2" vertical={false} />
                          <XAxis 
                            dataKey="name" 
                            stroke="#8c9aa5" 
                            style={{ fontSize: '12px' }}
                            tick={{ fill: '#8c9aa5' }}
                          />
                          <YAxis 
                            stroke="#8c9aa5" 
                            style={{ fontSize: '12px' }} 
                            domain={[0, 25]}
                            tick={{ fill: '#8c9aa5' }}
                          />
                          <ChartTooltip 
                            content={<ChartTooltipContent />}
                            cursor={{ fill: 'rgba(68, 103, 134, 0.1)' }}
                          />
                          <Bar dataKey="brand" fill="#446786" radius={[8, 8, 0, 0]} />
                          <Bar dataKey="competitors" fill="#54b936" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ChartContainer>
                      <p className="text-sm text-muted-foreground break-words">Note(s): {currentBrandData.investment.initialTerm || "N/A"}</p>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Button className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-8 py-2 text-base font-bold text-white flex-1" asChild>
                      <button
                        onClick={(e) => handleUnlockClick(e, "comparison")}
                        className="w-full"
                      >
                        Unlock to see the complete graphics
                      </button>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border border-[#446786] rounded-[30px] px-9 py-2 text-base font-bold text-[#446786] flex-1"
                      asChild
                    >
                      <Link to="/compare">Compare to similar franchises</Link>
                    </Button>
                  </div>
                </div>
              )}

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
              className="bg-white border border-[#A4C6E8] rounded-[20px] flex flex-col gap-6 p-6 sm:p-8 lg:p-10 lg:order-6 order-12 shadow-sm hover:shadow-md transition-all duration-200"
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

              {/* General territory information - Only for non-logged-in users */}
              {!isLoggedIn && (
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
                    This franchise is expanding into new markets and might be available near you. One of our franchise experts will have detailed knowledge about this brand.
                    {" "}
                    <button
                      onClick={(e) => handleUnlockClick(e, "territories")}
                      className="font-bold text-[#54b936] underline hover:text-[#54b936]/80"
                    >
                      Unlock to learn more
                    </button>{" "}
                    and connect with our experts.
                  </p>
                </div>
              )}

              {/* Available/Sold-Out Territories - Only for logged in users */}
              {isLoggedIn && (() => {
                // HubSpot-ready: This data structure can be replaced with API data
                // Expected format: { availableStates: string[], soldOutStates: string[] }
                const territoriesData = (currentBrandData as any)?.territories || {};
                const availableStates = territoriesData.availableStates || [
                  "California", "Texas", "Florida", "Arizona", "Nevada", 
                  "Colorado", "Washington", "Oregon", "Utah", "Idaho"
                ];
                const soldOutStates = territoriesData.soldOutStates || [
                  "New York", "New Jersey", "Pennsylvania", "Illinois", "Ohio",
                  "Michigan", "Massachusetts", "Connecticut", "Maryland", "Virginia",
                  "North Carolina", "Georgia", "Tennessee", "Indiana", "Wisconsin"
                ];

                return (
                  <div className="mt-6 border-t border-[#A4C6E8] pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      {/* Available Territories */}
                      <div className="bg-[#f4f8fe] border border-[#A4C6E8] rounded-[20px] p-6 sm:p-8 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-3 h-3 rounded-full bg-[#54b936]" />
                          <div className="flex items-center justify-between w-full">
                            <p className="text-base sm: font-bold text-foreground">Available Territories</p>
                            <span className="text-sm font-semibold text-[#54b936] bg-white px-3 py-1 rounded-full">
                              {availableStates.length} states
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {availableStates.map((state: string, index: number) => (
                            <div
                              key={index}
                              className="bg-white border border-[#A4C6E8] text-[#54b936] px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5"
                            >
                              <div className="w-2 h-2 rounded-full bg-[#54b936]" />
                              {state}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-4">
                          Territories currently open for new franchisees
                        </p>
                      </div>

                      {/* Sold-Out Territories */}
                      <div className="bg-[#f4f8fe] border border-[#A4C6E8] rounded-[20px] p-6 sm:p-8 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-3 h-3 rounded-full bg-[#a6a6a6]" />
                          <div className="flex items-center justify-between w-full">
                            <p className="text-base sm: font-bold text-foreground">Sold-Out Territories</p>
                            <span className="text-sm font-semibold text-foreground bg-white px-3 py-1 rounded-full border border-[#A4C6E8]">
                              {soldOutStates.length} states
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {soldOutStates.map((state: string, index: number) => (
                            <div
                              key={index}
                              className="bg-white border border-[#A4C6E8] text-foreground px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5"
                            >
                              <div className="w-2 h-2 rounded-full bg-[#a6a6a6]" />
                              {state}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-4">
                          Territories already occupied by existing franchisees
                        </p>
                      </div>
                    </div>

                    {/* ZIP Code CTA */}
                    <div className="bg-white border border-[#A4C6E8] rounded-[20px] p-6 sm:p-8 mt-6 shadow-sm hover:shadow-md transition-all duration-200">
                      <p className="text-base sm: font-semibold text-foreground mb-3 text-center">
                        Territories are limited. Enter your ZIP code to confirm availability in your market.
                      </p>
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          const zipCode = formData.get('zipCode');
                          // HubSpot-ready: Can send to HubSpot Forms API or track as engagement
                          console.log('ZIP code submitted:', zipCode);
                          // In production, this would check territory availability
                        }}
                        className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
                      >
                        <Input
                          name="zipCode"
                          type="text"
                          placeholder="Enter your ZIP code"
                          className="flex-1 h-12 text-base border-border focus:border-[#A4C6E8] focus:ring-[#A4C6E8] rounded-[30px]"
                          pattern="[0-9]{5}"
                          maxLength={5}
                          required
                        />
                        <Button 
                          type="submit"
                          className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-8 py-2 text-base font-bold text-white h-12 whitespace-nowrap"
                        >
                          Check Availability
                        </Button>
                      </form>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Requirements Section */}
            <div
              ref={(el) => (sectionRefs.current.requirements = el)}
              className="bg-white border border-[#A4C6E8] rounded-[20px] flex flex-col gap-6 p-6 sm:p-8 lg:p-10 lg:order-7 order-[100] shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-3 w-full">
                <div className="flex items-center gap-3">
                  {isLoggedIn ? (
                    <UserCheck className="w-6 h-6 text-[#203d57] flex-shrink-0" />
                  ) : (
                    <Lock className="w-6 h-6 text-[#203d57] flex-shrink-0" />
                  )}
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">Requirements</h2>
                </div>
                {!isLoggedIn && (
                  <Button 
                    className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-5 py-2 text-base font-bold text-white w-full sm:w-auto"
                    onClick={(e) => handleUnlockClick(e, "requirements")}
                  >
                    Unlock This Brand
                  </Button>
                )}
              </div>

              {/* Requirements content - Only for logged-in users */}
              {isLoggedIn && (() => {
                // HubSpot-ready: This data structure can be replaced with API data
                const systemName = currentBrandData?.name || "Franchise";
                
                // Ideal Franchise Owner Profile - HubSpot-ready
                // Access via optional chaining with fallbacks
                const idealProfileIntro = (currentBrandData as any)?.requirements?.idealProfileIntro || `We're looking for passionate entrepreneurs who want to turn their love for animals into a meaningful, successful business.`;
                const idealProfileDescription = (currentBrandData as any)?.requirements?.idealProfileDescription || `Our ideal franchise owners are community-minded leaders with strong people skills, a passion to deliver exceptional service, and a desire to build a lifestyle of freedom and fulfillment. They value trust, quality care, and are motivated by the joy of creating a safe, home-away-from-home for pets while building a lasting legacy in their community.`;
                
                // Ideal Background - HubSpot-ready
                const idealBackground = (currentBrandData as any)?.requirements?.idealBackground || [
                  "Leadership or business management experience",
                  "Customer service focus",
                  "Community-oriented mindset",
                  "Desire for lifestyle, freedom and business ownership",
                  "Love of pets and people"
                ];
                
                // Requirements - HubSpot-ready
                const liquidCapital = (currentBrandData as any)?.requirements?.liquidCapital || (currentBrandData?.investment as any)?.liquidCapital || "$450K+";
                const netWorth = (currentBrandData as any)?.requirements?.netWorth || (currentBrandData?.investment as any)?.netWorth || "$1.2M+";
                const totalInvestment = currentBrandData?.investment ? `$${(currentBrandData.investment.min / 1000).toFixed(0)}K–$${(currentBrandData.investment.max / 1000).toFixed(0)}M` : "$798K–$1.6M";
                const targetMarkets = (currentBrandData as any)?.requirements?.targetMarkets || "Suburban and metro areas";
                const idealRegions = (currentBrandData as any)?.requirements?.idealRegions || "Southeast, Northeast, Texas, and Rust Belt states";

                return (
                  <div className="flex flex-col gap-6">
                    {/* Ideal Franchise Owner Profile */}
                    <div className="space-y-4">
                      <p className="font-bold text-foreground">
                        Ideal Franchise Owner Profile
                      </p>
                      <p className="text-base text-foreground">
                        {idealProfileIntro}
                      </p>
                      <p className="text-base text-foreground">
                        {idealProfileDescription}
                      </p>
                    </div>

                    {/* Ideal Background */}
                    <div className="space-y-4">
                      <p className=" sm:text-xl font-bold text-foreground">
                        IDEAL BACKGROUND
                      </p>
                      <ul className="space-y-2.5">
                        {idealBackground.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <img src="/check-filled.svg" alt="" className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span className="text-base text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Requirements */}
                    <div className="space-y-4">
                      <p className=" sm:text-xl font-bold text-foreground">
                        REQUIREMENTS
                      </p>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <span className="text-base font-semibold text-foreground min-w-[140px]">Liquid Capital:</span>
                          <span className="text-base text-foreground">{liquidCapital}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <span className="text-base font-semibold text-foreground min-w-[140px]">Net Worth:</span>
                          <span className="text-base text-foreground">{netWorth}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <span className="text-base font-semibold text-foreground min-w-[140px]">Total Investment:</span>
                          <span className="text-base text-foreground">{totalInvestment}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <span className="text-base font-semibold text-foreground min-w-[140px]">Target Markets:</span>
                          <span className="text-base text-foreground">{targetMarkets}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-start gap-2 mt-2">
                          <span className="text-base font-semibold text-foreground min-w-[140px]">Ideal regions:</span>
                          <span className="text-base text-foreground">{idealRegions}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Next Steps Section */}
            <div
              ref={(el) => (sectionRefs.current["next-steps"] = el)}
              className="bg-white border border-[#A4C6E8] rounded-[20px] flex flex-col gap-6 p-6 sm:p-8 lg:p-10 lg:order-8 order-[101] shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-3 w-full">
                <div className="flex items-center gap-3">
                  {isLoggedIn ? (
                    <List className="w-6 h-6 text-[#203d57] flex-shrink-0" />
                  ) : (
                    <Lock className="w-6 h-6 text-[#203d57] flex-shrink-0" />
                  )}
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">Next Steps</h2>
                </div>
                {!isLoggedIn && (
                  <Button 
                    className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-5 py-2 text-base font-bold text-white w-full sm:w-auto"
                    onClick={(e) => handleUnlockClick(e, "requirements")}
                  >
                    Unlock This Brand
                  </Button>
                )}
              </div>

              {/* Step-by-step guide - Only for logged-in users */}
              {isLoggedIn && (() => {
                // HubSpot-ready: This data structure can be replaced with API data
                const systemName = currentBrandData?.name || "Franchise";

                return (
                  <div className="flex flex-col gap-8">
                    {/* Intro Section */}
                    <div className="space-y-4">
                      <p className=" font-bold text-foreground leading-tight">
                        How to become a {systemName} Franchise?
                      </p>
                      <p className="text-base text-foreground">
                        It's not just about money.
                      </p>
                      <p className="text-base font-semibold text-foreground">
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
                            <img src="/check-filled.svg" alt="" className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span className="text-base text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Header */}
                    <div className="space-y-3">
                      <p className="font-bold text-foreground leading-tight">
                        How to Become a {systemName} Franchise Owner
                      </p>
                      <p className="text-base sm: text-muted-foreground leading-relaxed max-w-3xl">
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
                          <div className="relative flex gap-6 pb-8">
                            {/* Timeline Line & Number */}
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-[#54b936] flex items-center justify-center border-4 border-white shadow-md z-10">
                                <span className="text-white font-bold text-lg">1</span>
                              </div>
                              <div className="w-0.5 h-full bg-[#dee8f2] flex-1 mt-2" />
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 pt-1">
                              <AccordionTrigger className="text-left hover:no-underline p-0 py-3 [&>svg]:hidden">
                                <div className="flex-1">
                                  <p className=" font-bold text-foreground mb-2">
                                    Create Your Free Franchise Grade Account
                                  </p>
                                  <p className="text-base text-muted-foreground">
                                    Before you speak with the franchisor, start with data, not a sales call.
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
                                      `A clear view of how ${systemName} aligns with your goals`
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
                                  <Link to="/onboarding">Unlock Your {systemName} Ownership Insights → Sign Up Free</Link>
                                </Button>
                              </AccordionContent>
                            </div>
                          </div>
                        </AccordionItem>

                        {/* Step 2 */}
                        <AccordionItem value="step-2" className="border-0">
                          <div className="relative flex gap-6 pb-8">
                            {/* Timeline Line & Number */}
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-[#446786] flex items-center justify-center border-4 border-white shadow-md z-10">
                                <span className="text-white font-bold text-lg">2</span>
                              </div>
                              <div className="w-0.5 h-full bg-[#dee8f2] flex-1 mt-2" />
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 pt-1">
                              <AccordionTrigger className="text-left hover:no-underline p-0 py-3 [&>svg]:hidden">
                                <div className="flex-1">
                                  <p className=" font-bold text-foreground mb-2">
                                    Speak With a Franchise Grade Advisor
                                  </p>
                                  <p className="text-base text-muted-foreground">
                                    Your advisor helps you interpret data and plan your next steps, no pressure, no sales pitch.
                                  </p>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pt-4 pb-6 text-base text-foreground space-y-5">
                                <div>
                                  <p className="font-semibold text-foreground mb-3">We help you understand:</p>
                                  <ul className="space-y-2.5">
                                    {[
                                      `If ${systemName} matches your goals and skills`,
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
                          <div className="relative flex gap-6 pb-8">
                            {/* Timeline Line & Number */}
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-[#446786] flex items-center justify-center border-4 border-white shadow-md z-10">
                                <span className="text-white font-bold text-lg">3</span>
                              </div>
                              <div className="w-0.5 h-full bg-[#dee8f2] flex-1 mt-2" />
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 pt-1">
                              <AccordionTrigger className="text-left hover:no-underline p-0 py-3 [&>svg]:hidden">
                                <div className="flex-1">
                                  <p className="font-bold text-foreground mb-2">
                                    Determine Your Financial Readiness & Ownership Model
                                  </p>
                                  <p className="text-base text-muted-foreground">
                                    Before reaching out to {systemName}, be prepared to explain your financial and operational fit.
                                  </p>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pt-4 pb-6 text-base text-foreground space-y-5">
                                <div className="bg-[#f4f8fe] border border-[#A4C6E8] rounded-[20px] p-5 mb-4">
                                  <div className="flex items-center gap-2 mb-3">
                                    <CheckCircle2 className="w-5 h-5 text-[#54b936]" />
                                    <p className=" font-bold text-foreground">Pre-Franchisor Engagement Checklist</p>
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
                                  <p className="font-semibold text-foreground mb-3">Before reaching out to {systemName}, be prepared to explain:</p>
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
                          <div className="relative flex gap-6 pb-8">
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-[#446786] flex items-center justify-center border-4 border-white shadow-md z-10">
                                <span className="text-white font-bold text-lg">4</span>
                              </div>
                              <div className="w-0.5 h-full bg-[#dee8f2] flex-1 mt-2" />
                            </div>
                            <div className="flex-1 pt-1">
                              <AccordionTrigger className="text-left hover:no-underline p-0 py-3 [&>svg]:hidden">
                                <div className="flex-1">
                                  <p className="font-bold text-foreground mb-2">
                                    Submit the Initial Contact Form to {systemName}
                                  </p>
                                  <p className="text-base text-muted-foreground">
                                    Once you're confident, begin the brand's process.
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
                          <div className="relative flex gap-6 pb-8">
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-[#446786] flex items-center justify-center border-4 border-white shadow-md z-10">
                                <span className="text-white font-bold text-lg">5</span>
                              </div>
                              <div className="w-0.5 h-full bg-[#dee8f2] flex-1 mt-2" />
                            </div>
                            <div className="flex-1 pt-1">
                              <AccordionTrigger className="text-left hover:no-underline p-0 py-3 [&>svg]:hidden">
                                <div className="flex-1">
                                  <p className="font-bold text-foreground mb-2">
                                    Attend the Introductory Call With {systemName}
                                  </p>
                                  <p className="text-base text-muted-foreground">
                                    This is a mutual fit conversation, not a sales pitch.
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
                          <div className="relative flex gap-6 pb-8">
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-[#446786] flex items-center justify-center border-4 border-white shadow-md z-10">
                                <span className="text-white font-bold text-lg">6</span>
                              </div>
                              <div className="w-0.5 h-full bg-[#dee8f2] flex-1 mt-2" />
                            </div>
                            <div className="flex-1 pt-1">
                              <AccordionTrigger className="text-left hover:no-underline p-0 py-3 [&>svg]:hidden">
                                <div className="flex-1">
                                  <p className="font-bold text-foreground mb-2">
                                    Review the Franchise Disclosure Document (FDD)
                                  </p>
                                  <p className="text-base text-muted-foreground">
                                    Once you're pre-qualified, {systemName} sends you the FDD.
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
                          <div className="relative flex gap-6 pb-8">
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-[#446786] flex items-center justify-center border-4 border-white shadow-md z-10">
                                <span className="text-white font-bold text-lg">7</span>
                              </div>
                              <div className="w-0.5 h-full bg-[#dee8f2] flex-1 mt-2" />
                            </div>
                            <div className="flex-1 pt-1">
                              <AccordionTrigger className="text-left hover:no-underline p-0 py-3 [&>svg]:hidden">
                                <div className="flex-1">
                                  <p className="font-bold text-foreground mb-2">
                                    Validate With Current Franchisees
                                  </p>
                                  <p className="text-base text-muted-foreground">
                                    This is where real insight lives. You'll ask existing owners about their experience.
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
                          <div className="relative flex gap-6 pb-8">
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-[#446786] flex items-center justify-center border-4 border-white shadow-md z-10">
                                <span className="text-white font-bold text-lg">8</span>
                              </div>
                              <div className="w-0.5 h-full bg-[#dee8f2] flex-1 mt-2" />
                            </div>
                            <div className="flex-1 pt-1">
                              <AccordionTrigger className="text-left hover:no-underline p-0 py-3 [&>svg]:hidden">
                                <div className="flex-1">
                                  <p className="font-bold text-foreground mb-2">
                                    Attend Discovery Day
                                  </p>
                                  <p className="text-base text-muted-foreground">
                                    This is your chance to meet the team and see the operation firsthand.
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
                          <div className="relative flex gap-6 pb-8">
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-[#446786] flex items-center justify-center border-4 border-white shadow-md z-10">
                                <span className="text-white font-bold text-lg">9</span>
                              </div>
                              <div className="w-0.5 h-full bg-[#dee8f2] flex-1 mt-2" />
                            </div>
                            <div className="flex-1 pt-1">
                              <AccordionTrigger className="text-left hover:no-underline p-0 py-3 [&>svg]:hidden">
                                <div className="flex-1">
                                  <p className="font-bold text-foreground mb-2">
                                    Receive Approval & Lock In Your Territory
                                  </p>
                                  <p className="text-base text-muted-foreground">
                                    If both sides say yes, you're officially approved and secure your desired market.
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
                          <div className="relative flex gap-6 pb-8">
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-[#54b936] flex items-center justify-center border-4 border-white shadow-md z-10">
                                <span className="text-white font-bold text-lg">10</span>
                              </div>
                            </div>
                            <div className="flex-1 pt-1">
                              <AccordionTrigger className="text-left hover:no-underline p-0 py-3 [&>svg]:hidden">
                                <div className="flex-1">
                                  <p className="font-bold text-foreground mb-2">
                                    Sign the Franchise Agreement & Begin Training
                                  </p>
                                  <p className="text-base text-muted-foreground">
                                    Once signed, your journey as a franchise owner officially begins.
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
                                    Welcome, you're now a {systemName} franchise owner.
                                  </p>
                                </div>
                              </AccordionContent>
                            </div>
                          </div>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* FAQs Section */}
            <div
              ref={(el) => (sectionRefs.current.faqs = el)}
              className="bg-white border border-[#A4C6E8] rounded-[20px] flex flex-col gap-6 p-6 sm:p-8 lg:p-10 lg:order-9 order-[102] shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-3 w-full">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-6 h-6 text-[#203d57] flex-shrink-0" />
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">FAQs</h2>
                </div>
              </div>

              {/* FAQs Accordion - Visible for both logged-in and non-logged-in users */}
              {(() => {
                const systemName = currentBrandData?.name || "Franchise";
                const investmentLow = currentBrandData?.investment?.min ? `$${(currentBrandData.investment.min / 1000).toFixed(0)}K` : "$798K";
                const investmentHigh = currentBrandData?.investment?.max ? `$${(currentBrandData.investment.max / 1000000).toFixed(1)}M` : "$1.6M";

                return (
                  <Accordion type="single" collapsible className="w-full space-y-2">
                    {/* FAQ 1: How much does a {System} franchise cost? */}
                    <AccordionItem value="faq-1" className="border border-[#A4C6E8] rounded-[12px] px-4 py-2">
                      <AccordionTrigger className="text-left hover:no-underline py-3">
                        <p className="font-bold text-foreground text-base">
                          How much does a {systemName} franchise cost?
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
                        {isLoggedIn ? (
                          <Button className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-6 py-2 text-base font-bold text-white w-full sm:w-auto" asChild>
                            <Link to="#territories">Check your ZIP availability</Link>
                          </Button>
                        ) : (
                          <Button 
                            className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-6 py-2 text-base font-bold text-white w-full sm:w-auto"
                            onClick={(e) => handleUnlockClick(e, "territories")}
                          >
                            Check your ZIP availability
                          </Button>
                        )}
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

                    {/* FAQ 6: How do I become a {brand} franchise owner? */}
                    <AccordionItem value="faq-6" className="border border-[#A4C6E8] rounded-[12px] px-4 py-2">
                      <AccordionTrigger className="text-left hover:no-underline py-3">
                        <p className="font-bold text-foreground text-base">
                          How do I become a {systemName} franchise owner?
                        </p>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <p className="text-base text-foreground">
                          Follow the evaluation steps, confirm territory, speak to the franchisor, and complete the approval process.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    {/* FAQ 7: How do I complete the {brand} application? */}
                    <AccordionItem value="faq-7" className="border border-[#A4C6E8] rounded-[12px] px-4 py-2">
                      <AccordionTrigger className="text-left hover:no-underline py-3">
                        <p className="font-bold text-foreground text-base">
                          How do I complete the {systemName} application?
                        </p>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4 space-y-3">
                        <p className="text-base text-foreground">
                          We guide you through what to include, what to avoid, and how to present your profile clearly.
                        </p>
                        <Button className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-6 py-2 text-base font-bold text-white w-full sm:w-auto" asChild>
                          <Link to="/onboarding">Talk to an advisor</Link>
                        </Button>
                      </AccordionContent>
                    </AccordionItem>

                    {/* FAQ 8: I've reached out but haven't heard back from {brand}. Why? */}
                    <AccordionItem value="faq-8" className="border border-[#A4C6E8] rounded-[12px] px-4 py-2">
                      <AccordionTrigger className="text-left hover:no-underline py-3">
                        <p className="font-bold text-foreground text-base">
                          I've reached out but haven't heard back from {systemName}. Why?
                        </p>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4 space-y-3">
                        <p className="text-base text-foreground">
                          Brands prioritize prepared, qualified candidates. We help you present yourself properly.
                        </p>
                        <Button className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-6 py-2 text-base font-bold text-white w-full sm:w-auto" asChild>
                          <Link to="/onboarding">Talk to an advisor</Link>
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

          {/* Mobile: Same wrapper (content flows after left), Desktop: Right Column */}
          <div className="[display:contents] lg:flex lg:flex-col gap-5 items-start justify-start w-full lg:flex-[1_1_50%] lg:min-w-0 xl:flex-[0_0_35%] xl:min-w-0">
            {/* Talk to Advisor Card */}
            <div className="bg-[#203d57] flex flex-col items-start px-[29px] py-8 rounded-[20px] w-full lg:order-1 order-3">
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
                <Button className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-8 py-2 text-base font-bold text-white w-full" asChild>
                  <Link to="/about/advisors">Talk With an Advisor</Link>
                </Button>
              </div>
            </div>

            {/* Why buyers like this brand */}
            <div className="bg-[#fdfdfd] border border-[#A4C6E8] flex flex-col gap-2 items-start px-[29px] py-8 rounded-[20px] w-full lg:order-2 order-4">
              <p className=" font-bold text-foreground w-full">Why buyers like this brand</p>
              {(currentBrandData.whyBuyersLike || []).map((item, index) => (
                <div key={index} className="w-full min-w-0">
                  <div className="bg-white flex gap-2 items-start sm:items-center justify-start pl-0 pr-6 py-1 rounded-[30px] w-full min-w-0">
                    <img src="/check-filled.svg" alt="" className="w-4 h-4 flex-shrink-0 mt-0.5 sm:mt-0" />
                    <p className="text-base font-normal text-left text-foreground break-words w-full">{item}</p>
                  </div>
                  {index < (currentBrandData.whyBuyersLike?.length || 0) - 1 && (
                    <div className="h-px w-full bg-[#dee8f2]" />
                  )}
                </div>
              ))}
            </div>

            {/* Similar Brands */}
            <div className="bg-[#fdfdfd] border border-[#A4C6E8] flex flex-col gap-2 items-start px-[29px] py-8 rounded-[20px] w-full lg:order-3 order-11">
              <p className=" font-bold text-foreground">Similar Brands</p>
              {((currentBrandData.similarBrands || []).slice(0, 3)).map((brand, index) => (
                <div key={index} className="w-full">
                  <div className="bg-white flex gap-5 items-start pl-0 pr-6 py-1 rounded-[30px] w-full min-w-0">
                    <div className="size-[66px] rounded-full flex-shrink-0" style={{ backgroundColor: brand.logoColor || "#dee8f2" }} />
                    <div className="flex flex-col gap-5 items-start justify-center flex-1 min-w-0">
                      <div className="text-base text-foreground w-full min-w-0">
                        <p className="font-bold mb-0 break-words">{brand.name}</p>
                        <p className="font-normal break-words">{brand.description}</p>
                      </div>
                      <Button
                        variant="outline"
                        className="border border-[#446786] rounded-[30px] px-5 py-2 text-base font-bold text-[#446786] w-full"
                        asChild
                      >
                        <Link to={`/best-franchises/brand/${brand.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
                          Learn More
                        </Link>
                      </Button>
                    </div>
                  </div>
                  {index < Math.min((currentBrandData.similarBrands?.length || 0), 3) - 1 && (
                    <div className="h-px w-full bg-[#dee8f2] my-3" />
                  )}
                </div>
              ))}
            </div>

            {/* Ongoing Fees & Recurring Costs */}
            <div className="bg-[#fdfdfd] border border-[#A4C6E8] flex flex-col gap-4 items-start px-[29px] py-8 rounded-[20px] w-full lg:order-4 order-7">
              <p className=" font-bold text-foreground mb-2">Ongoing Fees & Recurring Costs</p>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 xl:gap-4 w-full">
                <div className="bg-white flex gap-2 items-center pl-0 pr-6 py-2 rounded-[30px] w-full min-w-0">
                  <div className="bg-[#203d57] rounded-full size-[15px] flex items-center justify-center flex-shrink-0">
                    <p className="text-[#dee8f2] text-[9.37px] font-semibold leading-[14.055px]">$</p>
                  </div>
                  <p className="text-base font-normal text-foreground whitespace-nowrap overflow-hidden text-ellipsis">Royalty fees</p>
                </div>
                <div className="bg-white flex gap-2 items-center pl-0 pr-6 py-2 rounded-[30px] w-full min-w-0">
                  <div className="bg-[#203d57] rounded-full size-[15px] flex items-center justify-center flex-shrink-0">
                    <p className="text-[#dee8f2] text-[9.37px] font-semibold leading-[14.055px]">$</p>
                  </div>
                  <p className="text-base font-normal text-[#203d57] whitespace-nowrap overflow-hidden text-ellipsis">Marketing fund</p>
                </div>
                <div className="bg-white flex gap-2 items-center pl-0 pr-6 py-2 rounded-[30px] w-full min-w-0">
                  <div className="bg-[#203d57] rounded-full size-[15px] flex items-center justify-center flex-shrink-0">
                    <p className="text-[#dee8f2] text-[9.37px] font-semibold leading-[14.055px]">$</p>
                  </div>
                  <p className="text-base font-normal text-[#203d57] whitespace-nowrap overflow-hidden text-ellipsis">Tech subscriptions</p>
                </div>
                <div className="bg-white flex gap-2 items-center pl-0 pr-6 py-2 rounded-[30px] w-full min-w-0">
                  <div className="bg-[#203d57] rounded-full size-[15px] flex items-center justify-center flex-shrink-0">
                    <p className="text-[#dee8f2] text-[9.37px] font-semibold leading-[14.055px]">$</p>
                  </div>
                  <p className="text-base font-normal text-[#203d57] whitespace-nowrap overflow-hidden text-ellipsis">Renewal fees</p>
                </div>
                <div className="bg-white flex gap-2 items-center pl-0 pr-6 py-2 rounded-[30px] w-full min-w-0">
                  <div className="bg-[#203d57] rounded-full size-[15px] flex items-center justify-center flex-shrink-0">
                    <p className="text-[#dee8f2] text-[9.37px] font-semibold leading-[14.055px]">$</p>
                  </div>
                  <p className="text-base font-normal text-[#203d57] whitespace-nowrap overflow-hidden text-ellipsis">Compliance costs</p>
                </div>
                <div className="bg-white flex gap-2 items-center pl-0 pr-6 py-2 rounded-[30px] w-full min-w-0">
                  <div className="bg-[#203d57] rounded-full size-[15px] flex items-center justify-center flex-shrink-0">
                    <p className="text-[#dee8f2] text-[9.37px] font-semibold leading-[14.055px]">$</p>
                  </div>
                  <p className="text-base font-normal text-[#203d57] whitespace-nowrap overflow-hidden text-ellipsis">Training fees</p>
                </div>
              </div>
            </div>

            {/* Not sure you can afford this franchise? */}
            <div className="border border-[#A4C6E8] flex flex-col items-start px-[29px] py-8 rounded-[20px] w-full lg:order-5 order-6">
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
                <div className="w-full md:w-[145px] flex-shrink-0 hidden md:block">
                  <img 
                    src="https://mvp.franchisegrade.com/hubfs/Website/Listing/person-affod-cal-cta.png" 
                    alt="Affordability Calculator" 
                    className="w-full h-auto object-contain -mt-10"
                  />
                </div>
              </div>
              
              {/* Button - 1 column */}
              <Button className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-8 py-2 text-base font-bold text-white w-full" asChild>
                <Link to="/form-affordability-calulator">Try it now!</Link>
              </Button>
            </div>

            {/* Unlock full profitability analysis */}
            {!isLoggedIn && (
              <div className="bg-[#fdfdfd] border border-[#A4C6E8] flex flex-col items-start px-[29px] py-8 rounded-[20px] w-full lg:order-6 order-9">
                <div className="flex flex-col gap-5 items-start w-full">
                  <p className="text-[24px] font-bold text-[#26780e] whitespace-pre-wrap">
                    Unlock full profitability analysis
                  </p>
                <div className="text-base font-normal text-foreground leading-6">
                  <p className="mb-0">We show what matters most when evaluating earnings, based on the FDD and real owner data.</p>
                  <p className="mb-0">&nbsp;</p>
                  <p className="font-bold  mb-4">You will get when you sign up:</p>
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
                  <Button className="bg-[#54b936] hover:bg-[#54b936]/90 rounded-[30px] px-5 py-2 text-base font-bold text-white w-full mt-4" asChild>
                    <Link to="/about/advisors">Talk With an Advisor</Link>
                  </Button>
                </div>
              </div>
            )}

            {/* Extended Similar Brands */}
            <div className="hidden lg:flex bg-[#fdfdfd] border border-[#A4C6E8] flex-col gap-2 items-start px-[29px] py-8 rounded-[20px] w-full lg:order-7">
              <p className=" font-bold text-foreground">Similar Brands</p>
              {((currentBrandData.similarBrands || []).slice(0, 5)).map((brand, index) => (
                <div key={index} className="w-full">
                  <div className="bg-white flex gap-5 items-start pl-0 pr-6 py-1 rounded-[30px] w-full min-w-0">
                    <div className="size-[66px] rounded-full flex-shrink-0" style={{ backgroundColor: brand.logoColor || "#dee8f2" }} />
                    <div className="flex flex-col gap-5 items-start justify-center flex-1 min-w-0">
                      <div className="text-base text-foreground w-full min-w-0">
                        <p className="font-bold mb-0 break-words">{brand.name}</p>
                        <p className="font-normal break-words">{brand.description}</p>
                      </div>
                      <Button
                        variant="outline"
                        className="border border-[#446786] rounded-[30px] px-5 py-2 text-base font-bold text-[#446786] w-full"
                        asChild
                      >
                        <Link to={`/best-franchises/brand/${brand.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
                          Learn More
                        </Link>
                      </Button>
                    </div>
                  </div>
                  {index < Math.min((currentBrandData.similarBrands?.length || 0), 5) - 1 && (
                    <div className="h-px w-full bg-[#dee8f2] my-2" />
                  )}
                </div>
              ))}
            </div>

            {/* Similar Brands - Duplicate before CTA advisors 2 */}
            <div className="bg-[#fdfdfd] border border-[#A4C6E8] flex flex-col gap-2 items-start px-[29px] py-8 rounded-[20px] w-full lg:order-8 hidden lg:flex">
              <p className=" font-bold text-foreground">Similar Brands</p>
              {((currentBrandData.similarBrands || []).slice(0, 5)).map((brand, index) => (
                <div key={`duplicate-${index}`} className="w-full">
                  <div className="bg-white flex gap-5 items-start pl-0 pr-6 py-1 rounded-[30px] w-full min-w-0">
                    <div className="size-[66px] rounded-full flex-shrink-0" style={{ backgroundColor: brand.logoColor || "#dee8f2" }} />
                    <div className="flex flex-col gap-5 items-start justify-center flex-1 min-w-0">
                      <div className="text-base text-foreground w-full min-w-0">
                        <p className="font-bold mb-0 break-words">{brand.name}</p>
                        <p className="font-normal break-words">{brand.description}</p>
                      </div>
                      <Button
                        variant="outline"
                        className="border border-[#446786] rounded-[30px] px-5 py-2 text-base font-bold text-[#446786] w-full"
                        asChild
                      >
                        <Link to={`/best-franchises/brand/${brand.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
                          Learn More
                        </Link>
                      </Button>
                    </div>
                  </div>
                  {index < Math.min((currentBrandData.similarBrands?.length || 0), 5) - 1 && (
                    <div className="h-px w-full bg-[#dee8f2] my-3" />
                  )}
                </div>
              ))}
            </div>

            {/* Talk to Advisor Card - Bottom - Sticky only on desktop (lg breakpoint) */}
            <div 
              ref={advisorCardBottomRef}
              className={`bg-[#203d57] flex flex-col items-start px-[29px] py-8 rounded-[20px] w-full transition-shadow lg:order-8 order-[99] lg:z-30 ${
                isAdvisorCardBottomSticky ? "lg:shadow-lg" : ""
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
                  <p className="text-2xl text-center text-white w-full break-words">
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
      <div ref={footerRef}>
        <Footer />
      </div>
    </div>
  );
}
