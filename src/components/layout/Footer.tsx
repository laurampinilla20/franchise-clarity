import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Mail } from "lucide-react";

const socialIcons = {
  linkedin: "https://www.figma.com/api/mcp/asset/d8619095-33fa-409b-89e3-9e33c386610e",
  twitter: "https://www.figma.com/api/mcp/asset/12795c0d-f88c-4ff7-8a42-1b451169d7bf",
  facebook: "https://www.figma.com/api/mcp/asset/68131a96-8de6-4e80-b1a5-5b04b2d84f59",
};

const logoImg = "https://www.figma.com/api/mcp/asset/99ad8574-4696-4356-9f06-9e6ea9989263";

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="flex flex-col items-start w-full max-w-[1512px] mx-auto">
        {/* Top Section - CTA and Contact Info */}
        <div className="bg-secondary flex flex-col items-center pb-5 pt-[60px] md:pt-[120px] px-3 md:px-[90px] lg:px-[180px] rounded-[30px] w-full mt-8 mx-0 md:mx-8">
          <div className="flex flex-col gap-[60px] md:gap-[120px] items-center w-full max-w-[1200px]">
            {/* CTA Section */}
            <div className="flex flex-col gap-4 items-center w-full">
              <p className="font-normal leading-normal text-2xl md:text-4xl text-white text-center w-full max-w-[554px] whitespace-pre-wrap">
                Leave it to the experts, a wrong choice could cost you thousands
              </p>
              <p className="font-normal leading-6 text-base text-white text-center w-full max-w-[554px] whitespace-pre-wrap">
                Book a call and get your free, personalized roadmap. No pressure. No bias. Just clear guidance to protect your investment.
              </p>
              <Link to="/best-franchises">
                <Button variant="cta" size="lg" className="rounded-[30px] px-9 py-3">
                  Find the best franchise for you
                </Button>
              </Link>
            </div>

            {/* Contact Info Section */}
            <div className="border-[#446786] border-t-2 flex flex-col md:flex-row items-start justify-between px-0 py-10 w-full">
              {/* Address */}
              <div className="font-medium leading-[21px] text-base text-white mb-6 md:mb-0">
                <p className="font-bold mb-2">Address</p>
                <p className="font-medium">
                  One Liberty Place<br />
                  1650 Market Street, Suite 3600<br />
                  Philadelphia, Pennsylvania, 19103<br />
                  United States of America
                </p>
              </div>

              {/* Contact Details */}
              <div className="flex flex-col items-start justify-center mb-6 md:mb-0">
                <p className="font-bold leading-[21px] text-base text-white mb-4">
                  Get In Touch
                </p>
                <div className="flex gap-2 items-center mb-3">
                  <Phone className="w-4 h-4 text-white" />
                  <a 
                    href="tel:18009756101" 
                    className="font-medium leading-[21px] text-base text-white underline cursor-pointer"
                  >
                    1-800-975-6101
                  </a>
                </div>
                <div className="flex gap-2 items-center">
                  <Mail className="w-4 h-4 text-white" />
                  <a 
                    href="mailto:find.the.best@franchisegrade.com" 
                    className="font-medium leading-[21px] text-base text-white underline cursor-pointer"
                  >
                    find.the.best@franchisegrade.com
                  </a>
                </div>
              </div>

              {/* Social Icons and Logo */}
              <div className="flex flex-col gap-[30px] items-end w-full md:w-auto">
                <div className="flex gap-4 md:gap-[64.72px] items-center">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-[35.552px] h-[35.552px]">
                    <img 
                      alt="LinkedIn" 
                      src={socialIcons.linkedin} 
                      className="w-full h-full object-contain"
                    />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-[35.552px] h-[35.552px]">
                    <img 
                      alt="Twitter" 
                      src={socialIcons.twitter} 
                      className="w-full h-full object-contain"
                    />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-[35.552px] h-[35.552px]">
                    <img 
                      alt="Facebook" 
                      src={socialIcons.facebook} 
                      className="w-full h-full object-contain"
                    />
                  </a>
                </div>
                <div className="h-[33.888px] w-[91px]">
                  <img 
                    alt="Logo" 
                    src={logoImg} 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Footer Links */}
        <div className="flex items-center justify-between px-4 md:px-[90px] lg:px-[180px] py-6 w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
            {/* Logo and Copyright */}
            <div className="flex items-center gap-4">
              <div className="h-[22px] w-[167px]">
                <img 
                  alt="FranchiseGrade Logo" 
                  src="/logo.svg" 
                  className="h-full w-auto object-contain"
                />
              </div>
              <p className="font-medium leading-[21px] text-base text-foreground">
                © {new Date().getFullYear()}. All rights reserved.
              </p>
            </div>

            {/* Footer Links */}
            <div className="flex flex-wrap gap-4 md:gap-8 items-center">
              <Link 
                to="/contact" 
                className="font-medium leading-[21px] text-base text-foreground hover:text-primary transition-colors"
              >
                Contact us
              </Link>
              <Link 
                to="/privacy" 
                className="font-medium leading-[21px] text-base text-foreground hover:text-primary transition-colors"
              >
                Privacy policy
              </Link>
              <Link 
                to="/cookies" 
                className="font-medium leading-[21px] text-base text-foreground hover:text-primary transition-colors"
              >
                Cookie Policy
              </Link>
              <Link 
                to="/terms" 
                className="font-medium leading-[21px] text-base text-foreground hover:text-primary transition-colors"
              >
                Terms and conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
