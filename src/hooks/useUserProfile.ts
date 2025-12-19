import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserData, setUserData } from "@/utils/userStorage";

/**
 * User Profile Interface
 * HubSpot-friendly structure for database integration
 */
export interface UserProfile {
  budget?: string; // e.g., "$100K – $250K"
  budgetMin?: number;
  budgetMax?: number;
  location?: string; // e.g., "Toronto, ON"
  lifestyle?: string; // e.g., "Full-time", "Part-time", "Semi-absentee"
  industries?: string[]; // e.g., ["Food & Beverage", "Health & Fitness"]
  goals?: string[]; // e.g., ["Financial freedom", "Be my own boss"]
}

// Default profile for testing
const DEFAULT_PROFILE: UserProfile = {
  budget: "$100K – $250K",
  budgetMin: 100000,
  budgetMax: 250000,
  location: "Toronto, ON",
  lifestyle: "Full-time",
  industries: ["Food & Beverage", "Health & Fitness"],
  goals: ["Financial freedom", "Be my own boss"],
};

/**
 * User Profile Hook
 * 
 * Manages user profile data for personalized matching.
 * HubSpot-friendly: Ready for database integration.
 * Only works for logged-in users - public users get empty profile.
 */
export function useUserProfile() {
  const { isLoggedIn, user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({});

  // Load from user-specific storage on mount - only for logged-in users
  // Use empty object as default, not DEFAULT_PROFILE, so we can detect if onboarding is complete
  useEffect(() => {
    if (isLoggedIn && user) {
      // Load user-specific profile - use empty object to detect if onboarding is complete
      const userProfile = getUserData<UserProfile>(user.id, 'profile', {});
      setProfile(userProfile);
      console.log(`[useUserProfile] Loaded profile for user ${user.id}:`, userProfile);
    } else {
      // Clear profile for public users
      setProfile({});
    }
  }, [isLoggedIn, user]);

  // Sync to user-specific storage whenever profile changes - only for logged-in users
  // This ensures profile is saved immediately when updated
  useEffect(() => {
    if (isLoggedIn && user && profile && Object.keys(profile).length > 0) {
      setUserData(user.id, 'profile', profile);
      console.log(`[useUserProfile] Saved profile for user ${user.id}:`, profile);
    }
  }, [profile, isLoggedIn, user]);

  // Listen for storage changes to sync across tabs - user-specific
  useEffect(() => {
    if (!isLoggedIn || !user) return;
    
    const userProfileKey = `franchise_clarity_${user.id}_profile`;
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === userProfileKey) {
        const updatedProfile = getUserData<UserProfile>(user.id, 'profile', {});
        setProfile(updatedProfile);
        console.log(`[useUserProfile] Synced profile from storage for user ${user.id}:`, updatedProfile);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isLoggedIn, user]);

  return {
    profile,
    setProfile,
  };
}

