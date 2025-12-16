import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavLink {
  name: string;
  href?: string;
  submenu?: Array<{ name: string; href: string }>;
}

const navLinks: NavLink[] = [
  {
    name: "Find a Franchise",
    href: "/best-franchises",
    submenu: [
      { name: "By company", href: "/best-franchises" },
      { name: "By industry", href: "/best-franchises/for" },
      { name: "By location", href: "/best-franchises/in" },
      { name: "Search all", href: "/best-franchises" },
    ],
  },
  { name: "Academy", href: "/academy" },
  {
    name: "About us",
    href: "/about",
    submenu: [
      { name: "Our Company", href: "/about" },
      { name: "Advisors", href: "/about/advisors" },
    ],
  },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const isLoggedIn = false; // This would come from auth context

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/logo.svg" 
                alt="FranchiseGrade" 
                className="h-5 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => link.submenu && setOpenDropdown(link.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {link.submenu ? (
                    <span
                      className={cn(
                        "flex items-center gap-1 text-base font-normal tracking-normal transition-colors cursor-pointer",
                        openDropdown === link.name
                          ? "text-[#446786]"
                          : "text-muted-foreground hover:text-[#446786]"
                      )}
                    >
                      {link.name}
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  ) : (
                    <Link
                      to={link.href || "#"}
                      className={cn(
                        "text-base font-normal tracking-normal transition-colors",
                        location.pathname === link.href
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-[#446786]"
                      )}
                    >
                      {link.name}
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  {link.submenu && openDropdown === link.name && (
                    <div 
                      className="absolute top-full left-0 pt-1 w-56 z-50"
                      onMouseEnter={() => setOpenDropdown(link.name)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <div className="bg-background border border-border rounded-xl shadow-lg overflow-hidden">
                      <div className="p-1.5">
                        {link.submenu.map((subItem) => {
                          return (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className="group flex items-center justify-between px-4 py-2.5 text-base font-normal tracking-normal transition-colors rounded-[30px] text-muted-foreground hover:bg-[#F4F8FE] hover:text-[#446786]"
                              onClick={() => setOpenDropdown(null)}
                            >
                              <span>{subItem.name}</span>
                              <img 
                                src="/arrow.svg" 
                                alt="" 
                                className="w-5 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                              />
                            </Link>
                          );
                        })}
                      </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <Link to="/dashboard">
                <Button variant="soft" size="sm">
                  <User className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/onboarding">
                  <Button variant="outline" size="sm" className="text-base font-normal tracking-normal px-9 py-2 text-muted-foreground">
                    Sign In
                  </Button>
                </Link>
                <Link to="/onboarding">
                  <Button variant="cta" size="sm" className="text-base px-9 py-2">
                    Find the Best Match
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.submenu ? (
                    <>
                      <button
                        className="w-full px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center justify-between"
                        onClick={() => setOpenDropdown(openDropdown === link.name ? null : link.name)}
                      >
                        <span>{link.name}</span>
                        <ChevronDown className={cn("w-4 h-4 transition-transform", openDropdown === link.name && "rotate-180")} />
                      </button>
                      {openDropdown === link.name && (
                        <div className="pl-4 flex flex-col gap-1">
                          {link.submenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className="px-4 py-2 rounded-lg text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setOpenDropdown(null);
                              }}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={link.href || "#"}
                      className="px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4 px-4 flex flex-col gap-2">
                <Link to="/onboarding" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="cta" className="w-full">
                    Find the Best Match
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
