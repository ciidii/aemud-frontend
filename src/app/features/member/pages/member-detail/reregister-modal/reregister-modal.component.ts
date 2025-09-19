import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {SessionModel} from "../../../../../core/models/session.model";
import {TypeInscription} from "../../../../../core/models/member-data.model";

@Component({
  selector: 'app-reregister-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './reregister-modal.component.html',
  styleUrl: './reregister-modal.component.scss'
})
export class ReregisterModalComponent implements OnInit {
  @Input() availableSessions: SessionModel[] = [];
  @Input() currentSessionYear: number | undefined;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  private formBuilder = inject(FormBuilder);
  reregisterForm!: FormGroup;

  registrationTypes = Object.values(TypeInscription);

  ngOnInit(): void {
    this.reregisterForm = this.formBuilder.group({
      sessionId: [this.currentSessionYear, Validators.required],
      statusPayment: [false, Validators.required],
      registrationType: [TypeInscription.REINSCRIPTION, Validators.required]
    });
  }

  onSave(): void {
    if (this.reregisterForm.valid) {
      this.save.emit(this.reregisterForm.value);
      this.close.emit();
    }
  }
}
