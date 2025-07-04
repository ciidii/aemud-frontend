// contribution-home.component.ts
import { Component } from '@angular/core';
import { AddContributionComponent } from '../add-contribution/add-contribution.component';
import { ListContributionComponent } from '../list-contribution/list-contribution.component';

@Component({
  selector: 'app-contribution-home',
  standalone: true,
  imports: [
    AddContributionComponent,
    ListContributionComponent
  ],
  templateUrl: './contribution-home.component.html',
  styleUrl: './contribution-home.component.css'
})
export class ContributionHomeComponent {
  // This array will hold the simulated contributions
  simulatedContributions: any[] = [];

  // This method will be called when a new contribution is added from the AddContributionComponent
  onContributionAdded(newContribution: any): void {
    this.simulatedContributions.push(newContribution);
    console.log('Simulated Contributions:', this.simulatedContributions);
  }
}
