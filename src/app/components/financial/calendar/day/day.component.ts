import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FinancialService } from 'src/app/services/financial/financial.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit {

  constructor(private fb:FormBuilder,private fService:FinancialService,private toastr:ToastrService) {
    this.clickEventSubsctiption = this.fService.getClickEvent().subscribe(()=>{
      this.save()
    })
  }
  @Input() date : any
  @Input() day : any
  @Input() activities :any
  @Output()childsData:EventEmitter<any> = new EventEmitter()
  clickEventSubsctiption:Subscription;
  smartWorking:any
  patchArr:any
  OldActivities:any
   
  
  ngOnInit(): void {
   this.retrieveOldActivities()
  }

  // new acrivities Form Array
  activitiesForm=this.fb.group({
    activitiesArray:this.fb.array([])
  })
  get activitiesArray(){
    return this.activitiesForm.controls['activitiesArray'] as FormArray;
  }
  addActivity(){
    const activityForm=this.fb.group({
      activity_id:[],
      hours_spent:[],
      activity_type:['generic']
    })
    this.activitiesArray.push(activityForm);
  }
  deleteActivity(i){
    this.activitiesArray.removeAt(i)
  }
  
  // catch smartWorking value
  smartAssign(e){
    if(e.target.checked==true){
      this.smartWorking = 1
    }else{
      this.smartWorking = 0;
    }
  }
  
  // emit activity data for parent component
  
  save(){
    for (let i = 0; i < this.activitiesArray.value.length; i++) {
      const element = this.activitiesArray.value[i];
      element.activity_id = parseInt(element.activity_id)
    }
    
    
    this.patchArr = {
      "day": this.date,
      "smartworking":this.smartWorking== undefined ?  this.day.smartworking : this.smartWorking,
      "activity_days_array":[... this.OldActivities,...this.activitiesArray.value]
    }  
    
    if(this.patchArr.activity_days_array.length !== 0){
      for (let i = 0; i < this.patchArr.activity_days_array.length; i++) {
        let element = this.patchArr.activity_days_array[i];
        if(element.hours_spent==0){
          this.patchArr.activity_days_array.splice(i,1)
          i--
        }
      }
      this.childsData.emit(this.patchArr)
    }
    
  }
  
  // saveActivity(btn){
    //   btn.loading = true;
    //   for (let i = 0; i < this.activitiesArray.value.length; i++) {
      //     const element = this.activitiesArray.value[i];
      //     element.activity_id = parseInt(element.activity_id)
      //   }
      
      
      //    this.patchArr = {
        //     "day": this.date,
        //     "smartworking":this.smartWorking== undefined ?  this.day.smartworking : this.smartWorking,
        //     "activity_days_array":[... this.OldActivities,...this.activitiesArray.value]
        //   }  
        
        
        //   this.fService.patchActivities(this.day.monthly_log_id,this.patchArr).subscribe((res)=>{
          //     console.log(res)
          //     btn.loading = false;
  //     this.toastr.success('Activity saved succefully')
  //   },(error)=>{
  //     btn.loading = false;
  //     this.toastr.error(error.error.message);
  //   })
  
  
  // }
  // loadingButtons = [
  //   {
  //     name: 'secondary',
  //     loading: false,
  //   }
  // ]
  
  
  // prepare patch array with old activities
  retrieveOldActivities(){
    let oldActivities = [];
    for (let i = 0; i < this.day.activity_days_array.length; i++) {
      let e = this.day.activity_days_array[i];
      let obj = {
        "hours_spent":e.hours_spent,
        "activity_type": 'generic',
        "activity_id":e.activity_id 
      }
      oldActivities.push(obj)
      
    }
    this.patchArr = [{
      "day": this.date,
      "smartworking":this.smartWorking | this.day.smartworking,
      "activity_days_array":oldActivities
    }]

    this.OldActivities = oldActivities
  }

// detect changes and set new values for oldActivities 

onSelectChange(select,j){
  
  for (let i = 0; i < this.OldActivities.length; i++) {
    const element = this.OldActivities[i];
    if(i==j){
      element.activity_id = select
    }
  }
  
}
onInputChange(input,j){
 
  for (let i = 0; i < this.OldActivities.length; i++) {
    const element = this.OldActivities[i];
    if(i==j){
      element.hours_spent = input
    }
  }
}

deleteOldActivity(j){

  for (let i = 0; i < this.OldActivities.length; i++) {
    const element = this.OldActivities[i];
    if(i==j){
     this.OldActivities.splice(i, 1)
    }
  }
  for (let i = 0; i < this.day.activity_days_array.length; i++) {
    const element = this.day.activity_days_array[i];
    if(i==j){
     this.day.activity_days_array.splice(i, 1)
    }
  }
  
}






 

}
