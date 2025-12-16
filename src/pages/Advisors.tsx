import { PageLayout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Award } from "lucide-react";
import { Link } from "react-router-dom";

const advisors = [
  {
    name: "Sarah Chen",
    role: "Senior Franchise Advisor",
    specialties: ["Food & Beverage", "Multi-Unit", "Quick Service"],
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face",
    bio: "With over 12 years of experience in franchise consulting, Sarah has helped hundreds of investors find success in the food and beverage sector. She specializes in multi-unit development strategies.",
    experience: "12+ years",
    clientsHelped: "300+",
  },
  {
    name: "Marcus Johnson",
    role: "Investment Specialist",
    specialties: ["Healthcare", "Senior Care", "Wellness"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    bio: "Marcus brings a unique combination of financial analysis and franchise expertise. He's particularly skilled at helping investors navigate the healthcare franchise landscape.",
    experience: "10+ years",
    clientsHelped: "250+",
  },
  {
    name: "Elena Rodriguez",
    role: "Franchise Consultant",
    specialties: ["Retail", "Home Services", "Business Services"],
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face",
    bio: "Elena has a proven track record of matching investors with retail and service-based franchises. Her attention to territory analysis ensures her clients find the best opportunities.",
    experience: "8+ years",
    clientsHelped: "200+",
  },
  {
    name: "David Kim",
    role: "Territory & Market Specialist",
    specialties: ["Territory Analysis", "Market Research", "Site Selection"],
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    bio: "David's expertise in market analysis and territory validation has been instrumental in helping investors identify prime franchise locations and avoid oversaturated markets.",
    experience: "7+ years",
    clientsHelped: "180+",
  },
  {
    name: "Jennifer Martinez",
    role: "Finance & Funding Advisor",
    specialties: ["SBA Loans", "Financing", "Investment Planning"],
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    bio: "Jennifer specializes in helping investors secure financing for their franchise investments. She has deep relationships with lenders and understands all financing options.",
    experience: "9+ years",
    clientsHelped: "220+",
  },
  {
    name: "Robert Thompson",
    role: "Senior Franchise Advisor",
    specialties: ["Automotive", "Education", "Fitness"],
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
    bio: "Robert's diverse background across multiple industries gives him unique insights into franchise opportunities. He's particularly skilled at identifying emerging trends.",
    experience: "11+ years",
    clientsHelped: "280+",
  },
];

export default function Advisors() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Our Expert Advisors</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the experienced franchise professionals dedicated to helping you find success.
            Each advisor brings years of industry expertise and a proven track record of matching
            investors with the right opportunities.
          </p>
        </div>

        {/* Advisors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {advisors.map((advisor) => (
            <Card key={advisor.name} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <img
                    src={advisor.image}
                    alt={advisor.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-bold text-foreground mb-1">{advisor.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{advisor.role}</p>
                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {advisor.experience}
                    </span>
                    <span>{advisor.clientsHelped} clients</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 text-center">{advisor.bio}</p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {advisor.specialties.map((specialty) => (
                    <Badge key={specialty} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center p-8 rounded-2xl bg-muted/50 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Work with an Advisor?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Start your personalized franchise matching journey and get matched with an advisor who
            specializes in your area of interest.
          </p>
          <Link to="/onboarding">
            <Button variant="cta" size="lg">
              Get Started
              <MessageCircle className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
