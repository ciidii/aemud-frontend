import {Component, OnInit} from '@angular/core';
import {ClubModel} from "../../../member/model/club.model";
import {ClubService} from "../../../core/services/clubs/club.service";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgFor, NgIf} from '@angular/common';

@Component({
  selector: 'app-clubs-admin',
  templateUrl: './clubs-admin.component.html',
  styleUrls: ['./clubs-admin.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, ReactiveFormsModule]
})
export class ClubsAdminComponent implements OnInit {
  clubs!: ClubModel[];
  displayForm = false;
  clubForm!: FormGroup

  constructor(private clubService: ClubService, private toaster: ToastrService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.getAllClubs()
    this.clubForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      id: [''],
      members:this.fb.array([])
    });
  }


  getAllClubs() {
    this.clubService.getClubs().subscribe({
      next: resp => {
        if (resp.status == "OK") {
          this.clubs = resp.data
        } else {
          this.toaster.error("Une erreur s'est produit")
        }
      }
    })
  }

  handleDisplayForm() {
    this.displayForm = !this.displayForm
  }

  onSubmit() {
    if (this.clubForm.valid) {
      this.clubService.addClubs(this.clubForm.value).subscribe({
        next: resp => {
          if (resp.status == "OK") {
            this.toaster.success("Cubs ajoutés avec succée")
            this.clubForm.reset();
            this.getAllClubs();
            this.handleDisplayForm()
          } else {
            this.toaster.error("Une erreur c'est produite")
          }
        }, error: err => {
          this.toaster.error("Une erreur c'est produite")
        }
      })
    }
  }

  deleteClub(clubId: number) {
    this.clubService.deleteClub(clubId).subscribe({
      next: response => {
        if (response.status == "OK") {
          this.toaster.success("Suppression Réussi");
          this.getAllClubs();
        } else {
          console.log("Un erreur s'est produite")
        }
      },
      error: err => {
        if (err.error.status == "CONFLICT") {
          this.toaster.error("Supression Impossible")
        }
        console.log("Un erreur s'est produite")
      }
    })
  }

  onUpdate(clubId: number) {
    this.clubService.getSingleClub(clubId).subscribe({
      next: resp => {
        if (resp.status == "OK") {
          this.clubForm.get("name")?.setValue(resp.data.name);
          this.clubForm.get("id")?.setValue(resp.data.id);
          this.handleDisplayForm();
        }
      },
      error: err => {
        console.log(err)
      }
    })
  }
}
