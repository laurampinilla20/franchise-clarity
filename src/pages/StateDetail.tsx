import { PageLayout } from "@/components/layout";
import { FranchiseCard } from "@/components/franchise";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ExploreFranchisingByProvince from "@/components/ExploreFranchisingByProvince";

// Helper function to format state name from URL slug (e.g., "alabama" -> "Alabama", "new-york" -> "New York")
const formatStateName = (slug: string): string => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Helper function to get state nickname/description
const getStateDescription = (stateName: string): string => {
  const nicknames: Record<string, string> = {
    "Alabama": "With low operating expenses and a well-trained workforce, the Cotton State is a good choice for new franchises.",
    "Alaska": "With a growing economy and unique market opportunities, Alaska offers potential for franchise expansion.",
    // Add more state descriptions as needed
  };
  return nicknames[stateName] || `Discover franchise opportunities in ${stateName}, a state with growing business potential.`;
};

// Helper function to generate dynamic why invest content
const getWhyInvestContent = (stateName: string) => {
  return {
    title: `Why invest in a opportunity franchise in ${stateName}?`,
    details: `${stateName}'s business climate is positive, with a strong emphasis placed on workforce development through their job-training programs. Operating expenses are also kept low due in part to a decent tax environment.\n\nThe state is always looking to attract new business, and with a solid transportation infrastructure including a deep-water port, interstates, rail and airports, ${stateName} is a gateway to markets around the world.`
  };
};

// Default stats - in production, these would come from an API
const getDefaultStats = (stateName: string) => ({
  operatingFranchises: "+1,803", // This would be dynamic per state
  seekingInvestors: "+762", // This would be dynamic per state
  population: "+5,024,279", // This would be dynamic per state
});

const franchises = [
  {
    id: "moxies-1",
    name: "Moxies",
    investmentMin: 1500000,
    investmentMax: 3500000,
    sector: "Food & Beverage",
    category: "Bar & grill",
  },
  {
    id: "360-painting-1",
    name: "360 Degrees Painting",
    investmentMin: 100000,
    investmentMax: 150000,
    sector: "Home Services",
    category: "Prop. & facilities services",
  },
  {
    id: "scent-hound-1",
    name: "Scent hound",
    investmentMin: 200000,
    investmentMax: 500000,
    sector: "Personal Services",
    category: "Pet care",
  },
];

const features = [
  "Thriving $50,536 income community.",
  "Strong workforce and support programs",
  "Room for growth with multi-unit options",
];

export default function StateDetail() {
  const { stateName: stateSlug } = useParams<{ stateName: string }>();
  const navigate = useNavigate();
  
  // Format state name from URL param (e.g., "alabama" -> "Alabama", "new-york" -> "New York")
  const stateName = stateSlug ? formatStateName(stateSlug) : "State";
  
  // Get dynamic state data
  const stateDescription = getStateDescription(stateName);
  const whyInvest = getWhyInvestContent(stateName);
  const stats = getDefaultStats(stateName);

  return (
    <PageLayout>
      <div className="container mx-auto p-0 max-w-[1512px]">
      {/* Hero Section */}
      <div className="bg-[#203d57] rounded-[30px] px-8 py-[60px] mb-10 max-w-[1448px] mx-auto">
        <div className="max-w-[1136px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-10">
          <div className="flex flex-col gap-5 max-w-[530px] w-full">
            <Link
              to="/best-franchises/in"
              className="border border-[#54b936] rounded-[30px] px-3 py-1 w-fit flex items-center gap-2.5 hover:bg-[#54b936]/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white rotate-180" />
              <span className="text-base text-white">
                Explore other <span className="font-bold text-[#54b936]">locations</span>
              </span>
            </Link>
            <h1 className="text-[36px] md:text-[48px] font-normal leading-[72px] text-white">
              Find the best franchises in <span className="font-bold">{stateName}</span>
            </h1>
            <p className="text-lg text-white">
              {stateDescription}
            </p>
          </div>
          <div className="w-full lg:w-[400px] h-[285px] rounded-[30px] overflow-hidden flex-shrink-0">
            <img 
              src="https://mvp.franchisegrade.com/hubfs/New%20style/Location%20dynamic%20pages/best-franchises-in-44.png"
              alt={`${stateName} map`}
              className="w-full h-full object-contain rounded-[30px]"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10">
          <div className="flex flex-col gap-5 items-center text-center text-white w-full md:w-[238px]">
            <p className="text-[36px] font-bold leading-[32px]">{stats.operatingFranchises}</p>
            <p className="text-lg">Franchises currently operating</p>
          </div>
          <div className="hidden md:block bg-[#446786] h-[134px] w-[2px] rounded-full" />
          <div className="flex flex-col gap-5 items-center text-center text-white w-full md:w-[238px]">
            <p className="text-[36px] font-bold leading-[32px]">{stats.seekingInvestors}</p>
            <p className="text-lg">Franchises seeking investors</p>
          </div>
          <div className="hidden md:block bg-[#446786] h-[134px] w-[2px] rounded-full" />
          <div className="flex flex-col gap-5 items-center text-center text-white w-full md:w-[238px]">
            <p className="text-[36px] font-bold leading-[32px]">{stats.population}</p>
            <p className="text-lg">Potential population in state</p>
          </div>
        </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto">
      {/* Why Invest Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-20">
        <div className="w-full lg:w-[468px] h-[400px] rounded-[30px] overflow-hidden">
          <img 
            src="https://mvp.franchisegrade.com/hubfs/New%20style/Location%20dynamic%20pages/Find%20the%20best%20franchise%20for%20you.png"
            alt={`${stateName} illustration`}
            className="w-full h-full object-contain rounded-[30px]"
          />
        </div>
        <div className="flex flex-col gap-5 max-w-[580px] w-full">
          <h2 className="text-[36px] font-normal text-black">
            {whyInvest.title}
          </h2>
          <div className="text-base text-black leading-6 whitespace-pre-line">
            {whyInvest.details}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-20">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col gap-5 items-center px-8 py-2.5 w-full md:w-[318px]"
          >
            <div className="w-[51px] h-[51px] rounded-full bg-[#dee8f2] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-[#dee8f2]" />
            </div>
            <p className="text-2xl text-black text-center">{feature}</p>
          </div>
        ))}
      </div>

      {/* Explore Franchising by Province Section - Only for Canada */}
      {stateName.toLowerCase() === "canada" && (
        <div className="mb-20">
          <ExploreFranchisingByProvince />
        </div>
      )}

      {/* Form Section */}
      <div className="bg-[#f4f8fe] border border-[#f4f8fe] rounded-[33px] p-8 md:p-10 mb-20">
        <div className="flex flex-col gap-8 items-end max-w-4xl mx-auto">
          <div className="flex flex-col gap-4 w-full">
            <h3 className="text-[36px] font-normal text-black text-center mb-4">
              Not all franchises are equal in {stateName}
            </h3>
            <p className="text-lg text-black text-center mb-8 max-w-[600px] mx-auto">
              We'll show you the best-performing ones in your specific city.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-3">
                <label className="text-lg text-black">First name</label>
                <Input className="h-11 rounded-[33px] bg-[#dee8f2] border-2 border-[#dee8f2]" />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-lg text-black">Last name</label>
                <Input className="h-11 rounded-[33px] bg-[#dee8f2] border-2 border-[#dee8f2]" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-3">
                <label className="text-lg text-black">Email*</label>
                <Input className="h-11 rounded-[33px] bg-[#dee8f2] border-2 border-[#dee8f2]" />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-lg text-black">Phone Number</label>
                <Input className="h-11 rounded-[33px] bg-[#dee8f2] border-2 border-[#dee8f2]" />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-lg text-black">ZIP Code</label>
                <Input className="h-11 rounded-[33px] bg-[#dee8f2] border-2 border-[#dee8f2]" />
              </div>
            </div>
          </div>
          <Button className="bg-[#54b936] hover:bg-[#54b936]/90 text-white rounded-[30px] px-9 py-3 text-base font-bold">
            Find the best franchise for you
          </Button>
        </div>
      </div>

      {/* Unlock Card */}
      <div className="border-2 border-[#dee8f2] rounded-[30px] p-8 md:p-20 mb-20 max-w-[1150px] mx-auto">
        <div className="flex gap-7 items-start">
          <div className="w-[72px] h-[70px] rounded-lg bg-muted flex-shrink-0" />
          <div className="flex flex-col gap-3">
            <h4 className="text-2xl font-bold text-[#203d57]">
              Unlock all franchises in {stateName}
            </h4>
            <p className="text-lg text-[#203d57]">
              Schedule a call with us to advise you so you can make the best decision.
            </p>
          </div>
        </div>
      </div>

      {/* Franchise Grid */}
      <div className="flex flex-col gap-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {franchises.map((franchise) => (
            <FranchiseCard key={franchise.id} {...franchise} isLoggedIn={false} />
          ))}
        </div>
      </div>
        </div>
      </div>
    </PageLayout>
  );
}

