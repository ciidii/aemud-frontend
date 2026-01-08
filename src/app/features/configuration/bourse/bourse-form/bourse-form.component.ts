import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ValidationMessageComponent} from '../../../../shared/components/validation-message/validation-message.component';
import {BourseModel} from "../../../../core/models/bourse.model";

@Component({
  selector: 'app-bourse-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ValidationMessageComponent],
  templateUrl: './bourse-form.component.html',
  styleUrls: ['./bourse-form.component.scss']
})
export class BourseFormComponent implements OnInit {
  @Input() bourse: BourseModel | null = null;
  @Input() isSaving: boolean = false;
  @Output() save = new EventEmitter<BourseModel>();
  @Output() closeModal = new EventEmitter<void>();

  bourseForm!: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.bourseForm = this.fb.group({
      id: [this.bourse?.id],
      libelle: [this.bourse?.libelle || '', [Validators.required, Validators.minLength(3)]],
      montant: [this.bourse?.montant || null, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.bourseForm.valid) {
      this.save.emit(this.bourseForm.value);
    }
  }
}
