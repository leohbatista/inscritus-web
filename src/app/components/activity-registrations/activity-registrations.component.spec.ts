import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityRegistrationsComponent } from './activity-registrations.component';

describe('ActivityRegistrationsComponent', () => {
  let component: ActivityRegistrationsComponent;
  let fixture: ComponentFixture<ActivityRegistrationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityRegistrationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityRegistrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
