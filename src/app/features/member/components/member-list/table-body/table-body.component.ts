import {Component, inject} from '@angular/core';
import {MemberStateService} from "../../../services/member.state.service";
import {TableFiltersComponent} from "../table-filters/table-filters.component";

@Component({
  selector: 'app-table-body',
  standalone: true,
  imports: [
    TableFiltersComponent
  ],
  templateUrl: './table-body.component.html',
  styleUrl: './table-body.component.scss'
})
export class TableBodyComponent {
  private memberStateService = inject(MemberStateService)

  sortData(id: string) {

  }

  getSortIcon(id: string) {
    return "";
  }

  navigateToMember(memberId: any) {
    // In a real implementation, this would use the Angular Router to navigate.
    console.log('Navigating to member with id:', memberId);
  }
}
