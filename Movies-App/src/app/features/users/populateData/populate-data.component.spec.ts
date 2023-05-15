import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopulateDataComponent } from './populate-data.component';

describe('PopulateDataComponent', () => {
  let component: PopulateDataComponent;
  let fixture: ComponentFixture<PopulateDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopulateDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopulateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
