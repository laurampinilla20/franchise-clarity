import { PageLayout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Video, FileText, Award, ArrowRight, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Getting Started",
    description: "Learn the fundamentals of franchise ownership",
    icon: BookOpen,
    color: "text-blue-600",
  },
  {
    name: "Financial Planning",
    description: "Understand investment requirements and financing",
    icon: FileText,
    color: "text-green-600",
  },
  {
    name: "Legal & Compliance",
    description: "Navigate franchise agreements and regulations",
    icon: Award,
    color: "text-purple-600",
  },
];

const courses = [
  {
    id: 1,
    title: "Introduction to Franchising",
    description: "Learn the basics of how franchising works and whether it's right for you.",
    category: "Getting Started",
    duration: "15 min",
    type: "article",
    level: "Beginner",
  },
  {
    id: 2,
    title: "Evaluating Franchise Opportunities",
    description: "How to research and compare different franchise brands effectively.",
    category: "Getting Started",
    duration: "25 min",
    type: "video",
    level: "Beginner",
  },
  {
    id: 3,
    title: "Understanding Franchise Fees",
    description: "Break down initial fees, royalties, and ongoing costs.",
    category: "Financial Planning",
    duration: "20 min",
    type: "article",
    level: "Intermediate",
  },
  {
    id: 4,
    title: "Franchise Financing Options",
    description: "Explore SBA loans, traditional financing, and alternative funding sources.",
    category: "Financial Planning",
    duration: "30 min",
    type: "video",
    level: "Intermediate",
  },
  {
    id: 5,
    title: "Reading a Franchise Disclosure Document",
    description: "Learn how to interpret the FDD and identify key terms.",
    category: "Legal & Compliance",
    duration: "35 min",
    type: "article",
    level: "Advanced",
  },
  {
    id: 6,
    title: "Territory Rights and Protection",
    description: "Understand how franchise territories work and what protection you have.",
    category: "Legal & Compliance",
    duration: "20 min",
    type: "video",
    level: "Intermediate",
  },
];

export default function Academy() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Franchise Academy</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn everything you need to know about franchise ownership, from fundamentals to
            advanced strategies.
          </p>
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Icon className={`w-8 h-8 ${category.color} mb-2`} />
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Featured Courses */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Featured Courses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {course.type === "video" ? (
                        <PlayCircle className="w-5 h-5 text-primary" />
                      ) : (
                        <FileText className="w-5 h-5 text-primary" />
                      )}
                      <Badge variant="outline" className="text-xs">
                        {course.level}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{course.duration}</span>
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {course.category}
                    </Badge>
                    <Button variant="ghost" size="sm" className="gap-1">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center p-8 rounded-2xl bg-muted/50 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Find Your Perfect Franchise?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Put your knowledge into action. Start your personalized franchise matching journey
            today.
          </p>
          <Link to="/onboarding">
            <Button variant="cta" size="lg">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
