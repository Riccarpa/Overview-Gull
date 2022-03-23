import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { ProductService } from 'src/app/shared/services/product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(private productService: ProductService,private uService:UserService,private route:Router, private modalService: NgbModal,private toastr: ToastrService) { this.cropperSettings = new CropperSettings();
    // this.cropperSettings.width = 100;
    // this.cropperSettings.height = 100;
    // this.cropperSettings.croppedWidth = 100;
    // this.cropperSettings.croppedHeight = 100;
    // this.cropperSettings.canvasWidth = 400;
    // this.cropperSettings.canvasHeight = 300;
    this.cropperSettings.cropperDrawSettings.lineDash = true;
    this.cropperSettings.cropperDrawSettings.dragIconStrokeWidth = 0;

    this.data = {};}
 
  users:User[]
  filteredUsers;
  searchControl: FormControl = new FormControl();
  confirmResut;
  data: any;
  cropperSettings: CropperSettings;
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

   this.retrieveUsers();

   this.searchControl.valueChanges
    .pipe(debounceTime(200))
    .subscribe(value => {
      this.filerData(value);
    });

    
  }
 
  retrieveUsers(){
    this.uService.getUsers().subscribe(res=>{
      this.users = res.data
      this.filteredUsers = res.data
      // for(let i=0;i<this.users.length;i++){
      //   if(!this.users[i].picture){
      //     this.users[i].picture = `/images/users/${this.users[i].id}`
      //   }
      // }
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
        this.modalService.dismissAll(res.data.name)
      },(error)=>{
        this.errorBar(error.error.message)
      })
    }
  }
  updateImg(){
    let base64WithoutIndex = this.data.image.replace('data:image/jpeg;base64,', '');
    this.profileForm.value.picture_data = base64WithoutIndex;
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
    .result.then((result) => {
      console.log(result);
    }, (reason) => {
      if(reason){
        this.successBar(reason)
        this.retrieveUsers()
      }
    });
  }

  successBar(user:any) {
    this.toastr.success(`utente ${user} creato con successo`, 'Success', { timeOut: 3000, closeButton: true, progressBar: true });
  }
  warningBar() {
    this.toastr.warning('All fields are required', 'Warning', { timeOut: 3000, closeButton: true, progressBar: true });
  }
  errorBar(error:any) {
    this.toastr.error(`${error}`, 'Error', { timeOut: 3000, closeButton: true, progressBar: true });
  }
  
  filerData(val) {
    if (val) {
      val = val.toLowerCase();
    } else {
      return this.filteredUsers = [...this.users];
    }

    const columns = Object.keys(this.users[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.users.filter(function(d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.filteredUsers = rows;
  }



  

}
