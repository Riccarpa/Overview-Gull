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
    console.log(this.project.users_costs)
    console.log(this.project.user_details)

  }

}
