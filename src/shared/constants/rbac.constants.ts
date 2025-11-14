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
        { roles: ['PROCUREMENT_OFFICER'], features: ['VIEW_SUPPLIERS'] }
    ],
    [Page.USERS]: [
        { roles: ['ADMIN'], features: 'ALL' }
    ],
    [Page.CUSTOMERS]: [
        { roles: ['ADMIN', 'SALES_PERSON'], features: 'ALL' }
    ],
    [Page.INVENTORY]: [
        { roles: ['ADMIN'], features: 'ALL' },
        { roles: ['PROCUREMENT_OFFICER'], features: ['VIEW_INVENTORY', 'ADD_PRODUCT', 'EDIT_PRODUCT'] }
    ],
    [Page.SALES]: [
        { roles: ['ADMIN'], features: 'ALL' },
        { roles: ['SALES_PERSON'], features: ['VIEW_SALES', 'CREATE_SALE'] }
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

// Supplier feature constants
export const SUPPLIER_FEATURES = {
    VIEW_SUPPLIERS: 'VIEW_SUPPLIERS',
    ADD_SUPPLIER: 'ADD_SUPPLIER',
    EDIT_SUPPLIER: 'EDIT_SUPPLIER',
    DELETE_SUPPLIER: 'DELETE_SUPPLIER'
} as const;
