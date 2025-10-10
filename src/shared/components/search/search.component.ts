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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SearchConfig } from '@shared/components/search/interface';
import { debounceTime, distinctUntilChanged } from 'rxjs';

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
  @Input() config: SearchConfig = {};

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
      });
  }

  protected clearSearch() {
    this.searchControl.setValue('');
    this.searchCleared.emit();
  }

  protected getContainerWidth(): string {
    if (this.config.width) {
      return this.config.width;
    }
    
    return '300px';
  }
}
