import { Page } from "@shared/models/enums";
import { RoleBasedAccess } from "@shared/models/interface";
import { UserRole } from "@shared/models/types";

export const RBAC: RoleBasedAccess = {
    [Page.DASHBOARD]: [
        { roles: ['ADMIN'], features: 'ALL' },
        { roles: ['SALES_PERSON', 'PROCUREMENT_OFFICER'], features: ['VIEW_CHARTS', 'VIEW_RECENT_ACTIVITIES'] }
    ],
    [Page.SUPPLIERS]: [
        { roles: ['ADMIN'], features: 'ALL' },
    ],
    [Page.USERS]: [
        { roles: ['ADMIN'], features: 'ALL' }
    ],
    [Page.CUSTOMERS]: [
        { roles: ['ADMIN', 'SALES_PERSON'], features: 'ALL' }
    ],
    [Page.INVENTORY]: [
        { roles: ['ADMIN'], features: 'ALL' },
        { roles: ['PROCUREMENT_OFFICER'], features: ['VIEW_INVENTORY', 'VIEW_RESTOCK_HISTORY'] },
    ],
    [Page.SALES]: [
        { roles: ['ADMIN', 'SALES_PERSON'], features: 'ALL' },
    ],
    [Page.REPORTS]: [
        { roles: ['ADMIN'], features: 'ALL' }
    ]
};

// Dashboard feature constants
export const DASHBOARD_FEATURES = {
    VIEW_TOP_CARDS: 'VIEW_TOP_CARDS',
    VIEW_CHARTS: 'VIEW_CHARTS',
    VIEW_RECENT_ACTIVITIES: 'VIEW_RECENT_ACTIVITIES'
} as const;

// Inventory feature constants
export const INVENTORY_FEATURES = {
    VIEW_PRODUCTS: 'VIEW_PRODUCTS',
    VIEW_INVENTORY: 'VIEW_INVENTORY',
    VIEW_RESTOCK_HISTORY: 'VIEW_RESTOCK_HISTORY'
} as const;
