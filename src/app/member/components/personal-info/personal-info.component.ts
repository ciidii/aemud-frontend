import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css']
})
export class PersonalInfoComponent implements OnInit {
  personalInfo!: FormGroup
  @Output() personalInfoEmitter = new EventEmitter<FormGroup>

  constructor(private _formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.personalInfo = this._formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      nationality: ['', [Validators.required, Validators.minLength(2)]],
      birthday: ['', [Validators.required]],
      maritalStatus: ['', [Validators.required, Validators.minLength(2)]],
    })
  }

  onSave() {
    this.personalInfoEmitter.emit(this.personalInfo)
  }
}
