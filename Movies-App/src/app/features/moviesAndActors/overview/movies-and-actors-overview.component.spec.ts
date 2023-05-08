import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesAndActorsOverviewComponent } from './movies-and-actors-overview.component';

describe('MoviesAndActorsOverviewComponent', () => {
  let component: MoviesAndActorsOverviewComponent;
  let fixture: ComponentFixture<MoviesAndActorsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoviesAndActorsOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoviesAndActorsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
