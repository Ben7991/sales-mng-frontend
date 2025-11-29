export interface StatusColorConfig {
  color: string;
  backgroundColor: string;
}

export const STATUS_COLORS = {
  // Active/In-use status
  GREEN: {
    color: '#10b981',
    backgroundColor: '#d1fae5'
  },
  // Inactive/Discontinued/Fired status 
  RED: {
    color: '#ef4444',
    backgroundColor: '#fee2e2'
  },
  // Quit/Outstanding status 
  ORANGE: {
    color: '#f59e0b',
    backgroundColor: '#fef3c7'
  },
  // Neutral status
  GREY: {
    color: '#808080ff',
    backgroundColor: '#e2e2e3ff'
  }
} as const;
