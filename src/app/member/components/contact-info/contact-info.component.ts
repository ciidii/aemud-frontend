import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StepperDataService} from "../../../core/services/stepper-data.service";
import {UtilsService} from "../../../core/services/utils.service";

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.css']
})
export class ContactInfoComponent implements OnInit {
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() contactInfoEvent = new EventEmitter<FormGroup>
  contactFormGroup!: FormGroup;

  constructor(private _formBuilder: FormBuilder,
              protected stepperDataService: StepperDataService,
              private utilsService: UtilsService
  ) {
  }

  ngOnInit() {
    var contactInfoLocalStorage;
    const local = localStorage.getItem("contactInfo");
    if (local) {
      contactInfoLocalStorage = JSON.parse(local)
    }
    this.contactFormGroup = this._formBuilder.group({
      memberID: [{value: contactInfoLocalStorage?.memberID || '', disabled: true}, [Validators.required]],
      idYear: [contactInfoLocalStorage?.idYear || '', [Validators.required, Validators.min(1)]],
      numberPhone: [contactInfoLocalStorage?.numberPhone || '', [Validators.required, Validators.pattern(/^\+221\d{9}$/)]],
      email: [contactInfoLocalStorage?.email || '', [Validators.required, Validators.email]],
      personToCalls: this._formBuilder.array([]),
    });
    if (contactInfoLocalStorage?.personToCalls.length > 0) {
      for (let personToCall in contactInfoLocalStorage.personToCalls) {
        this.addPersonToCall(personToCall)
      }
    } else {
      this.addPersonToCall()
    }
    this.toggleAcademicInfoSaved()
  }

  get personToCalls(): FormArray {
    return this.contactFormGroup.get('personToCalls') as FormArray;
  }

  addPersonToCall(person?: any): void {
    if (this.personToCalls.length >= 2) {
      alert("Vous ne pouvez ajouter que deux personnes à contacter.");
      return;
    }

    const personFormGroup = this._formBuilder.group({
      lastname: [person?.lastname || '', Validators.required],
      firstname: [person?.firstname || '', Validators.required],
      requiredNumberPhone: [
        person?.requiredNumberPhone || '',
        [Validators.required, Validators.pattern(/^\+221\d{9}$/)],
      ],
      optionalNumberPhone: [
        person?.optionalNumberPhone || '',
        Validators.pattern(/^\+221\d{9}$/),
      ],
      relationship: [person?.relationship || '', Validators.required],
    });

    this.personToCalls.push(personFormGroup);
  }

  removePersonToCall(index: number): void {
    this.personToCalls.removeAt(index);
  }

  onSave() {
    this.contactInfoEvent.emit(this.contactFormGroup)
    this.toggleAcademicInfoSaved()

  }

  onModify() {
    this.stepperDataService.changeContactInfoState()
    this.toggleAcademicInfoSaved()
  }

  toggleAcademicInfoSaved() {
    this.utilsService.togglePersonalInfoSaved(this.contactFormGroup, this.stepperDataService.contactInfoSaved)
  }
}
