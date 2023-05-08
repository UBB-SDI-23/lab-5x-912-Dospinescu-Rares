import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActorsTotalHoursComponent } from './actors-total-hours.component';

describe('ActorsTotalHoursComponent', () => {
  let component: ActorsTotalHoursComponent;
  let fixture: ComponentFixture<ActorsTotalHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActorsTotalHoursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActorsTotalHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
