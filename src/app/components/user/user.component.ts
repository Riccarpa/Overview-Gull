import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  users:User[]
  isCreate=false
  
  constructor(private uService:UserService,private route:Router) { }

  ngOnInit(): void {
    this.uService.getUsers().subscribe(res=>{
      this.users = res.data
      console.log(res)
    },(error)=>{
      alert('you are not logged-in')
      this.route.navigate(['/'])
    })
    
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
