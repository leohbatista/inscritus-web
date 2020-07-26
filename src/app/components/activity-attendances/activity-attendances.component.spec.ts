import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityAttendancesComponent } from './activity-attendances.component';

describe('ActivityAttendancesComponent', () => {
  let component: ActivityAttendancesComponent;
  let fixture: ComponentFixture<ActivityAttendancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityAttendancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityAttendancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
