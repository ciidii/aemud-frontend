import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordPaymentModalComponent } from './record-payment-modal.component';

describe('RecordPaymentModalComponent', () => {
  let component: RecordPaymentModalComponent;
  let fixture: ComponentFixture<RecordPaymentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordPaymentModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecordPaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
