import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivitiesService } from 'src/app/services/activities/activities.service';
import { FinancialService } from 'src/app/services/financial/financial.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-show-financial',
  templateUrl: './show-financial.component.html',
  styleUrls: ['./show-financial.component.scss']
})
export class ShowFinancialComponent implements OnInit {

  constructor(private financialService: FinancialService, private userService: UserService, private route: ActivatedRoute, private aService: ActivitiesService) { }

  ngOnInit(): void {
    this.month = new Date().getMonth() + 1;
    this.year = new Date().getFullYear();

    this.userService.retrieveUser(this.id).subscribe((res: any) => {
      this.user = res.data;
    })

    this.aService.getActivities().subscribe((res: any) => {
      this.activities = res.data;
    })

    this.financialService.getMonthlyLogs(this.id).subscribe((res) => {
      this.monthlyLogs = res.data;
      console.log('monthlyLogs', this.monthlyLogs)
      this.getCurrMonthLog();
    })
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

  getCurrMonthLog() {
    if (this.monthlyLogs[this.year] && this.monthlyLogs[this.year][this.month]) {
      this.currMonthLog = this.monthlyLogs[this.year][this.month]
      console.log('currMonthLogs', this.currMonthLog)
      this.days = this.monthlyLogs[this.year][this.month].daily_logs_array
      console.log('dailyLogs', this.days)
    } else {
      if (this.month < 10) {
        var date = `${this.year.toString()}-0${this.month.toString()} `
      } else {
        var date = `${this.year.toString()}-${this.month.toString()} `
      }
      this.financialService.createMonthlyLog(parseInt(this.id), date).subscribe((res) => {
        this.currMonthLog = res.data;
        this.days = res.data.daily_logs_array
      })
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

}
