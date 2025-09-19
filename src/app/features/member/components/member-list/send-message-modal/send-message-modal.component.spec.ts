import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendMessageModalComponent } from './send-message-modal.component';

describe('SendMessageModalComponent', () => {
  let component: SendMessageModalComponent;
  let fixture: ComponentFixture<SendMessageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendMessageModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SendMessageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
