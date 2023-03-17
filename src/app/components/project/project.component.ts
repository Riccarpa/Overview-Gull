import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { number } from "ngx-custom-validators/src/app/number/validator";
import { CropperSettings } from "ngx-img-cropper";
import { ToastrService } from "ngx-toastr";
import { Chart } from "src/app/models/chartPie.model";
import { Client } from "src/app/models/client.model";
import { Project } from "src/app/models/project.model";
import { User } from "src/app/models/user.model";
import { ClientService } from "src/app/services/client/client.service";
import { ReqInterceptInterceptor } from "src/app/services/interceptors/req-intercept.interceptor";
import { ProjectService } from "src/app/services/project/project.service";
import { UserService } from "src/app/services/user/user.service";
import { ProductService } from "src/app/shared/services/product.service";
import { environment } from "src/environments/environment";
import { SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.scss"],
})
export class ProjectComponent implements OnInit {
  
  //variabili template
  confirmResut: any;
  active = false;
  loading: boolean;
  data: any;
  cropperSettings: CropperSettings;
  idClient: number; //id cliente cliccato dalla pagina client da admin ricevuto dal client service
  client: Client;
  user: any; //utente loggato
  userRetrive: any; // retrive user loggato
  url = environment.apiURL2;

  //row selection
  selectionType = SelectionType;

  constructor(
    private modalService: NgbModal,
    private productService: ProductService,
    private route: Router,
    private service: ProjectService,
    private fb: FormBuilder,
    private clientService: ClientService,
    private userService: UserService,
    private toastr: ToastrService,
    private interc: ReqInterceptInterceptor
  ) {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.cropperDrawSettings.lineDash = true;
    this.cropperSettings.cropperDrawSettings.dragIconStrokeWidth = 0;
    this.data = {};
  }

  projects: any[] = [];
  clients: Client[] = [];
  users: User[] = [];
  userProjects: any;
  imageSelect: File;
  dataRes: any;
  role: number;

  ngOnInit() {
    this.user = this.interc.takeRole();
    this.role = this.user.role;

    if (this.clientService.idClient) {
      this.idClient = this.clientService.idClient;
      this.clientService.getClient(this.idClient).subscribe((res) => {
        this.client = res.data;
        if (this.client.logo) {
          this.client.logo = `${this.client.logo
            }?r=${this.service.randomNumber()}`;
        }
      });
    }
    
    if (this.role === 0) { // se collaboratore 
      this.getUserProjects();
      this.userService.retrieveUser(this.user.id).subscribe((res) => {
        if (res) {
          this.userRetrive = res.data;
        }
      });
    } else {
      this.getAllProjects();
      if (this.role === 1){ // se admin

        //get di tutti gli user da userService
        this.getAllUsers();
  
        //get di tutti i client dal clientService
        this.getAllClients();
      }
    }
  }

  projectForm = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    status: new FormControl(null),
    start_date: new FormControl(null),
    end_date: new FormControl(null),
    progress: new FormControl(null),
    revenue: new FormControl(null),
    client_id: new FormControl(null),
    user_ids: new FormControl([]),
    logo: new FormControl([]),
  });

  getAllProjects() { // chiamata ai projects
    this.service.getProjects().subscribe(
      (res) => {
        this.projects = res.data;

        this.service.project = res.data;
        for (let i = 0; i < this.projects.length; i++) {
          if (this.projects[i].logo) {
            this.projects[i].logo = `${this.projects[i].logo}?r=${this.service.randomNumber()}`;
          }
        }
      }
    );
  }

  getAllClients() { //chiamata ai clients ADMIN
    this.clientService.getClients().subscribe(
      (res) => {
        this.clients = res.data;
        this.service.clients = res.data;
      }
    );
  }

  getAllUsers() { //chiamata users ADMIN
    this.userService.getUsers().subscribe(
      (res) => {
        this.users = res.data;
        this.service.users = res.data;
      }
    );
  }

  getUserProjects() { // chiamata ai projects COLLABORATORE
    this.userService.getUserProject().subscribe((res) => {
      this.userProjects = res.data;
    });
  }

  addProject(form: any) { // solo ADMIN
    
    let start = this.projectForm.value.start_date? Date.parse(this.projectForm.value.start_date): Date.parse(new Date().toISOString().slice(0, 10));
    let end = this.projectForm.value.end_date? Date.parse(this.projectForm.value.end_date): start;
    let diff = end >= start; //end date nn puo essere minore della start date

    let newProj = this.projectForm.value;
    if (this.projectForm.status == "INVALID") {
      this.service.warningBar(
        "Name is required, 3 characters needed"
      );
    } else if (!diff) {
      this.service.warningBar(
        "End date is precedent of start date"
      );
    } else {
      this.service.addProject(newProj).subscribe((res) => {
        this.dataRes = res.data;

        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.updateProject(this.dataRes.id);
          this.service.successBar(`Project created successfully`);
          this.modalService.dismissAll();
        }, 2000);
      });
    }
  }

  //Toggle between table and card view
  isTableDisplayed = this.service.isTableDisplayed;
  toggleTable(){
    this.service.toggleTable();
    this.isTableDisplayed = this.service.isTableDisplayed;
  }

  //row selection
  onSelect({ selected }) {
    this. updateProject(selected[0].id);
  }

  // take file
  uploadImg(event: any) {
    this.imageSelect = event.target.files[0];
  }

  // multipart upload
  saveImg() {
    this.service.uploadImagePost(this.imageSelect).subscribe((res) => {
      this.projectForm.value.logo = JSON.parse(JSON.stringify(res));
      if (res) {
        this.data = this.projectForm.value.logo.message;
        this.service.successBar("File uploaded successfully");
      }
    });
  }

  // modale cropper img
  openModalImg(modal) {
    this.modalService
      .open(modal, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => { },
        (reason) => { }
      );
  }

  updateProject(id: number) {
    //invio dell'id progetto al service
    this.route.navigate(["home/updateProject", id]);
  }

  // modale di creazione
  openCreateModal(content: any) {
    this.projectForm.reset();
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title", centered: true })
      .result.then(
        (result) => {
          this.confirmResut = `Closed with: ${result}`;
        },
        (reason) => {
          this.confirmResut = `Dismissed with: ${reason}`;
        }
      );
  }

  // percentuali progress
  getChartPercent(value: number) {
    return (new Chart(value).chartPie);
  }

  goToDetail(project:Project) {
    this.service.currentProject = project;
    this.route.navigate(["home/issue"]);
  }

  back() {
    this.route.navigate(["home/client"]);
  }

  //Tooltip Text
  tooltipText(data : any){
    let string = '';

    for (let i = 0; i < data.length; i++) {
      string += `${data[i].name} ${data[i].surname} \n`;
    }
    return string;
  }

  ngOnDestroy() { }
}
