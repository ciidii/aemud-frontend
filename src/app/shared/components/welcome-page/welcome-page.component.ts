import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from '../../../core/header/header.component';

@Component({
    selector: 'app-welcome-page',
    templateUrl: './welcome-page.component.html',
    styleUrls: ['./welcome-page.component.css'],
    standalone: true,
    imports: [HeaderComponent, RouterOutlet]
})
export class WelcomePageComponent {

}
