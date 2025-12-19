/**
 * Pending Actions Manager
 * 
 * Manages pending user actions (like, dislike, save, compare) for public users.
 * After sign-in, these actions are executed and saved to user's account.
 * HubSpot-friendly: Easy to import/export data to/from HubSpot CRM.
 */

export type PendingActionType = 'like' | 'dislike' | 'save' | 'compare';

export interface PendingAction {
  type: PendingActionType;
  franchiseId: string;
  franchiseName: string;
  franchiseData?: {
    logo?: string | null;
    grade?: "A" | "B" | "C" | "D";
    investmentMin?: number;
    investmentMax?: number;
    sector?: string;
    category?: string;
  };
  timestamp: string;
}

const STORAGE_KEY_PENDING_ACTIONS = 'franchise_clarity_pending_actions';

/**
 * Get all pending actions from sessionStorage
 * HubSpot-friendly: Can be exported to HubSpot as engagement data
 */
export function getPendingActions(): PendingAction[] {
  if (typeof window === 'undefined') return [];
  const stored = sessionStorage.getItem(STORAGE_KEY_PENDING_ACTIONS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Add a pending action
 * HubSpot-friendly: Stores action data that can be synced to HubSpot after sign-in
 */
export function addPendingAction(action: Omit<PendingAction, 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  
  const pendingActions = getPendingActions();
  const newAction: PendingAction = {
    ...action,
    timestamp: new Date().toISOString(),
  };
  
  // Check if action already exists for this franchise
  const existingIndex = pendingActions.findIndex(
    (a) => a.type === action.type && a.franchiseId === action.franchiseId
  );
  
  if (existingIndex >= 0) {
    // Update existing action
    pendingActions[existingIndex] = newAction;
  } else {
    // Add new action
    pendingActions.push(newAction);
  }
  
  sessionStorage.setItem(STORAGE_KEY_PENDING_ACTIONS, JSON.stringify(pendingActions));
}

/**
 * Remove a pending action
 */
export function removePendingAction(type: PendingActionType, franchiseId: string): void {
  if (typeof window === 'undefined') return;
  
  const pendingActions = getPendingActions();
  const filtered = pendingActions.filter(
    (a) => !(a.type === type && a.franchiseId === franchiseId)
  );
  
  sessionStorage.setItem(STORAGE_KEY_PENDING_ACTIONS, JSON.stringify(filtered));
}

/**
 * Clear all pending actions
 */
export function clearPendingActions(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_KEY_PENDING_ACTIONS);
}

/**
 * Get pending actions by type
 * HubSpot-friendly: Can filter by action type for HubSpot sync
 */
export function getPendingActionsByType(type: PendingActionType): PendingAction[] {
  return getPendingActions().filter((a) => a.type === type);
}

/**
 * Export pending actions for HubSpot
 * HubSpot-friendly: Formats data for easy import to HubSpot CRM
 * 
 * Data structure is optimized for HubSpot contact properties:
 * - Can map to custom properties like "pending_likes", "pending_saves", etc.
 * - Timestamps can be used for engagement scoring
 * - Franchise IDs can be linked to HubSpot deal/company records
 */
export function exportPendingActionsForHubSpot(): {
  actions: Array<{
    actionType: PendingActionType;
    franchiseId: string;
    franchiseName: string;
    timestamp: string;
    metadata: Record<string, unknown>;
  }>;
  summary: {
    totalActions: number;
    likes: number;
    dislikes: number;
    saves: number;
    compares: number;
  };
} {
  const actions = getPendingActions();
  return {
    actions: actions.map((action) => ({
      actionType: action.type,
      franchiseId: action.franchiseId,
      franchiseName: action.franchiseName,
      timestamp: action.timestamp,
      metadata: {
        ...action.franchiseData,
        // HubSpot-friendly: Additional metadata can be added here
        // These fields can map to HubSpot custom properties
      },
    })),
    summary: {
      totalActions: actions.length,
      likes: actions.filter((a) => a.type === 'like').length,
      dislikes: actions.filter((a) => a.type === 'dislike').length,
      saves: actions.filter((a) => a.type === 'save').length,
      compares: actions.filter((a) => a.type === 'compare').length,
    },
  };
}

/**
 * Import actions from HubSpot
 * HubSpot-friendly: Can import user actions from HubSpot CRM
 * 
 * @param hubspotData - Data from HubSpot API
 */
export function importActionsFromHubSpot(hubspotData: {
  actions: Array<{
    actionType: PendingActionType;
    franchiseId: string;
    franchiseName: string;
    timestamp: string;
    metadata?: Record<string, unknown>;
  }>;
}): void {
  if (typeof window === 'undefined') return;
  
  const pendingActions: PendingAction[] = hubspotData.actions.map((action) => ({
    type: action.actionType,
    franchiseId: action.franchiseId,
    franchiseName: action.franchiseName,
    franchiseData: action.metadata as PendingAction['franchiseData'],
    timestamp: action.timestamp,
  }));
  
  sessionStorage.setItem(STORAGE_KEY_PENDING_ACTIONS, JSON.stringify(pendingActions));
}

