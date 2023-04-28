import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  url = environment.apiURL + '/tasks';
  url2 = environment.apiURL + '/task';
  currentTask: any;

  // aggiunge task
  addTask(name: string, assignee_id: number, status: number, start_date: Date, end_date: Date, effort: number, sprintId: number): Observable<any> {
    const url = this.url;
    let body = {
      "name": name,
      "assignee_id": assignee_id,
      "status": status,
      "start_date": start_date,
      "end_date": end_date,
      "effort": effort,
      "sprint_id": sprintId,
    };
    return this.http.post(url, body);
  }

  // cancella task
  deleteTask(id: any): Observable<any> {
    const url = `${this.url}/${id}`;
    return this.http.delete(url);
  }

  // retrieve task
  getTask(id: any): Observable<any> {
    const url = `${this.url}/${id}`;
    return this.http.get(url);
  }

  // modifica task
  updateTask(name: string, assignee_id: number, status: number, start_date: Date, end_date: Date, effort: number, checklist: string): Observable<any> {
    const url = `${this.url}/${this.currentTask}`;

    let body = {
      "name": name,
      "assignee_id": assignee_id,
      "status": status,
      "start_date": start_date,
      "end_date": end_date,
      "effort": effort,
      "checklist": checklist
    };
    return this.http.patch(url, body);
  }

    // modifica task
    patchTaskOrder(tasksIds:any,taskId:any): Observable<any> {
      const url = `${this.url}/ciao`;
  
      let body = {
        'tasksOrder':tasksIds
      };
      return this.http.patch(url, body);
    }

  // get tasks comments(per il momento retrive quindi id del commento, TODO: cambiare in id del task)
  getTaskComments(id: any): Observable<any> {
    const url = `${this.url2}Comments/${id}`;
    return this.http.get(url);
  }

  // post comment
  postComment(id: any, comment: string): Observable<any> {
    const url = `${this.url2}Comments`;
    let body = {
      "task_id": id,
      "text": comment,
    };
    return this.http.post(url, body);
  }

  // patch comment
  patchComment(id: any, comment: string): Observable<any> {
    const url = `${this.url2}Comments/${id}`;
    let body = {
      "text": comment,
    };
    return this.http.patch(url, body);
  }

  // delete comment
  deleteComment(id: any): Observable<any> {
    const url = `${this.url2}Comments/${id}`;
    return this.http.delete(url);
  }



}
