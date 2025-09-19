import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { PersonalInfo } from "../../../../../core/models/member-data.model";
import {
  PersonalInfoFormComponent
} from "../../../components/member-add/personal-info-form/personal-info-form.component";

@Component({
  selector: 'app-edit-personal-info-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PersonalInfoFormComponent],
  templateUrl: './edit-personal-info-modal.component.html',
  styleUrls: ['./edit-personal-info-modal.component.scss']
})
export class EditPersonalInfoModalComponent implements OnInit {

  @Input() initialData!: PersonalInfo;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<PersonalInfo>();

  editForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      personalInfo: [this.initialData]
    });
  }

  onSave(): void {
    if (this.editForm.valid) {
      this.save.emit(this.editForm.value.personalInfo);
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
