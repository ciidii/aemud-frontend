import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './filter-panel.component.html',
  styleUrl: './filter-panel.component.scss'
})
export class FilterPanelComponent implements OnInit {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() applyFilters = new EventEmitter<any>();
  @Output() resetFilters = new EventEmitter<void>();

  private formBuilder = inject(FormBuilder);
  filterForm!: FormGroup;

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      statusPaid: [false],
      statusPending: [false],
      club: [''],
      commission: [''],
      dateFrom: [''],
      dateTo: ['']
    });
  }

  onApply(): void {
    this.applyFilters.emit(this.filterForm.value);
    this.close.emit();
  }

  onReset(): void {
    this.filterForm.reset();
    this.resetFilters.emit();
  }
}
