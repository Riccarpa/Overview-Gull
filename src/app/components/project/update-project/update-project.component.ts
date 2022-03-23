import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  formBasic: FormGroup;
  loading: boolean;
  radioGroup: FormGroup;

  constructor(
    private service: ProjectService,
    private route: Router,
    private active: ActivatedRoute,
    private fb: FormBuilder,
    private clientService: ClientService,
    private userService: UserService,
    private toastr: ToastrService,
    private modalService: NgbModal

  ) { 

    this.cropperSettings = new CropperSettings();
  
    this.cropperSettings.cropperDrawSettings.lineDash = true;
    this.cropperSettings.cropperDrawSettings.dragIconStrokeWidth = 0;
    
    this.data = {};
  }
  
 
  project: Project //progetto singolo
  idProject: number //id progetto singolo
  clients:Client[] // lista clienti
  users: User[] = [] // lista utenti 
  associateClient:Client // cliente associato al project
  associateUser:number //numero di user associati al project
  imgClient:any
  data: any;
  cropperSettings: CropperSettings;



  projectForm = this.fb.group(
    {
      name: new FormControl(''),
      status: new FormControl(''),
      start_date: new FormControl(''),
      end_date: new FormControl(''),
      progress: new FormControl(''),
      revenue: new FormControl(''),
      client_id: new FormControl(''),
      user_ids: new FormControl([]),

    }

  )

  delProject(id: number) {

    this.service.deleteProject(id).subscribe()
    this.route.navigate(['home/project'])
  }

  updateProject() {

    let updatedProj = this.projectForm.value
    this.service.updateProject(updatedProj, this.project.id).subscribe((res) => {
      
      console.log(res, 'log della res update');
      
      this.route.navigate(['home/project'])

    })

  }

  updateImg() {

    this.modalService.dismissAll();
    let base64JpgWithoutIndex;
    let base64PngWithoutIndex;
    if (this.data.image.includes('data:image/jpeg;base64,')) {
      base64JpgWithoutIndex = this.data.image.replace('data:image/jpeg;base64,', '');
      this.projectForm.value.logo_data = base64JpgWithoutIndex;
    } else {
      base64PngWithoutIndex = this.data.image.replace('data:image/png;base64,', '');
      this.projectForm.value.logo_data = base64PngWithoutIndex;
    }
  }

  buildFormBasic() {
    this.formBasic = this.fb.group({
      experience: []
    });
  }

  submit() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.toastr.success('Project updated.', 'Success!', { progressBar: true });
    }, 2000);

  }

  open(modal) {
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
      .result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log('Err!', reason);
      });
  }






  ngOnInit(): void {
    
    if (!this.service.currentProject) {
      this.service.currentProject = this.active.snapshot.paramMap.get('id')
    }

    this.service.getUpdateProject().subscribe((res) => {

      this.project = res.data

      this.projectForm = this.fb.group({

        name: new FormControl(this.project.name),
        status: new FormControl(this.project.status),
        start_date: new FormControl(this.project.start_date),
        end_date: new FormControl(this.project.end_date),
        progress: new FormControl(this.project.progress),
        revenue: new FormControl(this.project.revenue),
        client_id: new FormControl(this.project.client_id),
        user_ids: new FormControl(this.project.user_ids)
        
      })

      
      this.associateUser = this.project.user_ids.length
      let idClient = res.data.client_id
      this.clientService.getClient(idClient).subscribe((res) => {
        this.associateClient = res.data
        
      })

      
    })
    
    this.userService.getUsers().subscribe((res) => {
      
      this.users = res.data

    })

    this.clientService.getClients().subscribe((res)=>{

      this.clients = res.data
    })

    

    this.buildFormBasic();
    this.radioGroup = this.fb.group({
      radio: []
    });
    
    
    
    
    
  }
}
