import { Component, OnInit,Input } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { FinancialService } from 'src/app/services/financial/financial.service';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit {

  constructor(private fb:FormBuilder,private fService:FinancialService) { }
  @Input() date : any
  @Input() day : any
  @Input() activities :any
  smartWorking:any
  patchArr:any
  OldActivities:any
  loadingButtons = [
    {
      name: 'secondary',
      loading: false,
    }
  ]

  ngOnInit(): void {
   this.retrieveOldActivities()
  }

  // acrivities Form Array
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

  // patch activity
  saveActivity(btn){
    btn.loading = true;
    for (let i = 0; i < this.activitiesArray.value.length; i++) {
      const element = this.activitiesArray.value[i];
      element.activity_id = parseInt(element.activity_id)
    }
     this.patchArr = {
      "day": this.date,
      "smartworking":this.smartWorking== undefined ?  this.day.smartworking : this.smartWorking,
      "activity_days_array":[... this.OldActivities,...this.activitiesArray.value]
    }  
    this.fService.patchActivities(this.day.monthly_log_id,this.patchArr).subscribe((res)=>{
      console.log(res)
      btn.loading = false;
    })
    
  }


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







 

}
