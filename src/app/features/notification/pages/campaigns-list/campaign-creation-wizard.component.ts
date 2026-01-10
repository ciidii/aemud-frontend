import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CampaignService, RecipientGroupDto } from '../../services/campaign.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-campaign-creation-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './campaign-creation-wizard.component.html',
  styleUrl: './campaign-creation-wizard.component.scss'
})
export class CampaignCreationWizardComponent implements OnInit {
  
  isVisible = false;
  currentStep = 1;
  
  wizardForm: FormGroup;
  
  // Step 2 Data
  recipientGroups: RecipientGroupDto[] = [];
  filteredRecipientGroups: RecipientGroupDto[] = [];
  isLoadingGroups = false;
  loadGroupsError: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private campaignService: CampaignService
  ) {
    this.wizardForm = this.fb.group({
      campaignName: ['', Validators.required],
      recipientGroupId: [null, Validators.required],
      searchKeyword: [''] // New search form control
    });
  }
  
  ngOnInit(): void {
    // Listen for changes in searchKeyword to filter recipient groups
    this.wizardForm.get('searchKeyword')?.valueChanges
      .pipe(
        debounceTime(300), // Wait for 300ms after the last keystroke
        distinctUntilChanged() // Only emit if value is different from previous value
      )
      .subscribe(keyword => {
        this.filterRecipientGroups(keyword);
      });
  }
  
  open() {
    this.isVisible = true;
  }
  
  close() {
    this.isVisible = false;
    this.currentStep = 1;
    this.wizardForm.reset();
    this.recipientGroups = []; // Clear groups on close
    this.filteredRecipientGroups = []; // Clear filtered groups on close
  }
  
  nextStep() {
    if (this.currentStep < 4) {
      if (this.currentStep === 1) {
        this.wizardForm.get('campaignName')?.markAsTouched();
        if (this.wizardForm.get('campaignName')?.invalid) {
          return;
        }
      }
      if (this.currentStep === 2) {
        this.wizardForm.get('recipientGroupId')?.markAsTouched();
        if (this.wizardForm.get('recipientGroupId')?.invalid) {
          return;
        }
      }
      
      this.currentStep++;
      
      if (this.currentStep === 2 && this.recipientGroups.length === 0) {
        this.loadRecipientGroups();
      }
    }
  }
  
  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    // Allow navigation to previous steps without re-validation
    if (step < this.currentStep) {
      this.currentStep = step;
    } else {
      // Forwards navigation needs validation
      if (this.currentStep === 1) {
        this.wizardForm.get('campaignName')?.markAsTouched();
        if (this.wizardForm.get('campaignName')?.invalid) {
          return;
        }
      }
      if (this.currentStep === 2) {
        this.wizardForm.get('recipientGroupId')?.markAsTouched();
        if (this.wizardForm.get('recipientGroupId')?.invalid) {
          return;
        }
      }
      // If valid, allow navigation
      if (step === this.currentStep + 1) {
        this.currentStep = step;
      }
    }
    
    if (this.currentStep === 2 && this.recipientGroups.length === 0) {
      this.loadRecipientGroups();
    }
  }
  
  loadRecipientGroups() {
    this.isLoadingGroups = true;
    this.loadGroupsError = null;
    this.campaignService.getRecipientGroups().subscribe({
      next: (groups) => {
        this.recipientGroups = groups;
        this.filterRecipientGroups(this.wizardForm.get('searchKeyword')?.value); // Filter initially
        this.isLoadingGroups = false;
      },
      error: (err) => {
        console.error(err);
        this.loadGroupsError = "Impossible de charger les groupes de destinataires.";
        this.isLoadingGroups = false;
      }
    });
  }

  filterRecipientGroups(keyword: string): void {
    if (!keyword) {
      this.filteredRecipientGroups = [...this.recipientGroups];
    } else {
      this.filteredRecipientGroups = this.recipientGroups.filter(group =>
        group.name.toLowerCase().includes(keyword.toLowerCase()) ||
        group.description.toLowerCase().includes(keyword.toLowerCase())
      );
    }
  }

  selectGroup(groupId: string) {
    this.wizardForm.get('recipientGroupId')?.setValue(groupId);
  }

  getStepClass(step: number): string {
    if (step < this.currentStep) {
      return 'completed';
    }
    if (step === this.currentStep) {
      return 'active';
    }
    return '';
  }
}
