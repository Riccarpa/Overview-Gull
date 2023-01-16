import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Issue } from 'src/app/models/issue.model';
import { Project } from 'src/app/models/project.model';
import { ProjectService } from 'src/app/services/project/project.service';
import { environment } from 'src/environments/environment';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.scss']
})
export class IssueComponent implements OnInit {

  constructor(private pService: ProjectService, private modal: NgbModal, private fb: FormBuilder,private router:Router) { }

  @ViewChild(PerfectScrollbarDirective) psContainer: PerfectScrollbarDirective;


  // issues: Issue[]
  @Input() project: Project
 
  user: any
  formNewIssue = this.fb.group({
    name: [''],
    description: [''],
  })

  ngOnInit(): void {
    let user = JSON.parse(localStorage.getItem('user'))
    this.user = user
    if (this.project == undefined && this.pService.currentProject != undefined) {
      this.project = this.pService.currentProject
    } else if (this.project == undefined && this.pService.currentProject == undefined) {
      this.router.navigate(['home/project'])
    }
    console.log(this.project);
    
    
  }

  open(content) {
    this.modal.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then((result) => {
        console.log(result)
      })
    }
    
    createIssue() {
      this.pService.createIssue(this.formNewIssue.value, this.project.id).subscribe(
        (res) => {
          this.pService.successBar('Issue creato con successo')
          this.modal.dismissAll()
          this.formNewIssue.reset()
        // retrive project 
        this.pService.getProject(this.project.id).subscribe(
          (res) => {
            this.project = res?.data
          })
      },
      (err) => {
        console.log(err)
      })
  }
}
