import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatKey',
  standalone: true
})
export class FormatKeyPipe implements PipeTransform {
  private keyMap: { [key: string]: string } = {
    // Personal Info
    name: 'Nom',
    firstname: 'Prénom',
    nationality: 'Nationalité',
    gender: 'Genre',
    birthday: 'Date de Naissance',
    maritalStatus: 'État Civil',
    // Contact Info
    numberPhone: 'Téléphone',
    email: 'Email',
    personToCalls: 'Personnes à contacter',
    // Academic Info
    institutionName: 'Établissement',
    studiesDomain: "Domaine d'études",
    studiesLevel: "Niveau d'études",
    // Address Info
    addressInDakar: 'Adresse à Dakar',
    holidayAddress: 'Adresse de vacances',
    addressToCampus: 'Adresse au campus',
    // Bourse
    bourseId: 'ID Bourse',
    lebelle: 'Libellé',
    montant: 'Montant',
    // Membership Info
    legacyInstitution: 'Ancien établissement',
    bacSeries: 'Série du BAC',
    bacMention: 'Mention du BAC',
    yearOfBac: 'Année du BAC',
    aemudCourses: 'Cours AEMUD',
    otherCourses: 'Autres cours',
    participatedActivity: 'Activité participée',
    politicOrganisation: 'Organisation politique'
  };

  transform(value: string): string {
    return this.keyMap[value] || value;
  }
}
