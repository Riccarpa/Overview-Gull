import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user.model';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';


@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
  constructor(private uService:UserService,private route:ActivatedRoute,private location:Location, private fb: FormBuilder,
    private toastr: ToastrService, private modalService: NgbModal) {

      this.cropperSettings = new CropperSettings();
      // this.cropperSettings.width = 100;
      // this.cropperSettings.height = 100;
      // this.cropperSettings.croppedWidth = 100;
      // this.cropperSettings.croppedHeight = 100;
      // this.cropperSettings.canvasWidth = 400;
      // this.cropperSettings.canvasHeight = 300;
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

  
  buildFormBasic() {
    this.formBasic = this.fb.group({
      experience: []
    });
  }

  submit() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.toastr.success('Profile updated.', 'Success!', {progressBar: true});
    }, 3000);
  }

  onSubmit(){
    this.loading = true;
    this.uService.updateUser(this.profileForm.value,this.id).subscribe(res=>{
      this.loading = false;
      this.toastr.success('Profile updated.', 'Success!', {progressBar: true});
      setTimeout(() => {
        this.back()
      }, 3000);
    },(error)=>{
      this.toastr.error(error.error.message,'Error!',{progressBar: true});
      this.loading = false
    });
    
  }
  retrieveUser(){
    this.uService.retrieveUser(this.id).subscribe((res:any)=>{
      this.user = res.data;
      if(!this.user.picture){

        this.user.picture = `/images/users/${this.user.id}`
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
      this.data.image = `http://80.211.57.191/${this.user.picture}`
    })
  }
  deleteUser(){
    this.uService.deleteUser(this.id).subscribe(res=>{
      this.modalService.dismissAll()
      this.toastr.success('Profile deleted', 'Success!', {progressBar: true});
      setTimeout(() => {
        this.back()
      }, 3000);
    },(error)=>{
      this.toastr.error(error.error.message,'Error!',{progressBar: true});
    });
  }
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
    }, (reason) => {
    
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
    // if(base64JpgWithoutIndex){
    // }
    // if(base64PngWithoutIndex){
    // }
    
  }
  
  back(){
    this.location.back()
  }
}
