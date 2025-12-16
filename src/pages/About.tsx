import { PageLayout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Shield, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const values = [
  {
    icon: Target,
    title: "Investor-First",
    description: "We prioritize your goals, budget, and lifestyle in every recommendation.",
  },
  {
    icon: Shield,
    title: "Transparent",
    description: "Clear, honest information so you can make confident decisions.",
  },
  {
    icon: TrendingUp,
    title: "Data-Driven",
    description: "Advanced matching algorithms analyze 50+ factors to find your best fit.",
  },
  {
    icon: Users,
    title: "Expert Support",
    description: "Experienced advisors guide you through every step of your journey.",
  },
];

const stats = [
  { label: "Franchises Analyzed", value: "5,000+" },
  { label: "Investors Matched", value: "10,000+" },
  { label: "Success Rate", value: "94%" },
  { label: "Years of Experience", value: "15+" },
];

export default function About() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Your Trusted Partner in Franchise Investment
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            At FranchiseGrade, we put investors first. Our mission is to help you find the perfect
            franchise opportunity that aligns with your goals, budget, and lifestyle.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Our Story */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 text-center">Our Story</h2>
          <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground">
            <p>
              Founded in 2008, FranchiseGrade emerged from a simple observation: too many
              franchise investors were making decisions with incomplete or biased information. We
              saw the need for a platform that truly serves investors, not just franchise brands.
            </p>
            <p>
              Today, we've built the most comprehensive franchise matching platform in the
              industry. Our advanced algorithms analyze investment requirements, profitability
              potential, territory availability, and lifestyle factors to connect you with
              opportunities that truly fit your unique situation.
            </p>
            <p>
              We believe that informed investors make better decisions, and better decisions lead
              to successful franchise ownership. That's why transparency, accuracy, and
              investor-first thinking are at the core of everything we do.
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} className="text-center">
                  <CardContent className="pt-6">
                    <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center p-8 rounded-2xl bg-muted/50 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Start Your Franchise Journey?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Let our expert advisors help you find the perfect franchise opportunity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/onboarding">
              <Button variant="cta" size="lg">
                Find Your Best Match
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/about/advisors">
              <Button variant="outline" size="lg">
                Meet Our Advisors
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
