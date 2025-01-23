import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTaskManagerComponent } from './form-task-manager.component';

describe('FormTaskManagerComponent', () => {
  let component: FormTaskManagerComponent;
  let fixture: ComponentFixture<FormTaskManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTaskManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormTaskManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
