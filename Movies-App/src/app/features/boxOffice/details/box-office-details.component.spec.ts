import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxOfficeDetailsComponent } from './box-office-details.component';

describe('BoxOfficeDetailsComponent', () => {
  let component: BoxOfficeDetailsComponent;
  let fixture: ComponentFixture<BoxOfficeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxOfficeDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoxOfficeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
