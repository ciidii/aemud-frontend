import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {ModalComponent} from '../../../../../shared/components/modal/modal.component';
import {NgForOf, NgIf} from "@angular/common";
import {SearchParams} from "../../../../../core/models/SearchParams";
import {MemberHttpService} from "../../../services/member.http.service";
import {ToastrService} from "ngx-toastr";
import {ColumnExport, ExportFormat, MemberExportRequestDto} from "../../../../../core/models/member-export-request.model";
import {AppStateService} from "../../../../../core/services/app-state.service";
import {MemberStateService} from "../../../services/member.state.service";
import {firstValueFrom} from "rxjs";

interface ColumnDefinition {
  id: string; // The value to be sent as 'key' to the API
  label: string;
}

const GROUPED_COLUMNS_DATA: { groupTitle: string; columns: ColumnDefinition[] }[] = [
  {
    groupTitle: 'Informations Personnelles',
    columns: [
      {id: 'personalInfo.name', label: 'Nom'},
      {id: 'personalInfo.firstname', label: 'Prénom'},
      {id: 'personalInfo.nationality', label: 'Nationalité'},
      {id: 'personalInfo.gender', label: 'Genre'},
      {id: 'personalInfo.birthday', label: 'Date de Naissance'},
      {id: 'personalInfo.maritalStatus', label: 'État Civil'},
    ]
  },
  {
    groupTitle: 'Informations de Contact',
    columns: [
      {id: 'contactInfo.numberPhone', label: 'Téléphone'},
      {id: 'contactInfo.email', label: 'Email'},
    ]
  },
  {
    groupTitle: 'Informations Académiques',
    columns: [
      {id: 'academicInfo.institutionName', label: 'Établissement'},
      {id: 'academicInfo.studiesDomain', label: 'Domaine d\'études'},
      {id: 'academicInfo.studiesLevel', label: 'Niveau d\'études'},
    ]
  },
  {
    groupTitle: 'Informations d\'Adhésion',
    columns: [
      {id: 'membershipInfo.legacyInstitution', label: 'Ancien Établissement'},
      {id: 'membershipInfo.bacSeries', label: 'Série du BAC'},
      {id: 'membershipInfo.yearOfBac', label: 'Année du BAC'},
    ]
  },
  {
    groupTitle: 'Adresse',
    columns: [
      {id: 'addressInfo.addressInDakar', label: 'Adresse à Dakar'},
      {id: 'addressInfo.holidayAddress', label: 'Adresse de Vacances'},
    ]
  }
];

@Component({
  selector: 'app-export-modal',
  templateUrl: './export-modal.component.html',
  styleUrls: ['./export-modal.component.scss'],
  standalone: true,
  imports: [ModalComponent, NgForOf, NgIf],
})
export class ExportModalComponent {
  @Input() searchRequest: Partial<SearchParams> | null = {};
  @Output() close = new EventEmitter<void>();

  groupedColumns = GROUPED_COLUMNS_DATA;
  selectedColumns: Record<string, boolean> = {};
  selectedFormat: 'excel' | 'pdf' | 'csv' = 'excel';
  isExporting = false;

  private memberHttpService = inject(MemberHttpService);
  private toastr = inject(ToastrService);
  private  memberStateService =  inject(MemberStateService);
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

 async onExport() {
    this.isExporting = true;
    const memberIds = await firstValueFrom(this.memberStateService.selectedMemberIds$);
    const selectedColumns: ColumnExport[] = this.groupedColumns.flatMap(g => g.columns)
      .filter(c => this.selectedColumns[c.id])
      .map(c => ({key: c.id, header: c.label}));

    if (selectedColumns.length === 0) {
      this.toastr.warning('Veuillez sélectionner au moins une colonne à exporter.');
      this.isExporting = false;
      return;
    }

    const request: MemberExportRequestDto = {
      format: this.selectedFormat.toUpperCase() as ExportFormat,
      columns: selectedColumns,
      searchRequest: {
        ...this.searchRequest,
        rpp: 10000,
        page: 1,
      },
      memberIds:memberIds
    };

    this.memberHttpService.exportMembers(request).subscribe({
      next: (response) => {
        console.log(request);
        const contentDisposition = response.headers.get('content-disposition');
        let filename = 'members-export.dat'; // Fallback filename
        if (contentDisposition) {
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(contentDisposition);
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
          }
        }

        const blob = new Blob([response.body!], {type: response.headers.get('content-type')!});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        this.toastr.success('Le téléchargement va commencer.', 'Exportation réussie');
        this.isExporting = false;
        this.close.emit();
      },
      error: (err) => {
        console.error('Export failed', err);
        this.toastr.error('Une erreur est survenue lors de l\'exportation.', 'Échec de l\'exportation');
        this.isExporting = false;
      }
    });
  }
}
