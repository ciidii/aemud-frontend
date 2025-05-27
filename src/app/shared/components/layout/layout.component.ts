import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AsideBareComponent} from "../aside-bare/aside-bare.component";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  imports: [RouterOutlet, AsideBareComponent]
})
export class LayoutComponent {
}
