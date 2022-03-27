import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CropperSettings } from 'ngx-img-cropper';
import { ToastrService } from 'ngx-toastr';
import { Client } from 'src/app/models/client.model';
import { Project } from 'src/app/models/project.model';
import { User } from 'src/app/models/user.model';
import { ClientService } from 'src/app/services/client/client.service';
import { ProjectService } from 'src/app/services/project/project.service';
import { UserService } from 'src/app/services/user/user.service';

import { echartStyles } from 'src/app/shared/echart-styles';
import { ProductService } from 'src/app/shared/services/product.service';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {


  //variabili template
  confirmResut: any;
  active = false
  loading: boolean
  data: any;
  cropperSettings: CropperSettings;

  //gruppo variabili opzioni chart
  chartPie1: any;
  chartPie2: any;
  chartPie3: any;
  chartPie4: any;
  chartPieDef: any;

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
      revenue: new FormControl(''),
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


  addProject(form:any) {

    let newProj = this.projectForm.value
    if (this.projectForm.status == 'INVALID') {
      this.warningBar()
    } else {

      this.service.addProject(newProj).subscribe((res) => {
          this.dataRes = res.data
        
      })
      this.loading = true;
      setTimeout(() => {
        this.service.updateProject(this.dataRes, this.dataRes.id, this.dataRes.user_ids, this.dataRes.logo).subscribe()
        
        
        console.log(this.data,'this.data');
        console.log(this.dataRes.logo,'logo datares');
        
        
            this.loading = false;
            this.updateProject(this.dataRes.id)
            this.toastr.success(`proggetto creato con successo`, 'Success', { timeOut: 3000, progressBar: true });
            this.modalService.dismissAll()
          }, 2000);
        
    }
  }




  uploadImg(event: any) {

    this.imageSelect = event.target.files[0]

  }

  saveImg() {


    this.service.uploadImagePost(this.imageSelect).subscribe(

      (res) => {

        this.projectForm.value.logo = JSON.parse(JSON.stringify(res))
        if (res) {
          this.data = this.projectForm.value.logo.message
          
        }
        
      })
  }

  openModalImg(modal) {
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
      .result.then((result) => {
      }, (reason) => {
      });
  }



  updateProject(id: number) {

    //invio dell'id proggetto al service
    this.service.currentProject = id
    this.route.navigate(['home/updateProject', id])
  }

  openCreateModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((result) => {
        this.confirmResut = `Closed with: ${result}`;
      }, (reason) => {
        this.confirmResut = `Dismissed with: ${reason}`;
      });
  }

  warningBar() {
    this.toastr.warning('Name project fields are required', 'Warning', { timeOut: 3000, closeButton: true, progressBar: true });
  }

  ngOnInit() {

    //get di tutti i proggetti dal service e controllo immagine
    this.getAllProjects()

    //get di tutti i client dal clientService
    this.getAllClients()

    //get di tutti gli user da userService
    this.getAllUsers()


    //varie opzioni per il chart del progresso del proggetto in %
    this.chartPie1 = {
      ...echartStyles.defaultOptions, ...{
        legend: {
          show: true,
          bottom: 0,
        },
        series: [{
          type: 'pie',
          ...echartStyles.pieRing,

          label: echartStyles.pieLabelCenterHover,
          data: [{
            name: 'Completed',
            value: 50,
            itemStyle: {
              color: '#663399',
            }
          }, {
            name: 'Pending',
            value: 50,
            itemStyle: {
              color: '#ced4da',
            }
          }]
        }]
      }
    };
    this.chartPie2 = {
      ...echartStyles.defaultOptions, ...{
        legend: {
          show: true,
          bottom: 0,
        },
        series: [{
          type: 'pie',
          ...echartStyles.pieRing,

          label: echartStyles.pieLabelCenterHover,
          data: [{
            name: 'Completed',
            value: 80,
            itemStyle: {
              color: '#663399',
            }
          }, {
            name: 'Pending',
            value: 20,
            itemStyle: {
              color: '#ced4da',
            }
          }]
        }]
      }
    };
    this.chartPie3 = {
      ...echartStyles.defaultOptions, ...{
        legend: {
          show: true,
          bottom: 0,
        },
        series: [{
          type: 'pie',
          ...echartStyles.pieRing,

          label: echartStyles.pieLabelCenterHover,
          data: [{
            name: 'Completed',
            value: 100,
            itemStyle: {
              color: '#663399',
            }
          }, {
            name: 'Pending',
            value: 0,
            itemStyle: {
              color: '#ced4da',
            }
          }]
        }]
      }
    };
    this.chartPie4 = {
      ...echartStyles.defaultOptions, ...{
        legend: {
          show: true,
          bottom: 0,
        },
        series: [{
          type: 'pie',
          ...echartStyles.pieRing,

          label: echartStyles.pieLabelCenterHover,
          data: [{
            name: 'Completed',
            value: 20,
            itemStyle: {
              color: '#663399',
            }
          }, {
            name: 'Pending',
            value: 80,
            itemStyle: {
              color: '#ced4da',
            }
          }]
        }]
      }
    };
    //chart di defult allo 0%
    this.chartPieDef = {
      ...echartStyles.defaultOptions, ...{
        legend: {
          show: true,
          bottom: 0,
        },
        series: [{
          type: 'pie',
          ...echartStyles.pieRing,

          label: echartStyles.pieLabelCenterHover,
          data: [{
            name: 'Completed',
            value: 0,
            itemStyle: {
              color: '#663399',
            }
          }, {
            name: 'Pending',
            value: 100,
            itemStyle: {
              color: '#ced4da',
            }
          }]
        }]
      }
    };

  }
}


function warningBar() {
  throw new Error('Function not implemented.');
}

