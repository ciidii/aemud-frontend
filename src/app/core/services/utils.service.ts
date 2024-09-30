import {Injectable} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() {
  }

  togglePersonalInfoSaved(formGroup: FormGroup, savedData: boolean) {
    Object.keys(formGroup.controls).forEach(controlName => {
      if (savedData) {
        formGroup.get(controlName)?.disable();
      } else {
        formGroup.get(controlName)?.enable();
      }
    });
  }

  checkInvalidControls(formGroup: FormGroup) {
    const invalid = [];
    const controls = formGroup.controls;

    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
        console.log(`Le champ ${name} est invalide :`, controls[name].errors);
      }
    }

    return invalid;
  }
}
