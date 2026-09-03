import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-phase-form-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './phase-form-item.component.html',
  styleUrls: ['./phase-form-item.component.scss']
})
export class PhaseFormItemComponent {
  @Input() phaseForm!: FormGroup;
  @Input() index!: number;
  @Output() delete = new EventEmitter<number>();

  constructor() {
  }

  onDelete(): void {
    this.delete.emit(this.index);
  }
}
