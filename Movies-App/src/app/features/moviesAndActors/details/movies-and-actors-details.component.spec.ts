import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesAndActorsDetailsComponent } from './movies-and-actors-details.component';

describe('MoviesAndActorsDetailsComponent', () => {
  let component: MoviesAndActorsDetailsComponent;
  let fixture: ComponentFixture<MoviesAndActorsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoviesAndActorsDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoviesAndActorsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
