import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BourseFormComponent } from './bourse-form.component';

describe('BourseFormComponent', () => {
  let component: BourseFormComponent;
  let fixture: ComponentFixture<BourseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BourseFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BourseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
