export interface SearchConfig {
  placeholder?: string;
  debounceTime?: number;
  searchFields?: string[];
  caseSensitive?: boolean;
  minLength?: number;
  showClearButton?: boolean;
  appearance?: 'fill' | 'outline';
  floatLabel?: 'auto' | 'always';
}
