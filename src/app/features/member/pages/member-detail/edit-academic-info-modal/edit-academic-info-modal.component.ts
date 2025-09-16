import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AcademicInfoRequest, MembershipInfo } from "../../../../../core/models/member-data.model";
import { AcademicInfoFormComponent } from "../../../components/member-add/academic-info-form/academic-info-form.component";

// The data this modal works with is a combination of two interfaces
export type AcademicAndMembershipData = AcademicInfoRequest & MembershipInfo;

@Component({
  selector: 'app-edit-academic-info-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AcademicInfoFormComponent],
  templateUrl: './edit-academic-info-modal.component.html',
  styleUrls: ['./edit-academic-info-modal.component.scss']
})
export class EditAcademicInfoModalComponent implements OnInit {

  @Input() initialData!: AcademicAndMembershipData;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<AcademicAndMembershipData>();

  editForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      academicInfo: [this.initialData]
    });
  }

  onSave(): void {
    if (this.editForm.valid) {
      this.save.emit(this.editForm.value.academicInfo);
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
