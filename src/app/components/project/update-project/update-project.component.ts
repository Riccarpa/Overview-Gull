import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(
    private service: ProjectService, 
    private route: Router, 
    private active: ActivatedRoute,
    private fb: FormBuilder,
    private clientService: ClientService,
    private userService: UserService,

    ) { }

  project:Project
  idProject:number
  client: Client[]
  users: User[]
  
  projectForm = this.fb.group(
    {
      name: new FormControl(''),
      status: new FormControl(''),
      start_date:  new FormControl(''),
      end_date:  new FormControl(''),
      progress:  new FormControl(''),
      revenue:  new FormControl(''),
      client_id:  new FormControl(''),
      user_ids:  new FormControl('')
    }
  )
  
  updateProject(){

    let updatedProj = this.projectForm.value
    this.service.updateProject(updatedProj, this.project.id).subscribe((res) =>{
      console.log(res);
      
    })

  }

  ngOnInit(): void {
    this.clientService.getClients().subscribe((res)=>{
      this.client = res.data
    } )

    this.userService.getUsers().subscribe((res) =>{

      this.users = res.data
    })
    
    if (!this.service.currentProject) {
      this.service.currentProject = this.active.snapshot.paramMap.get('id')
    }
    this.service.getUpdateProject().subscribe((res) => {
  
      this.project = res.data
 
      this.projectForm = this.fb.group( {
  
        name: new FormControl(this.project.name),
        status: new FormControl(this.project.status),
        start_date: new FormControl(this.project.start_date),
        end_date: new FormControl(this.project.end_date),
        progress: new FormControl(this.project.progress),
        revenue: new FormControl(this.project.revenue),
        client_id: new FormControl(this.project.client_id),
        user_ids: new FormControl(this.project.user_ids)
  
      })
  })
    
  }

}
