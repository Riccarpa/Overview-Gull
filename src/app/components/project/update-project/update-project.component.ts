
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CropperSettings } from 'ngx-img-cropper';
import { ToastrService } from 'ngx-toastr';
import { Client } from 'src/app/models/client.model';
import { Project } from 'src/app/models/project.model';
import { User } from 'src/app/models/user.model';
import { ClientService } from 'src/app/services/client/client.service';
import { ReqInterceptInterceptor } from 'src/app/services/interceptors/req-intercept.interceptor';
import { ProjectService } from 'src/app/services/project/project.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-update-project',
  templateUrl: './update-project.component.html',
  styleUrls: ['./update-project.component.scss']
})

export class UpdateProjectComponent implements OnInit {

  //variabili di template
  formBasic: FormGroup;
  loadingUpdate: boolean;
  loadingDelete: boolean;
  cropperSettings: CropperSettings;
  data: any;
  role:number;
  userAutocompletes = [];

  // variabili visibilitá campi modale
  modal_progress:false
  modal_revenue:false
  modal_client_id:false
  modal_user_ids:false

  constructor(
    private service: ProjectService,
    private route: Router,
    private active: ActivatedRoute,
    private fb: FormBuilder,
    private clientService: ClientService,
    private userService: UserService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private interc: ReqInterceptInterceptor
   
  ) {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.cropperDrawSettings.lineDash = true;
    this.cropperSettings.cropperDrawSettings.dragIconStrokeWidth = 0;
    this.data = {};
  }


  url = environment.apiURL2
  project: Project | any//progetto singolo
  idProject: number //id progetto singolo

  clients: Client[] // lista clienti
  associateClient: Client // cliente associato al project

  users: User[] = [] // lista utenti 
  associateUser: number //numero di user associati al project(.lenght)
  arrayUsersIds = [] //array di users associati al progetto

  imageSelect: File //file img
  confirmResut:any
  historyCheck:FormControl = new FormControl()

  projectForm = new FormGroup(
    {
      name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      status: new FormControl(''),
      start_date: new FormControl(''),
      end_date: new FormControl(''),
      progress: new FormControl(''),
      revenue: new FormControl(''),
      client_id: new FormControl(''),
      user_ids: new FormControl(),
      logo: new FormControl([])
    }
  )

  collaboratorTags = new FormControl([
    /* {display: 'Bangladesh', value: 'BD'} */
  ]);

  ngOnInit(): void {

    this.role = this.interc.takeRole().role //prendo il ruolo dall'interceptor 
    if (!this.idProject) {
      this.idProject = parseInt(this.active.snapshot.paramMap.get('id'))
    }

    //retrive del progetto singolo
    this.service.getProject(this.idProject).subscribe((res) => {
      this.project = res.data
      
      if (this.project.logo) {
        this.project.logo = `${this.project.logo}?r=${this.service.randomNumber()}`
      }
      
      this.projectForm = new FormGroup({

        name: new FormControl(this.project.name, Validators.required),
        status: new FormControl(this.project.status),
        start_date: new FormControl(this.project.start_date),
        end_date: new FormControl(this.project.end_date),
        progress: new FormControl(this.project.progress),
        revenue: new FormControl(this.project.revenue),
        client_id: new FormControl(this.project.client_id),
        user_ids: new FormControl(this.project.user_ids),
        logo: new FormControl(this.project.logo)

      })

      this.associateUser = this.project.user_ids.length //calcolo del numero di utenti associati al progetto
      this.associateClient = this.project.client_details //cliente progetto


      if (this.interc.takeRole().role !== 1) { // se !admin
        this.arrayUsersIds = this.project.user_details

      } else if (this.interc.takeRole().role == 1) { //se admin
        if (this.users.length == 0) {
          // get Users
          this.userService.getUsers().subscribe((res) => {
  
            this.users = res.data
            for (let j = 0; j < this.users?.length; j++) {
              let u = this.users[j];

              //Collaborators autocomplete
              this.userAutocompletes.push(
                {
                  display: `${u.name} ${u.surname}`, 
                  value: {
                    id: u.id,
                    cost: u.cost
                  }
                });
             
              for (let i = 0; i < this.project?.user_ids.length; i++) {
                let e = this.project.user_ids[i];
                
  
                if (e === u.id) {
                  this.arrayUsersIds.push({ id: e, cost: u.cost, percent: NaN })

                  this.collaboratorTags.value.push({
                    display: `${u.name} ${u.surname}`, 
                    value: {
                      id: u.id,
                      cost: u.cost
                    }
                  });
                }
              }
            }
            
          })
        }
      } 
    })

    if (this.clients === undefined && this.role == 1) {
      // get Clients
      this.clientService.getClients().subscribe((res) => {
        this.clients = res.data
      })
    }
  }

  delProject(id: number) { // delete proj ADMIN
    this.modalService.dismissAll()
    this.service.deleteProject(id).subscribe(res => {

      this.service.successBar(`progetto eliminato con successo`)
      this.route.navigate(['home/project'])
     
    })
  }

  updateProject() { // update ADMIN

    let start = Date.parse(this.projectForm.value.start_date)
    let end = Date.parse(this.projectForm.value.end_date)
    let diff = end >= start //end date nn puo essere minore della start date


    //invio del form  id e array userIds  al service per update
    if (this.projectForm.status == 'INVALID') {
      this.toastr.warning('Nome Progetto Obbligatorio e di almeno 3 caratteri')
    }else if(!diff){
      this.toastr.warning('La Data di fine progetto é precedente alla data di creazione')
    }else{
      let updatedProj = this.projectForm.value
      this.loadingUpdate = true;

        this.service.updateProject(updatedProj, this.project.id, this.arrayUsersIds).subscribe((res) => {
          this.loadingUpdate = false;
          
          this.service.successBar(`progetto modificato con successo`)
          setTimeout(() => {
            window.location.reload()

          }, 1500);
        })
    }
  }

  // take file
  uploadImg(event: any) {
    this.imageSelect = event.target.files[0]
  }

  // post miltipart
  saveImg() {
    this.service.uploadImagePost(this.imageSelect).subscribe(
      (res) => {
        this.projectForm.value.logo = JSON.parse(JSON.stringify(res))
        if (res) {
          this.data = this.projectForm.value.logo.message
          this.updateProject()
        }
      },(err)=>{
        this.toastr.error(err.error)
      })
  }

  deleteImg() {
    this.service.removeImg(this.project.id).subscribe(
      (res) => {
        this.toastr.success("Immagine rimossa con successo")
        setTimeout(() => {
          
          window.location.reload()
        }, 1500);
      },(err)=>{
        this.toastr.error(err.error)
      })
  }

  // cropper img
  openModalImg(modal) {
    if (this.role === 1 ){
      this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
        .result.then((result) => {
        }, (reason) => {
        });
    }
  }

  // dissocia user dal progetto
  removeUserToProject(userValue: any) {
    let id = userValue.value.id;

    for (let i = 0; i < this.arrayUsersIds.length; i++) {
      const e = this.arrayUsersIds[i];
      if (e.id === id) {// se trova doppione elimina 
        this.arrayUsersIds.splice(i, 1)
       this.toastr.warning('user rimosso con successo, Ricordati di fare Update per salvare le modifiche')
        break
      }
    }
  }

  // associa user al peogetto
  addUserToProject(userValue: any) {
    let user = { 
      id: userValue.value.id,
      cost: userValue.value.cost,
      percent: null
    }

    let int = parseInt(user.percent);//parse della percentuale
    user.percent = int; //valorizzo

    if (this.arrayUsersIds.length == 0) {
      this.arrayUsersIds.push(user)
      this.toastr.success('user aggiunto con successo.')
    } else {

      for (let i = 0; i < this.arrayUsersIds.length; i++) {
        let e = this.arrayUsersIds[i];

        if (e.id !== user.id && i == this.arrayUsersIds.length - 1) { //se ha finito di ciclare e non trova id allora pusha
          this.arrayUsersIds.push(user)
          this.toastr.success('user aggiunto con successo.')
          break
        } else if (e.id === user.id) { // se trova un doppione 

          if (isNaN(user.percent) && isNaN(e.percent) || e.percent === user.percent) {// se sono uguali non modifica valori
            this.toastr.warning('utente giá associato al progetto. o niente da modificare')
            break
          } else {// se sono diversi modifica valori
            this.arrayUsersIds.splice(i, 1, user)
            this.toastr.success('modifica effettuata ', 'Success!', { progressBar: true });
            this.service.successBar('modifica effettuata con successo.')
            break
          }
        }
      }
    }
  }

  // modale cards
  openCreateModal(content: any) {
    if (this.role ===1) {
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
        .result.then((result) => {
          this.confirmResut = `Closed with: ${result}`;
          this.visibleModal()
        }, (reason) => {
          this.confirmResut = `Dismissed with: ${reason}`;
          this.visibleModal()
        });
    }
  }

  // imposta su false alla chiusura della modale (update tramite card)
  visibleModal(){ 
    this.modal_progress = false
    this.modal_revenue = false
    this.modal_client_id = false
    this.modal_user_ids = false
  }

  back(){
   this.route.navigate(['home/project'])
  }


  confirm(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
    .result.then((result) => {
      this.confirmResut = `Closed with: ${result}`;
    }, (reason) => {
      this.confirmResut = `Dismissed with: ${reason}`;
    });
  }
}
