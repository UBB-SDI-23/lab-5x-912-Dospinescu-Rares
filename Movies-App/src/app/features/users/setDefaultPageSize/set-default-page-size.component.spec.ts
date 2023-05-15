import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetDefaultPageSizeComponent } from './set-default-page-size.component';

describe('SetDefaultPageSizeComponent', () => {
  let component: SetDefaultPageSizeComponent;
  let fixture: ComponentFixture<SetDefaultPageSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetDefaultPageSizeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetDefaultPageSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
