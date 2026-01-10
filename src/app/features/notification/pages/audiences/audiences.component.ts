import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audiences',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audiences.component.html',
  styleUrl: './audiences.component.scss'
})
export class AudiencesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
