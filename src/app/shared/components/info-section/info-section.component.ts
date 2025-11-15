import {Component, Input} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {FormatKeyPipe} from "../../pipes/format-key.pipe";
import {ToDatePipe} from "../../pipes/to-date.pipe";

@Component({
  selector: 'app-info-section',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgClass,
    FormatKeyPipe,
    DatePipe,
    ToDatePipe
  ],
  templateUrl: './info-section.component.html',
  styleUrl: './info-section.component.scss'
})
export class InfoSectionComponent {
  @Input() title = 'Section Title';
  @Input() data: any = {};
  @Input() isOpen = false;

  // We need to transform the data object into an array of key-value pairs to loop over it
  get dataAsArray(): { key: string, value: any }[] {
    return this.data ? Object.keys(this.data).map(key => ({key, value: this.data[key]})) : [];
  }

  toggleSection(): void {
    this.isOpen = !this.isOpen;
  }

  isPersonToCallArray(value: any): boolean {
    return Array.isArray(value) && value.length > 0 && 'name' in value[0];
  }
}
