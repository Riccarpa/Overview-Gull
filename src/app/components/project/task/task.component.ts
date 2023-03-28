import { Component, Input, OnInit, ViewChild,DoCheck } from '@angular/core';
import { Sprint } from 'src/app/models/sprint.model';
import { Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { TaskService } from 'src/app/services/task/task.service';
import { UserService } from 'src/app/services/user/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from 'src/app/services/project/project.service';
import { SprintService } from 'src/app/services/sprint/sprint.service';
import { ReqInterceptInterceptor } from 'src/app/services/interceptors/req-intercept.interceptor';
import { SprintComponent } from '../sprint/sprint.component';
import { $ } from 'protractor';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import Sortable from 'sortablejs';



@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  @ViewChild(PerfectScrollbarDirective) psContainer: PerfectScrollbarDirective;

  constructor(
    public sprintComponent: SprintComponent,
    private taskService: TaskService,
    private userService: UserService,
    private modalService: NgbModal,
    private projectService: ProjectService,
    private sprintService: SprintService) { }



    
    ngOnInit(): void {

      var sortable = new Sortable(document.getElementById('items'), {
        animation: 150,
        dataIdAttr: 'id',
        ghostClass: 'task-ghost',
        dragClass: 'task-drag',
        onEnd: function (event) {
          var newOrder = sortable.toArray();
          localStorage.setItem('taskOrder',JSON.stringify(newOrder))
        }
      });
      


    for (let i = 0; i < this.sprint.tasks.length; i++) {

      this.sprint.tasks[i]['assigne_name'] = this.getAssignee(this.sprint.tasks[i].assignee_id);

    }
    this.filteredTasks = this.sprint.tasks
    // filtro checkbox
    this.searchControl.valueChanges
      .subscribe(value => {
        this.filerData(value);
      });

    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);

    
  }

  @Input() sprint: any;
  @Input() collaborators: any[];
  @Input() tasks: any[]

  filteredTasks: any
  titleModal: string;
  searchControl: FormControl = new FormControl();
  chatCollection: any[] = [];
  user: any;
  taskName: string;
  currentTask: any;
  currentComment: any;
  send_update: boolean = false
  indexComment: number
  //form control di testo per aggiungere un commento
  commentForm = new FormGroup({
    text: new FormControl('', Validators.required),
  });

  taskForm = new FormGroup({
    name: new FormControl('', Validators.required),
    assignee_id: new FormControl('',),
    status: new FormControl(''),
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    effort: new FormControl('',),
  });

  taskOrder:any

  // creare un comparatore per ordinare i task in base alla end_date con formato dd/mm/yyyy 
  compare(a, b, c, d) {
    b = new Date(d.end_date).getTime()
    a = new Date(c.end_date).getTime()
    // se null return 0
    if (a == null || b == null) {
      return 0;
    } else {
      return a < b ? -1 : a > b ? 1 : 0;
    }
  }

  // comparatore per assignee_id per ordinare i task in base all'assegnatario 
  compareAssignee(a, b, c, d) {
    // funziona con gli id e non con i nomi e cognomi
    a = c.assigne_name
    b = d.assigne_name


    return a < b ? -1 : a > b ? 1 : 0;
  }

  // visualizza nell'html nome e cognome dell'assegnatario del task
  getAssignee(id: number) {

    for (let j = 0; j < this.collaborators?.length; j++) {
      const user = this.collaborators[j];
      if (user.id === id) {
        return user.name + ' ' + user.surname;
      }
    }
    return '-';
  }

  //  visualizza nell'html lo status del task
  getStatus(status: number) {
    if (status == 0) {
      return 'Aperto';
    } else if (status == 1) {
      return 'In corso';
    } else {
      return 'Completato';
    }
  }

  // visualizza nell'html la data di inizio o fine del task
  getDate(status: number, startDate: string, endDate: string) {
    if (status == 0) {
      return '(' + startDate + ')';
    } else if (status == 2) {
      return '(' + endDate + ')';
    } else {
      return '';
    }
  }

  // apre la modale per aggiungere un nuovo task
  openModalAddTask(content: any) {

    this.titleModal = "Aggiungi Task";
    this.taskForm.setValue({
      name: '',
      assignee_id: '',
      status: '',
      start_date: '',
      end_date: '',
      effort: '',
    });

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(() => {
      
      }, () => {
      
      });
  }

  // aggiunge un nuovo task allo sprint
  addTask() {

    if (this.taskForm.status == 'INVALID') {
      this.projectService.warningBar('Task name is required');
    } else {
      const newTask = this.taskForm.value;
      this.taskService.addTask(newTask.name, newTask.assignee_id, newTask.status, newTask.start_date, newTask.end_date, newTask.effort, this.sprint.id)
        .subscribe(() => {
          this.modalService.dismissAll();
          this.taskForm.setValue({
            name: '',
            assignee_id: '',
            status: '',
            start_date: '',
            end_date: '',
            effort: '',
          });
          this.projectService.successBar('Task added successfully');
          this.sprintComponent.ngOnInit()
        });
    }
  }

  // cancella il task selezionato
  deleteTask(id: any, content: any) {
    this.confirm(id, content);
  }

  // richiama la modale per eliminare il task
  confirm(id: any, content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(() => {
        this.taskService.deleteTask(id).subscribe(() => {
          this.projectService.successBar('Task deleted');

          // resfresh page dopo delete
          this.sprintComponent.ngOnInit()
          this.modalService.dismissAll();
        });
      }, () => {
      
      });
  }

  // richiama la modale per modificare il task
  openModalEditTask(id: any, content: any, sprints: any) {
    this.taskService.currentTask = id;
    this.titleModal = "Modifica Task";
 
    for (let i = 0; i < this.tasks.length; i++) {
      let task = this.tasks[i]; //task singolo

      if (task.id === id) {
        this.taskForm.setValue({
          name: task.name,
          assignee_id: task.assignee_id,
          status: task.status,
          start_date: task.start_date,
          end_date: task.end_date,
          effort: task.effort,
        });
      }
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(() => {
    
      }, () => {
       
      });
  }

  // modifica il task selezionato
  editTask() {
    if (this.taskForm.status == 'INVALID') {
      this.projectService.warningBar('All fileds are required');
    } else {
      const task = this.taskForm.value;
      let assignee_id = task.assignee_id != 'null' ? task.assignee_id : null;
      this.taskService.updateTask(task.name, assignee_id, task.status, task.start_date, task.end_date, task.effort)
        .subscribe(() => {
          this.modalService.dismissAll();
          this.projectService.successBar('Task edited successfully');
          this.sprintComponent.ngOnInit()
        });
    }
  }

  // filtra i task, rimuovendo i task completati, in base al valore della checkbox (true/false) 
  filerData(val: boolean) {
    if (!val) {

      return this.filteredTasks = this.sprint.tasks
    } else {
      const rows = this.sprint.tasks.filter((task: any) => {

        if (task.status == 2) {
          return false;
        } else {
          return true;
        }
      })
      this.filteredTasks = rows;
    }
  }

  // apre modale chat per il task selezionato 
  openChatModal(content: any, task: any) {
    this.chatCollection = task.comments
    this.taskName = task.name;
    this.currentTask = task

    for (let i = 0; i < this.chatCollection.length; i++) {
      let chat = this.chatCollection[i];

      if (chat.user.picture && chat.user.picture.includes('.png')) {
        chat.user.picture = `${environment.apiURL2}/images/users/${chat.user.id}.png?r=${this.projectService.randomNumber()}`
      } else {
        chat.user.picture = `${environment.apiURL2}/images/users/${chat.user.id}.jpg?r=${this.projectService.randomNumber()}`
      }
    }

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg' })
      .result.then(() => {
      }, () => {
          // window.location.reload();
        }
      );


  }

  // delete comment from task
  deleteComment(idComment: number, id: number) {

    this.taskService.deleteComment(idComment).subscribe(() => {
      this.projectService.successBar('Comment deleted');
      this.chatCollection.splice(id, 1);
    });
  }

  // update comment from task (popola il form con i dati del commento selezionato )
  updateComment(currentComment: number, text: string, id: number) {
    this.send_update = true;
    this.currentComment = currentComment;
    this.indexComment = id;
    this.commentForm.value.text = text;
    let input = document.getElementById('message') as HTMLInputElement;
    input.value = text;
  }

  // invia il commento modificato e richiama la patch
  sendUpdatedComment() {

    if (this.commentForm.status == 'INVALID') {
      this.projectService.warningBar('Message is required');
    } else {
      this.taskService.patchComment(this.currentComment.id, this.commentForm.value.text).subscribe(() => {
        this.projectService.successBar('Comment updated');
        this.send_update = false;
        this.chatCollection[this.indexComment].text = this.commentForm.value.text;
        this.commentForm.setValue({
          text: '',
        });
        let input = document.getElementById('message') as HTMLInputElement;
        input.value = '';

      });
    }
  }


  //send message (post) to task
  sendMessage(event: number) {
    if (this.commentForm.status == 'INVALID') {
      this.projectService.warningBar('Message is required');
    } else {

      const content = this.commentForm.value.text;
      this.taskService.postComment(this.currentTask.id, content).subscribe((res) => {
        this.projectService.successBar('Comment sent')

        let msg = {
          'id': res.data?.id,
          'task_id': res.data?.task_id,
          'user_id': res.data?.user_id,
          'text': content,
          'created_at': res.data?.created_at,
          'user': {
            'id': res.data?.user.id,
            'name': res.data?.user.name,
            'picture': res.data?.user.picture ? `${environment.apiURL2}/images/users/${res.data?.user.id}.png?r=${this.projectService.randomNumber()}` : `${environment.apiURL2}/images/users/${res.data?.user.id}.jpg?r=${this.projectService.randomNumber()}`,
          }
        }
        this.chatCollection.push(msg);
      });
      this.commentForm.setValue({
        text: '',
      });

      let input = document.getElementById('message') as HTMLInputElement;
      input.value = '';
    }
  }

  // reset form 
  dismiss() {
    this.send_update = false;
    this.commentForm.setValue({
      text: '',
    });
    let input = document.getElementById('message') as HTMLInputElement;
    input.value = '';
  }


  checkDateIsPast(date: Date,status:Number): boolean {
    let dateFormatted = moment(date).format("YYYY-MM-DD")
    const currentDate = moment().format("YYYY-MM-DD");
    if(dateFormatted < currentDate || status == 2 ){
      return true ;
    }
  }


  patchOrder(){
    setTimeout(() => {
      this.taskService.patchTaskOrder(JSON.parse(localStorage.getItem('taskOrder')),this.taskName).subscribe(res=>{
        console.log(res)
      })
    }, 1000);
  }


}


