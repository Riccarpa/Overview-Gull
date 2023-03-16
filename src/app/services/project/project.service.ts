import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from 'src/app/models/project.model';
import { Client } from 'src/app/models/client.model';
import { User } from 'src/app/models/user.model';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Issue } from 'src/app/models/issue.model';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  role:number
  token:any
  currentUser:any //utente loggato
  currentProject: Project
  url = environment.apiURL + '/projects'
  baseUrl = environment.apiURL
  updatedProject: any
  project: Project[]
  clients: Client[]
  users: User[]
  isTableDisplayed = { status: true, title: "Display Cards"}//Toggle table

  constructor(
    private http: HttpClient, 
    private toastr: ToastrService,
    ) {}

  // get projects all
  getProjects(): Observable<any> {
    return this.http.get(this.url)
  }

  // retrive su progetto singolo
  getProject(id:number): Observable<any> {

    let url = `${this.url}/${id}`;


    return this.http.get(url)
  }

  //Toggle between table and card view
  toggleTable(){
    this.isTableDisplayed.status = !this.isTableDisplayed.status

    if (this.isTableDisplayed.status) {
      this.isTableDisplayed.title = "Display Cards"
    } else {
      this.isTableDisplayed.title = "Display Table"
    }
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


  // get history
  getHistory(id: number): Observable<any> {

    let url = `${this.url}/${id}/history`;
    return this.http.get(url)
  }

  // get retrive issue by project id /api/issues/id
  getIssues(id: number): Observable<any> {

    let url = `${this.baseUrl}/issues/${id}`;
    return this.http.get(this.baseUrl)
  }

  //post aggiunta issue /api/issues
  createIssue(form: any, projId: number): Observable<any> {

    let body = {
      "name": form.name,
      "description": form.description,
      "project_id": projId,
    }
    return this.http.post(`${this.baseUrl}/issues`, body)
  }

  // patch update issue `${this.baseUrl}/issues/${id}`
  updateIssue(issue: Issue,status:number): Observable<any> {

    let body = {
      "name": issue.name,
      "description": issue.description,
      "status": status,
    }
    return this.http.patch(`${this.baseUrl}/issues/${issue.id}`, body)
  }

  // delete issue
  deleteIssue(id: number): Observable<any> {

    return this.http.delete(`${this.baseUrl}/issues/${id}`)
  }

  //create comment  /api/issueComments
  addCommentToIssue(form: any, issueId: number): Observable<any> {

    let body = {
      "issue_id": issueId,
      "text": form.text,
    }
    return this.http.post(`${this.baseUrl}/issueComments`, body)
  }

  // add file to issue
  addFileToIssue(file: any, issueId: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('container_id',`${issueId}`)
    formData.append('container_type','App\\Issue')

    return this.http.post(`${this.baseUrl}/files`,formData)
  }


  // utils
  warningBar(message:string) {
    this.toastr.warning(message, 'Warning', { timeOut: 3000, closeButton: true, progressBar: true });
  }

  successBar(message:string){
    this.toastr.success(message, 'Success', { timeOut: 3000, closeButton: true, progressBar: true });
  }

  errorBar(message: any) {
    this.toastr.error(message, 'Error', { timeOut: 3000, closeButton: true, progressBar: true });
  }

  randomNumber() {
    let num = Math.floor(Math.random() * 100000)
    return num.toString()
  }

}
