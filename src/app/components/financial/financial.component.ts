import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { el } from 'date-fns/locale';
import Holidays from 'date-holidays';
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

  constructor(private inter: ReqInterceptInterceptor, private toastr: ToastrService, private fService: FinancialService, private uService: UserService, private route: ActivatedRoute, private aService: ActivitiesService, private fb: FormBuilder) {
    this.allActivities = []
    // let hd = new Holidays('IT') todo: da fare in futuro
    // let holidays = hd.getHolidays(this.year)
    // let holidayDates = []
    // holidays.forEach(element => {
    //   holidayDates.push(element.date)
    // });
    // console.log(holidays, "holidays");
  }

  id = this.route.snapshot.paramMap.get('id');
  user: any
  activities: any
  monthlyLogs: any
  month: any
  year: any
  currMonthLog: any
  days: any
  monthAndYear: any
  allActivities: Array<Object>
  isSaved = false
  isAdmin: boolean
  projects: any
  dayIds: any[] = [] // array of day ids
  bulkActivities = this.fb.group({
    activity_id: [],
    hours_spent: [8],
    activity_type: []
  })
  workedDays:number = 0
  ferie:number = 0 
  malattia:number = 0
  workDays:number = 0


  ngOnInit(): void {
    this.month = new Date().getMonth() + 1
    this.year = new Date().getFullYear()

    this.uService.retrieveUser(this.id).subscribe((res: any) => {
      this.user = res.data;

    }, (error) => {
      this.toastr.error(error.error.message);
    })

    this.aService.getActivities().subscribe((res: any) => {
      this.activities = res.data;

    }, (error) => {
      this.toastr.error(error.error.message);
    })




    
    if (this.inter.takeRole().role == 1 || this.inter.takeRole().role == 2) {
      this.uService.getUserProjectForFinancial(this.id).subscribe((res: any) => {
        this.projects = res.data;
  
      }, (error) => {
        this.toastr.error(error.error.message);
      })
    }else{
      this.uService.getUserProject().subscribe((res: any) => {
        this.projects = res.data;
  
      }, (error) => {
        this.toastr.error(error.error.message);
      })
    }

    if (this.inter.takeRole().role !== 1) {
      this.isAdmin = false
      this.fService.getUserMonthlyLogs().subscribe((res) => {
        this.monthlyLogs = res.data;
        this.getCurrMonthLog();
      })
    } else {
      this.isAdmin = true
      this.fService.getMonthlyLogs(this.id).subscribe((res) => {
        this.monthlyLogs = res.data;

        this.getCurrMonthLog();
      })
    }

  }

  isWeekend() {
    console.log(this.days)
    this.days?.forEach(day => {
      let newDate = new Date(day.date)
      if (newDate.getDay() == 0 || newDate.getDay() == 6) {
        return true
      } else {
        this.workDays++
        return false
      }
    });

    
  }
  

  selectAll(event) {
    if (event.target.checked) {
      
      this.days?.forEach(day => {
        let newDte = new Date(day.date)
        if (newDte.getDay() !== 0 && newDte.getDay() !== 6) {
          this.dayIds.push(day.id)
        }
      });
      this.fService.selectAllDaysEvent(this.dayIds)
    } else {
      this.dayIds = []
      this.fService.selectAllDaysEvent(this.dayIds)
    }
  }

  getCurrMonthLog() {

    this.ferie = 0
    this.malattia = 0
    this.workedDays = 0
    this.workDays = 0

    if (this.monthlyLogs[this.year] && this.monthlyLogs[this.year][this.month]) {
      this.currMonthLog = this.monthlyLogs[this.year][this.month]
      this.days = this.monthlyLogs[this.year][this.month].daily_logs_array

    } else {
      if (this.month < 10) {
        var date = `${this.year.toString()}-0${this.month.toString()} `
      } else {
        var date = `${this.year.toString()}-${this.month.toString()} `
      }

      if (!this.isAdmin) {
        this.fService.createMonthlyLog(parseInt(this.id), date).subscribe((res) => {
          this.currMonthLog = res.data;
          this.days = res.data.daily_logs_array
          this.fService.getUserMonthlyLogs().subscribe((res) => {
            this.monthlyLogs = res.data;
          })
        }, (error) => {
          this.toastr.error(error.error.message);
        })

      } else {
        this.fService.createMonthlyLogforAdmin(parseInt(this.id), date).subscribe((res) => {
          this.currMonthLog = res.data;
          this.days = res.data.daily_logs_array
          this.fService.getMonthlyLogs(this.id).subscribe((res) => {
            this.monthlyLogs = res.data;
          })
        }, (error) => {
          this.toastr.error(error.error.message);
        })
      }
    }
    this.isWeekend()

    this.assignFerieWorkedMalattia(this.currMonthLog['daily_logs_array'])
    
  }

  assignFerieWorkedMalattia(arr:any){
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      for (let j = 0; j < element['activity_days_array'].length; j++) {
        const elementt = element['activity_days_array'][j];
        if(elementt.activity_id == 13){
          this.ferie++
          break
        }else if(elementt.activity_id == 14){
          this.malattia++
          break
        }else{
          this.workedDays++
          break

        }
      }
    }
  }






  prevMonth() {
    this.days = null
    if (this.month <= 1) {
      this.month = 12
      this.year = this.year - 1
    } else {

      this.month = this.month - 1
    }
    this.getCurrMonthLog();
  }
  nextMonth() {
    this.days = null

    if (this.month >= 12) {
      this.month = 1
      this.year = this.year + 1
    } else {
      this.month = this.month + 1
    }
    this.getCurrMonthLog();
  }

  // child activities data trigger and catcher

  save() {
    this.fService.sendClickEvent();
    this.isSaved = true
    this.confirm()
  }
  childsData(data: object) {
    this.allActivities.push(data)
  }

  isChecked(id: number) { // check if day is checked 
    if (!this.dayIds.includes(id)) {
      this.dayIds.push(id)
    } else {
      this.dayIds.splice(this.dayIds.indexOf(id), 1)
    }
  }

  // all activities patch 

  confirm() {
    for (let i = 0; i < this.allActivities.length; i++) {
      const element = this.allActivities[i];
      for (let j = 0; j < element['activity_days_array'].length; j++) {
        const elementt = element['activity_days_array'][j];
        if(!elementt.hours_spent){
          this.toastr.error('Tutte le attivita devono avere un ammontare di ore specificato');
          this.allActivities = []
          this.isSaved = false
          return
        }
      }
    }
    this.fService.patchActivities(this.currMonthLog.id, this.allActivities).subscribe((res) => {
      this.toastr.success('Activities saved succefully', 'Success!', { progressBar: true });
      setTimeout(() => {
        window.location.reload()
      }, 1500);
    }, (error) => {
      this.allActivities = []
      this.isSaved = false
      this.toastr.error(error.error.message);
    })
  }

  onSelectChange(event: any) { // bulk activities patch 
    this.bulkActivities.patchValue({
      activity_id: event.target.value,
      hours_spent: 8,
      activity_type: event.target.selectedOptions[0].dataset.type == 'project' ? 'project' : 'generic'
    })
  }

  // send array of day ids and bulk activities value to service subject 
  bulkSave() {
    this.fService.addClickEvent(this.dayIds, this.bulkActivities.value);
    this.dayIds = []
  }
}
