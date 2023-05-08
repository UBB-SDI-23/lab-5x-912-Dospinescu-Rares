import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesAndActorsAddComponent } from './movies-and-actors-add.component';

describe('MoviesAndActorsAddComponent', () => {
  let component: MoviesAndActorsAddComponent;
  let fixture: ComponentFixture<MoviesAndActorsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoviesAndActorsAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoviesAndActorsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
