import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from '../../../core/header/header.component';
import {AsideBareComponent} from "../aside-bare/aside-bare.component";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, AsideBareComponent]
})
export class LayoutComponent {

}
