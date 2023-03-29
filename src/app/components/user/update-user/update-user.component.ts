import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user.model';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ProjectService } from 'src/app/services/project/project.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
  constructor(private uService:UserService,private route:ActivatedRoute,private location:Location, private fb: FormBuilder,
    private toastr: ToastrService, private modalService: NgbModal,private router:Router,private pService:ProjectService) {
      this.cropperSettings = new CropperSettings();
      this.cropperSettings.rounded = true
      this.cropperSettings.showCenterMarker = false
      this.cropperSettings.markerSizeMultiplier = 0.5
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
            if(this.user.picture == null){
              this.deleteImg()
            }else{
              if(this.user.picture && this.user.picture.includes('.png') ){
                this.user.picture = `${environment.apiURL2}/images/users/${res.data.id}.png?r=${this.pService.randomNumber()}`
              }else{
                this.user.picture = `${environment.apiURL2}/images/users/${res.data.id}.jpg?r=${this.pService.randomNumber()}`
              }
            }
      this.profileForm = new FormGroup({
        name: new FormControl(this.user.name, Validators.required),
        surname: new FormControl(this.user.surname, Validators.required),
        role: new FormControl(this.user.role),
        serial_number: new FormControl(this.user.serial_number),
        email: new FormControl(this.user.email, [Validators.required, Validators.email]),
        cost: new FormControl(this.user.cost),
        recruitment_date: new FormControl(this.user. recruitment_date, Validators.required),
        week_working_hours: new FormControl(this.user.week_working_hours, Validators.required),
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
      this.toastr.error(error.error.message);
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
      this.toastr.error(error.error.message);
      this.loading = false
    });
    
  }
  updateImg(){
    
    this.modalService.dismissAll();
    let base64JpgWithoutIndex;
    let base64PngWithoutIndex;


    if(this.data.image == undefined){
      this.toastr.error('Select a valid image')
    }else{

      if(this.data.image.includes('data:image/jpeg;base64,')){
        base64JpgWithoutIndex = this.data.image.replace('data:image/jpeg;base64,', '');
        this.profileForm.value.picture_data = base64JpgWithoutIndex;
      }else{
        base64PngWithoutIndex = this.data.image.replace('data:image/png;base64,', '');
        this.profileForm.value.picture_data = base64PngWithoutIndex;
      }

      this.uService.updateImage(this.profileForm.value.picture_data,this.user.id).subscribe(res=>{
       
        this.user.picture =  `${environment.apiURL2}/images/users/${this.user.id}.png?r=${this.pService.randomNumber()}`
        this.toastr.success('Image saved successfully')
        })
    }
  
    
    
  }

  deleteImg(){
    // this.uService.deleteImage().subscribe(res =>{
    //   const reader = new FileReader();
    //     reader.onloadend = () => {
    //       const base64String: string = reader.result as string;
    //       this.uService.updateImage(base64String.replace('data:image/png;base64,', ''),this.user.id).subscribe(res=>{
    //         this.user.picture =  `${environment.apiURL2}/images/users/${this.user.id}.png?r=${this.pService.randomNumber()}`
    //         })
    //     };
    //     reader.readAsDataURL(res);
    //     this.modalService.dismissAll()    })
        let img="data:image/png;base64,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"
        this.uService.updateImage(img.replace('data:image/png;base64,', ''),this.user.id).subscribe(res=>{
                  this.user.picture =  `${environment.apiURL2}/images/users/${this.user.id}.png?r=${this.pService.randomNumber()}`
                  
        })
        this.modalService.dismissAll()
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
    
  
}
