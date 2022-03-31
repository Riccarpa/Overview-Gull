import { Component, Input, OnInit } from '@angular/core';
import { Sprint } from 'src/app/models/sprint.model';
import { Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { TaskService } from 'src/app/services/task/task.service';
import { UserService } from 'src/app/services/user/user.service';
@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  constructor(private taskService: TaskService, private userService: UserService) { }

  ngOnInit(): void {
    this.currentTasksIds = this.sprint.task_ids;

    this.taskService.getTasks().subscribe((res) => {
      this.allTasks = res.data;
      this.currentTasks = this.allTasks.filter((task) => {
        if (this.currentTasksIds.includes(task.id)) {
          return true;
        } else {
          return false;
        }
      });
    });

    this.userService.getUsers().subscribe((res) => {
      this.users = res.data;
    });

  }

  @Input() sprint: Sprint;

  allTasks: Task[];
  currentTasksIds: number[];
  currentTasks: Task[];
  users: User[];

  getAssignee(id: number) {
    for (let i = 0; i < this.users?.length; i++) {
      if (this.users[i].id == id) {
        return this.users[i].name + ' ' + this.users[i].surname;
      }
    }
    return '-';
  }

  getStatus(status: number) {
    if (status == 0) {
      return 'Aperto';
    } else if (status == 1) {
      return 'In corso';
    } else {
      return 'Completato';
    }
  }

  getDate(status: number, startDate: string, endDate: string) {
    if (status == 0) {
      return '(' + startDate + ')';
    } else if (status == 2) {
      return '(' + endDate + ')';
    } else {
      return '';
    }
  }
}
