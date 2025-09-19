import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ContactInfoRequest } from "../../../../../core/models/member-data.model";
import { ContactInfoFormComponent } from "../../../components/member-add/contact-info-form/contact-info-form.component";

@Component({
  selector: 'app-edit-contact-info-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ContactInfoFormComponent],
  templateUrl: './edit-contact-info-modal.component.html',
  styleUrls: ['./edit-contact-info-modal.component.scss']
})
export class EditContactInfoModalComponent implements OnInit {

  @Input() initialData!: ContactInfoRequest;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<ContactInfoRequest>();

  editForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      contactInfo: [this.initialData]
    });
  }

  onSave(): void {
    if (this.editForm.valid) {
      this.save.emit(this.editForm.value.contactInfo);
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
