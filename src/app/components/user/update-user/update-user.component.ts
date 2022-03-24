import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user.model';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
  constructor(private uService:UserService,private route:ActivatedRoute,private location:Location, private fb: FormBuilder,
    private toastr: ToastrService, private modalService: NgbModal,private router:Router) {
      this.cropperSettings = new CropperSettings();
      this.cropperSettings.cropperDrawSettings.lineDash = true;
      this.cropperSettings.cropperDrawSettings.dragIconStrokeWidth = 0;
      this.data = {};
     }
  
  id = this.route.snapshot.paramMap.get('id');
  user:User
  profileForm:any
  formBasic: FormGroup;
  loading: boolean;
  radioGroup: FormGroup;
  confirmResut;
  data: any;
  cropperSettings: CropperSettings;

  ngOnInit(): void {
    this.retrieveUser()
    this.buildFormBasic();
    this.radioGroup = this.fb.group({
      radio: []
    });
  }

  
  
  retrieveUser(){
    this.uService.retrieveUser(this.id).subscribe((res:any)=>{
      this.user = res.data;
      if(this.user.picture){
        this.user.picture =  `http://80.211.57.191/images/users/${this.user.id}.png?r=${this.randomNumber()}`
      }
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
  
  deleteUser(){
    this.uService.deleteUser(this.id).subscribe(res=>{
      this.modalService.dismissAll()
      this.toastr.success('Profile deleted', 'Success!', {progressBar: true});
      setTimeout(() => {
        this.back()
      }, 1000);
    },(error)=>{
      this.toastr.error(error.error.message,'Error!',{progressBar: true});
    });
  }
  
  // update user
  onSubmit(){
    this.loading = true;
    this.uService.updateUser(this.profileForm.value,this.id).subscribe(res=>{
      this.loading = false;
      this.toastr.success('Profile updated.', 'Success!', {progressBar: true});
      setTimeout(() => {
        this.router.navigate(['home/user'])
      }, 1000);
    },(error)=>{
      this.toastr.error(error.error.message,'Error!',{progressBar: true});
      this.loading = false
    });
    
  }
  updateImg(){
    
    this.modalService.dismissAll();
    let base64JpgWithoutIndex;
    let base64PngWithoutIndex;
    if(this.data.image.includes('data:image/jpeg;base64,')){
      base64JpgWithoutIndex = this.data.image.replace('data:image/jpeg;base64,', '');
      this.profileForm.value.picture_data = base64JpgWithoutIndex;
    }else{
      base64PngWithoutIndex = this.data.image.replace('data:image/png;base64,', '');
      this.profileForm.value.picture_data = base64PngWithoutIndex;
    }
    
    
    this.uService.updateImage(this.profileForm.value.picture_data,this.user.id).subscribe(res=>{
      console.log(res)
      this.user.picture =  `http://80.211.57.191/images/users/${this.user.id}.png?r=${this.randomNumber()}`
      })
  }
  
  
  // modals
  confirm(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
    .result.then((result) => {
      this.confirmResut = `Closed with: ${result}`;
    }, (reason) => {
      this.confirmResut = `Dismissed with: ${reason}`;
    });
  }
  open(modal) {
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
    .result.then((result) => {
      console.log(result);
    }, (reason) => { });
  }
  
  buildFormBasic() {
    this.formBasic = this.fb.group({
      experience: []
    });
  }
  back(){
    this.location.back()
  }
    randomNumber(){
    let num = Math.floor(Math.random()*100000)
    return num.toString()
  }
}
