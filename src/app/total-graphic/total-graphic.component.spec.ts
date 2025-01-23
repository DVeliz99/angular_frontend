import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalGraphicComponent } from './total-graphic.component';

describe('TotalGraphicComponent', () => {
  let component: TotalGraphicComponent;
  let fixture: ComponentFixture<TotalGraphicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalGraphicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
