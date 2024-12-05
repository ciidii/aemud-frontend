import {Component, OnInit} from '@angular/core';
import {ClubModel} from "../../../member/model/club.model";
import {ClubService} from "../../../core/services/clubs/club.service";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-clubs-admin',
  templateUrl: './clubs-admin.component.html',
  styleUrls: ['./clubs-admin.component.css']
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
          } else {
            this.toaster.error("Une erreur c'est produite")
          }
        }, error: err => {
          this.toaster.error("Une erreur c'est produite")
        }
      })
    }
  }
}
