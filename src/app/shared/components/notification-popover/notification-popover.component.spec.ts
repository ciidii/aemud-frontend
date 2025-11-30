import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NotificationPopoverComponent} from './notification-popover.component';

describe('NotificationPopoverComponent', () => {
  let component: NotificationPopoverComponent;
  let fixture: ComponentFixture<NotificationPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationPopoverComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NotificationPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
