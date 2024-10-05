import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {StepperDataService} from "../../../core/services/stepper-data.service";
import {MemberService} from "../../../core/services/member.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {AcademicInfoComponent} from "../academic-info/academic-info.component";
import {AddressInfoComponent} from "../address-info/address-info.component";


@Component({
  selector: 'app-main-form-step-2',
  templateUrl: './main-form-step-2.component.html',
  styleUrls: ['./main-form-step-2.component.css']
})
export class MainFormStep2Component implements OnInit {
  @Output() previous = new EventEmitter<void>();
  @ViewChild(AcademicInfoComponent,{static:false}) academicInfoComponent!:AcademicInfoComponent
  @ViewChild(AddressInfoComponent,{static:false}) addressAcademicInfo!:AddressInfoComponent

  constructor(protected stepperService: StepperDataService,
              private memberService: MemberService,
              private toaster: ToastrService,
              private router: Router
  ) {
  }

  ngOnInit(): void {
  }

  onAcademicInfoSubmit(form: FormGroup) {
    this.stepperService.setAcademicInfo(form.value)
  }

  onContactInfoSubmit(form: FormGroup) {
    this.stepperService.setContactInfo(form.value)
  }

  onAddressInfoSubmit(form: FormGroup) {
    this.stepperService.setAddressInfo(form.value)
  }

  onPrevious() {
    this.previous.emit();
  }

  onSubmit() {
    this.memberService.addMember(this.stepperService.getFormData()).subscribe({
      next: response => {
        this.toaster.success("Ajouter avec succées")
        this.resetLocalStorage()
        this.stepperService.setAllFormsUnsaved()
        this.router.navigateByUrl("/members/member/list-members")
        this.toaster.error("Une erreur de c'est produit lors de registration")
      }
    });
  }

  resetLocalStorage() {
    localStorage.removeItem("academicInfo")
    localStorage.removeItem("addressInfo")
    localStorage.removeItem("contactInfo")
    localStorage.removeItem("membershipInfo")
    localStorage.removeItem("personalInfo")
  }
}
