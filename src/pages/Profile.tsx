import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit3, Save, User, Mail, Phone, MapPin, DollarSign, Star } from "lucide-react";
import { useState } from "react";
import { PreferencesSection } from "@/components/PreferencesSection";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "Toronto, ON",
    budget: "$100K – $250K",
    lifestyle: "Full-time",
    goals: ["Financial freedom", "Be my own boss"],
    industries: ["Food & Beverage", "Health & Fitness"],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would save to the backend
    console.log("Profile saved:", formData);
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
              <p className="text-muted-foreground mt-1">
                Manage your personal information and preferences
              </p>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                Edit Profile
              </Button>
            ) : (
              <Button onClick={handleSave} variant="cta">
                Save Changes
              </Button>
            )}
          </div>

          <div className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="font-bold">First Name</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-foreground font-medium">{formData.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="font-bold">Last Name</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-foreground font-medium">{formData.lastName}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 font-bold">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-foreground font-medium">{formData.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 font-bold">
                    <Phone className="w-4 h-4" />
                    Phone
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-foreground font-medium">{formData.phone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2 font-bold">
                    <MapPin className="w-4 h-4" />
                    Location
                  </Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-foreground font-medium">{formData.location}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Franchise Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Franchise Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-bold">
                    <DollarSign className="w-4 h-4" />
                    Budget
                  </Label>
                  {isEditing ? (
                    <Input
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-foreground font-medium">{formData.budget}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Lifestyle</Label>
                  {isEditing ? (
                    <Input
                      name="lifestyle"
                      value={formData.lifestyle}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-foreground font-medium">{formData.lifestyle}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Goals</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.goals.map((goal) => (
                      <Badge key={goal} variant="soft">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Preferred Industries</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.industries.map((industry) => (
                      <Badge key={industry} variant="soft">
                        {industry}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Likes and Dislikes Section */}
            <PreferencesSection />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}



