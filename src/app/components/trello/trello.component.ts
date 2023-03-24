import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-trello',
  templateUrl: './trello.component.html',
  styleUrls: ['./trello.component.scss']
})
export class TrelloComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  droppedData: string = '';
  droppedData2: string = '';

  onDrop({ dropData }: any): void {
    this.droppedData = dropData;
    setTimeout(() => {
      this.droppedData = '';
    }, 2000);
  }

  onDrop2({ dropData }: any): void {
    this.droppedData2 = dropData;
    setTimeout(() => {
      this.droppedData2 = '';
    }, 2000);
  }


}
