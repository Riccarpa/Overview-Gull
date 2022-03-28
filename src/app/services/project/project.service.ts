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

  token: any
  url = 'http://80.211.57.191/overview_dev/api/projects'
  updatedProject: any
  currentProject: any // id progetto singolo corrente
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

    let url = `${this.url}/${this.currentProject}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    }

    return this.http.get(url, { headers })
  }

  //patch progetto
  updateProject(form: any, projId: number,userIds:any): Observable<any> {

    const headers = {
 
      'Authorization': `Bearer ${this.token}`
    }

    let body = {
      'name': form.name,
      'status': form.status ? form.status : 0,
      'start_date': form.start_date ,
      'end_date': form.end_date ,
      'progress': form.progress ? form.progress : 0,
      'revenue': form.revenue,
      'client_id': form.client_id,
      'user_ids': userIds,
      // 'logo_path': logo
    }
    if (form.logo) {
      body['logo_path'] = form.logo.message;
    }

   
    return this.http.patch(`${this.url}/${projId}`, body, { headers })
  }

  // post upload image
  uploadImagePost(file:any){

    let url = 'http://80.211.57.191/overview_dev/api/uploadImage'

    const fd = new FormData()
    fd.append('image',file,file.name)
    const headers = {
      
      'Authorization': `Bearer ${this.token}`
    }
    return this.http.post(`${url}`, fd, { headers })

  }


  // delete project
  deleteProject(id: number) {


    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    }
    return this.http.delete(`${this.url}/${id}`, { headers })

  }


  // post agiunta project
  addProject(form: any): Observable<any> {
    
    let todayDate = new Date().toISOString().slice(0, 10);
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    }

    let body = {
      'name': form.name,
      'status': form.status ? form.status : 0 ,
      'start_date': form.start_date ? form.start_date :todayDate,
      'end_date': form.end_date ? form.end_date :todayDate,
      'progress': form.progress ? form.progress : 0,
      'revenue': form.revenue,
      'client_id': form.client_id,
      'user_ids': form.user_ids,
    }
     if (form.logo) {
       body['logo_path'] = form.logo.message;
    }

   
    
    
    return this.http.post(this.url, body, { headers })
  }


  randomNumber() {
    let num = Math.floor(Math.random() * 100000)
    return num.toString()
  }

}
