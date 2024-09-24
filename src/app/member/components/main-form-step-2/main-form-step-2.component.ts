import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-main-form-step-2',
  templateUrl: './main-form-step-2.component.html',
  styleUrls: ['./main-form-step-2.component.css']
})
export class MainFormStep2Component implements OnInit {
  academicInfoForm!: FormGroup;
  contactInfoForm!: FormGroup;
  addressInfoForm!: FormGroup;
  @Output() previous = new EventEmitter<void>();

  ngOnInit(): void {
  }

  onAcademicInfoSubmit(form: FormGroup) {
    this.academicInfoForm = form;
  }

  onContactInfoSubmit(form: FormGroup) {
    this.contactInfoForm = form;
  }

  onAddressInfoSubmit(form: FormGroup) {
    this.addressInfoForm = form;
  }

  onPrevious() {
    this.previous.emit();
  }
}
