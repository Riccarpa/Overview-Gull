import { Component, OnInit,Input } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit {

  constructor(private fb:FormBuilder) { }

  @Input() day : any
  @Input() activities :any
  ngOnInit(): void {
    
  }

  activitiesForm=this.fb.group({
    activitiesArray:this.fb.array([])
  })
  get activitiesArray(){
    return this.activitiesForm.controls['activitiesArray'] as FormArray;
  }
  addActivity(){
    

      const activityForm=this.fb.group({
        activities:[{
          "activity_id":1,
          "hours":0
        }],
       
      })
      this.activitiesArray.push(activityForm);
    console.log(this.activitiesArray.controls)
  }
  deleteActivity(i){
    this.activitiesArray.removeAt(i)
  }









  loadingButtons = [
    {
      name: 'secondary',
      loading: false,
    }
  ]
  showLoading(btn) {
    btn.loading = true;
    setTimeout(() => {
      btn.loading = false;
    }, 3000);
  }

}
