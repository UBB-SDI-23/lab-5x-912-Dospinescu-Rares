import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesByRatingComponent } from './by-rating.component';

describe('ByRatingComponent', () => {
  let component: MoviesByRatingComponent;
  let fixture: ComponentFixture<MoviesByRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoviesByRatingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoviesByRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
