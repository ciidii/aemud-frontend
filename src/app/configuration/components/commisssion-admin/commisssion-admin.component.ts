import {Component, OnInit} from '@angular/core';
import {CommissionModel} from "../../../member/model/commission.model";
import {CommissionService} from "../../../core/services/commission/commission.service";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgFor, NgIf} from '@angular/common';

@Component({
  selector: 'app-commisssion-admin',
  templateUrl: './commisssion-admin.component.html',
  styleUrls: ['./commisssion-admin.component.css'],
  standalone: true,
  imports: [NgIf, FormsModule, ReactiveFormsModule, NgFor]
})
export class CommisssionAdminComponent implements OnInit {
  commissions!: CommissionModel[]
  commissionForm: FormGroup;
  displayForm = false;

  constructor(private commissionService: CommissionService, private toaster: ToastrService, private fb: FormBuilder) {
    this.commissionForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      id: [''],
      members: this.fb.array([])
    });
  }


  ngOnInit(): void {
    this.getAllCommissions()
  }

  getAllCommissions() {
    this.commissionService.getCommissions().subscribe({
      next: resp => {
        if (resp.status == "OK") {
          this.commissions = resp.data
        } else {
          this.toaster.success("Une erreur s'est produites")
        }
      },
      error: err => {
        this.toaster.success("Une erreur s'est produites")
      }
    })
  }

  handleDisplayForm() {
    this.displayForm = !this.displayForm;
  }

  onSubmit() {
    if (this.commissionForm.valid) {
      this.commissionService.addCommission(this.commissionForm.value).subscribe({
        next: resp => {
          if (resp.status == "OK") {
            this.toaster.success("Commissions aoujouté avec succées")
            this.commissionForm.reset();
            this.displayForm = false; // Masquer le formulaire après soumission
            this.getAllCommissions()
          } else {
            this.toaster.error("Une erreur s'est produite")
          }
        }, error: err => {
          this.toaster.error("Une erreur s'est produite")
        }
      })
    }
  }

  onDelete(commissionID: number) {
    this.commissionService.deleteCommission(commissionID).subscribe({
      next: response => {
        if (response.status == "OK") {
          this.toaster.success("Suppression Réussi")
          this.getAllCommissions();
        } else {
          console.log("Un erreur s'est produite")
        }
      },
      error: err => {
        if (err.error.status == "CONFLICT") {
          this.toaster.error("Suppression Impossible");
        }
      }
    })
  }

  onUpdate(commissionId: number) {
    this.commissionService.getSingleCommission(commissionId).subscribe({
      next: response => {
        if (response.status == "OK") {
          this.commissionForm.get("name")?.setValue(response.data.name);
          this.commissionForm.get("id")?.setValue(commissionId)
          this.handleDisplayForm()
          //this.commissionService.addCommission(this.commissionForm.value)
          this.getAllCommissions();
        }
        console.log("Une erreur s'est produite")
      },
      error: err => {
        console.log(err)
      }
    })
  }
}
