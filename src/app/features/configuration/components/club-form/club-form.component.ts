import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Club} from '../../../../core/models/member-data.model';
import {CommonModule} from '@angular/common';
import {ValidationMessageComponent} from '../../../../shared/components/validation-message/validation-message.component';

@Component({
  selector: 'app-club-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ValidationMessageComponent],
  templateUrl: './club-form.component.html',
  styleUrls: ['./club-form.component.css']
})
export class ClubFormComponent implements OnInit {
  @Input() club: Club | null = null;
  @Input() isSaving: boolean = false;
  @Output() save = new EventEmitter<Club>();
  @Output() closeModal = new EventEmitter<void>();

  clubForm!: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.clubForm = this.fb.group({
      id: [this.club?.id],
      name: [this.club?.name || '', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit(): void {
    if (this.clubForm.valid) {
      this.save.emit(this.clubForm.value);
    }
  }
}
