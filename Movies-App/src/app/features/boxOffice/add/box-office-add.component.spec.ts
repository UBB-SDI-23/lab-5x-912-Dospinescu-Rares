import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxOfficeAddComponent } from './box-office-add.component';

describe('BoxOfficeAddComponent', () => {
  let component: BoxOfficeAddComponent;
  let fixture: ComponentFixture<BoxOfficeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxOfficeAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoxOfficeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
