import {Component, EventEmitter, inject, Output} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-table-header',
  standalone: true,
  imports: [],
  templateUrl: './table-header.component.html',
  styleUrl: './table-header.component.scss'
})
export class TableHeaderComponent {
  @Output() exportTriggered = new EventEmitter<void>();


  private router = inject(Router);


  onAddMember() {
    this.router.navigateByUrl("/members/register-form");
  }
}
