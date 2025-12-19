/**
 * User Storage Utility
 * 
 * Manages user-specific data storage with isolation per user account.
 * HubSpot-friendly: Each user's data can be synced to/from HubSpot CRM.
 * 
 * Storage structure:
 * - localStorage keys are prefixed with user ID
 * - Each user has isolated data
 * - Easy to migrate to HubSpot database
 */

/**
 * Get storage key for a specific user
 * HubSpot-friendly: User ID can map to HubSpot contact ID
 */
export function getUserStorageKey(userId: string, dataType: string): string {
  return `franchise_clarity_${userId}_${dataType}`;
}

/**
 * Get data for a specific user
 * HubSpot-friendly: Can be replaced with HubSpot API calls
 */
export function getUserData<T>(userId: string, dataType: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  const key = getUserStorageKey(userId, dataType);
  const stored = localStorage.getItem(key);
  
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultValue;
    }
  }
  
  return defaultValue;
}

/**
 * Set data for a specific user
 * HubSpot-friendly: Can be replaced with HubSpot API calls
 * 
 * This function ensures all user actions are immediately saved to their account.
 * For HubSpot integration, this can be replaced with direct API calls to update contact properties.
 */
export function setUserData<T>(userId: string, dataType: string, data: T): void {
  if (typeof window === 'undefined') return;
  
  const key = getUserStorageKey(userId, dataType);
  
  // Save to localStorage immediately (synchronous) - CRITICAL for data persistence
  // This ensures that even rapid clicks are all saved correctly
  try {
    localStorage.setItem(key, JSON.stringify(data));
    
    // Log for debugging (can be removed in production)
    if (dataType === 'likes' || dataType === 'dislikes') {
      const items = Array.isArray(data) ? data : [];
      console.log(`[UserStorage] Saved ${items.length} ${dataType} for user ${userId}`);
    }
  } catch (error) {
    console.error(`[UserStorage] Failed to save ${dataType} for user ${userId}:`, error);
  }
  
  // TODO: Sync to HubSpot API (non-blocking, async)
  // HubSpot-friendly: Can sync to HubSpot contact properties
  // This can run asynchronously without blocking the UI
  // Example implementation:
  // (async () => {
  //   try {
  //     await fetch('/api/hubspot/contacts/update', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         contactId: userId, // HubSpot contact ID
  //         properties: {
  //           // Map dataType to HubSpot property names
  //           [dataType === 'likes' ? 'liked_franchises' : 
  //            dataType === 'dislikes' ? 'disliked_franchises' :
  //            dataType === 'saved' ? 'saved_franchises' :
  //            dataType === 'compare' ? 'compare_franchises' :
  //            dataType]: JSON.stringify(data), // Store as JSON string in HubSpot
  //           [`last_${dataType}_update`]: new Date().toISOString(),
  //         }
  //       })
  //     });
  //   } catch (error) {
  //     console.error(`[HubSpot] Failed to sync ${dataType} for user ${userId}:`, error);
  //     // Don't throw - HubSpot sync failures shouldn't break the app
  //   }
  // })();
}

/**
 * Remove data for a specific user
 * HubSpot-friendly: Can be replaced with HubSpot API calls
 */
export function removeUserData(userId: string, dataType: string): void {
  if (typeof window === 'undefined') return;
  
  const key = getUserStorageKey(userId, dataType);
  localStorage.removeItem(key);
  
  // TODO: Sync to HubSpot API
  // await fetch('/api/hubspot/remove-user-data', {
  //   method: 'DELETE',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ userId, dataType })
  // });
}

/**
 * Get all data types for a user
 * HubSpot-friendly: Can be used to fetch all user data from HubSpot
 */
export function getAllUserDataTypes(): string[] {
  return ['likes', 'dislikes', 'saved', 'compare', 'profile'];
}

/**
 * Export all user data for HubSpot
 * HubSpot-friendly: Formats all user data for HubSpot import
 */
export function exportUserDataForHubSpot(userId: string): {
  userId: string;
  data: Record<string, unknown>;
  exportedAt: string;
} {
  const dataTypes = getAllUserDataTypes();
  const data: Record<string, unknown> = {};
  
  dataTypes.forEach((dataType) => {
    const key = getUserStorageKey(userId, dataType);
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        data[dataType] = JSON.parse(stored);
      } catch {
        // Skip invalid data
      }
    }
  });
  
  return {
    userId,
    data,
    exportedAt: new Date().toISOString(),
  };
}

/**
 * Import user data from HubSpot
 * HubSpot-friendly: Can import user data from HubSpot CRM
 */
export function importUserDataFromHubSpot(userId: string, hubspotData: {
  data: Record<string, unknown>;
}): void {
  Object.entries(hubspotData.data).forEach(([dataType, data]) => {
    setUserData(userId, dataType, data);
  });
}

