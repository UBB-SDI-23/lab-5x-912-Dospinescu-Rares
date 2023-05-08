import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewDetailsComponent } from './details.component';

describe('DetailsComponent', () => {
  let component: ReviewDetailsComponent;
  let fixture: ComponentFixture<ReviewDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
