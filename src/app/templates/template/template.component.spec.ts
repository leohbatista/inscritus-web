import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedUserTemplateComponent } from './template.component';

describe('LoggedUserTemplateComponent', () => {
  let component: LoggedUserTemplateComponent;
  let fixture: ComponentFixture<LoggedUserTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoggedUserTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggedUserTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
