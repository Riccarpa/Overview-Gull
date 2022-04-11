import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowFinancialComponent } from './show-financial.component';

describe('ShowFinancialComponent', () => {
  let component: ShowFinancialComponent;
  let fixture: ComponentFixture<ShowFinancialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowFinancialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowFinancialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
