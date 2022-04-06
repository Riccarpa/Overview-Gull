import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from 'src/app/models/project.model';
import { Client } from 'src/app/models/client.model';
import { User } from 'src/app/models/user.model';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  role:number
  token:any
  currentUser:any //utente loggato
  url = environment.apiURL + '/projects'
  updatedProject: any
  currentProject: any // id progetto singolo corrente
  project: Project[]
  clients: Client[]
  users: User[]

  constructor(
    private http: HttpClient, 
    private toastr: ToastrService,
    ) {}

  // get projects all
  getProjects(): Observable<any> {

    return this.http.get(this.url)
  }

  // retrive su progetto singolo
  getUpdateProject(): Observable<any> {

    let url = `${this.url}/${this.currentProject}`;
  

    return this.http.get(url)
  }

  //patch progetto
  updateProject(form: any, projId: number,userIds:any): Observable<any> {

    

    let body = {
      'name': form.name,
      'status': form.status ? form.status : 0,
      'start_date': form.start_date ,
      'end_date': form.end_date ,
      'progress': form.progress ? form.progress : 0,
      'revenue': form.revenue,
      'client_id': form.client_id,
      'user_ids': userIds,
    }
    if (form.logo) {
      body['logo_path'] = form.logo.message;
    }

   
    return this.http.patch(`${this.url}/${projId}`, body)
  }

  // post upload image
  uploadImagePost(file: any): Observable<any>{

    let url = environment.apiURL + '/uploadImage'

   

    const fd = new FormData()
    fd.append('image',file,file.name)
    
    return this.http.post(`${url}`, fd)

  }


  // delete project
  deleteProject(id: number): Observable<any> {

    return this.http.delete(`${this.url}/${id}`)
  }


  // post agiunta project
  addProject(form: any): Observable<any> {
    
    let todayDate = new Date().toISOString().slice(0, 10);
    
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

    return this.http.post(this.url, body)
  }

  warningBar(message:string) {
    this.toastr.warning(message, 'Warning', { timeOut: 2000, closeButton: true, progressBar: true });
  }

  successBar(message:string){
    this.toastr.success(message, 'Success', { timeOut: 2000, closeButton: true, progressBar: true });
  }

  errorBar(message: any) {
    this.toastr.error(message, 'Error', { timeOut: 2000, closeButton: true, progressBar: true });
  }

  randomNumber() {
    let num = Math.floor(Math.random() * 100000)
    return num.toString()
  }

}
