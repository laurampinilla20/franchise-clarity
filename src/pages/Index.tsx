import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import AnimatedFeatureModule from "@/components/AnimatedFeatureModule";
import {
  ArrowRight,
  Target,
  GitCompare,
  MapPin,
  Route,
  MessageCircle,
  Shield,
  Sparkles,
  Users,
  CheckCircle2,
  CheckCircle,
} from "lucide-react";



export default function Index() {
  return (
    <PageLayout>
      <AnimatedFeatureModule />

      {/* Trust Section */}
      <section className="pt-[60px] pb-[60px] bg-background md:pt-[120px] md:pb-[120px]">
        <div className="container mx-auto px-0 md:px-4 lg:px-8 max-w-[1200px]">
          <div className="flex flex-col gap-[40px]">
            {/* First Row: Image Left, Content Right */}
            <div className="flex flex-col lg:flex-row gap-[50px] lg:gap-[195px] items-center">
              <div className="w-full lg:w-[480px] h-[342px] relative rounded-[30px] shrink-0">
                <img
                  src="https://mvp.franchisegrade.com/hubfs/Website/Home/person-advise.png"
                  alt="Trusted franchise advisor"
                  className="w-full h-full object-contain rounded-[30px]"
                />
              </div>
              <div className="flex flex-col gap-5 items-start w-full lg:w-[477px]">
                <h2 className="font-normal text-3xl lg:text-4xl leading-normal text-foreground">
                  +10,000 active buyers <br />
                  trust us every year
                </h2>
                <p className="font-normal text-base leading-6 text-foreground">
                  We've guided investors to better franchise decisions across all industries, always powered by data and deep market insight.
                </p>
                <Link to="/about/advisors">
                  <Button variant="cta" size="lg" className="rounded-[30px] px-9 py-3">
                    Talk to an advisor
                </Button>
              </Link>
              </div>
            </div>

            {/* Second Row: Content Left, Image Right (image first on mobile) */}
            <div className="flex flex-col lg:flex-row gap-[50px] lg:gap-[97px] items-center">
              <div className="w-full lg:w-[626px] h-[446px] relative rounded-[30px] shrink-0 overflow-hidden order-1 lg:order-2">
                <img
                  src="https://mvp.franchisegrade.com/hubfs/Website/Home/gif-how-fg-work.gif"
                  alt="Best franchises USA"
                  className="w-full h-full object-contain rounded-[30px]"
                />
              </div>
              <div className="flex flex-col gap-5 items-start w-full lg:w-[477px] order-2 lg:order-1">
                <h2 className="font-normal text-3xl lg:text-4xl leading-normal text-foreground w-full lg:w-[404px]">
                  How data shapes your franchise decision
                </h2>
                <p className="font-normal text-base leading-6 text-foreground">
                  A smart franchise move builds real wealth, a wrong one can cost you years. We'll show you how to choose right and win.
                </p>
                <Link to="/best-franchises">
                  <Button variant="cta" size="lg" className="rounded-[30px] px-9 py-3">
                    Find the best franchise for you
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="pt-8 pb-8 md:pt-[80px] md:pb-[80px] bg-[#dee8f2] rounded-[30px] px-3 md:px-0">
        <div className="container mx-auto px-0 md:px-4 lg:px-8 max-w-[1200px]">
          <div className="flex flex-col gap-5 items-center text-center mb-10">
            <h2 className="font-normal text-3xl lg:text-4xl leading-normal text-foreground">
              Find the best franchise fit for you
            </h2>
            <p className="font-normal text-base leading-6 text-foreground max-w-3xl">
              Here's how we help you invest smarter, faster, and easier; with years of experience on your side.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-[32px] items-center justify-center w-full">
            {/* Territory Card */}
            <div className="relative w-full lg:w-[363px] h-[450px] rounded-[33px] overflow-hidden group">
              <div className="absolute inset-0 bg-[#446786] rounded-[33px]">
                {/* Layer 3 & 4: Image and base background */}
                <img
                  src="https://www.figma.com/api/mcp/asset/34aefb97-346e-4ec7-9ffc-b29f9e9632ee"
                  alt="Territory"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Layer 1: Linear gradient - always visible */}
                <div
                  className="absolute inset-0 rounded-[33px]"
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg, rgba(32, 61, 87, 0) 48.077%, rgba(32, 61, 87, 1) 100%)",
                  }}
                />
                {/* Layer 2: #0E2438 overlay - 74% opacity by default, 0% on hover */}
                <div
                  className="absolute inset-0 rounded-[33px] bg-[#0E2438] opacity-[0.74] group-hover:opacity-0 transition-opacity"
                />
              </div>
              <div className="relative h-full flex flex-col justify-between p-7">
                <div className="flex justify-end">
                  <div className="relative w-[25px] h-[25px] group cursor-pointer">
                    <div className="absolute bg-[#FFFFFF] opacity-[0.33] group-hover:opacity-100 inset-0 rounded-[30px] transition-all" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src="https://www.figma.com/api/mcp/asset/2fc37f6e-2a82-4797-a992-58e2cc838e9e"
                        alt=""
                        className="arrow-icon block w-[14px] h-[10px] rotate-[284.751deg] scale-y-[-1]"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-[17px]">
                  <div className="bg-white flex items-center justify-center px-2 py-0.5 rounded-[30px] w-fit">
                    <p className="font-bold text-xs leading-6 text-foreground">Territory</p>
                  </div>
                  <p className="font-normal text-[24px] leading-8 text-white">
                    See the top franchise opportunities in your desired area,{" "}
                    <span className="font-bold">backed by real market data.</span>
                  </p>
                </div>
          </div>
        </div>

            {/* Financials Card */}
            <div className="relative w-full lg:w-[363px] h-[450px] rounded-[33px] overflow-hidden group">
              <div className="absolute inset-0 bg-[#446786] rounded-[33px]">
                {/* Layer 3 & 4: Image and base background */}
                <img
                  src="https://www.figma.com/api/mcp/asset/a477852c-a016-4f58-925a-a155a91377f4"
                  alt="Financials"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Layer 1: Linear gradient - always visible */}
                <div
                  className="absolute inset-0 rounded-[33px]"
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg, rgba(32, 61, 87, 0) 48.077%, rgba(32, 61, 87, 1) 100%)",
                  }}
                />
                {/* Layer 2: #0E2438 overlay - 74% opacity by default, 0% on hover */}
                <div
                  className="absolute inset-0 rounded-[33px] bg-[#0E2438] opacity-[0.74] group-hover:opacity-0 transition-opacity"
                />
              </div>
              <div className="relative h-full flex flex-col justify-between p-7">
                <div className="flex justify-end">
                  <div className="relative w-[25px] h-[25px] group cursor-pointer">
                    <div className="absolute bg-[#FFFFFF] opacity-[0.33] group-hover:opacity-100 inset-0 rounded-[30px] transition-all" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src="https://www.figma.com/api/mcp/asset/2fc37f6e-2a82-4797-a992-58e2cc838e9e"
                        alt=""
                        className="arrow-icon block w-[14px] h-[10px] rotate-[284.751deg] scale-y-[-1]"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-[17px]">
                  <div className="bg-white flex items-center justify-center px-2 py-0.5 rounded-[30px] w-fit">
                    <p className="font-bold text-xs leading-6 text-foreground">Financials</p>
                  </div>
                  <p className="font-normal text-[24px] leading-8 text-white">
                    Match your budget to franchises with strong numbers,{" "}
                    <span className="font-bold">using in-depth internal reports.</span>
                  </p>
                </div>
              </div>
          </div>

            {/* Industries Card */}
            <div className="relative w-full lg:w-[363px] h-[450px] rounded-[33px] overflow-hidden group">
              <div className="absolute inset-0 bg-[#446786] rounded-[33px]">
                {/* Layer 3 & 4: Image and base background */}
                <img
                  src="https://www.figma.com/api/mcp/asset/175278fc-ac43-4db0-b526-851784745bb1"
                  alt="Industries"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Layer 1: Linear gradient - always visible */}
                <div
                  className="absolute inset-0 rounded-[33px]"
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg, rgba(32, 61, 87, 0) 48.077%, rgba(32, 61, 87, 1) 100%)",
                  }}
                />
                {/* Layer 2: #0E2438 overlay - 74% opacity by default, 0% on hover */}
                <div
                  className="absolute inset-0 rounded-[33px] bg-[#0E2438] opacity-[0.74] group-hover:opacity-0 transition-opacity"
                />
              </div>
              <div className="relative h-full flex flex-col justify-between p-7">
                <div className="flex justify-end">
                  <div className="relative w-[25px] h-[25px] group cursor-pointer">
                    <div className="absolute bg-[#FFFFFF] opacity-[0.33] group-hover:opacity-100 inset-0 rounded-[30px] transition-all" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src="https://www.figma.com/api/mcp/asset/2fc37f6e-2a82-4797-a992-58e2cc838e9e"
                        alt=""
                        className="arrow-icon block w-[14px] h-[10px] rotate-[284.751deg] scale-y-[-1]"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-[17px]">
                  <div className="bg-white flex items-center justify-center px-2 py-0.5 rounded-[30px] w-fit">
                    <p className="font-bold text-xs leading-6 text-foreground">Industries</p>
                  </div>
                  <p className="font-normal text-[24px] leading-8 text-white">
                    Align your lifestyle and long-term goals to{" "}
                    <span className="font-bold">industries where you're most likely to thrive.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* Explore Industries & Advisors Section */}
            <section className="bg-background -mx-3 px-3 md:-mx-4 md:px-8 lg:-mx-8 lg:px-8">
              <div className="flex flex-col lg:flex-row gap-8 items-stretch w-full mt-8">
                {/* Industries Section */}
                <div className="bg-[rgba(222,232,242,0.4)] flex flex-col gap-[68px] items-center px-[40px] md:px-[80px] py-[60px] md:py-[120px] rounded-[30px] w-full lg:w-1/2 lg:h-[780px]">
                    <div className="flex flex-col font-normal gap-[5px] items-center text-navy text-center w-full max-w-[500px]">
                      <p className="leading-normal text-3xl md:text-4xl w-full">
                        Explore franchises by industry
                      </p>
                      <p className="leading-6 text-base w-full">
                        See which segments outperform and where you truly fit. Here are some of the top industries we cover:
                      </p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-[32px] items-start justify-start w-full">
                      {/* Left Column */}
                      <div className="flex flex-col gap-[14px] items-start w-full md:w-auto">
                        <div className="bg-[#dee8f2] flex gap-2 items-center pl-4 pr-6 py-2 rounded-[30px] whitespace-nowrap">
                          <img src="/check-filled.svg" alt="" className="w-[14px] h-[14px]" />
                          <p className="font-semibold leading-6 text-navy text-sm text-left">
                            Business & Professional
                          </p>
                        </div>
                        <div className="bg-[#dee8f2] flex gap-2 items-center pl-4 pr-6 py-2 rounded-[30px] whitespace-nowrap">
                          <img src="/check-filled.svg" alt="" className="w-[14px] h-[14px]" />
                          <p className="font-semibold leading-6 text-navy text-sm text-left">
                            Pet Care
                          </p>
                        </div>
                        <div className="bg-[#dee8f2] flex gap-2 items-center pl-4 pr-6 py-2 rounded-[30px] whitespace-nowrap">
                          <img src="/check-filled.svg" alt="" className="w-[14px] h-[14px]" />
                          <p className="font-semibold leading-6 text-navy text-sm text-left">
                            Healthcare & Medical
                          </p>
                        </div>
                        <div className="bg-[#dee8f2] flex gap-2 items-center pl-4 pr-6 py-2 rounded-[30px] whitespace-nowrap">
                          <img src="/check-filled.svg" alt="" className="w-[14px] h-[14px]" />
                          <p className="font-semibold leading-6 text-navy text-sm text-left">
                            Retail Food & Convenience
                          </p>
                        </div>
                        <div className="bg-[#dee8f2] flex gap-2 items-center pl-4 pr-6 py-2 rounded-[30px] whitespace-nowrap">
                          <img src="/check-filled.svg" alt="" className="w-[14px] h-[14px]" />
                          <p className="font-semibold leading-6 text-navy text-sm text-left">
                            Real Estate & Lodging
                          </p>
                        </div>
                      </div>
                      {/* Right Column */}
                      <div className="flex flex-col gap-[14px] items-start w-full md:w-auto">
                        <div className="bg-[#dee8f2] flex gap-2 items-center pl-4 pr-6 py-2 rounded-[30px] whitespace-nowrap">
                          <img src="/check-filled.svg" alt="" className="w-[14px] h-[14px]" />
                          <p className="font-semibold leading-6 text-navy text-sm text-left">
                            Personal Care & Lifestyle
                          </p>
                        </div>
                        <div className="bg-[#dee8f2] flex gap-2 items-center pl-4 pr-6 py-2 rounded-[30px] whitespace-nowrap">
                          <img src="/check-filled.svg" alt="" className="w-[14px] h-[14px]" />
                          <p className="font-semibold leading-6 text-navy text-sm text-left">
                            Home Services
                          </p>
                        </div>
                        <div className="bg-[#dee8f2] flex gap-2 items-center pl-4 pr-6 py-2 rounded-[30px] whitespace-nowrap">
                          <img src="/check-filled.svg" alt="" className="w-[14px] h-[14px]" />
                          <p className="font-semibold leading-6 text-navy text-sm text-left">
                            Fast Food Restaurants
                          </p>
                        </div>
                        <div className="bg-[#dee8f2] flex gap-2 items-center pl-4 pr-6 py-2 rounded-[30px] whitespace-nowrap">
                          <img src="/check-filled.svg" alt="" className="w-[14px] h-[14px]" />
                          <p className="font-semibold leading-6 text-navy text-sm text-left">
                            Retail Products
                          </p>
                        </div>
                        <div className="bg-[#dee8f2] flex gap-2 items-center pl-4 pr-6 py-2 rounded-[30px] whitespace-nowrap">
                          <img src="/check-filled.svg" alt="" className="w-[14px] h-[14px]" />
                          <p className="font-semibold leading-6 text-navy text-sm text-left">
                            Full Service Restaurants
                          </p>
                        </div>
                      </div>
                    </div>
                    <Link to="/best-franchises/for">
                      <Button variant="cta" size="lg" className="rounded-[30px] px-9 py-3">
                        Find the best industry for you
                      </Button>
                    </Link>
                  </div>

                {/* Advisors Section */}
                <div className="bg-[#f4f8fe] flex flex-col lg:h-[780px] items-center justify-between px-[50px] md:px-[100px] py-[40px] md:py-[120px] rounded-[30px] w-full lg:w-1/2">
                    <div className="flex flex-col font-normal gap-4 items-center text-black text-center w-full">
                      <p className="leading-normal text-3xl md:text-4xl">
                        Find the best advisor for you
                      </p>
                      <p className="leading-6 text-base w-full max-w-[500px]">
                        Get guidance from experts with 30+ years of experience. Our advisors specialize by industry to help you find the right franchise.
                      </p>
                    </div>
                    <div className="flex justify-center my-10">
                    <img
                      src="https://mvp.franchisegrade.com/hubfs/Website/Home/best-advisors-franchises.png"
                      alt=""
                      className="w-full max-w-[550px] h-auto"
                    />
                  </div>
                    <Link to="/about/advisors">
                      <Button variant="cta" size="lg" className="rounded-[30px] px-9 py-3">
                        Talk to an advisor
                      </Button>
                    </Link>
                  </div>
                </div>
              </section>

    </PageLayout>
  );
}
