import {Component} from '@angular/core';

@Component({
  selector: 'tr[app-skeleton-loader]', // Use attribute selector to be a valid tr
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss'],
  standalone: true,
})
export class SkeletonLoaderComponent {
}
