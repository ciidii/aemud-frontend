import {Component, EventEmitter, Input, OnInit, Output, inject} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ReligiousKnowledge} from "../../../../../core/models/member-data.model";

@Component({
  selector: 'app-edit-religious-knowledge-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-religious-knowledge-modal.component.html',
  styleUrls: ['./edit-religious-knowledge-modal.component.scss']
})
export class EditReligiousKnowledgeModalComponent implements OnInit {
  @Input() initialData!: ReligiousKnowledge;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<ReligiousKnowledge>();

  private fb = inject(FormBuilder);
  knowledgeForm!: FormGroup;

  ngOnInit(): void {
    this.knowledgeForm = this.fb.group({
      coranLevel: [this.initialData?.coranLevel || ''],
      arabicProficiency: [this.initialData?.arabicProficiency || ''],
      fiqh: this.fb.array([]),
      aqida: this.fb.array([])
    });

    this.initialData?.fiqh?.forEach(item => this.fiqh.push(this.createKnowledgeItem(item)));
    this.initialData?.aqida?.forEach(item => this.aqida.push(this.createKnowledgeItem(item)));
  }

  get fiqh() {
    return this.knowledgeForm.get('fiqh') as FormArray;
  }

  get aqida() {
    return this.knowledgeForm.get('aqida') as FormArray;
  }

  createKnowledgeItem(data?: any): FormGroup {
    return this.fb.group({
      bookName: [data?.bookName || '', Validators.required],
      teacherName: [data?.teacherName || ''],
      learningPlace: [data?.learningPlace || '']
    });
  }

  addItem(type: 'fiqh' | 'aqida'): void {
    const formArray = this.knowledgeForm.get(type) as FormArray;
    formArray.push(this.createKnowledgeItem());
  }

  removeItem(type: 'fiqh' | 'aqida', index: number): void {
    const formArray = this.knowledgeForm.get(type) as FormArray;
    formArray.removeAt(index);
  }

  onSave(): void {
    if (this.knowledgeForm.valid) {
      this.save.emit(this.knowledgeForm.value);
      this.onClose();
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
