import {Component, ElementRef, forwardRef, HostListener, Input} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-custom-multiselect',
  templateUrl: './custom-multiselect.component.html',
  styleUrls: ['./custom-multiselect.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomMultiselectComponent),
      multi: true
    }
  ]
})
export class CustomMultiselectComponent implements ControlValueAccessor {

  // --- Inputs ---
  @Input() displayField = 'name';
  @Input() valueField = 'id';
  @Input() placeholder = 'Sélectionner...';

  public selectedItems: any[] = [];
  public filteredItems: any[] | null = [];
  public searchTerm = '';
  public isOpen = false;
  public isDisabled = false;
  private _value: string[] = [];


  constructor(private eRef: ElementRef) {
  }

  // --- Private properties for robust initialization ---
  private _items: any[] | null = [];

  @Input()
  get items(): any[] | null {
    return this._items;
  }

  set items(val: any[] | null) {
    this._items = val;
    this.updateSelectedItemsFromValue();
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target) && this.isOpen) {
      this.isOpen = false;
      this.onTouched();
    }
  }

  writeValue(value: string[]): void {
    this._value = value || [];
    this.updateSelectedItemsFromValue();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  // --- Component Logic ---
  toggleDropdown(): void {
    if (this.isDisabled) return;

    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.filteredItems = this.items;
      this.searchTerm = '';
    } else {
      this.onTouched();
    }
  }

  onItemSelect(item: any): void {
    if (this.isDisabled) return;

    const isCurrentlySelected = this.isSelected(item);
    if (isCurrentlySelected) {
      const index = this.selectedItems.findIndex(selected => selected[this.valueField] === item[this.valueField]);
      if (index > -1) {
        this.selectedItems.splice(index, 1);
      }
    } else {
      this.selectedItems.push(item);
    }

    this._value = this.selectedItems.map(i => i[this.valueField]);
    this.onChange(this._value);
  }

  onSearch(): void {
    if (!this.items) {
      this.filteredItems = [];
      return;
    }
    this.filteredItems = this.items.filter(item =>
      item[this.displayField].toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  isSelected(item: any): boolean {
    return this.selectedItems.some(selected => selected[this.valueField] === item[this.valueField]);
  }

  removePill(item: any, event: MouseEvent): void {
    if (this.isDisabled) return;
    event.stopPropagation();
    this.onItemSelect(item);
  }

  // --- ControlValueAccessor Implementation ---
  private onChange = (value: any) => {
  };

  private onTouched = () => {
  };

  private updateSelectedItemsFromValue(): void {
    if (this._items && this._value) {
      this.selectedItems = this._items.filter(item => this._value.includes(item[this.valueField]));
    } else {
      this.selectedItems = [];
    }
  }
}
