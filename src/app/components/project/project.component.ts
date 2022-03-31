import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { number } from 'ngx-custom-validators/src/app/number/validator';
import { CropperSettings } from 'ngx-img-cropper';
import { ToastrService } from 'ngx-toastr';
import { Chart } from 'src/app/models/chartPie.model';
import { Client } from 'src/app/models/client.model';
import { Project } from 'src/app/models/project.model';
import { User } from 'src/app/models/user.model';
import { ClientService } from 'src/app/services/client/client.service';
import { ProjectService } from 'src/app/services/project/project.service';
import { UserService } from 'src/app/services/user/user.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  
  
  //variabili template
  chartPercent:any
  confirmResut: any;
  active = false
  loading: boolean
  data: any;
  cropperSettings: CropperSettings;
  idClient:number //id cliente cliccato dalla pagina client da admin ricevuto dal client service
  client:Client
  url = environment.apiURL2
  constructor(
    private modalService: NgbModal,
    private productService: ProductService,
    private route: Router,
    private service: ProjectService,
    private fb: FormBuilder,
    private clientService: ClientService,
    private userService: UserService,
    private toastr: ToastrService) {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.cropperDrawSettings.lineDash = true;
    this.cropperSettings.cropperDrawSettings.dragIconStrokeWidth = 0;
    this.data = {};
  }

  projects: Project[] = []
  clients: Client[] = []
  users: User[] = []

  imageSelect: File
  dataRes: any




  projectForm = this.fb.group(
    {
      name: new FormControl('', Validators.required),
      status: new FormControl(''),
      start_date: new FormControl(''),
      end_date: new FormControl(''),
      progress: new FormControl(''),
      revenue: new FormControl(),
      client_id: new FormControl(''),
      user_ids: new FormControl([]),
      logo: new FormControl([])
    }
  )

  getAllProjects() {

    this.service.getProjects().subscribe((res) => {

      this.projects = res.data
  
      
      this.service.project = res.data
      for (let i = 0; i < this.projects.length; i++) {
        if (this.projects[i].logo) {
          this.projects[i].logo = `${this.projects[i].logo}?r=${this.service.randomNumber()}`

        }
      }

    }, (error) => {
      this.route.navigate(['/'])
    })
  }

  getAllClients() {
    this.clientService.getClients().subscribe((res) => {


      this.clients = res.data
      this.service.clients = res.data
    }, (error) => {
      this.route.navigate(['/'])
    })
  }

  getAllUsers() {

    this.userService.getUsers().subscribe((res) => {

      this.users = res.data
      this.service.users = res.data
    }, (error) => {
      this.route.navigate(['/'])
    })
  }


  addProject(form: any) {
    let start = this.projectForm.value.start_date ? Date.parse(this.projectForm.value.start_date) : Date.parse(new Date().toISOString().slice(0, 10))
    let end = this.projectForm.value.end_date ? Date.parse(this.projectForm.value.end_date) : start
    let diff = end >= start //end date nn puo essere minore della start date
    

    let newProj = this.projectForm.value
    if (this.projectForm.status == 'INVALID') {
      this.service.warningBar('Nome Progetto Obbligatorio e di almeno 3 caratteri')
    } else if (!diff) {
      this.service.warningBar('La Data di fine progetto é precedente alla data di creazione')
    } else {

      this.service.addProject(newProj).subscribe((res) => {
        this.dataRes = res.data

        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.updateProject(this.dataRes.id)
          this.service.successBar(`progetto creato con successo`)
          this.modalService.dismissAll()
        }, 2000);
      })

    }
  }
  // take file
  uploadImg(event: any) {
    
    this.imageSelect = event.target.files[0]
    
  }
  
  // multipart upload
  saveImg() {


    this.service.uploadImagePost(this.imageSelect).subscribe(

      (res) => {

        this.projectForm.value.logo = JSON.parse(JSON.stringify(res))
        if (res) {
          this.data = this.projectForm.value.logo.message
          this.service.successBar('file caricato con successo')
        }

      })
  }
// modale cropper img
  openModalImg(modal) {
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
      .result.then((result) => {
      }, (reason) => {
      });
  }

  updateProject(id: number) {

    //invio dell'id progetto al service
    this.service.currentProject = id
    this.route.navigate(['home/updateProject', id])
  }
// modale di creazione
  openCreateModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((result) => {
        this.confirmResut = `Closed with: ${result}`;
      }, (reason) => {
        this.confirmResut = `Dismissed with: ${reason}`;
      });
  }

// percentuali progress 
  getChartPercent(value:number) {

    return  this.chartPercent = new Chart(value).chartPie
    
  }

  
  back(){
    this.route.navigate(['home/client'])
  }



  ngOnInit() {

    if (this.clientService.idClient) {

      this.idClient = this.clientService.idClient
      this.clientService.getClient(this.idClient).subscribe((res) => {

        this.client = res.data
        if (this.client.logo) {
          
          this.client.logo = `${this.client.logo}?r=${this.service.randomNumber()}`
          console.log(this.client);
        }


      })
    }

    //get di tutti i progetti dal service e controllo immagine
    this.getAllProjects()

    //get di tutti i client dal clientService
    this.getAllClients()

    //get di tutti gli user da userService
    this.getAllUsers()

   
    
    
    
  }
}

