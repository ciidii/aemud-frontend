import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-reregister-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './reregister-modal.component.html',
  styleUrl: './reregister-modal.component.scss'
})
export class ReregisterModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  private formBuilder = inject(FormBuilder);
  reregisterForm!: FormGroup;

  // TODO: Fetch sessions/years from a service
  availableSessions = [new Date().getFullYear(), new Date().getFullYear() - 1];
  registrationTypes = ['Initiale', 'Réinscription'];

  ngOnInit(): void {
    this.reregisterForm = this.formBuilder.group({
      session: [new Date().getFullYear(), Validators.required],
      statusPayment: [false, Validators.required],
      registrationType: ['Réinscription', Validators.required]
    });
  }

  onSave(): void {
    if (this.reregisterForm.valid) {
      this.save.emit(this.reregisterForm.value);
      this.close.emit();
    }
  }
}
