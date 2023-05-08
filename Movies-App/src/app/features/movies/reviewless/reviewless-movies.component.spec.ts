import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewlessMoviesComponent } from './reviewless-movies.component';

describe('ReviewlessMoviesComponent', () => {
  let component: ReviewlessMoviesComponent;
  let fixture: ComponentFixture<ReviewlessMoviesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewlessMoviesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewlessMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
