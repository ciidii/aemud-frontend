import { Component, EventEmitter, Output } from '@angular/core';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { NgForOf, NgIf } from "@angular/common";

// Data is now grouped by category from MemberModel
const GROUPED_COLUMNS_DATA = [
  {
    groupTitle: 'Informations Personnelles',
    columns: [
      { id: 'name', label: 'Nom' },
      { id: 'firstname', label: 'Prénom' },
      { id: 'nationality', label: 'Nationalité' },
      { id: 'gender', label: 'Genre' },
      { id: 'birthday', label: 'Date de Naissance' },
      { id: 'maritalStatus', label: 'État Civil' },
    ]
  },
  {
    groupTitle: 'Informations de Contact',
    columns: [
      { id: 'numberPhone', label: 'Téléphone' },
      { id: 'email', label: 'Email' },
      { id: 'personToCall', label: 'Personne à contacter' },
    ]
  },
  {
    groupTitle: 'Informations Académiques',
    columns: [
      { id: 'institutionName', label: 'Établissement' },
      { id: 'studiesDomain', label: 'Domaine d\'études' },
      { id: 'studiesLevel', label: 'Niveau d\'études' },
    ]
  },
  {
    groupTitle: 'Adhésion',
    columns: [
      { id: 'registrationStatus', label: 'Statut d\'inscription' },
      { id: 'paymentStatus', label: 'Statut de Paiement' },
      { id: 'clubs', label: 'Clubs' },
      { id: 'commissions', label: 'Commissions' },
    ]
  }
];

@Component({
  selector: 'app-export-modal',
  templateUrl: './export-modal.component.html',
  styleUrls: ['./export-modal.component.scss'],
  standalone: true,
  imports: [ModalComponent, NgIf, NgForOf],
})
export class ExportModalComponent {
  @Output() close = new EventEmitter<void>();

  groupedColumns = GROUPED_COLUMNS_DATA;
  selectedColumns: { [key: string]: boolean } = {};
  selectedFormat: 'excel' | 'pdf' | 'csv' = 'excel';

  constructor() {
    this.selectAll();
  }

  selectAll() {
    this.groupedColumns.forEach(group => {
      group.columns.forEach(col => this.selectedColumns[col.id] = true);
    });
  }

  deselectAll() {
    this.groupedColumns.forEach(group => {
      group.columns.forEach(col => this.selectedColumns[col.id] = false);
    });
  }

  toggleColumn(columnId: string) {
    this.selectedColumns[columnId] = !this.selectedColumns[columnId];
  }

  onExport() {
    console.log('Exporting...');
    console.log('Selected format:', this.selectedFormat);
    console.log('Selected columns:', Object.keys(this.selectedColumns).filter(k => this.selectedColumns[k]));
    this.close.emit();
  }
}
