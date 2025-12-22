import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ValidationMessageComponent} from '../../../../shared/components/validation-message/validation-message.component';
import {Commission} from "../../../../core/models/member-data.model";

@Component({
  selector: 'app-commission-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ValidationMessageComponent],
  templateUrl: './commission-form.component.html',
  styleUrls: ['./commission-form.component.scss']
})
export class CommissionFormComponent implements OnInit {
  @Input() commission: Commission | null = null;
  @Input() isSaving: boolean = false;
  @Output() save = new EventEmitter<Commission>();
  @Output() closeModal = new EventEmitter<void>();

  commissionForm!: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.commissionForm = this.fb.group({
      id: [this.commission?.id],
      name: [this.commission?.name || '', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit(): void {
    if (this.commissionForm.valid) {
      this.save.emit(this.commissionForm.value);
    }
  }
}
