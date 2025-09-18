import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {SearchConfig} from '@shared/components/search/interface';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {MatIconModule} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search',
  imports: [
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() config: SearchConfig = {};
  @Input() isLoading = false;

  @Output() searchResults = new EventEmitter<any[]>();
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() searchCleared = new EventEmitter<void>();

  public searchControl = new FormControl('');
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.setupSearch();
  }

  private setupSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(this.config.debounceTime || 0),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(searchTerm => {
        const term = searchTerm || '';
        this.searchTermChange.emit(term);

        if (term.length === 0) {
          this.searchResults.emit(this.data);
          return;
        }

        if (this.config.minLength && term.length < this.config.minLength) {
          this.searchResults.emit([]);
          return;
        }

        const results = this.performSearch(term);
        this.searchResults.emit(results);
      });
  }

  private performSearch(searchTerm: string): any[] {
    if (!this.data || this.data.length === 0) {
      return [];
    }

    const term = this.config.caseSensitive ? searchTerm : searchTerm.toLowerCase();

    return this.data.filter(item => {
      if (typeof item === 'object' && item !== null) {
        if (this.config.searchFields && this.config.searchFields.length > 0) {
          return this.config.searchFields.some(field => {
            const value = this.getNestedProperty(item, field);
            if (value === null || value === undefined) return false;

            const valueStr = this.config.caseSensitive
              ? value.toString()
              : value.toString().toLowerCase();
            return valueStr.includes(term);
          });
        }

        return this.searchInAllProperties(item, term);
      }

      return false;
    });
  }

  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  private searchInAllProperties(obj: any, searchTerm: string): boolean {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        if (typeof value === 'string' || typeof value === 'number') {
          const valueStr = this.config.caseSensitive
            ? value.toString()
            : value.toString().toLowerCase();
          if (valueStr.includes(searchTerm)) {
            return true;
          }
        } else if (typeof value === 'object' && value !== null) {
          if (this.searchInAllProperties(value, searchTerm)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  clearSearch() {
    this.searchControl.setValue('');
    this.searchCleared.emit();
  }

}
