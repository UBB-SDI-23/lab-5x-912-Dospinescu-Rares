import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActorsOverviewComponent } from './actors-overview.component';

describe('ActorsOverviewComponent', () => {
  let component: ActorsOverviewComponent;
  let fixture: ComponentFixture<ActorsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActorsOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActorsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
