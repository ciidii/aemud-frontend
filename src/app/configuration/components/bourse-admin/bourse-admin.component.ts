import {Component, OnInit} from '@angular/core';
import {BourseModel} from "../../../core/models/bourses/bourse.model";
import {BourseService} from "../../../core/services/Bourse/bourse.service";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-bourse-admin',
  templateUrl: './bourse-admin.component.html',
  styleUrls: ['./bourse-admin.component.css']
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
      montant: ['', [Validators.required, Validators.min(1)]]
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
}
