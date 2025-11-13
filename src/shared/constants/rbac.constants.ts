import { Feature } from "@shared/models/enums";
import { RoleBasedAccess } from "@shared/models/interface";

export const RBAC: RoleBasedAccess[] = [
    {
        [Feature.SUPPLIERS]: [
            {
                role: ['ANY'],
                resource: /\/suppliers\?/,
                actions: ['GET']
            },
            {
                role: ['ADMIN'],
                resource: /\/suppliers/,
                actions: ['GET', 'POST', 'PATCH', 'DELETE']
            }
        ],
        [Feature.USERS]: [
            {
                role: ['ADMIN'],
                resource: /\/users/,
                actions: ['GET', 'POST', 'PATCH', 'DELETE']
            }
        ],
        [Feature.CUSTOMERS]: [
            {
                role: ['ADMIN', 'SALES_PERSON'],
                resource: /\/customers/,
                actions: ['GET', 'POST', 'PATCH', 'DELETE']
            }
        ],
        [Feature.PRODUCTS]: [
            {
                role: ['ANY'],
                resource: /\/products\?/,
                actions: ['GET']
            },
            {
                role: ['ADMIN'],
                resource: /\/products/,
                actions: ['GET', 'POST', 'PATCH', 'DELETE']
            },
            {
                role: ['PROCUREMENT_OFFICER'],
                resource: /\/products\/(live-search|restock|stocks|restock-history)/,
                actions: ['GET', 'POST', 'PATCH']
            },
            {
                role: ['SALES_PERSON'],
                resource: /\/products\/stock-live-search/,
                actions: ['GET']
            }
        ],
        [Feature.PRODUCT_CATEGORIES]: [
            {
                role: ['ADMIN'],
                resource: /\/categories/,
                actions: ['GET', 'POST', 'PATCH']
            }
        ],
        [Feature.SALES]: [
            {
                role: ['ADMIN', 'SALES_PERSON'],
                resource: /\/sales/,
                actions: ['GET', 'POST', 'PATCH']
            }
        ],
        [Feature.REPORTS]: [
            {
                role: ['ADMIN'],
                resource: /\/reports/,
                actions: ['GET']
            },
            {
                role: ['SALES_PERSON'],
                resource: /\/report\/arrears/,
                actions: ['GET']
            }
        ]
    }
]
