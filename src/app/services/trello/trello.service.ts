import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProjectService } from '../project/project.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TrelloService {

  constructor() { }

  tables = [
    {
      name: 'TO DO',
      color: 'background-color: gold',
      tasks: [
        {
          title: 'Fare la spesa', 
          description: 'Some quick example text to build on the card title and make up the bulk of the card\'s content', 
          checkList: [
            {name: 'uova', isChecked: true}, 
            {name: 'farina', isChecked: false},
            {name: 'burro', isChecked: false},
            {name: 'sedano', isChecked: false}
          ], 
        },
        {
          title: 'Task 1', 
          description: 'Some quick example text',
          checkList: [], 
        },
        {
          title: 'Task 20', 
          description: 'Build on the card title and make up the bulk of the card\'s content', 
          checkList: [],
        }
      ]
    },
    {
      name: 'DOING',
      color: 'background-color: yellowgreen',
      tasks: []
    },
    {
      name: 'DONE',
      color: 'background-color: tomato',
      tasks: []
    },
    {
      name: 'IDEAS',
      color: 'background-color: deepskyblue',
      tasks: []
    }
  ];

  // getUserTaskTables(id: any): Observable<any> {
  //   return this.http.get(`${this.url}/trello/${id}`);
  // }

  getUserTaskTables(){
    return this.tables
  }

}
