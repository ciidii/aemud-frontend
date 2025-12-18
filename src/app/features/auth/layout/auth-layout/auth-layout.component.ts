import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImagePanelComponent } from '../image-panel/image-panel.component';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
  standalone: true,
  imports: [RouterOutlet, ImagePanelComponent],
})
export class AuthLayoutComponent {}
