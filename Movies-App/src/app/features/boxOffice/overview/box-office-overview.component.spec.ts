import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxOfficeOverviewComponent } from './box-office-overview.component';

describe('BoxOfficeOverviewComponent', () => {
  let component: BoxOfficeOverviewComponent;
  let fixture: ComponentFixture<BoxOfficeOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxOfficeOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoxOfficeOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
