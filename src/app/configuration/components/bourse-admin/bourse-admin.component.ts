import {Component, LOCALE_ID, NgModule, OnInit} from '@angular/core';
import {BourseModel} from "../../../core/models/bourses/bourse.model";
import {BourseService} from "../../../core/services/Bourse/bourse.service";
import {ToastrService} from "ngx-toastr";
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CurrencyPipe, NgFor, NgIf, registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';


@Component({
  selector: 'app-bourse-admin',
  templateUrl: './bourse-admin.component.html',
  styleUrls: ['./bourse-admin.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, ReactiveFormsModule, CurrencyPipe]
})
export class BourseAdminComponent implements OnInit {
  bourses!: BourseModel[]
  displayForm = false
  bourseForm!: FormGroup;

  constructor(private bourseService: BourseService, private toaster: ToastrService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.getAllBourses();
    this.bourseForm = this.fb.group({
      lebelle: ['', [Validators.required, Validators.minLength(3)]],
      montant: ['', [Validators.required, Validators.min(1)]],
      bourseId: [''],
      members: this.fb.array([]),
    });
  }

  getAllBourses() {
    this.bourseService.getAllBourse().subscribe({
      next: response => {
        if (response.status == "OK") {
          this.bourses = response.data
        } else {
          this.toaster.error("Une erreur inattendues s'est produite")
        }
      }, error: err => {
        this.toaster.error("Une erreur inattendues s'est produite")
      }
    })
  }

  handleDisplayForm() {
    this.displayForm = !this.displayForm
  }

  onSubmit() {
    if (this.bourseForm.valid) {
      console.log(this.bourseForm.value)
      this.bourseService.addBourse(this.bourseForm.value).subscribe({
        next: resp => {
          if (resp.status == "OK") {
            this.toaster.success("Bourse ajouter avec succées")
            this.bourseForm.reset()
            this.getAllBourses()
          } else {
            this.toaster.error("Une erreur S'est produite")
          }
        }, error: err => {
          this.toaster.error("Une erreur S'est produite")
        }
      })
    } else {
      console.log('Formulaire non valide');
    }
  }

  deleteBourse(bourseId: number) {
    this.bourseService.deleteBourse(bourseId).subscribe({
      next: resp => {
        if (resp.status == "OK") {
          this.toaster.success("Suppression Réussi")
          this.getAllBourses()
        } else {
          this.toaster.error("Une erreur s'est produite")
        }
      }, error: err => {
        if (err.error.status) {
          this.toaster.error("Suppression Impossible")
        } else {
          console.log("Une erreur s'est produite")
        }
      }
    })
  }

  onUpdate(bourseId: number) {
    this.bourseService.getBourseById(bourseId).subscribe({
      next: resp => {
        if (resp.status == "OK") {
          this.bourseForm.get("lebelle")?.setValue(resp.data.lebelle);
          this.bourseForm.get("montant")?.setValue(resp.data.montant);
          this.bourseForm.get("bourseId")?.setValue(resp.data.bourseId);
          this.handleDisplayForm()
        }
      }, error: err => {
        console.log(err)
      }
    })
  }
}
