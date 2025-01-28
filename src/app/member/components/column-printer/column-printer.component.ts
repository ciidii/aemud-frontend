import {Component, effect, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MemberData} from "../../../core/models/member/MemberData";
import * as XLSX from "xlsx";
import {MemberService} from "../../../core/services/member.service";
import {AppStateService} from "../../../core/services/app-state-service";
import {Profile} from "../../../core/profile.model";

@Component({
  selector: 'app-column-printer',
  standalone: true,
  templateUrl: './column-printer.component.html',
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ['./column-printer.component.css']
})
export class ColumnPrinterComponent implements OnInit {
  openModal = signal(false);
  memberForm!: FormGroup;

  constructor(private fb: FormBuilder, private memberService: MemberService, private appState: AppStateService) {
  }

  onSubmit(): void {
  }

  openPopupColumPrinter() {
    this.openModal.set(true);
  }

  closePopupColumnPrinter() {
    this.openModal.set(false);
  }

  shouldDisplayModal(): boolean {
    return this.openModal();
  }

  ngOnInit(): void {
    this.memberForm = this.fb.group({
      personalInfo: this.fb.group({
        name: [''],
        firstname: [''],
        nationality: [''],
        birthday: [''],
        maritalStatus: ['']
      }),
      academicInfo: this.fb.group({
        studiesLevel: [''],
        university: [''],
        faculty: [''],
        department: ['']
      }),
      addressInfo: this.fb.group({
        addressInDakar: [''],
        holidayAddress: [''],
        addressToCampus: ['']
      })
    });
  }

  print() {
    console.log(this.memberForm.value)
  }

  exportToExcel() {
    this.memberService.searchMemberToPrint(this.appState.memberState.keyword, this.appState.memberState.criteria, this.appState.memberState.filters).subscribe({
      next: resp => {
        if (resp.status == "OK") {
          this.printToExcel(resp.data)
        }
      }
    })
  }

  printToExcel(members: Profile[]) {
    // Récupérer les colonnes sélectionnées par l'utilisateur
    const selectedColumns = {
      personalInfo: this.memberForm.get('personalInfo')?.value,
      academicInfo: this.memberForm.get('academicInfo')?.value,
      addressInfo: this.memberForm.get('addressInfo')?.value,
    };

    // Construire dynamiquement les données à inclure dans Excel
    const membersData = members.map((member: Profile) => {
      const row: any = {};

      // Ajouter les champs personnels si cochés
      if (selectedColumns.personalInfo.name && member?.personalInfo) {
        row['Nom'] = member.personalInfo.name;
      }
      if (selectedColumns.personalInfo.firstname && member?.personalInfo) {
        row['Prénom'] = member.personalInfo.firstname;
      }
      if (selectedColumns.personalInfo.nationality && member?.personalInfo) {
        row['Nationalité'] = member.personalInfo.nationality;
      }
      if (selectedColumns.personalInfo.birthday && member?.personalInfo) {
        row['Date de Naissance'] = member.personalInfo.birthday;
      }
      if (selectedColumns.personalInfo.maritalStatus && member?.personalInfo) {
        row['État Civil'] = member.personalInfo.maritalStatus;
      }

      // Ajouter les champs académiques si cochés
      if (selectedColumns.academicInfo.studiesLevel && member.academicInfo) {
        row['Niveau d’Études'] = member.academicInfo.studiesLevel;
      }
      if (selectedColumns.academicInfo.university && member.academicInfo) {
        row['Université'] = member.academicInfo.institutionName;
      }
      if (selectedColumns.academicInfo.faculty && member.academicInfo) {
        row['Faculté'] = member.academicInfo.studiesDomain;
      }

      // Ajouter les champs d'adresse si cochés
      if (selectedColumns.addressInfo.addressInDakar && member.addressInfo) {
        row['Adresse à Dakar'] = member.addressInfo.addressInDakar;
      }
      if (selectedColumns.addressInfo.holidayAddress && member.addressInfo) {
        row['Adresse de Vacances'] = member.addressInfo.holidayAddress;
      }
      if (selectedColumns.addressInfo.addressToCampus && member.addressInfo) {
        row['Adresse au Campus'] = member.addressInfo.addressToCampus;
      }

      return row;
    });

    // Générer une feuille Excel avec les colonnes sélectionnées
    const worksheet = XLSX.utils.json_to_sheet(membersData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Membres');

    // Télécharger le fichier Excel
    XLSX.writeFile(workbook, 'ListeDesMembresFiltrée.xlsx');

    this.memberForm.reset();
    this.closePopupColumnPrinter()
  }


}
