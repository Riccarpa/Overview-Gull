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

  constructor(private financialService: FinancialService, private userService: UserService, private route: ActivatedRoute, private activitiesService: ActivitiesService) { }

  ngOnInit(): void {
    this.month = new Date().getMonth() + 1;
    this.year = new Date().getFullYear();

    this.userService.retrieveUser(this.id).subscribe((res: any) => {
      this.user = res.data;
    })

    this.activitiesService.getActivities().subscribe((res: any) => {
      this.activities = res.data;
    })

    this.financialService.getMonthlyLogs(this.id).subscribe((res) => {
      this.monthlyLogs = res.data;
      this.getCurrentMonthLog();
    })
    console.log(typeof this.month)
    console.log(typeof this.year)
  }

  id = this.route.snapshot.paramMap.get('id');
  user: any;
  activities: any;
  monthlyLogs: any;
  month: any;
  year: any;
  currentMonthLog: any;
  days: any;

  getCurrentMonthLog() {
    if (this.monthlyLogs[this.year] && this.monthlyLogs[this.year][this.month]) {
      this.currentMonthLog = this.monthlyLogs[this.year][this.month];
      console.log('currMonthLogs', this.currentMonthLog);
      this.days = this.monthlyLogs[this.year][this.month].daily_logs_array;
      console.log('dailyLogs', this.days);
    } else {
      this.currentMonthLog = null;
      this.days = null;
    }
  }

  prevMonth() {
    this.days = null;
    if (this.month == 1) {
      this.month = 12;
      this.year = this.year - 1;
    } else {
      this.month = this.month - 1;
    }
    this.getCurrentMonthLog();
  }

  nextMonth() {
    this.days = null;
    if (this.month == 12) {
      this.month = 1;
      this.year = this.year + 1;
    } else {
      this.month = this.month + 1;
    }
    this.getCurrentMonthLog();
  }

  getMonthName() {
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return month[this.month - 1];
  }

}
