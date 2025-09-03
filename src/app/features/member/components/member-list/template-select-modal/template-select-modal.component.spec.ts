import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateSelectModalComponent } from './template-select-modal.component';

describe('TemplateSelectModalComponent', () => {
  let component: TemplateSelectModalComponent;
  let fixture: ComponentFixture<TemplateSelectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateSelectModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplateSelectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
