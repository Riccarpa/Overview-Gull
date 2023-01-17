import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectConfig } from '@ng-select/ng-select';
import { CropperSettings } from 'ngx-img-cropper';
import { Toast } from 'ngx-toastr';
import { Issue } from 'src/app/models/issue.model';
import { Project } from 'src/app/models/project.model';
import { ProjectService } from 'src/app/services/project/project.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.scss']
})
export class IssueDetailComponent implements OnInit {
  
  constructor(
    private projectService: ProjectService, 
    private modal: NgbModal, 
    private fb: FormBuilder, 
    private config: NgSelectConfig, 
    private pService:ProjectService) {
      this.cropperSettings = new CropperSettings();
      this.cropperSettings.cropperDrawSettings.lineDash = true;
      this.cropperSettings.cropperDrawSettings.dragIconStrokeWidth = 0;
      this.data = {};
    }
    
    
    
  @Input() issue: Issue;
  @Input() user: any;
    
  data: any;
  cropperSettings: CropperSettings;
  formIssue = this.fb.group({
    name: [''],
    description: [''],
    status: [''],
    // priority: [''],
  })

  commentForm = this.fb.group({
    text: [''],
  })

  status = [
    {
      id: 0,
      viewValue: 'Nullo'
    },
    {
      id: 1,
      viewValue: 'In corso'
    },
    {
      id: 2,
      viewValue: 'Completato'
    },
    {
      id: 3,
      viewValue: 'Non Replicato'
    },
    {
      id: 4,
      viewValue: 'Respinto'
    },
  ]

  priority = [
    // { id: 0, viewValue: 'Nullo' },
    { id: 1, viewValue: 'Bassa' },
    { id: 2, viewValue: 'Media' },
    { id: 3, viewValue: 'Alta' },
    { id: 4, viewValue: 'Urgente' },
  ]
  selectedStatus : number
  selectedPriority: number
  isEditable: boolean = false

  ngOnInit(): void {
    if (this.issue && this.user) {
      this.selectedStatus = this.issue.status
      this.formIssue.patchValue({
        name: this.issue.name,
        description: this.issue.description,
        status: this.issue.status,
      })
      if (this.issue.user.picture && this.issue.user.picture.includes('.png')) {
        this.issue.user.picture = `${environment.apiURL2}/images/users/${this.issue.user.id}.png?r=${this.projectService.randomNumber()}`
      } else {
        this.issue.user.picture = `${environment.apiURL2}/images/users/${this.issue.user.id}.jpg?r=${this.projectService.randomNumber()}`
      }
    }
  }

  changeStatus(e, arrayId, issue) {
    let status = e.id

    this.projectService.updateIssue(issue, status).subscribe(
      res => {
        this.issue.name = res.data.name
        this.issue.status = res.data.status
        this.issue.description = res.data.description
      }, error => {
        console.log(error);
        this.formIssue.patchValue({
          name: issue?.name,
          description: issue?.description,
          status: issue?.status,
        })
      }
      )
  }

  changePriority(e, arrayId, issue) {
  
    let priority = e.id

    this.formIssue.patchValue({
      name: issue?.name,
      description: issue?.description,
      status: issue?.status,
      // priority: priority,
    })

    //todo da cancellare solo per debug
    // this.issue['priority'] = priority

    // this.projectService.updateIssue(issue, priority).subscribe(
    //   res => {
    //     this.issue.name = res.data.name
    //     this.issue.status = res.data.status
    //     this.issue.description = res.data.description
    //     this.issue.priority = res.data.priority
    //   })
  }

  // reset input value to last value
  resetInputValue() {
    this.formIssue.patchValue({
      name: this.issue?.name,
      description: this.issue?.description,
    })
  }

  deleteIssue() {
    this.projectService.deleteIssue(this.issue.id).subscribe(
      res => {
        this.modal.dismissAll()
        this.pService.successBar('Issue eliminato con successo')
        setTimeout(() => {
          window.location.reload()
        }, 3000);
      })
  }

  updateName() {
    // this.issue.description = this.formIssue.value.description
    this.projectService.updateIssue(this.issue, this.issue.status).subscribe(
      res => {
        this.issue.description = res.data.description
        this.issue.name = res.data.name
        this.pService.successBar('Nome aggiornato con successo')
      }, error => {
        console.log(error);
        this.resetInputValue()
      }
      )
  }

  open(content) {
    this.fixImg();
    this.modal.open(content, { ariaLabelledBy: 'modal-basic-title',centered: true, size: 'lg' })
    .result.then((result) => {
      console.log(`Closed with: ${result}`);
      
    }, (reason) => {
      
    }).catch(error => {
      console.log(error);
    });
  }
  
  fixImg() {
    for (let i = 0; i < this.issue.comments.length; i++) {
      let chat = this.issue.comments[i];

      if (chat.user.picture && chat.user.picture.includes('.png')) {
        chat.user.picture = `${environment.apiURL2}/images/users/${chat.user.id}.png?r=${this.projectService.randomNumber()}`;
      } else {
        chat.user.picture = `${environment.apiURL2}/images/users/${chat.user.id}.jpg?r=${this.projectService.randomNumber()}`;
      }
    }
  }

  close() {
    this.modal.dismissAll()
  }

  // addCommentToIssue
  sendMessage(e) {
    if (this.commentForm.status == 'INVALID') {
      this.projectService.warningBar('Message is required');
    }else {
      this.projectService.addCommentToIssue(this.commentForm.value, this.issue.id).subscribe(
        res => {
          console.log(res);
          this.issue.comments.push(res.data)
          this.fixImg()
          this.commentForm.patchValue({
            text: '',
          })
        })
    }
  }
  file:any
  updateImg(file: any) {
    
    this.file = file[0] 
    if (this.file) {
      this.projectService.addFileToIssue(this.file, this.issue.id).subscribe(
        res => {
      
          console.log(res);
          
        }, error => {
          console.log(error);
        }
      )
    }
      

      // this.uService.updateImage(this.profileForm.value.picture_data, this.user.id).subscribe(res => {

      //   this.user.picture = `${environment.apiURL2}/images/users/${this.user.id}.png?r=${this.pService.randomNumber()}`
      //   this.toastr.success('Image saved successfully')
      // })
    // }
  }
}
