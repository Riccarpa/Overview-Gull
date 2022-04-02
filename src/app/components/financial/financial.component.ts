import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivitiesService } from 'src/app/services/activities/activities.service';
import { FinancialService } from 'src/app/services/financial/financial.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.scss']
})
export class FinancialComponent implements OnInit {

  constructor(private fService:FinancialService,private uService:UserService,private route:ActivatedRoute,private aService:ActivitiesService) { }
  id = this.route.snapshot.paramMap.get('id');
  user:any
  activities:any
  monthlyLogs:any
  month:any
  year:any
  currMonthLog:any

  ngOnInit(): void {
    this.month=new Date().getMonth() +1
    this.year=new Date().getFullYear()

    this.uService.retrieveUser(this.id).subscribe((res:any)=>{
      this.user = res.data;
      console.log('user',this.user)
    })

    this.aService.getActivities().subscribe((res:any)=>{
      this.activities = res.data;
      console.log('activities',this.activities)
    })

    this.fService.getMonthlyLogs(this.id).subscribe((res)=>{
      this.monthlyLogs = res.data;
      console.log('monthlyLog',this.monthlyLogs)
      this.getCurrMonthLog();
    })

    
    
  }
  
  getCurrMonthLog(){
    if(this.monthlyLogs[this.year] && this.monthlyLogs[this.year][this.month] ){
      this.currMonthLog =  this.monthlyLogs[this.year][this.month]
      console.log('CurrMonth',this.currMonthLog)
    }else{
      
      let date = `${this.year.toString()}-0${this.month.toString()} `
      console.log(parseInt(this.id))
      this.fService.createMonthlyLog(parseInt(this.id),date).subscribe((res)=>{
        this.currMonthLog = res.data;
      })
    }

  }

}
