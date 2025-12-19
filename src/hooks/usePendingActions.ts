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
    if (!isLoggedIn || !user) return;

    // Execute pending actions after sign-in
    const executePendingActions = async () => {
      // Wait a bit longer to ensure all hooks are ready and user data is loaded
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const pendingActions = getPendingActions();
      
      if (pendingActions.length === 0) return;

      console.log(`Executing ${pendingActions.length} pending actions for user ${user.id}`);

      // Export actions for HubSpot before clearing
      const hubspotData = exportPendingActionsForHubSpot();

      // Execute each pending action
      let shouldNavigateToCompare = false;
      
      for (const action of pendingActions) {
        try {
          switch (action.type) {
            case 'like':
              console.log(`Executing pending like for ${action.franchiseName} (ID: ${action.franchiseId})`);
              try {
                await addLike({
                  id: action.franchiseId,
                  name: action.franchiseName,
                  logo: action.franchiseData?.logo || null,
                });
                console.log(`✓ Successfully saved like for ${action.franchiseName} to user account`);
              } catch (error) {
                console.error(`✗ Failed to save like for ${action.franchiseName}:`, error);
              }
              break;
            
            case 'dislike':
              console.log(`Executing pending dislike for ${action.franchiseName}`);
              await addDislike({
                id: action.franchiseId,
                name: action.franchiseName,
                logo: action.franchiseData?.logo || null,
              });
              console.log(`Successfully saved dislike for ${action.franchiseName}`);
              break;
            
            case 'save':
              console.log(`Executing pending save for ${action.franchiseName}`);
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
              console.log(`Successfully saved ${action.franchiseName}`);
              break;
            
            case 'compare':
              console.log(`Executing pending compare for ${action.franchiseName}`);
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
                console.log(`Successfully added ${action.franchiseName} to compare`);
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
      console.log('All pending actions executed and cleared');

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

    // Execute pending actions after sign-in
    // Use a longer delay to ensure all hooks and user data are ready
    const timeoutId = setTimeout(() => {
      executePendingActions();
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [isLoggedIn, user, addLike, addDislike, addSaved, addToCompare]);
}

