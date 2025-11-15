import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';

// Define the interface for the address data
export interface AddressInfo {
  addressInDakar: string;
  addressToCampus: string;
}

@Component({
  selector: 'app-edit-address-info-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-address-info-modal.component.html',
  styleUrls: ['./edit-address-info-modal.component.scss']
})
export class EditAddressInfoModalComponent implements OnInit {
  @Input() initialData!: AddressInfo;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<AddressInfo>();
  addressForm!: FormGroup;
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.addressForm = this.fb.group({
      addressInDakar: [this.initialData?.addressInDakar || '', Validators.required],
      addressToCampus: [this.initialData?.addressToCampus || '', Validators.required]
    });
  }

  onSave(): void {
    if (this.addressForm.valid) {
      this.save.emit(this.addressForm.value);
      this.onClose();
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
