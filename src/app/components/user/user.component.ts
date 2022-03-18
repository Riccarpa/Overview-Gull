import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { ProductService } from 'src/app/shared/services/product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
{}
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(private productService: ProductService,private uService:UserService,private route:Router, private modalService: NgbModal,private toastr: ToastrService) { }
 
  users:User[]
  isCreate=false
  products$: any;
  confirmResut;
  profileForm = new FormGroup({
    name: new FormControl('',Validators.required),
    surname: new FormControl('',Validators.required),
    email: new FormControl('',Validators.required),
    password: new FormControl('',Validators.required),
    cost: new FormControl('',Validators.required),
    recruitment_date: new FormControl('',Validators.required),
    week_working_hours: new FormControl('',Validators.required),
  });


  ngOnInit(): void {
    this.uService.getUsers().subscribe(res=>{
      this.users = res.data
      this.products$ = this.users
      console.log(res)
    },(error)=>{
      this.errorBar('You are not logged-in')
      this.route.navigate(['/'])
    })
  }
 
  retrieveUsers(){
    this.uService.getUsers().subscribe(res=>{
      this.users = res.data
      this.products$ = this.users
      console.log(res)
    },(error)=>{
      alert('you are not logged-in')
      this.route.navigate(['/'])
    })
  }
  onSubmit(){
   
    if(this.profileForm.status == 'INVALID'){
     this.warningBar()
    }else{
      this.uService.addUser(this.profileForm.value).subscribe(res=>{
        this.modalService.dismissAll()
        this.successBar(res.data.name) 
      },(error)=>{
        this.errorBar(error.error.message)
      })
    }
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
    .result.then((result) => {
      console.log(result);
    }, (reason) => {
      console.log('Err!', reason);
    });
  }

  successBar(user:any) {
    this.toastr.success(`utente ${user} creato con successo`, 'Success', { timeOut: 3000, closeButton: true, progressBar: true });
    this.retrieveUsers()
  }
  warningBar() {
    this.toastr.warning('All fields are required', 'Warning', { timeOut: 3000, closeButton: true, progressBar: true });
  }
  errorBar(error:any) {
    this.toastr.error(`${error}`, 'Error', { timeOut: 3000, closeButton: true, progressBar: true });
  }
  


  back(){
    this.isCreate = false
  }

}
