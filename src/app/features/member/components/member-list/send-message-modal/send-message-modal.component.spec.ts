import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideToastr} from 'ngx-toastr';
import {SendMessageModalComponent} from './send-message-modal.component';

describe('SendMessageModalComponent', () => {
  let component: SendMessageModalComponent;
  let fixture: ComponentFixture<SendMessageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendMessageModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideToastr()
      ]
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
