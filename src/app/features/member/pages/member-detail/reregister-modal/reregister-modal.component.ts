import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {TypeInscription} from "../../../../../core/models/member-data.model";
import {PeriodeMandatDto} from "../../../../periode-mandat/models/periode-mandat.model";

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
  @Input() availableMandats: PeriodeMandatDto[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  reregisterForm!: FormGroup;
  registrationTypes = Object.values(TypeInscription);

  private formBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.reregisterForm = this.formBuilder.group({
      phaseId: [null, Validators.required],
      statusPayment: [false, Validators.required],
      registrationType: [TypeInscription.INITIAL, Validators.required]
    });
  }

  onSave(): void {
    if (this.reregisterForm.valid) {
      this.save.emit(this.reregisterForm.value);
      this.close.emit();
    }
  }
}
