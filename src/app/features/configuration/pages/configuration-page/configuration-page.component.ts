import { Component } from '@angular/core';
import { ClubAdminComponent } from '../../club/club-admin/club-admin.component';
import { CommissionAdminComponent } from '../../commission/commission-admin/commission-admin.component';
import { BourseAdminComponent } from '../../bourse/bourse-admin/bourse-admin.component';
import { FormSchemaAdminComponent } from '../../form-schema/form-schema-admin.component';
import { SystemSettingsAdminComponent } from '../../system-settings/system-settings-admin.component';

@Component({
  selector: 'app-configuration-page',
  standalone: true,
  imports: [ClubAdminComponent, CommissionAdminComponent, BourseAdminComponent, FormSchemaAdminComponent, SystemSettingsAdminComponent],
  templateUrl: './configuration-page.component.html',
  styleUrl: './configuration-page.component.css'
})
export class ConfigurationPageComponent {

}
