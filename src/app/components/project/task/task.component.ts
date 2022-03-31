import { Component, Input, OnInit } from '@angular/core';
import { Sprint } from 'src/app/models/sprint.model';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task/task.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  constructor(private taskService: TaskService) { }

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

  }

  @Input() sprint: Sprint;

  allTasks: Task[];
  currentTasksIds: number[];
  currentTasks: Task[];
}
