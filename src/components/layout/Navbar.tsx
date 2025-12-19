import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, ChevronDown, ArrowLeft, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useEngagementTracking } from "@/hooks/useEngagementTracking";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const location = useLocation();
  const { isLoggedIn, login, logout } = useAuth();
  const { trackSignIn } = useEngagementTracking();
  const [isDesktop, setIsDesktop] = useState(false);
  
  // Check if desktop on mount and resize
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generateVerificationCode = () => {
    // Generate a 6-digit code
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate and "send" verification code to email
    const code = generateVerificationCode();
    setVerificationCode(code);
    // In a real app, you would send this code via email API
    console.log("Verification code sent to", formData.email, ":", code);
    setShowVerification(true);
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // For testing: allow any 6-digit code to pass
    if (enteredCode.length === 6) {
      try {
        // Login user through AuthContext (syncs to contact service)
        await login({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
        
        // Track sign-in engagement
        await trackSignIn();
        
        console.log("Verification successful! Sign in data:", formData);
        // Show welcome modal instead of closing
        setShowVerification(false);
        setShowWelcomeModal(true);
        setEnteredCode("");
        setVerificationCode("");
      } catch (error) {
        console.error("Login error:", error);
        alert("Failed to sign in. Please try again.");
      }
    } else {
      alert("Please enter a 6-digit code.");
      setEnteredCode("");
    }
  };

  const handleStartQuiz = () => {
    setShowWelcomeModal(false);
    setSignInModalOpen(false);
    // Navigate to onboarding/quiz page
    window.location.href = "/onboarding";
  };

  const handleSkipQuiz = () => {
    setShowWelcomeModal(false);
    setSignInModalOpen(false);
    // Reset form
    setFormData({ firstName: "", lastName: "", email: "" });
    // User is already logged in from handleVerificationSubmit
  };

  const handleModalClose = (open: boolean) => {
    setSignInModalOpen(open);
    if (!open) {
      // Reset everything when modal closes
      setShowVerification(false);
      setShowWelcomeModal(false);
      setFormData({ firstName: "", lastName: "", email: "" });
      setEnteredCode("");
      setVerificationCode("");
    }
  };

  const handleBackToForm = () => {
    setShowVerification(false);
    setEnteredCode("");
  };

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
            <div className={isDesktop ? "flex items-center gap-8" : "hidden"}>
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
          <div className={isDesktop ? "flex items-center gap-3" : "hidden"}>
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full p-0 bg-accent hover:border hover:border-[#A4C6E8]">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/saved" className="cursor-pointer">
                      Saved
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/onboarding">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-base font-normal tracking-normal px-9 py-2 text-muted-foreground border-border"
                  >
                    Find the Best Match
                  </Button>
                </Link>
                <Button 
                  variant="cta" 
                  size="sm" 
                  className="text-base font-normal tracking-normal px-9 py-2"
                  onClick={() => setSignInModalOpen(true)}
                >
                  Sign In
                </Button>
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
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/profile"
                      className="px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <Link
                      to="/saved"
                      className="px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Saved
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-left w-full"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link to="/onboarding" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="cta" className="w-full">
                      Find the Best Match
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Sign In Modal */}
      <Dialog open={signInModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-[480px] p-0 rounded-[20px]">
          {!showVerification ? (
            <>
              <DialogHeader className="px-8 pt-8 pb-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl font-bold text-foreground text-left">
                    Welcome to FranchiseGrade
                  </DialogTitle>
                </div>
                <DialogDescription className="text-base text-muted-foreground text-left pt-2">
                  Sign in or create an account to continue
                </DialogDescription>
              </DialogHeader>
          
              <form onSubmit={handleSignInSubmit} className="px-8 py-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="h-12 text-base border-border focus:border-[#446786] focus:ring-[#446786] rounded-[30px]"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-foreground">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="h-12 text-base border-border focus:border-[#446786] focus:ring-[#446786] rounded-[30px]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="h-12 text-base border-border focus:border-[#446786] focus:ring-[#446786] rounded-[30px]"
                />
              </div>
            </div>

            <div className="pt-6 space-y-4">
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-[#203d57] hover:bg-[#203d57]/90 text-white rounded-[33px]"
              >
                Continue
              </Button>
              
              <div className="text-xs text-muted-foreground text-center">
                By continuing, you agree to our{" "}
                <a href="#" className="underline text-[#446786] hover:text-[#203d57]">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline text-[#446786] hover:text-[#203d57]">
                  Privacy Policy
                </a>
              </div>

              {/* Separator */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-2 text-muted-foreground">or</span>
                </div>
              </div>

              {/* Alternative Login Options */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-base font-normal border-border hover:bg-muted rounded-[33px] flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-base font-normal border-border hover:bg-muted rounded-[33px] flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#000000">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.96-3.24-1.44-1.56-.59-2.96-1.1-4.07-2.03-2.93-2.54-2.93-5.49 0-8.03C8.03 6.74 10.5 5.5 12.96 5.5c.73 0 1.41.08 2.06.25.45.12.92.04 1.34-.18.44-.23.82-.59 1.03-1.02.22-.47.3-.98.23-1.49-.14-1.02-.6-1.98-1.32-2.73-1.38-1.45-3.25-2.25-5.38-2.25-2.71 0-5.24 1.37-6.73 3.68-1.53 2.36-1.87 5.15-.99 7.87.88 2.73 2.83 4.93 5.5 6.37 1.67.9 3.53 1.39 5.47 1.45 1.47.05 2.88-.2 4.19-.65 1.01-.35 2.03-.86 2.95-1.48 1.01-.66 1.88-1.45 2.6-2.35.11-.14.02-.33-.16-.33-.54.03-1.07.12-1.59.29z"/>
                  </svg>
                  Continue with Apple
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-base font-normal border-border hover:bg-muted rounded-[33px] flex items-center justify-center gap-3"
                  onClick={() => {
                    // This can trigger email-only flow
                  }}
                >
                  <Mail className="w-5 h-5" />
                  Continue with email
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-base font-normal border-border hover:bg-muted rounded-[33px] flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Continue with Facebook
                </Button>
              </div>
            </div>
          </form>
            </>
          ) : (
            <>
              <DialogHeader className="px-8 pt-8 pb-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBackToForm}
                    className="p-1 hover:bg-muted rounded-full transition-colors"
                    type="button"
                  >
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                  </button>
                  <DialogTitle className="text-2xl font-bold text-foreground">
                    Confirm your email
                  </DialogTitle>
                </div>
                <DialogDescription className="text-base text-muted-foreground text-left pt-2">
                  Enter the code we sent to {formData.email}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleVerificationSubmit} className="px-8 py-6">
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={enteredCode}
                      onChange={(value) => setEnteredCode(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="h-14 w-12 text-lg border-2" />
                        <InputOTPSlot index={1} className="h-14 w-12 text-lg border-2" />
                        <InputOTPSlot index={2} className="h-14 w-12 text-lg border-2" />
                        <InputOTPSlot index={3} className="h-14 w-12 text-lg border-2" />
                        <InputOTPSlot index={4} className="h-14 w-12 text-lg border-2" />
                        <InputOTPSlot index={5} className="h-14 w-12 text-lg border-2" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={handleBackToForm}
                      className="text-sm text-foreground underline hover:text-[#446786]"
                    >
                      Choose a different option
                    </button>
                    <Button
                      type="submit"
                      disabled={enteredCode.length !== 6}
                      className="h-12 px-6 text-base font-semibold bg-[#203d57] hover:bg-[#203d57]/90 text-white rounded-[30px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Welcome Modal */}
      <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent className="sm:max-w-[480px] p-0 rounded-[20px]">
          <DialogHeader className="px-8 pt-8 pb-6 border-b border-border">
            <DialogTitle className="text-2xl font-bold text-foreground text-left">
              Welcome to FranchiseGrade
            </DialogTitle>
          </DialogHeader>
          
          <div className="px-8 py-6">
            <div className="space-y-6">
              <p className="text-base text-muted-foreground leading-relaxed">
                We're here to help you find the right franchise, one that truly fits you.
              </p>
              
              <p className="text-base text-muted-foreground leading-relaxed">
                Take our quick match quiz to get personalized recommendations based on your goals, budget, and lifestyle.
              </p>
              
              <p className="text-base text-muted-foreground leading-relaxed">
                It takes less than 3 minutes, or you can skip and do it later.
              </p>

              <div className="flex flex-col gap-3 pt-4">
                <Button
                  onClick={handleStartQuiz}
                  className="w-full h-12 text-base font-semibold bg-[#203d57] hover:bg-[#203d57]/90 text-white rounded-[33px]"
                >
                  Start Match Quiz
                </Button>
                
                <Button
                  onClick={handleSkipQuiz}
                  variant="outline"
                  className="w-full h-12 text-base font-normal border-border hover:bg-muted rounded-[33px]"
                >
                  Skip for now
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
