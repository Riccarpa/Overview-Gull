import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user.model';
import { FormGroup,FormControl } from '@angular/forms';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
  constructor(private uService:UserService,private route:ActivatedRoute,private location:Location) { }
  
  id = this.route.snapshot.paramMap.get('id');
  user:User
  profileForm:any

  ngOnInit(): void {
    this.uService.retrieveUser(this.id).subscribe((res:any)=>{
      this.user = res.data;
      this.profileForm = new FormGroup({
        name: new FormControl(this.user.name),
        surname: new FormControl(this.user.surname),
        role: new FormControl(this.user.role),
        serial_number: new FormControl(this.user.serial_number),
        email: new FormControl(this.user.email),
        cost: new FormControl(this.user.cost),
        recruitment_date: new FormControl(this.user. recruitment_date),
        week_working_hours: new FormControl(this.user.week_working_hours),
      })
    })
  }
  onSubmit(){
  
    this.uService.updateUser(this.profileForm.value,this.id).subscribe(res=>{
      alert('User updated successfully');
      this.location.back()
    },(error)=>{
      alert(error.error.message)
    });
    
  }
  deleteUser(){
    this.uService.deleteUser(this.id).subscribe(res=>{
      alert('User deleted successfully');
      this.location.back()
    },(error)=>{
      alert(error.error.message)
    });
  }
  back(){
    this.location.back()
  }

}
