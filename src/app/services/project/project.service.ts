import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from 'src/app/models/project.model';
import { Client } from 'src/app/models/client.model';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  token:any
  url = 'http://80.211.57.191/api/projects'
  updatedProject:any
  currentProject:any // id progetto singolo corrente
  project: Project[]
  clients: Client[]
  users: User[]

  constructor(private http: HttpClient) {
    
    this.token = localStorage.getItem('token')
   }

  // get projects all
  getProjects(): Observable<any> {

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    }
    return this.http.get(this.url, { headers })
  }

   // retrive su progetto singolo
  getUpdateProject(): Observable<any> {

    let url = `http://80.211.57.191/overview_dev/api/projects/${this.currentProject}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    }

    return this.http.get(url, { headers })
  }

  //patch progetto
  updateProject(form:any,projId:number): Observable<any> {
    let url = `http://80.211.57.191/overview_dev/api/projects/${projId}`
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    }

    let body = {
      'name': form.name,
      'status': form.status,
      'start_date': form.start_date,
      'end_date': form.end_date,
      'progress': form.progress,
      'revenue': form.revenue,
      'client_id': form.client_id,
      'user_ids': form.user_ids
    }
    if (form.logo_data) {
      body['logo_data'] = form.logo_data;
    }
    return this.http.patch(`${this.url}/${projId}`, body, { headers })
  }


  // delete project
  deleteProject(id:number){

    let url = `http://80.211.57.191/overview_dev/api/projects/${id}`
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    }
    return this.http.delete(`${this.url}/${id}`, { headers })

  }


  // post agiunta project
  addProject(form: any): Observable<any>{
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    }

    let body = {
        'name': form.name,
        'status': form.status ,
        'start_date': form.start_date ,
        'end_date': form.end_date ,
        'progress': form.progress ,
        'revenue': form.revenue ,
        'client_id': form.client_id ,
        'user_ids': form.user_ids
    }

   
    return this.http.post(this.url,body,{headers})

  }


  randomNumber() {
    let num = Math.floor(Math.random() * 100000)
    return num.toString()
  }
  

    
}
