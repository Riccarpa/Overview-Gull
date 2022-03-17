import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { echartStyles } from 'src/app/shared/echart-styles';
import { ProductService } from 'src/app/shared/services/product.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  users:User[]
  isCreate=false

  
  chartPie1: any;
  chartLineOption3: any;
  products$: any;
  
  constructor(private productService: ProductService,private uService:UserService,private route:Router) { }

  ngOnInit(): void {
    this.uService.getUsers().subscribe(res=>{
      this.users = res.data
      this.products$ = this.users
      console.log(res)
    },(error)=>{
      alert('you are not logged-in')
      this.route.navigate(['/'])
    })

    this.chartPie1 = {
      ...echartStyles.defaultOptions, ...{
        legend: {
          show: true,
          bottom: 0,
        },
        series: [{
          type: 'pie',
          ...echartStyles.pieRing,

          label: echartStyles.pieLabelCenterHover,
          data: [{
            name: 'Completed',
            value: 80,
            itemStyle: {
              color: '#663399',
            }
          }, {
            name: 'Pending',
            value: 20,
            itemStyle: {
              color: '#ced4da',
            }
          }]
        }]
      }
    };

    this.chartLineOption3 = {
      ...echartStyles.lineNoAxis, ...{
        series: [{
          data: [40, 80, 20, 90, 30, 80, 40],
          lineStyle: {
            color: 'rgba(102, 51, 153, .86)',
            width: 3,
            shadowColor: 'rgba(0, 0, 0, .2)',
            shadowOffsetX: -1,
            shadowOffsetY: 8,
            shadowBlur: 10
          },
          label: { show: true, color: '#212121' },
          type: 'line',
          smooth: true,
          itemStyle: {
            borderColor: 'rgba(69, 86, 172, 0.86)'
          }
        }]
      }
    };
    this.chartLineOption3.xAxis.data = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    

    this.chartPie1 = {
      ...echartStyles.defaultOptions, ...{
        legend: {
          show: true,
          bottom: 0,
        },
        series: [{
          type: 'pie',
          ...echartStyles.pieRing,

          label: echartStyles.pieLabelCenterHover,
          data: [{
            name: 'Completed',
            value: 80,
            itemStyle: {
              color: '#663399',
            }
          }, {
            name: 'Pending',
            value: 20,
            itemStyle: {
              color: '#ced4da',
            }
          }]
        }]
      }
    };

    this.chartLineOption3 = {
      ...echartStyles.lineNoAxis, ...{
        series: [{
          data: [40, 80, 20, 90, 30, 80, 40],
          lineStyle: {
            color: 'rgba(102, 51, 153, .86)',
            width: 3,
            shadowColor: 'rgba(0, 0, 0, .2)',
            shadowOffsetX: -1,
            shadowOffsetY: 8,
            shadowBlur: 10
          },
          label: { show: true, color: '#212121' },
          type: 'line',
          smooth: true,
          itemStyle: {
            borderColor: 'rgba(69, 86, 172, 0.86)'
          }
        }]
      }
    };
    this.chartLineOption3.xAxis.data = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    

    
    
  }
  
  
  profileForm = new FormGroup({
    name: new FormControl('',Validators.required),
    surname: new FormControl('',Validators.required),
    email: new FormControl('',Validators.required),
    password: new FormControl('',Validators.required),
    cost: new FormControl('',Validators.required),
    recruitment_date: new FormControl('',Validators.required),
    week_working_hours: new FormControl('',Validators.required),
  });

  onSubmit(){
   
    if(this.profileForm.status == 'INVALID'){
     alert('All fields are required') 
    }else{
      this.uService.addUser(this.profileForm.value).subscribe(res=>{
        alert( `utente ${res.data.name} creato con successo`)
        window.location.reload()
      },(error)=>{
        alert(error.error.message)
      })
    }
  }
  back(){
    this.isCreate = false
  }

}
