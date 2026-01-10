import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignCreationWizardComponent } from './campaign-creation-wizard.component';

@Component({
  selector: 'app-campaigns-list',
  standalone: true,
  imports: [CommonModule, CampaignCreationWizardComponent],
  templateUrl: './campaigns-list.component.html',
  styleUrl: './campaigns-list.component.scss'
})
export class CampaignsListComponent implements OnInit {

  @ViewChild(CampaignCreationWizardComponent) wizard!: CampaignCreationWizardComponent;

  constructor() { }

  ngOnInit(): void {
    this.loadCampaigns();
  }

  loadCampaigns() {
    // Placeholder for fetching campaigns from a service
    console.log('Reloading campaigns list...');
  }

  openWizard() {
    this.wizard.open();
  }

}
