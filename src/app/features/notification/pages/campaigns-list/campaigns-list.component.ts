import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-campaigns-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './campaigns-list.component.html',
  styleUrl: './campaigns-list.component.scss'
})
export class CampaignsListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
