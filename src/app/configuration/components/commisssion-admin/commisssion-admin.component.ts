import {Component, OnInit} from '@angular/core';
import {CommissionModel} from "../../../member/model/commission.model";
import {CommissionService} from "../../../core/services/commission/commission.service";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-commisssion-admin',
  templateUrl: './commisssion-admin.component.html',
  styleUrls: ['./commisssion-admin.component.css']
})
export class CommisssionAdminComponent implements OnInit {
  commissions!: CommissionModel[]
  commissionForm: FormGroup;
  displayForm = false;

  constructor(private commissionService: CommissionService, private toaster: ToastrService, private fb: FormBuilder) {
    this.commissionForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
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
          if (resp.status=="OK"){
            this.toaster.success("Commissions aoujouté avec succées")
            this.commissionForm.reset();
            this.displayForm = false; // Masquer le formulaire après soumission
            this.getAllCommissions()
          }else {
            this.toaster.error("Une erreur s'est produite")
          }
        }, error: err => {
          this.toaster.error("Une erreur s'est produite")
        }
      })
    }
  }
}
