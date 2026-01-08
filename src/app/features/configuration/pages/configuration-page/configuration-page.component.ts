import { Component } from '@angular/core';
import { ClubAdminComponent } from '../../club/club-admin/club-admin.component';
import { CommissionAdminComponent } from '../../commission/commission-admin/commission-admin.component';
import { BourseAdminComponent } from '../../bourse/bourse-admin/bourse-admin.component';

@Component({
  selector: 'app-configuration-page',
  standalone: true,
  imports: [ClubAdminComponent, CommissionAdminComponent, BourseAdminComponent],
  templateUrl: './configuration-page.component.html',
  styleUrl: './configuration-page.component.css'
})
export class ConfigurationPageComponent {

}
