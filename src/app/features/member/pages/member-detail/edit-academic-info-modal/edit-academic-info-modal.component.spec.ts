import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAcademicInfoModalComponent } from './edit-academic-info-modal.component';

describe('EditAcademicInfoModalComponent', () => {
  let component: EditAcademicInfoModalComponent;
  let fixture: ComponentFixture<EditAcademicInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAcademicInfoModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditAcademicInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
