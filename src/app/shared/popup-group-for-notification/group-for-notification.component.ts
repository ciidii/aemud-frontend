import {Component, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {AppStateService} from "../../core/services/app-state.service";
import {SmsModel} from "../../core/models/sms.model";
import {ToastrService} from "ngx-toastr";
import {NotificationService} from "../../core/services/notification.service";

@Component({
  selector: 'app-group-for-notification',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './group-for-notification.component.html',
  styleUrl: './group-for-notification.component.scss'
})
export class GroupForNotificationComponent implements OnInit {
  openPopup = signal(false);
  formGroup!: FormGroup;
  tabMemberNum!: string[];
  message: SmsModel = {
    message: '',
    recipientNumbers: []
  };


  constructor(
    private formBuilder: FormBuilder,
    private appState: AppStateService,
    private messageNotification: NotificationService,
    private toaster: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      groupName: [''],
      groupMessage: ['']
    })
  }


  openModal() {
    this.openPopup.set(true)
  }

  closeModal() {
    this.openPopup.set(false)
  }


  getMemberNumbers() {
    /*
    const filteredNumbers = this.appState.getSnapshot().members
      .filter((member: MemberModel) => member.contactInfo?.numberPhone)
      .map((member: MemberModel) =>
        member.contactInfo.numberPhone.replace(/\+/g, '')  // Suppression du signe plus
      );

    this.tabMemberNum = filteredNumbers;

     */
  }
}
