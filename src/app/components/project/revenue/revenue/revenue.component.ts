import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
  

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.scss']
})
export class RevenueComponent implements OnInit {

  @Input() project: any;

  revenueArr:any;
  users:any;
  userPayed;
  monthlyCost;

  constructor(private userService: UserService) { }
  

  ngOnInit(): void {
   this.getUsers()
  }

  getUsers(){
    this.userService.getUsers().subscribe((res) => {
      this.users = res.data
      this.createRevenueArr()
    },)
  }

  createRevenueArr(){
    this.revenueArr = []
    this.userPayed = []
    this.monthlyCost = []
    for (const key in this.project.users_costs["costs"]) {
      if (Object.prototype.hasOwnProperty.call(this.project.users_costs["costs"], key)) {
        const element = this.project.users_costs["costs"][key];
        let monthCost = this.project.users_costs["costs"][key].total_cost.toFixed(0) +" € (" + this.project.users_costs["costs"][key].hours + ")"
        this.monthlyCost.push(monthCost)    
        //assegna info utente
        let newElCosts = []
        for (const key2 in element['costs']) {
          if (Object.prototype.hasOwnProperty.call(element['costs'], key2)) {
            const elementCosts = element['costs'][key2];
            for (let j = 0; j < this.users.length; j++) {
              const user = this.users[j];
              if(key2 == user.id){
                if (!this.userPayed.includes(user)) {
                  this.userPayed.push(user);
                }
               elementCosts['name'] = user.name
               elementCosts['surname'] = user.surname
               elementCosts['picture'] = user.picture
               elementCosts['user_id'] = user.id
              }
            }
            newElCosts.push(elementCosts);
          }
        }

        this.revenueArr.push({[key]: newElCosts})

      }
    }


  }

  printKey(key:any){
    return Object.keys(key)[0];
  }

  printRevenue(id:any,item:any,month:any){
    for (let i = 0; i < item[month].length; i++) {
      const element = item[month][i];
      if(element.user_id == id){
        return element.total_cost.toFixed(0) + " € (" + element.hours + ")"  
      }
    }
  }

  printMonthTotalCostforUser(id:any){
    for (const key in this.project.users_costs.total_cost_by_user) {
      if (Object.prototype.hasOwnProperty.call(this.project.users_costs.total_cost_by_user, key)) {
        const element = this.project.users_costs.total_cost_by_user[key];
        if(key == id){
          return  element.total.toFixed(0) + " € (" + element.total_hours + ")"  
        }
      }
    }
  }

  printMonthTotCost(item){
   return item['total_cost']
  }

  printTotCost(){
    return this.project.users_costs['total_cost'].toFixed(0) + " € (" + this.project.users_costs['hours'] + ")"
  }



}
