import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActorsAddComponent } from './actors-add.component';

describe('ActorsAddComponent', () => {
  let component: ActorsAddComponent;
  let fixture: ComponentFixture<ActorsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActorsAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActorsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
