import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPersonalInfoModalComponent } from './edit-personal-info-modal.component';

describe('EditPersonalInfoModalComponent', () => {
  let component: EditPersonalInfoModalComponent;
  let fixture: ComponentFixture<EditPersonalInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPersonalInfoModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditPersonalInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
