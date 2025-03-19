import {Component, OnInit} from '@angular/core';
import {LayoutComponent} from "../../../shared/components/layout/layout.component";

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    LayoutComponent
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css'
})
export class ShellComponent implements OnInit {
  ngOnInit(): void {
  }
}
