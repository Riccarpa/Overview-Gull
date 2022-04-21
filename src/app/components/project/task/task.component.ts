import { Component, Input, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  constructor(
    public sprintComponent: SprintComponent, 
    private taskService: TaskService, 
    private userService: UserService, 
    private modalService: NgbModal, 
    private projectService: ProjectService, 
    private sprintService: SprintService) { }

  ngOnInit(): void {

    this.filteredTasks = this.sprint.tasks
    // filtro checkbox
    this.searchControl.valueChanges
      .subscribe(value => {
        this.filerData(value);
      });
  }

  @Input() sprint: any;
  @Input() collaborators: any[];
  @Input() tasks: any[]
 
  filteredTasks:any
  titleModal: string;
  searchControl: FormControl = new FormControl();


  taskForm = new FormGroup({
    name: new FormControl('', Validators.required),
    assignee_id: new FormControl(''),
    status: new FormControl('', Validators.required),
    start_date: new FormControl('', Validators.required),
    end_date: new FormControl('', Validators.required),
    effort: new FormControl(''),
  });


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

    this.titleModal = "Add Task";
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
        console.log('Ok');
      }, () => {
        console.log('Dismissed');
      });
  }

  // aggiunge un nuovo task allo sprint
  addTask() {

    if (this.taskForm.status == 'INVALID') {
      this.projectService.warningBar('All fields are required');
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
        console.log('Dismissed');
      });
  }

  // richiama la modale per modificare il task
  openModalEditTask(id: any, content: any, sprints: any) {
    this.taskService.currentTask = id;
    this.titleModal = "Edit Task";
    console.log(this.tasks);

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
        console.log('Ok');
      }, () => {
        console.log('Dismissed');
      });
  }

  // modifica il task selezionato
  editTask() {
    if (this.taskForm.status == 'INVALID') {
      this.projectService.warningBar('All fileds are required');
    } else {
      const task = this.taskForm.value;
      this.taskService.updateTask(task.name, task.assignee_id, task.status, task.start_date, task.end_date, task.effort)
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
      const rows = this.sprint.tasks.filter((task:any) => {

        if (task.status == 2) {
          return false;
        } else {
          return true;
        }
      })
      this.filteredTasks = rows;
    }
  }

}


