import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewOverviewComponent } from './overview.component';

describe('OverviewComponent', () => {
  let component: ReviewOverviewComponent;
  let fixture: ComponentFixture<ReviewOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
