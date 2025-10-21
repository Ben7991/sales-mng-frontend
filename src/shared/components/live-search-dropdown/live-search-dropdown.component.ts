import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LiveSearchItem } from '@shared/models/interface';

@Component({
    selector: 'app-live-search-dropdown',
    imports: [],
    templateUrl: './live-search-dropdown.component.html',
    styleUrl: './live-search-dropdown.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LiveSearchDropdownComponent {
    public show = input.required<boolean>();
    public isSearching = input.required<boolean>();
    public searchResults = input.required<LiveSearchItem[]>();
    public headerText = input<string>('Existing items');

    public itemSelected = output<LiveSearchItem>();

    protected onItemClick(item: LiveSearchItem, event: MouseEvent): void {
        event.preventDefault();
        this.itemSelected.emit(item);
    }
}
