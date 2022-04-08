import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project/project.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  constructor(private pService:ProjectService) { }

  historyData:any
  @Input() projectId:number
  getHistory(id:number){

      this.pService.getHistory(id).subscribe((res)=>{

        this.historyData = res.data
      })
  }

  ngOnInit(): void {


  }

}
