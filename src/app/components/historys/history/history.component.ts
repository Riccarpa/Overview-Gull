import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Task } from 'src/app/models/task.model';
import { ProjectService } from 'src/app/services/project/project.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  constructor(private pService: ProjectService) { }


  dataToday: any[] = []
  dataMonth: any[] = []
  month: number
  day: number
  @Input() projectTasks: any
  @Input() projectId: number

  getHistory(id: number) {

    this.pService.getHistory(id).subscribe((res) => {
      let data = res

      for (let i = 0; i < data.length; i++) {
        let filterData = data[i];
        filterData.updated_at = new Date(filterData.updated_at)
        filterData.created_at = new Date(filterData.created_at)
        filterData.data = JSON.parse(filterData.data)

        if (filterData.updated_at.getDate() === this.day) {
          this.dataToday.push(
            {
              'name': this.getTaskName(filterData.data.task),
              'id': filterData.id,
              'created_at': filterData.created_at,
              'updated_at': filterData.updated_at,
              'filterData': filterData.data
            }
          )
        }

        if (filterData.created_at.getMonth() + 1 === this.month) {

          this.dataMonth.push(
            {
              'name': this.getTaskName(filterData.data.task),
              'id': filterData.id,
              'created_at': filterData.created_at,
              'updated_at': filterData.updated_at,
              'filterData': filterData.data
            }
          )
        }
      }
    })

    console.log(this.dataMonth);
  }

  getTaskName(id: number) {

    for (let i = 0; i < this.projectTasks.length; i++) {
      let task = this.projectTasks[i];
      if (task.id === id) {
        return task.name
      }
    }
    return id
  }

  ngOnInit(): void {


    this.month = new Date().getMonth() + 1 //mese corrente
    this.day = new Date().getDate() // giorno corrente
    this.getHistory(this.projectId)
  }
}
