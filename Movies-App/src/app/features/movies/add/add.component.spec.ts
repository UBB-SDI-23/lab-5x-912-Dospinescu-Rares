import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieAddComponent } from './add.component';

describe('AddComponent', () => {
  let component: MovieAddComponent;
  let fixture: ComponentFixture<MovieAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
