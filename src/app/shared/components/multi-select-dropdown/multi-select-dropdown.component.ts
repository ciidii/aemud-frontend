import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-multiselect-dropdown',
  templateUrl: '/multi-select-dropdown.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  styleUrls: ['./multi-select-dropdown.component.html']
})
export class MultiSelectDropdownComponent implements OnInit {

  formGroup!: FormGroup;
  items = [
    { id: 'item1', name: 'Option 1' },
    { id: 'item2', name: 'Option 2' },
    { id: 'item3', name: 'Option 3' },
    { id: 'item4', name: 'Option 4' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group(
      this.items.reduce((controls, item) => {
        // @ts-ignore
        controls[item.id] = new FormControl(false);
        return controls;
      }, {})
    );
  }

  // Méthode pour obtenir les éléments sélectionnés
  getSelectedItems(): string {
    const selectedItems = this.items
      .filter(item => this.formGroup.get(item.id)?.value)
      .map(item => item.name);
    // @ts-ignore
    return selectedItems.length ? selectedItems.join(', ') : null;
  }

  // Méthode de test pour soumettre le formulaire
  submitForm() {
    console.log('Items sélectionnés :', this.getSelectedItems());
  }
}
