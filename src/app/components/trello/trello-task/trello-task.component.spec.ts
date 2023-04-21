import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrelloTaskComponent } from './trello-task.component';

describe('TrelloTaskComponent', () => {
  let component: TrelloTaskComponent;
  let fixture: ComponentFixture<TrelloTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrelloTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrelloTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
