import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityTypesComponent } from './activity-types.component';

describe('ActivityTypesComponent', () => {
  let component: ActivityTypesComponent;
  let fixture: ComponentFixture<ActivityTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
