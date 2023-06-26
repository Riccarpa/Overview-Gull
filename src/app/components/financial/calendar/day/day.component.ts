import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FinancialService } from 'src/app/services/financial/financial.service';
import { Subscription } from 'rxjs';
import Holidays from 'date-holidays';
import { type } from 'os';
@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit {

  constructor(private fb: FormBuilder, private fService: FinancialService, private toastr: ToastrService) {
    this.clickEventSubsctiption = this.fService.getClickEvent().subscribe(() => {
      this.save()
    })
    this.addActivities = this.fService.getAddClickEvent().subscribe((data) => {
      let activity = data.activity
      let days = data.days
      if (days.includes(this.day.id)) {
        days.forEach(element => {
          if (element == this.day.id) {
            this.activitiesArray.push(this.fb.group({
              activity_id: activity.activity_id,
              hours_spent: activity.hours_spent,
              activity_type: activity.activity_type
            }))
          }
        });
      }
      // checked = false id = bulkCheckbox
      let bulkCheckbox = document.querySelectorAll('#bulkCheckbox')
      bulkCheckbox.forEach(element => {
        element['checked'] = false
      });
    })

    this.fService.getSelectAllDaysEvent().subscribe((days) => {
      this.dayIds = []
      if (days.includes(this.day.id)) {
        this.dayIds.push(this.day.id)
      }
  
    })
    
}
@Input() date: any
@Input() day: any
@Input() activities: any
@Input() projects: any
@Output() childsData: EventEmitter<any> = new EventEmitter()
@Output() isChecked: EventEmitter<any> = new EventEmitter()
clickEventSubsctiption: Subscription;
addActivities: Subscription;
smartWorking: any
patchArr: any
OldActivities: any
isProject: boolean
year: any
month: any
dayIds: any[] = []


ngOnInit(): void {
  this.retrieveOldActivities()
}

// new acrivities Form Array
activitiesForm = this.fb.group({
  activitiesArray: this.fb.array([])
})
  get activitiesArray() {
  return this.activitiesForm.controls['activitiesArray'] as FormArray;
}
addActivity() {
  const activityForm = this.fb.group({
    activity_id: [],
    hours_spent: [],
    activity_type: [] // generic or project 
  })
  this.activitiesArray.push(activityForm);
}

// addActivitiesBulk() {


deleteActivity(i) {
  this.activitiesArray.removeAt(i)
}

// catch smartWorking value
smartAssign(e) {
  if (e.target.checked == true) {
    this.smartWorking = 1
  } else {
    this.smartWorking = 0;
  }
}

// emit activity data for parent component

save() {
  for (let i = 0; i < this.activitiesArray.value.length; i++) {
    const element = this.activitiesArray.value[i];
    element.activity_id = parseInt(element.activity_id)
    element.hours_spent = parseInt(element.hours_spent)
    
  }

  this.patchArr = {
    "day": this.date,
    "smartworking": this.smartWorking == undefined ? this.day.smartworking : this.smartWorking,
    "activity_days_array": [... this.OldActivities, ...this.activitiesArray.value]
  }

  if (this.patchArr.activity_days_array.length !== 0) {
    for (let i = 0; i < this.patchArr.activity_days_array.length; i++) {
      let element = this.patchArr.activity_days_array[i];
      if (element.hours_spent == 0) {
        this.patchArr.activity_days_array.splice(i, 1)
        i--
      }
    }
    
    this.childsData.emit(this.patchArr)
  }
}

addDayToParentArray(day) {
  this.isChecked.emit(this.day.id)
}

// prepare patch array with old activities
retrieveOldActivities() {
  let oldActivities = [];
  for (let i = 0; i < this.day.activity_days_array.length; i++) {
    let e = this.day.activity_days_array[i];

    let obj = {
      "hours_spent": e.hours_spent,
      "activity_type": e.activity_type == 'App\\Activity' ? 'generic' : 'project',// set activity type
      "activity_id": e.activity_id
    }
    oldActivities.push(obj)

  }
  this.patchArr = [{
    "day": this.date,
    "smartworking": this.smartWorking | this.day.smartworking,
    "activity_days_array": oldActivities
  }]

  this.OldActivities = oldActivities
}

  checkType(event,i){
    let type = event.target.selectedOptions[0].type
    this.activitiesArray.value[i].activity_type = type
    this.activitiesForm.controls['activitiesArray'].setValue(this.activitiesArray.value) 
  }

  checkIsProject(i){
    let type = this.activitiesArray.value[i].activity_type
    return type
  }


// detect changes and set new values for oldActivities 

onSelectChange(idValue, index, event) { 

  for (let i = 0; i < this.OldActivities.length; i++) {
    const element = this.OldActivities[i];
    if (i == index) {
      this.day.activity_days_array[i].activity_id = idValue
      element.activity_id = idValue
      element.activity_type = event.target.selectedOptions[0].type

    }
  }

}
onInputChange(input, j) {

  for (let i = 0; i < this.OldActivities.length; i++) {
    const element = this.OldActivities[i];
    if (i == j) {
      element.hours_spent = input
    }
  }
}

deleteOldActivity(j) {

  for (let i = 0; i < this.OldActivities.length; i++) {
    const element = this.OldActivities[i];
    if (i == j) {
      this.OldActivities.splice(i, 1)
    }
  }
  for (let i = 0; i < this.day.activity_days_array.length; i++) {
    const element = this.day.activity_days_array[i];
    if (i == j) {
      this.day.activity_days_array.splice(i, 1)
    }
  }

}

isWeekendDirective(day: any) {
  for (let index = 0; index < this.day.activity_days_array.length; index++) {
    const element = this.day.activity_days_array[index];
    console.log(element)
    if(element.activity_id == 14){
      return "bg-malattia"
    }
    if(element.activity_id == 15){
      return "bg-ferie"
    }
  }
  day = new Date(day)
  if (day.getDay() == 0 || day.getDay() == 6) {
    return 'bg-holiday text-red'
  } else {
    return ''
  }
}
}
