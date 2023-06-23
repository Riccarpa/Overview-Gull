import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.scss']
})
export class RevenueComponent implements OnInit {

  @Input() project: any;
  revenueArr:any;

  constructor() { }

  

  ngOnInit(): void {
    this.createRevenueArr()
  }

  createRevenueArr(){
    this.revenueArr = []
    for (const key in this.project.users_costs["total_cost_by_user"]) {
      if (Object.prototype.hasOwnProperty.call(this.project.users_costs["total_cost_by_user"], key)) {
        const element = this.project.users_costs["total_cost_by_user"][key];

        for (let j = 0; j < this.project.user_details.length; j++) {
          const user = this.project.user_details[j];
          if(key == user.id){
            const newCostEl = {"name":user.name,"surname":user.surname,"total_hours":element.total_hours,"total":element.total}
            this.revenueArr.push(newCostEl)
          }
        }
      }
    }
    console.log(this.revenueArr)
  }

   



}
