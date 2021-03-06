import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityViewAdminComponent } from './activity-view.component';

describe('ActivityViewComponent', () => {
  let component: ActivityViewAdminComponent;
  let fixture: ComponentFixture<ActivityViewAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityViewAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityViewAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
