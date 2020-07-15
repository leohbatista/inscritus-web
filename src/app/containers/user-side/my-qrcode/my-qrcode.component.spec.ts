import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyQrcodeComponent } from './my-qrcode.component';

describe('MyQrcodeComponent', () => {
  let component: MyQrcodeComponent;
  let fixture: ComponentFixture<MyQrcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyQrcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyQrcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
