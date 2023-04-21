import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrelloSprintComponent } from './trello-sprint.component';

describe('TrelloSprintComponent', () => {
  let component: TrelloSprintComponent;
  let fixture: ComponentFixture<TrelloSprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrelloSprintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrelloSprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
