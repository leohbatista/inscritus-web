import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuxiliaryDataComponent } from './auxiliary-data.component';

describe('AuxiliaryDataComponent', () => {
  let component: AuxiliaryDataComponent;
  let fixture: ComponentFixture<AuxiliaryDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuxiliaryDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuxiliaryDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
