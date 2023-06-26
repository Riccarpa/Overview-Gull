import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { ProductService } from 'src/app/shared/services/product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { environment } from 'src/environments/environment';
import { ClientService } from 'src/app/services/client/client.service';
import { ProjectService } from 'src/app/services/project/project.service';
import { ReqInterceptInterceptor } from 'src/app/services/interceptors/req-intercept.interceptor';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(
    private productService: ProductService,
    private uService:UserService,
    private route:Router, 
    private modalService: NgbModal,
    private toastr: ToastrService,
    private clientService:ClientService,
    private pService:ProjectService,
    private interc:ReqInterceptInterceptor
  ){
    this.cropperSettings = new CropperSettings();
      this.cropperSettings.rounded = true
      this.cropperSettings.showCenterMarker = false
      this.cropperSettings.markerSizeMultiplier = 0.5
      this.data = {};
  }
  
  role:number
  user:any
  users:User[]
  filteredUsers;
  searchControl: FormControl = new FormControl();
  confirmResut;
  data: any;
  cropperSettings: CropperSettings;


  profileForm = new FormGroup({
    name: new FormControl(null,Validators.required),
    surname: new FormControl(null,Validators.required),
    email: new FormControl(null,[Validators.required,Validators.email]),
    password: new FormControl(null,[Validators.required, Validators.minLength(3)]),
    cost: new FormControl(null,Validators.required),
    recruitment_date: new FormControl(null,Validators.required),
    week_working_hours: new FormControl(null,Validators.required),
  });


  ngOnInit(): void {
    this.user = this.interc.takeRole()
    this.role = this.user.role

    if (this.role == 1) {
      
      this.retrieveUsers();
      this.searchControl.valueChanges
       .pipe(debounceTime(200))
       .subscribe(value => {
         this.filerData(value);
       });
   
       this.clientService.idClient = null
    }else{
      this.route.navigate([`home/homeUser/${this.user.id}`])
    }
  }
 
  retrieveUsers(){
    this.uService.getUsers().subscribe(res=>{
      this.users = res.data
      this.filteredUsers = res.data
     
      for(let i=0;i<this.users.length;i++){
        
        
        if(this.users[i].picture && this.users[i].picture.includes('.png') ){
          this.users[i].picture = `${environment.apiURL2}/images/users/${this.users[i].id}.png?r=${this.pService.randomNumber()}`
        }else if(this.users[i].picture && this.users[i].picture.includes('.jpg') ){
          this.users[i].picture = `${environment.apiURL2}/images/users/${this.users[i].id}.jpg?r=${this.pService.randomNumber()}`
        }
      }
    },(error)=>{
      this.toastr.error('You are not logged in','Error',{ timeOut: 3000, closeButton: true})
      this.route.navigate(['/'])
    })
     
  }
  
  // SUBMIT New user Form
  onSubmit(){
   
    if(this.profileForm.status == 'INVALID'){
      this.toastr.warning('All fields are required', 'Warning', { timeOut: 3000, closeButton: true});
     
    }else{
      this.uService.addUser(this.profileForm.value).subscribe(res=>{
        this.modalService.dismissAll(res.data.name)
        this.route.navigate(["home/user/", res.data.id]);
      },(error)=>{
        this.toastr.error(error.error.message,'Error', { timeOut: 3000, closeButton: true})
      })
    }

  }
  
  
  updateImg(){
    let base64JpgWithoutIndex;
    let base64PngWithoutIndex;
    if(this.data.image == undefined){
      this.toastr.error('Select a valid image','Error', { timeOut: 3000, closeButton: true})
    }else{

      if(this.data.image.includes('data:image/jpeg;base64,')){
        base64JpgWithoutIndex = this.data.image.replace('data:image/jpeg;base64,', '');
        this.profileForm.value.picture_data = base64JpgWithoutIndex;
      }else{
        base64PngWithoutIndex = this.data.image.replace('data:image/png;base64,', '');
        this.profileForm.value.picture_data = base64PngWithoutIndex;
      }
    }
  }

  // modal and alerts
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
    .result.then((result) => {
    }, (reason) => {
      if(reason){
      
        this.toastr.success(`User ${reason} created successfully`,'Success', { timeOut: 3000, closeButton: true, progressBar: true })
        this.retrieveUsers()
      }
    });
  }

   
  // filter user data table
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
        
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.filteredUsers = rows;
  }

 
  goToFinancial(id:any){
    this.route.navigate([`home/financial/${id}`])
  }

  goToShowFinancial(id: any) {
    this.route.navigate([`home/showFinancial/${id}`]);
  }

  goToTrello(id:any){
    this.route.navigate([`home/trello/${id}`])
  }
  
}
