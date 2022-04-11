import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  year:number
  month: number
  day: number
  time:any
  @Input() projectTasks: any //array task project passati dal parent
  @Input() projectId: number //id project passato dal parent

  getHistory(id: number) {

    this.pService.getHistory(id).subscribe((res) => {//get alla history
      let data = res

      for (let i = 0; i < data.length; i++) {
        let filterData = data[i];
        // parse dei dati 
        filterData.updated_at = new Date(filterData.updated_at)
        filterData.created_at = new Date(filterData.created_at)
        filterData.data = JSON.parse(filterData.data)
        let eventTask = {
          'name': this.getTaskName(filterData.data.task),
          'id': filterData.id,
          'created_at': filterData.created_at,
          'updated_at': filterData.updated_at,
          'filterData': filterData.data
        }
        // filtro per data odierna e popolo array 
        if (filterData.updated_at.getDate() === this.day) {
          this.dataToday.push(eventTask)
        }
        // filtro per mese corrente e popolo array
        if (filterData.created_at.getMonth() + 1 === this.month) {
        this.dataMonth.push(eventTask)
        }
      }
    })
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

  getDiffDate(dateTask: any){


    let dateT = Math.abs(parseInt((new Date(dateTask).getTime() / 1000).toFixed(0)))
    let diff = this.time - dateT

    let days = Math.floor(diff / 86400);
    let hours = Math.floor(diff / 3600) % 24;
    let minutes = Math.floor(diff / 60) % 60;
    let diffYears = this.year - new Date(dateTask).getFullYear()
    let diffMonth = (this.month -1) - new Date(dateTask).getMonth() 
    if (diffYears > 0) {
      diffMonth += diffYears + 12
    }

    return { 
      'diffMonth':diffMonth, 
      'days':days,   
      'hours':hours,  
      'minutes':minutes,
    }
    
    
  }

  ngOnInit(): void {

    this.time = Math.abs(parseInt((new Date().getTime() / 1000).toFixed(0)))//data  corrente parsata in number
    this.year = new Date().getFullYear() //anno corrente
    this.month = new Date().getMonth() + 1 //mese corrente
    this.day = new Date().getDate() // giorno corrente
    this.getHistory(this.projectId)     
    
    
  }
}
