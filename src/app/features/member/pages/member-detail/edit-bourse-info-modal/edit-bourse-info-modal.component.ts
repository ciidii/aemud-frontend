import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {BourseModel} from '../../../../../core/models/bourse.model';

@Component({
  selector: 'app-edit-bourse-info-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-bourse-info-modal.component.html',
  styleUrls: ['./edit-bourse-info-modal.component.scss']
})
export class EditBourseInfoModalComponent implements OnInit {
  @Input() initialData!: BourseModel;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<BourseModel>();
  bourseForm!: FormGroup;
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.bourseForm = this.fb.group({
      lebelle: [this.initialData?.libelle || '', Validators.required],
      montant: [this.initialData?.montant || null, [Validators.required, Validators.min(0)]]
    });
  }

  onSave(): void {
    if (this.bourseForm.valid) {
      // Merge the form value with the initial data to keep the bourseId
      const saveData = {...this.initialData, ...this.bourseForm.value};
      this.save.emit(saveData);
      this.onClose();
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
