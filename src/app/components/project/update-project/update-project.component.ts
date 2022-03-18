import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { el } from 'date-fns/locale';
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
    private toastr: ToastrService

  ) { }

  project: Project
  idProject: number
  client: Client[] = []
  users: User[] = []
  associateClient:Client
  associateUser:number


  projectForm = this.fb.group(
    {
      name: new FormControl(''),
      status: new FormControl(''),
      start_date: new FormControl(''),
      end_date: new FormControl(''),
      progress: new FormControl(''),
      revenue: new FormControl(''),
      client_id: new FormControl(''),
      user_ids: new FormControl('')
    }
  )

  updateProject() {

    let updatedProj = this.projectForm.value
    this.service.updateProject(updatedProj, this.project.id).subscribe((res) => {
      console.log(res);

    })

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
      
      
    })
    
    this.userService.getUsers().subscribe((res) => {
      
      this.users = res.data

    })
    
    
    this.clientService.getClients().subscribe((res) => {
      this.client = res.data
      let projId = this.project.client_id
      
      if (res) {
        this.client.forEach(c => {
          // match cliente corrente 
          if (c.id && c.id === projId) {

            this.associateClient = c

          }
        });
      }
    })


    this.buildFormBasic();
    this.radioGroup = this.fb.group({
      radio: []
    });
    
    
    
    
  }
}
