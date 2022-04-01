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
  ngOnInit(): void {
    this.uService.retrieveUser(this.id).subscribe((res:any)=>{
      this.user = res.data;
      console.log('user',this.user)
    })
    this.aService.getActivities().subscribe((res:any)=>{
      this.activities = res.data;
      console.log('activities',this.activities)
    })
  }
  

}
