export interface StatusColorConfig {
  color: string;
  backgroundColor: string;
}

export const STATUS_COLORS = {
  // Active/In-use status
  ACTIVE: {
    color: '#10b981',
    backgroundColor: '#d1fae5'
  },
  
  // Inactive/Discontinued/Fired status 
  INACTIVE: {
    color: '#ef4444',
    backgroundColor: '#fee2e2'
  },
  
  // Quit/Outstanding status 
  QUIT: {
    color: '#f59e0b',
    backgroundColor: '#fef3c7'
  }
} as const;
