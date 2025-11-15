import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {
  CustomMultiselectComponent
} from "../../../../../shared/components/custom-multiselect/custom-multiselect.component";
import {ClubService} from "../../../../configuration/services/club.service";
import {CommissionService} from "../../../../configuration/services/commission.service";
import {forkJoin} from "rxjs";
import {Club, Commission} from "../../../../../core/models/member-data.model";

export interface EngagementsData {
  clubIds: string[];
  commissionIds: string[];
}

@Component({
  selector: 'app-edit-engagements-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomMultiselectComponent],
  templateUrl: './edit-engagements-modal.component.html',
  styleUrls: ['./edit-engagements-modal.component.scss']
})
export class EditEngagementsModalComponent implements OnInit {
  // Inputs from parent
  @Input() memberClubs: Club[] = [];
  @Input() memberCommissions: Commission[] = [];

  // Outputs to parent
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<EngagementsData>();
  // Properties
  engagementsForm!: FormGroup;
  allClubs: Club[] = [];
  allCommissions: Commission[] = [];
  isLoading = true;
  // Services
  private fb = inject(FormBuilder);
  private clubService = inject(ClubService);
  private commissionService = inject(CommissionService);

  ngOnInit(): void {
    this.engagementsForm = this.fb.group({
      clubIds: [this.memberClubs.map(c => c.id)],
      commissionIds: [this.memberCommissions.map(c => c.id)]
    });

    this.isLoading = true;
    forkJoin({
      clubs: this.clubService.getAllClubs(),
      commissions: this.commissionService.getAllCommissions()
    }).subscribe(({clubs, commissions}) => {
      this.allClubs = clubs;
      this.allCommissions = commissions;
      this.isLoading = false;
    });
  }

  onSave(): void {
    if (this.engagementsForm.valid) {
      this.save.emit(this.engagementsForm.value);
      this.onClose();
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
