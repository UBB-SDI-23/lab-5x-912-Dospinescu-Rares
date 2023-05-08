import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActorsDetailsComponent } from './actors-details.component';

describe('ActorsDetailsComponent', () => {
  let component: ActorsDetailsComponent;
  let fixture: ComponentFixture<ActorsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActorsDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActorsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
