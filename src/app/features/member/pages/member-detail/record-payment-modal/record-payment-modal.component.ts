import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ContributionMonth} from "../../../../../core/models/contribution-data.model";

@Component({
  selector: 'app-record-payment-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './record-payment-modal.component.html',
  styleUrls: ['./record-payment-modal.component.scss']
})
export class RecordPaymentModalComponent implements OnInit {
  @Input() contributions: ContributionMonth[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ contributionsID: string[], payementMethode: string }>();

  paymentForm: FormGroup;
  totalAmount = 0;
  monthNames: string[] = [];
  paymentMethods = ['CASH', 'ORANGE_MONEY', 'WAVE_MONEY'];

  constructor(private fb: FormBuilder) {
    this.paymentForm = this.fb.group({
      payementMethode: ['CASH', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.contributions && this.contributions.length > 0) {
      this.totalAmount = this.contributions.reduce((sum, item) => sum + (item.montantDu - item.montantPaye), 0);
      this.monthNames = this.contributions.map(item =>
        new Date(item.month[0], item.month[1] - 1).toLocaleString('fr-FR', {month: 'long'})
      );
    }
  }

  onSave(): void {
    if (this.paymentForm.valid) {
      this.save.emit({
        contributionsID: this.contributions.map(c => c.idContribution),
        ...this.paymentForm.value
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
