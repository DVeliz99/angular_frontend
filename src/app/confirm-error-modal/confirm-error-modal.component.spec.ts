import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmErrorModalComponent } from './confirm-error-modal.component';

describe('ConfirmErrorModalComponent', () => {
  let component: ConfirmErrorModalComponent;
  let fixture: ComponentFixture<ConfirmErrorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmErrorModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
