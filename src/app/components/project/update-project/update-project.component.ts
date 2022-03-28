
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { number } from 'ngx-custom-validators/src/app/number/validator';
import { CropperSettings } from 'ngx-img-cropper';
import { ToastrService } from 'ngx-toastr';
import { Client } from 'src/app/models/client.model';
import { Project } from 'src/app/models/project.model';
import { User } from 'src/app/models/user.model';
import { ClientService } from 'src/app/services/client/client.service';
import { ProjectService } from 'src/app/services/project/project.service';
import { UserService } from 'src/app/services/user/user.service';
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
  data: any;
  cropperSettings: CropperSettings;

  constructor(
    private service: ProjectService,
    private route: Router,
    private active: ActivatedRoute,
    private fb: FormBuilder,
    private clientService: ClientService,
    private userService: UserService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) {

    this.cropperSettings = new CropperSettings();

    this.cropperSettings.cropperDrawSettings.lineDash = true;
    this.cropperSettings.cropperDrawSettings.dragIconStrokeWidth = 0;

    this.data = {};
  }



  project: Project //progetto singolo
  idProject: number //id progetto singolo

  clients: Client[] // lista clienti
  associateClient: Client // cliente associato al project

  users: User[] = [] // lista utenti 
  associateUser: number //numero di user associati al project(.lenght)
  arrayUsersIds = [] //array di users associati al proggetto

  imageSelect:File //img File

  projectForm :FormGroup //form patch



  delProject(id: number) {

    this.service.deleteProject(id).subscribe(res => {

      this.loadingDelete = true;
      setTimeout(() => {
        this.loadingDelete = false;
        this.toastr.success(`proggetto eliminato con successo`, 'Success', { timeOut: 3000, progressBar: true });
        this.route.navigate(['home/project'])
      }, 2000);
    })
  }

  updateProject() {

    let start = Date.parse(this.projectForm.value.start_date)
    let end = Date.parse(this.projectForm.value.end_date)
    let diff = end >= start //end date nn puo essere minore della start date


    //invio del form  id e array userIds  al service per update
    if (this.projectForm.status == 'INVALID') {
      this.warningBar()
    }else if(!diff){
      this.warningBarDate()
    }else{

      let updatedProj = this.projectForm.value
      
        this.service.updateProject(updatedProj, this.project.id, this.arrayUsersIds).subscribe((res) => {
    
          this.loadingUpdate = true;
          setTimeout(() => {
            this.loadingUpdate = false;
            this.toastr.success(`proggetto modificato con successo`, 'Success', { timeOut: 3000, progressBar: true });
            this.route.navigate(['home/project'])
          }, 2000);
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
        }

      })
  }

  // cropper img
  openModalImg(modal) {
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
      .result.then((result) => {
      }, (reason) => {
      });
  }

  // dissocia user dal proggetto
  removeUserToProject(id: number) {

    for (let i = 0; i < this.arrayUsersIds.length; i++) {
      const e = this.arrayUsersIds[i];
      if (e.id === id) {// se trova doppione elimina 

        this.arrayUsersIds.splice(i, 1)
        this.toastr.success('user rimosso con successo.', 'Success!', { progressBar: true });
        break
      }

    }

  }

  addUserToProject(user: any) {

    let int = parseInt(user.percent)//parso
    user.percent = int//valorizzo




    if (this.arrayUsersIds.length == 0) {
      this.arrayUsersIds.push(user)
      this.toastr.success('user aggiunto con successo.', 'Success!', { progressBar: true });
    } else {

      for (let i = 0; i < this.arrayUsersIds.length; i++) {
        let e = this.arrayUsersIds[i];

        if (e.id !== user.id && i == this.arrayUsersIds.length - 1) { //se ha finito di ciclare e non trova id allora pusha
          this.arrayUsersIds.push(user)
          this.toastr.success('user aggiunto con successo.', 'Success!', { progressBar: true });

          break
        } else if (e.id === user.id) { // se trova un doppione 

          if (isNaN(user.percent) && isNaN(e.percent) || e.percent === user.percent) {// se sono uguali non modifica valori
            this.toastr.warning('utente giá associato al progetto. o niente da modificare', 'Success!', { progressBar: true });

            break
          } else {// se sono diversi modifica valori
            this.arrayUsersIds.splice(i, 1, user)
            this.toastr.success('modifica effettuata ', 'Success!', { progressBar: true });

            break
          }


        }
      }


    }
  }

  warningBar() {
    this.toastr.warning('Nome Proggetto Obbligatorio e di almeno 3 caratteri', 'Warning', { timeOut: 3000, closeButton: true, progressBar: true });
  }

  warningBarDate() {
    this.toastr.warning('La Data di fine proggetto é precedente alla data di creazione', 'Warning', { timeOut: 3000, closeButton: true, progressBar: true });
  }

  ngOnInit(): void {

    if (!this.service.currentProject) {
      this.service.currentProject = this.active.snapshot.paramMap.get('id')
    }

    //retrive del proggetto singolo
    this.service.getUpdateProject().subscribe((res) => {

      this.project = res.data

      if (this.project.logo) {
        this.project.logo = `${this.project.logo}?r=${this.service.randomNumber()}`
      }

      // valorizzazione form 
      this.projectForm = new FormGroup({

        name: new FormControl(this.project.name,Validators.required),
        status: new FormControl(this.project.status),
        start_date: new FormControl(this.project.start_date),
        end_date: new FormControl(this.project.end_date),
        progress: new FormControl(this.project.progress),
        revenue: new FormControl(this.project.revenue),
        client_id: new FormControl(this.project.client_id),
        user_ids: new FormControl(this.project.user_ids),
        logo: new FormControl(this.project.logo)

      })

      //calcolo del numero di utenti associati al proggetto
      this.associateUser = this.project.user_ids.length


      //get cliente associato al proggetto tramite id
      if (res.data.client_id) {

        let idClient = res.data.client_id
        this.clientService.getClient(idClient).subscribe((res) => {

          this.associateClient = res.data
        })
      }


    })

    // get Users
    this.userService.getUsers().subscribe((res) => {

      this.users = res.data

      for (let j = 0; j < this.users.length; j++) {
        let u = this.users[j];

        for (let i = 0; i < this.project.user_ids.length; i++) {
          let e = this.project.user_ids[i];
          if (e === u.id) {

            this.arrayUsersIds.push({ id: e, cost: u.cost, percent: NaN })
          }
        }
      }

    })
    // get Clients
    this.clientService.getClients().subscribe((res) => {

      this.clients = res.data
    })










  }
}
