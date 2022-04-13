import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { el } from 'date-fns/locale';
import { ToastrService } from 'ngx-toastr';
import { format } from 'path';
import { element } from 'protractor';
import { ActivitiesService } from 'src/app/services/activities/activities.service';
import { FinancialService } from 'src/app/services/financial/financial.service';
import { ReqInterceptInterceptor } from 'src/app/services/interceptors/req-intercept.interceptor';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.scss']
})
export class FinancialComponent implements OnInit {

  constructor(private inter:ReqInterceptInterceptor,private toastr:ToastrService,private fService:FinancialService,private uService:UserService,private route:ActivatedRoute,private aService:ActivitiesService) {

    this.allActivities = []
   }
  id = this.route.snapshot.paramMap.get('id');
  user:any
  activities:any
  monthlyLogs:any
  month:any
  year:any
  currMonthLog:any
  days:any
  monthAndYear:any
  allActivities:Array<Object>
  isSaved=false
   isAdmin:boolean
 

  ngOnInit(): void {
    this.month=new Date().getMonth() +1
    this.year=new Date().getFullYear()

    this.uService.retrieveUser(this.id).subscribe((res:any)=>{
      this.user = res.data;
      
    },(error)=>{
      this.toastr.error(error.error.message);
    })

    this.aService.getActivities().subscribe((res:any)=>{
      this.activities = res.data;
     
    },(error)=>{
      this.toastr.error(error.error.message);
    })

    if (this.inter.takeRole().role !== 1) {
      this.isAdmin = false
      this.fService.getUserMonthlyLogs().subscribe((res) => {
        this.monthlyLogs = res.data;
        
        this.getCurrMonthLog();
      })
    }else{
      this.isAdmin = true
      this.fService.getMonthlyLogs(this.id).subscribe((res)=>{
        this.monthlyLogs = res.data;
     
        this.getCurrMonthLog();
      })
    }
    

  }
  
  
  getCurrMonthLog(){
   

    if(this.monthlyLogs[this.year] && this.monthlyLogs[this.year][this.month] ){
      this.currMonthLog =  this.monthlyLogs[this.year][this.month]
      console.log('currMonthLogs',this.currMonthLog)
      this.days =  this.monthlyLogs[this.year][this.month].daily_logs_array
      console.log(this.monthlyLogs)
    }else{
      if(this.month<10){
        var date = `${this.year.toString()}-0${this.month.toString()} `
      }else{
        var date = `${this.year.toString()}-${this.month.toString()} `
      }
     
      if (!this.isAdmin) {
        this.fService.createMonthlyLog(parseInt(this.id),date).subscribe((res)=>{
          this.currMonthLog = res.data;
          this.days =  res.data.daily_logs_array
          this.fService.getUserMonthlyLogs().subscribe((res) => {
            this.monthlyLogs = res.data;
          })},(error)=>{
          this.toastr.error(error.error.message);})
     
      }else{
        this.fService.createMonthlyLogforAdmin(parseInt(this.id),date).subscribe((res)=>{
          this.currMonthLog = res.data;
          this.days =  res.data.daily_logs_array
          this.fService.getMonthlyLogs(this.id).subscribe((res) => {
            this.monthlyLogs = res.data;
          })},(error)=>{
          this.toastr.error(error.error.message);})
       
      }
    }

  }
  

  prevMonth(){
    this.days = null
    if(this.month<=1){
      this.month=12
      this.year = this.year -1
    }else{

      this.month =this.month-1
    }
 
    this.getCurrMonthLog();
    
  }
  nextMonth(){
    this.days = null

    if(this.month>=12){
      this.month=1
      this.year= this.year +1
    }else{
        this.month= this.month+1
      }
   
    this.getCurrMonthLog();

  }

  // child activities data trigger and catcher
  
  save(){
    this.fService.sendClickEvent();
    this.isSaved = true
  }
  childsData(data:object){
    this.allActivities.push(data)
  }

   // all activities patch 
   
  confirm(){
    this.fService.patchActivities(this.currMonthLog.id,this.allActivities).subscribe((res)=>{
      this.toastr.success('Activities saved succefully', 'Success!', {progressBar: true});
      setTimeout(() => {
        window.location.reload()
      }, 1500);
    },(error)=>{
      this.allActivities = []
      this.isSaved = false
      this.toastr.error(error.error.message);
    })
  }

}
