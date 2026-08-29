import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideToastr} from 'ngx-toastr';
import {TemplateSelectModalComponent} from './template-select-modal.component';

describe('TemplateSelectModalComponent', () => {
  let component: TemplateSelectModalComponent;
  let fixture: ComponentFixture<TemplateSelectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateSelectModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideToastr()
      ]
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
