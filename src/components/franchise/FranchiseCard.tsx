import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Bookmark } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCompare } from "@/hooks/useCompare";
import { usePreferences } from "@/hooks/usePreferences";
import { useSaved } from "@/hooks/useSaved";
import { useAuth } from "@/contexts/AuthContext";
import { useSignInModal } from "@/contexts/SignInModalContext";
import { addPendingAction } from "@/utils/pendingActions";

interface FranchiseCardProps {
  id: string;
  name: string;
  logo?: string;
  investmentMin: number;
  investmentMax: number;
  sector: string;
  category: string;
  categorySlug?: string; // Optional slug for category link
  grade?: "A" | "B" | "C" | "D";
  isLoggedIn?: boolean;
  onSave?: () => void;
  onCompare?: () => void;
}

export function FranchiseCard({
  id,
  name,
  logo,
  investmentMin,
  investmentMax,
  sector,
  category,
  categorySlug,
  grade,
  isLoggedIn = false,
  onSave,
  onCompare,
}: FranchiseCardProps) {
  const navigate = useNavigate();
  const { addToCompare, isInCompare } = useCompare();
  const { likedItems, dislikedItems, addLike, removeLike, addDislike, removeDislike } = usePreferences();
  const { savedItems, addSaved, removeSaved, isSaved: checkIsSaved } = useSaved();
  const { isLoggedIn: authIsLoggedIn } = useAuth();
  const { openModal } = useSignInModal();
  
  // Check if this franchise is liked, disliked, or saved
  const isLiked = likedItems.some((item) => item.id === id);
  const isDisliked = dislikedItems.some((item) => item.id === id);
  const isSaved = checkIsSaved(id);
  
  // Use auth context isLoggedIn if not provided as prop
  const userIsLoggedIn = isLoggedIn || authIsLoggedIn;

  /**
   * Handle action for public users - store pending action and open sign-in modal
   * HubSpot-friendly: Pending actions are stored and can be synced to HubSpot after sign-in
   */
  const handlePublicUserAction = (actionType: 'like' | 'dislike' | 'save' | 'compare', franchiseData?: any) => {
    // Store pending action
    addPendingAction({
      type: actionType,
      franchiseId: id,
      franchiseName: name,
      franchiseData: {
        logo: logo || null,
        grade,
        investmentMin,
        investmentMax,
        sector,
        category,
        ...franchiseData,
      },
    });
    
    // Open sign-in modal
    openModal();
  };
  // Helper function to create slug from category name
  const createSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const categoryLink = categorySlug || createSlug(category);
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Generate different blue colors based on card index or name using the color palette
  const blueColors = [
    "#446786",
    "#4F7AA5",
    "#A4C6E8",
    "#DEE8F2",
    "#F4F8FE",
  ];
  const colorIndex = (id.charCodeAt(0) + (id.charCodeAt(id.length - 1) || 0)) % blueColors.length;
  const selectedColor = blueColors[colorIndex];

  return (
    <Card className="!border-[1px] border-[#d5e0f2] overflow-hidden rounded-[20px] shadow-none hover:shadow-card-hover">
      {/* Image */}
      <div className="aspect-[545/232] w-full relative rounded-t-[20px] overflow-hidden">
        {logo ? (
          <img src={logo} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div 
            className="w-full h-full"
            style={{ backgroundColor: selectedColor }}
          />
        )}
      </div>

      <CardContent className="p-5 pt-0 flex flex-col gap-5">
        {/* Header with Category and Grade */}
        <div className="flex items-center justify-between border-b-[1px] border-[#eaeff9] py-2">
          <Link 
            to={`/best-franchises/for/${categoryLink}`}
            className="text-xs font-normal text-foreground leading-normal hover:text-[#446786] hover:underline transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {category}
          </Link>
          <div className="flex items-center gap-1 bg-[#dee8f2] px-1.5 py-0.5 rounded-full">
            <span className="text-sm font-bold text-[#446786]">Grade</span>
            <span className="text-sm font-bold text-[#446786]">*</span>
          </div>
        </div>

        {/* Title and Investment */}
        <div className="flex flex-col gap-2">
          <p className="text-base font-bold text-foreground leading-normal">{name}</p>
          <p className="text-base font-normal text-foreground leading-normal">
            Min. investment {formatCurrency(investmentMin)}
          </p>
        </div>

        {/* Primary CTA Button */}
        <Link to={`/best-franchises/brand/${id}`} className="w-full">
          <Button 
            variant="navy" 
            className="w-full rounded-[30px] py-2 px-5 text-base font-bold"
          >
            Learn more
          </Button>
        </Link>

        {/* Action Buttons - Show all buttons for both public and logged-in users */}
        <div className="flex gap-3 items-start">
          {/* Compare Button */}
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!userIsLoggedIn) {
                // Public user - store pending action and open sign-in modal
                handlePublicUserAction('compare', { investmentMin, investmentMax });
                return;
              }
              
              // Logged-in user - execute action
              const franchiseData = {
                id,
                name,
                logo: logo || null,
                grade,
                investmentMin,
                investmentMax,
              };
              
              // Add to compare and wait for it to complete before navigating
              addToCompare(franchiseData).then((added) => {
                if (added) {
                  // Data is saved to localStorage synchronously in addToCompare
                  // Small delay to ensure React state updates, then navigate
                  setTimeout(() => {
                    navigate("/compare");
                  }, 150);
                }
              }).catch((error) => {
                console.error("Failed to add to compare:", error);
              });
              
              if (onCompare) {
                onCompare();
              }
            }}
            className={`rounded-[30px] py-2 px-5 text-base font-normal border-[#8ba4bd] text-[#8ba4bd] hover:bg-[#8ba4bd]/10 ${
              userIsLoggedIn && isInCompare(id) ? "bg-[#8ba4bd]/20" : ""
            }`}
          >
            {userIsLoggedIn && isInCompare(id) ? "In Compare" : "Compare"}
          </Button>
          
          {/* Thumbs Up */}
          <button
            type="button"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!userIsLoggedIn) {
                // Public user - store pending action and open sign-in modal
                handlePublicUserAction('like');
                return;
              }
              
              // Logged-in user - execute action
              try {
                if (isLiked) {
                  await removeLike(id);
                } else {
                  await addLike({ id, name, logo: logo || null });
                }
              } catch (error) {
                console.error("Failed to update like preference:", error);
              }
            }}
            className={`h-[38px] w-[40px] rounded-[30px] border border-[#8ba4bd] flex items-center justify-center hover:bg-[#8ba4bd]/10 transition-colors ${
              userIsLoggedIn && isLiked ? "bg-[#8ba4bd]/20" : ""
            }`}
            aria-label={userIsLoggedIn && isLiked ? "Remove from likes" : "Add to likes"}
          >
            <ThumbsUp 
              className={`w-4 h-4 text-[#8ba4bd] ${userIsLoggedIn && isLiked ? "fill-current" : ""}`} 
            />
          </button>

          {/* Thumbs Down */}
          <button
            type="button"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!userIsLoggedIn) {
                // Public user - store pending action and open sign-in modal
                handlePublicUserAction('dislike');
                return;
              }
              
              // Logged-in user - execute action
              try {
                if (isDisliked) {
                  await removeDislike(id);
                } else {
                  await addDislike({ id, name, logo: logo || null });
                }
              } catch (error) {
                console.error("Failed to update dislike preference:", error);
              }
            }}
            className={`h-[38px] w-[40px] rounded-[30px] border border-[#8ba4bd] flex items-center justify-center hover:bg-[#8ba4bd]/10 transition-colors ${
              userIsLoggedIn && isDisliked ? "bg-[#8ba4bd]/20" : ""
            }`}
            aria-label={userIsLoggedIn && isDisliked ? "Remove from dislikes" : "Add to dislikes"}
          >
            <ThumbsDown 
              className={`w-4 h-4 text-[#8ba4bd] ${userIsLoggedIn && isDisliked ? "fill-current" : ""}`} 
            />
          </button>

          {/* Bookmark */}
          <button
            type="button"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!userIsLoggedIn) {
                // Public user - store pending action and open sign-in modal
                handlePublicUserAction('save');
                return;
              }
              
              // Logged-in user - execute action
              try {
                if (isSaved) {
                  await removeSaved(id);
                } else {
                  await addSaved({
                    id,
                    name,
                    logo: logo || null,
                    grade,
                    investmentMin,
                    investmentMax,
                    sector,
                    category,
                  });
                }
              } catch (error) {
                console.error("Failed to update saved status:", error);
              }
            }}
            className={`h-[38px] w-[40px] rounded-[30px] border border-[#8ba4bd] flex items-center justify-center hover:bg-[#8ba4bd]/10 transition-colors ${
              userIsLoggedIn && isSaved ? "bg-[#8ba4bd]/20" : ""
            }`}
            aria-label={userIsLoggedIn && isSaved ? "Remove from saved" : "Add to saved"}
          >
            <Bookmark 
              className={`w-4 h-4 text-[#8ba4bd] ${userIsLoggedIn && isSaved ? "fill-current" : ""}`} 
            />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
