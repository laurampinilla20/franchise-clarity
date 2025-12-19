import { usePendingActions } from "@/hooks/usePendingActions";

/**
 * Pending Actions Handler Component
 * 
 * Handles execution of pending actions after user signs in.
 * HubSpot-friendly: All actions are tracked and synced.
 */
export function PendingActionsHandler() {
  usePendingActions();
  return null; // This component doesn't render anything
}

