import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContactInfoModalComponent } from './edit-contact-info-modal.component';

describe('EditContactInfoModalComponent', () => {
  let component: EditContactInfoModalComponent;
  let fixture: ComponentFixture<EditContactInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditContactInfoModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditContactInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
