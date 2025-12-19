import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getPendingActions, 
  clearPendingActions,
  exportPendingActionsForHubSpot,
} from '@/utils/pendingActions';
import { usePreferences } from '@/hooks/usePreferences';
import { useSaved } from '@/hooks/useSaved';
import { useCompare } from '@/hooks/useCompare';

/**
 * Pending Actions Hook
 * 
 * Executes pending actions after user signs in.
 * HubSpot-friendly: All actions are tracked and can be synced to HubSpot CRM.
 */
export function usePendingActions() {
  const { isLoggedIn, user } = useAuth();
  const { addLike, addDislike } = usePreferences();
  const { addSaved } = useSaved();
  const { addToCompare } = useCompare();

  useEffect(() => {
    if (!isLoggedIn) return;

    // Execute pending actions after sign-in
    const executePendingActions = async () => {
      const pendingActions = getPendingActions();
      
      if (pendingActions.length === 0) return;

      // Export actions for HubSpot before clearing
      const hubspotData = exportPendingActionsForHubSpot();

      // Execute each pending action
      let shouldNavigateToCompare = false;
      
      for (const action of pendingActions) {
        try {
          switch (action.type) {
            case 'like':
              await addLike({
                id: action.franchiseId,
                name: action.franchiseName,
                logo: action.franchiseData?.logo || null,
              });
              break;
            
            case 'dislike':
              await addDislike({
                id: action.franchiseId,
                name: action.franchiseName,
                logo: action.franchiseData?.logo || null,
              });
              break;
            
            case 'save':
              await addSaved({
                id: action.franchiseId,
                name: action.franchiseName,
                logo: action.franchiseData?.logo || null,
                grade: action.franchiseData?.grade,
                investmentMin: action.franchiseData?.investmentMin,
                investmentMax: action.franchiseData?.investmentMax,
                sector: action.franchiseData?.sector,
                category: action.franchiseData?.category,
              });
              break;
            
            case 'compare':
              const added = await addToCompare({
                id: action.franchiseId,
                name: action.franchiseName,
                logo: action.franchiseData?.logo || null,
                grade: action.franchiseData?.grade,
                investmentMin: action.franchiseData?.investmentMin,
                investmentMax: action.franchiseData?.investmentMax,
              });
              
              if (added) {
                shouldNavigateToCompare = true;
              }
              break;
          }
        } catch (error) {
          console.error(`Failed to execute pending ${action.type} action:`, error);
        }
      }

      // Navigate to compare if needed
      if (shouldNavigateToCompare) {
        setTimeout(() => {
          window.location.href = "/compare";
        }, 100);
      }

      // Clear pending actions after execution
      clearPendingActions();

      // TODO: Sync pending actions to HubSpot
      // HubSpot-friendly: Can send all executed actions to HubSpot API
      // await fetch('/api/hubspot/sync-actions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     userId: user?.id,
      //     email: user?.email,
      //     actions: hubspotData.actions,
      //     // HubSpot-friendly fields:
      //     // - actionType: 'like' | 'dislike' | 'save' | 'compare'
      //     // - franchiseId: Brand ID
      //     // - franchiseName: Brand name
      //     // - timestamp: When action was performed
      //     // - metadata: Additional brand data
      //   })
      // });
    };

    // Small delay to ensure hooks are ready
    setTimeout(() => {
      executePendingActions();
    }, 500);
  }, [isLoggedIn, user, addLike, addDislike, addSaved, addToCompare]);
}

