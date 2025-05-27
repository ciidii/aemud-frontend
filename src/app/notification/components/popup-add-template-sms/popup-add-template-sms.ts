import {Component, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {AppStateService} from "../../core/services/app-state.service";
import {MessageModel} from "../../core/models/message.model";
import {NotificationService} from "../../notification/core/notification.service";
import {ToastrService} from "ngx-toastr";
import {MemberModel} from "../../core/models/member.model-copy";

@Component({
  selector: 'app-group-for-notification',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './group-for-notification.component.html',
  styleUrl: './group-for-notification.component.css'
})
export class GroupForNotificationComponent implements OnInit {
  openPopup = signal(false);
  formGroup!: FormGroup;
  tabMemberNum!: string[];
  message: MessageModel = {
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

  savaGroup() {
    this.getMemberNumbers();
    console.log(this.formGroup.get("groupMessage")?.value)
    this.message.message = this.formGroup.get("groupMessage")?.value;
    this.message.recipientNumbers = this.tabMemberNum;
    this.messageNotification.sendNotification(this.message).subscribe({
      next: resp => {
        this.toaster.success("Message envoyer avec succés")
      },
      error: err => {
        this.toaster.error("Une problème c'est lors de l'envoie")
      }
    })


  }

  getMemberNumbers() {
    const filteredNumbers = this.appState.memberState.members
      .filter((member: MemberModel) => member.contactInfo?.numberPhone)
      .map((member: MemberModel) =>
        member.contactInfo.numberPhone.replace(/\+/g, '')  // Suppression du signe plus
      );

    this.tabMemberNum = filteredNumbers;
  }

}
