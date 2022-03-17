import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Client } from 'src/app/models/client.model';
import { Project } from 'src/app/models/project.model';
import { User } from 'src/app/models/user.model';
import { ClientService } from 'src/app/services/client/client.service';
import { ProjectService } from 'src/app/services/project/project.service';
import { UserService } from 'src/app/services/user/user.service';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  constructor(private route: Router, private service: ProjectService, private fb: FormBuilder, private clientService: ClientService, private userService: UserService) { }


  projects: Project[] = []
  client: Client[] = []
  users: User[] = []


  


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

  getProjects(): void {
    this.service.getProjects().subscribe((res) => {

      this.projects = res.data
      this.service.project = res.data
    })
  }


  getClient() {
    this.clientService.getClients().subscribe((res) => {

      this.client = res.data
      this.service.client = res.data
    })
  }

  getUser() {
    this.userService.getUsers().subscribe((res) => {

      this.users = res.data
      this.service.users = res.data
    })
  }


  addProject() {

    let newProj = this.projectForm.value
    this.service.addProject(newProj).subscribe()
  }

  updateProject(id: number) {

    this.service.currentProject = id
    this.route.navigate(['updateProject', id])
  }

  delProject(id: number) {

    this.service.deleteProject(id).subscribe()
    this.getProjects()
  }

  ngOnInit() {
    this.getClient()
    this.getUser()

  }

}


