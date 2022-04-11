import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project/project.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.component.html',
  styleUrls: ['./home-user.component.scss']
})
export class HomeUserComponent implements OnInit {

 
  userId:any
  user:any
  url= environment.apiURL2
  constructor(private uService: UserService, private pService: ProjectService, private active: ActivatedRoute) { }

  ngOnInit(): void {

    if (!this.userId) {
      this.userId = this.active.snapshot.paramMap.get('id')
    }

    this.uService.retrieveUser(this.userId).subscribe(
      (res)=>{
        this.user = res
        this.user = this.user.data
        console.log(this.user);
        
      }
    )
  }
}
