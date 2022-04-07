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

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  constructor(private taskService: TaskService, private userService: UserService, private modalService: NgbModal, private projectService: ProjectService, private sprintService: SprintService) { }

  ngOnInit(): void {
    // recupera tutti i task dello sprint
    this.currentTasksIds = this.sprint.task_ids;
    this.getTasks();

    // filtro checkbox
    this.searchControl.valueChanges
      .subscribe(value => {
        this.filerData(value);
      });

    // recupera tutti gli utenti e filtra solo i collaboratori del progetto
    this.userService.getUsers().subscribe((res) => {
      this.users = res.data;
      this.collaborators = this.users.filter((user) => {
        if (this.collaboratorsIds.includes(user.id)) {
          return true;
        } else {
          return false;
        }
      });
    });

  }

  @Input() sprint: Sprint;
  @Input() collaboratorsIds: number[];

  allTasks: Task[];
  currentTasksIds: number[];
  currentTasks: Task[];
  users: User[];
  titleModal: string;
  collaborators: User[];
  task: Task;
  searchControl: FormControl = new FormControl();
  filteredTasks: Task[];

  taskForm = new FormGroup({
    name: new FormControl('', Validators.required),
    assignee_id: new FormControl(''),
    status: new FormControl('', Validators.required),
    start_date: new FormControl('', Validators.required),
    end_date: new FormControl('', Validators.required),
    effort: new FormControl(''),
  });

  // recupera tutti i task e li filtra per sprint
  getTasks() {
    this.taskService.getTasks().subscribe((res) => {
      this.allTasks = res.data;
      this.currentTasks = this.allTasks.filter((task) => {
        if (this.currentTasksIds.includes(task.id)) {
          return true;
        } else {
          return false;
        }
      });
      this.filteredTasks = this.currentTasks;
    });
  }

  // visualizza nell'html nome e cognome dell'assegnatario del task
  getAssignee(id: number) {
    for (let i = 0; i < this.users?.length; i++) {
      if (this.users[i].id == id) {
        return this.users[i].name + ' ' + this.users[i].surname;
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
        console.log('ok');
      }, () => {
        console.log('annullato');
      });
  }

  // aggiunge un nuovo task allo sprint
  addTask() {
    if (this.taskForm.status == 'INVALID') {
      this.projectService.warningBar('Tutti i campi sono obbligatori');
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
          this.sprintService.getSprint(this.sprint.id).subscribe((res) => {
            this.currentTasksIds = res.data.task_ids;
            this.getTasks();
          });
          this.projectService.successBar('Task aggiunto con successo!');
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
          this.projectService.successBar('Task eliminato');
          this.sprintService.getSprint(this.sprint.id).subscribe((res) => {
            this.currentTasksIds = res.data.task_ids;
            this.getTasks();
          });
          this.modalService.dismissAll();
        });
      }, () => {
        console.log('annullato');
      });
  }

  // richiama la modale per modificare il task
  openModalEditTask(id: any, content: any) {
    this.taskService.currentTask = id;
    this.titleModal = "Modifica Task";
    this.taskService.getTask(id).subscribe((res) => {
      this.task = res.data;

      this.taskForm.setValue({
        name: this.task.name,
        assignee_id: this.task.assignee_id,
        status: this.task.status,
        start_date: this.task.start_date,
        end_date: this.task.end_date,
        effort: this.task.effort,
      });
    })

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(() => {
        console.log('ok');
      }, () => {
        console.log('annullato');
      });
  }

  // modifica il task selezionato
  editTask() {
    if (this.taskForm.status == 'INVALID') {
      this.projectService.warningBar('Tutti i campi sono obbligatori');
    } else {
      const task = this.taskForm.value;
      this.taskService.updateTask(task.name, task.assignee_id, task.status, task.start_date, task.end_date, task.effort)
        .subscribe(() => {
          this.modalService.dismissAll();
          this.projectService.successBar('Task modificato con successo!');
          this.sprintService.getSprint(this.sprint.id).subscribe((res) => {
            this.currentTasksIds = res.data.task_ids;
            this.getTasks();
          });
        });
    }
  }

  // filtra i task, rimuovendo i task completati, in base al valore della checkbox (true/false) 
  filerData(val: boolean) {
    if (!val) {
      return this.filteredTasks = this.currentTasks;
    } else {
      const rows = this.currentTasks.filter((task) => {
        if (task.status == 2) {
          return false;
        } else {
          return true;
        }
      });
      this.filteredTasks = rows;
    }
  }

}
