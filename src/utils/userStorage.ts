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
 */
export function setUserData<T>(userId: string, dataType: string, data: T): void {
  if (typeof window === 'undefined') return;
  
  const key = getUserStorageKey(userId, dataType);
  localStorage.setItem(key, JSON.stringify(data));
  
  // TODO: Sync to HubSpot API
  // HubSpot-friendly: Can sync to HubSpot contact properties
  // await fetch('/api/hubspot/sync-user-data', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     userId,
  //     dataType,
  //     data,
  //     // HubSpot-friendly fields:
  //     // - userId maps to HubSpot contact ID
  //     // - dataType maps to HubSpot custom property name
  //     // - data is the value to store
  //   })
  // });
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

