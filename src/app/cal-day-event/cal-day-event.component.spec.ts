import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalDayEventComponent } from './cal-day-event.component';

describe('CalDayEventComponent', () => {
  let component: CalDayEventComponent;
  let fixture: ComponentFixture<CalDayEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalDayEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalDayEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
